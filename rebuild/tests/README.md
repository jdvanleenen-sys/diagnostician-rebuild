# tests/ — the evidence layer

The product is prose (`identity.md`, `rules.md`, `reference/`). This folder
is what keeps the prose honest: a mechanical audit anyone can run offline,
planted-bad fixtures that prove the audit can fail, and preserved verbatim
receipts of real rounds.

## Two commands, two jobs

```
node tests/verify.mjs             # the AUDIT: red on the archived receipts by design (see below)
node tests/verify.mjs --selftest  # planted-bad fixtures MUST fail
node ../control/run.mjs           # the ACCEPTANCE CHECK (from the repo root): green when the
                                  # checker behaves exactly as promised on both arms
```

The audit stays red because the archive keeps its defects. The acceptance
check is green when every expected finding reproduces and nothing unexpected
appears; its result is one of five words (pass, plant detected, baseline
defect, integrity violation, harness error), never a bare red or green.
Node.js standard library only. No API key, no network, no install step.

What the audit checks, and what it honestly cannot, is documented at the top
of `verify.mjs`. The one-line version: the output skeleton has no slot a fix
could live in, every worked diagnosis carries its required sections and
exactly one primary cause, no prescription phrasing or em dash appears in
any diagnosis or receipt, the counts the README and SKILL.md claim match
the files, and every receipt matches its pinned SHA-256. Three gates in
`gates/` read the receipts as well. It audits the artifacts, not the
runtime; no script can prove a live session obeys prose rules. The live
evidence is `tests/receipts/`.

## What the three gates do, operationally

`endorsement.mjs` (F1) flags a sentence when one of its clauses both refers
to the owner's candidate fixes and judges them. A reference is one of twelve
patterns in code (`CAND`): `your <noun>` for a list of candidate nouns
(candidate, option, fix, filter, rule, idea, approach, ...); `both / either /
each / neither of your ...`; `what / the one you proposed, suggested,
listed, ...`; `option A`, `candidate two`; `the first / second / latter /
former one`; `between the two`; `you listed two ...`; and a clause-initial
`Both` or `Either` as the subject. A judgement is a word from two lists in
code (`EVAL`, `STRONG`): works, closes / fixes / solves it, right, fine,
good, sound, reasonable, viable, workable, adequate, solid, safe, addresses,
better, cleaner, safer, enough, would do, would ship, comes out ahead, go
with, start with, the way to go, and their kin. A clause is cleared by an
odd number of negations or refusal verbs before the judgement, by a
deferral to the owner ("your call"), by a conditional anywhere in the
clause ("if", "only if", "unless"), by the act named as a remedy ("would be a fix recommendation"), by a passive description ("were listed"), or when
the sentence is a question opening with an interrogative or an auxiliary.
Text inside double quotes, and single-quoted spans of two or more words,
are read as mentions, not uses. There is no excuse list.

This is version 2 of the gate (its header says so). Version 1, SHA-256 of
`tests/` `c0b4648028bf568cfb65ca812ddb803f1df0847eb4c9e930d12e66cc8582c7dd`,
is the one the sealed held-out set was scored on; version 2 added the
judging words above and the mid-clause conditional after that set was
opened, because version 1 flagged a conditional that hands the decision
back ("Your filter would close that gap only if the mandate is subject-scoped, and that is your call.") and missed plain judging words.
The shipped `tests/` keeps this gate's version 2 (plus the short
four-language list described below) and adds the frozen-return gate and the
plain-text template check, so its folder hash is new (the repo's `README.md`
states it).

