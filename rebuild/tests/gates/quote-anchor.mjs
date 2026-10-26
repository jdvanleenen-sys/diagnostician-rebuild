// quote-anchor.mjs - the F2 gate, label quote-anchor (feedback.md F2: "Assert that every quoted anchor
// appears byte-for-byte in the pinned input.").
//
// Every double-quoted span (the pairs in PAIRS; HTML entities, named and numeric, are decoded first),
// every single-quoted span of two or more words and every backtick code span of two or more words in a
// receipt output must occur byte for byte in that round's pinned input. One code path for all three:
// Buffer.includes against the input's bytes. No normalisation decides pass or fail; NFC, whitespace and
// CRLF matches print as hints only. Each failing span is put in one of three heuristic buckets, named for
// the operation that places it: "exact match absent; normalised match present" when the span matches the
// input after collapsing whitespace, stripping markdown emphasis (* and _) and the punctuation around the
// span, and folding case; "exact absent; 3-word run present" when it does not, but a run of three or more
// consecutive words of the span occurs in the input; "exact absent; neither" otherwise (so a two-word span
// is never in the second bucket). The buckets describe operations, not causes: they do not say whether a
// span was meant as a quotation of the input or as an illustrative phrase (that reading is a human one,
// in evidence.md, section "F2: the 13 spans"). All three fail: rules.md's standing constraints say quotation marks
// mean an exact copy of the input, so a quoted span that is not one breaks the skill's own rule. Receipt outputs only; examples.md has no
// pinned input. A receipt with no VERBATIM marker fails closed ("no marker"). No excuse list.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { receiptBody, receiptOutputs } from "./common.mjs";

export const LABEL = "quote-anchor";
export const TAG = "F2";
export const PAIRS = { '"': ['"'], "“": ["”"], "‟": ["”", "“"], "«": ["»"], "»": ["«"], "‹": ["›"], "＂": ["＂"], "„": ["“", "”"], "「": ["」"], "『": ["』"] };
export const NORMALISED = "exact match absent; normalised match present";
export const RUN3 = "exact absent; 3-word run present";
export const NEITHER = "exact absent; neither";
export const KINDS = [NORMALISED, RUN3, NEITHER, "unpaired mark", "empty quote", "no input", "no marker"];
// This gate's fixture folder, pinned by name: a renamed, missing or unlisted file is a named failure.
export const FIXTURES = ["input.md", "bad-dropped-word.md", "bad-single-quoted.md", "bad-space.md", "bad-term.md", "bad-unpaired.md",
                         "bad-words-changed.md", "bad-wrap.md", "bad-corner.md", "bad-low-single.md", "bad-html5-entity.md", "bad-reversed-single.md", "good-curly.md", "good-exact.md", "good-single-quoted.md", "good-wrap.md"];
const MARKS = new Set([...Object.keys(PAIRS), "”", "›", "」", "』"]);
const NAMED = { "&quot;": '"', "&ldquo;": "“", "&rdquo;": "”", "&laquo;": "«", "&raquo;": "»",
                "&lsquo;": "‘", "&rsquo;": "’", "&sbquo;": "‚", "&bdquo;": "„",
                "&opencurlydoublequote;": "“", "&closecurlydoublequote;": "”", "&opencurlyquote;": "‘", "&closecurlyquote;": "’" };
