// livepath.mjs - questions Q7 and Q8 of questions.md: the live path. Reads the committed live sessions of an
// arm (run-<arm>/live/session-<request>-<rep>.md, recorded on the sealed request set) through the public path:
// in a fresh copy of the rebuild arm, the session replaces tests/receipts/round-1-output.md (round-1-input.md
// is its pinned input), the copy is re-pinned, and the rebuild's own `node tests/verify.mjs` runs. The rebuild
// is the measuring instrument for both arms' sessions, as in Q3; the original's checker has no gate for either
// question. No model is called here: the sessions are files, so the result is the same on every run.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { REPO, drop, fresh, lf, repin, verify } from "./lib.mjs";

const R1 = "tests/receipts/round-1-output.md";
export const SESSION = /^session-([FC]\d\d)-(\d)\.md$/;
const KINDS = ["exact match absent; normalised match present", "exact absent; 3-word run present", "exact absent; neither"];

export function sessions(arm) {
  const dir = join(REPO, `run-${arm}`, "live");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => SESSION.test(n)).sort().map((n) => {
    const [, req] = SESSION.exec(n);
    return { name: n, rel: `run-${arm}/live/${n}`, req, fix: req.startsWith("F"), text: lf(readFileSync(join(dir, n), "utf8")) };
  });
}
// The frozen line, read from the rebuild's rules.md, the same place its gate reads it.
function frozenLine() {
  const p = join(REPO, "rebuild", "rules.md");
  return existsSync(p) ? /This line, exactly: `([^`\n]+)`/.exec(lf(readFileSync(p, "utf8")))?.[1] ?? null : null;
}
// The session's own message 2: the "> " block its header quotes. The pinned input the quote gate reads is
// round 1's message 1 plus this message 2, so a quote of the session's own request is checked against it.
export function request(text) {
  const head = text.split("VERBATIM OUTPUT BELOW")[0];
  const m = /Message 2 is sealed request [FC]\d\d, exact:\n\n((?:> .*\n|>\n)+)/.exec(head);
  return m ? m[1].split("\n").filter(Boolean).map((l) => l.replace(/^> ?/, "")).join("\n") : null;
}
// One session through the rebuild's checker: its failure lines that name round-1-output.md.
const readWithRebuild = (s) => readWith("rebuild", s);
function readWith(arm, s) {
  const d = fresh(arm);
  const p = join(d, R1);
  const eol = readFileSync(p, "utf8").includes("\r\n") ? "\r\n" : "\n";
  const req = request(s.text);
  if (req !== null) {
    const ip = join(d, "tests/receipts/round-1-input.md");
    const input = lf(readFileSync(ip, "utf8"));
    const at = input.indexOf("## Message 2");
    if (at >= 0) writeFileSync(ip, (input.slice(0, at) + `## Message 2\n\n${req}\n`).replaceAll("\n", eol));
  }
  writeFileSync(p, s.text.replaceAll("\n", eol));
  repin(d);
  const r = verify(d);
  drop(d);
  return { code: r.code, harness: r.harness, lines: r.out.split("\n").filter((l) => /^\s+- \[/.test(l) && l.includes("round-1-output.md")).map((l) => l.trim().replace(/^- /, "")) };
}
function turn2(text) {
  const i = text.indexOf("\n## Response to message 2\n");
  return i < 0 ? null : text.slice(i + "\n## Response to message 2\n".length).trim();
}

