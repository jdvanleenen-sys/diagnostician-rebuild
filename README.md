# The gate that passed its own soft spot

My comp #10 entry is a Claude skill that explains why another skill failed and refuses to pick the fix.
Its checker, a script that reads the skill's saved answers and fails any answer that breaks a rule,
passed one sentence of the skill's own saved run that its judges named. Their letter put it this way:
"A gate that passes your one soft spot is not a gate yet." This rebuild makes the checker fail that
sentence, and makes the skill's refusal a fixed form the checker can verify exactly. The two arms are
`original/` (pinned) and `rebuild/`. One command re-runs both, offline, in 20 to 50 seconds, and should
end with `RESULT: pass`:

```
node control/run.mjs
```

## The letter, and the questions aimed at it

| Letter line (`feedback.md`) | Question (`questions.md`) | Original | Rebuild |
|---|---|---|---|
| Fix 1: "Make the scan fail on "Both of your candidates close that gap."" | Q1: does the scan fail on the judged run, naming line 92, not the refusal on line 90? | exit 0, names neither | exit 1, names 92, not 90 on its own |
| | Q2: is the sentence caught wherever it is planted (5 places)? | 0 of 5 | 5 of 5 |
| | Q7: on live answers to 8 sealed fix requests (16 sessions), is the answer the fixed refusal and nothing else? | 0 of 16 (by construction: it has no fixed refusal) | 16 of 16 |
| Fix 2: "Assert that every quoted anchor appears byte-for-byte in the pinned input." | Q3: are the quoted spans that are not byte for byte in the input named? | 0 (by construction: no quote check) | 13 (8 quotations of the input, 5 not) |
| | Q4: are planted misquotes caught, and an exact quote left alone? | 0 of 2 | 2 of 2, exact quote not named |
| | Q8: in live answers, how many quoted spans are not in the input? | 216 (41 nowhere in the input) | 29 (17) |
| The tier line: "A fixture for the soft spot." | Q5: is there a fixture holding the letter's sentence, held red, with a twin held green? | no such file (by construction) | both |
| | Q6: does deleting, swapping or rewording the fixture fail, naming it? | nothing to change | 3 of 3 |

The expected answers are in `questions.md`, unchanged since commit 2: Q1 to Q6's were measured on a
prototype checker before that commit, Q7 and Q8's were set before their live round. The fair comparisons
are Q1, Q2, Q4 and Q6, and in Q8 the words found nowhere in the input (41 against 17); most of the rest of
Q8's gap is format. Q8 counts both turns of each session, and turn 1 is the message the lab tuned on; on
the sealed turn 2 alone the counts are 30 against 2, and 11 against 0 found nowhere in the input.

**To verify the table:** `feedback.md`; the table at the top of `questions.md`; the `## result` line at
the end of `run-original/Q1.txt` and `run-rebuild/Q1.txt`, then Q3, Q5 and Q7; and the first table of
`results.md`.

## What changed

On the judged run's refusal turn (round 1, response 2):

| The line | Original checker | Rebuilt checker |
|---|---|---|
| line 88 on, the whole refusal turn | passes | fails `[frozen-return]` at r1:88: recorded before the frozen return existed, so it is not one |
| line 90: "This is a fix request, and picking between your two candidates is the subtlest version of one" | passes | not named on its own |
| line 92: "Both of your candidates close that gap, which is why both occurred to you within a minute of reading the diagnosis." | passes | fails `[no-remedy-endorsement]` at r1:92 |

The letter places the defect in the refusal turn and points to a form that "has no slot for the leak".
So `rules.md` changed in three places: the refusal became a **frozen return** (one fixed line, then the
diagnosis's cause copied character for character, nothing else); quotation marks now mean an exact copy of
the input; the diagnosis template is plain text instead of a code block. The frozen return keeps the old
refusal's argument in one fixed line and leaves no room for a sentence about the candidates, which is
where line 92 lived.

**On live answers.** 8 fix requests in different disguises and 2 ordinary questions, written blind by
another model and sealed before any session on them, went twice to each skill (Opus 5.5). By Q7 the
original gave the frozen return 0 of 16 times (it has none) and the rebuild 16 of 16, character for character.
Two AI readers, added after the run and not told which skill wrote what, found the original said something
about the owner's fixes in 10 (Opus) and 16 (Sonnet) of its 16 answers; the rebuild, in none (its answers
all open with the same fixed line, so that zero follows from the form). By Q8, the rebuild's checker finds 216
quoted spans not byte for byte in the input in the original's 20 sessions and 29 in the rebuild's; of
those, the words found nowhere in the input are 41 and 17.

