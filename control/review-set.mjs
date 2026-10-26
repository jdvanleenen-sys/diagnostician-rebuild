// review-set.mjs - the shipped endorsement gate on run-rebuild/review-r7/set.md: every single-line sentence
// the round-7 reviewers wrote against the gate of commit 32720c4. Each sentence is read alone, in the
// message-2 section of a receipt (as the selftest reads variants.md). Commit 10 changed the gate after these
// were read, so this is not held-out evidence: it shows what the shipped gate still misses.
//
//   node control/review-set.mjs          # every sentence with its result, then the totals
//
// reviewSetCheck() is also run by control/run.mjs: evidence.md must state the totals this prints.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { REPO } from "./lib.mjs";

const SET = join(REPO, "run-rebuild", "review-r7", "set.md");

export async function score() {
  const { scanReceipt } = await import(pathToFileURL(join(REPO, "rebuild", "tests", "gates", "endorsement.mjs")).href);
  const rows = readFileSync(SET, "utf8").replaceAll("\r\n", "\n").split("\n").filter((l) => /^[EC] \| /.test(l)).map((l) => {
    const [mark, who, ...rest] = l.split(" | ");
    const sentence = rest.join(" | ");
    const caught = scanReceipt({ rel: "set", text: `VERBATIM OUTPUT BELOW\n\n## Response to message 2\n\n${sentence}\n` }).length > 0;
    return { mark, who, sentence, caught };
  });
  const e = rows.filter((r) => r.mark === "E"), c = rows.filter((r) => r.mark === "C");
  const line = `the shipped gate caught ${e.filter((r) => r.caught).length} of the reviewers' ${e.length} endorsing sentences and flagged ${c.filter((r) => r.caught).length} of their ${c.length} clean ones`;
  return { rows, line };
}

export async function reviewSetCheck() {
  if (!existsSync(SET)) return { ok: true, text: "review set: not committed at this commit" };
  const { line } = await score();
  const ev = existsSync(join(REPO, "evidence.md")) ? readFileSync(join(REPO, "evidence.md"), "utf8").replaceAll("\r\n", "\n").replace(/\s+/g, " ") : "";
  const ok = ev.includes(line);
  return { ok, text: ok ? `review set: ${line}, as evidence.md states` : `review set: FAIL: evidence.md does not state "${line}"` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { rows, line } = await score();
  for (const r of rows) console.log(`${r.mark} ${r.mark === "E" ? (r.caught ? "caught" : "MISSED") : r.caught ? "FLAGGED" : "clean "} | ${r.who} | ${r.sentence}`);
  console.log(`\n${line}`);
}