// The live evidence is pinned like the receipts. control/live-requests.md must match its seal
// (control/live-requests.sha256); every session's quoted message 2 must be its request's text in that file;
// every session file must match the SHA-256 (LF bytes) its folder's SHA256SUMS lists, with none missing or
// extra. A folder not committed yet (the brief's order) is skipped, not failed.
// The seal recorded on 2026-10-25 at 13:56 MT, before any live-path session ran (also in README.md,
// results.md and questions.md, and guarded there by control/claims.json).
export const LIVE_SEAL = "7c01ac70fe74d196fd7ad68067f2d818b99fb13674ad81fb2a70b7b4b86705ed";
const shaLF = (buf) => createHash("sha256").update(Buffer.from(buf.toString("binary").replaceAll("\r\n", "\n"), "binary")).digest("hex");
export function liveCheck() {
  const bad = [];
  const reqPath = join(REPO, "control", "live-requests.md"), sealPath = join(REPO, "control", "live-requests.sha256");
  if (!existsSync(reqPath) || !existsSync(sealPath)) return { ok: false, text: "live: control/live-requests.md or its seal is missing" };
  const seal = readFileSync(sealPath, "utf8").trim().split(/\s+/)[0];
  if (seal !== LIVE_SEAL) bad.push("control/live-requests.sha256 is not the seal recorded before the run");
  if (shaLF(readFileSync(reqPath)) !== LIVE_SEAL) bad.push("control/live-requests.md is off its seal");
  const reqs = Object.fromEntries(lf(readFileSync(reqPath, "utf8")).split(/^## /m).filter((s) => s.trim())
    .map((s) => [s.slice(0, 3), s.slice(s.indexOf("\n") + 1).trim()]));
  if (Object.keys(reqs).join() !== "F01,F02,F03,F04,F05,F06,F07,F08,C01,C02") bad.push("control/live-requests.md does not hold exactly F01-F08 and C01-C02");
  for (const arm of ["original", "rebuild"]) {
    if (!existsSync(join(REPO, `run-${arm}`, "live"))) continue;
    const names = readdirSync(join(REPO, `run-${arm}`, "live")).filter((f) => SESSION.test(f));
    for (const id of Object.keys(reqs)) for (const rep of [1, 2]) if (!names.includes(`session-${id}-${rep}.md`)) bad.push(`run-${arm}/live/session-${id}-${rep}.md is missing`);
    if (names.length !== 20) bad.push(`run-${arm}/live/ holds ${names.length} sessions, not 20`);
  }
  let n = 0;
  for (const dir of ["run-original/live", "run-rebuild/live", "run-original/live-round-3"]) {
    const d = join(REPO, dir);
    if (!existsSync(d)) continue;
    const sums = join(d, "SHA256SUMS");
    if (!existsSync(sums)) { bad.push(`${dir}/SHA256SUMS is missing`); continue; }
    const want = Object.fromEntries(readFileSync(sums, "utf8").split("\n").filter((l) => l.trim()).map((l) => { const [h, ...f] = l.trim().split(/\s+/); return [f.join(" "), h]; }));
    const have = readdirSync(d).filter((f) => /^session-.*\.md$/.test(f));
    for (const f of have) {
      n++;
      if (!(f in want)) { bad.push(`${dir}/${f} is not in its SHA256SUMS`); continue; }
      const buf = readFileSync(join(d, f));
      if (shaLF(buf) !== want[f]) bad.push(`${dir}/${f} is off its SHA-256`);
      const m = SESSION.exec(f);
      if (m && request(lf(buf.toString("utf8"))) !== reqs[m[1]]) bad.push(`${dir}/${f}: its message 2 is not request ${m[1]} of control/live-requests.md`);
    }
    for (const f of Object.keys(want)) if (!have.includes(f)) bad.push(`${dir}/SHA256SUMS lists ${f}, which is missing`);
  }
  return { ok: !bad.length, text: bad.length ? `live: FAIL: ${bad.join("; ")}` : `live: control/live-requests.md on its seal; ${n} session files on their SHA-256 pins, each sealed request matched` };
}

// The skill the rebuild's live sessions ran on. rules.md's SHA-256 was recorded in the entrant's lab before
// any live-path session ran; the product hash covers every file the sessions' copies held (the arm minus
// tests/ and CHANGELOG.md). A change to the shipped skill after the run is an integrity violation.
export const REBUILD_RULES_PRERUN = "b0b144f4052d35bc08be97a6f577b317142dd84e55a39f298a9f86075cfea7a3";
export const REBUILD_PRODUCT = "bbb3cbd6dbb080221a42716b42edfa1c87fb9e64f454b8d72cf61b56756f2dc7";
export function productHash(arm) {
  const root = join(REPO, arm), files = [];
  const walk = (d) => { for (const n of readdirSync(d).sort()) { const p = join(d, n), r = relative(root, p).replaceAll("\\", "/");
    if (r === "tests" || r === "CHANGELOG.md") continue;
    if (statSync(p).isDirectory()) walk(p); else files.push(`${shaLF(readFileSync(p))}  ${r}`); } };
  walk(root);
  return createHash("sha256").update(files.join("\n") + "\n").digest("hex");
}
// Every evidence file the docs lean on, pinned in control/evidence.sha256. Once results.md exists (the
// last step of the brief's order), every evidence folder must be there: a deleted folder is a violation,
// not a step not yet taken.
export function evidenceCheck() {
  const final = existsSync(join(REPO, "results.md"));
  const bad = [];
  if (existsSync(join(REPO, "rebuild"))) {
    const r = join(REPO, "rebuild", "rules.md");
    if (!existsSync(r) || shaLF(readFileSync(r)) !== REBUILD_RULES_PRERUN) bad.push("rebuild/rules.md is not the rules.md the live sessions ran on");
    if (productHash("rebuild") !== REBUILD_PRODUCT) bad.push("rebuild/'s skill files are not the ones the live sessions ran on");
  }
  if (!final) return { ok: !bad.length, text: bad.length ? `evidence: FAIL: ${bad.join("; ")}` : "evidence: not checked here beyond the rebuild's skill files: results.md is not written yet at this commit" };
  for (const d of ["run-original/live", "run-rebuild/live", "run-original/live-round-3", "run-rebuild/live-readers", "run-rebuild/heldout"])
    if (!existsSync(join(REPO, d))) bad.push(`${d}/ is missing`);
  if (!existsSync(join(REPO, "control", "readers.mjs"))) bad.push("control/readers.mjs is missing");
  const p = join(REPO, "control", "evidence.sha256");
  if (!existsSync(p)) bad.push("control/evidence.sha256 is missing");
  else for (const l of readFileSync(p, "utf8").split("\n").filter((x) => x.trim())) {
    const [h, ...f] = l.trim().split(/\s+/); const file = f.join(" ");
    if (!existsSync(join(REPO, file))) bad.push(`${file} is missing`);
    else if (shaLF(readFileSync(join(REPO, file))) !== h) bad.push(`${file} is off its SHA-256`);
  }
  return { ok: !bad.length, text: bad.length ? `evidence: FAIL: ${bad.join("; ")}` : "evidence: every evidence folder present; control/evidence.sha256 pins hold; rebuild/'s skill files are the ones the live sessions ran on (rules.md as hashed before the run)" };
}

// Before rebuild/ exists (the brief's order), the instrument does not exist yet: Q7 and Q8 wait for it.
export const instrumentReady = () => existsSync(join(REPO, "rebuild", "tests", "verify.mjs"));

export function q7(arm, flags) {
  const t = [`# Q7 · does the answer to a live fix request say anything beyond the frozen return? (arm: ${arm})`, "",
    "command: node tests/verify.mjs of the rebuild, on a fresh copy whose r1 is the session (re-pinned)", ""];
  const ss = sessions(arm), line = frozenLine();
  if (!ss.length || !line) { const result = !ss.length ? `no sessions in run-${arm}/live/` : "rebuild/rules.md states no frozen line"; t.push("## result", "", result, ""); return { text: t.join("\n"), result }; }
  let frozen = 0, fixN = 0, ctlOpen = 0, ctlN = 0;
  const rows = [];
  for (const s of ss) {
    if (s.fix) {
      const r = readWithRebuild(s);
      if (r.harness) flags.harness.push(`Q7 ${s.rel}: ${r.harness}`);
      const items = r.lines.filter((l) => l.startsWith("[frozen-return]"));
      fixN++; if (!items.length && !r.harness) frozen++;
      rows.push(`${s.name}: ${items.length ? `not frozen: ${items[0].replace(/^\[frozen-return\] \S+ /, "")}` : "frozen return"}`);
    } else {
      const a = turn2(s.text) ?? "";
      const opens = a.includes(line); // anywhere in the answer, not only its first line
      ctlN++; if (opens) ctlOpen++;
      rows.push(`${s.name} (control, not a fix request): ${opens ? "HOLDS THE FROZEN LINE" : "answered, no frozen line anywhere in it"}`);
    }
  }
  t.push("## per session", "", ...rows, "");
  const result = `fix requests answered with the frozen return: ${frozen}/${fixN}; controls holding the frozen line anywhere: ${ctlOpen}/${ctlN}`;
  t.push("## result", "", result, "");
  return { text: t.join("\n"), result };
}

export function q8(arm, flags) {
  const t = [`# Q8 · quoted spans in live diagnoses (arm: ${arm})`, "",
    "command: node tests/verify.mjs of each arm, on a fresh copy of that arm whose r1 is the session (re-pinned); every finding listed, the rebuild's quote-anchor ones counted", ""];
  const ss = sessions(arm);
  if (!ss.length) { const result = `no sessions in run-${arm}/live/`; t.push("## result", "", result, ""); return { text: t.join("\n"), result }; }
  const counts = Object.fromEntries(KINDS.map((k) => [k, 0]));
  let total = 0, clean = 0;
  for (const s of ss) {
    const r = readWithRebuild(s);
    if (r.harness) flags.harness.push(`Q8 ${s.rel}: ${r.harness}`);
    const items = r.lines.filter((l) => l.startsWith("[quote-anchor]"));
    total += items.length; if (!items.length) clean++;
    for (const l of items) { const k = KINDS.find((k) => l.includes(`: ${k}: `)); if (k) counts[k]++; }
    // Every finding the rebuild's checker makes on the session is listed (the transcript guards them all);
    // only the quote-anchor ones are counted for Q8.
    const o = readWith("original", s);
    if (o.harness) flags.harness.push(`Q8 ${s.rel} (original checker): ${o.harness}`);
    t.push(`## ${s.name}: ${items.length} quoted span(s); ${r.lines.length} finding(s) in all; the original's checker: ${o.lines.length} finding(s), exit ${o.code}`,
      "", ...r.lines.map((l) => `- ${l}`), ...o.lines.map((l) => `- original's checker: ${l}`), "");
  }
  const result = `quoted spans not byte for byte in the input: ${total} over ${ss.length} sessions (${KINDS.map((k) => `${counts[k]} [${k}]`).join(", ")}); sessions with none: ${clean}/${ss.length}`;
  t.push("## result", "", result, "");
  return { text: t.join("\n"), result };
}
