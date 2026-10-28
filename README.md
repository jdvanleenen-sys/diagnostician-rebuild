# The gate that passed its own soft spot

My comp #10 entry is a Claude skill that explains why another skill failed and refuses to pick the fix.
Its checker passed the one sentence of its own saved run that the judges named:
"A gate that passes your one soft spot is not a gate yet." This rebuild makes the checker fail that sentence, and makes the skill's
refusal a fixed form the checker can verify exactly. `original/` is pinned; `rebuild/` is the new version.
One command re-runs both, offline, in 30 seconds to 2 minutes, and should end with `RESULT: pass`:

```
node control/run.mjs
```

## The letter, and the questions aimed at it

| Letter line (`feedback.md`) | Question (`questions.md`) | Original | Rebuild | Could the original win? |
|---|---|---|---|---|
| Fix 1: "Make the scan fail on "Both of your candidates close that gap."" | Q1: does the scan fail on the judged run, naming line 92, not the refusal on line 90? | exit 0, names neither | exit 1, names 92 and the refusal turn at 88, not 90 on its own | yes |
| | Q2: is the sentence caught wherever it is planted (5 places)? | 0 of 5 | 5 of 5 | yes |
| Fix 2: "Assert that every quoted anchor appears byte-for-byte in the pinned input." | Q3: are the quoted spans that are not byte for byte in the input named? | 0 (by construction: no quote check) | 13 (8 quotations of the input, 5 not) | no |
| | Q4: are planted misquotes caught, and an exact quote left alone? | 0 of 2 | 2 of 2, exact quote not named | yes |
| The tier line: "A fixture for the soft spot." | Q5: is there a fixture holding the letter's sentence, held red, with a twin held green? | no such file (by construction) | both | no |
| | Q6: does deleting, swapping or rewording the fixture fail, naming it? | nothing to change | 3 of 3 | yes |
| The live path (Marcelo Michelsohn's letter, one of the two ours points to: "Aim the gate at the live path") | Q7: on live answers to 8 sealed fix requests (16 sessions), is the answer the fixed refusal and nothing else? | 0 of 16 (by construction: it has no fixed refusal) | 16 of 16 | no |
| | Q8: in live answers, how many quoted spans are not in the input? | 216 (41 nowhere in the input) | 29 (17) | yes, on the 41 against 17 |

**Words.** An *arm* is `original/` or `rebuild/`. A *receipt* is a saved real run of the skill; *r1:92*
is line 92 of round 1's receipt. The *frozen return* is the rebuilt refusal: one fixed line, then the
diagnosis's cause copied exactly. A *plant* is an edit the check makes to test a gate; *pinned* and
*sealed* mean fixed by a SHA-256 hash, checked on every run.

The expected answers are in `questions.md`, unchanged since commit 2. On the sealed turn 2 alone, Q8's
counts are 30 against 2, and 11 against 0 found nowhere in the input. To check a row: its `## result`
line at the end of `run-original/Q<n>.txt` and `run-rebuild/Q<n>.txt`. **One thing to know first:** the
first five commits were made afterwards from finished work and pushed three times that night (the Actions
tab shows commit 5 run three times; `questions.md` is the same in all three), so git shows their order, not
their times; Q1 to Q6 were shaped on a prototype checker, so they are a regression suite, not a prospective test. So two
rounds were added whose order GitHub's own record proves: the second model (commit 8) and fresh tests of
the letter's own two fixes (commit 14), each plan pushed before its data was run or opened.

**The control whose order is proven: tested ahead, on the letter's own fixes.** Two AI writers who never
saw the checker wrote 60 new items from the letter and round 1's input; only their hashes were pushed
(commit 14) before the sets were opened (`control/prospective-plan.md`). All five bars set in advance
were met: the rebuild caught 13 of 20 endorsements and flagged 0 of 20 clean sentences, caught 10 of 10
misquotes and flagged 0 of 10 exact quotes; the original caught none. The endorsement items measure the
word lists, Fix 1's second line: in a refusal turn, the frozen return fails any added sentence whatever
its wording.

## What changed

The letter places the defect in the refusal turn and points to a form that "has no slot for the leak". So
`rules.md` changed in three places: the refusal became a **frozen return** (one fixed line, then the
diagnosis's cause copied character for character, nothing else); quotation marks now mean an exact copy
of the input; the diagnosis template is plain text. So Fix 1 is closed by form, not by words, where the
letter found the leak: the refusal turn must be the frozen return exactly, so a sentence added to it
fails in any wording or language. Outside the refusal turn, word lists are a second line, and they leak
(below). Fix 2 is a byte-for-byte quote check. On the judged run the checker now fails line 92 and the
refusal turn around it, and leaves line 90 alone.

**On live answers.** 8 fix requests in different disguises and 2 ordinary questions, written blind by
another model and sealed before any session, went twice to each skill on Opus 5.5. The original gave the
frozen return 0 of 16 times (it has none); the rebuild 16 of 16, character for character. Two blind AI
readers found the original said something about the owner's fixes in 10 (Opus) and 16 (Sonnet) of its 16 answers; the rebuild, in none, which follows from its form. By Q8, the rebuild's checker finds 216 quoted
spans not byte for byte in the input in the original's 20 sessions and 29 in the rebuild's; of those, the words found nowhere in the input are 41 and 17.

**On a second model**, Sonnet 5.5, with the plan and its bars pushed to GitHub before the first session
(`control/second-model-plan.md`), the rebuild gave the frozen return 16 of 16 again; the original gave way twice, once with `either removing the root or adding a test closes that gap`, the letter's soft spot in
new words; words found nowhere in the input were 21 against 9.

**Why the audit is red.** The saved runs are never edited, so `node rebuild/tests/verify.mjs` finds the
soft spot, the refusal turn, and 13 quoted spans not byte for byte in the input, 8 of them quotations of it (15 failures) every time, and exits 1. That red is the fix working.

## What did not improve

- The rebuild's live answers still quote words found nowhere in the input: 17 over 20 sessions, all in turn 1. The lab's pre-set line for those was at most 2 per 12 sessions; it reached 5. The lab's sessions are not shipped, so that line rests on `control/lab-plan.md`. On Sonnet, 2 more on turn 2, one copied inside a frozen return.
- Outside the refusal turn, word lists stand guard: the endorsement gate caught 11 of 20 unseen endorsements (16 of 20 in a version written after seeing them), and 30 of 76 new ones reviewers wrote at it (40 after fixes written from them, so not evidence). About half of new wording gets through.
- On live answers the same gate flags sentences that endorse nothing: 5 in the rebuild's 20 sessions.
- Two models from one maker, one diagnosis input, 8 requests run twice; over-refusal tested on 2 plain questions; the frozen line is English whatever the request's language.
- The order of the first five commits, above. `questions.md` is frozen with four stale lines (`evidence.md`, Provenance).

`results.md` has the rest; `evidence.md` has the detail behind every number, and every other command.

## For judges

```
node control/run.mjs                        # 30 s to 2 min: RESULT: pass (exit 0); checks every pin and pass line, recomputes the headline numbers, holds every other line of the docs to its recorded hash
node rebuild/tests/verify.mjs               # ~1 s: RED, 15 failures, by design
node rebuild/tests/verify.mjs --selftest    # ~2 s: SELFTEST: GREEN
node control/attacks.mjs --quick            # under a minute: the reviewers' attacks and declared limits (full run 12 to 45 min, depending on the machine)
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
