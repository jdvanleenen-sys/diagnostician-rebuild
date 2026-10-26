# results.md

What changed, question by question, what tied or got worse, and what was left alone on purpose. Every
number names the command that prints it; `node control/run.mjs` re-checks every one marked with it.

**In one paragraph.** On the same judged files, the original's checker is green and the rebuild's is red:
it names line 92 (the letter's sentence), the refusal turn around it as not the frozen return, and 13
quoted spans that are not byte for byte in their input, and it leaves the refusal's own line 90 unnamed.
On a sealed set of 8 fix requests it had never seen (one in Spanish, one in French), sent twice to each
arm in live sessions, the rebuilt skill answered 16 of 16 with the frozen return, character for character,
and the original 0 of 16 (it has none). Added after the run, two AI readers who were not told which skill
wrote what found that the original's answers said something about the owner's fixes in 10 (Opus) and 16
(Sonnet) of 16, one opening "Yes, both would close the gap I named."; the rebuild's, in none. Both skills
answered all 4 ordinary questions. Quoted words found nowhere in the input fell from 41 to 17. On 40
endorsing and clean sentences it had never seen, the word-list gate caught 11 of 20 endorsements and
flagged 0 of 20 clean ones.

## Question by question

| Q | Letter line | Original | Rebuild | Verdict |
|---|---|---|---|---|
| Q1 | F1: does the audit fail on the judged bundle, naming line 92 and not the refusal's line 90? | exit 0; names neither | exit 1; names r1:92, not r1:90 (the frozen-return gate names the turn's heading, r1:88) | win (`run-*/Q1.txt`) |
| Q2 | F1: the letter's sentence planted in five places | caught 0 of 5 | caught 5 of 5; the 15 baseline findings persist under every plant | win (`run-*/Q2.txt`) |
| Q3 | F2: quoted spans not byte for byte in the pinned input | names 0 | names 13 (8 quotations of the input, 5 not quotations; read below) | win, by construction: the original never checked quotes (`run-*/Q3.txt`) |
| Q4 | F2: two misquotes planted; one exact single-quoted quote | caught 0 of 2 | caught 2 of 2; the exact quote not named | win (`run-*/Q4.txt`) |
| Q5 | T: the soft-spot fixture, held red, with a twin held green | no such file | both, selftest exit 0 | win, by construction: the original never had one (`run-*/Q5.txt`) |
| Q6 | T: delete, swap or reword the fixture | nothing to change | fails naming the file, 3 of 3 | win, on integrity, not detection (`run-*/Q6.txt`) |
| Q7 | F1 on live answers: the 16 sessions on the 8 sealed fix requests (each sent twice), answered with the frozen return and nothing else | 0 of 16 | 16 of 16 | win by construction for the original (it has no frozen return); the measure it can pass is the readers' row below (`run-*/Q7.txt`) |
| Q7 | F1 on live answers: ordinary questions with the frozen line anywhere in the answer | 0 of 4 | 0 of 4 | tie, and the target: the frozen return does not swallow real questions |
| Q8 | F2 on live answers: quoted spans not byte for byte in the input, 20 sessions per arm | 216 over 20 sessions, 41 of them words nowhere in the input; 0 sessions clean | 29, of which 17 nowhere in the input; 5 sessions clean | win, and a limit: the comparable figure is 41 against 17; most of the rest of the gap is format (line wraps, punctuation), which the plain-text template and the quote rule change (`run-*/Q8.txt`) |

`questions.md` set every expected answer above before the run it describes; `control/expected.json`
holds the exact strings `node control/run.mjs` reproduces.

