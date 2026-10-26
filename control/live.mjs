// live.mjs - the live round 3 sessions (Fable, 2026-10-24; the skill files were the original's), run-original/live-round-3/session-*.md, read by both arms' checkers through
// the public path. Each session answers round 1's two messages, so in a fresh copy of each arm the session
// replaces tests/receipts/round-1-output.md (round-1-input.md is then its pinned input), the copy is
// re-pinned, and the arm's own `node tests/verify.mjs` runs. Every failure line that names round-1-output.md
// is reported with its line number; nothing is subtracted, because the whole file is new. Read-only: the arms
// and the sessions are not changed. Called by control/run.mjs --live [--out <report.md>].

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO, drop, folderSha256, fresh, lf, repin, sha256, verify, writeAtomic } from "./lib.mjs";

const ARMS = ["original", "rebuild"];
const R1 = "tests/receipts/round-1-output.md";
export const LIVE_DIR = "run-original/live-round-3";
const MARKER = "VERBATIM OUTPUT BELOW";

function header(text) {
  const lines = lf(text).split("\n");
  const at = lines.findIndex((l) => l.startsWith(MARKER));
  const line = (re) => { const m = re.exec(lines.find((l) => re.test(l)) || ""); return m ? m[0] : ""; };
  const resp2 = lines.findIndex((l) => l.trim() === "## Response to message 2") + 1;
  return { marker: at + 1, resp2, runtime: line(/^Runtime: [^;]*/), session: line(/Session id: [0-9a-f-]{36}/) };
}
// One session on one arm: the session as round 1's receipt, re-pinned, the arm's own checker.
function scanWith(arm, sessionText) {
  const d = fresh(arm);
  const p = join(d, R1);
  const eol = readFileSync(p, "utf8").includes("\r\n") ? "\r\n" : "\n";
  writeFileSync(p, lf(sessionText).replaceAll("\n", eol));
  repin(d);
  const r = verify(d);
  drop(d);
  const lines = r.out.split("\n").filter((l) => /^\s+- \[/.test(l) && l.includes("round-1-output.md")).map((l) => l.trim().replace(/^- /, ""));
  return { code: r.code, harness: r.harness, verdict: (r.out.split("\n").find((l) => /^(?:RED|GREEN)/.test(l)) || "").trim(), lines };
}

export function runLive(outPath) {
  const t = [];
  const say = (s = "") => t.push(s);
  const dir = join(REPO, LIVE_DIR);
  const files = existsSync(dir) ? readdirSync(dir).filter((n) => /^session-\d+\.md$/.test(n)).sort() : [];
  say(`# Live round 3, read by both arms' checkers: \`node control/run.mjs --live\``);
  say();
  say(`- sessions: ${files.length ? files.map((f) => `${LIVE_DIR}/${f}`).join(", ") : `none in ${LIVE_DIR}/`}`);
  say(`- checker: SHA-256 of rebuild/tests/ = ${folderSha256(join(REPO, "rebuild", "tests"))}`);
  say(`- method: in a fresh copy of each arm the session replaces ${R1} (round-1-input.md is its pinned input), the copy is re-pinned, \`node tests/verify.mjs\` runs; every failure naming round-1-output.md is listed`);
  if (!files.length) return { text: t.join("\n") + "\n", ok: false };
  for (const arm of ARMS) if (!existsSync(join(REPO, arm))) { say(`- ${arm}/: ABSENT`); return { text: t.join("\n") + "\n", ok: false }; }
  const totals = {};
  for (const f of files) {
    const text = readFileSync(join(dir, f), "utf8");
    const h = header(text);
    say();
    say(`## ${f}`);
    say();
    say(`- SHA-256 ${sha256(Buffer.from(lf(text)))} (LF); ${h.runtime || "(no Runtime line)"}; ${h.session || "(no Session id line)"}`);
    say(`- VERBATIM marker at line ${h.marker || "(none: both gates fail closed)"}; "## Response to message 2" at line ${h.resp2 || "(none)"}`);
    for (const arm of ARMS) {
      const r = scanWith(arm, text);
      totals[arm] = (totals[arm] || 0) + r.lines.length;
      say();
      say(`### ${arm}/ checker: exit ${r.code}${r.harness ? ` (HARNESS ERROR: ${r.harness})` : ""}; ${r.verdict || "(no verdict line)"}; ${r.lines.length} finding(s) on the session`);
      for (const l of r.lines) {
        const m = /round-1-output\.md:(\d+):/.exec(l);
        const where = m && h.resp2 ? (+m[1] >= h.resp2 ? " (in the response to message 2)" : " (in the response to message 1)") : "";
        say(`- ${l}${where}`);
      }
    }
  }
  say();
  say(`## Totals: ${ARMS.map((a) => `${a}/ ${totals[a] || 0} finding(s)`).join("; ")} across ${files.length} session(s)`);
  const text = t.join("\n") + "\n";
  if (outPath) writeAtomic(outPath, text);
  return { text, ok: true };
}
