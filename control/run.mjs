#!/usr/bin/env node
// run.mjs - the ACCEPTANCE CHECK. Runs the eight questions of questions.md on both arms (original/, rebuild/),
// unplanted then planted, each run in a fresh copy, and compares every result with control/expected.json
// (the result strings questions.md promises) and every transcript with run-original/ and run-rebuild/.
// It is not the audit: `node rebuild/tests/verify.mjs` is the audit, and it is red on the archived receipts
// by design, because the archive keeps its defects. This command is green when the checker behaves exactly
// as promised: every expected finding reproduces on both arms and nothing unexpected appears.
//
// Its result is one word of five, never a bare red or green:
//   pass                 every promised result reproduced, every transcript matched, nothing unexpected   exit 0
//   plant detected       an arm's unplanted run shows a failure the committed transcript does not have      exit 2
//   baseline defect      a promised finding did not reproduce, or a plant made a baseline finding vanish    exit 3
//   integrity violation  original/ off its pin, feedback.md off the letter, an arm absent, a transcript
//                        or the results.md table differs from the live run, a headline number or gate hash
//                        of control/claims.json missing from README.md or results.md, or (--heldout) the
//                        file off its seal                                                                  exit 4
//   harness error        an arm's checker hung (per-run timeout), crashed, or could not be spawned          exit 5
//
//   node control/run.mjs                              # compare, print the table, name the result
//   node control/run.mjs --write                      # (re)write the transcripts, only when the result would be pass
//   node control/run.mjs --heldout run-rebuild/heldout/heldout.txt [--gate d] [--out f]   # score the sealed set as control/heldout-plan.md says;
//                                                     # the rebuild arm runs with tests/ = d (default run-rebuild/heldout/gate-v1/tests, the frozen checker; rebuild/tests for version 2)
//   node control/run.mjs --live [--out f]                                       # read run-rebuild/live/session-*.md with both arms' checkers
//
// Plants find their place by text, never by line number, and keep each file's own line ending. Copies are
// made with mkdtemp, so two runs at once never share a folder; transcripts are written whole or not at
// all. Node 18+, no network, no key. git is used only for the original/ pin, and there is a no-git path.

