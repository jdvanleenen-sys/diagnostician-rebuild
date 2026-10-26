# The gate that passed its own soft spot

My comp #10 entry is a Claude skill that explains why another skill failed and refuses to pick the fix.
Its checker passed the one sentence of its own saved run that the judges named:
"A gate that passes your one soft spot is not a gate yet." This rebuild makes the checker fail that sentence, and makes the skill's
refusal a fixed form the checker can verify exactly. `original/` is pinned; `rebuild/` is the new version.
One command re-runs both, offline, in 30 to 90 seconds, and should end with `RESULT: pass`:

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

The expected answers are in `questions.md`, unchanged since commit 2. The fair comparisons are Q1, Q2, Q4,
Q6 and, in Q8, the words found nowhere in the input; on the sealed turn 2 alone the counts are 30 against 2, and 11 against 0 found nowhere in the input. To check a row: its `## result` line at the end of
`run-original/Q<n>.txt` and `run-rebuild/Q<n>.txt`.

## What changed

The letter places the defect in the refusal turn and points to a form that "has no slot for the leak".
So `rules.md` changed in three places: the refusal became a **frozen return** (one fixed line, then the
diagnosis's cause copied character for character, nothing else); quotation marks now mean an exact copy of
the input; the diagnosis template is plain text. The checker gained three gates: the frozen return checked
exactly, quotes checked byte for byte, and the letter's sentence caught by word lists outside the refusal
turn. On the judged run it now fails line 92 and the refusal turn around it, and leaves line 90 alone.

**On live answers.** 8 fix requests in different disguises and 2 ordinary questions, written blind by
another model and sealed before any session, went twice to each skill on Opus 5.5. The original gave the
frozen return 0 of 16 times (it has none); the rebuild 16 of 16, character for character. Two blind AI
readers found the original said something about the owner's fixes in 10 (Opus) and 16 (Sonnet) of its 16 answers; the rebuild, in none, which follows from its form. By Q8, the rebuild's checker finds 216 quoted
spans not byte for byte in the input in the original's 20 sessions and 29 in the rebuild's; of those, the words found nowhere in the input are 41 and 17.

**On a second model**, Sonnet 5.5, with the plan and its bars pushed to GitHub before the first session
(`control/second-model-plan.md`), the rebuild gave the frozen return 16 of 16 again; the original gave way twice, once with `either removing the root or adding a test closes that gap`, the letter's soft spot in
new words; words found nowhere in the input were 21 against 9.

**Why the audit is red.** The saved runs are never edited, so `node rebuild/tests/verify.mjs` finds the
soft spot, the refusal turn, and 13 quoted spans not byte for byte in the input, 8 of them quotations of it (15 failures) every time. That red is the fix working.

## What did not improve

- The rebuild's live answers still quote words found nowhere in the input: 17 over 20 sessions, all in turn 1. The lab's pre-set line for those was at most 2 per 12 sessions; it reached 5. On Sonnet, 2 more on turn 2, one copied inside a frozen return.
- Outside the refusal turn, word lists stand guard: the endorsement gate caught 11 of 20 unseen endorsements (16 of 20 in a version written after seeing them), and 30 of 76 new ones reviewers wrote at it. About half of new wording gets through.
- On live answers the same gate flags sentences that endorse nothing: 5 in the rebuild's 20 sessions.
- Two models from one maker, one diagnosis input, 8 requests run twice; over-refusal tested on 2 plain questions; the frozen line is English whatever the request's language.
- The first five commits were made afterwards from finished work, so git shows their order, not their times; Q1 to Q6 were shaped on a prototype checker first. Commit 8, the second-model plan, is the one test whose order GitHub's own record proves. `questions.md` is frozen with four stale lines (`evidence.md`, Provenance).

`results.md` has the rest; `evidence.md` has the detail behind every number, and every other command.

## For judges

```
node control/run.mjs                        # 30 to 90 s: RESULT: pass (exit 0); checks every pin, number and pass line
node rebuild/tests/verify.mjs               # ~1 s: RED, 15 failures, by design
node rebuild/tests/verify.mjs --selftest    # ~2 s: SELFTEST: GREEN
node control/attacks.mjs --quick            # under a minute: the reviewers' attacks and declared limits (full run ~12 min)
```

`control/run.mjs` ends in one word: **pass** (0), **plant detected** (2), **baseline defect** (3),
**integrity violation** (4) or **harness error** (5). Node 18 or later, standard library only,
no network, no API key, no git needed. CI runs it on Node 18, 20, 22 and 24.

| Path | Job |
|---|---|
| `feedback.md` | The judges' letter, byte for byte |
| `original/` | The judged entry, pinned, read only |
| `questions.md` | Eight questions with expected answers, unchanged since commit 2 |
| `run-original/`, `run-rebuild/` | Each question's command and full output per arm, and the live sessions |
| `rebuild/` | The rebuilt entry: `rules.md` (three changes) and `tests/` (the checker) |
| `results.md` | The results, including what did not improve |
| `evidence.md` | The detail, every other command, and provenance |
| `control/` | The harness, expected results, checked claims and seals |
| `CLAUDE.md` | Routes an AI agent to the right file |

Built on Interpretable Context Methodology (Van Clief and McDermott, arXiv:2603.16021, MIT-licensed). Both
arms keep the original's MIT licence.
