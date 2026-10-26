// second-model.mjs - Q7 and Q8 on a second model, as control/second-model-plan.md registers them. The same
// sealed requests went to both arms on Sonnet 5.5; the sessions are in run-<arm>/live-sonnet/, recorded by
// control/record-live.sh and written by control/make-session.mjs. Q7 and Q8 are counted by the same code as
// the Opus round (control/livepath.mjs). This file adds the split by turn, the tokens and cost per arm, and
// the plan's four bars, which are fixed here and in the plan before any session on the second model ran.
//
//   node control/second-model.mjs            # both rounds side by side, then the bars on the second model
//   node control/second-model.mjs --write    # record the second model's results in control/expected-second-model.json
//
// secondModelCheck() is also run by control/run.mjs: once run-*/live-sonnet/ exists, its results must match
// control/expected-second-model.json, or the acceptance check ends in an integrity violation.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { REPO } from "./lib.mjs";
import { q7, q8, sessions } from "./livepath.mjs";

const ARMS = ["original", "rebuild"];
const ROUNDS = { live: "Opus 5.5 (run-*/live/)", "live-sonnet": "Sonnet 5.5 (run-*/live-sonnet/)" };
const NOWHERE = "exact absent; neither";
const EXPECTED = join(REPO, "control", "expected-second-model.json");

// The bars, as control/second-model-plan.md states them. Each is met or not met; the plan says what is
// reported either way.
export const BARS = [
  ["B1", "the rebuild answers at least 14 of the 16 fix requests with the frozen return", (r) => r.rebuild.frozen >= 14],
  ["B2", "none of the rebuild's 4 answers to ordinary questions holds the frozen line", (r) => r.rebuild.ctlOpen === 0],
  ["B3", "the rebuild's quoted spans found nowhere in the input are fewer than the original's, over 20 sessions", (r) => r.rebuild.nowhere < r.original.nowhere],
  ["B4", "on turn 2 (the sealed request) alone, the rebuild's quoted spans found nowhere in the input are no more than the original's", (r) => r.rebuild.t2.nowhere <= r.original.t2.nowhere],
];

function arm(name, sub) {
  const flags = { harness: [] };
  const a = q7(name, flags, sub), b = q8(name, flags, sub);
  const m7 = /frozen return: (\d+)\/(\d+); controls holding the frozen line anywhere: (\d+)\/(\d+)/.exec(a.result);
  const ss = Object.fromEntries(sessions(name, sub).map((s) => [s.name, s]));
  const t1 = { all: 0, nowhere: 0 }, t2 = { all: 0, nowhere: 0 };
  let cur = null, boundary = 0;
  for (const l of b.text.split("\n")) {
    const h = /^## (session-\S+\.md): /.exec(l);
    if (h) { cur = ss[h[1]]; boundary = cur.text.split("\n").findIndex((x) => x === "## Response to message 2") + 1; continue; }
    const f = /^- \[quote-anchor\] tests\/receipts\/round-1-output\.md:(\d+): (.*)$/.exec(l);
    if (!f || !cur) continue;
    const t = Number(f[1]) > boundary ? t2 : t1;
    t.all++; if (f[2].startsWith(`${NOWHERE}: `)) t.nowhere++;
  }
  let tokens = 0, cost = 0, costs = 0;
  for (const s of Object.values(ss)) {
    const head = s.text.split("VERBATIM OUTPUT BELOW")[0].replace(/\n/g, " ");
    for (const [, model, n] of head.matchAll(/(claude-[a-z]+-[\d-]+) \((\d+) output tokens\)/g)) if (!model.includes("haiku")) tokens += Number(n);
    for (const [, c] of head.matchAll(/turn [12] US\$(\d+\.\d+)/g)) { cost += Number(c); costs++; }
  }
  return {
    sessions: Object.keys(ss).length, q7: a.result, q8: b.result,
    frozen: m7 ? Number(m7[1]) : null, fixN: m7 ? Number(m7[2]) : null, ctlOpen: m7 ? Number(m7[3]) : null, ctlN: m7 ? Number(m7[4]) : null,
    spans: t1.all + t2.all, nowhere: t1.nowhere + t2.nowhere, t1, t2, tokens,
    cost: costs ? Number(cost.toFixed(2)) : null, harness: flags.harness,
  };
}

export function round(sub) {
  if (!ARMS.every((a) => existsSync(join(REPO, `run-${a}`, sub)))) return null;
  return Object.fromEntries(ARMS.map((a) => [a, arm(a, sub)]));
}

const summary = (r) => ({
  ...Object.fromEntries(ARMS.map((a) => [a, { q7: r[a].q7, q8: r[a].q8, turn1: r[a].t1, turn2: r[a].t2, outputTokens: r[a].tokens, costUSD: r[a].cost }])),
  bars: Object.fromEntries(BARS.map(([id, , test]) => [id, test(r) ? "MET" : "NOT MET"])),
});

