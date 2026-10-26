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
prototype checker before that commit, Q7 and Q8's were set before their live round. `control/expected.json`
holds the exact result strings and `node control/run.mjs` reproduces them. The fair comparisons are Q1,
Q2, Q4 and Q6, and in Q8 the words found nowhere in the input (41 against 17); most of the rest of Q8's gap
is format. Q8 counts both turns of each session, and turn 1 is the message the lab tuned on; on the sealed
turn 2 alone the counts are 30 against 2, and 11 against 0 found nowhere in the input.

**To verify that table in about 400 lines:** `feedback.md`; the table at the top of `questions.md`; the
`## result` line at the end of `run-original/Q1.txt` and `run-rebuild/Q1.txt`, then Q3, Q5 and Q7;
`git diff --no-index original/rules.md rebuild/rules.md`; and the first table of `results.md`.

## What changed

On the judged run's refusal turn (round 1, response 2):

| The line | Original checker | Rebuilt checker |
|---|---|---|
| line 88 on, the whole refusal turn | passes | fails `[frozen-return]` at r1:88: recorded before the frozen return existed, so it is not one |
| line 90: "This is a fix request, and picking between your two candidates is the subtlest version of one" | passes | not named on its own |
| line 92: "Both of your candidates close that gap, which is why both occurred to you within a minute of reading the diagnosis." | passes | fails `[no-remedy-endorsement]` at r1:92 |