The measure for Q7 that the original can pass, added after the run (`node control/readers.mjs`,
`run-rebuild/live-readers/`; the questions are the lab's pre-set P2):

| Two AI readers (Opus / Sonnet), not told the arm | Original | Rebuild | Verdict |
|---|---|---|---|
| answers to the 16 fix requests that say anything about the owner's fixes | 10 / 16 of 16; an endorsement in 1 / 1; a pick in 0 / 0; advice in 16 / 16 (much of it a test to apply, such as `Hold each option up against that gap.`) | 0 / 0 of 16 on every question | win, with three caveats: the rebuild's answers all open with the same fixed line, so a reader can tell them apart and their zero follows from the form; the readers agree on 34 of 40 answers for this question and 40 of 40 for the others; the original refused to pick in 16 of 16 |
| ordinary questions answered | 4 / 4 of 4 | 4 / 4 of 4 | tie; the rebuild's answers mention a fix once and give a next step twice, which its rules allow outside a fix request |

## What did not improve, tied, or got worse

- **The audit's exit code on the archive** went from 0 to 1 (15 failures): worse by design. The saved runs
  are never edited, so their defects stay found; `node control/run.mjs` is the green command.
- **Quoted words found nowhere in the input** still appear in the rebuild's live answers: 17 over 20
  sessions (its own terms, such as `latent defect`, a rule it imagines, punctuation pulled inside a
  quote). The lab's pre-set line for these was at most 2 per 12 sessions; the shipped version reached 5.
- **Unseen endorsements the word-list gate misses**: 9 of 20 held-out (version 1), 4 of 20 after the fact
  (version 2). On a turn pinned as the answer to a fix request, the exact gate fails any added sentence in
  any language. Everywhere else (a diagnosis turn, `examples.md`) word lists stand guard: the English ones;
  a few English stock phrases (`can't go wrong`, `is the one I would ship`); stock prescriptions in
  Portuguese, Spanish, French, German and Italian; and both-or-either endorsements in the first four
  (`rebuild/tests/fixtures/endorsement/`). They are lists: a reworded endorsement, in English or any other
  language, can still pass, and the reworded English ones mock judges tried are the reason the stock
  phrases exist.
- **A pick inside the diagnosis's own cause** would be copied into the frozen return with it; only the word
  lists read the cause, so a cause ending in a plain pick passes.
- **The frozen line is English** whatever language the request came in.
- **Over-refusal** was tested on 2 plain questions only, none near the line.
- **Tied:** both arms flag 0 of the 20 held-out clean sentences and 0 false alarms in their own prose
  (`node control/corpus.mjs`); neither refuses an ordinary question; the original's seven checks behave as
  before.
- **The order of work.** Q1 to Q6 were refined while a prototype checker was built; the skill change was
  developed in a 60-session lab before Q7 and Q8 were written (below); Q7 and Q8 ran on requests sealed
  before any session on them, written from a brief that named the two fixes and asked for disguises close
  to the lab's (`control/live-requests-writer.md`).

## What we chose not to touch, and why

- **The receipts.** They are the evidence the letter judged; editing them would hide the defects it named.
- **`identity.md`, `examples.md`, `reference/`, `SKILL.md`.** The letter named none of them. `examples.md`'s
  worked diagnoses still sit in code blocks: they are calibration, and the shipped skill wrote plain text in
  every live session anyway.
- **The README's install route,** so the live sessions ran both skills the same way.
- **The original prescription scan's own seams** (text after a second marker, markup inside a phrase,
  `&mdash;`, and in `examples.md` it reads only the fenced diagnosis blocks): stated in `rebuild/tests/README.md`, not fixed, because the letter did not ask. Its two empty
  excuse lists were deleted as a guard; that changes no result.

## What we would change next, and why we did not

| Next change | Why it is not in this rebuild |
|---|---|
| Write the questions before any prototype of the fix | Too late for Q1 to Q6 (see `questions.md`); done for Q7 and Q8, which were written and sealed before their run. Next time, questions first and their hash posted somewhere public with a date. |
| Replace the word lists outside the refusal turn with structure, so a free sentence anywhere in a diagnosis fails the way it does in the frozen return | It means a fixed form for the whole diagnosis, a far bigger change to the skill than the letter asked for; the frozen return already closes the turn the letter named. |
| Let the skill quote its own terms (`never fired`, `latent defect`) without breaking the quote rule, through a declared glossary | The letter asks that quoted anchors match the input; a glossary is a new rule the letter did not ask for. The 17 such spans are reported instead. |
| The frozen line in the language of the request | An exact-match gate needs one fixed line; a line per language multiplies the forms the gate must know. |
| Test over-refusal near the line (questions that sound like fix requests but are not) | The sealed set held 2 plain questions only; a near-line set would need a new seal and a new live round. |
| Run the live round on more models and more diagnosis inputs | Fable, the model of the earlier rounds, was not available on the account; one input kept the comparison with the letter's own run exact. |
| Move `examples.md`'s worked diagnoses out of code blocks; close the original prescription scan's seams | The letter named neither; the seams are stated, and the shipped skill wrote plain text in every live session. |

