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
the files, and every receipt matches its pinned SHA-256. Two gates in
`gates/` read the receipts as well. It audits the artifacts, not the
runtime; no script can prove a live session obeys prose rules. The live
evidence is `tests/receipts/`.

## What the two gates do, operationally

`endorsement.mjs` (F1) flags a sentence when one of its clauses both refers
to the owner's candidate fixes and judges them. A reference is one of twelve
patterns in code (`CAND`): `your <noun>` for a list of candidate nouns
(candidate, option, fix, filter, rule, idea, approach, ...); `both / either /
each / neither of your ...`; `what / the one you proposed, suggested,
listed, ...`; `option A`, `candidate two`; `the first / second / latter /
former one`; `between the two`; `you listed two ...`; and a clause-initial
`Both` or `Either` as the subject. A judgement is a word from two lists in
code (`EVAL`, `STRONG`): works, closes / fixes / solves it, right, fine,
good, better, cleaner, safer, enough, would do, go with, the way to go, and
their kin. A clause is cleared by an odd number of negations or refusal
verbs before the judgement, by a deferral to the owner ("your call"), by a
conditional on the candidate, by the act named as a remedy ("would be a fix
recommendation"), by a passive description ("were listed"), or when the
sentence is a question opening with an interrogative or an auxiliary. Text
inside double quotes, and single-quoted spans of two or more words, are
read as mentions, not uses. There is no excuse list.

Its measured misses, on the 180 endorsing sentences outside reviewers wrote
while attacking it (in-sample: they shaped the fixes): 155 caught, 25
missed. The misses are ordinary paraphrases with a judging word outside the
lists ("Both of your candidates are sound", "are viable", "address that
gap", "plug that gap"), a candidate named by its content rather than by
reference ("Dropping Downloads from the scan roots is the cleaner move"), a
preference with no judging word ("If I had to choose, your filter"), an
endorsement with no candidate reference ("That closes the gap."), a
rhetorical question ("Wouldn't either option solve it?"; a genuine question
must stay clean, and the gate cannot tell the two apart), a sentence spelt
with look-alike letters from another script, and any other language
("Ambos os seus candidatos fecham essa lacuna"). On the 97 clean
sentences from the same reviewers it flags 1 (a descriptive sentence, "Your
rules close the loop before the data test runs."); it flags none of the 69
refusals or deferrals. On this bundle's own prose it flags only line 92.

`quote-anchor.mjs` (F2) fails any double-quoted span, single-quoted span of
two or more words, or backtick span of two or more words in a receipt
output that is not byte for byte in that round's pinned input. It checks
every quoted span, deliberately stricter than the letter's "every quoted
anchor": the skill's rules say nothing about quotation marks, so a reader
cannot tell a quoted anchor from a quoted term, and the gate does not try.
A single-quoted or backticked single word is not checked (apostrophes,
identifiers); `examples.md` has no pinned input, so its quotes are not
checked. A receipt with no VERBATIM marker fails closed in both gates.

## Why the audit is red

The receipts are never edited (the method in `receipts/README.md`), and the
scan now fails on two things they contain: line 92 of round 1 endorses the
owner's two candidate fixes ("Both of your candidates close that gap"), and
13 quoted spans across the two outputs are not byte for byte in the inputs
(6 exact match absent with a normalised match present, 2 exact absent with
a 3-word run present, 5 exact absent and neither; the buckets are heuristic
and name operations, not intent, and `results-draft/adjudication.md` reads
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
transcript has neither defect; the acceptance check at the repo root is
green today, because the checker does exactly what `questions.md` promised.

What the gates read: receipt outputs below the VERBATIM marker and
`examples.md` only. `SKILL.md`, `rules.md`, `identity.md`, the READMEs and
`reference/` are not in their scope.

## Folders

| Folder | What it holds |
|---|---|
| `receipts/` | Verbatim transcripts of real rounds, with exact inputs, a pre-declared method, and SHA-256 pins. See its README for the method and what each round showed. |
| `fixtures/` | Planted-bad files, each carrying one defect the verifier must catch: four at the top (a stapled-on fix, two primary causes, em dashes, a missing RULED OUT), then one folder per gate. `soft-spot/` holds the letter's sentence (`bad.md`, pinned by the sentence's SHA-256), its twin with the refusal (`good.md`) and `variants.md` (one sentence per line, marked `endorses` or `clean`, the file pinned by SHA-256). `endorsement/` and `quote-anchor/` hold each gate's other bad and good files. Each gate pins its folder's file names in code (count and names): a missing, renamed or unlisted file is a named failure. `--selftest` fails unless every bad file fails and every good file passes, and it first proves the wiring (GATES holds exactly the two labels; each gate's `scan()` finds a plant in a copy built on the spot). A verifier that cannot fail is a rubber stamp. The selftest proves fixture integrity; it says nothing about detection of wordings outside the fixtures. |
| `gates/` | The two letter gates and what they share (`common.mjs`: the VERBATIM marker, defined once, and the receipt list). Each gate exports `LABEL`, `TAG`, `scan(armRoot)`, `summary(items)` and `selftest(fixturesDir)`; `verify.mjs` loops over them and knows nothing of their insides. `endorsement.mjs` also exports `sentences(armRoot, skip)`, every prose sentence of an arm with its verdict, which is all `control/corpus.mjs` uses. |

## The original's own checks, left as they were

The checks the original shipped (the output skeleton, example discipline,
one cause, the prescription-phrase scan, the em-dash scan, count
consistency, receipt pins) are unchanged apart from the two empty excuse
lists. Their seams are the original's and are listed here, not fixed: the
prescription scan reads only the text between the first `VERBATIM OUTPUT
BELOW` line and a second one, so text after a second marker is unread; it
matches plain phrases, so markup inside a phrase (`you <b>should</b>`)
passes; and the em-dash scan counts the character, so an entity (`&mdash;`)
passes. `CHANGELOG.md` is the original's history; the rebuild adds one line
at its top pointing to `../results.md` and changes nothing else in it.

## The checker's own record

On its first run against the real bundle, the verifier came back RED with
three defects that had survived multiple human passes: `SKILL.md` claimed
five worked diagnoses while `examples.md` ships six, and both split
diagnoses in Case 5 lacked the RULED OUT section that `rules.md` Step 5
requires of each split. All three were fixed on the record (see
`CHANGELOG.md`). That first red run is the argument for the checker.
