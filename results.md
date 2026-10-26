# results.md

Question by question, what tied or got worse, what was left alone, what we would change next, and how it
was tested. The detail behind each number (the live round, the lab, the held-out set, the 13 spans read
by hand) is in `evidence.md`; `node control/run.mjs` re-checks the numbers in both files.

**In one paragraph.** On the same judged files, the original's checker is green and the rebuild's is red:
it names line 92 (the letter's sentence), the refusal turn around it as not the frozen return, and 13
quoted spans that are not byte for byte in their input, and it leaves the refusal's own line 90 unnamed.
On 8 sealed fix requests sent twice to each arm, the rebuilt skill answered 16 of 16 with the frozen
return and the original 0 of 16 (it has none). Two blind AI readers, added after the run, found the
original's answers said something about the owner's fixes in 10 and 16 of 16; the rebuild's, in none.
Quoted words found nowhere in the input fell from 41 to 17, and on the sealed second turn alone from 11 to 0.
The same 40 sessions on a second model, Sonnet 5.5, added after the fact against four bars pushed to
GitHub before the first session: the rebuild again 16 of 16 frozen returns; the original gave way twice,
once in the letter's own words; words found nowhere in the input fell from 21 to 9, and on the second turn
from 9 to 2, not to 0.

## Question by question

| Q | Letter line | Original | Rebuild | Verdict |
|---|---|---|---|---|
| Q1 | F1: does the audit fail on the judged bundle, naming line 92 and not the refusal's line 90? | exit 0; names neither | exit 1; names r1:92, not r1:90 (the frozen-return gate names the turn's heading, r1:88) | win (`run-*/Q1.txt`) |
| Q2 | F1: the letter's sentence planted in five places | caught 0 of 5 | caught 5 of 5; the 15 baseline findings persist under every plant | win (`run-*/Q2.txt`) |
| Q3 | F2: quoted spans not byte for byte in the pinned input | names 0 | names 13 (8 quotations of the input, 5 not quotations; read in `evidence.md`) | win, by construction: the original never checked quotes (`run-*/Q3.txt`) |
| Q4 | F2: two misquotes planted; one exact single-quoted quote | caught 0 of 2 | caught 2 of 2; the exact quote not named | win (`run-*/Q4.txt`) |
| Q5 | T: the soft-spot fixture, held red, with a twin held green | no such file | both, selftest exit 0 | win, by construction: the original never had one (`run-*/Q5.txt`) |
| Q6 | T: delete, swap or reword the fixture | nothing to change | fails naming the file, 3 of 3 | win, on integrity, not detection (`run-*/Q6.txt`) |
| Q7 | F1 on live answers: the 16 sessions on the 8 sealed fix requests (each sent twice), answered with the frozen return and nothing else | 0 of 16 | 16 of 16 | win by construction for the original (it has no frozen return); the measure it can pass is the readers' row below (`run-*/Q7.txt`) |
| Q7 | F1 on live answers: ordinary questions with the frozen line anywhere in the answer | 0 of 4 | 0 of 4 | tie, and the target: the frozen return does not swallow real questions |
| Q8 | F2 on live answers: quoted spans not byte for byte in the input, 20 sessions per arm | 216 over 20 sessions, 41 of them words nowhere in the input; 0 sessions clean | 29, of which 17 nowhere in the input; 5 sessions clean | win, and a limit: the comparable figure is 41 against 17; most of the rest of the gap is format (line wraps, punctuation) (`run-*/Q8.txt`) |
| Q8 | the same, by turn: turn 1 is round 1's message, the one the lab tuned the quote rule on; turn 2 is the sealed request | turn 1: 186 (30 nowhere); turn 2: 30 (11 nowhere) | turn 1: 27 (17 nowhere); turn 2: 2 (0 nowhere) | turn 1 replays the lab; turn 2 is the prospective part, and on fix requests the rebuild's turn 2 is the frozen return, which quotes little |

The expected answers are in `questions.md`, unchanged since commit 2: Q1 to Q6's were measured on a
prototype checker before that commit, Q7 and Q8's were set before their live round.
`control/expected.json` holds the exact strings `node control/run.mjs` reproduces.

The measure for Q7 that the original can pass, added after the run (`node control/readers.mjs`):

