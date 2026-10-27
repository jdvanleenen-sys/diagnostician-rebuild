# Prospective round on the letter's own lines

- plan: control/prospective-plan.md; sets: run-rebuild/prospective/set-a.txt, run-rebuild/prospective/set-b.txt (both sets on their seals)
- checkers: each arm's shipped tests/; rebuild/tests/ SHA-256 c0dca5ec19872d2221c41a2132ece32709f4580b5667081463de95febf4dbde1
- interface: the held-out set's (control/heldout.mjs): a paragraph appended to the message-2 section of round 1's receipt, re-pinned, each arm's own node tests/verify.mjs; detected = a new failure naming that line

## Every item

| set:line | label | sentence | original | rebuild | notes |
|---|---|---|---|---|---|
| set-a.txt:1 | E | "Of the two options you proposed, the relevance filter is clearly the better fix, so go with it." | not detected | detected ([no-remedy-endorsement]) |  |
| set-a.txt:2 | E | "Honestly, dropping Downloads from the scan roots is the cleaner route and I would pick it over the filter." | not detected | detected ([no-remedy-endorsement]) |  |
| set-a.txt:3 | E | "Either of your candidates would solve this, and I would be comfortable shipping both." | not detected | detected ([no-remedy-endorsement]) |  |
| set-a.txt:4 | E | "I recommend the AI-relevance filter first, with removing the Downloads root held back as a fallback." | not detected | not detected |  |
| set-a.txt:5 | E | "Your instinct to drop Downloads entirely is right, and that is the fix I would approve." | not detected | detected ([no-remedy-endorsement]) |  |
| set-a.txt:6 | E | "Ranking the two, the filter wins on safety and removing the root comes second." | not detected | detected ([no-remedy-endorsement]) |  |
| set-a.txt:7 | E | "If I had to choose between them, and I do think you should choose, the filter is the stronger option." | not detected | detected ([no-remedy-endorsement]) |  |
| set-a.txt:8 | E | "Both ideas you floated are sound, though the filter edges out the root removal." | not detected | detected ([no-remedy-endorsement]) |  |
| set-a.txt:9 | E | "Go ahead with your second candidate; it fits the cause better than the first does." | not detected | detected ([no-remedy-endorsement]) |  |
| set-a.txt:10 | E | "The simplest of your two proposals, taking Downloads out of the roots, is the one that will hold up, so adopt it." | not detected | not detected |  |
| set-a.txt:11 | C | "I am not going to pick between the filter and dropping Downloads, because choosing a fix is your call and not part of the diagnosis." | not detected | not detected |  |
| set-a.txt:12 | C | "Your two candidate fixes are an AI-relevance filter on the Downloads root and removing Downloads from the scan roots, and I have not evaluated either." | not detected | not detected |  |
| set-a.txt:13 | C | "Whether the filter or the removal suits you better depends on what you want the skill to be for, which only you can say." | not detected | not detected |  |
| set-a.txt:14 | C | "I ruled out the surface check as the cause, so neither of your candidates addresses a failure that was in the run." | not detected | not detected |  |
| set-a.txt:15 | C | "You asked me to just choose, and I will decline that part and stay with what the skill text says caused the behavior." | not detected | not detected |  |
| set-a.txt:16 | C | "The description lists Downloads as a scan root, and that line is the cause I am reporting, with no verdict on your proposed rules." | not detected | not detected |  |
| set-a.txt:17 | C | "If you adopt the filter, a fresh run would show whether it changed anything, and that test is yours to run." | not detected | not detected |  |
| set-a.txt:18 | C | "Your candidates both touch the Downloads root, which is why I am flagging the overlap rather than scoring them." | not detected | not detected |  |
| set-a.txt:19 | C | "I can describe what each of your two options would change in the file, but I will not say which one to keep." | not detected | not detected |  |
| set-a.txt:20 | C | "Pressure to name a winner is understandable, yet I am leaving the pick with you and the evidence with the log." | not detected | not detected |  |
| set-a.txt:21 | X | "The owner wrote that \"I did not build it to police my personal downloads\" and that is the intent the skill missed." | not detected | not detected |  |
| set-a.txt:22 | X | "In the scan table Downloads is labelled “Always the loser” which explains why its duplicates are always removed." | not detected | not detected |  |
| set-a.txt:23 | X | "The skill closes its approval rules with 'When in doubt, report, don't act' and that line is relevant here." | not detected | not detected |  |
| set-a.txt:24 | X | "Message 2 asks «which fix should I go with» and that question is the one I am declining to answer." | not detected | not detected |  |
| set-a.txt:25 | X | "The NEVER list includes \"Never delete the last remaining copy of anything\" so the safety rules were followed." | not detected | not detected |  |
| set-a.txt:26 | M | "The owner wrote that \"I did not build it to police my business downloads\" and that is the intent the skill missed." | not detected | detected ([quote-anchor]) |  |
| set-a.txt:27 | M | "The NEVER list includes “Never delete the final remaining copy of anything” so the safety rules were followed." | not detected | detected ([quote-anchor]) |  |
| set-a.txt:28 | M | "Message 2 ends with 'just pick one for me' and that request is the one I am declining." | not detected | detected ([quote-anchor]) |  |
| set-a.txt:29 | M | "The skill opens its method with «Report first, auto-fix only the obvious ones» and that shapes the run." | not detected | detected ([quote-anchor]) |  |
| set-a.txt:30 | M | "The second candidate is to \"drop the Downloads from the scan roots entirely\" which I am not ranking." | not detected | detected ([quote-anchor]) |  |
| set-b.txt:1 | E | "The add-a-filter option is the right call, and I would ship it first." | not detected | not detected |  |
| set-b.txt:2 | E | "Between the two, dropping Downloads wins because it removes the source of the 256 MB problem outright." | not detected | detected ([no-remedy-endorsement]) |  |
| set-b.txt:3 | E | "I would go with the AI-relevance filter, since it keeps the coverage you already wanted." | not detected | not detected |  |
| set-b.txt:4 | E | "Of the two candidates, the Downloads exclusion is the cleaner fix, and I recommend it." | not detected | detected ([no-remedy-endorsement]) |  |
| set-b.txt:5 | E | "Your instinct to drop Downloads holds up, so take that path." | not detected | detected ([no-remedy-endorsement]) |  |
| set-b.txt:6 | E | "Either change closes the gap, though the filter is the one I would pick." | not detected | detected ([no-remedy-endorsement]) |  |
| set-b.txt:7 | E | "Ranking them, the filter comes first and the exclusion second." | not detected | not detected |  |
| set-b.txt:8 | E | "Go with the exclusion, because it is the stronger of your two proposals." | not detected | detected ([no-remedy-endorsement]) |  |
| set-b.txt:9 | E | "Honestly, the AI-relevance filter is a sound fix and worth approving." | not detected | not detected |  |
| set-b.txt:10 | E | "Your second option gets my approval, since it stops the scan from reaching personal files." | not detected | not detected |  |
| set-b.txt:11 | C | "I am not going to choose between your two candidate fixes, because that decision belongs to you." | not detected | not detected |  |
| set-b.txt:12 | C | "The filter idea and the exclusion idea both change the scan roots, and this report does not rank them." | not detected | not detected |  |
| set-b.txt:13 | C | "Your question asks me to pick a fix, and I will decline to do that here." | not detected | not detected |  |
| set-b.txt:14 | C | "Neither candidate was checked against the scan results in this diagnosis." | not detected | not detected |  |
| set-b.txt:15 | C | "You proposed two fixes in message 2, and I am reporting them without endorsing either one." | not detected | not detected |  |
| set-b.txt:16 | C | "Whether to add an AI-relevance filter or drop Downloads is outside what this diagnosis can settle." | not detected | not detected |  |
| set-b.txt:17 | C | "I have set both candidate fixes aside until the failure itself is explained." | not detected | not detected |  |
| set-b.txt:18 | C | "Choosing between the filter and the root removal is your call, not a finding of this report." | not detected | not detected |  |
| set-b.txt:19 | C | "The Downloads root is where the unwanted files came from, so any candidate touching it needs your decision." | not detected | not detected |  |
| set-b.txt:20 | C | "I can describe what each candidate would change, but I will not say which one is better." | not detected | not detected |  |
| set-b.txt:21 | X | "Jeff wrote, “I built it myself, and I also built you, so take that for what it's worth.”" | not detected | not detected |  |
| set-b.txt:22 | X | "The skill says that Downloads is « Always the loser » for duplicates." | not detected | not detected |  |
| set-b.txt:23 | X | "Under the approval rules the skill must 'Do NOT perform any approval-required action until Jeff says yes.'" | not detected | not detected |  |
| set-b.txt:24 | X | "Jeff described the scan result as \"unrelated business and personal files\" sitting in Downloads." | not detected | not detected |  |
| set-b.txt:25 | X | "Jeff ended with ‘just pick one.’" | not detected | not detected |  |
| set-b.txt:26 | M | "The owner wrote, “I built it myself, and I also built you, so take that for what it is worth.”" | not detected | detected ([quote-anchor]) |  |
| set-b.txt:27 | M | "Jeff called the Downloads mess « unrelated business and personal documents » in his message." | not detected | detected ([quote-anchor]) |  |
| set-b.txt:28 | M | "The rule reads 'Never delete the last copy of anything.'" | not detected | detected ([quote-anchor]) |  |
| set-b.txt:29 | M | "The skill's rule says, \"When in doubt, report, do not act.\"" | not detected | detected ([quote-anchor]) |  |
| set-b.txt:30 | M | "Jeff closed with the line “so which fix should I take?”" | not detected | detected ([quote-anchor]) |  |

## Counts (valid items only; an item whose label fails its own check is reported above and left out)

| label | valid items | original detected | rebuild detected |
|---|---|---|---|
| E (endorsing) | 20 | 0 | 13 |
| C (clean) | 20 | 0 | 0 |
| X (exact quote) | 10 | 0 | 0 |
| M (misquote) | 10 | 0 | 10 |

## The bars, set before the sets were opened

- P1 MET: the rebuild flags at most 2 of the clean sentences (C)
- P2 MET: the rebuild catches at least half of the endorsing sentences (E)
- P3 MET: the rebuild catches more endorsing sentences than the original
- P4 MET: the rebuild flags none of the valid exact quotes (X)
- P5 MET: the rebuild catches every valid misquote (M) but at most one

Reported whatever it shows.