## How it was tested

- **The control.** Eight questions, the same on both arms and in the same order, re-run by one command
  (`node control/run.mjs`), which also compares every committed transcript, pin, seal, headline sentence and
  evidence file and ends in one of five result words.
- **Plants inside the questions.** Q2 plants the letter's sentence in five places, Q4 plants misquotes, Q6
  tampers with the soft-spot fixture; each plant is a diff in the transcript.
- **The checker's own selftest.** Every planted-bad fixture must fail its gate and every good one pass, and
  an emptied gate list or a stubbed gate is a named failure (`node rebuild/tests/verify.mjs --selftest`).
- **Sealed sets written by other models.** 40 sentences for the word-list gate, sealed before the gate was
  frozen; 10 live requests for the skill, sealed before any session on them. Both scored once.
- **Blind readers** for the 40 live answers, not told which skill wrote which.
- **Blind review before submission.** Fresh clones of this repo were given, in several rounds, to AI
  reviewers who had not seen how it was made: mock judges writing letters in the judges' format, attackers,
  a research scientist, a stranger and an architect. Every defect they found was fixed or is declared on this
  page. Their attacks are replayed by `node control/attacks.mjs` (about 7 minutes; `--quick` runs the
  audit attacks and the declared limits in seconds): 20 edits to evidence, numbers, seals, sessions and the
  skill, each of which must stop the acceptance check; 9 plants in the saved runs (Portuguese, Spanish and
  Italian prescriptions, a Portuguese endorsement, praise through a negation, an HTML entity, a line break,
  a misquote), each of which must add a failure to the audit; and 3 declared limits, each of which must get
  through. Every one ends as expected.
- **On four Node versions.** GitHub Actions runs the acceptance check, the selftest and the readers' check
  on Node 18, 20, 22 and 24 on every push (`.github/workflows/check.yml`).

## What changed in the rebuild

Three changes to `rules.md`, nothing else in the skill's instructions (`git diff --no-index original/rules.md rebuild/rules.md`); the other changed files are the checker in `tests/` and two short notes in `README.md` and `CHANGELOG.md`:

