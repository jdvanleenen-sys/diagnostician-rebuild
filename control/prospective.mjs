// prospective.mjs - the prospective round on the letter's own lines, scored as control/prospective-plan.md
// says. Two sealed sets (run-rebuild/prospective/set-a.txt and set-b.txt, written blind by two AI writers
// who saw only feedback.md, round 1's input and a brief) are checked against control/prospective.sha256,
// then each item goes through the held-out set's public path (control/heldout.mjs: a paragraph appended to
// the message-2 section of round 1's receipt, re-pinned, each arm's own `node tests/verify.mjs`), on both
// arms, with the shipped checkers. Detection is a new failure naming that paragraph's line.
//
//   node control/prospective.mjs              # score, print the report, compare it with the committed one
//   node control/prospective.mjs --write      # write run-rebuild/prospective/report.md (only when sealed)
//
// prospectiveCheck() is also run by control/run.mjs: once the sets are committed, the report must be what
// this prints, and the seals must hold.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { REPO, folderSha256, lf, sha256 } from "./lib.mjs";
import { baseRun, detect } from "./heldout.mjs";

const DIR = join(REPO, "run-rebuild", "prospective");
const SETS = ["set-a.txt", "set-b.txt"];
const REPORT = join(DIR, "report.md");
const INPUT = join(REPO, "rebuild", "tests", "receipts", "round-1-input.md");
const ARMS = ["original", "rebuild"];

// The bars, as control/prospective-plan.md states them (the plan is pinned below).
export const BARS = [
  ["P1", "the rebuild flags at most 2 of the clean sentences (C)", (s) => s.rebuild.C <= 2],
  ["P2", "the rebuild catches at least half of the endorsing sentences (E)", (s) => s.rebuild.E * 2 >= s.n.E],
  ["P3", "the rebuild catches more endorsing sentences than the original", (s) => s.rebuild.E > s.original.E],
  ["P4", "the rebuild flags none of the valid exact quotes (X)", (s) => s.rebuild.X === 0],
  ["P5", "the rebuild catches every valid misquote (M) but at most one", (s) => s.rebuild.M >= s.n.M - 1],
];

function seals() {
  const p = join(REPO, "control", "prospective.sha256");
  if (!existsSync(p)) return { ok: false, text: "control/prospective.sha256 is missing" };
  const want = Object.fromEntries(lf(readFileSync(p, "utf8")).split("\n").filter((l) => l.trim()).map((l) => { const [h, f] = l.trim().split(/\s+/); return [f, h]; }));
  const bad = SETS.filter((f) => !existsSync(join(DIR, f)) || sha256(Buffer.from(lf(readFileSync(join(DIR, f), "utf8")))) !== want[f]);
  return { ok: !bad.length, text: bad.length ? `off their seals: ${bad.join(", ")}` : "both sets on their seals" };
}

// One line of a set: label | sentence [| span]. X and M carry the quoted span as the writer typed it; the
// writer's label is checked against round 1's input by a plain byte search of that span, before any gate.
function parse(file, input) {
  return lf(readFileSync(join(DIR, file), "utf8")).split("\n").map((raw, i) => ({ raw, line: i + 1 })).filter(({ raw }) => raw.trim()).map(({ raw, line }) => {
    const parts = raw.split(" | ");
    const label = parts[0].trim(), sentence = (parts[1] ?? "").trim(), span = parts.slice(2).join(" | ");
    const notes = [];
    if (!["E", "C", "X", "M"].includes(label)) notes.push(`unrecognised label ${JSON.stringify(label)}`);
    if (!sentence) notes.push("empty sentence");
    if ((label === "X" || label === "M") && !span) notes.push("no quoted span given");
    if ((label === "X" || label === "M") && span && !sentence.includes(span)) notes.push("the span is not in the sentence");
    if (label === "X" && span && !input.includes(Buffer.from(span, "utf8"))) notes.push("labelled exact, but the span is not in the input");
    if (label === "M" && span && input.includes(Buffer.from(span, "utf8"))) notes.push("labelled a misquote, but the span is in the input");
    return { file, line, label, sentence, span, notes, valid: !notes.length, runnable: Boolean(sentence) };
  });
}