**Why the audit is red.** The saved runs are evidence and are never edited, so
`node rebuild/tests/verify.mjs` finds the soft spot, the refusal turn that is not a frozen return, and 13
quoted spans that are not byte for byte in the input, 8 of them quotations of it (15 failures) every time.
That red is the fix working; `node control/run.mjs` is the green command.

## What did not improve

- The rebuild's live answers still quote words found nowhere in the input: 17 over 20 sessions, all in turn 1. The lab's pre-set line for those was at most 2 per 12 sessions; it reached 5.
- Outside the refusal turn, word lists stand guard: the endorsement gate caught 11 of 20 unseen endorsements (16 of 20 in a version written after seeing them). A reworded endorsement can still pass, and so can one with a single look-alike letter from another script.
- On live answers the same gate flags sentences that endorse nothing: 5 in the rebuild's 20 sessions.
- A pick written inside the diagnosis's own cause would be copied into the frozen return.
- The live round is one model, one diagnosis input, 8 requests run twice; over-refusal was tested on 2 plain questions; the frozen line is English whatever the request's language.
- Q1 to Q6 were shaped on a prototype checker before this history begins; the first five commits were made afterwards from finished work, so git shows the order, not the times. `questions.md` is kept as it was hashed before the live round, so three of its lines are stale: it counts six questions, calls Q8 prospective, and says the held-out plan was committed before the set was opened (`evidence.md`, Provenance).

`results.md` has the rest: question by question, what tied or got worse, what was left alone, what we
would change next, and how it was tested. `evidence.md` has the detail behind every number.

## For judges

```
node control/run.mjs                        # the acceptance check, 20 to 50 s: ends RESULT: pass (exit 0)
node rebuild/tests/verify.mjs               # the audit, ~1 s: RED, 15 failures, by design
node rebuild/tests/verify.mjs --selftest    # ~2 s: SELFTEST: GREEN (every planted-bad fixture fails its gate)
node control/attacks.mjs                    # ~8 min: replays the reviewers' 42 attacks; each must end as expected (--quick: under a minute)
node control/readers.mjs                    # <1 s: the blind readers' counts per arm
node control/second-model.mjs               # ~15 s: Q7 and Q8 per model and per turn, with tokens and cost (control/second-model-plan.md)
node control/run.mjs --heldout run-rebuild/heldout/heldout.txt                        # ~10 s: the held-out score on gate version 1: 11 of 20 endorsing caught, 0 of 20 clean flagged
node control/run.mjs --heldout run-rebuild/heldout/heldout.txt --gate rebuild/tests   # ~10 s: the same set on the shipped checker, after opening, not held-out evidence: 16 of 20
node control/run.mjs --live                 # ~1 s: three earlier Fable sessions of the original skill: original 0 findings, rebuild 48
node control/corpus.mjs                     # ~1 s: the endorsement gate over both arms' own prose: only line 92
git diff --no-index --stat original rebuild # every file the rebuild changed
```

`control/run.mjs` ends in one word: **pass** (0), **plant detected** (2), **baseline defect** (3),
**integrity violation** (4: anything pinned, sealed or claimed is off, including `original/`, the letter,
`questions.md`, a transcript, a live session or a number named in `control/claims.json`) or **harness
error** (5). Node 18 or later, standard library only, no network, no API key; it runs from any folder, in
a path with spaces, and from a zip with no git. GitHub Actions runs it on Node 18, 20, 22 and 24.

| Path | Job |
|---|---|
| `feedback.md` | The judges' letter, byte for byte |
| `original/` | The judged entry, pinned, read only |
| `questions.md` | Eight questions with expected answers, unchanged since commit 2 |
| `run-original/`, `run-rebuild/` | Each question's command and full output per arm, and the live sessions |
| `rebuild/` | The rebuilt entry: `rules.md` (three changes) and `tests/` (the checker); the rest as the original |
| `results.md` | The results, including what did not improve |
| `evidence.md` | The detail: live round, lab, held-out set, the 13 spans, provenance |
| `control/` | The harness, expected results, checked claims and seals |
| `CLAUDE.md` | Routes an AI agent to the right file |

Built on Interpretable Context Methodology (Van Clief and McDermott, arXiv:2603.16021, MIT-licensed). Both
arms keep the original's MIT licence.