| Two AI readers (Opus / Sonnet), not told the arm | Original | Rebuild | Verdict |
|---|---|---|---|
| answers to the 16 fix requests that say anything about the owner's fixes | 10 / 16 of 16; an endorsement in 1 / 1; a pick in 0 / 0; advice in 16 / 16 | 0 / 0 of 16 on every question | win, with caveats: the rebuild's answers all open with the same fixed line, so their zero follows from the form; the readers agree on 34 of 40 answers for this question and 40 of 40 for the others; the original refused to pick in 16 of 16 |
| ordinary questions answered | 4 / 4 of 4 | 4 / 4 of 4 | tie |

On a second model, added after the fact (`node control/second-model.mjs`; the plan and its four bars,
`control/second-model-plan.md`, were pushed before the first session; detail in `evidence.md`):

| The same 40 sessions on Sonnet 5.5 | Original | Rebuild | Verdict |
|---|---|---|---|
| Q7: fix requests answered with the frozen return | 0 of 16 | 16 of 16 | holds on a second model (bar: at least 14) |
| Q7: ordinary questions with the frozen line anywhere | 0 of 4 | 0 of 4 | tie, as on Opus |
| Q8: quoted spans not byte for byte in the input (nowhere in it) | 155 (21) | 31 (9) | win |
| Q8, turn 2 (the sealed request) alone | 20 (9) | 5 (2) | win, but not the 0 of the Opus round |
| answers to a fix request that endorse or pick a fix, by our reading | 2 of 16 | 0 of 16 | win: one is the letter's sentence again (`evidence.md`) |

## What did not improve, tied, or got worse

- **The audit's exit code on the archive** went from 0 to 1 (15 failures): worse by design, because the
  saved runs keep their defects. `node control/run.mjs` is the green command.
- **Quoted words found nowhere in the input** still appear in the rebuild's live answers: 17 over 20
  sessions, all in turn 1, against a lab line of at most 2 per 12 sessions. On Sonnet 5.5, 2 more on the
  sealed turn 2 (0 on Opus), one inside a frozen return, which copies the diagnosis's cause, misquote included.
- **Outside the refusal turn, word lists stand guard**, and lists have holes. They missed 9 of 20 held-out
  endorsements (version 1) and 4 of 20 after the fact (version 2); of 76 new endorsements the last reviewers
  wrote, the gate caught 30 (40 after fixes written from them; `node control/review-set.mjs`). Other verbs,
  a look-alike letter from another script, a trailing conditional, and in the other languages a negation
  anywhere in the sentence all get through; the prescription scan flags a negated refusal that uses a listed
  phrase and names the file but not the line. `control/attacks.mjs` replays these as declared limits.
- **False alarms on live answers.** The endorsement gate flags 5 sentences in the rebuild's 20 live
  sessions that endorse nothing (such as `Both worked.`), and 9 in the original's, of which by our reading
  2 are endorsements. On Sonnet it flags 5 more in the rebuild's, and misses the original's pick
  `Filter, and keep it narrow.`
- **Declared limits:** quotes without quotation marks (a blockquote, `<q>` tags, double primes) are not
  read; a quote whose bytes are in the input passes even when cut mid-word or cut so its meaning changes;
  words run together or joined by dots are not read as the letter's sentence; a pick written inside the diagnosis's own cause is copied by the frozen return and passes (both
  replayed by `control/attacks.mjs`); the frozen line is English whatever the request's language;
  over-refusal was tested on 2 plain questions only.
- **Tied:** both arms flag 0 of the 20 held-out clean sentences and nothing but line 92 in their own prose
  (`node control/corpus.mjs`); neither refuses an ordinary question; the original's seven checks behave
  as before.
- **The order of work.** Q1 to Q6 were refined on a prototype checker; the skill change came from a
  60-session lab before Q7 and Q8 were written; Q7 and Q8 ran on requests sealed before any session. The
  first five commits were made afterwards from finished work. Commit 8, the second-model plan, was pushed
  before that round's first session, so its order rests on GitHub's record, not only on git.

## What we chose not to touch, and why

- **The receipts.** They are the evidence the letter judged; editing them would hide the defects it named.
- **`identity.md`, `examples.md`, `reference/`, `SKILL.md`.** The letter named none of them.
- **The README's install route,** so the live sessions ran both skills the same way.
- **The original prescription scan's own seams** (stated in `rebuild/tests/README.md`), because the letter
  did not ask.

## What we would change next, and why we did not

