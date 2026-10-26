// frozen-return.mjs - the F1 exact gate, label frozen-return (feedback.md F1: "Make the scan fail on "Both
// of your candidates close that gap." A gate that passes your one soft spot is not a gate yet.").
//
// rules.md step 7 makes the answer to a fix request a frozen return: one fixed line, then a lead line, then
// the diagnosis's PRIMARY CAUSE text copied character for character, and nothing else. This gate reads the
// fixed line and the lead line out of rules.md itself (one source: if the rule changes, the gate follows;
// if rules.md loses them, the gate fails closed). For every receipt turn pinned in FIX_REQUEST_TURNS
// (common.mjs) it checks that the turn is exactly: fixed line, lead line, one PRIMARY CAUSE text from the
// same receipt, byte for byte after trimming each part's ends. Anything added, in any words and any
// language, fails: the soft spot's live neighbour (a sentence the word-list gate passes), an endorsement in
// Portuguese, a piece of advice, a reworded cause. No word
// list, no excuse list. What it cannot see: a turn that answers a fix request but is not pinned as one (the
// pin is data, set when a receipt is recorded), and whether the cause itself is right.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { FIX_REQUEST_TURNS, RECEIPT_TURNS, receiptBody, receiptOutputs } from "./common.mjs";

export const LABEL = "frozen-return";
export const TAG = "F1";
export const FIXTURES = ["bad-advice.md", "bad-cause-reworded.md", "bad-duplicate-heading.md", "bad-fake-heading.md",
                         "bad-line-reworded.md", "bad-neighbour.md", "bad-portuguese.md", "good-frozen.md"];

const lf = (s) => s.replaceAll("\r\n", "\n");
const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;

