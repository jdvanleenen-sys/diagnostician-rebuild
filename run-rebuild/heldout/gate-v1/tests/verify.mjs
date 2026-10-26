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
//      may appear in a diagnosis block or receipt transcript.
//   6. count-consistency      - every "N worked diagnoses" claim in
//      README.md and SKILL.md equals the number of "## Case" headings in
//      examples.md, and every file the README's Files table names exists.
//   7. receipt-integrity      - every receipt in tests/receipts/ matches its
//      SHA-256 in SHA256SUMS (computed over LF-normalized bytes so git
//      line-ending conversion cannot fake or hide drift), no receipt exists
//      outside the manifest, and each receipt's structure matches the pinned
//      expectations in RECEIPT_EXPECT (round 1 delivers exactly one PRIMARY
//      CAUSE; the refusal round delivers none).
//   8. no-remedy-endorsement  - tests/gates/endorsement.mjs (feedback.md F1):
//      no clause of a receipt output or of examples.md judges the owner's
//      candidate fixes.
//   9. quote-anchor           - tests/gates/quote-anchor.mjs (feedback.md F2):
//      every quoted span of a receipt output occurs byte for byte in that
//      round's pinned input.
//
// Checks 8 and 9 are gates: each exports LABEL, TAG, scan(armRoot) -> items,
// summary(items) -> one line and selftest(fixturesDir) -> rows. This file
// loops over GATES and knows nothing of their insides. There is no list of
// excused occurrences anywhere: receipts are never edited, so what the gates
// find in them stays red. --selftest also proves the wiring: GATES holds
// exactly the two labels, and each gate's scan() finds a plant in a copy
// built on the spot, so an emptied GATES or a stubbed scan() is a named
// failure, not a quiet green.
//
// This audits the ARTIFACTS, not the runtime: the rules are prose, and no
// script can prove a live session obeys them. The live evidence is in
// tests/receipts/ (preserved verbatim transcripts).
//
// Usage:
//   node tests/verify.mjs             # audit the bundle (red by design on the
//                                     # judged receipts: see tests/README.md)
//   node tests/verify.mjs --selftest  # prove the verifier can fail:
//                                     # planted-bad fixtures MUST fail

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { VERBATIM_MARKER } from "./gates/common.mjs";
import * as endorsement from "./gates/endorsement.mjs"; // feedback.md F1
import * as quoteAnchor from "./gates/quote-anchor.mjs"; // feedback.md F2

const GATES = [endorsement, quoteAnchor];

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

// Pinned structural expectations per receipt output. A diagnosis round
// delivers exactly one PRIMARY CAUSE; a refusal round delivers none.
const RECEIPT_EXPECT = {
  "round-1-output.md": { primaryCause: 1 },
  "round-2-output.md": { primaryCause: 0 },
};

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

function checkPrescriptions(text, source, label = "no-prescription-scan") {
  const lower = text.toLowerCase();
  for (const phrase of PRESCRIPTION_PHRASES) {
    const count = countOf(lower, phrase);
    if (count > 0) {
      fail(label, `${source}: prescription phrasing found: "${phrase}" ` +
                  `x${count}`);
    }
  }
}

function checkEmDash(text, source, label = "no-em-dash") {
  const count = countOf(text, EM_DASH);
  if (count > 0) {
    fail(label, `${source}: ${count} em dash(es) in output`);
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
    checkPrescriptions(body, name);
    checkEmDash(body, name);
  }
}

// The letter's gates (feedback.md F1, F2). Each gate reads the arm itself;
// its items become failures under its own label.
function checkGates() {
  const found = [];
  for (const gate of GATES) {
    const items = gate.scan(ROOT);
    for (const it of items) fail(it.label, `${it.file}:${it.line}: ${it.msg}`);
    if (items.length) found.push(`${gate.TAG}  ${gate.summary(items)}`);
  }
  return found;
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
  // Wiring: GATES holds exactly the two letter gates, and each one's scan()
  // finds a plant in a copy built here. An emptied GATES or a stubbed scan()
  // cannot pass this.
  const labels = GATES.map((g) => g.LABEL).join(", ");
  const wantLabels = "no-remedy-endorsement, quote-anchor";
  console.log(`  ${labels === wantLabels ? "OK" : "PROBLEM"} GATES = [${labels}], must be [${wantLabels}]`);
  if (labels !== wantLabels) problems.push(`GATES = [${labels}], must be [${wantLabels}]`);
  const planted = mkdtempSync(join(tmpdir(), "verify-plant-"));
  mkdirSync(join(planted, "tests", "receipts"), { recursive: true });
  writeFileSync(join(planted, "tests", "receipts", "round-1-input.md"), "The input holds nothing of note.\n");
  writeFileSync(join(planted, "tests", "receipts", "round-1-output.md"),
    `# planted copy\n\n${VERBATIM_MARKER}\n\n## Response to message 2\n\n` +
    `Both of your candidates close that gap. It says "nothing of note here" too.\n`);
  for (const gate of GATES) {
    const n = gate.scan(planted).length;
    console.log(`  ${n ? "OK" : "PROBLEM"} ${gate.LABEL}.scan() finds ${n} item(s) in the planted copy`);
    if (!n) problems.push(`${gate.LABEL}.scan() finds nothing in the planted copy: the gate is not wired`);
  }
  rmSync(planted, { recursive: true, force: true });
  // Each gate proves itself on its own fixtures (feedback.md T: the soft-spot
  // fixture is the F1 gate's). A missing fixture is a named failure.
  for (const gate of GATES) {
    for (const row of gate.selftest(FIXTURES)) {
      console.log(`  ${row.ok ? "OK" : "PROBLEM"} ${row.text}`);
      if (!row.ok) problems.push(`${gate.LABEL}: ${row.text}`);
    }
  }
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
  const letter = checkGates(); // feedback.md F1, F2
  if (failures.length) {
    if (letter.length) {
      console.log("RED: the judged receipts are never edited, and these are " +
                  "the defects the letter named.");
      for (const line of letter) console.log(line);
    }
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
