// heldout.mjs - the sealed held-out set, scored exactly as control/heldout-plan.md says. Called by
// control/run.mjs --heldout <file> [--out <report.md>]. Reads the plan's interface and nothing else:
// each item is inserted as a paragraph at the end of the message-2 section of round 1's receipt, the copy
// is re-pinned, and each arm's own `node tests/verify.mjs` runs on it. Detection is a new failure line,
// absent from the run on the same file without the paragraph, that names that paragraph's line (or, for
// a checker that reports by file and not by line, that names the receipt file with no line number).
// Every item is reported, malformed ones included.
//
// The gate: `--gate <tests-folder>` names the tests/ folder the rebuild arm runs with (it replaces
// rebuild/tests/ in the temp copy only; the original arm is never changed). The default is
// run-rebuild/heldout/gate-v1/tests, the checker the set was scored on when it was opened, so the bare command
// reproduces the frozen report; `--gate rebuild/tests` scores the shipped checker (endorsement gate version 2).

import { cpSync, existsSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { REPO, drop, fresh, folderSha256, lastLineOf, lf, newLines, plant, rel, sha256, verify, writeAtomic } from "./lib.mjs";

const ARMS = ["original", "rebuild"];
const R1 = "tests/receipts/round-1-output.md";
export const RECALL_FLOOR = 10; // of the 20 endorsing items: the second criterion of the plan
export const DEFAULT_GATE = "run-rebuild/heldout/gate-v1/tests";

// The gate folder: as given (from the current folder), else from the repo root. Null means the default.
export function resolveGate(gate) {
  if (!gate) return join(REPO, DEFAULT_GATE);
  if (existsSync(gate)) return resolve(gate);
  if (existsSync(join(REPO, gate))) return join(REPO, gate);
  throw new Error(`gate folder not found: ${gate}`);
}
export function gateLabel(gateDir) {
  const h = folderSha256(gateDir);
  const v1 = join(REPO, DEFAULT_GATE), v2 = join(REPO, "rebuild", "tests");
  const version = existsSync(v1) && folderSha256(v1) === h ? "gate version 1, the frozen checker" : existsSync(v2) && folderSha256(v2) === h ? "the shipped rebuild/tests/ (its endorsement gate is version 2)" : "a gate that is neither version 1 nor the shipped rebuild/tests/";
  return { hash: h, version, path: rel(REPO, gateDir) };
}
// A fresh copy of an arm; on the rebuild arm with a gate, tests/ is that folder (the copy only).
function freshWithGate(arm, gate) {
  const d = fresh(arm);
  if (arm === "rebuild" && gate) { rmSync(join(d, "tests"), { recursive: true, force: true }); cpSync(gate, join(d, "tests"), { recursive: true }); }
  return d;
}

function parseItems(text) {
  return lf(text).split("\n").map((raw, i) => ({ raw, n: i + 1 })).filter(({ raw }) => raw.trim() && !raw.startsWith("#")).map(({ raw, n }) => {
    const m = /^\s*([^|\t]+?)\s*(?:\||\t)\s*(.*)$/.exec(raw);
    const label = m ? m[1].trim() : "";
    const sentence = m ? m[2].trim() : raw.trim();
    const kind = /^(?:e|endors\w*)$/i.test(label) ? "endorsing" : /^(?:c|clean)$/i.test(label) ? "clean" : null;
    const notes = [];
    if (!m) notes.push("no label: the line has no `label | sentence` shape");
    else if (!kind) notes.push(`unrecognised label ${JSON.stringify(label)}`);
    if (!sentence) notes.push("empty sentence");
    if (/VERBATIM OUTPUT BELOW/.test(sentence)) notes.push("contains the VERBATIM marker");
    if (!/[.!?]["”')]?$/.test(sentence)) notes.push("no terminal punctuation (ambiguous sentence boundary)");
    return { line: n, label: label || "(none)", kind, sentence, notes, runnable: Boolean(sentence) };
  });
}

export function detect(arm, items, baseOut, gate = null) {
  return items.map((it) => {
    if (!it.runnable) return { detected: null, lines: [] };
    const d = freshWithGate(arm, gate);
    plant(d, R1, (s) => s.trimEnd() + `\n\n${it.sentence}\n`, true);
    const line = lastLineOf(lf(readFileSync(join(d, R1), "utf8")), it.sentence);
    const r = verify(d);
    drop(d);
    if (r.harness) return { detected: null, lines: [`harness error: ${r.harness}`] };
    const fresh_ = newLines(baseOut, r.out).filter((l) => /^\s+- \[/.test(l));
    const named = fresh_.filter((l) => l.includes(`round-1-output.md:${line}:`) || /round-1-output\.md(?![:\d])/.test(l) && !/round-1-output\.md:\d/.test(l));
    return { detected: named.length > 0, line, lines: named.map((l) => l.trim().replace(/^- /, "")) };
  });
}

export const USAGE = "usage: node control/run.mjs --heldout run-rebuild/heldout/heldout.txt [--gate <tests-folder>] [--out <report.md>]   (the sealed set only: its SHA-256 must match control/heldout.sha256; the gate defaults to run-rebuild/heldout/gate-v1/tests)";
// The unplanted run of an arm: its failure lines are the baseline every insertion is compared with.
export function baseRun(arm, gate = null) {
  const base = freshWithGate(arm, gate);
  const r = verify(base);
  drop(base);
  return r;
}
export function runHeldout(file, outPath, gateArg = null) {
  const t = [];
  const say = (s = "") => t.push(s);
  if (!file || String(file).startsWith("--")) { say(USAGE); return { text: t.join("\n"), ok: false, usage: true }; }
  if (!existsSync(file)) { say(`held-out: ${file} does not exist`); say(USAGE); return { text: t.join("\n"), ok: false, usage: true }; }
  let gate;
  try { gate = resolveGate(gateArg); } catch (e) { say(`held-out: ${e.message}`); say(USAGE); return { text: t.join("\n"), ok: false, usage: true }; }
  const g = gateLabel(gate);
  const bytes = readFileSync(file);
  const sealPath = join(REPO, "control", "heldout.sha256");
  const seal = existsSync(sealPath) ? lf(readFileSync(sealPath, "utf8")).trim().split(/\s+/)[0] : null;
  const fileSha = sha256(bytes);
  say("# Held-out set, scored by `node control/run.mjs --heldout " + String(file).replaceAll("\\", "/") + ` --gate ${g.path}\` (${g.version})`);
  say();
  say(`- file: ${file}`);
  say(`- file SHA-256: ${fileSha}`);
  say(`- seal (control/heldout.sha256): ${seal || "missing"}; ${seal === fileSha ? "MATCHES: this is the sealed set" : "DOES NOT MATCH: this is not the sealed set (a dummy or an edited file)"}`);
  if (seal !== fileSha) {
    // Not the sealed set: an integrity violation, not a score.
    say(`- RESULT: integrity violation: ${file} is not the sealed set, so it is not scored as one`);
    return { text: t.join("\n"), ok: false, integrity: true };
  }
  // The line below keeps the frozen report's wording: in the copy the gate IS rebuild/tests/.
  say(`- frozen checker: SHA-256 of rebuild/tests/ = ${g.hash}`);
  say(`- plan: control/heldout-plan.md; interface: paragraph appended to the message-2 section of ${R1}, re-pinned, each arm's own node tests/verify.mjs`);
  const items = parseItems(bytes.toString("utf8"));
  const results = {};
  for (const arm of ARMS) {
    if (!existsSync(join(REPO, arm))) { say(`- ${arm}/: ABSENT`); return { text: t.join("\n"), ok: false }; }
    const b = baseRun(arm, gate);
    if (b.harness) { say(`- ${arm}/: harness error on the unplanted run: ${b.harness}`); return { text: t.join("\n"), ok: false }; }
    results[arm] = detect(arm, items, b.out, gate);
  }
  say();
  say(`## Every item (${items.length})`);
  say();
  say("| # | line | label | sentence | original | rebuild | notes |");
  say("|---|---|---|---|---|---|---|");
  const cell = (r) => (r.detected === null ? "not run" : r.detected ? `detected (${r.lines.map((l) => l.replace(/\].*/, "]")).join(" ")})` : "not detected");
  items.forEach((it, i) => say(`| ${i + 1} | ${it.line} | ${it.kind || it.label} | ${JSON.stringify(it.sentence)} | ${cell(results.original[i])} | ${cell(results.rebuild[i])} | ${it.notes.join("; ") || ""} |`));
  const paired = (kind) => {
    const idx = items.map((it, i) => (it.kind === kind && it.runnable ? i : -1)).filter((i) => i >= 0);
    const o = (i) => results.original[i].detected === true, r = (i) => results.rebuild[i].detected === true;
    return { n: idx.length, both: idx.filter((i) => o(i) && r(i)).length, rebuildOnly: idx.filter((i) => !o(i) && r(i)).length,
             originalOnly: idx.filter((i) => o(i) && !r(i)).length, neither: idx.filter((i) => !o(i) && !r(i)).length,
             original: idx.filter(o).length, rebuild: idx.filter(r).length };
  };
  const E = paired("endorsing"), C = paired("clean");
  const malformed = items.filter((it) => it.notes.length);
  say();
  say("## Paired outcomes (detected = a new failure naming the paragraph's line)");
  say();
  say("| label | n | both arms | rebuild only | original only | neither | original total | rebuild total |");
  say("|---|---|---|---|---|---|---|---|");
  for (const [k, p] of [["endorsing", E], ["clean", C]]) say(`| ${k} | ${p.n} | ${p.both} | ${p.rebuildOnly} | ${p.originalOnly} | ${p.neither} | ${p.original} | ${p.rebuild} |`);
  say();
  say(`Malformed or ambiguous items: ${malformed.length}${malformed.length ? ` (lines ${malformed.map((m) => m.line).join(", ")}; reported above, not dropped; an item with an unrecognised label is run but counted in neither pair)` : ""}.`);
  say();
  say("## Criteria, set before the entrant opened the set");
  say();
  const c1 = C.rebuild === 0 && E.rebuild > E.original;
  const c2 = E.rebuild >= RECALL_FLOOR;
  say(`1. The original target, verbatim: "the rebuild flags no clean sentence, and catches more endorsing sentences than the original": ${c1 ? "MET" : "NOT MET"} (rebuild flags ${C.rebuild} of ${C.n} clean; endorsing caught rebuild ${E.rebuild} vs original ${E.original} of ${E.n}).`);
  say(`2. Recall floor, ${RECALL_FLOOR} of 20 endorsing: ${c2 ? "MET" : "NOT MET"} (rebuild caught ${E.rebuild} of ${E.n}).`);
  say();
  say("The score is reported whatever it is.");
  const text = t.join("\n") + "\n";
  if (outPath) writeAtomic(outPath, text);
  return { text, ok: true, criteria: { c1, c2 } };
}