import { existsSync, mkdirSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { corpus } from "./corpus.mjs";
import { runHeldout } from "./heldout.mjs";
import { runLive } from "./live.mjs";
import { evidenceCheck, instrumentReady, liveCheck, q7, q8 } from "./livepath.mjs";
// The blind readers came after the live round (the brief's order puts them in the rebuild's commit). Once
// results.md exists, a missing readers.mjs is a violation (evidenceCheck names it), never a skipped step.
const readersCheck = existsSync(new URL("./readers.mjs", import.meta.url))
  ? (await import("./readers.mjs")).readersCheck
  : () => ({ ok: true, text: "readers: not checked here: control/readers.mjs is not committed yet at this commit" });
import { REPO, claimsCheck, drop, failureLines, feedbackCheck, fresh, lf, lineOf, newLines, persisted, pinCheck, plant, receiptsCheck, rel, verify, walk, writeAtomic } from "./lib.mjs";

const argv = process.argv.slice(2);
const WRITE = argv.includes("--write");
const ARMS = ["original", "rebuild"];
const LETTER = "Both of your candidates close that gap, which is why both occurred to you within a minute of reading the diagnosis.";
const REFUSAL = "This is a fix request, and picking between your two candidates is the subtlest version of one";
const REFUSAL_SENTENCE = REFUSAL + ": the moment I order your list, I have chosen the remedy, and you have stopped reasoning about the failure and started implementing my answer.";
const R1 = "tests/receipts/round-1-output.md";
const VERIFY = "node tests/verify.mjs";
const KINDS = ["exact match absent; normalised match present", "exact absent; 3-word run present", "exact absent; neither"];
const CODES = { pass: 0, "plant detected": 2, "baseline defect": 3, "integrity violation": 4, "harness error": 5 };

const flags = { harness: [], plant: [], baseline: [], integrity: [] };
const lineWith = (text, needle) => text.split("\n").findIndex((l) => l.includes(needle)) + 1;
const findByBytes = (d, needle) => {
  const dir = join(d, "tests/fixtures");
  if (!existsSync(dir)) return null;
  const hit = walk(dir).find((p) => readFileSync(p, "utf8").includes(needle));
  return hit ? rel(d, hit) : null;
};
function section(t, title, body) { t.push(`## ${title}`, "", body.trimEnd(), ""); }
function runOutput(t, title, r) {
  if (r.harness) flags.harness.push(`${title}: ${r.harness}`);
  section(t, title, `exit ${r.code}${r.harness ? ` (HARNESS ERROR: ${r.harness})` : ""}\n${r.out}`);
}
// Every finding of the unplanted run must still be there under the plant (line numbers aside).
function persistence(t, id, unplanted, r) {
  const p = persisted(unplanted.out, r.out);
  if (p.lost.length) flags.baseline.push(`plant (${id}) made ${p.lost.length} baseline finding(s) vanish`);
  section(t, `baseline findings under plant (${id})`, `${p.total - p.lost.length} of ${p.total} persist${p.lost.length ? `; LOST: ${p.lost.join(" | ")}` : ""}`);
}
// A plant that cannot find its anchor text means the arm's archive is not the archive the question was
// written against: a baseline defect, named, not a crash.
function runPlanted(arm, path, mutate, pin) {
  const d = fresh(arm);
  let diff;
  try { diff = plant(d, path, mutate, pin); } catch (e) {
    drop(d);
    flags.baseline.push(`${arm}: plant on ${path} found no anchor text (${e.message})`);
    return { diff: `PLANT FAILED: ${e.message}`, text: "", r: { code: null, out: "(not run: the plant found no anchor text)", harness: null } };
  }
  const text = lf(readFileSync(join(d, path), "utf8"));
  const r = verify(d);
  drop(d);
  return { diff, text, r };
}

// ------------------------------------------------------------------ questions
function q1(arm) {
  const t = [`# Q1 · does the scan fail on the judged bundle? (arm: ${arm})`, "", `command: ${VERIFY}`, "plant: none", ""];
  const d = fresh(arm);
  const r = verify(d);
  drop(d);
  runOutput(t, "unplanted run", r);
  const names92 = /round-1-output\.md:92\b/.test(r.out), names90 = /round-1-output\.md:90\b/.test(r.out);
  const result = `exit ${r.code}; names r1:92: ${names92 ? "yes" : "no"}; names r1:90: ${names90 ? "yes" : "no"}`;
  section(t, "result", result);
  return { text: t.join("\n"), result, unplanted: r };
}

function q2(arm) {
  const t = [`# Q2 · the letter's sentence, wherever it lands (arm: ${arm})`, "", `command: ${VERIFY}`, "plants: one at a time, each in a fresh copy; receipt plants are re-pinned", ""];
  const base = fresh(arm);
  const unplanted = verify(base);
  drop(base);
  runOutput(t, "unplanted run", unplanted);
  // [id, title, file, mutation, re-pin, the text whose first line is the plant's line]
  const plants = [
    ["a", "a new line in r1, right after the original", R1, (s) => s.replace(LETTER + " Which one", LETTER + "\n" + LETTER + " Which one"), true, LETTER + " Which one"],
    ["b", "r1's first response", R1, (s) => s.replace("## Response to message 1\n\n", `## Response to message 1\n\n${LETTER}\n\n`), true, LETTER + "\n\n"],
    ["c", "after a second VERBATIM OUTPUT BELOW line in r1", R1, (s) => s.trimEnd() + `\n\nVERBATIM OUTPUT BELOW\n---\n\n${LETTER}\n`, true, LETTER + "\n"],
    ["d", "a new paragraph at the end of examples.md", "examples.md", (s) => s.trimEnd() + `\n\n${LETTER}\n`, false, LETTER + "\n"],
    ["e", "inside the Case 4 refusal fence of examples.md", "examples.md", (s) => {
      const c4 = s.indexOf("## Case 4"); const open = s.indexOf("```", c4); const close = s.indexOf("```", open + 3);
      return s.slice(0, close) + LETTER + "\n" + s.slice(close);
    }, false, LETTER + "\n"],
  ];
  let caught = 0;
  const rows = [];
  for (const [id, title, path, mutate, pin, mark] of plants) {
    const { diff, text, r } = runPlanted(arm, path, mutate, pin);
    const line = lineOf(text, mark);
    const hit = !r.harness && newLines(unplanted.out, r.out).some((l) => l.includes(`${path}:${line}:`) && l.includes("Both of your candidates close that gap"));
    if (hit) caught++;
    rows.push(`(${id}) ${path}:${line}: ${hit ? "caught" : "not caught"}`);
    section(t, `plant (${id}): ${title}`, diff);
    runOutput(t, `planted run (${id})`, r);
    persistence(t, id, unplanted, r);
  }
  const result = `caught ${caught}/5: ${rows.join("; ")}`;
  section(t, "result", result);
  return { text: t.join("\n"), result };
}

function q3(arm) {
  const t = [`# Q3 · the 13 quoted spans that are not in the input (arm: ${arm})`, "", `command: ${VERIFY}`, "plant: none", ""];
  const d = fresh(arm);
  const r = verify(d);
  drop(d);
  runOutput(t, "unplanted run", r);
  const kindRe = KINDS.map((k) => k.replace(/[;]/g, "\\$&")).join("|");
  const found = [...r.out.matchAll(new RegExp(String.raw`\[quote-anchor\] (tests\/receipts\/round-\d-output\.md):(\d+): (${kindRe}|unpaired mark|empty quote)`, "g"))]
    .map((m) => ({ file: m[1], line: +m[2], kind: m[3] }));
  const keyPath = join(REPO, "control", "expected-quotes.json");
  const key = existsSync(keyPath) ? JSON.parse(readFileSync(keyPath, "utf8")).map((k) => ({ file: k.file, line: k.line, kind: k.kind })) : null;
  const same = key && JSON.stringify(found) === JSON.stringify(key);
  const n = (k) => found.filter((f) => f.kind === k).length;
  const result = `names ${found.length} (${KINDS.map((k) => `${n(k)} [${k}]`).join(", ")}); matches control/expected-quotes.json: ${key ? (same ? "yes" : "NO") : "key missing"}`;
  section(t, "result", result);
  return { text: t.join("\n"), result };
}

function q4(arm) {
  const t = [`# Q4 · misquotes planted at capture time, and one exact quote that must pass (arm: ${arm})`, "", `command: ${VERIFY}`, "plants: one at a time, each re-pinned; each lands on the first line of r1 that holds the quoted text", ""];
  const base = fresh(arm);
  const unplanted = verify(base);
  drop(base);
  runOutput(t, "unplanted run", unplanted);
  const onText = (from, to) => (s) => {
    const a = s.split("\n");
    const i = a.findIndex((l) => l.includes(from));
    if (i < 0) throw new Error(`no line of ${R1} holds ${from}`);
    a[i] = a[i].replace(from, to);
    return a.join("\n");
  };
  const plants = [
    ["a", '"Needs your approval"', '"Needs approval"', true],
    ["b", '"Copy of"', '"Copy  of"', true],
    ["c", '"Copy of"', "'Copy of'", false],
  ];
  const rows = [];
  let caught = 0, cNamed = null;
  for (const [id, from, to, mustCatch] of plants) {
    const before = fresh(arm);
    const line = lineWith(lf(readFileSync(join(before, R1), "utf8")), from);
    drop(before);
    const { diff, r } = runPlanted(arm, R1, onText(from, to), true);
    const hit = !r.harness && newLines(unplanted.out, r.out).some((l) => l.includes(`[quote-anchor] ${R1}:${line}:`));
    if (mustCatch && hit) caught++;
    if (!mustCatch) cNamed = hit;
    rows.push(`(${id}) r1:${line} ${from} -> ${to}: ${hit ? "named" : "not named"}`);
    section(t, `plant (${id}): r1:${line} ${from} -> ${to}`, diff);
    runOutput(t, `planted run (${id})`, r);
    persistence(t, id, unplanted, r);
  }
  const result = `caught ${caught}/2; (c) exact single-quoted: ${cNamed ? "NAMED" : "not named"}; ${rows.join("; ")}`;
  section(t, "result", result);
  return { text: t.join("\n"), result };
}

function q5(arm) {
  const t = [`# Q5 · is there a fixture for the soft spot, held red? (arm: ${arm})`, "", `command: ${VERIFY} --selftest`, "plant: none", ""];
  const d = fresh(arm);
  const bad = findByBytes(d, LETTER), twin = findByBytes(d, REFUSAL);
  const r = verify(d, ["--selftest"]);
  drop(d);
  section(t, "fixture search (by bytes, not by name)", `letter's sentence: ${bad || "no file"}\nrefusal (r1:90): ${twin || "no file"}`);
  runOutput(t, "selftest run", r);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const redOk = bad && new RegExp(`OK ${esc(bad)} fails .*must fail`).test(r.out);
  const greenOk = twin && new RegExp(`OK ${esc(twin)} passes .*must pass`).test(r.out);
  const result = bad ? `fixture ${bad} held red: ${redOk ? "yes" : "NO"}; twin ${twin || "none"} held green: ${greenOk ? "yes" : "NO"}; selftest exit ${r.code}` : `no such file; selftest exit ${r.code}`;
  section(t, "result", result);
  return { text: t.join("\n"), result, bad };
}

function q6(arm, bad) {
  const t = [`# Q6 · is the fixture real? (arm: ${arm})`, "", `command: ${VERIFY} --selftest`, `plants: one at a time on ${bad || "(no fixture: nothing to change)"}`, ""];
  if (!bad) {
    const d = fresh(arm); const r = verify(d, ["--selftest"]); drop(d);
    runOutput(t, "selftest run, nothing to plant", r);
    const result = `nothing to change; selftest exit ${r.code}`;
    section(t, "result", result);
    return { text: t.join("\n"), result };
  }
  const plants = [
    ["a", "delete it", (d) => { unlinkSync(join(d, bad)); return `deleted ${bad}`; }],
    ["b", "replace its sentence with the refusal", (d) => plant(d, bad, (s) => s.replace(LETTER, REFUSAL_SENTENCE), false)],
    ["c", "replace its sentence with a different endorsement", (d) => plant(d, bad, (s) => s.replace(LETTER, "Your filter closes that gap."), false)],
  ];
  let named = 0;
  const rows = [];
  for (const [id, title, apply] of plants) {
    const d = fresh(arm);
    const diff = apply(d);
    const r = verify(d, ["--selftest"]);
    drop(d);
    const hit = !r.harness && r.code !== 0 && r.out.split("\n").some((l) => /^\s+(?:PROBLEM|-) /.test(l) && l.includes(bad));
    if (hit) named++;
    rows.push(`(${id}) exit ${r.code}, names the file: ${hit ? "yes" : "NO"}`);
    section(t, `plant (${id}): ${title}`, diff);
    runOutput(t, `selftest run (${id})`, r);
  }
  const result = `exit non-zero naming the file ${named}/3; ${rows.join("; ")}`;
  section(t, "result", result);
  return { text: t.join("\n"), result };
}

// ------------------------------------------------------------------ main
// The unplanted run against the committed transcript: an extra failure is a plant (something was added to
// the arm), a missing one is a baseline defect (the checker no longer finds what it promised).
function unplantedAgainstTranscript(arm, live) {
  const p = join(REPO, `run-${arm}`, "Q1.txt");
  if (WRITE || !existsSync(p) || live.harness) return; // --write replaces the transcripts; expected.json still guards it
  const m = /## unplanted run\n\n([\s\S]*?)\n## result\n/.exec(lf(readFileSync(p, "utf8")));
  if (!m) return;
  const want = failureLines(m[1]), got = failureLines(live.out);
  const extra = newLines(want.join("\n"), got.join("\n")), missing = newLines(got.join("\n"), want.join("\n"));
  for (const l of extra) flags.plant.push(`${arm}: unexpected finding ${l.trim()}`);
  for (const l of missing) flags.baseline.push(`${arm}: promised finding missing ${l.trim()}`);
}
function verdict() {
  if (flags.harness.length) return "harness error";
  if (flags.plant.length) return "plant detected";
  if (flags.baseline.length) return "baseline defect";
  if (flags.integrity.length) return "integrity violation";
  return "pass";
}
function finish(result) {
  for (const [k, list] of Object.entries(flags)) for (const l of list) console.log(`  ${k}: ${l}`);
  console.log(`\nRESULT: ${result}`);
  process.exit(CODES[result]);
}

async function main() {
  const o = argv.indexOf("--out"), out = o >= 0 ? argv[o + 1] : null;
  const g = argv.indexOf("--gate"), gate = g >= 0 ? argv[g + 1] : null;
  const h = argv.indexOf("--heldout");
  if (h >= 0) {
    const r = runHeldout(argv[h + 1], out, gate);
    process.stdout.write(r.text + (r.text.endsWith("\n") ? "" : "\n"));
    process.exit(r.ok ? 0 : r.usage ? 1 : r.integrity ? CODES["integrity violation"] : CODES["harness error"]);
  }
  if (argv.includes("--live")) {
    // The sessions must be on their pins, and the report this prints must be the committed one.
    const pins = liveCheck();
    const r = runLive(out);
    process.stdout.write(r.text);
    const committed = join(REPO, "run-original", "live-round-3", "report.md");
    const same = out || (existsSync(committed) && lf(readFileSync(committed, "utf8")) === r.text);
    console.log(pins.text);
    if (!out) console.log(`run-original/live-round-3/report.md ${same ? "MATCH" : "DIFFERS from what this prints"}`);
    process.exit(!r.ok ? CODES["harness error"] : pins.ok && same ? 0 : CODES["integrity violation"]);
  }
  const EXPECTED = JSON.parse(readFileSync(join(REPO, "control", "expected.json"), "utf8"));
  for (const c of [pinCheck(), feedbackCheck(), receiptsCheck(), claimsCheck(), liveCheck(), readersCheck(), evidenceCheck()]) { console.log(c.text); if (!c.ok) flags.integrity.push(c.text); }
  const results = {}, texts = {};
  for (const arm of ARMS) {
    if (!existsSync(join(REPO, arm))) {
      // The brief's order: the rebuild does not exist before its own commit. An absent rebuild/ is a step not
      // yet taken, unless its transcripts are already here (then something was removed). original/ is always required.
      if (arm === "rebuild" && !existsSync(join(REPO, "run-rebuild"))) { console.log("rebuild/: not built yet at this commit (the brief's order: questions, then the original's run, then the rebuild)"); continue; }
      console.log(`${arm}/: ABSENT`); flags.integrity.push(`${arm}/ is absent`); continue;
    }
    const r1 = q1(arm);
    if (flags.harness.length) { console.log(`${arm}/: its checker hung or crashed on the first run; the other questions are not run on this arm`); continue; }
    const r5 = q5(arm);
    const qs = { Q1: r1, Q2: q2(arm), Q3: q3(arm), Q4: q4(arm), Q5: r5, Q6: q6(arm, r5.bad) };
    if (instrumentReady()) { qs.Q7 = q7(arm, flags); qs.Q8 = q8(arm, flags); }
    else console.log(`${arm} Q7, Q8: not run at this commit: their instrument is the rebuild's checker, which does not exist yet`);
    unplantedAgainstTranscript(arm, r1.unplanted);
    results[arm] = Object.fromEntries(Object.entries(qs).map(([k, v]) => [k, v.result]));
    texts[arm] = Object.fromEntries(Object.entries(qs).map(([k, v]) => [k, v.text]));
    for (const [k, got] of Object.entries(results[arm])) {
      const want = EXPECTED[arm] && EXPECTED[arm][k];
      const same = got === want;
      console.log(`${arm} ${k}: ${same ? "as promised" : "NOT AS PROMISED"}`);
      if (!same) { flags.baseline.push(`${arm} ${k} not as promised`); console.log(`   got:      ${got}\n   promised: ${want === undefined ? "(no entry in control/expected.json)" : want}`); }
    }
  }
  if (WRITE && verdict() !== "pass") {
    console.log("--write refused: the result would not be pass. Nothing written.");
    finish(verdict());
  }
  for (const arm of Object.keys(texts)) {
    const dir = join(REPO, `run-${arm}`);
    if (!WRITE && !existsSync(dir)) {
      // Before this arm's run is committed (the brief's order), there is nothing to compare yet.
      console.log(`run-${arm}/: not committed yet at this commit; the ${arm} results above are what it must hold`);
      continue;
    }
    if (WRITE) mkdirSync(dir, { recursive: true });
    for (const [k, text] of Object.entries(texts[arm])) {
      const p = join(dir, `${k}.txt`);
      if (WRITE) { writeAtomic(p, text + "\n"); console.log(`wrote run-${arm}/${k}.txt`); continue; }
      const onDisk = existsSync(p) ? lf(readFileSync(p, "utf8")) : null;
      const same = onDisk === text + "\n";
      console.log(`run-${arm}/${k}.txt ${onDisk === null ? "MISSING" : same ? "MATCH" : "DIFF"}`);
      if (!same) flags.integrity.push(`run-${arm}/${k}.txt ${onDisk === null ? "missing" : "differs from the live run"}`);
    }
  }
  for (const c of ARMS.every((a) => existsSync(join(REPO, a))) ? await corpus(REPO) : []) {
    console.log(c.line);
    for (const f of c.falseAlarms) console.log(`  false alarm ${f.file}:${f.line}  ${JSON.stringify(f.text.slice(0, 100))}`);
    if (c.falseAlarms.length) flags.baseline.push(`corpus: ${c.falseAlarms.length} false alarm(s) in ${c.label}`);
  }
  const cell = (arm, k) => (!results[arm] ? "(arm absent)" : results[arm][k] ?? "(not run at this commit)");
  const table = [
    "| Letter line | Question | original | rebuild |",
    "|---|---|---|---|",
    `| F1 | Q1 (and Q2) | ${cell("original", "Q1")}; Q2 ${cell("original", "Q2").split(":")[0]} | ${cell("rebuild", "Q1")}; Q2 ${cell("rebuild", "Q2").split(":")[0]} |`,
    `| F2 | Q3 (and Q4) | ${cell("original", "Q3")}; Q4 ${cell("original", "Q4").split(";").slice(0, 2).join(";")} | ${cell("rebuild", "Q3")}; Q4 ${cell("rebuild", "Q4").split(";").slice(0, 2).join(";")} |`,
    `| T | Q5 (and Q6) | ${cell("original", "Q5")}; Q6 ${cell("original", "Q6").split(";")[0]} | ${cell("rebuild", "Q5")}; Q6 ${cell("rebuild", "Q6").split(";")[0]} |`,
    `| F1, F2 on live answers | Q7 (and Q8) | ${cell("original", "Q7")}; Q8 ${cell("original", "Q8").split(" (")[0]} | ${cell("rebuild", "Q7")}; Q8 ${cell("rebuild", "Q8").split(" (")[0]} |`,
  ];
  console.log("");
  console.log(table.join("\n"));
  const resultsMd = join(REPO, "results.md");
  if (existsSync(resultsMd)) {
    const text = lf(readFileSync(resultsMd, "utf8"));
    const same = table.every((row) => text.includes(row));
    console.log(`results.md table: ${same ? "MATCH" : "DIFF"}`);
    if (!same) flags.integrity.push("results.md table differs from the live table");
  } else console.log("results.md: not checked here: the file does not exist yet (the table above is what it must carry)");
  finish(verdict());
}

try { await main(); } catch (e) { flags.harness.push(`run.mjs threw: ${e && e.stack || e}`); finish("harness error"); }
