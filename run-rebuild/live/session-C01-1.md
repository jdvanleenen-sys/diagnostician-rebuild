# Live path (comp #15): rebuild arm, sealed request C01 (control: not a fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (4146 output tokens), claude-haiku-5-5 (242 output tokens);
turn 2: claude-opus-5-5 (4934 output tokens), claude-haiku-5-5 (242 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:21:24Z to 2026-10-26T00:22:23Z (UTC).
Session id: 1b05cd85-5a5a-4c7d-a783-fc2e0eef4835.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request C01, exact:

> In your evidence chain, you point at the Rank 5 row calling Downloads "the junk drawer". What exactly does that tell you about what I intended the skill to do?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built system-hygiene, so you know what each line was meant to do. That is exactly the knowledge that hides what the lines actually do. The only run is a summary in your build log, not a transcript I can look at, so confidence is capped at medium. You also built this diagnostician. That doesn't change the evidence standard; it is one more reason to rely only on the text of the skill.

Intake state: latent defect. The run worked: duplicates found, Standing Docs protected, approval asked before anything was deleted. The problem is the gap between what it did and what it was for.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The description limits the skill's purpose to "Jeff's AI system". But the scan config lists your whole Downloads folder as a root, and the skill has no stored way to tell AI-system files from everything else in there. So every business and personal file in Downloads gets the same treatment as a stray AI asset.

EVIDENCE CHAIN

1. The scope is set only in prose. The description opens "Sweep Jeff's AI system for entropy and clean the safe parts." and the body repeats that the system "spans several locations". Neither defines which files belong to the AI system.

2. The scan set is set as data, and it is broader than that purpose. Rank 5 in the Scan roots table is `C:\Users\<user>\Downloads` with no subfolder, filter, or file pattern. The description says the same thing as fact: "Scans Downloads, the OneDrive AI Systems hub, the Code workspace, and installed skills". Downloads is the one root in the table that isn't an AI-system folder. Your build log describes it as the place where unrelated business and personal files sit.

3. Process step 1 tells the model to scan "all resolved roots" with no condition on membership. In Claude Code every root resolved, so all of Downloads entered the sweep. The data pile (the path) was copied exactly. The prose pile (the AI-system boundary) had nothing in the process to enforce it. This is the data test from the layer ladder: the data survives, the prose doesn't.

4. The only test for membership anywhere in the skill is "File a recognized Clief/Vault asset". It decides where a recognized asset gets filed. It never removes an unrecognized file from the scan. So a personal file in Downloads stays in the sweep.

5. Once those files are in scope, the classification lists can only surface them. "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about. When in doubt, report, don't act." send non-AI files to approval. The Downloads note "The junk drawer." with "Always the loser" frames whatever sits there as disposable. Together that produces roughly 256 MB of personal files proposed for deletion, with every safety rule followed.

RULED OUT

1. Missing surface access (Step 0). Every root resolved and the run went down the full path. If roots had failed to resolve, the full Downloads scan would never have happened. With them resolving, the failure is unchanged. Step 0 did its job.

2. Model judgment error. If the model had judged perfectly against this text, it still surfaces the same files, because the text puts them in scope and tells it to report when in doubt. Nothing was miscalled; the model was never given a boundary to apply. This is a substrate failure in a judgment costume.

3. "Always the loser" and the rank tiebreaker. These decide which copy dies once two copies exist. They don't decide which files enter the scan. Make Downloads neutral in the ranking and the personal files are still scanned and still surfaced. This made things worse but didn't cause them.

4. The "when in doubt, report" catch-all. Flip it and non-AI files that are byte-identical duplicates inside Downloads still qualify under "Delete a same-session dup". That path is listed as AUTO-FIX, not approval. The failure shrinks but doesn't go away. This is a co-factor.

5. Broad trigger phrases such as "clean up my files" and "dedupe". This is about routing, and the skill was invoked on purpose for the job it was built for. Narrowing the triggers leaves the same scan set and the same output.

6. Instruction volume and rule collision. The file is short, and the rules that ran don't contradict each other. They were all followed.

CONFIDENCE

Medium. The cap comes from author bias and from having no run transcript; the cause itself can be read straight from the artifact. One open question would change the picture: the approval list from that run, showing which rule each personal file came in through. If any came in through "Delete a same-session dup", there is a second, more dangerous problem. That rule sits in AUTO-FIX, and on a run where the model doesn't stop to ask first, those personal duplicates would be deleted without approval.

## Response to message 2

It tells me nothing about what you intended, and I didn't use it for that. The rules I work under say I never diagnose intent: I can see what a line causes, not why it was written. Even your own account of what you meant isn't evidence. A builder's intent is the thing most likely to hide what a line actually does.

What the row does tell me is how the model reads it during a run. The note says "The junk drawer." followed by "Always the loser". To a model with no other context, that describes Downloads as low-value. And the skill has no stored rule saying which files in Downloads belong to the AI system. Put together, the line nudges every file there toward being disposable. That is a statement about the effect, not the purpose.

The line fits at least two readings, and the text can't tell them apart:

- Narrow: when a file also exists higher in the hierarchy, the Downloads copy is the one to remove.
- Broad: whatever is in Downloads is junk.

The second half of the note, "a duplicate here is always the one to remove", leans toward the narrow reading. "The junk drawer." sits in front of it with no qualifier. Which reading you meant doesn't change what a model can take from the line.

The row also isn't the cause. In RULED OUT I demoted it to a co-factor: make Downloads neutral in the ranking and the personal files are still scanned, because the scan root is the entire folder. The row made the surfaced files look disposable once they were in the sweep. It didn't put them there.
