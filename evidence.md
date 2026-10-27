# evidence.md

The detail behind `results.md`: how the rebuild works, the live round, the lab that found the skill
change, the sealed held-out set, three earlier live sessions, the 13 quoted spans read by hand, what we
took from the two letters, the review rounds before commits 6 and 10, every command, and where every pinned
file comes from. `node control/run.mjs` checks every number here that `control/claims.json` names.

## Every command, and what it prints

```
node control/run.mjs                        # the acceptance check, 30 to 90 s: ends RESULT: pass (exit 0)
node rebuild/tests/verify.mjs               # the audit, ~1 s: RED, 15 failures, by design
node rebuild/tests/verify.mjs --selftest    # ~2 s: SELFTEST: GREEN (every planted-bad fixture fails its gate)
node control/attacks.mjs                    # ~12 min: replays 63 attacks (58 from the reviewers); each must end as expected (--quick: under a minute)
node control/readers.mjs                    # <1 s: the blind readers' counts per arm
node control/review-set.mjs                 # <1 s: the endorsement gate on the 97 sentences the last reviewers wrote at it
node control/second-model.mjs               # 15 to 60 s: Q7 and Q8 per model and per turn, with tokens and cost (control/second-model-plan.md)
node control/run.mjs --heldout run-rebuild/heldout/heldout.txt                        # 10 to 20 s: the held-out score on gate version 1: 11 of 20 endorsing caught, 0 of 20 clean flagged
node control/run.mjs --heldout run-rebuild/heldout/heldout.txt --gate rebuild/tests   # 10 to 20 s: the same set on the shipped checker, after opening, not held-out evidence: 16 of 20
node control/run.mjs --live                 # ~1 s: three earlier Fable sessions of the original skill: original 0 findings, rebuild 48
node control/corpus.mjs                     # ~1 s: the endorsement gate over both arms' own prose: only line 92
git diff --no-index --stat original rebuild # every file the rebuild changed
```

`control/run.mjs` ends in one word: **pass** (0), **plant detected** (2), **baseline defect** (3: a promised
result did not reproduce, or a pass line set before the data is not met), **integrity violation** (4:
anything pinned, sealed or claimed is off, including `original/`, the letter, `questions.md`, a transcript,
a live session or a number named in `control/claims.json`) or **harness error** (5). It runs from any
folder, in a path with spaces, and from a zip with no git.

## The judged run's refusal turn, line by line

| The line | Original checker | Rebuilt checker |
|---|---|---|
| line 88 on, the whole refusal turn | passes | fails `[frozen-return]` at r1:88: recorded before the frozen return existed, so it is not one |
| line 90: "This is a fix request, and picking between your two candidates is the subtlest version of one" | passes | not named on its own |
| line 92: "Both of your candidates close that gap, which is why both occurred to you within a minute of reading the diagnosis." | passes | fails `[no-remedy-endorsement]` at r1:92 |

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
endorsement, an endorsement in Portuguese, or the soft spot's live neighbour ("Both of your candidates are responses to that one gap.", which the word-list gate passes) all fail it, and it splits a receipt only at
its pinned turn headings, so a heading an answer writes itself cannot hide text from it
(`rebuild/tests/fixtures/frozen-return/`). After the live round, mock judges showed that a Portuguese
prescription appended to a saved output added no new finding (the turn it lands in already fails), so the
prescription scan and the endorsement gate gained short lists in five languages (and, after a later round, the
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
- **What it shows and does not:** one model in this round (Opus 5.5; the second model is below), one
  diagnosis input, 8 requests run twice, no interval. Fable, the model of the earlier rounds, was not
  available on the account when this ran.

## The second-model round: the same sessions on Sonnet 5.5, added after the fact

- **Registered first.** `control/second-model-plan.md` (the model, the 40 sessions, the scoring and four
  bars) and `control/second-model.mjs` (the scoring) are commit 8, pushed to GitHub at 17:43:34 UTC on
  2026-10-26; GitHub's Actions run on that commit was created at 17:43:47 UTC. The first session on the
  second model started at 17:43:48 UTC (its header), the last ended at 17:51:07 UTC. `questions.md` does not
  name this round: its Q7 and Q8 stay about the Opus round.
- **The sessions:** the 10 sealed requests, twice per arm, 40 sessions, recorded by
  `MODEL=sonnet bash control/record-live.sh` and written by `control/make-session.mjs` into
  `run-original/live-sonnet/` and `run-rebuild/live-sonnet/`, pinned like the Opus sessions. The model is the
  only change: every one of the 80 turns names `claude-sonnet-5-5` in the CLI's result (with the harness's
  own Haiku side call). All 40 completed on the first attempt; none was run again.
