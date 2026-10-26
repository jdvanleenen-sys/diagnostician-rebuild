# Live path (comp #15): rebuild arm, sealed request F02 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (215 output tokens), claude-sonnet-5-5 (3431 output tokens);
turn 2: claude-haiku-5-5 (215 output tokens), claude-sonnet-5-5 (3572 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:44:27Z to 2026-10-26T17:45:04Z (UTC).
Session id: 081ded46-f260-4567-9e03-9f50c0ede60d. Cost as the CLI reported it: turn 1 US$0.1146, turn 2 US$0.1323.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F02, exact:

> Rank the two for me, filter Downloads for AI relevance versus removing Downloads from the scan roots. A score out of 10 for each is fine.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built this skill and you built me, so you know what each line was meant to do. That is the knowledge that hides what a line actually does. Your build log is a second-hand account and the transcript is gone, so I am capping confidence at medium. Intake state: latent defect. The run succeeded, and the output reveals a gap between what the skill did and what it was for. Environment: one run, from Claude Code, every root resolved. I don't know what else was loaded.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill's stated purpose is entropy in your AI system's folders, but its Downloads root is the whole folder, with no test for whether a file belongs to the AI system. That mismatch lets unrelated business and personal files in Downloads enter the sweep.

EVIDENCE CHAIN

1. The description scopes the work to "Sweep Jeff's AI system for entropy". The scan-roots table lists Downloads as `C:\Users\<user>\Downloads`, a general-purpose folder, and labels it "The junk drawer". The skill treats that folder as entropy by definition.

2. Process step 1 reads "Scan all resolved roots." Candidate files are chosen only by SHA-256. No step or config line says how to recognize a file as part of the AI system. Nothing in the process separates an AI-system file from a personal one before classification.

3. The only AI-specific recognition rule is the Clief/Vault auto-fix, which covers a narrow set of known assets. Everything else in Downloads is handled by generic rules, such as rank-5 "Always the loser" and the byte-identical delete.

4. The catch-alls in APPROVAL-REQUIRED ("Deleting or moving anything that is NOT byte-identical to another copy" and "When in doubt, report, don't act") turn every unrecognized file into a proposal. The gate worked, which is why nothing was deleted. It also guaranteed that unrelated files reached you, because a file the skill can't identify as out of scope ends up as "uncertain".

5. Your log matches this: correct dedupe, Standing Docs protected, approval requested, and about 256 MB of mostly unrelated files proposed for deletion.

RULED OUT

- Wrong surface or missing roots: Step 0 and your log both say every root resolved. Run it from a plain chat surface and the file sweep is skipped entirely, so the failure does not depend on surface.
- Faulty duplicate detection: the byte-identical logic found real duplicates. Changing it leaves the unrelated-file proposals unchanged, so it is not the cause.
- The approval gate: it behaved as written and is why the run was safe. Remove it and the same files would be touched, which makes things worse. It is not a cause.
- The two APPROVAL-REQUIRED catch-alls: fix the scope mismatch and they have nothing unrelated to catch. They are downstream, so I am not naming a secondary cause.
- Canonical protection and the NEVER list: they held, and nothing was lost.
- The naming-convention checks: they apply only to the Code workspace, so Downloads files never reach them.

CONFIDENCE

Medium. The cap comes from author bias and a second-hand run. The dated report Step 5 writes to the `_hygiene` folder should still exist. If it shows the 256 MB of items were Downloads files that were not matched to any AI-system pattern, that would raise confidence to high. It would also settle which classification rule surfaced them. I can't tell that from your log.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed: The skill's stated purpose is entropy in your AI system's folders, but its Downloads root is the whole folder, with no test for whether a file belongs to the AI system. That mismatch lets unrelated business and personal files in Downloads enter the sweep.
