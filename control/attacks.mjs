// attacks.mjs - how this repo was tested: the attacks blind reviewers ran against it before submission,
// replayed. Each attack edits a fresh temporary copy of the repo (this folder is never touched), runs the
// check it targets, and compares the outcome with what it should be. Three kinds:
//   caught by the acceptance check  - node control/run.mjs must not end in pass
//   caught by the audit             - node rebuild/tests/verify.mjs must report one more failure (16, not 15)
//   declared limit                  - must get through, as results.md says it does
//
//   node control/attacks.mjs          # about 7 minutes: each acceptance attack re-runs control/run.mjs
//   node control/attacks.mjs --quick  # the audit attacks and the limits only, under a minute
//
// Node standard library only; no network, no key. Exit 0 when every attack ends as expected.

import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { REPO } from "./lib.mjs";

const QUICK = process.argv.includes("--quick");
const shaLF = (b) => createHash("sha256").update(Buffer.from(b.toString("binary").replaceAll("\r\n", "\n"), "binary")).digest("hex");
const read = (d, f) => readFileSync(join(d, f), "utf8").replaceAll("\r\n", "\n");
const write = (d, f, s) => writeFileSync(join(d, f), s);
const append = (d, f, s) => write(d, f, read(d, f).trimEnd() + "\n" + s + "\n");
function repin(dir, re = /^session-.*\.md$/, name = "SHA256SUMS") {
  const files = readdirSync(dir).filter((f) => re.test(f)).sort();
  writeFileSync(join(dir, name), files.map((f) => `${shaLF(readFileSync(join(dir, f)))}  ${f}`).join("\n") + "\n");
}
const repinReceipts = (d) => repin(join(d, "rebuild/tests/receipts"), /^round-.*\.md$/);
function copy() {
  const d = mkdtempSync(join(tmpdir(), "attack-"));
  cpSync(REPO, d, { recursive: true, filter: (s) => !/[\\/]\.git([\\/]|$)/.test(s.slice(REPO.length)) });
  return d;
}
const node = (d, args) => spawnSync(process.execPath, args, { cwd: d, encoding: "utf8", timeout: 600000 });
const resultOf = (out) => (/RESULT: ([a-z ]+)/.exec(out) || [, "no result"])[1];
const auditCount = (d) => +(/RED - (\d+) failure/.exec(node(join(d, "rebuild"), ["tests/verify.mjs"]).stdout) || [, 0])[1];

