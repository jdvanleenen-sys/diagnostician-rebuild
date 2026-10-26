#!/usr/bin/env node
// verify.mjs - mechanical audit of this bundle's artifacts.
//
// Runs offline: Node.js standard library only, no API key, no network.
//
// What it checks (and what it honestly cannot):
//
//   1. skeleton-no-fix        - the output format in rules.md Step 6 carries
//      exactly the six sections of a diagnosis (DEATH TYPE, LAYER, PRIMARY
//      CAUSE, EVIDENCE CHAIN, RULED OUT, CONFIDENCE) and no section a fix
//      could live in.
//   2. example-discipline     - every fenced diagnosis block in examples.md
//      carries the required sections; a refusal block (Case 4 pattern)
//      carries no PRIMARY CAUSE at all. Split diagnoses each carry their own
//      RULED OUT, as rules.md Step 5 requires.
//   3. one-cause-discipline   - each diagnosis block names exactly one
//      PRIMARY CAUSE and at most one secondary.
//   4. no-prescription-scan   - no prescription phrasing ("you should",
//      "the fix is", "i recommend", ...) inside any diagnosis/refusal block
//      or below the verbatim line of any preserved receipt. A remedy phrased
//      in entirely novel words is beyond any string check; that seam is
//      stated, not hidden.
//   5. no-em-dash             - rules.md forbids em dashes in output; none
//      may appear in a diagnosis block or receipt transcript, except
//      occurrences confessed and counted in EM_DASH_ALLOWED.
//   6. count-consistency      - every "N worked diagnoses" claim in
//      README.md and SKILL.md equals the number of "## Case" headings in
//      examples.md, and every file the README's Files table names exists.
//   7. receipt-integrity      - every receipt in tests/receipts/ matches its
//      SHA-256 in SHA256SUMS (computed over LF-normalized bytes so git
//      line-ending conversion cannot fake or hide drift), no receipt exists
//      outside the manifest, and each receipt's structure matches the pinned
//      expectations in RECEIPT_EXPECT (round 1 delivers exactly one PRIMARY
//      CAUSE; the refusal round delivers none).
//
// This audits the ARTIFACTS, not the runtime: the rules are prose, and no
// script can prove a live session obeys them. The live evidence is in
// tests/receipts/ (preserved verbatim transcripts).
//
// Usage:
//   node tests/verify.mjs             # audit the bundle (exit 0 = green)
//   node tests/verify.mjs --selftest  # prove the verifier can fail:
//                                     # planted-bad fixtures MUST fail

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const RULES = join(ROOT, "rules.md");
const EXAMPLES = join(ROOT, "examples.md");
const README = join(ROOT, "README.md");
const SKILL = join(ROOT, "SKILL.md");
const RECEIPTS = join(ROOT, "tests", "receipts");
const FIXTURES = join(ROOT, "tests", "fixtures");

const EM_DASH = "—";

const PRESCRIPTION_PHRASES = [
  "you should",
  "you might consider",
  "the fix is",
  "to fix this",
  "i recommend",
  "here's how to",
  "here is how to",
  "consider adding",
  "start by",
  "the good news",
  "my suggestion",
  "what i would do",
];

// Confessed occurrences that stay in a receipt because receipts are never
// edited (method in tests/receipts/README.md). Exact in both directions:
// a new occurrence fails, and so does quietly removing a confessed one.
const EM_DASH_ALLOWED = {}; // e.g. { "round-1-output.md": 2 }
const PRESCRIPTION_ALLOWED = {}; // e.g. { "round-1-output.md": ["the fix is"] }

// Pinned structural expectations per receipt output. A diagnosis round
// delivers exactly one PRIMARY CAUSE; a refusal round delivers none.
const RECEIPT_EXPECT = {
  "round-1-output.md": { primaryCause: 1 },
  "round-2-output.md": { primaryCause: 0 },
};

const VERBATIM_MARKER = "VERBATIM OUTPUT BELOW";

const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

let failures = [];
const fail = (check, msg) => failures.push(`[${check}] ${msg}`);
const read = (p) => readFileSync(p, "utf-8");
const normBytes = (p) =>
  readFileSync(p).toString("binary").replaceAll("\r\n", "\n");
const sha256norm = (p) =>
  createHash("sha256").update(Buffer.from(normBytes(p), "binary")).digest("hex");

function fencedBlocks(text) {
  // All plain ``` fenced blocks (not language-tagged ones).
  const blocks = [];
  let inside = false;
  let keep = false;
  let buf = [];
  for (const line of text.split("\n")) {
    const stripped = line.trim();
    if (stripped.startsWith("```")) {
      if (!inside) {
        inside = true;
        keep = stripped === "```";
        buf = [];
      } else {
        inside = false;
        if (keep) blocks.push(buf.join("\n"));
      }
      continue;
    }
    if (inside) buf.push(line);
  }
  return blocks;
}