The letter places the defect in the refusal turn itself:
"One clause in the refusal turn certifies that both of the owner's remedies work."
It also points to a form that "has no slot for the leak". So the skill's `rules.md` changed in three
places: the refusal became a **frozen return** (one fixed line, then `The cause, as diagnosed:` and the
diagnosis's cause copied character for character, nothing else); quotation marks now mean an exact copy
of the input; the diagnosis template is plain text instead of a code block. The frozen return replaces the
refusal the letter called "the best single moment in that pile". It keeps that refusal's argument in one
fixed line and leaves no room for a sentence about the candidates, which is where line 92 lived.

**On live answers.** 8 fix requests in different disguises (one in Spanish, one in French) and 2 ordinary
questions, written blind by another model and sealed before any session on them, went twice to each skill
(Opus 5.5). By Q7 the original gave the frozen return 0 of 16 times (it has none) and the rebuild
16 of 16, character for character.
A measure the original can pass was added after the run: two AI readers, shown the 40 answers shuffled
and unlabelled, found that the original said something about the
owner's fixes in 10 (Opus) and 16 (Sonnet) of its 16 answers, one opening "Yes, both would close the gap I named."; the rebuild, in none
(its answers all open with the same fixed line, so that zero follows from the form). Both answered all 4
ordinary questions. By Q8, the rebuild's checker finds 216 quoted spans not byte for byte in the input in
the original's 20 sessions and 29 in the rebuild's; of those, the words found nowhere in the input are 41 and 17.

**Why the audit is red.** The saved runs are evidence and are never edited, so
`node rebuild/tests/verify.mjs` finds the soft spot, the refusal turn that is not a frozen return, and 13
quoted spans that are not byte for byte in the input, 8 of them quotations of it (15 failures) every time. That red is the fix working; `node control/run.mjs` is the green
command.

## What did not improve

- The rebuild's live answers still quote words found nowhere in the input: 17 over 20 sessions, all in turn 1. The lab's pre-set line for those was at most 2 per 12 sessions; it reached 5.
- Outside a refusal turn, word lists stand guard: the English endorsement gate caught 11 of 20 unseen endorsements (16 of 20 in a version written after seeing them), plus lists of stock phrases in English and of endorsements in four other languages. A reworded endorsement can still pass, and so can one with a single look-alike letter from another script.
- On live answers the same gate flags sentences that endorse nothing: 5 in the rebuild's 20 sessions (such as "Both worked." in a list of what was ruled out).
- A pick written inside the diagnosis's own cause would be copied into the frozen return.
- The live round is one model, one diagnosis input, 8 requests run twice; over-refusal was tested on 2 plain questions; the frozen line is English whatever the request's language.
- Q1 to Q6 were shaped on a prototype checker before this history begins (`questions.md` says how); Q7 and Q8 were written before their live round, on requests sealed first. The first five commits were made afterwards from finished work: git shows the order, not the times. Commit 6 holds what changed after the last review round (`results.md`, "Changed after review").

`results.md` has all of it question by question, what tied or got worse, what was left alone and why,
what we would change next, and how it was tested.

## For judges

### Commands

```
node control/run.mjs                        # the acceptance check, 20 to 50 s: ends RESULT: pass (exit 0)
node rebuild/tests/verify.mjs               # the audit, ~1 s: RED, 15 failures, by design
node rebuild/tests/verify.mjs --selftest    # ~2 s: SELFTEST: GREEN (every planted-bad fixture fails its gate)
node control/attacks.mjs                    # ~8 min: replays the reviewers' 42 attacks on temp copies; each must end as expected (--quick: under a minute)
node control/readers.mjs                    # <1 s: the blind readers' counts per arm
node control/run.mjs --heldout run-rebuild/heldout/heldout.txt                        # ~10 s: the held-out score on gate version 1: 11 of 20 endorsing caught, 0 of 20 clean flagged
node control/run.mjs --heldout run-rebuild/heldout/heldout.txt --gate rebuild/tests   # ~10 s: the same set on the shipped checker, after opening, not held-out evidence: 16 of 20
node control/run.mjs --live                 # ~1 s: three earlier Fable sessions of the original skill: original 0 findings, rebuild 48
node control/corpus.mjs                     # ~1 s: the word-list gate over both arms' own prose: only line 92 (on live answers it does flag some, see above)
bash control/record-live.sh rebuild F01     # needs the Claude Code CLI and its usage: records one new live session
git diff --no-index --stat original rebuild # needs git: every file the rebuild changed
```

`control/run.mjs` ends in one of five words: **pass** (exit 0); **plant detected** (2: an arm shows a
failure its committed transcript does not have); **baseline defect** (3: a promised finding did not
reproduce); **integrity violation** (4: anything pinned, sealed or claimed is off: `original/`, the letter,
`questions.md`, a transcript, a live session, the sealed requests, a reader file, an evidence file, a headline sentence
named in `control/claims.json`, or the rebuilt skill the live sessions ran on); **harness error** (5).
When more than one applies, the first of those four failures in that order is printed, with every flag
listed above it.

Node 18 or later, standard library only, no network, no API key; it runs from any folder, in a path with
spaces, and from a zip with no git. GitHub Actions runs the acceptance check on Node 18, 20, 22 and 24 on
every push (`.github/workflows/check.yml`).

### Layout (the brief's, plus `README.md`, `CLAUDE.md`, `control/` and `.github/`)

| Path | Job |
|---|---|
| `feedback.md` | The judges' letter, byte for byte |
| `CLAUDE.md` | Routes an AI agent to the right file; holds nothing of its own |
| `original/` | The judged entry, pinned, read only |
| `questions.md` | Eight questions with expected answers, unchanged since commit 2 |
| `run-original/`, `run-rebuild/` | Each question's exact command, change and full output per arm; `live/`: the 20 sealed live sessions per arm with exact prompts; `run-original/live-round-3/`: three earlier sessions; `run-rebuild/live-readers/`: the blind readers' files; `run-rebuild/heldout/`: the sealed sentences, scores and the frozen checker they were scored on |
| `rebuild/` | The rebuilt entry: `rules.md` (three changes), `tests/` (the checker and its fixtures), two short notes; everything else as the original |
| `results.md` | Question by question; what tied or got worse; what was left alone and why; what we would change next; how it was tested; the evidence |
| `control/` | The harness, the expected results and checked claims, the sealed requests and their writer's brief, the held-out plan and seal, and the lab record |

### Provenance

- `original/` is commit `01abab3229da2a22f84a82be071425ce66fac5ee` of
  https://github.com/jdvanleenen-sys/skill-diagnostician, tree `95d9615caafa8f3d2ec00e8167d9b7e6c495d4cd`;
  `run.mjs` checks it with git or, without git, by rebuilding that tree id from `control/original-tree.txt`.
- `feedback.md` is `package/letters/jeff-van-leenen.md` from the judges' `feedback-package.zip`, SHA-256
  `cb689060112d5349bc03d98bf074ffadc33fe638ac427861dce3b88feae77c0e`; `run.mjs` recomputes it.
- The checker the sealed sentences were scored on is version 1 of `rebuild/tests/`, SHA-256
  `c0b4648028bf568cfb65ca812ddb803f1df0847eb4c9e930d12e66cc8582c7dd`, shipped byte for byte as
  `run-rebuild/heldout/gate-v1/tests/`. The shipped `rebuild/tests/` is SHA-256
  `1299668a4c252e46c6fb1ddb4ecf0c624e8a7fd686906c23a89407d93ee0f444`. `run.mjs` recomputes both.
- The live requests, `control/live-requests.md`, SHA-256
  `7c01ac70fe74d196fd7ad68067f2d818b99fb13674ad81fb2a70b7b4b86705ed`, sealed 2026-10-25 at 13:56 MT, were
  written by Sonnet 5.5 from `control/live-requests-writer.md`; by the entrant's record they were hashed
  before anyone on his side read them. The rebuilt `rules.md` still hashes to what the lab recorded before
  any session ran; `run.mjs` checks it.
- **`questions.md` has not changed since commit 2** (`git log -- questions.md`). SHA-256
  `a75c4a971038958fb46f3b45e1843d01d28636a61c42f6565f37410c8f8682d9`, the hash recorded in the entrant's
  lab before any live-path session ran; `run.mjs` checks it against that hash, held in code. Three of its
  lines predate the final framing: it still counts six questions in its second paragraph; it files Q7 and
  Q8 under a "live path" heading and calls them the prospective test, though most of what Q8 counts is
  in turn 1, the message the lab tuned on (`results.md`, Q8); and it says the held-out plan was committed
  before the set was opened, where it was written before and committed with everything else.
- The held-out sentences were sealed on 2026-10-24 at 08:55 MT and opened at 21:09 MT. The commits
  came after both; git cannot prove either sealing came first, so that rests on the entrant's record.
- `feedback.md` is kept byte for byte, so its links to the two letters it points at (Jodi Paige-Lee's and
  Marcelo Michelsohn's) lead to files in the judges' package, not in this repo.

### Method

Built on Interpretable Context Methodology: folders as architecture, one file one job. Method by Van
Clief and McDermott, arXiv:2603.16021, MIT-licensed. Both arms keep the original's MIT licence
(`original/LICENSE`, `rebuild/LICENSE`).
