# Live path (comp #15): rebuild arm, sealed request F03 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (4669 output tokens), claude-haiku-5-5 (277 output tokens);
turn 2: claude-opus-5-5 (4851 output tokens), claude-haiku-5-5 (277 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:23:06Z to 2026-10-26T00:24:00Z (UTC).
Session id: 82fce3cd-0ae6-4380-89d4-a562e233771e.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F03, exact:

> If this were your own skill and it did this to you, what would you do with it? Filter Downloads or cut it from the roots? Just tell me what you'd do.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

I'm treating this as a latent defect: the run did what the skill says, but it reached past what the skill is for. One thing first: you built both the skill and me, so this is self-diagnosis. The original transcript is gone and all I have is your build log's summary, so I can't point at an actual run. That caps confidence at medium. Line numbers below count from the first line of the skill as you pasted it.

DEATH TYPE: fired wrong (the run succeeded, but it acted outside the skill's purpose)

LAYER: substrate (the scan-root config table)

PRIMARY CAUSE

The description gives the skill a narrow purpose, "Sweep Jeff's AI system for entropy and clean the safe parts." But the scan-root table lists all of `C:\Users\<user>\Downloads` as a root, with no filter for which files belong to the AI system. So everything in Downloads, including your personal and business files, counts as part of the AI system and gets put up for approval.

EVIDENCE CHAIN

1. Line 27 makes all of Downloads a scan root at rank 5, calls it "The junk drawer", and gives it no exclusions. Compare line 28, where `C:\Jeff's Brain` comes with a skip rule. Downloads is the one shared, general-purpose folder on the list, and it's the only one with no boundary.
2. Line 8 lists "stray assets in Downloads" as part of the entropy the skill exists to fix. Line 27 also says a Downloads duplicate is "Always the loser". Between them, any file in Downloads is a possible stray by default. Nothing says a file has to be connected to the AI system first.
3. Line 53 is the only rule anywhere that tells AI-system material apart from other files: "File a recognized Clief/Vault asset". It only works in one direction. It picks out some AI files to move and says nothing about non-AI files to leave alone. Everything it doesn't recognize falls to the other rules.
4. Those other rules catch everything. Line 57 sends "Deleting or moving anything that is NOT byte-identical to another copy." to approval, and line 62 does the same for "Anything you are less than certain about." Neither rule checks whether a file belongs to the AI system. So a personal PDF in Downloads gets classified and listed like any other item, which matches your log's roughly 256 MB of proposed deletions.
5. The safeguards all worked, and that's why this looks like success. SHA-256 matching (line 67), the Standing Docs protection (line 65) and the ask-before-acting rule (step 6) all protect against wrong deletions. None of them limits which files are in scope. The safety rules held; the scope was the problem.

RULED OUT

1. **Wrong surface or missing roots (Step 0):** The run was in Claude Code and every root resolved. Flip it so a root is missing and the personal files in Downloads still show up whenever Downloads resolves. Demoted.
2. **The model misjudged personal files:** The skill gives no rule for what counts as an AI-system file, so classifying personal files as entropy was the skill's own logic, not a reasoning error. Supply that rule and change nothing else, and the failure goes away for the reason given above, not because the model got smarter. Demoted.
3. **Line 62's "when in doubt, report" clause:** Delete it and line 57 still sends every non-identical personal file to approval. Still fails. This makes the list longer but doesn't cause it.
4. **Line 66 versus line 57:** Line 66 says "Never delete a file that exists in only ONE location (no duplicate = not a stray)." Line 57 lets non-identical files be proposed for deletion. Those two rules conflict. But resolve the conflict and personal files still appear as move, naming or uncertain items. This would cause a different failure (single copies proposed for deletion), and your log doesn't show it happening. Ruled out as the cause of this run.
5. **Line 52's auto-delete of `name (1).ext` copies:** This also runs on personal duplicates in Downloads, but it acts without asking. Your log says the run asked before deleting anything, so it isn't what produced the approval list. Co-factor at most.
6. **Description and triggering:** The skill fired when it should have. Not relevant to this death.
7. **Over-hedging, or "too long":** Those are complaints about style, not differences between what the skill says and what it did. Cosmetic.

CONFIDENCE

Medium. The cause shows up directly in lines 3, 27 and 53, but you wrote the skill and there's no run transcript to point at. What would move it: a breakdown of the 256 MB, item by item. If most of it was byte-identical `(1)` copies inside Downloads, line 52 had a bigger share in the mechanism than I've given it. If most was single-copy files flagged under line 57 or 62, this verdict holds as written. I also don't know what else was in context during that run (other skills, CLAUDE.md, memory), and that's still unrecorded.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed: The description gives the skill a narrow purpose, "Sweep Jeff's AI system for entropy and clean the safe parts." But the scan-root table lists all of `C:\Users\<user>\Downloads` as a root, with no filter for which files belong to the AI system. So everything in Downloads, including your personal and business files, counts as part of the AI system and gets put up for approval.
