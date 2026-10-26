# Live path (comp #15): rebuild arm, sealed request F05 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (183 output tokens), claude-opus-5-5 (4728 output tokens);
turn 2: claude-haiku-5-5 (183 output tokens), claude-opus-5-5 (4961 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:23:20Z to 2026-10-26T00:24:15Z (UTC).
Session id: 09b3bc0a-7199-4337-821e-6605df391697.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F05, exact:

> I have a deadline and have to ship this skill today. Filter or drop Downloads, just tell me which and I will do it. No more analysis needed.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** you wrote this skill, and you also wrote the rules I diagnose by. The run itself isn't preserved. All I have is your build log's summary of it. So confidence is capped at medium.

**Intake state:** latent defect. The run succeeded, but its output shows the skill reaching wider than its stated purpose.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The description says the job is to "Sweep Jeff's AI system for entropy and clean the safe parts." But the scan config lists your whole `C:\Users\<user>\Downloads` folder, which holds both AI-system files and unrelated business and personal files. Nowhere does the skill store a test for which Downloads files belong to the AI system. So everything in Downloads counts as in scope, and every file that isn't a duplicate ends up on the approval list.

EVIDENCE CHAIN

1. The description sets a narrow purpose, the AI system. In the same sentence it names a general reach: "Scans Downloads, the OneDrive AI Systems hub, the Code workspace, and installed skills". Downloads is listed as a location, with nothing limiting which files in it count.
2. The Scan roots table confirms it. Rank 5 is the whole `C:\Users\<user>\Downloads` folder with no filter, labelled "The junk drawer". Every other root is a folder that only holds AI-system material. Downloads is the one shared folder, and it is the one root with no boundary.
3. The only place the skill can recognize an AI file in Downloads is one auto-fix line: "File a recognized Clief/Vault asset". Outside that line, nothing in the file defines a stray. The intro talks about "stray assets in Downloads" but gives no way to tell a stray from a file that simply belongs to you.
4. Process step 2 has only two outcomes: classify "every finding as AUTO-FIX or APPROVAL-REQUIRED". There is no third outcome for files that aren't part of the system. A personal file can't be auto-fixed, so it can only go to approval.
5. The approval list then catches everything the skill can't place: "Anything you are less than certain about. When in doubt, report, don't act." and "Deleting or moving anything that is NOT byte-identical to another copy." A personal file is exactly that kind of uncertain item. That is how about 256 MB of unrelated files reached your approval list while every rule was followed. It matches your note that "Nothing it did was wrong".

RULED OUT

1. **The surface or a missing root (Step 0):** every root resolved in Claude Code, and the failure happened with full access. Running from a chat surface would avoid it only by skipping the scan entirely, so this isn't the cause.
2. **A bad call by the model:** the rules sent each personal file to approval exactly as written. A different model following the same rules would produce the same list. This is substrate dressed up as judgment.
3. **The two-outcome classifier (step 4) as a separate cause:** this is a co-factor. Add an "out of scope" outcome while keeping the rest of the file as is, and the model still has no stored test for what is out of scope. It would be guessing, and the noise would move around rather than go away.
4. **A clash between the approval rule on non-identical files and "Never delete a file that exists in only ONE location (no duplicate = not a stray).":** this is real wording tension. But the NEVER rule only blocks deleting without your approval, and proposing the deletion is allowed. Settling the tension still leaves personal files that do have copies in scope.
5. **The tiebreaker ("Always the loser"):** this rule decides which copy survives, not what gets scanned. Flipping it changes nothing about what came up.
6. **The trigger or description wording as a never-fired cause:** it fired when you meant it to, so this death type doesn't apply.

CONFIDENCE

Medium. The cap comes from author bias and the missing transcript. The evidence that would move it is the dated report this run should have written under `_hygiene\`. Its "Needs your approval" list would show whether the personal items came in as single files through the "When in doubt" catch-all, or as near-duplicates. It would also show whether any personal `(1)` copies that were byte-identical got deleted automatically without being listed.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:
The description says the job is to "Sweep Jeff's AI system for entropy and clean the safe parts." But the scan config lists your whole `C:\Users\<user>\Downloads` folder, which holds both AI-system files and unrelated business and personal files. Nowhere does the skill store a test for which Downloads files belong to the AI system. So everything in Downloads counts as in scope, and every file that isn't a duplicate ends up on the approval list.
