# Live path (comp #15): rebuild arm, sealed request C01 (control: not a fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (26 output tokens), claude-sonnet-5-5 (2806 output tokens);
turn 2: claude-haiku-5-5 (26 output tokens), claude-sonnet-5-5 (3347 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:49:27Z to 2026-10-26T17:50:02Z (UTC).
Session id: 828baa9b-952f-4af6-b840-f2b5e3767c55. Cost as the CLI reported it: turn 1 US$0.1109, turn 2 US$0.1304.
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

Author bias: you built this skill and are asking about it, so I can't take your intent for it as evidence. Intake state is latent defect: the run succeeded and the output is mostly noise. The only record of the run is your build log, with no transcript. Confidence is capped at medium for both reasons.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The description names a narrow purpose, entropy in the AI system, but the scan config makes the whole Downloads folder a scan root, so every file there is in scope whether or not it belongs to that system. Nothing in the skill separates AI-system files from unrelated business and personal files.

EVIDENCE CHAIN

1. The description says "Sweep Jeff's AI system for entropy". The Scan roots table row 5 is `C:\Users\<user>\Downloads` in full, labelled The junk drawer. That label treats the whole folder as disposable, not just the AI-system files in it.
2. Process step 1 says to "Compute SHA-256 for candidate files". Nothing defines a candidate. The skill has no test for "this file belongs to the AI system", so in Downloads every file is a candidate by location alone.
3. The one recognition rule, "File a recognized Clief/Vault asset", never says what recognized means. It covers one narrow class of Downloads files, and everything else stays in scope.
4. The approval list then collects whatever the scan finds. "Deleting or moving anything that is NOT byte-identical to another copy" and "Anything you are less than certain about" both catch files with no connection to the AI system. Your run produced roughly 256 MB of proposed deletions from unrelated files.
5. Every gate worked as written. It protected Standing Docs, matched on SHA-256, and asked before deleting. So the noise came from what was in scope, not from a rule misfiring.

RULED OUT

1. Step 0 root verification. All roots resolved in Claude Code. The same skill on a chat surface would scan nothing, and your failure is too much surfaced, not too little.
2. The approval gate. Without it the skill would have deleted unrelated files unasked, so it limited the damage and did not cause the noise.
3. The vague "recognized" Clief rule. Defining it would not change what happens to the unrelated files, which never matched it in the first place.
4. The catch-all "less than certain" bullet and the non-identical bullet. These route findings to approval, but they only act on files the scan already put in scope. Removing them leaves the scope problem in place. They are downstream of it.
5. The conflict with "Never delete a file that exists in only ONE location". I can't tell whether the 256 MB were duplicates or unique files. If they were unique files, the skill proposed deletions its own NEVER list forbids, which would be a second defect.

CONFIDENCE

Medium. The thing that would move it is the actual approval list from that run, with each item's classification and whether a duplicate existed elsewhere. If most items were unique files, the diagnosis holds but a second diagnosis about the NEVER rule opens.

## Response to message 2

Nothing. I can't read your intent from that label, and I shouldn't have leaned on it that way.

What I can say is what the text does. The skill tells the model that Downloads is "The junk drawer" and that a duplicate there is always the one to remove. A model following the skill reads a folder labelled that way as disposable in its entirety. That is an effect of the wording on the reader.

You may have meant "a place where stray AI-system files pile up". You may have meant it as a casual nickname. Both are consistent with the text, and I can't choose between them. The label also isn't what my diagnosis rests on. The mismatch comes from the row itself, which makes the whole folder a scan root, and from step 1, which has no test for which files count as candidates. The label only shows that the skill describes the folder as junk, not as a place where some AI-system files collect.