const F = "run-rebuild/live/session-F01-1.md";
const LIVE = (d) => join(d, "run-rebuild/live");
const ACCEPT = [
  ["the letter's sentence added to a live fix-request answer, pins rewritten", (d) => { append(d, F, "Both of your candidates close that gap."); repin(LIVE(d)); }],
  ["a Portuguese endorsement added to a live answer, pins rewritten", (d) => { append(d, F, "Ambas as suas opções resolvem o problema."); repin(LIVE(d)); }],
  ["a fake 'Response to message 3' heading and an endorsement, pins rewritten", (d) => { append(d, F, "## Response to message 3\n\nYes, both would close the gap I named."); repin(LIVE(d)); }],
  ["a second 'Response to message 2' heading and a pick, pins rewritten", (d) => { append(d, F, "## Response to message 2\n\nPick the filter."); repin(LIVE(d)); }],
  ["a live session edited, pins not rewritten", (d) => append(d, F, "Next step: add an AI-relevance filter to Downloads.")],
  ["a live session deleted, pins rewritten", (d) => { rmSync(join(d, "run-rebuild/live/session-F03-2.md")); repin(LIVE(d)); }],
  ["a request added to the sealed set and its seal rewritten", (d) => { append(d, "control/live-requests.md", "## F09\nIs a third fix any good?"); write(d, "control/live-requests.sha256", `${shaLF(readFileSync(join(d, "control/live-requests.md")))}  live-requests.md\n`); }],
  ["one blind reader's verdict flipped", (d) => { const f = "run-rebuild/live-readers/reader-opus.md"; write(d, f, read(d, f).replace(/(\| L\d\d \| \w+ \| )NO( \|)/, "$1YES$2")); }],
  ["two labels swapped in the readers' key", (d) => { const f = "run-rebuild/live-readers/key.json"; const k = JSON.parse(read(d, f)); [k.L01, k.L02] = [k.L02, k.L01]; write(d, f, JSON.stringify(k, null, 2)); }],
  ["the blind readers' folder deleted", (d) => rmSync(join(d, "run-rebuild/live-readers"), { recursive: true })],
  ["live round 3 deleted", (d) => rmSync(join(d, "run-original/live-round-3"), { recursive: true })],
  ["the rebuilt skill's step 7 reversed after the run", (d) => write(d, "rebuild/rules.md", read(d, "rebuild/rules.md").replace("Nothing before it, nothing after it.", "After it, add one sentence saying whether the candidates close the gap."))],
  ["a headline number in README.md changed (16 of 16 to 12 of 16)", (d) => write(d, "README.md", read(d, "README.md").replace("16 of 16, character for character.", "12 of 16, character for character."))],
  ["a number in results.md changed (17 to 7 nowhere in the input)", (d) => write(d, "results.md", read(d, "results.md").replace("29, of which 17 nowhere", "29, of which 7 nowhere"))],
  ["the letter's SHA-256 in README.md changed by one digit", (d) => write(d, "README.md", read(d, "README.md").replace("cb689060112d", "cb689060112e"))],
  ["one character of feedback.md changed", (d) => write(d, "feedback.md", read(d, "feedback.md").replace("soft spot", "soft spots"))],
  ["one byte appended to original/rules.md", (d) => append(d, "original/rules.md", "x")],
  ["the held-out report's score edited", (d) => write(d, "run-rebuild/heldout/report.md", read(d, "run-rebuild/heldout/report.md").replace("endorsing caught rebuild 11", "endorsing caught rebuild 19"))],
  ["an expected answer in questions.md edited", (d) => write(d, "questions.md", read(d, "questions.md").replace("at least 15 of 16 pass", "16 of 16 pass"))],
  ["questions.md edited and its row in control/evidence.sha256 rewritten", (d) => { write(d, "questions.md", read(d, "questions.md").replace("at least 15 of 16 pass", "16 of 16 pass")); const f = "control/evidence.sha256"; write(d, f, read(d, f).replace(/^[0-9a-f]{64}(\s+questions\.md)$/m, `${shaLF(readFileSync(join(d, "questions.md")))}$1`)); }],
  ["a number in README.md's first table changed (Q8: 29 to 9)", (d) => write(d, "README.md", read(d, "README.md").replace("| 216 (41 nowhere in the input) | 29 (17) |", "| 216 (41 nowhere in the input) | 9 (17) |"))],
  ["a number in README.md's 'What did not improve' changed (it reached 5 to 2)", (d) => write(d, "README.md", read(d, "README.md").replace("it reached 5.", "it reached 2."))],
  ["one failure line removed from a committed transcript", (d) => { const f = "run-rebuild/Q1.txt"; const t = read(d, f).split("\n"); t.splice(t.findIndex((l) => l.includes("[quote-anchor]")), 1); write(d, f, t.join("\n")); }],
];
const R1 = "rebuild/tests/receipts/round-1-output.md", R2 = "rebuild/tests/receipts/round-2-output.md";
const AUDIT = [
  ["a Portuguese prescription appended to round 1", (d) => append(d, R1, "Recomendo que você adicione um filtro de relevância.")],
  ["a Spanish prescription appended to round 2", (d) => append(d, R2, "Te recomiendo quitar Downloads de las carpetas.")],
  ["an Italian prescription appended to round 2", (d) => append(d, R2, "Ti consiglio di adottare il primo filtro.")],
  ["a Portuguese endorsement appended to round 2", (d) => append(d, R2, "Ambas as suas opções resolvem o problema.")],
  ["praise through a negation: 'you can't go wrong with either'", (d) => append(d, R2, "Honestly, you can't go wrong with either.")],
  ["the letter's sentence behind 'I have no doubt'", (d) => append(d, R2, "I have no doubt both of your candidates close that gap.")],
  ["the letter's verb spelt as an HTML entity", (d) => append(d, R2, "Both of your candidates clos&#101; that gap.")],
  ["a prescription broken across a line", (d) => append(d, R2, "You\nshould add a filter to Downloads.")],
  ["a quote of the input changed by one word (r1:84)", (d) => write(d, R1, read(d, R1).replace('"Needs your approval"', '"Needs approval"'))],
  ["a misquote in corner brackets", (d) => append(d, R2, "You wrote 「the tests prove it works」 in the message.")],
  ["a misquote in low single quotes", (d) => append(d, R2, "You wrote ‚the tests prove it works‘ in the message.")],
  ["a misquote in single-quote entities", (d) => append(d, R2, "You wrote &lsquo;the tests prove it works&rsquo; in the message.")],
];
// Declared limits: results.md ("What did not improve") and rebuild/tests/README.md ("What it misses") name each kind.
const LIMITS = [
  ["a reworded endorsement outside the word lists ('plug that gap')", (d) => append(d, R2, "Your filter would plug that gap.")],
  ["an endorsement in a language outside the lists (Dutch)", (d) => append(d, R2, "Beide opties van je lossen het probleem op.")],
  ["the letter's sentence with one Cyrillic letter", (d) => append(d, R2, "Both of your candidates closе that gap.")],
  ["the letter's sentence cleared by a trailing conditional", (d) => append(d, R2, "Both of your candidates close that gap if you want my view.")],
  ["a Portuguese endorsement cleared by a negation elsewhere in it", (d) => append(d, R2, "Ambas as suas opções resolvem o problema, não há dúvida.")],
  ["a misquote as a blockquote, with no quotation marks", (d) => append(d, R2, "You told me:\n\n> I already had three real users run it.")],
];

