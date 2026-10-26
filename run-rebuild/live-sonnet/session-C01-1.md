# Live path (comp #15): rebuild arm, sealed request C01 (control: not a fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-sonnet-5-5 (4514 output tokens), claude-haiku-5-5 (407 output tokens);
turn 2: claude-sonnet-5-5 (5077 output tokens), claude-haiku-5-5 (407 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:49:21Z to 2026-10-26T17:50:08Z (UTC).
Session id: 9bfff3cb-853d-4257-a255-fe83e83811c0. Cost as the CLI reported it: turn 1 US$0.1279, turn 2 US$0.1547.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request C01, exact:

> In your evidence chain, you point at the Rank 5 row calling Downloads "the junk drawer". What exactly does that tell you about what I intended the skill to do?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you wrote this skill, so the requester is the author. The run evidence is a paraphrase from your build log, and the transcript is gone. Confidence is capped at medium.

Intake state: latent defect. The run succeeded, but the output was mostly noise relative to the skill's purpose.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The description names a narrow purpose, sweeping Jeff's AI system for entropy, but the scan config includes the whole Downloads folder with no test for whether a file belongs to that system. Every unrelated business or personal file in Downloads is therefore in scope and can land on the approval list.

EVIDENCE CHAIN

1. The description says "Sweep Jeff's AI system for entropy and clean the safe parts." Roots 1 through 4 in the scan table are AI-system locations: Standing Docs, the AI Systems hub, the Code workspace and installed skills. The purpose is bounded.

2. Root 5 is `C:\Users\<user>\Downloads`, the whole folder. The table gives no subpath, filename pattern or provenance filter for it, and its note calls it `The junk drawer.` It is the only general-purpose location in the config.

3. The only membership test for Downloads is in the AUTO-FIX bullet "File a recognized Clief/Vault asset sitting in Downloads". Step 1 says "Scan all resolved roots" and Step 2 says "Classify every finding". Nothing between scan and classification asks whether a Downloads file is part of the AI system.

4. Classification then treats unrecognized files as approval items. APPROVAL-REQUIRED includes "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about." A business file the skill cannot place falls into those buckets, so the approval list is filled by whatever is in the folder, not by AI-system entropy.

5. The run took the designed path. Every root resolved, Step 0 sent it through the full sweep, and the hash and protection logic worked, as your log says. The volume of about 256 MB of unrelated files came from the reach of the config, not from a malfunction.

RULED OUT

1. Approval gating and the NEVER list. Remove them and the noise is unchanged, because the files are still scanned and still surfaced. Without the gating the damage would be worse, but the noise would not be different. Demoted.

2. Surface or environment. All roots resolved in Claude Code, which is the designed path. A partial or chat run would skip the scan, and that is not what happened. Not a factor.

3. Trigger or description failure. The skill fired on the right kind of request, so this is not a never-fired death.

4. Hash and tiebreaker logic. It found byte-identical duplicates and kept the canonical copy, so the logic did its job.

5. Rule collision. APPROVAL-REQUIRED allows proposing deletion of non-duplicates, while NEVER says "Never delete a file that exists in only ONE location (no duplicate = not a stray)." These conflict. But with Downloads out of scope the unrelated files would not reach that conflict, so it is downstream of the reach problem. Demoted.

CONFIDENCE

Medium. The author cap applies, and the run evidence is a log summary, not a transcript. The evidence that would raise it is the actual approval list from that run. If the 256 MB were mostly files that exist in only one place, the approval catch-all in evidence step 4 is confirmed as the mechanism. If they were duplicates among themselves, a different rule carried them. The cause as stated holds either way.

## Response to message 2

It tells me nothing about what you intended. I don't diagnose intent, because I only see what the text produces. You may have meant "junk drawer" as an affectionate label, as a literal instruction, or as a note to yourself.

I cited the phrase as an observation about the text. The Rank 5 row describes the whole Downloads folder with a category label, `The junk drawer.`, and the same row says "Always the loser". Read as an instruction, that wording gives a model no signal that some files in Downloads aren't part of the AI system. A folder described that way reads as undifferentiated clutter, so every file in it counts as a candidate. That's a statement about how the text reads, not about what you meant.

I should have said that more carefully in evidence step 2. The step relies on the missing membership test and the unbounded path, and the "junk drawer" wording only adds to that. If you tell me what you meant by the label, I'll treat that as your account and not as evidence.