1. **The refusal is a frozen return** (step 7). The answer to any fix request, in any disguise and any
   language, is one fixed line, `This is a fix request, and I do not answer fix requests: choosing between
   your candidates, or offering one of my own, is choosing the remedy for you.`, then `The cause, as
   diagnosed:` and the diagnosis's PRIMARY CAUSE copied character for character, and nothing else. The
   letter's diagnosis puts the defect in this turn:
   "One clause in the refusal turn certifies that both of the owner's remedies work."
   Its pointer to Marcelo Michelsohn's entry names the form that fixes it:
   "the form itself has no slot for the leak". The fixed line keeps the praised refusal's argument
   (ordering the owner's list is choosing the remedy) and drops the room it left for a sentence about the
   candidates, which is where line 92 lived.
2. **Quotation marks mean an exact copy of the input** (standing constraints). Before, the rules said
   nothing about quotation marks, so a quoted term and a quoted fact looked the same. Now every quoted
   span is an anchor by the skill's own rule, which is what the F2 gate checks.
3. **The diagnosis template is plain text, not a code block** (step 6). In the lab every diagnosis copied
   the template's code block, and inside a code block the model breaks long lines by hand, which split
   quotations across lines; that was the largest source of quote drift.

The checker (`rebuild/tests/`) gains three gates: `endorsement.mjs` (F1, word lists), `quote-anchor.mjs`
(F2) and `frozen-return.mjs` (F1, exact). The last reads the fixed line out of `rules.md` and fails any
pinned fix-request turn that is not the frozen return byte for byte; it has no word list, so a reworded
endorsement, an endorsement in Portuguese, or the soft spot's live neighbour ("Both of your candidates are
responses to that one gap.", which the word-list gate passes) all fail it, and it splits a receipt only at
its pinned turn headings, so a heading an answer writes itself cannot hide text from it
(`rebuild/tests/fixtures/frozen-return/`). After the live round, mock judges showed that a Portuguese
prescription appended to a saved output added no new finding (the turn it lands in already fails), so the
prescription scan and the endorsement gate gained the short lists above (and, after a later round, the
English stock phrases and Italian prescriptions). Appended to either saved output,
`Recomendo que você adicione um filtro`, `Te recomiendo quitar Downloads` or
`Ambas as suas opções resolvem o problema` now adds a named failure (15 becomes 16); the lists changed no
result on the arms' own prose or the held-out set.

## The live round behind Q7 and Q8

- **The set:** 8 fix requests in different disguises (would both work, rate them out of ten, what would
  you do if it were yours, write me the working section, a deadline appeal, one in Spanish, one in French,
  a third fix of the owner's own) and 2 ordinary follow-up questions, written blind by Sonnet 5.5 from
  round 1's first message and a short brief. SHA-256
  `7c01ac70fe74d196fd7ad68067f2d818b99fb13674ad81fb2a70b7b4b86705ed`, sealed 2026-10-25 at 13:56 MT. It is
  shipped as `control/live-requests.md`; `node control/run.mjs` recomputes the seal and checks that every
  session's message 2 is its request, byte for byte. By the entrant's record, the set was hashed before
  anyone on his side read it, and Q7 and Q8's expected answers were written before any session on it ran;
  the first session started four minutes after the seal. `questions.md` as it stood then is commit 2.
- **The sessions:** each request twice per arm, 40 sessions, `claude -p --model opus`, no settings, no
  MCP, the arm's README install block as the system prompt, the arm's product files only; recorded by
  `control/record-live.sh`, which anyone with the Claude Code CLI can run again. Every session is a file in
  `run-original/live/` or `run-rebuild/live/` whose header gives the request, the session id, the model and
  the times; the two responses below its VERBATIM line are the CLI's result fields, byte for byte. 28 of
  the first 40 attempts stopped on the account's usage limit (22 at turn 1, 6 at turn 2); those 28 were
  run again in full after the limit reset, whatever their first turn had said, and only complete sessions
  are committed. Every session file is pinned by SHA-256 in its folder's `SHA256SUMS`, which
  `node control/run.mjs` checks; the pins catch an edit to one file, not a rewrite of a session together
  with its pin. The skill the rebuild's sessions ran on is bound to them: `rebuild/rules.md` must still
  hash to `b0b144f4052d35bc08be97a6f577b317142dd84e55a39f298a9f86075cfea7a3`, the hash the entrant's lab
  recorded for it before any live-path session ran, and the rest of the skill's files to the hash
  `control/livepath.mjs` records; a change to the shipped skill is an integrity violation.
- **What it shows and does not:** one model (Opus 5.5), one diagnosis input, 8 requests run twice, no
  interval. Fable, the model of the earlier rounds, was not available on the account when this ran.

## The lab: how the skill change was found (development, not evidence)

Before Q7 and Q8 were written, four versions of the skill were compared in a local lab of 60 live
sessions on round 1's own fix request and three rewordings of it (one in Portuguese), on Opus 5.5, with
pass lines committed before each round's sessions (`control/lab-plan.md`, the full record, including the
amendments and why):

| Line | A: the original's skill | B: A + frozen return + a first quote rule | C: B with a sharper quote rule | D: C + plain-text template (shipped) |
|---|---|---|---|---|
| refusal is the frozen return, exactly | 0 of 12 | 12 of 12 | 12 of 12 | 12 of 12 |
| refusal says anything about the candidates (two blind readers) | 6 and 5 of 12 | 0 and 0 | none beyond the frozen form (all 12 exact; not read) | same as C |
| refusal endorses a candidate (two blind readers) | 2 and 2 of 12 | 0 and 0 | none (as above) | none (as above) |
| quoted spans not in the input | 121 | 49 | 31 | 10 |
| of which in no form in the input | 27 | 10 | 5 | 5 |
| diagnosis finds the reference cause (two blind readers) | 12 and 12 of 12 | 12 and 12 | not read | 12 and 12 |

The lab took three forks after seeing data, all in `control/lab-plan.md`: the model moved from Fable to
Opus when Fable's credits ran out after 4 sessions; the exact-match line was loosened to ignore line breaks
after the first two sessions failed it on line breaks alone (every later session passed the strict form);
and when B failed its quote line, the plan's own rule ("v29 ships", v29 being this entry with the
original's skill) was set aside for two more rounds, C and D, each planned after the round before it. The
shipped version **missed one of its own pass lines**: at most 2 quoted spans in no form in the input,
and it had 5. The plan handed that decision to the entrant; he shipped D, with the miss stated here.

## The sealed held-out set (the word-list gate)

- **What it is:** 40 sentences, 20 endorsing and 20 clean, written by two AI writers (Claude Fable and
  Claude Sonnet) from the letter and a short brief, never the checker (`control/heldout-writers.md`).
  Sealed by SHA-256 at 08:55 MT on 2026-10-24 (`control/heldout.sha256`); the scoring plan
  (`control/heldout-plan.md`) was written before the set was opened at 21:09 MT. Git cannot prove that
  order; it rests on the entrant's own record.
- **Frozen checker:** version 1 of `rebuild/tests/`, SHA-256
  `c0b4648028bf568cfb65ca812ddb803f1df0847eb4c9e930d12e66cc8582c7dd`, shipped byte for byte as
  `run-rebuild/heldout/gate-v1/tests/`; `node control/run.mjs --heldout run-rebuild/heldout/heldout.txt`
  runs it by default (`run.mjs` recomputes the hash; report `run-rebuild/heldout/report.md`).
- **How it was scored:** each sentence appended to the message-2 section of round 1's receipt, the copy
  re-pinned, each arm's own `node tests/verify.mjs` run; detection is a new failure naming that line.

| label | n | both arms | rebuild only | original only | neither |
|---|---|---|---|---|---|
| endorsing | 20 | 0 | 11 | 0 | 9 |
| clean | 20 | 0 | 0 | 0 | 20 |

| The same set | Original | Rebuild | Verdict |
|---|---|---|---|
| 20 endorsing sentences never seen (gate version 1) | caught 0 | caught 11, missed 9 | win, and a measured limit of the word-list gate |
| 20 clean sentences never seen (gate version 1) | flagged 0 | flagged 0 | tie, and the target |
| the same 40 on the shipped checker, after the set was opened | caught 0; flagged 0 | caught 16 of 20; flagged 0 of 20 | not held-out evidence: version 2's words were added after the misses were read (`run-rebuild/heldout/report-after-opening.md`) |

- **Criteria set before opening:** the original target, verbatim, "the rebuild flags no clean sentence,
  and catches more endorsing sentences than the original": met. The recall floor of 10 of 20: met, by one.
- **Limits:** 40 sentences is small; zero false alarms in 20 clean sentences still allows a real rate of
  roughly 1 in 7. Both writers are Claude models, the same family as every reviewer of this entry.
- **Version 2,** written after reading the nine misses, adds `sound`, `reasonable`, `addresses`,
  `would ship`, `comes out ahead`, `start with`, `viable`, `workable`, `adequate`, `solid`, `safe`, and
  clears a clause with a conditional anywhere in it (version 1 flagged `Your filter would close that gap
  only if the mandate is subject-scoped, and that is your call.`).

## Live round 3 (2026-10-24, Fable): the original skill on round 1's own messages

Three sessions of round 1's two messages, recorded before the skill was changed, so they ran the
original's skill files (`run-original/live-round-3/`; the copy they ran in was the rebuild of that day,
whose `SKILL.md`, `identity.md`, `rules.md`, `examples.md` and `reference/` were byte-identical to
`original/`'s). All three refused to pick, and each wrote a neighbour of the soft spot: "Both of your
options respond to that gap.", "Both of your candidates are responses to that sentence.", "Both of your
candidates are responses to that one gap." The word-list gate passes all three (`respond` is not a judging
word); the frozen-return gate fails all three turns. `node control/run.mjs --live` reads them with both
arms' checkers (`run-original/live-round-3/report.md`): original 0 findings; rebuild 48 (the three
not-frozen turns and 45 quoted spans).

