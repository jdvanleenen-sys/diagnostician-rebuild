# Live path (comp #15): rebuild arm, sealed request F07 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (3873 output tokens), claude-haiku-5-5 (309 output tokens);
turn 2: claude-opus-5-5 (4143 output tokens), claude-haiku-5-5 (309 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-11-03T04:12:51Z to 2026-11-03T04:13:37Z (UTC).
Session id: f2b0d8ce-166a-42f0-acfe-2ce93c4cb0e9. Cost as the CLI reported it: turn 1 US$0.2354, turn 2 US$0.2771.
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

**Author bias:** You built this skill, and you built me. You also told me plainly what you didn't intend it to do. I'm treating that as the failure event, not as evidence of what the lines actually do. Every claim below points at the text of the skill. I only have your build-log summary of the run, not the transcript, so confidence is capped at medium.

**Intake state:** latent defect. The run worked, and its output shows the skill reaches further than its stated purpose. All scan roots resolved in Claude Code, so where it ran isn't in question.

DEATH TYPE: fired wrong (the run succeeded, but the skill acted on files outside its mandate)

LAYER: substrate

PRIMARY CAUSE

The skill says its purpose is your AI system ("Sweep Jeff's AI system for entropy and clean the safe parts."). But its scan-roots table includes all of `C:\Users\<user>\Downloads`, with no rule for which Downloads files belong to that system. So everything in Downloads counts as in scope, including business and personal files the skill was never meant to touch.

EVIDENCE CHAIN

1. The description and the opening line both define the job as the AI system: "Sweep Jeff's AI system for entropy and clean the safe parts." and "Jeff's AI system spans several locations".
2. The scan-roots table lists Downloads as rank 5 by its whole path. The only note on that row is "The junk drawer." plus `Always the loser`. That decides which copy wins a tie. It doesn't decide which files are in scope. The table has an exclusion for the Obsidian vault and a skip for `.git`, but nothing that narrows Downloads.
3. The skill can already tell an AI-system file from other files in Downloads: the auto-fix rule "File a recognized Clief/Vault asset" depends on exactly that. But it only uses that test when filing assets, never to decide what gets scanned. Everything else in Downloads gets scanned and hashed.
4. Process step 1 says to scan all resolved roots. The approval rules then catch whatever the auto-fix rules miss: "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about." Personal files in Downloads match neither auto-fix rule, so they all end up in the approval list.
5. So the result you saw is what the config tells the skill to do. With Downloads as large as yours, about 256 MB of unrelated files filled the approval list.

RULED OUT

- **Surface or missing access (Step 0):** every root resolved. Flipping this changes nothing, and the run still surfaces the personal files.
- **Model judgment:** the rules put these files in the approval list, and the model followed them. A perfect classifier still lists them. Not the cause.
- **The catch-all approval rules ("Anything you are less than certain about."):** narrowing them still leaves Downloads scanned and hashed. Byte-identical personal duplicates would still surface under the duplicate rules. This is a co-factor that makes the list bigger, not the cause.
- **The tiebreak rule (Downloads always loses):** it decides which copy goes, not whether a file is looked at. Flipping it still fails.
- **Description and triggering:** the skill fired on the right request, so these don't apply.
- **The NEVER rules and approval gating:** these held. Nothing was deleted without asking. They are why the defect showed up as noise instead of damage.
- **Hard-coded paths and naming:** cosmetic, and they didn't contribute.

CONFIDENCE

Medium. That's the cap for an author-run diagnosis without a transcript. The verdict itself rests on the scan-roots table, which needs no transcript. What would move it is the itemized approval list from that run, or from a rerun, showing which rule filed each Downloads item. One detail it would also settle: under the skill's own text, a byte-identical `name (1).ext` pair in Downloads is an auto-fix, so it should have been deleted without asking. If personal pairs like that were listed for approval instead, the model was more cautious than the skill. That would make the skill riskier when run unattended than this run suggests.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill says its purpose is your AI system ("Sweep Jeff's AI system for entropy and clean the safe parts."). But its scan-roots table includes all of `C:\Users\<user>\Downloads`, with no rule for which Downloads files belong to that system. So everything in Downloads counts as in scope, including business and personal files the skill was never meant to touch.
