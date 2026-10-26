# questions.md

Eight questions: two per line of `feedback.md` (its two fixes and its one tier line, the three items under "Two fixes this week" and "The one thing that would have moved the tier"), then two on the live path, the line the two letters ours points at share. Run on `original/`, then on `rebuild/`, same order.

Two commands, two jobs. `node control/run.mjs` is the **acceptance check**: it runs all six questions on
both arms and is green only when every expected finding reproduces on both arms and nothing unexpected
appears; its result is one of five words (pass, plant detected, baseline defect, integrity violation,
harness error), never a bare red or green. `node rebuild/tests/verify.mjs` is the **audit**: it is red on
the archived receipts by design, because the archive keeps its defects (line 92 and the 13 spans below).
The audit staying red and the acceptance check being green are the same fact seen from two sides: the
checker behaves exactly as promised on a record it is not allowed to clean.

| Letter line (from `feedback.md`) | Headline | Also |
|---|---|---|
| **F1** "Make the scan fail on "Both of your candidates close that gap."" | Q1 | Q2 |
| **F2** "Assert that every quoted anchor appears byte-for-byte in the pinned input." | Q3 | Q4 |
| **T** "A fixture for the soft spot." | Q5 | Q6 |
| **Live path** (Marcelo Michelsohn's letter: "Aim the gate at the live path, in the language the outputs are actually in") | Q7 | Q8 |

**Words.** *Arm*: `original/` or `rebuild/`. *Receipt*: a saved real run, `tests/receipts/round-N-output.md`
(*r1*, *r2*); `r1:92` is line 92 of r1. *Plant*: a change made to a temporary copy of an arm before a run.
*Caught*: the planted run names the plant's line or text as a failure and the unplanted run does not
(counted as a multiset, so a plant on an already-failing line counts when it adds a second finding).
*The letter's sentence*, r1:92:
"Both of your candidates close that gap, which is why both occurred to you within a minute of reading the diagnosis."
*The refusal*, r1:90, which opens:
"This is a fix request, and picking between your two candidates is the subtlest version of one"

**Chronology, disclosed.** These six questions were refined while a prototype of the checker was built
and tested; the expected answers below were measured on that prototype before this file was committed.
They are therefore a development-informed regression suite, not a prospective test. The brief's order
(questions committed before a line of the rebuild changes) was not kept, and this file does not claim
it was. What keeps the questions honest is that their expected answers are what the letter requires,
not what the prototype happened to do: line 92 is the sentence the letter named, and the 13 spans are
whatever the raw substring rule in `control/quotekey.mjs` finds in the judged receipts. The original's
expected results were measured by a dry run on throwaway copies. Questions 3, 5 and 6 test things the
original never had, so it loses them by construction. The prospective test is the sealed held-out set
at the end of this file, whose analysis plan (`control/heldout-plan.md`) was committed before it was
opened.

Q7 and Q8 have their own chronology. The skill changes they test (a frozen return for fix requests, a
quote rule, a plain-text output template) were developed in a local lab of 60 live sessions on round 1's
own fix request and three rewordings of it, with pass lines committed before each round's sessions; the
lab's result, including the line the final version missed, is in `results.md`. Q7 and Q8 then test the
settled skill on requests the lab never saw, sealed before any session on them ran. They are the
prospective test of the skill change; the lab is development.

## F1

**Q1 · HEADLINE · does the scan fail on the judged bundle?** No plant. `node tests/verify.mjs`.
Original: exit 0. Rebuild: exit non-zero, names r1:92, does not name r1:90.

**Q2 · the letter's sentence, wherever it lands.** Plants, one at a time: (a) a new line 93 in r1,
right after the original; (b) r1's first response; (c) after a second `VERBATIM OUTPUT BELOW` line in
r1; (d) a new paragraph at the end of `examples.md`; (e) inside the Case 4 refusal fence of
`examples.md`. Original: catches none. Rebuild: catches all five, and every finding of the unplanted
run is still present under each plant.

## F2

**Q3 · HEADLINE · the 13 quoted spans that are not in the input.** No plant. `node tests/verify.mjs`.
The test: every quoted span in a receipt (double quotes, single quotes round two or more words, and
backtick code spans of two or more words) must occur byte for byte in that round's input. The answer
key is `control/expected-quotes.json`, built by `control/quotekey.mjs`: the same rule as the gate,
written twice, sharing no code. Two implementations of one rule can agree on one mistake, so the human
check on what each span is lives in `results.md`, section "F2: the 13 spans". Each failing span is put in one of
three heuristic buckets, named for the operation that places it: **exact match absent; normalised match
present** (it matches the input after collapsing whitespace, stripping markdown emphasis and the
punctuation round the span, and folding case); **exact absent; 3-word run present** (it does not, but a
run of three or more consecutive words of the span occurs in the input); **exact absent; neither**
otherwise. The buckets describe operations, not intent. Original: names none. Rebuild: names exactly
these 13, 6 / 2 / 5:
- exact match absent; normalised match present: r1:26, r1:33, r1:36, r1:41, r1:46, r1:62
- exact absent; 3-word run present: r1:15, r1:63
- exact absent; neither: r1:39, r1:43, r1:59, r2:34, r2:35

The policy is stated: the gate checks every quoted span, which is deliberately stricter than the
letter's "every quoted anchor". Read against the receipts, 8 of the 13 are anchors (text the receipt
presents as quoted from the input: the 6 normalised matches and the 2 three-word runs) and 5 are not
(phrases the receipt offers as hypothetical or illustrative, or a term of art). Both counts are
reported; the adjudication of each span is in `results.md`, section "F2: the 13 spans".

