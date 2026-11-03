# Live path (comp #15): rebuild arm, sealed request F05 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (4283 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (4496 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-11-03T04:11:53Z to 2026-11-03T04:12:50Z (UTC).
Session id: 8da60f8f-36d2-498f-87a6-09562afa10a2. Cost as the CLI reported it: turn 1 US$0.2434, turn 2 US$0.2869.
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

I'm in the latent defect state. The run did what the file told it to, and the defect is the gap between what it did and what it was for. One bias note first: you wrote system-hygiene, so under my rules your account of what each line was meant to do doesn't count as evidence, and confidence is capped at medium. The run is also secondhand, quoted from your build log rather than a preserved transcript. You building me as well doesn't change any of this; the cap comes from you being the skill's author.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill says its purpose is "Sweep Jeff's AI system for entropy and clean the safe parts." But its scan set includes the whole of `C:\Users\<user>\Downloads`, a general folder that mostly holds files that have nothing to do with the AI system. Nothing in the skill tells an AI-system file apart from any other file in that folder. As a result, every file under a scan root counts as part of the AI system, and Downloads makes your personal and business files part of it.

EVIDENCE CHAIN

1. The description names a narrow purpose: "Sweep Jeff's AI system for entropy". The same sentence then lists the reach as "Scans Downloads, the OneDrive AI Systems hub, the Code workspace, and installed skills". Downloads is the only root on that list that isn't an AI-system location by construction.
2. The Scan roots table describes the Downloads row only by its rank behavior: "The junk drawer" and always the loser in a tiebreak. That tells the model which copy to delete when two copies collide. It says nothing about which files in Downloads belong to the AI system in the first place.
3. Process step 1 says to scan "all resolved roots" with no filter. In Claude Code all six roots resolved, so Step 0 waved the full Downloads tree through.
4. The only file-type test in the skill is the auto-fix for a "recognized Clief/Vault asset", and it only decides where such a file gets moved. It never keeps anything out of scope. Everything that isn't byte-identical therefore falls through to "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about. When in doubt, report, don't act." Both are approval-required, which is why the approval list filled up with unrelated files.
5. The parts of the skill stored as exact data all held: the SHA-256 matching, the Rank 1 protection and the ask-before-deleting gate. The part held only as a phrase, "AI system", was never turned into a rule the model could apply, so the model treated the folder list as the definition. That fits your account that nothing it did was wrong.

RULED OUT

1. Surface or missing substrate: every root resolved and Step 0 took the all-resolve branch. Changing the surface wouldn't have changed the result. Demoted.
2. Model judgment (sorting files into the wrong bucket): the model was given no rule for what counts as part of the AI system. Making it reason perfectly still produces the same list, because both approval-required bullets above catch any non-identical file. Demoted.
3. The catch-all "When in doubt, report, don't act." clause: remove it and unrelated non-identical files still land in approval through the NOT byte-identical bullet. It's a co-factor, not the cause. Demoted.
4. A clash between proposing about 256 MB of deletions and "Never delete a file that exists in only ONE location": I can't tell from the evidence whether those files were unique or duplicates inside Downloads. Either way, making the rules consistent would still leave unrelated files in the report. Not the cause; it can't be settled from what I have.
5. Whether Downloads is scanned recursively, which the skill doesn't specify: that changes how much gets surfaced, not whether unrelated files show up. Demoted.
6. Triggering and the tiebreak ranking: it fired on the right request and protected the Standing Docs, so neither failed.

CONFIDENCE

Medium, capped because you're the author and the run is secondhand. The evidence that would move it is the dated report this run should have written under `_hygiene\` (step 5). If its approval items are mostly non-AI Downloads files filed under the NOT byte-identical or when-in-doubt bullets, that confirms this cause against a run I can point at.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill says its purpose is "Sweep Jeff's AI system for entropy and clean the safe parts." But its scan set includes the whole of `C:\Users\<user>\Downloads`, a general folder that mostly holds files that have nothing to do with the AI system. Nothing in the skill tells an AI-system file apart from any other file in that folder. As a result, every file under a scan root counts as part of the AI system, and Downloads makes your personal and business files part of it.