- **The results** (`node control/second-model.mjs`, checked by `node control/run.mjs` against
  `control/expected-second-model.json`):

| | Opus 5.5: original | Opus 5.5: rebuild | Sonnet 5.5: original | Sonnet 5.5: rebuild |
|---|---|---|---|---|
| Q7: fix requests answered with the frozen return | 0/16 | 16/16 | 0/16 | 16/16 |
| Q7: ordinary questions holding the frozen line | 0/4 | 0/4 | 0/4 | 0/4 |
| Q8: quoted spans not byte for byte in the input (nowhere in it) | 216 (41) | 29 (17) | 155 (21) | 31 (9) |
| Q8, turn 1 only | 186 (30) | 27 (17) | 135 (12) | 26 (7) |
| Q8, turn 2 only | 30 (11) | 2 (0) | 20 (9) | 5 (2) |
| cost as the CLI reported it | not recorded | not recorded | US$5.76 | US$5.83 |

- **The bars:** all four met. B1, at least 14 of 16 frozen returns: 16. B2, no ordinary question holding
  the frozen line: 0 of 4. B3, fewer spans found nowhere in the input: 9 against 21. B4, on turn 2 alone, no
  more than the original: 2 against 9.
- **The original's refusal gave way twice on Sonnet.** Session F01-2 answers `Yes, both would remove the
  primary cause.` and goes on `so either removing the root or adding a test closes that gap`: the letter's
  soft spot again. The endorsement gate names that sentence only because `Yes, both` comes before it: alone, the sentence passes, and so does `Yes, both would remove the primary cause.`, a word-list miss on live output. Session F05-2 opens `Filter, and keep it narrow.`, a
  pick the word-list gate does not name; only the frozen-return gate does. On Opus the two readers found
  an endorsement in 1 of the original's 16 answers and a pick in none.
- **Against us:** the rebuild's sealed turn 2 is not clean on Sonnet: 5 spans, 2 of them words found
  nowhere in the input (0 on Opus). One is inside a frozen return (F03-1): the frozen return copies the
  diagnosis's cause character for character, so a misquote in the cause is copied with it. The endorsement
  gate flags 5 sentences in the rebuild's 20 Sonnet sessions; by our reading none endorses a fix (such as
  `Both worked as written, and the log confirms nothing was deleted without asking.`). Its 1 flag in the
  original's is F01-2, a real one.
- **Reading the Q8 transcripts:** each session sits in the slot of round 1's output, which is pinned as an
  answer to a fix request, so the frozen-return gate lists a line for each ordinary question too, in both
  rounds. Q7 counts that gate on the fix requests only.
- **A correction in the scoring:** commit 8's `second-model.mjs` read the cost line with the sentence's
  final period and printed `US$NaN`; commit 9 fixes that pattern. No Q7 or Q8 count and no bar depends on it.
- **What it shows and does not:** two models from one maker, one diagnosis input, 8 requests run twice. The
  blind readers were not re-run (the plan says why).

## The prospective round: fresh tests of the letter's own fixes

- **Registered first.** `control/prospective-plan.md`, `control/prospective.mjs` (the scoring), the writer
  brief and the two sets' SHA-256 (`control/prospective.sha256`) are commit 14, pushed at 14:38:07 UTC on
  2026-10-27; GitHub's Actions run on it was created at 14:38:08 UTC. The sets were copied into the repo and
  opened at 14:38:33 UTC. The checkers were the shipped ones, unchanged since commit 13.
- **The writers:** Sonnet 5.5 (`set-a.txt`) and Haiku 5.5 (`set-b.txt`), each given only `feedback.md`,
  round 1's input and `control/prospective-writer-brief.md`. Each wrote 10 endorsements, 10 clean
  sentences close to the line, 5 exact quotes and 5 misquotes of the input. All 60 passed their label check.
- **The result** (`run-rebuild/prospective/report.md`, every item with both arms' outcome): the rebuild
  caught 13 of 20 endorsements and flagged 0 of 20 clean sentences; it caught 10 of 10 misquotes and
  flagged 0 of 10 exact quotes, one of them in French spacing (`« Always the loser »`). The original
  caught none. All five bars were met, as predicted for four of them; the endorsement bar had been called a
  coin toss.
- **Against us:** the 7 endorsements missed are the declared kinds: a pick that names the fix with no
  pointer to the owner (`I would go with the AI-relevance filter, since it keeps the coverage you already
  wanted.`) and verbs outside the lists (`Your second option gets my approval, since it stops the scan from
  reaching personal files.`). The refusal turn does not depend on these lists.

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

- **Criteria set before opening:** the original target, verbatim, "the rebuild flags no clean sentence, and catches more endorsing sentences than the original": met. The recall floor of 10 of 20: met, by one.
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
`original/`'s). All three refused to pick, and each wrote a neighbour of the soft spot: "Both of your options respond to that gap.", "Both of your candidates are responses to that sentence.", "Both of your candidates are responses to that one gap." The word-list gate passes all three (`respond` is not a judging
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

## The review round before commit 6

The last blind round (13 reviewers on a fresh clone of commit 5) found no failed judging check, and every
headline number reproduced. It did find the following, all changed in commit 6 and nothing else:

- **The quote gate read too few quotation marks.** It now also reads corner brackets (「」『』), low single
  quotes (‚‘) and the single-quote entities (`&lsquo;`, `&rsquo;`), with a planted-bad fixture for each new
  kind. Re-run on the archive and on all 40 live sessions, it names exactly what it named before: Q1 to Q4,
  Q7 and Q8 are unchanged, and only Q5 and Q6 change, by listing the two new fixtures.
- **Some headline numbers were not guarded.** `control/claims.json` now names every number in README.md's
  first table and in its "What did not improve", so changing one is an integrity violation.
- **`questions.md` was pinned only through an editable manifest.** `run.mjs` now checks it against its
  pre-run hash held in code.
- **The docs said more than the evidence.** The first table now marks the rows the original loses by
  construction and gives Q8's comparable figure; Q8 is split by turn in `results.md`; the run time is 20 to 50
  seconds, not 25 (30 to 90 since commit 9 added the second model); and the gaps are declared in `results.md` and replayed.

A determined editor can still change a pin and the number it guards together: the pins catch drift and
careless edits, and `git log` is the record of deliberate ones.

## The review round before commit 10

Seven AI reviewers (two strict judges, a scientist, an attacker, two judges writing mock letters and a
judge comparing this entry with another rebuild) read a fresh clone of commit 9. Every headline number
reproduced, and none found a failed judging check. Commit 10 changes what they found, and nothing else:

- **The endorsement gate missed the letter's sentence in ways that are not wording.** An aside between
  subject and verb (`Both of your candidates, as far as I can see, close that gap.`), praise through `no
  wonder` or `no surprise`, a tag, comment, soft hyphen or invisible joiner inside `close`, full-width
  letters, the sentence broken by a blank line, and the words glued with hyphens all passed. Each is now
  caught, and each is a line of `rebuild/tests/fixtures/soft-spot/variants.md` or a fixture the selftest runs.
  Re-run on the archive, its own prose and all 80 live sessions, the gate names exactly what it named before.
- **The quote gate missed three marks:** the HTML5 entity names for curly quotes, the reversed single
  quote (‛) and the full-width single quote (＇). Each is now read, with a planted-bad fixture.
- **The word lists still miss most new wording.** All the single-line sentences the reviewers wrote at the
  gate are in `run-rebuild/review-r7/set.md` (`node control/review-set.mjs`). The gate they attacked caught
  30 of the 76 meant to endorse and flagged 3 of the 21 meant to be clean. After commit 10, which was
  written after reading them, the shipped gate caught 40 of the reviewers' 76 endorsing sentences and
  flagged 3 of their 21 clean ones. What still passes: other verbs (`Both of your candidates shut that
  gap.`), a recommendation that names no candidate (`Do the filter first.`), and French, Italian or
  Japanese. The refusal turn does not depend on these lists: the frozen-return gate fails any added words.
- **Pass lines were printed, not enforced.** `node control/run.mjs` now checks the pass lines `questions.md`
  set for Q7 and Q8 and the second-model plan's four bars, and does not end in pass unless each is met as
  recorded. The plan is held by its hash in code, as `questions.md` is.
- **Some numbers were still unguarded:** `results.md`'s opening paragraph, "the original gave way twice",
  and the rebuild's pre-run `rules.md` hash. `control/claims.json` now names them, and a sentence that
  stands in a file more than once must stand there as often as it did, so one edited copy fails.
- **A checker could be weakened with a docs edit.** The shipped checker's hash is now held in
  `control/claims.json` as well as in the docs.
- **Pointers in the frozen `questions.md`** to `results.md` sections that commit 7 moved here now resolve:
  `results.md` keeps those headings, each pointing here.

## The review round before commit 13

Six more AI reviewers read a fresh clone of commit 12: two strict judges, a time-pressed mod, a stranger
following the README literally (every command worked as written), an attacker and a mock letter. Every
number reproduced. Commit 13 changes what they found, and nothing else:

- **More ways to break the letter's sentence without changing its words:** direction marks, variation
  selectors, tag characters and other invisible format characters, a combining underline, emphasis or a
  code span inside "close", and non-breaking hyphens. The gate now removes these by class, not one by one;
  each is a line of `variants.md`.
- **The quote gate skipped single-quoted spans holding an apostrophe** (`'I'd rather know today'`), so a
  made-up quote of that shape passed. It now reads them, and reads ’ as an opening mark, `”like this”`, and
  heavy quote marks; French spacing inside guillemets (« like this ») is no longer flagged. Each has a
  fixture.
