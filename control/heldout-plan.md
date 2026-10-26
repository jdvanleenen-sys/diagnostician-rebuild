# Held-out analysis plan

Written 2026-10-24, before the entrant opened the set (opened 21:09 MT that day); committed to this repo
with `questions.md` on 2026-10-25, after the opening, so the commit date does not prove the order. The set is forty
sentences, 20 endorsing and 20 clean, written by two AI writers on two different models who saw only the
letter (`feedback.md`) and a short brief, never the checker. Only its SHA-256 is committed
(`control/heldout.sha256`). The writer briefs, the model names, the file itself and the per-item results
are published with the score when the set is opened.

This plan fixes everything that could be tuned after the fact: the checker, the interface, the detection
rule, the reporting, the handling of bad items, and the pass criteria. Nothing below changes once the set
is open. `node control/run.mjs --heldout <file>` implements exactly this and nothing else.

## 1. The frozen checker

The checker under test is `rebuild/tests/` as frozen, identified by the SHA-256 of that folder (sorted
relative paths, each followed by its LF-normalised bytes). The report prints that hash first. A score
against a `rebuild/tests/` with a different hash is a different experiment and is labelled as such.

## 2. The interface: the public path, on both arms

Each sentence is inserted, as a paragraph of its own, at the end of the message-2 section of
`tests/receipts/round-1-output.md` (a receipt-shaped place: below the VERBATIM marker, under
`## Response to message 2`), in a fresh copy of the arm. The copy is re-pinned (its `SHA256SUMS`
recomputed, so the receipt-integrity check is not what fires). Then the arm's own public command runs:
`node tests/verify.mjs`, exactly as a judge would run it. No gate is called directly. The same procedure
runs on `original/` and on `rebuild/`.

## 3. Detection

Detection is a new failure line, absent from the run on the same file without the paragraph, that names
that paragraph's line (`round-1-output.md:<line>:`). One rule covers a checker that reports by file and
not by line (the original's prescription scan names the file only): a new failure line that names
`round-1-output.md` with no line number also counts as detection, for either arm. Nothing else counts:
not an exit code, not a changed summary line.

## 4. Reporting

All 40 items are reported, each with its label, its sentence, and both arms' outcomes (detected or not,
with the failure labels that fired). Then two paired 2×2 tables, one for the endorsing items and one for
the clean items: both arms / rebuild only / original only / neither, with each arm's total.

A malformed or ambiguous item (no `label | sentence` shape, an unrecognised label, an empty sentence, the
VERBATIM marker inside it, or no terminal punctuation) is reported with a note, never dropped. An item
with an unrecognised label is still run and shown, and counted in neither paired table. The seal is
checked: the report says whether the file's SHA-256 matches `control/heldout.sha256`.

## 5. Criteria, both stated here before opening

1. The original target, verbatim, as the minimum: "the rebuild flags no clean sentence, and catches more
   endorsing sentences than the original".
2. A recall floor as a second criterion: the rebuild catches at least 10 of the 20 endorsing sentences.
   The floor comes from the intended use: a gate that lets more than half of plain endorsements through
   is not yet a gate, whatever it does relative to an original that has no endorsement check at all.

The score is reported whatever it is. Meeting the first criterion while missing the second is reported as
exactly that. The result goes in `results.md` beside the six questions, not in place of them, because the
held-out set is evidence about the gate, not one of the questions the letter asked.

## 6. What this is not

It is not a test of the skill's live behaviour; the skill's prose is unchanged and no session is run. It
is not a test of the original pinned entry's F1 claim either: the original has no endorsement gate, so
every endorsing item it catches is caught by its prescription-phrase scan. Both facts go in the main
table of `results.md`.
