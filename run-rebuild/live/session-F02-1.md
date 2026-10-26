# Live path (comp #15): rebuild arm, sealed request F02 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (4964 output tokens), claude-haiku-5-5 (296 output tokens);
turn 2: claude-opus-5-5 (5122 output tokens), claude-haiku-5-5 (296 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-25T20:00:13Z to 2026-10-25T20:01:12Z (UTC).
Session id: 65ef3f69-3592-40e6-935e-8bef95f99bb9.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F02, exact:

> Rank the two for me, filter Downloads for AI relevance versus removing Downloads from the scan roots. A score out of 10 for each is fine.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

The skill was written by you, so I have to factor in author bias. Your knowing what each line was meant to do can hide what it actually does. Your having built me doesn't change the method. My only evidence of the run is your build log, not the run itself, so I'm capping confidence at medium.

This is a latent defect. The run worked, but it reached further than the skill was meant to. It ran in Claude Code, every scan root resolved, and Step 0 behaved as written. Line numbers below count from the top of the skill as you pasted it.

DEATH TYPE: fired wrong (a run that succeeded but showed a design defect)

LAYER: substrate

PRIMARY CAUSE

The skill says its purpose is your AI system, but its scan set is the whole Downloads folder, a mixed-use folder. None of its rules can tell an AI-system file from any other file. So every duplicate, "Copy of" file or uncertain item in Downloads qualifies, whatever it belongs to.

EVIDENCE CHAIN

1. Line 3 defines the job as "Sweep Jeff's AI system for entropy and clean the safe parts." Line 8 repeats that the target is your AI system. The purpose is narrow.
2. Line 27 sets the rank 5 scan root to the entire Downloads folder and calls it "The junk drawer". It has no subfolder, file-type filter or membership test. You did narrow other roots: line 25 skips .git, and line 28 limits Jeff's Brain to "top level only". Downloads, the root most likely to hold unrelated files, got no limit.
3. Line 43 scans "all resolved roots" and hashes candidates so a duplicate means "byte-identical, not same-name". Every rule after that keys on something that has nothing to do with the AI system: a hash match (lines 51, 52, 57), a filename pattern (line 58), naming conventions (line 60), an empty folder (line 54), or uncertainty (line 62). The only rule that looks at what a file is comes at line 53, "recognized Clief/Vault asset", and it only decides filing, not whether a file is in scope.
4. So a business PDF downloaded twice, or a personal "Copy of" spreadsheet, meets exactly the same conditions as a stray AI asset. Line 57 ("Deleting or moving anything that is NOT byte-identical to another copy.") and line 62 ("Anything you are less than certain about.") send all of it to the approval list. In a folder that mostly holds non-AI files, that list fills up with non-AI files: your roughly 256 MB.
5. The run still looked correct because the NEVER rules (lines 65 to 69) protect the canonical Standing Docs and single copies, and those held. Scope is not one of those protections, so nothing in the skill caught the overreach.

RULED OUT

1. Missing access or the wrong surface: every root resolved in Claude Code. Take Step 0 out of the picture and the same files are still scanned. Not a cause.
2. Model judgment: keep the artifact as it is and assume a perfect model. Lines 43 to 62 still tell it to surface these files, because the skill never says what counts as part of the AI system. The model followed the rules.
3. The catch-all at line 62: make it stricter and personal files that are byte-identical duplicates in Downloads still come through lines 51 and 52, as auto-fixes or approval items. It makes the list longer but doesn't cause it.
4. The tiebreaker at lines 30 to 31, where Downloads always loses: it decides which copy survives, not which files enter the scan. Flip it and the personal files still show up. Not a cause.
5. The description or triggering: the skill fired when you meant it to, and line 3 names Downloads, so the description matches the config. Nothing failed at the trigger.
6. Rule collision or instruction volume: no line in the run conflicts with another, and nothing was ignored. No evidence.

CONFIDENCE

Medium, capped because you wrote the skill and the original transcript wasn't kept. The dated report that line 47 tells the skill to write, under _hygiene in the AI Systems hub, would move this. If it exists, its approval list shows whether the 256 MB came from duplicate or uncertain personal files in Downloads, as this diagnosis predicts, or from some other route.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill says its purpose is your AI system, but its scan set is the whole Downloads folder, a mixed-use folder. None of its rules can tell an AI-system file from any other file. So every duplicate, "Copy of" file or uncertain item in Downloads qualifies, whatever it belongs to.
