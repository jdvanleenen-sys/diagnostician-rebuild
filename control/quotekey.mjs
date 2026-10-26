#!/usr/bin/env node
// quotekey.mjs - the answer key for Q3 (feedback.md F2): the same rule as the gate, written twice. A raw
// substring test: every "..." or “...” span, every '...' span of two or more words and every `...` span
// of two or more words in a receipt output (HTML entities decoded first), looked up in that round's input
// with String.prototype.indexOf. The same three heuristic buckets as the gate, written again here:
// "exact match absent; normalised match present" (matches after collapsing whitespace, dropping * and _,
// dropping surrounding punctuation, folding case), "exact absent; 3-word run present" (a run of 3+
// consecutive words of the span occurs in the input), else "exact absent; neither". Shares no code with
// tests/gates/, but two implementations of one rule can agree on one mistake: the human check on what each
// span is (an anchor quoted from the input, or an illustrative phrase) is results.md, section "F2: the 13 spans".
//
// Usage: node control/quotekey.mjs --write   # build control/expected-quotes.json from original/tests/receipts
//        node control/quotekey.mjs           # rebuild it in memory and compare with the file on disk

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const RECEIPTS = join(HERE, "..", "original", "tests", "receipts");
const KEY = join(HERE, "expected-quotes.json");
const MARKER = "VERBATIM OUTPUT BELOW";

const tokens = (s) => s.toLowerCase().replace(/[‘’]/g, "'").split(/[^\p{L}\p{N}']+/u).filter(Boolean);
const fold = (s) => s.replace(/\s+/g, " ").replace(/[*_]/g, "").trim().replace(/^[\p{P}\s]+|[\p{P}\s]+$/gu, "").toLowerCase();
const entities = (s) => s.replace(/&#(\d+);|&#x([0-9a-f]+);|&quot;|&ldquo;|&rdquo;|&laquo;|&raquo;/gi, (m, d, h) =>
  d ? String.fromCodePoint(+d) : h ? String.fromCodePoint(parseInt(h, 16)) : { "&quot;": '"', "&ldquo;": "“", "&rdquo;": "”", "&laquo;": "«", "&raquo;": "»" }[m.toLowerCase()]);
function longestRun(spanWords, inputWords) {
  let best = 0;
  for (let i = 0; i < spanWords.length; i++) {
    for (let j = 0; j + spanWords.length - i > 0 && j < inputWords.length; j++) {
      let k = 0;
      while (i + k < spanWords.length && j + k < inputWords.length && spanWords[i + k] === inputWords[j + k]) k++;
      if (k > best) best = k;
    }
  }
  return best;
}
function classify(inner, input, inputWords) {
  const w = tokens(inner);
  if (!w.length) return "empty quote";
  const f = fold(inner);
  if (f && fold(input).includes(f)) return "exact match absent; normalised match present";
  return longestRun(w, inputWords) >= 3 ? "exact absent; 3-word run present" : "exact absent; neither";
}

function keyFor(round) {
  const out = readFileSync(join(RECEIPTS, `${round}-output.md`), "utf8");
  const input = readFileSync(join(RECEIPTS, `${round}-input.md`), "utf8");
  const inputWords = tokens(input);
  const at = out.indexOf(MARKER);
  const body = entities(out.slice(at));
  const base = out.slice(0, at).split("\n").length;
  const found = [];
  const note = (index, inner, text) => {
    if (inner.length && input.indexOf(inner) >= 0) return;
    found.push({ file: `tests/receipts/${round}-output.md`, line: base + body.slice(0, index).split("\n").length - 1,
                 kind: classify(inner, input, inputWords), text });
  };
  for (const m of body.matchAll(/"([^"]*?)"/gs)) note(m.index, m[1], m[0]);
  for (const m of body.matchAll(/“([^”]*?)”/gs)) note(m.index, m[1], m[0]);
  for (const m of body.matchAll(/(?<![\p{L}\p{N}])'([^'\n]+?)'(?![\p{L}\p{N}])/gu)) if (/\s/.test(m[1].trim())) note(m.index, m[1], m[0]);
  for (const m of body.matchAll(/`([^`\n]+)`/g)) if (/\s/.test(m[1].trim())) note(m.index, m[1], m[0]);
  return found.sort((a, b) => a.line - b.line);
}

const key = [...keyFor("round-1"), ...keyFor("round-2")];
const counts = key.reduce((c, k) => ({ ...c, [k.kind]: (c[k.kind] || 0) + 1 }), {});
const summary = ["exact match absent; normalised match present", "exact absent; 3-word run present", "exact absent; neither", "empty quote"].filter((k) => counts[k]).map((k) => `${counts[k]} [${k}]`).join(", ");
if (process.argv.includes("--write")) {
  writeFileSync(KEY, JSON.stringify(key, null, 2) + "\n");
  console.log(`wrote ${KEY}: ${key.length} spans (${summary})`);
} else {
  const onDisk = existsSync(KEY) ? readFileSync(KEY, "utf8").replace(/\r\n/g, "\n") : null;
  const same = onDisk === JSON.stringify(key, null, 2) + "\n";
  console.log(`${key.length} spans (${summary}); control/expected-quotes.json ${onDisk === null ? "MISSING" : same ? "MATCH" : "DIFF"}`);
  for (const k of key) console.log(`  ${k.file}:${k.line}  ${k.kind}  ${JSON.stringify(k.text)}`);
  process.exit(onDisk !== null && same ? 0 : 1);
}