const isDiagnosis = (b) => b.includes("PRIMARY CAUSE");
const isRefusal = (b) =>
  b.includes("WHY THIS IS NOT A DIAGNOSIS") ||
  b.split("\n", 1)[0].includes("Undetermined");

const countOf = (text, needle) => text.split(needle).length - 1;

// ---------------------------------------------------------------- checks

function checkSkeleton(rulesText, label = "skeleton-no-fix") {
  const blocks = fencedBlocks(rulesText).filter((b) => b.includes("DEATH TYPE"));
  if (blocks.length === 0) {
    fail(label, "rules.md Step 6 format block not found");
    return;
  }
  const skeleton = blocks[0];
  for (const section of ["DEATH TYPE", "LAYER", "PRIMARY CAUSE",
                         "EVIDENCE CHAIN", "RULED OUT", "CONFIDENCE"]) {
    if (!skeleton.includes(section)) {
      fail(label, `format block is missing the ${section} section`);
    }
  }
  for (const banned of ["FIX", "REMEDY", "RECOMMENDATION", "NEXT STEPS",
                        "WHAT TO DO"]) {
    if (new RegExp(`^\\s*${banned}\\b`, "m").test(skeleton)) {
      fail(label, `format block offers a slot a fix could live in: ${banned}`);
    }
  }
}

function checkExampleBlocks(blocks, source, label = "example-discipline") {
  blocks.forEach((block, i) => {
    const where = `${source} block ${i + 1}`;
    if (isRefusal(block)) {
      if (block.includes("PRIMARY CAUSE")) {
        fail(label, `${where}: refusal block names a PRIMARY CAUSE`);
      }
      if (!block.includes("CONFIDENCE")) {
        fail(label, `${where}: refusal block has no CONFIDENCE line`);
      }
      return;
    }
    if (!isDiagnosis(block)) return;
    for (const section of ["DEATH TYPE", "LAYER", "PRIMARY CAUSE",
                           "EVIDENCE CHAIN", "RULED OUT", "CONFIDENCE"]) {
      if (!block.includes(section)) {
        fail(label, `${where}: diagnosis is missing ${section}`);
      }
    }
    const n = countOf(block, "PRIMARY CAUSE");
    if (n !== 1) {
      fail("one-cause-discipline",
        `${where}: ${n} PRIMARY CAUSE sections (exactly 1 required)`);
    }
    if (countOf(block, "SECONDARY CAUSE") > 1) {
      fail("one-cause-discipline", `${where}: more than one SECONDARY CAUSE`);
    }
  });
}

function checkPrescriptions(text, source, allowed = [],
                            label = "no-prescription-scan") {
  const lower = text.toLowerCase();
  for (const phrase of PRESCRIPTION_PHRASES) {
    const count = countOf(lower, phrase);
    const permitted = allowed.filter((a) => a === phrase).length;
    if (count > permitted) {
      fail(label, `${source}: prescription phrasing found: "${phrase}" ` +
                  `x${count} (allowed ${permitted})`);
    } else if (count < permitted) {
      fail(label, `${source}: confessed occurrence of "${phrase}" was ` +
                  `quietly removed (expected ${permitted}, found ${count})`);
    }
  }
}

function checkEmDash(text, source, allowed = 0, label = "no-em-dash") {
  const count = countOf(text, EM_DASH);
  if (count > allowed) {
    fail(label, `${source}: ${count} em dash(es) in output (allowed ${allowed})`);
  } else if (count < allowed) {
    fail(label, `${source}: confessed em dash count dropped from ${allowed} ` +
                `to ${count}; receipts are never edited`);
  }
}

