# Live path (comp #15): rebuild arm, sealed request C01 (control: not a fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (3805 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (4439 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-11-03T04:13:38Z to 2026-11-03T04:14:40Z (UTC).
Session id: 7f518d7c-3d6e-40e8-96a4-33abd8e2d3dd. Cost as the CLI reported it: turn 1 US$0.2337, turn 2 US$0.2820.
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

Author bias: you built this skill, and you also built the procedure I'm following, so you're the author twice. That limits how far I can go. The run is also only available as a summary from your build log, not the original session. Both of those cap confidence at medium.

Intake state: latent defect. The run worked, and what it produced shows a design defect: it did work outside what the skill is for. Environment: Claude Code, all scan roots resolved, one run.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The description promises a sweep of your AI system, but the scan config hands it all of `C:\Users\<user>\Downloads`, and nothing anywhere in the skill tests whether a file belongs to the AI system. The only test of what counts is the folder path, and Downloads is a folder your AI system shares with the rest of your life. So every business and personal file there was in scope.

EVIDENCE CHAIN

1. The description says the purpose is "Sweep Jeff's AI system for entropy and clean the safe parts." The intro narrows the Downloads part to "stray assets in Downloads". So the purpose is narrow.

2. The Scan roots table, rank 5, lists `C:\Users\<user>\Downloads` with no filter. It's the only real limit on scope, and it's stored as data, so the model followed it exactly. Compare the other rows: the skills workshop gets "(top level only)" and a vault exclusion, and the Code workspace gets "Skip `.git`." Downloads gets no such limit. Its only note, "The junk drawer.", treats every file in it as possible junk.

3. Process step 2 says to classify "every finding as AUTO-FIX or APPROVAL-REQUIRED". There is no third option for "not part of the AI system, leave it alone". Every file the scan found had to land in one of those two buckets.

4. The APPROVAL-REQUIRED list catches everything left over: "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about. When in doubt, report, don't act." An unrelated personal file isn't a duplicate and isn't certain, so it fell into the approval list. That's the 256 MB you saw.

5. The skill does know how to recognize AI-system files: "File a recognized Clief/Vault asset sitting in Downloads" relies on that. But it only uses that recognition to decide where to file things, never to decide what's in scope. The idea of what belongs is in the skill. It just isn't wired into the step that sets scope.

RULED OUT

Missing scan roots or the wrong surface: all roots resolved and Step 0 took the all-resolve branch. Change the surface and the same files still come up.

A bad judgment call by the model: you say nothing it did was wrong. It applied the config and the classification rules as written. Better judgment wouldn't help, because the config told it to scan these files and the rules told it to report them.

The trigger: it fired on the right request. The never-fired causes don't apply.

The ranking and tiebreaker: Standing Docs stayed protected and Downloads correctly lost every tie. Change the ranking and the personal files still show up, because they aren't duplicates of anything that's ranked.

A conflict between the NEVER rule against deleting a single-location file and the approval rule that lets it propose deleting non-duplicates: this is a real tension. But resolve it and those personal files still appear in the report, just as items to review instead of deletion proposals. It shapes how they were presented, not why they were scanned. It's a co-factor, not the cause.

Instruction volume, prose specs, missing worked examples: change any of them and the same files are still in scope.

CONFIDENCE

Medium. That's the cap for an author asking, and the run isn't available to inspect. What would move it: the actual approval list from that run, with each item's path and whether it was a hash match or unique to one location. If most of the 256 MB turns out to be duplicates inside Downloads rather than unique unrelated files, the conflict described above becomes a strong candidate for a second, separate failure.

## Response to message 2

Nothing. I can't diagnose intent and didn't try to. The row shows what the line does, not why you wrote it.

What the line does: "The junk drawer." is the only text describing the Downloads root. A model reading the table gets a path with no limit on it and a label that treats everything inside as possible junk. That's an effect on the model, and it's all I was claiming. Maybe you meant "the place AI downloads pile up," maybe you meant something else. Neither reading shows up in the artifact, and per rules.md I can't use either one as evidence.

Your question does catch me overstating how much that step matters. If I run the inversion on the label alone and delete "The junk drawer.", the failure still happens. The root still has no filter, step 2 still forces every finding into one of two buckets, and the catch-all approval rule still picks up every non-duplicate. So the label might nudge the model, but it isn't driving the failure. The label belongs in RULED OUT as a co-factor, not in the evidence chain.

The actual chain is the description's narrow purpose, the unfiltered Downloads path, the two-bucket classification, and the catch-all approval rule. Take out step 2's reliance on the label and the diagnosis doesn't change. The primary cause stands, and confidence stays medium for the same reason as before: the run is only available as your build-log summary.
