// make-session.mjs - turn one folder written by control/record-live.sh into a session file in the form of
// run-*/live/session-*.md, so control/run.mjs and control/second-model.mjs can read it. Nothing in the two
// responses is changed: each is the result field of t1.json or t2.json, with CRLF made LF.
//
//   node control/make-session.mjs <record-live output folder> <session file to write>
//   node control/make-session.mjs run-new/rebuild.F01.20261026T190000Z run-rebuild/live-sonnet/session-F01-1.md

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error("usage: node control/make-session.mjs <record-live folder> <session file>"); process.exit(2); }
const read = (f) => readFileSync(join(src, f), "utf8").trim();
const name = /^session-([FC]\d\d)-(\d)\.md$/.exec(basename(out));
const [arm, req] = basename(src).split(".");
if (!name || name[1] !== req || !["original", "rebuild"].includes(arm)) { console.error(`${out} does not match ${basename(src)} (want session-${req}-<rep>.md)`); process.exit(2); }
const t1 = JSON.parse(read("t1.json")), t2 = JSON.parse(read("t2.json"));
if (t1.is_error || t2.is_error || typeof t1.result !== "string" || typeof t2.result !== "string") { console.error(`${src}: a turn did not complete; no session written`); process.exit(3); }
const model = existsSync(join(src, "model")) ? read("model") : "opus";
const models = (j) => Object.entries(j.modelUsage ?? {}).map(([k, v]) => `${k} (${v.outputTokens} output tokens)`).join(", ");
const cost = (j) => (typeof j.total_cost_usd === "number" ? `US$${j.total_cost_usd.toFixed(4)}` : "not reported");
const kind = req.startsWith("F") ? "fix request" : "control: not a fix request";
const lines = [
  `# Live path (comp #15): ${arm} arm, sealed request ${req} (${kind}), repetition ${name[2]} of 2`,
  ``,
  `Runtime: Claude Code CLI, \`claude -p\`, \`--model ${model}\`; the result JSON names the model (turn 1: ${models(t1)};`,
  `turn 2: ${models(t2)}; the haiku entry, if any, is the harness's own side call). Run ${read("t1.start")} to ${read("done")} (UTC).`,
  `Session id: ${read("uuid")}. Cost as the CLI reported it: turn 1 ${cost(t1)}, turn 2 ${cost(t2)}.`,
  `Standing instruction: the arm's README install block, exactly, as \`--system-prompt\`; \`--setting-sources ""\` and`,
  `\`--strict-mcp-config\`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session`,
  `ran in a temporary copy of the ${arm} arm's product files with \`tests/\` and \`CHANGELOG.md\` removed. Message 1 is round 1's`,
  `message 1, exact (lines 5 to 102 of \`round-1-input.md\`). Message 2 is sealed request ${req}, exact:`,
  ``,
  ...read("message-2.md").split("\n").map((l) => (l ? `> ${l}` : ">")),
  ``,
  `Turn 1: \`claude -p --setting-sources "" --strict-mcp-config --model ${model} --session-id <uuid> --system-prompt "<install block>"`,
  `--output-format json\`; turn 2 the same with \`--resume <uuid>\` and no system prompt. Each response below is the JSON`,
  `result field, byte for byte. Nothing was edited.`,
  ``,
  `VERBATIM OUTPUT BELOW`,
  `---`,
  ``,
  `## Response to message 1`,
  ``,
  t1.result.replace(/\r\n/g, "\n").trimEnd(),
  ``,
  `## Response to message 2`,
  ``,
  t2.result.replace(/\r\n/g, "\n").trimEnd(),
  ``,
];
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, lines.join("\n"));
console.log(`written: ${out}`);
