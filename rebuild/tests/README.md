# tests/: the evidence layer

The product is prose (`identity.md`, `rules.md`, `reference/`). This folder
keeps the prose honest: a mechanical audit anyone can run offline,
planted-bad fixtures that prove the audit can fail, and verbatim receipts of
real rounds.

```
node tests/verify.mjs             # the AUDIT: red on the archived receipts by design (see below)
node tests/verify.mjs --selftest  # planted-bad fixtures MUST fail
node ../control/run.mjs           # the ACCEPTANCE CHECK (from the repo root): green when the
                                  # checker behaves exactly as promised on both arms
```

Node.js standard library only. No API key, no network, no install step.
What the audit checks, and what it cannot, is documented at the top of
`verify.mjs`. It audits the artifacts, not the runtime; no script can prove
a live session obeys prose rules. The live evidence is `receipts/`.

## The three gates

**`frozen-return.mjs` (F1, exact).** `rules.md` step 7 makes the answer to
any fix request a frozen return: one fixed line, the lead line
`The cause, as diagnosed:`, then the diagnosis's PRIMARY CAUSE copied
character for character, and nothing else. The gate reads both lines out of
`rules.md` (if `rules.md` stops stating them, it fails closed) and checks
every receipt turn pinned as the answer to a fix request
(`FIX_REQUEST_TURNS` in `gates/common.mjs`). It splits a receipt into turns
only at its pinned headings (`RECEIPT_TURNS`), so a heading the response
writes itself is text inside the turn and fails. Anything added fails, in
any words and any language. It has no word list. What it cannot see: a turn
that answers a fix request but is not pinned as one, whether the cause is
right, and what the cause says (a pick written into the cause is copied with
it).

**`endorsement.mjs` (F1, word lists)** covers every other sentence of a
receipt and `examples.md`. It flags a clause that both refers to the owner's
candidate fixes (`CAND` in code: `your <noun>`, `both of your ...`, `the one
you proposed`, `option A`, a clause-initial `Both` or `Either`, and their
kin) and judges them (`EVAL` and `STRONG`: works, closes, fixes, right,
sound, viable, better, would ship, go with, and their kin). A clause is
cleared by a negation or refusal verb before the judgement, a deferral to
the owner, a conditional anywhere in it, the act named as a remedy, a
passive description, or a question. Quoted text is read as a mention. There
is no excuse list. Short lists reach further: stock prescriptions in
Portuguese, Spanish, French, German and Italian; endorsements of the owner's
options in the first four, when no negation is in the sentence; and a few
English stock phrases (`STOCK`).

What it misses: wording outside the lists, in any language; a candidate
named by its content; a preference with no judging word; a rhetorical
question; look-alike letters from another script; a conditional added at the
end; in the other languages, a negation anywhere in the sentence. It can also
flag a sentence that endorses nothing: on this bundle's own prose it flags
only line 92 (`node control/corpus.mjs`), but on live answers it flags a few
such sentences (5 in the rebuild's 20 sessions; `../../results.md`).

This is version 2 of the gate. Version 1, SHA-256 of `tests/`
`c0b4648028bf568cfb65ca812ddb803f1df0847eb4c9e930d12e66cc8582c7dd`, is the
one the sealed held-out set was scored on; version 2 added judging words and
the mid-clause conditional after that set was opened
(`../../evidence.md`, the held-out set).

**`quote-anchor.mjs` (F2)** fails any double-quoted span, single-quoted span
of two or more words, or backtick span of two or more words in a receipt
output that is not byte for byte in that round's pinned input. Double quotes
are the marks in `PAIRS` (straight, curly, low, guillemets, corner brackets,
full-width) and their HTML entities; single quotes are straight, curly and
low. It checks every quoted span, stricter than the letter's wording,
because `rules.md` now says quotation marks mean an exact copy of the input.
Not checked: a quotation with no quotation marks (a blockquote, `<q>` tags,
double primes), a single quoted word (apostrophes, identifiers), and
`examples.md`, which has no pinned input. A receipt with no VERBATIM marker
fails closed in every gate.

## Why the audit is red

The receipts are never edited (the method is in `receipts/README.md`), and
the audit now fails on three things they contain: line 92 of round 1
endorses the owner's two candidate fixes; the turn it sits in (from line 88)
is not the frozen return `rules.md` now requires, because it was recorded
before that rule existed; and 13 quoted spans are not byte for byte in the
inputs (8 of them quotations of the input, 5 not; each is read by hand in
`../../evidence.md`). Line 92 passed the original's checker because that
scan looked for twelve prescription phrases and had no rule for endorsing
the owner's candidates. The audit goes green only with a new round whose
transcript has none of the three; the acceptance check at the repo root is
green today.

## Folders

| Folder | What it holds |
|---|---|
| `receipts/` | Verbatim transcripts of real rounds, with exact inputs, a pre-declared method and SHA-256 pins. |
| `fixtures/` | Planted-bad files, each with one defect the verifier must catch, and good twins that must pass: four at the top, then one folder per gate. `soft-spot/` holds the letter's sentence (`bad.md`, pinned by its SHA-256), its twin with the refusal (`good.md`) and `variants.md`. Each gate pins its folder's file names in code, so a missing, renamed or unlisted file is a named failure. `--selftest` fails unless every bad file fails and every good file passes, and it first proves the wiring. It proves fixture integrity, not detection of wordings outside the fixtures. |
| `gates/` | The three gates and what they share (`common.mjs`). Each exports `LABEL`, `TAG`, `scan(armRoot)`, `summary(items)` and `selftest(fixturesDir)`; `verify.mjs` loops over them. |

## The original's own checks

The checks the original shipped (output skeleton, example discipline, one
cause, prescription phrases, em dashes, count consistency, receipt pins) are
unchanged, except that two empty excuse lists were deleted and the skeleton
check reads `rules.md` step 6's template as plain text. Their seams are the
original's and are listed, not fixed: the prescription scan reads only up to
a second `VERBATIM OUTPUT BELOW` line; markup inside a phrase passes; in
`examples.md` it reads only the fenced blocks; an `&mdash;` entity passes.
On its first run the original's verifier found three defects that had
survived human passes, all fixed on the record (`CHANGELOG.md`).
