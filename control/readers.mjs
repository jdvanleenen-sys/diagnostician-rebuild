// readers.mjs - the blind readers' verdicts on the 40 live-path answers, unblinded and tallied per arm.
// Two AI readers (Opus 5.5 and Sonnet 5.5, not people) saw only run-rebuild/live-readers/turn2-pack.md: each
// answer to message 2 with the owner's message, shuffled, labelled L01..L40, arm not shown. key.json maps each
// label to its session file. The rebuild's 16 answers to fix requests all open with the same fixed line, so a
// reader can tell them apart on sight; the informative cells are the original's. This measure was added after
// the live round (the lab's pre-set P2 questions); Q7's committed measure is the frozen form.
//
//   node control/readers.mjs          # print the counts (and check the files)
//
// readersCheck() is also run by control/run.mjs: the four files must match their SHA256SUMS; the key must
// map 40 distinct labels to 40 distinct committed sessions; each table must hold each label exactly once;
// and each answer in the pack must be its session's response to message 2, byte for byte (LF).

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { REPO, lf } from "./lib.mjs";

const DIR = join(REPO, "run-rebuild", "live-readers");
const FILES = ["key.json", "reader-opus.md", "reader-sonnet.md", "turn2-pack.md"];
const COLS = ["CANDIDATES", "ENDORSES", "PICKS", "ADVICE", "ANSWERS"];
const shaLF = (buf) => createHash("sha256").update(Buffer.from(buf.toString("binary").replaceAll("\r\n", "\n"), "binary")).digest("hex");
const rowsOf = (reader) => lf(readFileSync(join(DIR, `reader-${reader}.md`), "utf8")).split("\n")
  .filter((l) => /^\|\s*L\d\d\s*\|/.test(l)).map((l) => l.split("|").map((s) => s.trim()));
const turn2 = (text) => { const i = text.indexOf("\n## Response to message 2\n"); return i < 0 ? null : text.slice(i + "\n## Response to message 2\n".length).trim(); };

export function readersCheck() {
  if (!existsSync(DIR)) return { ok: true, text: "readers: not checked here: run-rebuild/live-readers/ is not committed yet at this commit" };
  const bad = [];
  const sums = join(DIR, "SHA256SUMS");
  if (!existsSync(sums)) return { ok: false, text: "readers: run-rebuild/live-readers/SHA256SUMS is missing" };
  const want = Object.fromEntries(readFileSync(sums, "utf8").split("\n").filter((l) => l.trim()).map((l) => { const [h, ...f] = l.trim().split(/\s+/); return [f.join(" "), h]; }));
  for (const f of FILES) if (!existsSync(join(DIR, f)) || shaLF(readFileSync(join(DIR, f))) !== want[f]) bad.push(`${f} is off its SHA-256`);
  if (Object.keys(want).sort().join() !== [...FILES].sort().join()) bad.push("SHA256SUMS does not list exactly the four reader files");
  const key = JSON.parse(readFileSync(join(DIR, "key.json"), "utf8"));
  const labels = Object.keys(key), ids = Object.values(key);
  if (labels.length !== 40 || new Set(ids).size !== 40) bad.push(`key.json maps ${labels.length} labels to ${new Set(ids).size} distinct sessions (want 40 and 40)`);
  const pack = lf(readFileSync(join(DIR, "turn2-pack.md"), "utf8"));
  const items = Object.fromEntries(pack.split(/^## (L\d\d)\n/m).slice(1).reduce((a, x, i, arr) => (i % 2 ? a : [...a, [x, arr[i + 1]]]), []));
  for (const [label, id] of Object.entries(key)) {
    const [arm, file] = id.split("/");
    const p = join(REPO, `run-${arm}`, "live", file);
    if (!existsSync(p)) { bad.push(`${label} -> ${id} is not a committed session`); continue; }
    const answer = turn2(lf(readFileSync(p, "utf8")));
    const item = items[label] ?? "";
    const got = item.split("\nResponse:\n\n")[1]?.replace(/\n---\n*$/, "").trim();
    if (got !== answer) bad.push(`${label}: the pack's answer is not ${id}'s response to message 2`);
  }
  for (const reader of ["opus", "sonnet"]) {
    const seen = rowsOf(reader).map((r) => r[1]);
    const dup = seen.filter((l, i) => seen.indexOf(l) !== i), missing = labels.filter((l) => !seen.includes(l));
    if (dup.length || missing.length || seen.length !== 40) bad.push(`reader-${reader}.md: ${seen.length} rows${dup.length ? `, repeated ${dup.join(" ")}` : ""}${missing.length ? `, missing ${missing.join(" ")}` : ""}`);
  }
  return { ok: !bad.length, text: bad.length ? `readers: FAIL: ${bad.join("; ")}` : "readers: the four reader files on their pins; 40 labels, 40 sessions, every pack answer byte for byte its session's; each table covers each label once" };
}

export function tally() {
  const key = JSON.parse(readFileSync(join(DIR, "key.json"), "utf8"));
  const out = [];
  const verdicts = {};
  for (const reader of ["opus", "sonnet"]) {
    const agg = {};
    for (const r of rowsOf(reader)) {
      const id = key[r[1]];
      if (!id) continue;
      verdicts[`${reader} ${r[1]}`] = r.slice(3, 3 + COLS.length).map((v) => v.startsWith("YES"));
      const group = `${id.split("/")[0]}, ${/session-F/.test(id) ? "fix requests" : "ordinary questions"}`;
      const a = (agg[group] ??= { n: 0, ...Object.fromEntries(COLS.map((c) => [c, 0])) });
      a.n++;
      COLS.forEach((c, i) => { if (r[3 + i].startsWith("YES")) a[c]++; });
    }
    out.push(`## reader: ${reader}`, "", `| group | n | ${COLS.join(" | ")} |`, `|---|---|${COLS.map(() => "---").join("|")}|`);
    for (const g of Object.keys(agg).sort()) out.push(`| ${g} | ${agg[g].n} | ${COLS.map((c) => agg[g][c]).join(" | ")} |`);
    out.push("");
  }
  // How often the two readers gave the same verdict, per question, over the 40 answers.
  const labels = Object.keys(key);
  out.push("## agreement between the two readers (same verdict, of 40)", "", `| ${COLS.join(" | ")} |`, `|${COLS.map(() => "---").join("|")}|`,
    `| ${COLS.map((c, i) => labels.filter((l) => verdicts[`opus ${l}`]?.[i] === verdicts[`sonnet ${l}`]?.[i]).length).join(" | ")} |`, "");
  return out.join("\n");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const c = readersCheck();
  console.log(tally());
  console.log(c.text);
  process.exit(c.ok ? 0 : 1);
}