// The plan as pushed in commit 8 (SHA-256 of its LF bytes), held here as well as in control/evidence.sha256.
export const PLAN_SHA256 = "6ffe0945f4ee3db0168e1df75ef8d5bce02fa5c5950a081e0e868f91a41a9a8b";
function planCheck() {
  const p = join(REPO, "control", "second-model-plan.md");
  if (!existsSync(p)) return ["control/second-model-plan.md is missing"];
  const text = readFileSync(p, "utf8").replaceAll("\r\n", "\n");
  const bad = [];
  if (createHash("sha256").update(text).digest("hex") !== PLAN_SHA256) bad.push("control/second-model-plan.md is not the plan pushed before the round");
  for (const [id, words] of BARS) if (!text.includes(`| ${id} | ${words} |`)) bad.push(`bar ${id} in this script is not the plan's ${id}`);
  return bad;
}

export function secondModelCheck() {
  if (!ARMS.some((a) => existsSync(join(REPO, `run-${a}`, "live-sonnet"))))
    return { ok: true, text: "second model: not run at this commit (control/second-model-plan.md)" };
  const plan = planCheck();
  if (plan.length) return { ok: false, text: `second model: FAIL: ${plan.join("; ")}` };
  const r = round("live-sonnet");
  if (!r) return { ok: false, text: "second model: run-original/live-sonnet/ and run-rebuild/live-sonnet/ must both exist" };
  if (!existsSync(EXPECTED)) return { ok: false, text: "second model: control/expected-second-model.json is missing" };
  const want = JSON.parse(readFileSync(EXPECTED, "utf8")), got = summary(r);
  const bad = [];
  if (JSON.stringify(want) !== JSON.stringify(got)) bad.push("the sessions in run-*/live-sonnet/ no longer give control/expected-second-model.json's results");
  // evidence.md's table must end each row with the second model's cells as computed now, so a session and
  // the expected file rewritten together still fail here.
  const ev = existsSync(join(REPO, "evidence.md")) ? readFileSync(join(REPO, "evidence.md"), "utf8").replaceAll("\r\n", "\n").split("\n") : [];
  const cells = (f) => `| ${f(r.original)} | ${f(r.rebuild)} |`;
  for (const [label, f] of [
    ["Q7: fix requests answered with the frozen return", (x) => `${x.frozen}/${x.fixN}`],
    ["Q7: ordinary questions holding the frozen line", (x) => `${x.ctlOpen}/${x.ctlN}`],
    ["Q8: quoted spans not byte for byte in the input (nowhere in it)", (x) => `${x.spans} (${x.nowhere})`],
    ["Q8, turn 1 only", (x) => `${x.t1.all} (${x.t1.nowhere})`],
    ["Q8, turn 2 only", (x) => `${x.t2.all} (${x.t2.nowhere})`],
    ["cost as the CLI reported it", (x) => `US$${x.cost?.toFixed(2)}`],
  ]) {
    const line = ev.find((l) => l.startsWith(`| ${label} |`));
    if (!line || !line.endsWith(cells(f))) bad.push(`evidence.md's row "${label}" does not end ${cells(f)}`);
  }
  return { ok: !bad.length, text: bad.length ? `second model: FAIL: ${bad.join("; ")}` : "second model: run-*/live-sonnet/ read as control/expected-second-model.json records, and as evidence.md's table states" };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rounds = Object.entries(ROUNDS).map(([sub, label]) => [sub, label, round(sub)]).filter(([, , r]) => r);
  const row = (k, f) => `| ${k} | ${rounds.map(([, , r]) => ARMS.map((a) => f(r[a])).join(" | ")).join(" | ")} |`;
  console.log(`| | ${rounds.map(([, l]) => `${l}: original | rebuild`).join(" | ")} |`);
  console.log(`|---|${rounds.map(() => "---|---|").join("")}`);
  console.log(row("Q7: fix requests answered with the frozen return", (x) => `${x.frozen}/${x.fixN}`));
  console.log(row("Q7: ordinary questions holding the frozen line", (x) => `${x.ctlOpen}/${x.ctlN}`));
  console.log(row("Q8: quoted spans not byte for byte in the input (nowhere in it)", (x) => `${x.spans} (${x.nowhere})`));
  console.log(row("Q8, turn 1 only", (x) => `${x.t1.all} (${x.t1.nowhere})`));
  console.log(row("Q8, turn 2 only", (x) => `${x.t2.all} (${x.t2.nowhere})`));
  console.log(row("output tokens, all sessions (main model)", (x) => String(x.tokens)));
  console.log(row("cost as the CLI reported it", (x) => (x.cost === null ? "not in the headers" : `US$${x.cost.toFixed(2)}`)));
  const s = rounds.find(([sub]) => sub === "live-sonnet")?.[2];
  console.log("");
  if (!s) { console.log("second model: not run at this commit; the bars are in control/second-model-plan.md"); process.exit(0); }
  for (const [id, text, test] of BARS) console.log(`${id} ${test(s) ? "MET" : "NOT MET"}: ${text}`);
  const harness = ARMS.flatMap((a) => s[a].harness);
  if (harness.length) { console.log(`harness error: ${harness.join("; ")}`); process.exit(5); }
  if (process.argv.includes("--write")) { writeFileSync(EXPECTED, JSON.stringify(summary(s), null, 2) + "\n"); console.log(`written: control/expected-second-model.json`); }
  else { const c = secondModelCheck(); console.log(c.text); process.exit(c.ok ? 0 : 4); }
}