function checkCounts(label = "count-consistency") {
  const actual = (read(EXAMPLES).match(/^## Case /gm) || []).length;
  for (const doc of [README, SKILL]) {
    const text = read(doc).toLowerCase();
    for (const [word, value] of Object.entries(NUMBER_WORDS)) {
      const re = new RegExp(`\\b${word}\\b (?:full )?worked diagnoses`, "g");
      for (const _ of text.matchAll(re)) {
        if (value !== actual) {
          fail(label, `${doc.split(/[\\/]/).pop()} claims ${word} worked ` +
                      `diagnoses; examples.md has ${actual}`);
        }
      }
    }
  }
  // Every file the README Files table names must exist.
  for (const m of read(README).matchAll(/^\| `([^`]+)` \|/gm)) {
    const rel = m[1];
    if (!/\.(md|mjs|py)$/.test(rel)) continue;
    if (!existsSync(join(ROOT, rel))) {
      fail(label, `README Files table names ${rel}, which does not exist`);
    }
  }
}

function checkReceipts(label = "receipt-integrity") {
  const manifestPath = join(RECEIPTS, "SHA256SUMS");
  if (!existsSync(manifestPath)) {
    fail(label, "tests/receipts/SHA256SUMS is missing");
    return;
  }
  const manifest = {};
  for (const line of read(manifestPath).split("\n")) {
    const t = line.trim();
    if (!t) continue;
    const [digest, ...rest] = t.split(/\s+/);
    manifest[rest.join(" ")] = digest.toLowerCase();
  }
  const onDisk = readdirSync(RECEIPTS)
    .filter((n) => /^round-.*\.md$/.test(n))
    .sort();
  for (const name of onDisk) {
    if (!(name in manifest)) {
      fail(label, `${name} exists but is not in SHA256SUMS`);
      continue;
    }
    if (sha256norm(join(RECEIPTS, name)) !== manifest[name]) {
      fail(label, `${name} drifted from its pinned SHA-256`);
    }
  }
  for (const name of Object.keys(manifest)) {
    if (!onDisk.includes(name)) {
      fail(label, `SHA256SUMS lists ${name}, which does not exist`);
    }
  }
  // Structure + output discipline below the verbatim line.
  for (const [name, expect] of Object.entries(RECEIPT_EXPECT)) {
    const path = join(RECEIPTS, name);
    if (!existsSync(path)) {
      fail(label, `expected receipt ${name} is missing`);
      continue;
    }
    const text = read(path);
    if (!text.includes(VERBATIM_MARKER)) {
      fail(label, `${name}: no '${VERBATIM_MARKER}' line; header and ` +
                  `transcript are not separable`);
      continue;
    }
    const body = text.split(VERBATIM_MARKER)[1];
    const n = countOf(body, "PRIMARY CAUSE");
    if (n !== expect.primaryCause) {
      fail(label, `${name}: ${n} PRIMARY CAUSE sections in transcript ` +
                  `(pinned expectation: ${expect.primaryCause})`);
    }
    checkPrescriptions(body, name, PRESCRIPTION_ALLOWED[name] || []);
    checkEmDash(body, name, EM_DASH_ALLOWED[name] || 0);
  }
}

// --------------------------------------------------------------- selftest

function selftest() {
  // The planted-bad fixtures MUST fail their checks. A verifier that
  // cannot fail is a rubber stamp.
  const problems = [];
  const cases = [
    ["bad-fix-appended.md", "no-prescription-scan"],
    ["bad-two-causes.md", "one-cause-discipline"],
    ["bad-em-dash.md", "no-em-dash"],
    ["bad-missing-ruled-out.md", "example-discipline"],
  ];
  for (const [name, expectedCheck] of cases) {
    const path = join(FIXTURES, name);
    if (!existsSync(path)) {
      problems.push(`fixture ${name} is missing`);
      continue;
    }
    failures = [];
    const blocks = fencedBlocks(read(path));
    checkExampleBlocks(blocks, name);
    for (const b of blocks) {
      checkPrescriptions(b, name);
      checkEmDash(b, name);
    }
    if (!failures.some((f) => f.includes(expectedCheck))) {
      problems.push(`fixture ${name} did NOT trip ${expectedCheck}: the ` +
                    `verifier cannot see the defect it was built to see`);
    }
  }
  failures = [];
  if (problems.length) {
    console.log("SELFTEST: RED");
    for (const p of problems) console.log("  -", p);
    return 1;
  }
  console.log("SELFTEST: GREEN - every planted-bad fixture fails its " +
              "check, so a pass on the real bundle means something.");
  return 0;
}

function main() {
  if (process.argv.includes("--selftest")) return selftest();
  checkSkeleton(read(RULES));
  const blocks = fencedBlocks(read(EXAMPLES));
  checkExampleBlocks(blocks, "examples.md");
  for (const b of blocks) {
    if (isDiagnosis(b) || isRefusal(b)) {
      checkPrescriptions(b, "examples.md");
      checkEmDash(b, "examples.md");
    }
  }
  checkCounts();
  checkReceipts();
  if (failures.length) {
    console.log(`RED - ${failures.length} failure(s):`);
    for (const f of failures) console.log("  -", f);
    return 1;
  }
  console.log("GREEN - all checks passed. Scope: artifacts only; the " +
              "runtime is prose-governed and its live evidence is " +
              "tests/receipts/.");
  return 0;
}

process.exit(main());