export function score() {
  const s = seals();
  if (!s.ok) return { ok: false, text: `prospective: ${s.text}` };
  const input = readFileSync(INPUT);
  const items = SETS.flatMap((f) => parse(f, input));
  const res = {};
  for (const arm of ARMS) {
    const b = baseRun(arm);
    if (b.harness) return { ok: false, text: `prospective: ${arm} harness error: ${b.harness}` };
    res[arm] = detect(arm, items, b.out);
  }
  const count = (arm, label) => items.filter((it, i) => it.valid && it.label === label && res[arm][i].detected === true).length;
  const sum = { n: Object.fromEntries(["E", "C", "X", "M"].map((l) => [l, items.filter((it) => it.valid && it.label === l).length])) };
  for (const arm of ARMS) sum[arm] = Object.fromEntries(["E", "C", "X", "M"].map((l) => [l, count(arm, l)]));
  const t = ["# Prospective round on the letter's own lines", "",
    `- plan: control/prospective-plan.md; sets: ${SETS.map((f) => `run-rebuild/prospective/${f}`).join(", ")} (${s.text})`,
    `- checkers: each arm's shipped tests/; rebuild/tests/ SHA-256 ${folderSha256(join(REPO, "rebuild", "tests"))}`,
    "- interface: the held-out set's (control/heldout.mjs): a paragraph appended to the message-2 section of round 1's receipt, re-pinned, each arm's own node tests/verify.mjs; detected = a new failure naming that line", "",
    "## Every item", "", "| set:line | label | sentence | original | rebuild | notes |", "|---|---|---|---|---|---|"];
  const cell = (r) => (r.detected === null ? "not run" : r.detected ? `detected (${r.lines.map((l) => l.replace(/\].*/, "]")).join(" ")})` : "not detected");
  items.forEach((it, i) => t.push(`| ${it.file}:${it.line} | ${it.label} | ${JSON.stringify(it.sentence)} | ${cell(res.original[i])} | ${cell(res.rebuild[i])} | ${it.notes.join("; ") || (it.valid ? "" : "")} |`));
  t.push("", "## Counts (valid items only; an item whose label fails its own check is reported above and left out)", "",
    "| label | valid items | original detected | rebuild detected |", "|---|---|---|---|");
  for (const [l, name] of [["E", "endorsing"], ["C", "clean"], ["X", "exact quote"], ["M", "misquote"]]) t.push(`| ${l} (${name}) | ${sum.n[l]} | ${sum.original[l]} | ${sum.rebuild[l]} |`);
  t.push("", "## The bars, set before the sets were opened", "");
  const bars = BARS.map(([id, text, test]) => [id, text, test(sum)]);
  for (const [id, text, met] of bars) t.push(`- ${id} ${met ? "MET" : "NOT MET"}: ${text}`);
  t.push("", "Reported whatever it shows.", "");
  return { ok: true, text: t.join("\n"), sum, bars };
}

export function prospectiveCheck() {
  if (!existsSync(join(REPO, "control", "prospective-plan.md"))) return { ok: true, text: "prospective: not planned at this commit" };
  if (!SETS.some((f) => existsSync(join(DIR, f)))) return { ok: true, text: "prospective: planned, sets not opened at this commit (control/prospective-plan.md)" };
  const r = score();
  if (!r.ok) return { ok: false, text: r.text };
  const same = existsSync(REPORT) && lf(readFileSync(REPORT, "utf8")) === r.text;
  return { ok: same, text: same ? "prospective: sets on their seals; run-rebuild/prospective/report.md is what the scoring prints" : "prospective: FAIL: run-rebuild/prospective/report.md differs from what the scoring prints" };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const r = score();
  console.log(r.text);
  if (!r.ok) process.exit(4);
  if (process.argv.includes("--write")) { writeFileSync(REPORT, r.text); console.log("written: run-rebuild/prospective/report.md"); }
  else { const c = prospectiveCheck(); console.log(c.text); process.exit(c.ok ? 0 : 4); }
}
