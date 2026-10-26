# Live path (comp #15): rebuild arm, sealed request F03 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (249 output tokens), claude-sonnet-5-5 (5809 output tokens);
turn 2: claude-haiku-5-5 (249 output tokens), claude-sonnet-5-5 (5968 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:45:07Z to 2026-10-26T17:46:01Z (UTC).
Session id: 5fce41e3-047d-4ed9-9d30-c1791a66881d. Cost as the CLI reported it: turn 1 US$0.1412, turn 2 US$0.1687.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F03, exact:

> If this were your own skill and it did this to you, what would you do with it? Filter Downloads or cut it from the roots? Just tell me what you'd do.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built this skill, so the standing rule caps my confidence at medium unless I can point at a run. I can't, because the transcript wasn't kept. I did not use your stated intent as evidence.

Intake state: latent defect. The run succeeded, and the defect is the gap between what it did and what it was for. Environment as given: Claude Code, every root resolved, one run. I don't know what else was loaded, but any other context would have reduced the noise, not added to it.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill's mandate is the AI system (the description says "Sweep Jeff's AI system for entropy"), but its reach into Downloads is defined by a location, not by what belongs to that system. The classification has no outcome for "not part of this system", so every unrelated file in that folder goes to the approval checklist.

EVIDENCE CHAIN

1. The description sets the mandate as "Sweep Jeff's AI system for entropy and clean the safe parts." The same description lists Downloads among the scanned places.
2. The four top-ranked scan roots are AI-system locations by name: Standing Docs, the hub, the workspace and installed skills. The Downloads row is described only as "The junk drawer", which defines it by place and says nothing about content. Step 1 then says to scan "all resolved roots", with no test of whether a file belongs to the system.
3. Only the AUTO-FIX tier needs a positive match, a SHA-256 hit against a higher root. Everything else drops into APPROVAL-REQUIRED, which ends with "Anything you are less than certain about. When in doubt, report, don't act." The description repeats this with "reports everything else for approval." For a business or personal file with no relationship to the system, the skill is always uncertain, so the file always gets reported.
4. APPROVAL-REQUIRED also lists "Deleting or moving anything that is NOT byte-identical to another copy." That makes a unique, unrelated file a legitimate deletion proposal. The NEVER section does not block it, because a proposal is not a deletion.
5. Step 0 says that when all roots resolve, the skill proceeds normally. In Claude Code they did, so the whole of Downloads was in reach. Every safeguard held: Standing Docs were protected, hashes were verified and nothing was deleted unasked. All of them govern how a deletion happens. None governs which files are eligible to be considered. That is why the run looks correct and is still mostly noise.

RULED OUT

1. Contradiction between "Never delete a file that exists in only ONE location (no duplicate = not a stray)." and the approval-tier deletion line. I removed it and held the Downloads reach constant: the unrelated files still surface, under uncertainty or naming items. It decides the verb on the checklist, not which files appear. Demoted to co-factor.
2. Safety failure. The run protected Standing Docs and asked before deleting, so inversion changes nothing. Demoted.
3. Trigger or routing failure. The skill fired on a correct run, so the never-fired causes don't apply.
4. Step 0 surface gating. It worked as written. It only determines that Downloads was reachable, so it is a precondition and not the cause.
5. Missing worked example, instruction volume, naming conventions. The file is short, and the naming checks are scoped to the Code workspace. Flipping any of these leaves the 256 MB of unrelated files in place. Demoted.

CONFIDENCE

Medium, capped by author bias and by the missing run record. The one piece of evidence that would move it up is the item-level list from that run, showing which APPROVAL-REQUIRED bullet each unrelated file landed under. That list would also show whether the 256 MB came mostly from unique files or from dups inside Downloads, which I can't separate from your build log.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill's mandate is the AI system (the description says "Sweep Jeff's AI system for entropy"), but its reach into Downloads is defined by a location, not by what belongs to that system. The classification has no outcome for "not part of this system", so every unrelated file in that folder goes to the approval checklist.