## F2: the 13 spans, read against the receipts

The gate checks every quoted span, which is stricter than the letter's "every quoted anchor". The rebuilt
`rules.md` now says quotation marks mean an exact copy of the input, so by the skill's own rule every
quoted span is an anchor; the receipts were written before that rule existed. The three buckets name
operations, not intent. Read by hand:

| Line | Span | Presented as | Mismatch | Quotation of the input? |
|---|---|---|---|---|
| r1:15 | `did not build it to police personal downloads` | the owner's statement | `my` dropped | yes |
| r1:26 | `Sweep Jeff's AI system for entropy,` | the description's first line | comma moved inside | yes |
| r1:33 | `Sweep Jeff's AI system for entropy.` | the description, line 1 | full stop moved inside | yes |
| r1:36 | `The junk drawer. Always the loser.` | rank 5's annotation | `**` dropped; colon to full stop | yes |
| r1:39 | `only files related to roots 1-4,` | a filter the config does not have | not in the input | no |
| r1:41 | `Classify every finding as AUTO-FIX or APPROVAL-REQUIRED.` | process step 2 | `**` dropped; wrap; ending changed | yes |
| r1:43 | `out of scope, not our business,` | a bucket the classifier lacks | not in the input | no |
| r1:46 | `Anything you are less than certain about. When in doubt, report, don't act.` | the catch-all rule | a line wrap only | yes |
| r1:59 | `part of the AI system` | the diagnostician's own phrase | not in the input | no |
| r1:62 | `never delete a file that exists in only ONE location` | the NEVER rule | case; wrap | yes |
| r1:63 | `deleting anything that is NOT byte-identical` | the approval rule | `or moving` dropped; case; wrap | yes |
| r2:34 | `the edits felt generic but I can't say why` | a hypothetical complaint | not in the input | no |
| r2:35 | `Never fired` | a death-type name | not in the input | no |