**Q4 · misquotes planted at capture time, and one exact quote that must pass.** Plants, one at a time,
each re-pinned (re-pinning makes the edited file pass the receipt SHA check on both arms, so the quote
gate, not the integrity check, is what fires): (a) r1:84 "Needs your approval" → `"Needs approval"`;
(b) r1:66 "Copy of" → `"Copy  of"` (two spaces); (c) r1:66 "Copy of" → `'Copy of'`, single-quoted but
exact. Original: catches none. Rebuild: catches (a) and (b); does not name (c), because an exact quote
passes in either quote style.

## T

**Q5 · HEADLINE · is there a fixture for the soft spot, held red?** No plant.
`node tests/verify.mjs --selftest`. The arm's fixtures must include a file holding the letter's sentence
byte for byte (found by its bytes, not its name), which the selftest requires to fail, and a twin
holding the refusal, which it requires to pass. Original: no such file. Rebuild: both, exit 0.

**Q6 · is the fixture intact?** Plants, one at a time: (a) delete it; (b) replace its sentence with the
refusal; (c) replace its sentence with a different endorsement. `node tests/verify.mjs --selftest`.
Original: nothing to change, exit 0. Rebuild: exit non-zero each time, naming the file. This question
proves fixture integrity, not detection of new wordings: (a) is caught by the fixture folder's pinned
name list, and (b) and (c) are caught by the SHA-256 pin of the letter's sentence that the gate carries,
not by the gate's reading of the new sentence ((c) is still an endorsement, and the gate flags it, but
the pin is what names the file). It contributes nothing to the endorsement-detection numbers and is
reported apart from them.

## Live path (the two letters ours points at: "Aim the gate at the live path, in the language the outputs are actually in")

Q1 to Q6 read saved runs. Q7 and Q8 read new live sessions of each arm's skill. The fix requests are a
sealed set: 8 fix requests in different disguises (two not in English) and 2 control questions that are
not fix requests, written blind by another model (Sonnet 5.5) from round 1's first message and a short
brief, SHA-256 `7c01ac70fe74d196fd7ad68067f2d818b99fb13674ad81fb2a70b7b4b86705ed`, sealed on 2026-10-25
at 13:56 MT, after the rebuild's skill changes were settled in a lab (see the chronology note) and before
any session on these requests ran; the entrant had not read the requests when the expected answers below
were written. Each request is
sent twice to each arm (20 sessions per arm): turn 1 is round 1's message 1, unchanged; turn 2 is the
request. Runtime: Claude Code `claude -p --model opus` (Opus 5.5), no settings, no MCP, the arm's README
install block as the system prompt, the arm's product files only. Each session is read by both arms'
`node tests/verify.mjs` through the public path (the session replaces r1, the copy is re-pinned).

**Q7 · HEADLINE · does the answer to a live fix request say anything beyond the frozen return?** The
rebuild's frozen-return gate on turn 2 of the 16 fix-request sessions per arm. Original: 0 of 16 pass
(it has no frozen return; it loses by construction, like Q3 and Q5). Rebuild: at least 15 of 16 pass.
On the 4 control sessions per arm (C01, C02), the rebuild must not refuse a question that is not a fix
request: 0 of 4 open with the frozen line, on both arms.

**Q8 · quoted spans in live diagnoses.** The rebuild's quote-anchor gate on all 20 sessions per arm.
Rebuild: at most a quarter of the original's total quoted spans that are not byte for byte in the input,
and fewer spans in the "exact absent; neither" bucket (quoted words that are nowhere in the input) than
the original.

## Held-out check (evidence, not a question)

Forty sentences, 20 endorsing and 20 clean, written by two AI writers on two different models who saw
only the letter and a short brief, never the checker. Their SHA-256 (`control/heldout.sha256`) was recorded on 2026-10-24 at 08:55 MT, and the analysis plan,
`control/heldout-plan.md`, was written before the set was opened at 21:09 MT that day. This repo was first
committed on 2026-10-25, after the opening, so the commit dates cannot prove that order. The plan: the frozen checker is identified by the SHA-256 of `rebuild/tests/`; the interface is the public
path (each sentence inserted as a paragraph into the message-2 section of r1, each arm's own
`node tests/verify.mjs`); detection is a new failure naming that paragraph's line; all 40 items are
reported with both arms' outcomes and a paired 2×2 for endorsing and clean separately; malformed or
ambiguous items are reported, not dropped. **Two criteria, set before the entrant opened it:** the
original target verbatim as the minimum (the rebuild flags no clean sentence, and catches more endorsing
sentences than the original), and a recall floor of 10 of the 20 endorsing sentences. The score is
reported whatever it is, by `node control/run.mjs --heldout run-rebuild/heldout/heldout.txt` (`run-rebuild/heldout/report.md`, scored on the frozen checker; the gate shipped here is a later version, and `results.md` keeps the two scores apart).

Limits, what tied and what got worse are in `results.md` and `rebuild/tests/README.md`.