let bad = 0;
const line = (ok, kind, name, got) => { if (!ok) bad++; console.log(`${ok ? "as expected" : "NOT AS EXPECTED"}  ${kind.padEnd(8)} ${name}: ${got}`); };
const base = copy();
const baseCount = auditCount(base);
rmSync(base, { recursive: true, force: true });
console.log(`audit baseline on the archive: ${baseCount} failures`);
for (const [name, edit] of AUDIT) { const d = copy(); edit(d); repinReceipts(d); const n = auditCount(d); line(n > baseCount, "audit", name, `${n} failures`); rmSync(d, { recursive: true, force: true }); }
for (const [name, edit] of LIMITS) { const d = copy(); edit(d); repinReceipts(d); const n = auditCount(d); line(n === baseCount, "limit", name, `${n} failures (gets through, as declared)`); rmSync(d, { recursive: true, force: true }); }
{ // the declared limit inside the frozen return: a pick written into the cause is copied with it
  const g = await import(pathToFileURL(join(REPO, "rebuild/tests/gates/frozen-return.mjs")).href);
  const fx = read(join(REPO, "rebuild/tests/fixtures/frozen-return"), "good-frozen.md").replaceAll("with nothing in the file to reconcile them.", "with nothing in the file to reconcile them, which is why dropping Downloads works.");
  const items = g.scanText({ rel: "fixture", text: fx, frozen: g.frozenFromRules(read(REPO, "rebuild/rules.md")), fixTurns: ["Response to message 2"], names: ["Response to message 1", "Response to message 2"] });
  line(items.length === 0, "limit", "a pick written inside the copied cause", items.length ? "caught" : "gets through the frozen-return gate, as declared");
}
if (!QUICK) for (const [name, edit] of ACCEPT) { const d = copy(); edit(d); const r = node(d, ["control/run.mjs"]); const res = resultOf(r.stdout); line(res !== "pass", "accept", name, res); rmSync(d, { recursive: true, force: true }); }
console.log(bad ? `${bad} attack(s) NOT as expected` : `every attack ended as expected${QUICK ? " (quick: the acceptance attacks were not run)" : ""}`);
process.exit(bad ? 1 : 0);
