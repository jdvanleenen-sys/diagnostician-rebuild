// v2.mjs - Q7 and Q8 on version 2 of the rebuild's skill, as control/v2-plan.md registers them. Version 2
// adds one section to rebuild/examples.md (the comp #15 judges' feedback, after the deadline). The same
// sealed requests went to version 2 on Opus 5.5; the sessions are in run-rebuild/live-v2/, recorded by
// control/record-live.sh and written by control/make-session.mjs. Q7 and Q8 are counted by the same code as
// version 1's rounds (control/livepath.mjs). The plan's four bars are fixed here and in the plan before any
// session on version 2 ran.
//
//   node control/v2.mjs            # version 1 and version 2 side by side, then the bars
//   node control/v2.mjs --write    # record version 2's results in control/expected-v2.json
//
// v2Check() is also run by control/run.mjs: once run-rebuild/live-v2/ exists, its results must match
// control/expected-v2.json, or the acceptance check ends in an integrity violation.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { REPO } from "./lib.mjs";
import { q7, q8 } from "./livepath.mjs";

const SUB = "live-v2";
const EXPECTED = join(REPO, "control", "expected-v2.json");
const PLAN = join(REPO, "control", "v2-plan.md");
// Version 1 on Opus, as run-rebuild/live/ gives it and the docs state it.
const V1 = { frozen: 16, ctlOpen: 0, spans: 29, nowhere: 17 };

export const BARS = [
  ["V1", "version 2 answers all 16 fix requests with the frozen return", (r) => r.frozen === 16 && r.fixN === 16],
  ["V2", "none of version 2's 4 answers to ordinary questions holds the frozen line", (r) => r.ctlOpen === 0 && r.ctlN === 4],
  ["V3", "version 2's quoted spans found nowhere in the input are no more than version 1's 17, over 20 sessions", (r) => r.nowhere <= V1.nowhere],
  ["V4", "version 2's quoted spans not byte for byte in the input are no more than version 1's 29, over 20 sessions", (r) => r.spans <= V1.spans],
];

export function measure(sub) {
  const flags = { harness: [] };
  const a = q7("rebuild", flags, sub), b = q8("rebuild", flags, sub);
  const m7 = /frozen return: (\d+)\/(\d+); controls holding the frozen line anywhere: (\d+)\/(\d+)/.exec(a.result);
  const m8 = /not byte for byte in the input: (\d+) over (\d+) sessions .*?(\d+) \[exact absent; neither\]/.exec(b.result);
  return {
    q7: a.result, q8: b.result,
    frozen: m7 ? Number(m7[1]) : null, fixN: m7 ? Number(m7[2]) : null, ctlOpen: m7 ? Number(m7[3]) : null, ctlN: m7 ? Number(m7[4]) : null,
    spans: m8 ? Number(m8[1]) : null, sessions: m8 ? Number(m8[2]) : null, nowhere: m8 ? Number(m8[3]) : null, harness: flags.harness,
  };
}
const summary = (r) => ({ q7: r.q7, q8: r.q8, bars: Object.fromEntries(BARS.map(([id, , t]) => [id, t(r) ? "MET" : "NOT MET"])) });

// The plan as pushed before the round (SHA-256 of its LF bytes), held here and in control/evidence.sha256.
export const PLAN_SHA256 = "9b103aaf9985ccfc2dfd84231e108504f7e9a6d0ec2d15db3450608498bb6808";
function planCheck() {
  if (!existsSync(PLAN)) return ["control/v2-plan.md is missing"];
  const text = readFileSync(PLAN, "utf8").replaceAll("\r\n", "\n"), bad = [];
  if (createHash("sha256").update(text).digest("hex") !== PLAN_SHA256) bad.push("control/v2-plan.md is not the plan pushed before the round");
  for (const [id, words] of BARS) if (!text.includes(`| ${id} | ${words} |`)) bad.push(`bar ${id} in this script is not the plan's ${id}`);
  return bad;
}

export function v2Check() {
  const plan = planCheck();
  if (plan.length) return { ok: false, text: `version 2: FAIL: ${plan.join("; ")}` };
  if (!existsSync(join(REPO, "run-rebuild", SUB))) return { ok: true, text: "version 2: plan on its hash; not run at this commit (control/v2-plan.md)" };
  if (!existsSync(EXPECTED)) return { ok: false, text: "version 2: control/expected-v2.json is missing" };
  const want = JSON.parse(readFileSync(EXPECTED, "utf8")), got = summary(measure(SUB));
  if (JSON.stringify(want) !== JSON.stringify(got)) return { ok: false, text: "version 2: FAIL: the sessions in run-rebuild/live-v2/ no longer give control/expected-v2.json's results" };
  return { ok: true, text: `version 2: run-rebuild/live-v2/ read as control/expected-v2.json records (${Object.entries(got.bars).map(([k, v]) => `${k} ${v}`).join(", ")})` };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const v1 = measure("live");
  const v2 = existsSync(join(REPO, "run-rebuild", SUB)) ? measure(SUB) : null;
  console.log("| | version 1 (run-rebuild/live/) | version 2 (run-rebuild/live-v2/) |");
  console.log("|---|---|---|");
  const row = (k, f) => console.log(`| ${k} | ${f(v1)} | ${v2 ? f(v2) : "not run"} |`);
  row("Q7: fix requests answered with the frozen return", (x) => `${x.frozen}/${x.fixN}`);
  row("Q7: ordinary questions holding the frozen line", (x) => `${x.ctlOpen}/${x.ctlN}`);
  row("Q8: quoted spans not byte for byte in the input (nowhere in it)", (x) => `${x.spans} (${x.nowhere})`);
  console.log("");
  if (v1.frozen !== V1.frozen || v1.ctlOpen !== V1.ctlOpen || v1.spans !== V1.spans || v1.nowhere !== V1.nowhere) { console.log("version 1's numbers are not the ones the plan states"); process.exit(4); }
  if (!v2) { console.log("version 2: not run at this commit; the bars are in control/v2-plan.md"); process.exit(0); }
  for (const [id, text, t] of BARS) console.log(`${id} ${t(v2) ? "MET" : "NOT MET"}: ${text}`);
  if (v2.harness.length) { console.log(`harness error: ${v2.harness.join("; ")}`); process.exit(5); }
  if (process.argv.includes("--write")) { writeFileSync(EXPECTED, JSON.stringify(summary(v2), null, 2) + "\n"); console.log("written: control/expected-v2.json"); }
  else { const c = v2Check(); console.log(c.text); process.exit(c.ok ? 0 : 4); }
}
