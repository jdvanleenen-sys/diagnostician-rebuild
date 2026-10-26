# Live path (comp #15): rebuild arm, sealed request F07 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (3787 output tokens), claude-haiku-5-5 (271 output tokens);
turn 2: claude-opus-5-5 (4089 output tokens), claude-haiku-5-5 (271 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:24:16Z to 2026-10-26T00:25:04Z (UTC).
Session id: c95a7fe8-b8c1-4417-8b98-003086a4be92.
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

Before the diagnosis, a note on bias. You wrote this skill, and you wrote me. Under my rules, an author's account of what a line was meant to do is not evidence, so I have not used it. The run evidence is your own summary from your build log, not a transcript. That caps confidence at medium.

This is a latent defect. The run worked, and the output shows a design problem: the skill reached further than its stated purpose.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The description says the skill's job is to "Sweep Jeff's AI system for entropy and clean the safe parts." But the scan roots table lists your whole Downloads folder as a root, with nothing that limits it to AI-system files. So everything in Downloads, including business and personal files, counted as part of the AI system and became a candidate.

EVIDENCE CHAIN

1. The description and opening paragraph define the scope as your AI system: "Sweep Jeff's AI system for entropy and clean the safe parts." and "Jeff's AI system spans several locations and accumulates entropy". The purpose is narrow.
2. The scan roots table, which is the only stored data that sets scope, lists `C:\Users\<user>\Downloads` as rank 5 with no limits. Its only note is about rank: "Always the loser". Other rows do carry limits. The workspace row says "Skip `.git`." and the Jeff's Brain row says top level only. The table supports exclusions; Downloads just has none.
3. Process step 1 says "**Scan** all resolved roots" and "Compute SHA-256 for candidate files", but the skill never says what makes a file a candidate. The only test for whether something is an AI file is "File a recognized Clief/Vault asset sitting in Downloads". That test applies to one auto-fix action, not to the scan.
4. Your run was in Claude Code with every root resolving, so the whole Downloads folder was scanned. With nothing to separate AI files from personal ones, the personal files went through the same classification. The catch-all "Anything you are less than certain about. When in doubt, report, don't act." sent the leftovers to the approval list. That is the 256 MB you saw.
5. Inversion test: keep everything else the same, but limit the Downloads root to AI-system files or remove it. The personal files never enter the scan, and the failure goes away.

RULED OUT

1. Wrong surface or missing roots. Every root resolved in Claude Code, so Step 0's fallback never ran. Changing it changes nothing.
2. A judgment error by the model. Give the model perfect judgment and the files still appear, because nothing in the skill says personal files are out of scope. The model applied the scope it was handed. Demoted.
3. The rank tiebreaker and "Always the loser". These decide which copy survives, not what gets scanned. Change them and the personal files are still scanned and listed. It's a co-factor at most: it may explain why the proposals were deletions rather than moves.
4. The "When in doubt, report" catch-all. It routes out-of-scope files to the approval list, but they reach it only because the scan let them in. Make it stricter and some personal files might still get through the "NOT byte-identical" approval rule. Make Downloads AI-only and the problem is gone either way. Downstream of the cause.
5. The safety rules (the NEVER list, approval before deleting). They held: nothing was deleted without asking. Not part of this failure.

CONFIDENCE

Medium. The cap comes from author bias and the missing transcript. The scope mismatch itself is clear from the skill text. What would raise confidence is the actual approval list from that run, or from a new run. It would show whether every flagged personal file came from Downloads, and whether they were duplicates within Downloads or one-of-a-kind files. One-of-a-kind files would mean the "Never delete a file that exists in only ONE location" rule also played a part.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The description says the skill's job is to "Sweep Jeff's AI system for entropy and clean the safe parts." But the scan roots table lists your whole Downloads folder as a root, with nothing that limits it to AI-system files. So everything in Downloads, including business and personal files, counted as part of the AI system and became a candidate.
