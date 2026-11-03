# Live path (comp #15): rebuild arm, sealed request F03 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (3957 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (4156 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-11-03T04:11:05Z to 2026-11-03T04:11:52Z (UTC).
Session id: 512c7ed1-2e7a-4d05-a309-7e792497aac0. Cost as the CLI reported it: turn 1 US$0.2358, turn 2 US$0.2775.
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

Author bias: you built system-hygiene, so your account of what each line was meant to do is not evidence here. The run itself is only available as your build-log summary, not a transcript, so confidence is capped at medium. Building me too changes nothing about the skill.

Intake state: latent defect. The run worked as written, but what it produced shows the skill's reach goes beyond its purpose.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill's purpose is "Sweep Jeff's AI system for entropy and clean the safe parts." But its scan-root table lists all of `C:\Users\<user>\Downloads` with no filter, and that folder is where every download on your machine lands, business and personal. The skill never checks whether a file belongs to the AI system. It only checks file properties like hash, name pattern and location, so every file in Downloads counts as in scope.

EVIDENCE CHAIN

1. The description and the opening section limit the skill to your AI system. They describe its entropy as "duplicate downloads," stray assets and naming drift inside an AI-system hierarchy.
2. The scan-root config is the data that actually sets the skill's reach. Rank 5 is `C:\Users\<user>\Downloads` as a whole folder. Its note calls it "The junk drawer" and says it is always the loser. That treats everything in Downloads as an AI-system stray by default. Your Downloads folder doesn't match that: most of what's in it has nothing to do with the AI system.
3. Process step 2 requires the model to classify "every finding as AUTO-FIX or APPROVAL-REQUIRED". There is no third bucket for files that are outside the system. So once a personal file is scanned, it has to land in one of those two buckets.
4. The APPROVAL-REQUIRED list includes "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about." Together these catch any unrelated file that wasn't auto-fixed. That explains what you saw: about 256 MB of business and personal files proposed for deletion, with the safety gates working correctly. The skill did exactly what its config told it to. The config just points at more than the skill's purpose covers.

RULED OUT

1. Surface or environment (Step 0). Every root resolved in Claude Code. The same config on Desktop would scan the same Downloads folder and produce the same list. Not the cause.
2. Hashing and the rank tiebreaker. The byte-identical matches were real and Standing Docs stayed protected. A different tiebreaker would still surface the same unrelated files. Not the cause.
3. AUTO-FIX being too broad. Nothing unrelated was deleted without asking. Narrowing AUTO-FIX would leave the approval list just as long. Demoted.
4. The catch-all "Anything you are less than certain about." It is how unrelated files reached the list, but it only applies after a file has been scanned. If Downloads were limited to AI-system files, it would have nothing unrelated to catch. Downstream of the primary cause.
5. The two-bucket rule in step 2. Same reasoning: it only causes trouble because out-of-scope files get scanned. Downstream.
6. Judgment. The model followed the rules as written. A better model reading the same config would scan the same folder. Not a judgment failure.
7. Triggering and description wording. It fired when invoked and ran the right process. Wrong death type.
8. Naming conventions. Those checks are limited to the Code workspace and played no part in the Downloads proposals.

CONFIDENCE

Medium. The cap comes from author bias and from having a build-log summary instead of the run's output. The evidence that would move it is the actual approval list from that run, showing which rule put each Downloads item there. If any of the 256 MB were single-copy files proposed for deletion, that would point to a second, separate failure: the NEVER rule that says "Never delete a file that exists in only ONE location" was overridden at the proposal stage. That would need its own diagnosis.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill's purpose is "Sweep Jeff's AI system for entropy and clean the safe parts." But its scan-root table lists all of `C:\Users\<user>\Downloads` with no filter, and that folder is where every download on your machine lands, business and personal. The skill never checks whether a file belongs to the AI system. It only checks file properties like hash, name pattern and location, so every file in Downloads counts as in scope.