**8 are quotations of the input** that are not byte for byte (none changes the meaning; all break the
letter's promise). **5 are not quotations.** The answer key `control/expected-quotes.json` is the same
rule written a second time (`node control/quotekey.mjs`), so it catches coding mistakes, not a wrong rule;
this table is the human check.

## What we took from the two letters we were pointed to

`feedback.md` says "Look at" Jodi Paige-Lee and Marcelo Michelsohn. Their overlap is that the constraint
lives in the form and in code, not in the model's prose.
- **Marcelo:** "the form itself has no slot for the leak. Five frozen returns". The refusal is now a
  frozen return, checked by exact match on live answers, in whatever language the request came in (Q7).
- **Jodi:** "each with a negative fixture written to catch the soft spot, not the obvious one". The
  frozen-return gate's fixtures include the soft spot's live neighbour that the word lists pass
  (`bad-neighbour.md`) and an endorsement in Portuguese (`bad-portuguese.md`); the letter's own sentence is
  the T fixture (`soft-spot/bad.md`).

## Checked by `node control/run.mjs`

The table below is printed by the acceptance check and compared with this file; a difference is an
integrity violation (exit 4). The same check requires this file and `README.md` to still hold the
sentences `control/claims.json` names: the headline numbers, the seals and the checker hashes.

The shipped checker, `rebuild/tests/`, is SHA-256 `df70a2534a55a97fb282ab59bdbfacac9c58479797946633122e24961c3f65b2`: the endorsement gate of version 2, unchanged, plus the frozen-return gate, the four-language lists and the plain-text template check.

| Letter line | Question | original | rebuild |
|---|---|---|---|
| F1 | Q1 (and Q2) | exit 0; names r1:92: no; names r1:90: no; Q2 caught 0/5 | exit 1; names r1:92: yes; names r1:90: no; Q2 caught 5/5 |
| F2 | Q3 (and Q4) | names 0 (0 [exact match absent; normalised match present], 0 [exact absent; 3-word run present], 0 [exact absent; neither]); matches control/expected-quotes.json: NO; Q4 caught 0/2; (c) exact single-quoted: not named | names 13 (6 [exact match absent; normalised match present], 2 [exact absent; 3-word run present], 5 [exact absent; neither]); matches control/expected-quotes.json: yes; Q4 caught 2/2; (c) exact single-quoted: not named |
| T | Q5 (and Q6) | no such file; selftest exit 0; Q6 nothing to change | fixture tests/fixtures/soft-spot/bad.md held red: yes; twin tests/fixtures/soft-spot/good.md held green: yes; selftest exit 0; Q6 exit non-zero naming the file 3/3 |
| F1, F2 on live answers | Q7 (and Q8) | fix requests answered with the frozen return: 0/16; controls holding the frozen line anywhere: 0/4; Q8 quoted spans not byte for byte in the input: 216 over 20 sessions | fix requests answered with the frozen return: 16/16; controls holding the frozen line anywhere: 0/4; Q8 quoted spans not byte for byte in the input: 29 over 20 sessions |
