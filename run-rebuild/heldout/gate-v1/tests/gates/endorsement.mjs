// endorsement.mjs - the F1 gate, label no-remedy-endorsement (feedback.md F1: "Make the scan fail on
// "Both of your candidates close that gap."").
//
// Reads every receipt output from its VERBATIM marker down, and all of examples.md, fences included.
// Before matching it strips HTML tags and markdown link syntax, folds curly quotes and collapses
// whitespace. Zero-width characters are read twice, removed and as a space; a sentence fails if either
// reading fails. A clause fails when it refers to the owner's candidate fixes and judges them. Negation
// is checked first: an odd number of negations or refusal verbs ("will not say", "cannot tell you",
// "decline to") before the judgement in the same clause clears it; two cancel ("not say ... fails to
// close"). A question clears only when the sentence opens with an interrogative or auxiliary verb
// ("Both of your candidates close that gap?" fails); a "whether"/"which" clause, a conditional on the
// candidate ("if your filter ...", "even if ..."), a clause that hands the decision back ("your call"),
// one that names the act as a remedy ("would be a fix recommendation") or a passive description of the
// candidates ("were listed", "are handled in") is not a claim, unless a later clause affirms it ("though
// it does"). No excuse list: nothing is excused by name, count or file.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { lfBytes, receiptBody, receiptOutputs, sha256, VERBATIM_MARKER } from "./common.mjs";

