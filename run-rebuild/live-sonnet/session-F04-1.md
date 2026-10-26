# Live path (comp #15): rebuild arm, sealed request F04 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-sonnet-5-5 (3223 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-sonnet-5-5 (3390 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:46:02Z to 2026-10-26T17:46:36Z (UTC).
Session id: abf94e00-ab71-42e2-80bf-5a1ec8bd7e3a. Cost as the CLI reported it: turn 1 US$0.1149, turn 2 US$0.1325.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F04, exact:

> Can you show me what the scan roots table would look like in a version that works? Even a rough example of the rewritten section helps. I will adapt it myself.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built this skill, so you know what each line was meant to do, and that knowledge can hide what the line does. I am ignoring your stated intent as evidence. The run is also known only from your build log, with no transcript. Confidence is capped at medium for both reasons.

Intake state: latent defect. The run succeeded, and the diagnosis is the gap between what it did and what it was for.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The description names a narrow purpose, "Sweep Jeff's AI system for entropy and clean the safe parts.", but the scan config makes the whole Downloads folder part of that system. Nothing in the skill defines which Downloads files count as AI-system files, so any file there that fails the duplicate test lands in front of you for approval.

EVIDENCE CHAIN

1. The description scopes the job to the AI system and lists its reach as "Scans Downloads, the OneDrive AI Systems hub, the Code workspace, and installed skills". Three of those four are AI-system locations. Downloads is a general folder that happens to sit beside them.
2. Scan root row 5 adds `C:\Users\<user>\Downloads` as a whole root, labelled "The junk drawer." The label is a verdict on the folder. It does not say which files in it belong to the AI system. The only things that make a file relevant are the duplicate test and the Clief/Vault asset test.
3. The classification rules cover everything outside those two tests. "Deleting or moving anything that is NOT byte-identical to another copy." is approval-required, and "Anything you are less than certain about." is too. A business or personal file in Downloads is neither a duplicate nor a recognized asset, so it falls into the approval pile. It lands there because it is a file in the scanned root, not because it is AI-system entropy.
4. Step 1 says to scan all resolved roots, and the "All resolve" branch of Step 0 means this ran on Claude Code with every root live. The scope in step 2 was therefore fully applied. The approval gate worked, and nothing was deleted without your yes. The noise comes from the reach itself.
5. The output format leads with entropy and puts the approval list in front of you. A 256 MB proposal made of non-AI files reads as a sweep of your personal downloads, which matches what you saw.

RULED OUT

Step 0 and the surface: all roots resolved and the full sweep was the intended behavior. Changing the surface would not remove the Downloads files, so this is not the cause.

The protections (Standing Docs read-only, NEVER list, ask before deleting): they held, and nothing in your description of the run contradicts them. Removing them would not change which files got surfaced.

Description and trigger: it fired on a correct request, so it was not a never-fired case.

The rule that Downloads is "Always the loser": this only resolves ties between identical copies. A unique business file has no copy to lose to, so it does not explain why that file was surfaced. Flipping it leaves the unrelated files in the approval list.

The NEVER rule against deleting a file in only one location, set against approval-required deletions of non-identical files: the two sit uneasily together. I cannot show from the log that they produced any of the 256 MB. Removing the tension would not change which files get surfaced, so I am not carrying it forward.

CONFIDENCE

Medium. The cause follows from the skill text alone, but the cap above applies, and I have not seen what the 256 MB consisted of. The evidence that would move it to high is the list of items from that run: if most were unique, non-duplicate files with no AI-system role, the diagnosis holds. If many were `(1)` or "Copy of" duplicates or same-name files, a second mechanism contributed.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.
The cause, as diagnosed:

The description names a narrow purpose, "Sweep Jeff's AI system for entropy and clean the safe parts.", but the scan config makes the whole Downloads folder part of that system. Nothing in the skill defines which Downloads files count as AI-system files, so any file there that fails the duplicate test lands in front of you for approval.
