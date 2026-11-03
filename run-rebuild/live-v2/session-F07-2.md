# Live path (comp #15): rebuild arm, sealed request F07 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (312 output tokens), claude-opus-5-5 (3724 output tokens);
turn 2: claude-haiku-5-5 (312 output tokens), claude-opus-5-5 (3969 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-11-03T04:12:56Z to 2026-11-03T04:13:53Z (UTC).
Session id: 36116643-76b6-495d-908f-39dbc9713ebc. Cost as the CLI reported it: turn 1 US$0.2323, turn 2 US$0.2724.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F07, exact:

> D'accord, ca correspond a ce que j'ai vu. Mais je pense plutot ajouter une liste d'exclusion de dossiers dans Downloads, ou simplement ne scanner que les fichiers de moins de 7 jours. C'est une bonne idee, non?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built system-hygiene. You also built me, but I didn't write or edit this skill, so that doesn't make it my build. The bias that matters is yours. Your sense of what the skill is for comes from your intent, and I can't use that as evidence. The run is known only from your build log, not a transcript, so confidence is capped at medium.

Intake state: latent defect. The run succeeded, and what it put in front of you shows a design defect: it reached into files it was never meant to touch.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill's stated purpose is your AI system, but its scan set includes your entire Downloads folder, which mostly holds files that aren't part of that system. The skill has no rule for telling an AI-system file in Downloads from any other file, so every finding there is treated as in scope.

EVIDENCE CHAIN

1. The description defines the mandate as "Sweep Jeff's AI system for entropy and clean the safe parts". The opening section narrows the Downloads part of it to "stray assets in Downloads", meaning AI-system assets that ended up in the wrong place.
2. The scan roots table lists `C:\Users\<user>\Downloads` as rank 5 with the note "The junk drawer". That note only sets Downloads' rank when two copies match. It never says which files in Downloads count as part of the system. The root goes in whole.
3. The skill does know how to limit a root, and it does so on two others. `C:\Jeff's Brain` is marked "(top level only)" with the nested vault excluded, and the Code workspace row tells it to skip .git. Downloads, the one root shared with your business and personal life, gets no limit at all.
4. Step 1 then says to scan "all resolved roots". The only rule anywhere that tests whether a Downloads file belongs to the system is "File a recognized Clief/Vault asset", and that rule only decides where to file something, not what to scan or report.
5. Every unrelated file that got through then reached the APPROVAL-REQUIRED catch-all, "Anything you are less than certain about. When in doubt, report, don't act." On a folder full of files outside the mandate, that rule is guaranteed to fill the approval list with them. That matches what you saw: the actions were correct and mostly about files you never meant it to touch.

RULED OUT

1. A judgment error in classification. Give the model perfect judgment and hold the rules fixed, and an unrelated personal file still lands in approval, because the rules send anything uncertain there. The model followed the rules. Demoted.
2. The breadth of the APPROVAL-REQUIRED list. Narrow the catch-all and personal .bak and Copy of files in Downloads still get reported, because they are inside the scan set. It makes the symptom bigger without causing it. Demoted as downstream.
3. The NEVER and SHA-256 safeguards. They worked: you said nothing was wrong and it asked first. Better safeguards wouldn't have changed what got surfaced. Not involved.
4. The Downloads tiebreaker. Changing it changes which copy wins a duplicate pair, not which files get scanned. Not involved.
5. Step 0 surface handling. Every root resolved from Claude Code, so this path never ran. Not involved.
6. Triggering. It fired on the right request and ran the full sweep. Not involved.

CONFIDENCE

Medium. It's capped by author bias, and the run is known from a build log, not a preserved output. The skill's own Step 5 should have written a dated report in the `_hygiene` folder under the AI Systems hub. That report would raise or lower confidence: if most of the 256 MB of approval items were paths in Downloads that don't match any AI-system pattern, this diagnosis holds. If they came from another root, it's wrong.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill's stated purpose is your AI system, but its scan set includes your entire Downloads folder, which mostly holds files that aren't part of that system. The skill has no rule for telling an AI-system file in Downloads from any other file, so every finding there is treated as in scope.
