# Prospective round on the letter's own lines: the plan, committed before the sets are opened

**Why.** `questions.md` was shaped on a prototype of the checker, so Q1 to Q6 cannot show that the rebuild
was tested ahead of the fix, and the one round whose order GitHub records (the second model, commit 8)
aims at another entrant's letter. This round aims fresh, blind-written items at the letter's own two
fixes, with the plan and the sets' hashes pushed before anyone on our side reads the sets. It is added
after the fact: `questions.md` does not name it.

**The sets.** Two AI writers, Sonnet 5.5 (`set-a.txt`) and Haiku 5.5 (`set-b.txt`), each given only
`feedback.md`, round 1's input (`rebuild/tests/receipts/round-1-input.md`) and the brief in
`control/prospective-writer-brief.md`, word for word (with the output file name filled in). They never
saw the checker, the fixtures or this repo. Each wrote 30 items: 10 that endorse the owner's fixes (E),
10 close to the line that do not (C), 5 exact quotes of the input (X) and 5 misquotes of it (M), each X
and M with its quoted span written out. Their SHA-256 (of the LF bytes) is in `control/prospective.sha256`;
the sets themselves are committed with the results.

**The checkers.** Each arm's shipped `tests/`, unchanged: `rebuild/tests/` is SHA-256
`c0dca5ec19872d2221c41a2132ece32709f4580b5667081463de95febf4dbde1`. No gate changes between this commit
and the results.

**The interface and detection.** The held-out set's, unchanged (`control/heldout-plan.md`, sections 2 and
3; code in `control/heldout.mjs`): each item's sentence is appended as a paragraph to the message-2
section of round 1's receipt, the copy is re-pinned, and each arm's own `node tests/verify.mjs` runs;
detected means a new failure that names that paragraph's line. Scored by `node control/prospective.mjs`,
committed with this plan.

**Labels are checked first.** An X whose span is not in round 1's input, an M whose span is, or a span not
in its own sentence, is reported with the reason and left out of the counts. Nothing else is dropped.

## The bars, fixed now

| Bar | Met when |
|---|---|
| P1 | the rebuild flags at most 2 of the clean sentences (C) |
| P2 | the rebuild catches at least half of the endorsing sentences (E) |
| P3 | the rebuild catches more endorsing sentences than the original |
| P4 | the rebuild flags none of the valid exact quotes (X) |
| P5 | the rebuild catches every valid misquote (M) but at most one |

Our prediction: P1, P3 and P4 are met. P2 is a coin toss: reviewers who wrote endorsements at this gate
got about half through. P5 depends on whether the writers used quotation styles the gate does not read
(it declares a blockquote, `<q>` tags and double primes as unread).

## Rules

- The sets are opened only after this commit is pushed. Every item is reported; the results go into
  `results.md` and `evidence.md` whatever they show, a bar not met under "What did not improve".
- No gate, fixture or word list changes after the sets are opened, in this entry. A change the results
  suggest would be named as next work, not made.
- Once committed, `node control/run.mjs` checks the sets against their seals and the report against what
  the scoring prints.
