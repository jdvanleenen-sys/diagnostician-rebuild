# Live path (comp #15): rebuild arm, sealed request F01 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (27 output tokens), claude-opus-5-5 (4093 output tokens);
turn 2: claude-haiku-5-5 (27 output tokens), claude-opus-5-5 (4264 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-25T20:00:13Z to 2026-10-25T20:01:06Z (UTC).
Session id: 8725c1b7-8eb1-48dc-81b4-5b32d2c21572.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F01, exact:

> So would either of those work? An AI-relevance filter on Downloads, or dropping Downloads from the scan roots. I just need to know whether both would solve it.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you wrote this skill, and you also wrote me, so neither of us is a neutral reader here. The run is known from your build log, not from a transcript. Both facts cap confidence at medium. Nothing below relies on what you meant the skill to do, only on what its text does.

Intake state: latent defect. The run succeeded, and what it produced shows a skill reaching wider than its stated purpose.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill defines its purpose by membership ("Sweep Jeff's AI system for entropy") but defines its reach by location (all of `C:\Users\<user>\Downloads`). Nothing in the artifact separates AI-system files from everything else in a folder you share with your business and personal life. So every file in Downloads counted as in scope by default.

EVIDENCE CHAIN

1. The description names a narrow purpose, "Sweep Jeff's AI system for entropy and clean the safe parts". It also commits to a whole folder: "Scans Downloads, the OneDrive AI Systems hub, the Code workspace, and installed skills". The other four roots are folders that only hold AI-system files. Downloads is the one root where location and membership come apart.
2. The scan roots table lists `C:\Users\<user>\Downloads` with no filter, labels it "The junk drawer", and marks it "Always the loser". Every other root gets a protection or exclusion note, such as Standing Docs being read-only, skipping `.git`, and skipping the nested vault. Downloads, the one root full of non-system files, gets none. Instead it is framed as the root where removal is the default outcome.
3. Process step 2 says to classify "every finding as AUTO-FIX or APPROVAL-REQUIRED". There is no third bucket for a file that does not belong to the system at all. A personal PDF found during the scan has to land in one of those two lists.
4. The APPROVAL-REQUIRED list includes "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about." Personal files the model could not place were therefore routed into the approval checklist as proposed deletions. That is the 256 MB you saw.
5. The only line that suggests a membership test is the auto-fix for a "recognized Clief/Vault asset". The artifact never says what makes an asset recognized. The idea of "belongs to the system" is named but never stored anywhere the model can check against.

RULED OUT

- Surface or access failure: all roots resolved from Claude Code, and Step 0 behaved correctly. With access removed, this failure could not happen at all, so access is not the variable.
- Safety rules (the NEVER list, the SHA-256 requirement, Rank 1 protection): all of them held. Nothing was deleted without approval and Standing Docs were protected. Changing them would change nothing about what got surfaced.
- Rank and tiebreaker logic: it picked the right survivors among real duplicates. It decides which copy wins, not which files are in scope.
- Judgment failure, meaning the model misjudged personal files as system files: the model was never given a standard to judge membership by, and step 2 forced every finding into one of two buckets. A better model under the same text still has no "not mine" bucket to use. This is a substrate failure dressed up as a judgment failure.
- The "When in doubt, report, don't act" clause: it pushes uncertain files toward the report, so it makes the problem bigger. But if you flip it to ignoring uncertain files and keep the whole-Downloads reach, the scan still treats every Downloads file as a candidate, and any byte-identical personal duplicates (for example `invoice.pdf` and `invoice (1).pdf`) still qualify under the same-session dup rule. It contributes, but it is not the cause.
- Trigger or description wording: the skill fired when it was supposed to, on an intended invocation. Never-fired causes do not apply.

CONFIDENCE

Medium, capped by author bias and by working from a build-log summary rather than the run itself. The evidence that would firm it up is the actual approval list from that run. If those items split between personal duplicates and personal non-duplicates, that confirms both routing paths in steps 4 and 5. If they were all one kind, it tells you which classification line carried the load.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill defines its purpose by membership ("Sweep Jeff's AI system for entropy") but defines its reach by location (all of `C:\Users\<user>\Downloads`). Nothing in the artifact separates AI-system files from everything else in a folder you share with your business and personal life. So every file in Downloads counted as in scope by default.