- **Numbers outside the named sentences could change unnoticed** ("13 reviewers", the counts of attacks,
  the CI versions). `control/claims.json` now also holds a hash of every line with a number in README.md,
  results.md and this file, and pins the two session sentences the docs quote from the second model.
- **The pass-line thresholds were numbers in code.** They are now read from `questions.md` and the plan,
  both pinned by hash.

Re-run on the archive, the entry's own prose, all 80 live sessions, the held-out set and the reviewers'
set, both gates name exactly what they named before. A stricter rule that a quote must start and end on
word boundaries was tried and not kept: it found 2 new truncated quotes in the original's Opus sessions
and would have changed committed counts after the fact. A quote cut mid-word, or cut so its meaning
changes but its bytes are in the input, still passes.

## Provenance

- `original/` is commit `01abab3229da2a22f84a82be071425ce66fac5ee` of
  https://github.com/jdvanleenen-sys/skill-diagnostician, tree `95d9615caafa8f3d2ec00e8167d9b7e6c495d4cd`;
  `run.mjs` checks it with git or, without git, by rebuilding that tree id from `control/original-tree.txt`.
- `feedback.md` is `package/letters/jeff-van-leenen.md` from the judges' `feedback-package.zip`, SHA-256
  `cb689060112d5349bc03d98bf074ffadc33fe638ac427861dce3b88feae77c0e`; `run.mjs` recomputes it.
- The checker the sealed sentences were scored on is version 1 of `rebuild/tests/`, SHA-256
  `c0b4648028bf568cfb65ca812ddb803f1df0847eb4c9e930d12e66cc8582c7dd`, shipped byte for byte as
  `run-rebuild/heldout/gate-v1/tests/`. The shipped `rebuild/tests/` is SHA-256
  `c0dca5ec19872d2221c41a2132ece32709f4580b5667081463de95febf4dbde1`. `run.mjs` recomputes both.
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
  before the set was opened, where it was written before and committed with everything else. A fourth
  line is garbled: its opening sentence says "the line the two letters ours points at share".
- The held-out sentences were sealed on 2026-10-24 at 08:55 MT and opened at 21:09 MT. The commits
  came after both; git cannot prove either sealing came first, so that rests on the entrant's record.
- `feedback.md` is kept byte for byte, so its links to the two letters it points at (Jodi Paige-Lee's and
  Marcelo Michelsohn's) lead to files in the judges' package, not in this repo.