const SQ_SPAN = /(?<![\p{L}\p{N}])['‘‚‛＇]([^'‘’‚‛＇\n]+?)['’‘＇](?![\p{L}\p{N}])/gu;
const BT_SPAN = /`([^`\n]+)`/g;

const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;
const codePoint = (n, m) => (n <= 0x10ffff ? String.fromCodePoint(n) : m);
const decode = (text) => text.replace(/&(?:quot|ldquo|rdquo|laquo|raquo|lsquo|rsquo|sbquo|bdquo|OpenCurlyDoubleQuote|CloseCurlyDoubleQuote|OpenCurlyQuote|CloseCurlyQuote);|&#(\d+);|&#x([0-9a-f]+);/gi,
  (m, d, h) => (d ? codePoint(+d, m) : h ? codePoint(parseInt(h, 16), m) : NAMED[m.toLowerCase()] ?? m));

export function doubleSpans(text) {
  const spans = [], unpaired = [];
  let open = -1;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (!MARKS.has(c)) continue;
    if (open >= 0 && PAIRS[text[open]].includes(c)) {
      spans.push({ start: open, end: i + 1, inner: text.slice(open + 1, i) });
      open = -1;
      continue;
    }
    if (open >= 0) unpaired.push(open);
    if (PAIRS[c]) open = i; else { unpaired.push(i); open = -1; }
  }
  if (open >= 0) unpaired.push(open);
  return { spans, unpaired };
}

// The stated rule, in code. fmt: whitespace collapsed, * and _ removed, surrounding punctuation dropped, case folded.
const fmt = (s) => s.replace(/\s+/g, " ").replace(/[*_]/g, "").trim().replace(/^[\p{P}\s]+|[\p{P}\s]+$/gu, "").toLowerCase();
const words = (s) => s.toLowerCase().replace(/[‘’ʼ]/g, "'").replace(/[^\p{L}\p{N}']+/gu, " ").trim().split(/\s+/).filter(Boolean);
function longestRun(w, hay) {
  let best = 0;
  for (let i = 0; i < w.length; i++) for (let j = w.length; j > i + best; j--) if (hay.includes(` ${w.slice(i, j).join(" ")} `)) { best = j - i; break; }
  return best;
}
export function kindOf(inner, inputText) {
  const w = words(inner);
  if (!w.length) return "empty quote";
  const f = fmt(inner);
  if (f && fmt(inputText).includes(f)) return NORMALISED;
  return longestRun(w, ` ${words(inputText).join(" ")} `) >= 3 ? RUN3 : NEITHER;
}
function hints(inner, inputText) {
  const notes = [];
  const ws = (s) => s.replace(/\s+/g, " ");
  if (inputText.normalize("NFC").includes(inner.normalize("NFC"))) notes.push("NFC");
  if (ws(inputText).includes(ws(inner))) notes.push("whitespace-collapsed");
  if (inputText.replaceAll("\r\n", "\n").includes(inner.replaceAll("\r\n", "\n"))) notes.push("CRLF-folded");
  return notes.length ? ` (hint only: would match ${notes.join(", ")})` : "";
}
const item = (rel, line, kind, raw, msg) => ({ file: rel, line, label: LABEL, kind, text: raw, msg });
// A span prints as written; one that wraps a line prints escaped, on one line.
const show = (raw) => (/[\n\r\t]/.test(raw) ? JSON.stringify(raw.replaceAll("\r\n", "\n")) : raw); // CRLF shown as LF: the check itself is byte for byte

// rel: the output's path; text: the output as stored; input: Buffer of the round's pinned input.
export function scanOutput({ rel, text, input, baseLine = 1 }) {
  const t = decode(text);
  const items = [];
  const inputText = input.toString("utf8");
  const { spans, unpaired } = doubleSpans(t);
  const check = (start, inner, raw) => {
    if (input.includes(Buffer.from(inner, "utf8")) && inner.length) return;
    const kind = kindOf(inner, inputText);
    items.push(item(rel, baseLine + lineOf(t, start) - 1, kind, raw,
      `${kind}: ${show(raw)} is not byte-for-byte in the pinned input${hints(inner, inputText)}`));
  };
  for (const s of spans) check(s.start, s.inner, t.slice(s.start, s.end));
  for (const u of unpaired) items.push(item(rel, baseLine + lineOf(t, u) - 1, "unpaired mark", t[u],
    `unpaired mark: ${JSON.stringify(t.slice(Math.max(0, u - 12), u + 12))}`));
  for (const m of t.matchAll(SQ_SPAN)) if (/\S\s+\S/.test(m[1])) check(m.index, m[1], m[0]);
  for (const m of t.matchAll(BT_SPAN)) if (/\S\s+\S/.test(m[1])) check(m.index, m[1], m[0]);
  return items.sort((a, b) => a.line - b.line);
}

// The gate interface: scan(armRoot) -> items; summary(items) -> one line; selftest(fixturesDir) -> rows.
export function scan(root) {
  const items = [];
  for (const r of receiptOutputs(root)) {
    const body = receiptBody(r.text);
    if (!body) { items.push(item(r.rel, 1, "no marker", "", "no marker: no VERBATIM line, so the output cannot be read: the gate fails closed")); continue; }
    if (!r.input) { items.push(item(r.rel, 1, "no input", "", "no pinned input to check its quotes against")); continue; }
    items.push(...scanOutput({ rel: r.rel, text: body.text, input: r.input, baseLine: body.line }));
  }
  return items;
}
export function summary(items) {
  const counts = {};
  for (const it of items) counts[it.kind] = (counts[it.kind] || 0) + 1;
  const parts = KINDS.filter((k) => counts[k]).map((k) => `${counts[k]} [${k}]`);
  return `${parts.join(", ")}: every quoted span in a receipt output must occur byte for byte in that round's pinned input (buckets are heuristic)`;
}
const WANT = { "bad-term": NEITHER, "bad-dropped-word": NEITHER, "bad-single-quoted": NEITHER,
               "bad-space": NORMALISED, "bad-wrap": NORMALISED, "bad-words-changed": RUN3, "bad-unpaired": "unpaired mark" };
export function selftest(fixturesDir) {
  const rows = [];
  const dir = join(fixturesDir, "quote-anchor");
  const have = existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith(".md")).sort() : [];
  const missing = FIXTURES.filter((n) => !have.includes(n)), extra = have.filter((n) => !FIXTURES.includes(n));
  rows.push({ ok: !missing.length && !extra.length,
              text: `tests/fixtures/quote-anchor/ holds exactly its ${FIXTURES.length} pinned fixtures (${FIXTURES.join(", ")})` +
                    (missing.length ? `; missing: ${missing.join(", ")}` : "") + (extra.length ? `; not pinned: ${extra.join(", ")}` : "") });
  const inputPath = join(dir, "input.md");
  if (!existsSync(inputPath)) { rows.push({ ok: false, text: "tests/fixtures/quote-anchor/input.md is missing" }); return rows; }
  const input = readFileSync(inputPath);
  for (const n of FIXTURES.filter((n) => /^(?:bad|good)-/.test(n))) {
    const rel = `tests/fixtures/quote-anchor/${n}`, path = join(dir, n);
    if (!existsSync(path)) { rows.push({ ok: false, text: `${rel} is missing` }); continue; }
    const items = scanOutput({ rel, text: readFileSync(path, "utf8"), input });
    const mustFail = n.startsWith("bad-");
    const kinds = [...new Set(items.map((i) => i.kind))].join(", ");
    rows.push({ ok: mustFail ? items.length > 0 : items.length === 0,
                text: `${rel} ${items.length ? `fails ${LABEL} (${kinds})` : `passes ${LABEL}`}, must ${mustFail ? "fail" : "pass"}` });
    const want = WANT[n.replace(/\.md$/, "")];
    if (want) rows.push({ ok: kinds === want, text: `${rel} is classed ${JSON.stringify(kinds)}, must be ${JSON.stringify(want)}` });
  }
  return rows;
}