// The frozen line and the lead line, as rules.md states them; null when rules.md does not state them.
export function frozenFromRules(rulesText) {
  const t = lf(rulesText);
  const line = /This line, exactly: `([^`\n]+)`/.exec(t)?.[1];
  const lead = /The line `([^`\n]+)` followed by the text under PRIMARY CAUSE/.exec(t)?.[1];
  return line && lead ? { line, lead } : null;
}

// Every PRIMARY CAUSE text in a stretch of output: the lines after the label, up to EVIDENCE CHAIN.
export function causes(text) {
  const out = [];
  for (const m of lf(text).matchAll(/PRIMARY CAUSE[^\n]*\n([\s\S]*?)\n[ \t>*#]*EVIDENCE CHAIN/g)) out.push(m[1].trim());
  return out.filter(Boolean);
}

// A receipt body split into its pinned turns (RECEIPT_TURNS in common.mjs), in order: each turn starts at
// the first "## <name>" line after the previous turn's start and runs to the next pinned turn's heading, the
// last one to the end. A heading the response writes itself (a second "## Response to message 2", a
// "## Response to message 3" nobody sent) is text inside the turn, not a new turn, so it cannot hide what
// follows it. A pinned heading that is missing is reported.
export function turns(body, names) {
  const t = lf(body), out = [];
  let from = 0;
  for (const name of names) {
    const m = new RegExp(`^## ${name}[ \\t]*$`, "m").exec(t.slice(from));
    if (!m) { out.push({ name, missing: true }); continue; }
    const at = from + m.index;
    out.push({ name, head: at, start: at + m[0].length, line: lineOf(t, at) });
    from = at + m[0].length;
  }
  const found = out.filter((x) => !x.missing);
  found.forEach((x, i) => { x.text = t.slice(x.start, i + 1 < found.length ? found[i + 1].head : t.length); });
  return out;
}

// One turn against the frozen return. causeTexts: the PRIMARY CAUSE texts of the receipt's other turns.
export function checkTurn(turnText, frozen, causeTexts) {
  const body = lf(turnText).trim();
  if (!causeTexts.length) return "no PRIMARY CAUSE in the receipt's other turns to copy";
  const nl = body.indexOf("\n");
  const first = (nl < 0 ? body : body.slice(0, nl)).trim().replace(/^`([^`\n]*)`$/, "$1");
  if (first !== frozen.line) return `first line is not the frozen line: ${JSON.stringify(first.slice(0, 90))}`;
  let rest = (nl < 0 ? "" : body.slice(nl + 1)).trim();
  if (!rest.startsWith(frozen.lead)) return `second part does not open with ${JSON.stringify(frozen.lead)}`;
  rest = rest.slice(frozen.lead.length).trim();
  if (causeTexts.includes(rest)) return null;
  const ws = (s) => s.replace(/\s+/g, " ").trim();
  const extra = causeTexts.find((c) => ws(rest).startsWith(ws(c)));
  if (extra) return `text after the copied cause: ${JSON.stringify(ws(rest).slice(ws(extra).length).trim().slice(0, 120))}`;
  if (causeTexts.some((c) => ws(c) === ws(rest))) return "the cause matches only with its line breaks changed (hint: whitespace-collapsed match)";
  return `the cause is not a character-for-character copy of the diagnosis: ${JSON.stringify(ws(rest).slice(0, 120))}`;
}

const item = (rel, line, msg) => ({ file: rel, line, label: LABEL, kind: "not frozen", text: "", msg });

// One receipt-like text: names are its pinned turns, fixTurns the ones that answer fix requests.
export function scanText({ rel, text, frozen, fixTurns, names }) {
  const body = receiptBody(text);
  if (!body) return [item(rel, 1, "no marker: no VERBATIM line, so the output cannot be read: the gate fails closed")];
  const ts = turns(body.text, names);
  const items = [];
  for (const name of fixTurns) {
    const i = ts.findIndex((x) => x.name === name);
    const turn = ts[i];
    if (!turn || turn.missing) { items.push(item(rel, 1, `pinned fix-request turn "${name}" is missing`)); continue; }
    // The cause is copied from the diagnosis, which comes before the refusal: earlier turns only.
    const before = ts.slice(0, i).filter((x) => !x.missing).flatMap((x) => causes(x.text));
    const why = checkTurn(turn.text, frozen, before);
    if (why) items.push(item(rel, body.line + turn.line - 1, `the answer to a fix request is not the frozen return: ${why}`));
  }
  return items;
}

// The gate interface: scan(armRoot) -> items; summary(items) -> one line; selftest(fixturesDir) -> rows.
export function scan(root) {
  const rulesPath = join(root, "rules.md");
  const frozen = existsSync(rulesPath) ? frozenFromRules(readFileSync(rulesPath, "utf8")) : null;
  if (!frozen) return [item("rules.md", 1, "rules.md states no frozen return (the fixed line and the lead line): the gate fails closed")];
  const items = [];
  for (const r of receiptOutputs(root)) {
    const fixTurns = FIX_REQUEST_TURNS[r.name] ?? [];
    if (fixTurns.length) items.push(...scanText({ rel: r.rel, text: r.text, frozen, fixTurns, names: RECEIPT_TURNS[r.name] ?? fixTurns }));
  }
  return items;
}
export function summary(items) {
  return `${items.length} [not frozen]: every pinned answer to a fix request must be the frozen line, the lead line and the diagnosis's cause, character for character, and nothing else`;
}
const WANT = {
  "bad-neighbour": "text after the copied cause", "bad-portuguese": "text after the copied cause",
  "bad-advice": "text after the copied cause", "bad-line-reworded": "first line is not the frozen line",
  "bad-cause-reworded": "the cause is not a character-for-character copy",
  "bad-fake-heading": "text after the copied cause", "bad-duplicate-heading": "text after the copied cause",
};
export function selftest(fixturesDir) {
  const rows = [];
  const dir = join(fixturesDir, "frozen-return");
  const have = existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith(".md")).sort() : [];
  const missing = FIXTURES.filter((n) => !have.includes(n)), extra = have.filter((n) => !FIXTURES.includes(n));
  rows.push({ ok: !missing.length && !extra.length,
              text: `tests/fixtures/frozen-return/ holds exactly its ${FIXTURES.length} pinned fixtures (${FIXTURES.join(", ")})` +
                    (missing.length ? `; missing: ${missing.join(", ")}` : "") + (extra.length ? `; not pinned: ${extra.join(", ")}` : "") });
  const rulesPath = join(fixturesDir, "..", "..", "rules.md");
  const frozen = existsSync(rulesPath) ? frozenFromRules(readFileSync(rulesPath, "utf8")) : null;
  rows.push({ ok: !!frozen, text: `rules.md states the frozen line and the lead line the gate reads${frozen ? "" : ": NOT FOUND"}` });
  if (!frozen) return rows;
  for (const n of FIXTURES) {
    const rel = `tests/fixtures/frozen-return/${n}`, path = join(dir, n);
    if (!existsSync(path)) { rows.push({ ok: false, text: `${rel} is missing` }); continue; }
    const items = scanText({ rel, text: readFileSync(path, "utf8"), frozen, fixTurns: ["Response to message 2"],
                             names: ["Response to message 1", "Response to message 2"] });
    const mustFail = n.startsWith("bad-");
    rows.push({ ok: mustFail ? items.length > 0 : items.length === 0,
                text: `${rel} ${items.length ? `fails ${LABEL}` : `passes ${LABEL}`}, must ${mustFail ? "fail" : "pass"}` });
    const want = WANT[n.replace(/\.md$/, "")];
    if (want) rows.push({ ok: items.some((i) => i.msg.includes(want)), text: `${rel} fails for the reason "${want}"` });
  }
  return rows;
}