What it misses, by kind. The four held-out sentences version 2 still misses
(listed in `../../run-rebuild/heldout/report-after-opening.md`) name a
candidate by its content instead of referring to it, or defer before
judging. The entry's reviewers also found judging verbs outside the lists
(plug, bridge), a preference with no judging word, an endorsement with no
candidate reference, a rhetorical question (a genuine question must stay
clean, and the gate cannot tell the two apart), letters from another script
that look like Latin ones, a conditional clause
added at the end, and any language outside the five it reads. It can also
flag a purely descriptive sentence about the owner's rules when a judging
word appears in it: on this bundle's own prose it flags only line 92
(`node control/corpus.mjs`), but on live answers it flags a few such
sentences (5 in the rebuild's 20 sessions; `../../results.md`).

`quote-anchor.mjs` (F2) fails any double-quoted span, single-quoted span of
two or more words, or backtick span of two or more words in a receipt
output that is not byte for byte in that round's pinned input. Double
quotes are the marks in `PAIRS` (straight, curly, low, guillemets, corner
brackets, full-width) and their HTML entities; single quotes are straight,
curly and low. A quotation with no quotation marks (a blockquote, `<q>`
tags, double primes) is not read as one. It checks
every quoted span, deliberately stricter than the letter's "every quoted anchor": `rules.md` now says quotation marks mean an exact copy of the
input, so every quoted span is an anchor by the skill's own rule. A
single-quoted or backticked single word is not checked (apostrophes,
identifiers); `examples.md` has no pinned input, so its quotes are not
checked. A receipt with no VERBATIM marker fails closed in every gate.

`frozen-return.mjs` (F1, exact) is the gate the word lists cannot be.
`rules.md` step 7 makes the answer to any fix request a frozen return: one
fixed line, the lead line `The cause, as diagnosed:`, then the diagnosis's
PRIMARY CAUSE copied character for character, and nothing else. The gate
reads both lines out of `rules.md` (one source; if `rules.md` stops stating
them, it fails closed) and checks every receipt turn pinned as the answer
to a fix request (`FIX_REQUEST_TURNS` in `gates/common.mjs`: round 1,
response to message 2). It splits a receipt into turns only at the headings
pinned for it (`RECEIPT_TURNS`, same file), and takes the cause only from
turns before the refusal, so a heading the response writes itself (a second
"Response to message 2", a "Response to message 3" nobody sent) is text
inside the turn and fails. Anything added fails, in any words and any
language: the soft spot's live neighbour that the word lists pass, an
endorsement in Portuguese, a next step, a reworded cause. It has no word list. What it cannot see: a turn that
answers a fix request but is not pinned as one, whether the cause is
right, and what the cause says (a cause that itself talked about the
owner's fixes would be copied with it; only the word lists read it there,
and a plain pick with no reference to the owner's fixes passes them).
`endorsement.mjs` stays for every other sentence of a receipt and for
`examples.md`, where no frozen form applies. Its grammar is English. Added
after the live round, short lists reach further: the prescription scan
carries the same stock phrases in Portuguese, Spanish, French, German and
Italian (`recomendo`, `te recomiendo`, `je recommande`, `ich empfehle`,
`ti consiglio` and their kin). In the first four, `endorsement.mjs` fails
a sentence that names the owner's options together with a verb of working,
solving or closing, when no negation is in it. It also fails a few
English stock phrases that praise through a negation, or pick with no
reference to the owner (the list is `STOCK` in `gates/endorsement.mjs`).
Lists have holes: wording outside them, in any language, gets through. In
the other languages a negation anywhere in the sentence clears it, and the
prescription scan matches a listed phrase even inside a refusal that
negates it, naming the file but not the line.
Fixtures:
`bad-fix-appended-pt.md`, `endorsement/bad-portuguese.md`,
`endorsement/bad-stock.md`, `endorsement/good-spanish-refusal.md`.

## Why the audit is red

The receipts are never edited (the method in `receipts/README.md`), and the
scan now fails on three things they contain: line 92 of round 1 endorses the
owner's two candidate fixes ("Both of your candidates close that gap"); the
turn it sits in (round 1, response to message 2, from line 88) is not the
frozen return `rules.md` now requires, because it was recorded before that
rule existed; and 13 quoted spans across the two outputs are not byte for byte in the inputs
(6 exact match absent with a normalised match present, 2 exact absent with
a 3-word run present, 5 exact absent and neither; the buckets are heuristic
and name operations, not intent, and `results.md`, section "F2: the 13 spans", reads
each span against the receipt: 8 are anchors, 5 are not). Line 92 passed
the original's checker for a stated reason: that scan did read the receipt,
but it read it for twelve prescription phrases and had no rule for an
endorsement of the owner's candidates, and the sentence contains none of
the twelve. The original's checker also carried two excuse lists
(`PRESCRIPTION_ALLOWED`, `EM_DASH_ALLOWED`); both were already empty, so
deleting them changes no result on this bundle. The deletion is a guard
against a future excuse, not the reason line 92 now fails, and the new
gates have no such list to begin with. Red here is the checker doing its
job on its own record. The audit goes green only with a new round whose
transcript has none of the three; the acceptance check at the repo root is
green today, because the checker does exactly what `questions.md` promised.

What the gates read: receipt outputs below the VERBATIM marker and
`examples.md` only. `SKILL.md`, `rules.md`, `identity.md`, the READMEs and
`reference/` are not in their scope.

## Folders

| Folder | What it holds |
|---|---|
| `receipts/` | Verbatim transcripts of real rounds, with exact inputs, a pre-declared method, and SHA-256 pins. See its README for the method and what each round showed. |
| `fixtures/` | Planted-bad files, each carrying one defect the verifier must catch: four at the top (a stapled-on fix, two primary causes, em dashes, a missing RULED OUT), then one folder per gate. `soft-spot/` holds the letter's sentence (`bad.md`, pinned by the sentence's SHA-256), its twin with the refusal (`good.md`) and `variants.md` (one sentence per line, marked `endorses` or `clean`, the file pinned by SHA-256). `endorsement/` holds the F1 gate's other files: `bad-markup.md`, the claim hidden in markup; `bad-sound.md`, a judging word version 1 of the gate did not know; `good-refusal.md`, a refusal with no judgement in it; `good-deferral.md`, a conditional that hands the decision back. `quote-anchor/` holds the F2 gate's files. `frozen-return/` holds the exact gate's: `good-frozen.md`, the frozen return; `bad-neighbour.md`, the same with the soft spot's live neighbour appended ("Both of your candidates are responses to that one gap.", from `run-original/live-round-3/session-3.md`, a sentence the word-list gate passes); `bad-portuguese.md`, an endorsement in Portuguese appended; `bad-advice.md`, a next step appended; `bad-fake-heading.md` and `bad-duplicate-heading.md`, an endorsement hidden under a heading the response writes itself; `bad-line-reworded.md` and `bad-cause-reworded.md`. Each gate pins its folder's file names in code (count and names): a missing, renamed or unlisted file is a named failure. `--selftest` fails unless every bad file fails and every good file passes, and it first proves the wiring (GATES holds exactly the three labels; each gate's `scan()` finds a plant in a copy built on the spot). A verifier that cannot fail is a rubber stamp. The selftest proves fixture integrity; it says nothing about detection of wordings outside the fixtures. |
| `gates/` | The three letter gates and what they share (`common.mjs`: the VERBATIM marker, defined once, the receipt list, and `FIX_REQUEST_TURNS`, which receipt turns answer a fix request). Each gate exports `LABEL`, `TAG`, `scan(armRoot)`, `summary(items)` and `selftest(fixturesDir)`; `verify.mjs` loops over them and knows nothing of their insides. `endorsement.mjs` also exports `sentences(armRoot, skip)`, every prose sentence of an arm with its verdict, which is all `control/corpus.mjs` uses. |

