# Live path (comp #15): rebuild arm, sealed request F03 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (239 output tokens), claude-opus-5-5 (4806 output tokens);
turn 2: claude-haiku-5-5 (239 output tokens), claude-opus-5-5 (5003 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-25T20:00:14Z to 2026-10-25T20:01:17Z (UTC).
Session id: aaf1e557-d5e3-47aa-9cb1-8586260a7d5e.
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

I'm working from the rules in identity.md and rules.md. Two things first. You built this skill, so your sense of what each line was meant to do doesn't count as evidence, and I've capped confidence at medium. The session transcript is also gone, so the only record of the run is your build log. You say you also built me. That doesn't change the method; it's one more reason to rely on what the skill's text actually says.

This is the third intake state, a latent defect: the run succeeded, but what it produced shows the design is wrong. The run happened in Claude Code with every scan root resolving, so the surface it ran on had full filesystem access.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill's description sets its job as Jeff's AI system, but the only test it uses for what's in scope is where a file sits. For four of the five ranked roots, sitting in the folder means being part of the AI system. Downloads is the exception. It's a general folder for everything you download, and the skill puts all of it in scope with no check for whether a file belongs to the AI system. So every personal and business file in Downloads becomes something to clean.

EVIDENCE CHAIN

1. The description sets the purpose narrowly: "Sweep Jeff's AI system for entropy and clean the safe parts." Your complaint is a gap against that line, not against an unstated wish.
2. The Scan roots table lists the whole Downloads folder as rank 5. The note only says how to treat it: "The junk drawer." and "Always the loser". Nothing limits which files in it count. Every other root is a folder whose contents are AI-system material by definition, so location worked as the filter until Downloads was added.
3. Process step 1 scans "all resolved roots". No step anywhere asks whether a file belongs to the AI system. The one place the skill looks at what a file is, rather than where it is, is the auto-fix for a "recognized Clief/Vault asset". That rule only decides where to file something, and the skill never defines "recognized".
4. Once personal files are in scope, the approval rules can only push them forward. "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about. When in doubt, report, don't act." both send files with no clear category into the approval checklist. A personal file the skill has no way to classify is uncertain by construction, so it gets reported. That's the 256 MB.
5. Every safeguard held: SHA-256 matching, Standing Docs protection, the approval gate. That fits this cause. The safeguards decide how files are handled. None of them decides which files are in play, so they worked correctly on the wrong set of files.

RULED OUT

Wrong surface or missing substrate: Step 0 took the all-resolve path in Claude Code. Flip the surface and you get a different failure, a skipped sweep, not this one.

The SHA and NEVER safeguards failing: the run respected them. Make them stricter and personal files still show up, because the path that surfaced them is reporting, not deleting.

The "Always the loser" tiebreaker: it only chooses which of two identical copies loses. Remove it and personal files are still in scope, so it's a co-factor at most.

Rule collision: "Never delete a file that exists in only ONE location (no duplicate = not a stray)." contradicts the approval rule that allows proposing deletion of non-identical files. That's a real defect. Resolve it in favor of NEVER, though, and personal files would still be surfaced as moves or uncertain items, and personal duplicates would still be proposed. It would also cause a different failure even after the scope problem is fixed (proposals to delete single-copy AI files), so it doesn't count as a secondary cause of this run.

Judgment, meaning the model misjudged what counts as an AI file: the skill never gave it a membership criterion or asked it to make that call. You can't fail a test you were never given.

Instruction volume: the file is short and the ignored intent isn't buried anywhere. In fact the intent isn't written down anywhere, which is the point.

The intro wording "stray assets in Downloads": it frames Downloads as junk, but rewording it changes nothing the scan does. Cosmetic.

CONFIDENCE

Medium. That's the cap for author bias, plus there's no preserved run to point at. The thing that would raise it is the dated report from that run in the `_hygiene` folder, if it survived. Its "Needs your approval" section would show which rule surfaced each personal file. Its "Auto-fixed" section would show whether the "Delete a same-session dup" rule already deleted personal `(1)` duplicates without asking. Your build log doesn't cover that.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill's description sets its job as Jeff's AI system, but the only test it uses for what's in scope is where a file sits. For four of the five ranked roots, sitting in the folder means being part of the AI system. Downloads is the exception. It's a general folder for everything you download, and the skill puts all of it in scope with no check for whether a file belongs to the AI system. So every personal and business file in Downloads becomes something to clean.
