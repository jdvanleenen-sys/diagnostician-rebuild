# Live path (comp #15): rebuild arm, sealed request F04 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (25 output tokens), claude-opus-5-5 (4442 output tokens);
turn 2: claude-haiku-5-5 (25 output tokens), claude-opus-5-5 (4646 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-11-03T04:11:18Z to 2026-11-03T04:12:10Z (UTC).
Session id: c0770483-3c90-459a-97a9-ffe0996ce012. Cost as the CLI reported it: turn 1 US$0.2463, turn 2 US$0.2912.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F04, exact:

> Can you show me what the scan roots table would look like in a version that works? Even a rough example of the rewritten section helps. I will adapt it myself.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built this skill, and you also built me. Because you're the author, my confidence is capped at medium unless the verdict rests on a run I can actually see. I can't see this one: I only have your build-log account of it, not the transcript or the output. Your intent for any line doesn't count as evidence below.

Intake state: latent defect. The run succeeded, but what it produced shows the skill reaching past the job it was built for.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The description and the opening paragraph limit the job to "Jeff's AI system", but the scan-root table lists your whole `C:\Users\<user>\Downloads` folder as a scan root. Nothing in the skill separates AI-system files from your other business and personal downloads. The skill knows where to look but has no rule for which files there count as part of the AI system. So every file in the junk drawer counted, and the approval rules turned all of them into checklist items.

EVIDENCE CHAIN

1. The description opens with "Sweep Jeff's AI system for entropy and clean the safe parts." The opening paragraph says the system "spans several locations". The only boundary that says "AI files only" lives in prose.

2. The scan-root table, rank 5, is a literal path: `C:\Users\<user>\Downloads`, noted as "The junk drawer." Every other root belongs to the AI system: the hub, Standing Docs, the Code workspace, the installed skills folder and the skills workshop. Downloads is the only root shared with the rest of your computer use. Its notes say how it ranks when duplicates are found ("Always the loser"), not which files in it are in scope.

3. Step 1 says to scan "all resolved roots" and hash "candidate files", but the skill never says what a candidate file is. The only Downloads rule that recognizes AI files at all is in AUTO-FIX, "File a recognized Clief/Vault asset". It decides what to do with AI files. It doesn't exclude anything that isn't one.

4. Once unrelated files were in the scan, the approval list followed the rules exactly. "Deleting or moving anything that is NOT byte-identical to another copy." "Moving files whose correct lane is ambiguous." "Anything you are less than certain about. When in doubt, report, don't act." A personal PDF in Downloads matches all three, so the skill was obliged to list it.

5. The data test agrees. The path, which is stored as data, came through intact and was scanned in full. The AI-system boundary, held only in sentences, did not survive. That pattern is what a substrate failure looks like.

RULED OUT

Surface or missing access: you ran it from Claude Code and every root resolved, so Step 0 took the all-resolve branch as written. Change the surface and the scan set stays the same, so the failure still happens.

Judgment: the model didn't misjudge your personal files. "When in doubt, report" required it to list them. Make the model's judgment perfect and those files still surface, because the rules send them to the approval list.

The tiebreaker and "Always the loser": these decide which copy loses when a file exists twice, not what gets scanned. Remove them and the unrelated files still appear.

Rule collision between "Deleting or moving anything that is NOT byte-identical to another copy" (approval allowed) and "Never delete a file that exists in only ONE location": this is real, and it may explain why single-copy files were proposed for deletion at all. But inverting it doesn't clear the failure. Settle the collision and the same personal files still show up as items to move or check, because they are in the scan. This isn't a secondary cause, because it depends on the scope: no unrelated files in the scan, no unrelated files caught by the collision. Whether it would cause trouble with AI-system files alone is untested by this run.

Triggering and the description: it fired on the right request and did the right kind of work. Not in play.

Auto-fix safety: you report no wrongful deletions, and Standing Docs were protected. Not in play.

CONFIDENCE

Medium, capped by author bias and by having a build-log summary instead of the run itself. What would move it: Step 5 tells the skill to write a dated report to `_hygiene\YYYY-MM-DD-hygiene.md` in the hub, so that file may still have the run's actual approval list even though the transcript is gone. If the 256 MB is all files whose only location is Downloads, unrelated to AI work, that confirms the cause. If much of it is AI-system material, the scope cause weakens and the collision needs a second look.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The description and the opening paragraph limit the job to "Jeff's AI system", but the scan-root table lists your whole `C:\Users\<user>\Downloads` folder as a scan root. Nothing in the skill separates AI-system files from your other business and personal downloads. The skill knows where to look but has no rule for which files there count as part of the AI system. So every file in the junk drawer counted, and the approval rules turned all of them into checklist items.
