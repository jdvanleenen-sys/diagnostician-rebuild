# Live path (comp #15): rebuild arm, sealed request F08 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (26 output tokens), claude-sonnet-5-5 (4192 output tokens);
turn 2: claude-haiku-5-5 (26 output tokens), claude-sonnet-5-5 (4353 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:48:47Z to 2026-10-26T17:49:27Z (UTC).
Session id: e4d1118b-98db-4538-8641-33fece0f7361. Cost as the CLI reported it: turn 1 US$0.1242, turn 2 US$0.1460.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F08, exact:

> What I'm thinking is a third option: keep Downloads but only let the skill act on files that already have a duplicate elsewhere, and never surface the rest. Is that good? Better than the filter or dropping Downloads?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built this skill, so I'm capping confidence at medium. I'm also not treating your stated intent ("I did not build it to police my personal downloads") as evidence. The only evidence I'm using is what the file's text produces.

Intake state: latent defect. The run succeeded, and the defect is the gap between what it did and what it was for. This was one run from Claude Code with every root resolving. I don't know what else was in context, such as a CLAUDE.md or other skills.

DEATH TYPE: fired wrong (scope mismatch, surfaced as a clean run)

LAYER: substrate

PRIMARY CAUSE

The description scopes the skill to "Sweep Jeff's AI system for entropy and clean the safe parts." The scan config includes the whole of Downloads as a root. Nothing in the file can tell an AI-system file in Downloads from a business or personal one, so the skill treats the folder's contents as its own territory.

EVIDENCE CHAIN

1. The Scan roots table lists the Downloads folder as a root in its entirety, with no subfolder, filename pattern or file-type limit. Its note calls it "The junk drawer." That note frames everything in it as disposable. Every other ranked root is a folder you designed for the AI system.

2. Step 1 says to scan all resolved roots. Step 2 says to classify "every finding" as AUTO-FIX or APPROVAL-REQUIRED. The file never defines what counts as a finding. Only two things count as an in-scope Downloads finding: a SHA-256 match to a higher-ranked copy, and a "recognized Clief/Vault asset." The second has no list or criteria anywhere in the file.

3. A file in Downloads that is neither a hash match nor a recognizable AI asset has no home in the classification. The approval list then picks it up through broad, location-blind bullets: "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about." Both bullets apply to any file in any root. In a Downloads folder full of unrelated documents, "less than certain" is true of almost everything.

4. The result matches your log. Byte-identical duplicates went through AUTO-FIX correctly, and Standing Docs were protected. The roughly 256 MB of unrelated files came through the approval bucket, which is open to any file. The approval gate did its job. The upstream scan set decided what reached it.

RULED OUT

- Weak safety behavior. If I flip it to deleting without asking, the failure gets worse. As written, it asked first and deleted nothing unapproved, so the gate is not the cause.
- The SHA-256 duplicate logic. If I flip it, the unrelated files still arrive in the approval list, because they were never duplicates. Demoted.
- The NEVER rule against deleting a file that exists in only one place. It collides in wording with the approval bullet about deleting anything not byte-identical. But with that rule unchanged, the unrelated files still reach the report. Nothing in your log shows a collision producing a bad outcome. Demoted, not evidenced.
- The undefined "recognized Clief/Vault asset" test. It is a named but unshipped criterion. Nothing in your log shows it firing wrongly. It doesn't explain what you saw.
- The naming-convention checks. The skill scopes them to the Code workspace, so they don't explain Downloads noise.
- A single-sample distortion. A run where Downloads held only AI-system files would have looked clean, so it would not have exposed this. Your run's Downloads mix is what exposed it.

CONFIDENCE

Medium. The cap is author bias plus a log-quoted run with no transcript. The cause is provable from the file: a whole-folder root with no membership test. The one piece of evidence that would move it to high is the dated report that run wrote to the `_hygiene` folder. It would show which rule or bucket each of the 256 MB of items was filed under: the non-identical bullet, the less-than-certain bullet, or a `(1)`, `.bak` or "Copy of" pattern match.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The description scopes the skill to "Sweep Jeff's AI system for entropy and clean the safe parts." The scan config includes the whole of Downloads as a root. Nothing in the file can tell an AI-system file in Downloads from a business or personal one, so the skill treats the folder's contents as its own territory.