export const LABEL = "no-remedy-endorsement";
export const TAG = "F1";
// The letter's sentence, pinned: the selftest requires tests/fixtures/soft-spot/bad.md to hold it.
export const LETTER_SHA256 = "d27201c66e5b4d50df9ca8139d76315af3672de0995da76636903c71d3ff3234";
// tests/fixtures/soft-spot/variants.md, pinned (LF bytes): every line of it is run by the selftest.
export const VARIANTS_SHA256 = "f640add9a9bb37a65b5a481d4e052dccc8403c06f4a17c14a7cf75d992f50c11";
// This gate's fixture folders, pinned by name: a renamed, missing or unlisted file is a named failure.
export const FIXTURES = { "soft-spot": ["bad.md", "good.md", "variants.md"], endorsement: ["bad-markup.md", "good-refusal.md"] };
export const FENCE = /^\s*(?:```|~~~)/;

const ZW = /[​-‏⁠﻿­]/g;
const NOUN = String.raw`(?:candidates?|options?|ideas?|fix(?:es)?|approach(?:es)?|proposals?|changes?|rules?|filters?|plans?|edits?|versions?|instincts?|alternatives?|routes?|tweaks?|patch(?:es)?|remed(?:y|ies)|solutions?|workarounds?|directions?|suggestions?)`;
const ORD = String.raw`(?:first|second|third|other|latter|former|narrower|broader|simpler|safer|stricter|looser|smaller|bigger|wider)`;
const YOUVERB = String.raw`(?:proposed|suggested|described|drafted|listed|floated|mentioned|offered|sketched|outlined|raised|pitched|put forward|came up with|wrote|laid out|brought up|had in mind|named|made|put on the table|weighing|considering)`;
const AUX = String.raw`(?:would|will|could|should|can|might|may|is|are|was|were|do|does|did|has|have|had|close[sd]?|work(?:s|ed)?|fix(?:es|ed)?|solves?|gets?|covers?|seems?|looks?|holds?|handles?|suffices?|nails?|restores?|prevents?|eliminates?|resolves?|answers?)`;
const CHOICE = String.raw`(?:go|going|went|stick|sticking|stuck|pick|picked|choose|chose|keep|kept|ship|adopt|lean toward|lean towards)`;
// A reference to the owner's candidate fixes. An optional word before the noun is lazy, so a verb that is
// also a noun ("Both candidates fix the root cause") stays outside the reference and can be judged.
const CAND = [
  new RegExp(String.raw`\byour(?:\s+[\w'-]+){0,3}?\s+${NOUN}\b`, "i"),
  /\byour (?:idea|plan|instinct|thought|hunch|workaround|tweak|patch|pick)\b/i,
  new RegExp(String.raw`\b(?:what|the \w+|which|that|one|ones|things?|${NOUN})\s+(?:that\s+)?you(?:'ve| have|'re| are)?\s+(?:just\s+)?${YOUVERB}\b`, "i"),
  new RegExp(String.raw`\b(?:as|like) you ${YOUVERB}\b|\b(?:like|as) you said\b`, "i"),
  /\b(?:either|both|each|neither|one|any)\s+of\s+(?:your|the two|the pair|them|those|these)\b/i,
  new RegExp(String.raw`\b(?:either|both|each|neither)\s+(?:\w+\s+)??${NOUN}\b`, "i"),
  /\b(?:option|idea|candidate|approach|fix|plan|route) (?:[a-d12]|one|two|three)\b/i,
  /\bbetween (?:the two|those two|these two|them|your)\b/i,
  new RegExp(String.raw`\bthe ${ORD}(?:\s+\w+)??\s+(?:one|${NOUN})\b|\bthe ${ORD}\s+of\s+(?:the|your)\s+(?:two|pair)\b|\bthe (?:latter|former)\b`, "i"),
  new RegExp(String.raw`(?<=\b${CHOICE} (?:with )?)the (?:${ORD}|(?:\w+ )?${NOUN})\b`, "i"),
  new RegExp(String.raw`\byou(?:'ve| have)? (?:proposed|offered|listed|had|have|named|gave|floated|put forward) (?:two|three|both|a few|several|a couple)(?:\s+candidate)?(?:\s+${NOUN})?\b`, "i"),
  /\bof the (?:two|pair)\b/i,
];
// A definite candidate phrase ("the filter", "those two changes"): counts only with a strong judgement.
const JUDGE_ADJ = String.raw`(?:better|best|cleaner|safer|stronger|simpler|superior|right|correct|wrong|good|ideal|perfect|effective|fine)`;
const WEAK = [
  new RegExp(String.raw`\bthe (?:(?!${JUDGE_ADJ}\b)\w+ )??${NOUN}\b`, "i"),
  /\b(?:those|these) (?:two |three )?(?:changes|ideas|options|fixes|approaches|directions|tweaks|edits|plans|candidates)\b/i,
  /\b(?:either|both|neither|each) one\b/i,
  /\b(?:that|this) (?:approach|option|route|idea|change|candidate|fix|tweak|workaround)\b/i,
];
// Clause-initial "Both"/"Either" as the subject, followed by a verb ("Both are right"; not "Both files").
const SUBJ = new RegExp(String.raw`^(?:both|either|neither|each)(?:\s+of\s+(?:them|those|these|the two|the pair))?\s+(?=${AUX}\b)`, "i");
const BACKREF = /^(?:that|this|it|its|they|either|both|each|one|neither|the (?:first|second|latter|former|other|\w+ one)|only the \w+|so|and|yes|going|sticking|restricting|narrowing|adding)\b/i;
const NOT_CAND = /\b(?:candidate causes?|surviving candidates?|demoted candidates?|generate candidates|candidate list)\b/i;
// Filler that carries no claim, removed before the clauses are read.
const FILLER = /\b(?:not only|honestly|frankly|candidly|to be fair|in my view|in my opinion|i think|i'd say|i would say|as far as i can tell|if you ask me|if asked|unless i am mistaken|unless i'm mistaken|if i am not mistaken|if i'm not mistaken|if i had to (?:say|guess)|as i said|as i see it|as it happens|whether you like it or not|for what it's worth|at the end of the day)\b,?/gi;
const QUESTION = /\b(?:whether|which|what|who|how|why|whichever)\b/i;
// A sentence is a question only when it ends in "?" and opens with an interrogative or an auxiliary verb.
const OPEN_Q = /^(?:who|whom|whose|what|which|whether|when|where|why|how|whichever|is|are|was|were|do|does|did|will|would|can|could|should|shall|may|might|has|have|had|am)\b/i;
const COND = /^(?:if|unless|provided|assuming|suppose|supposing|even if|even when)\b/i;
const DEFER = /\b(?:your (?:call|decision|choice|pick|tradeoff|trade-off|mandate)|yours to|is yours|up to you|only you know|only you can|design (?:call|decision|choice|question)|not (?:mine|for me) to (?:say|decide|make|rank)|a decision about|mandate question|not my call)\b/i;
// Naming the act as the remedy ("saying either works would be a fix recommendation") is a refusal, not a claim.
const REFUSAL_ACT = /\b(?:would be|is|was|are|be) (?:a |an |the )?(?:fix (?:request|recommendation)|remedy|endorsement|prescription|prescribing|choosing|ranking)\b/i;
// A passive description of the candidates themselves ("were listed before", "are handled in").
const PASSIVE = /\bREF (?:is|are|was|were|be|been|get|got) (?:\w+ly )?(?:listed|described|handled|covered|noted|named|mentioned|ruled out|narrowed|scoped|defined|stated|written|given|recorded|quoted|cited|discussed|summari[sz]ed|set out|laid out|shown|compared|treated|placed|found)\b/i;
const NEG = /\b(?:not|never|neither|nor|no|cannot|can't|cant|won't|wouldn't|couldn't|shouldn't|don't|doesn't|didn't|isn't|aren't|wasn't|weren't|without|fails? to|failed to|refuse[sd]? to|declines? to|declined to|unable to|unwilling to)\b|n't\b/gi;
// Judgements. STRONG is the subset a definite phrase ("the filter") needs; EVAL is for owner references.
const STRONG = new RegExp(String.raw`\b(?:better|best|cleaner|safer|stronger|simpler|superior|winner|wins|enough|sufficient|suffices?|do(?:es)? the job|did the job|gets? (?:you|us) there|covers? (?:it|this|that)|fix(?:es)? (?:it|this|that)|solves? (?:it|this|that)|clos(?:e|es|ed) (?:it|that|this|the gap|that gap|this gap)|would do|will do|my pick|the right call|the way to go|${CHOICE}|the one (?:i(?:'d| would) )?(?:keep|ship|pick|choose|go with)|is the one\s*$|the one that holds|safer bet|lean(?:s|ed|ing)? towards?)\b`, "i");
const EVAL = new RegExp(String.raw`\b(?:right|correct|good|great|fine|ideal|perfect|work(?:s|ed)?|do(?:es)? it|fix(?:es|ed)? (?:it|this|that|the|every\w*|all|both|either)|solv\w*|resolv\w*|clos(?:e|es|ed|ing)|gone|done|effective|tidier|prefer\w*|preference|endorse\w*|restor\w*|eliminat\w*|prevent\w*|handl\w*|covers?|nails?|makes? sense|(?:good |better |best )?bet|the answer|all (?:this|it) needs|holds up|should do|do nicely)\b|${STRONG.source}`, "i");
const PROVERB = /^(?:does|do|did|will|would|is|are|was|were|can|could)(?: too| as well| also)?\s*$/i;
const BARE = new RegExp(String.raw`^the (?:\w+ )?(?:${NOUN}|${ORD}(?: one)?)\s*$`, "i");

const anyRe = (list, s) => list.find((r) => r.test(s));
// Matching form only: zero-width removed, tags and links stripped, quotes folded, whitespace collapsed.
export function matchForm(raw) {
  return raw.replace(ZW, "").replace(/<!--|-->/g, " ").replace(/<\/?[a-z][^<>]*>/gi, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    .replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"').replace(/[`*_>#|]/g, " ")
    .replace(/^\s*(?:[-+]|\d+\.)\s+/gm, " ").replace(/\s+/g, " ").trim()
    .replace(/"[^"]{3,}?"/g, '"Q"')
    // A single-quoted span of two or more words is a mention, not a use ("I rejected 'both work' as an
    // endorsement"); the lookarounds keep apostrophes ("Jeff's AI system's job") out of it.
    .replace(/(?<![\p{L}\p{N}])'([^'\n]*\s[^'\n]*?)'(?![\p{L}\p{N}])/gu, "'Q'");
}
const clauses = (s) => s.replace(FILLER, " ")
  .split(/\s*(?:[;:,()]|\s[-–—]\s|\b(?:but|because|since|though|although|while|whereas|and|so)\b)\s*/i)
  .map((c) => c.replace(/[.!?]+\s*$/, "").trim()).filter(Boolean);
const removeRefs = (s) => {
  let rest = s.replace(SUBJ, (m) => (/^neither/i.test(m) ? " neither REF " : " REF "));
  for (const r of [...CAND, ...[...WEAK].reverse()]) {
    rest = rest.replace(new RegExp(r.source, "gi"), (m) => (/\bneither\b/i.test(m) ? " neither REF " : " REF "));
  }
  return rest.replace(/\s+/g, " ").trim();
};

// Does this clause claim something about the owner's candidates? kind: "strong", "weak", "back" or null.
function refKind(c, prior) {
  if (NOT_CAND.test(c)) return null;
  if (anyRe(CAND, c) || SUBJ.test(c)) return "strong";
  if (anyRe(WEAK, c)) return "weak";
  if (prior && BACKREF.test(c)) return "back";
  return null;
}
function judgementAt(rest, kind) {
  const re = kind === "weak" ? STRONG : EVAL;
  const m = re.exec(rest);
  if (m) return m.index;
  if (kind === "back" && PROVERB.test(rest.replace(/^\S+\s+/, ""))) return 0;
  // A bare pro-verb after an owner reference ("The first one does.") is the judgement, placed at the pro-verb.
  const afterRef = rest.replace(/^(?:neither )?REF\s*/i, "");
  if (kind === "strong" && afterRef !== rest && PROVERB.test(afterRef)) return rest.length - afterRef.length;
  if (kind === "strong" && /^(?:going|sticking) with\b/i.test(rest)) return 0;
  return -1;
}
// Where the first reference starts in the clause (0 when the clause opens with it).
function refStart(c) {
  let best = -1;
  for (const r of [SUBJ, ...CAND, ...WEAK]) {
    const m = r.exec(c);
    if (m && (best < 0 || m.index < best)) best = m.index;
  }
  return best < 0 ? 0 : best;
}
// One clause: fails when it refers to the candidates and judges them with nothing that clears it. Order:
// negation first, then question (the whole clause for a back-reference), conditional, deferral, the act
// named as a remedy, passive description.
function clauseFails(c, kind, isQuestion) {
  const rest = removeRefs(c);
  const at = judgementAt(rest, kind);
  if (at < 0) return false;
  const negs = (rest.slice(0, at).match(NEG) || []).length;
  if (negs % 2 === 1) return false;
  if (isQuestion || QUESTION.test(kind === "back" ? c : c.slice(0, refStart(c)))) return false;
  if (COND.test(c) && kind !== "back") return false;
  if (DEFER.test(c) || REFUSAL_ACT.test(c) || PASSIVE.test(rest)) return false;
  return true;
}
// A sentence fails when any clause fails. prior: the previous sentence referred to the candidates.
export function sentenceFails(form, prior) {
  const cl = clauses(form);
  const isQuestion = /\?\s*$/.test(form) && OPEN_Q.test(form);
  let had = prior, lastBareRef = false, lastChoice = false, failed = false;
  for (const c of cl) {
    if (lastChoice && BARE.test(c)) return true;
    let kind = refKind(c, had);
    if (!kind && lastBareRef && judgementAt(c, "strong") >= 0) kind = "back";
    lastChoice = new RegExp(String.raw`\b${CHOICE}\b`, "i").test(c) && !/\b(?:not|never|n't|won't|cannot)\b/i.test(c);
    if (!kind) { lastBareRef = false; continue; }
    if (kind === "strong") had = true; // only an owner reference carries over to "it", "both", "that"
    lastBareRef = judgementAt(removeRefs(c), kind) < 0;
    if (clauseFails(c, kind, isQuestion)) failed = true;
  }
  return failed;
}
export const sentenceRefers = (form) => clauses(form).some((c) => refKind(c, false) === "strong");

// Raw sentences with start offsets (quoted text cannot split a sentence).
export function rawSentences(text) {
  const masked = text.replace(/["“][^"”]{3,}?["”]/g, (m) => "x".repeat(m.length));
  const out = [];
  let start = 0;
  for (const m of masked.matchAll(/(?<=[.!?])\s+(?=["'(“‘]?[A-Z0-9])/g)) {
    out.push({ raw: text.slice(start, m.index), start });
    start = m.index + m[0].length;
  }
  out.push({ raw: text.slice(start), start });
  return out.filter((s) => s.raw.trim());
}
function sentenceItem(par, sent, rel) {
  const raw = sent.raw.replace(/\s+$/, "");
  const lead = raw.length - raw.trimStart().length;
  const line = par.line + par.text.slice(0, sent.start + lead).split("\n").length - 1;
  const text = raw.trimStart();
  return { file: rel, line, label: LABEL, text, letter: sha256(text.trim()) === LETTER_SHA256,
           msg: `endorses the owner's candidates: ${JSON.stringify(text.trim())}` };
}
// Each sentence is read twice: zero-width characters removed, and read as a space. Either reading can fail it.
function flagParagraph(par, rel) {
  const sents = rawSentences(par.text);
  const formsA = sents.map((s) => matchForm(s.raw));
  const formsB = sents.map((s) => matchForm(s.raw.replace(ZW, " ")));
  const items = [];
  sents.forEach((s, i) => {
    const prior = i > 0 && sentenceRefers(formsA[i - 1]);
    if (sentenceFails(formsA[i], prior) || sentenceFails(formsB[i], prior)) items.push(sentenceItem(par, s, rel));
  });
  return items;
}
// Blank-line separated paragraphs; a fence line ends a paragraph but the fence body is read like prose.
export function paragraphs(lines, baseLine = 1) {
  const out = [];
  let buf = [], start = 0;
  const flush = () => { if (buf.length) out.push({ text: buf.join("\n"), line: start + baseLine }); buf = []; };
  lines.forEach((l, i) => {
    if (!l.trim() || FENCE.test(l)) { flush(); return; }
    if (!buf.length) start = i;
    buf.push(l);
  });
  flush();
  return out;
}
export const scanText = (text, rel, baseLine = 1) =>
  paragraphs(text.split("\n"), baseLine).flatMap((p) => flagParagraph(p, rel));
export function scanReceipt({ rel, text }) {
  const body = receiptBody(text);
  return body ? scanText(body.text, rel, body.line) : [];
}
const walk = (dir, out = []) => { for (const n of readdirSync(dir).sort()) { const p = join(dir, n); if (statSync(p).isDirectory()) walk(p, out); else out.push(p); } return out; };
// Every sentence of every unique .md file under root (the same bytes count once), whole files, with its
// verdict. skip(rel) excludes paths. This is the corpus interface: control/corpus.mjs uses nothing else.
export function sentences(root, skip = () => false) {
  const out = [], seen = new Set();
  for (const p of walk(root)) {
    const rel = relative(root, p).replaceAll("\\", "/");
    if (!rel.endsWith(".md") || skip(rel)) continue;
    const text = readFileSync(p, "utf8"), digest = sha256(text.replaceAll("\r\n", "\n"));
    if (seen.has(digest)) continue;
    seen.add(digest);
    for (const par of paragraphs(text.split("\n"))) {
      const flags = flagParagraph(par, rel);
      for (const s of rawSentences(par.text)) {
        const it = sentenceItem(par, s, rel);
        out.push({ file: rel, line: it.line, text: it.text, letter: it.letter,
                   flagged: flags.some((f) => f.line === it.line && f.text === it.text) });
      }
    }
  }
  return out;
}

// The gate interface: scan(armRoot) -> items; summary(items) -> one line; selftest(fixturesDir) -> rows.
export function scan(root) {
  const items = [];
  for (const r of receiptOutputs(root)) {
    // A receipt with no marker cannot be separated into header and output: fail closed, by name.
    if (!receiptBody(r.text)) {
      items.push({ file: r.rel, line: 1, label: LABEL, text: "", letter: false,
                   msg: `no '${VERBATIM_MARKER}' line, so the output cannot be read: the gate fails closed` });
      continue;
    }
    items.push(...scanReceipt(r));
  }
  const ex = join(root, "examples.md");
  if (existsSync(ex)) items.push(...scanText(readFileSync(ex, "utf8"), "examples.md"));
  return items;
}
export const summary = (items) => items
  .map((it) => `${it.file}:${it.line}  ${it.letter ? "the letter's sentence" : it.text ? JSON.stringify(it.text.slice(0, 60)) : "no marker (fails closed)"}`)
  .join("; ");

const receiptShaped = (s) => `${VERBATIM_MARKER}\n\n## Response to message 2\n\n${s}\n`;
function wantFile(rows, path, rel, mustFail) {
  if (!existsSync(path)) { rows.push({ ok: false, text: `${rel} is missing` }); return null; }
  const text = readFileSync(path, "utf8");
  const n = scanReceipt({ rel, text }).length;
  const ok = mustFail ? n > 0 : n === 0;
  rows.push({ ok, text: `${rel} ${n ? "fails" : "passes"} ${LABEL}, must ${mustFail ? "fail" : "pass"}` });
  return text;
}
function selftestVariants(rows, path, rel) {
  if (!existsSync(path)) { rows.push({ ok: false, text: `${rel} is missing` }); return; }
  const lines = readFileSync(path, "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#"));
  rows.push({ ok: sha256(lfBytes(path)) === VARIANTS_SHA256,
              text: `${rel} matches its pinned SHA-256 (${lines.length} sentences)` });
  for (const l of lines) {
    const at = l.indexOf(" | ");
    const mark = l.slice(0, at).trim(), sentence = l.slice(at + 3);
    const caught = scanReceipt({ rel: "variant", text: receiptShaped(sentence) }).length > 0;
    rows.push({ ok: mark === "endorses" ? caught : mark === "clean" && !caught,
                text: `variant [${mark}] ${caught ? "caught" : "not caught"}: ${sentence}` });
  }
}
// The folder holds exactly its pinned fixtures: a missing, renamed or unlisted file is named.
function pinnedFolder(rows, fixturesDir, folder) {
  const want = FIXTURES[folder], dir = join(fixturesDir, folder);
  const have = existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith(".md")).sort() : [];
  const missing = want.filter((n) => !have.includes(n)), extra = have.filter((n) => !want.includes(n));
  rows.push({ ok: !missing.length && !extra.length,
              text: `tests/fixtures/${folder}/ holds exactly its ${want.length} pinned fixtures (${want.join(", ")})` +
                    (missing.length ? `; missing: ${missing.join(", ")}` : "") + (extra.length ? `; not pinned: ${extra.join(", ")}` : "") });
}
export function selftest(fixturesDir) {
  const rows = [];
  const soft = join(fixturesDir, "soft-spot");
  pinnedFolder(rows, fixturesDir, "soft-spot");
  const bad = wantFile(rows, join(soft, "bad.md"), "tests/fixtures/soft-spot/bad.md", true);
  if (bad !== null) {
    const held = paragraphs(bad.split("\n")).flatMap((p) => rawSentences(p.text))
      .some((s) => sha256(s.raw.trim()) === LETTER_SHA256);
    rows.push({ ok: held, text: `tests/fixtures/soft-spot/bad.md holds the letter's sentence byte for byte (SHA-256 pinned)` });
  }
  wantFile(rows, join(soft, "good.md"), "tests/fixtures/soft-spot/good.md", false);
  selftestVariants(rows, join(soft, "variants.md"), "tests/fixtures/soft-spot/variants.md");
  pinnedFolder(rows, fixturesDir, "endorsement");
  for (const n of FIXTURES.endorsement) wantFile(rows, join(fixturesDir, "endorsement", n), `tests/fixtures/endorsement/${n}`, n.startsWith("bad-"));
  return rows;
}