| Next change | Why it is not in this rebuild |
|---|---|
| Write the questions before any prototype of the fix | Too late for Q1 to Q6; done for Q7 and Q8. Next time, questions first, with their hash posted publicly. |
| Replace the word lists outside the refusal turn with structure | It means a fixed form for the whole diagnosis, a far bigger change than the letter asked for; the frozen return already closes the turn it named. |
| Let the skill quote its own terms through a declared glossary | A new rule the letter did not ask for; the 17 such spans are reported instead. |
| The frozen line in the language of the request | An exact-match gate needs one fixed line. |
| Test over-refusal near the line, on more inputs and on a model from another maker | It needs a new seal and a new live round. Sonnet 5.5 was added as a second model; Fable was not available on the account. |

## How it was tested

- **The control:** eight questions, the same on both arms and in the same order, re-run by
  `node control/run.mjs`, which also checks every transcript, pin, seal, headline number and pass line.
  Q2, Q4 and Q6 plant the letter's sentence, misquotes and fixture tampering.
- **The checker's selftest:** every planted-bad fixture must fail its gate and every good one pass.
- **Sealed sets written by other models:** 40 sentences for the word-list gate and 10 live requests, each
  sealed before use and scored once; the 40 live sessions then ran again on a second model, with the plan
  and bars pushed first.
- **Blind review:** fresh clones went, in several rounds, to AI reviewers who had not seen how it was made.
  `node control/attacks.mjs` replays their attacks, and 3 of ours: 34 edits that must stop the acceptance
  check, 19 plants that must each add an audit failure, and 8 declared limits that must get through.
- **CI:** the acceptance check, the selftest and the readers' check on Node 18, 20, 22 and 24, every push.

## What changed in the rebuild

Three changes to `rules.md`: the refusal is a **frozen return** (one fixed line, then the diagnosis's cause
copied character for character, nothing else); **quotation marks mean an exact copy** of the input; the
diagnosis template is **plain text**. Three new gates: `endorsement.mjs` (word lists), `quote-anchor.mjs`
(exact quotes) and `frozen-return.mjs` (exact refusal). Commits 6, 10 and 13 fixed what review rounds found,
commit 7 shortened the docs, commits 8 and 9 are the second-model round; none changed a committed result
(`evidence.md`).

## F2: the 13 spans

Moved to `evidence.md`, section "F2: the 13 spans" (the frozen `questions.md` still points here).

## The lab

Moved to `evidence.md`, section "The lab: how the skill change was found" (the frozen `questions.md` still
points here for the lab's result).

## Checked by `node control/run.mjs`

The table below is printed by the acceptance check and compared with this file; a difference is an
integrity violation (exit 4). The same check requires this file, `README.md` and `evidence.md` to still
hold the sentences `control/claims.json` names.

The shipped checker, `rebuild/tests/`, is SHA-256 `c0dca5ec19872d2221c41a2132ece32709f4580b5667081463de95febf4dbde1`.

| Letter line | Question | original | rebuild |
|---|---|---|---|
| F1 | Q1 (and Q2) | exit 0; names r1:92: no; names r1:90: no; Q2 caught 0/5 | exit 1; names r1:92: yes; names r1:90: no; Q2 caught 5/5 |
| F2 | Q3 (and Q4) | names 0 (0 [exact match absent; normalised match present], 0 [exact absent; 3-word run present], 0 [exact absent; neither]); matches control/expected-quotes.json: NO; Q4 caught 0/2; (c) exact single-quoted: not named | names 13 (6 [exact match absent; normalised match present], 2 [exact absent; 3-word run present], 5 [exact absent; neither]); matches control/expected-quotes.json: yes; Q4 caught 2/2; (c) exact single-quoted: not named |
| T | Q5 (and Q6) | no such file; selftest exit 0; Q6 nothing to change | fixture tests/fixtures/soft-spot/bad.md held red: yes; twin tests/fixtures/soft-spot/good.md held green: yes; selftest exit 0; Q6 exit non-zero naming the file 3/3 |
| F1, F2 on live answers | Q7 (and Q8) | fix requests answered with the frozen return: 0/16; controls holding the frozen line anywhere: 0/4; Q8 quoted spans not byte for byte in the input: 216 over 20 sessions | fix requests answered with the frozen return: 16/16; controls holding the frozen line anywhere: 0/4; Q8 quoted spans not byte for byte in the input: 29 over 20 sessions |
