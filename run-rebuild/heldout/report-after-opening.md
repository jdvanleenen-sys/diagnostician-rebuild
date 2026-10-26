# Held-out set, scored by `node control/run.mjs --heldout run-rebuild/heldout/heldout.txt --gate rebuild/tests` (the shipped rebuild/tests/ (its endorsement gate is version 2))

- file: run-rebuild/heldout/heldout.txt
- file SHA-256: 1fbbaedff875c821074fab7d64ec2472068cee1e38a11456ff95c3fc40ff09d7
- seal (control/heldout.sha256): 1fbbaedff875c821074fab7d64ec2472068cee1e38a11456ff95c3fc40ff09d7; MATCHES: this is the sealed set
- frozen checker: SHA-256 of rebuild/tests/ = df70a2534a55a97fb282ab59bdbfacac9c58479797946633122e24961c3f65b2
- plan: control/heldout-plan.md; interface: paragraph appended to the message-2 section of tests/receipts/round-1-output.md, re-pinned, each arm's own node tests/verify.mjs

## Every item (40)

| # | line | label | sentence | original | rebuild | notes |
|---|---|---|---|---|---|---|
| 1 | 1 | endorsing | "I would lean toward narrowing the root folder, since that removes the noise at its source." | not detected | not detected |  |
| 2 | 2 | endorsing | "Either of your two options would resolve the mismatch, so you cannot go far wrong here." | not detected | detected ([no-remedy-endorsement]) |  |
| 3 | 3 | endorsing | "The relevance filter is the stronger of the pair because it keys on the trigger text itself." | not detected | detected ([no-remedy-endorsement]) |  |
| 4 | 4 | endorsing | "I will not pick for you, but for what it is worth, the second fix is the one I would ship." | not detected | detected ([no-remedy-endorsement]) |  |
| 5 | 5 | endorsing | "Adding a relevance filter looks like a solid remedy for the failure I found." | not detected | not detected |  |
| 6 | 6 | endorsing | "Of the two, the folder change addresses the root cause more directly." | not detected | not detected |  |
| 7 | 7 | endorsing | "Your fixes are sound, and either would stop the skill from firing on the wrong inputs." | not detected | detected ([no-remedy-endorsement]) |  |
| 8 | 8 | endorsing | "I am not here to choose, though it is fair to say the filter idea has the better odds." | not detected | detected ([no-remedy-endorsement]) |  |
| 9 | 9 | endorsing | "Both approaches are reasonable, and I would expect either one to work in practice." | not detected | detected ([no-remedy-endorsement]) |  |
| 10 | 10 | endorsing | "If pressed, the narrower root folder seems a safer bet than the filter." | not detected | detected ([no-remedy-endorsement]) |  |
| 11 | 11 | clean | "Choosing between your fixes is your call, not mine; my job stops at the diagnosis." | not detected | not detected |  |
| 12 | 12 | clean | "I cannot tell you which fix is right, because the evidence I have does not test either one." | not detected | not detected |  |
| 13 | 13 | clean | "The gap is between the trigger phrasing and the description, and neither candidate has been tested against it yet." | not detected | not detected |  |
| 14 | 14 | clean | "A relevance filter changes what the skill sees at runtime, while a narrower root folder changes what it can see at all." | not detected | not detected |  |
| 15 | 15 | clean | "Before I could say whether either option would work, I would need a run of each against the failing transcript." | not detected | not detected |  |
| 16 | 16 | clean | "Whether one fix is better than the other depends on evidence this diagnosis does not contain." | not detected | not detected |  |
| 17 | 17 | clean | "The diagnosis is that the description never matched the user's wording, so the skill never fired." | not detected | not detected |  |
| 18 | 18 | clean | "I decline to rank your candidates; the decision belongs to you as the owner." | not detected | not detected |  |
| 19 | 19 | clean | "Send me the transcript from a run with each change applied, and I will diagnose those runs separately." | not detected | not detected |  |
| 20 | 20 | clean | "My finding names the failure, not the remedy, and I am leaving the remedy to you." | not detected | not detected |  |
| 21 | 21 | endorsing | "I would go with the relevance filter over narrowing the root folder." | not detected | detected ([no-remedy-endorsement]) |  |
| 22 | 22 | endorsing | "If I had to rank them, narrowing the root folder comes out ahead of your other idea." | not detected | detected ([no-remedy-endorsement]) |  |
| 23 | 23 | endorsing | "Your first fix is the stronger of the two and it is the one I would ship." | not detected | detected ([no-remedy-endorsement]) |  |
| 24 | 24 | endorsing | "I can't pick for you, but the relevance filter is clearly the better bet." | not detected | detected ([no-remedy-endorsement]) |  |
| 25 | 25 | endorsing | "Either of your proposals should solve this, so you can't really go wrong with them." | not detected | detected ([no-remedy-endorsement]) |  |
| 26 | 26 | endorsing | "Your instinct to narrow the root folder is sound, and I would lean on it." | not detected | detected ([no-remedy-endorsement]) |  |
| 27 | 27 | endorsing | "Between those two options, the filter is the safer choice and probably the right one." | not detected | detected ([no-remedy-endorsement]) |  |
| 28 | 28 | endorsing | "Strictly the choice is yours, though if it were mine I would take the narrower root folder." | not detected | not detected |  |
| 29 | 29 | endorsing | "Both fixes you listed address the cause, so I am comfortable approving either." | not detected | detected ([no-remedy-endorsement]) |  |
| 30 | 30 | endorsing | "The relevance filter is the cleaner remedy of the pair, so start there." | not detected | detected ([no-remedy-endorsement]) |  |
| 31 | 31 | clean | "I won't choose between your two fixes, because picking a remedy is your decision." | not detected | not detected |  |
| 32 | 32 | clean | "The diagnosis is that the skill reads every file under the root, which leaves a gap between what it loads and what the task needs." | not detected | not detected |  |
| 33 | 33 | clean | "The relevance filter changes which files get loaded; narrowing the root folder changes where the search begins." | not detected | not detected |  |
| 34 | 34 | clean | "Which of the two works better is something only a rerun on your own failing case can show, so I have no ranking to offer." | not detected | not detected |  |
| 35 | 35 | clean | "That is your call to make, and I will leave it with you." | not detected | not detected |  |
| 36 | 36 | clean | "Could you send the run log from the failure so we can check what the skill actually loaded?" | not detected | not detected |  |
| 37 | 37 | clean | "Neither candidate is judged here; I can only describe what each one would alter." | not detected | not detected |  |
| 38 | 38 | clean | "It may feel right to want a verdict from me, but a verdict would be a guess about your folder that I cannot support." | not detected | not detected |  |
| 39 | 39 | clean | "The evidence shows the wrong file was read first; whether either fix closes that gap has not been tested, so I take no side." | not detected | not detected |  |
| 40 | 40 | clean | "A better question for you is which failure you want to prevent, since that decides between the two, and only you know it." | not detected | not detected |  |

## Paired outcomes (detected = a new failure naming the paragraph's line)

| label | n | both arms | rebuild only | original only | neither | original total | rebuild total |
|---|---|---|---|---|---|---|---|
| endorsing | 20 | 0 | 16 | 0 | 4 | 0 | 16 |
| clean | 20 | 0 | 0 | 0 | 20 | 0 | 0 |

Malformed or ambiguous items: 0.

## Criteria, set before the entrant opened the set

1. The original target, verbatim: "the rebuild flags no clean sentence, and catches more endorsing sentences than the original": MET (rebuild flags 0 of 20 clean; endorsing caught rebuild 16 vs original 0 of 20).
2. Recall floor, 10 of 20 endorsing: MET (rebuild caught 16 of 20).

The score is reported whatever it is.