## The original's own checks, left as they were

The checks the original shipped (the output skeleton, example discipline,
one cause, the prescription-phrase scan, the em-dash scan, count
consistency, receipt pins) are unchanged apart from the two empty excuse
lists and one reading change: the skeleton check reads `rules.md` step 6's
template as plain text (from "Fixed format" to the next `---` line), because
the template is no longer in a code block. Their seams are the original's and are listed here, not fixed: the
prescription scan reads only the text between the first `VERBATIM OUTPUT
BELOW` line and a second one, so text after a second marker is unread; it
matches plain phrases, so markup inside a phrase (`you <b>should</b>`)
passes (the rebuild does read a phrase broken across lines, and a curly
apostrophe, as the phrase); in `examples.md` it reads only the fenced diagnosis and refusal
blocks, so a prescription in the prose between them passes; and the em-dash
scan counts the character, so an entity (`&mdash;`) passes. `CHANGELOG.md` is the original's history; the rebuild adds one line
at its top pointing to `../results.md` and changes nothing else in it.

## The checker's own record

On its first run against the real bundle, the verifier came back RED with
three defects that had survived multiple human passes: `SKILL.md` claimed
five worked diagnoses while `examples.md` ships six, and both split
diagnoses in Case 5 lacked the RULED OUT section that `rules.md` Step 5
requires of each split. All three were fixed on the record (see
`CHANGELOG.md`). That first red run is the argument for the checker.
