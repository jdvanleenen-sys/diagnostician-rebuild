# Live path (comp #15): rebuild arm, sealed request F05 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (3989 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (4164 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-25T20:01:16Z to 2026-10-25T20:02:06Z (UTC).
Session id: 310b98e4-8203-4c28-8e63-342418ddeb9e.
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

Before the diagnosis, one note on bias. You wrote this skill, and you also wrote my procedure, so this is a self-diagnosis. You know what each line was meant to do, and that knowledge can hide what the line actually does. I have not used your intent as evidence. Confidence is capped at medium because the run itself wasn't saved; I only have your build log's account of it.

This is a run that succeeded but exposed a design flaw. Every root resolved on Claude Code, the safety gates held, and the output still covered far more than the skill is for. The successful run is what I'm diagnosing.

DEATH TYPE: fired wrong (scope mismatch)

LAYER: substrate

PRIMARY CAUSE

The description says the skill is for your AI system, but the scan list includes your whole Downloads folder, and nothing in the file says which Downloads files belong to the AI system. The folder paths are stored as hard data and were followed exactly. The phrase "AI system" is only a phrase, with no stored test behind it, so in practice the skill's reach is the whole folder.

EVIDENCE CHAIN

1. The description's first sentence names a narrow purpose: "Sweep Jeff's AI system for entropy and clean the safe parts." The intro repeats it: "Jeff's AI system spans several locations".
2. The scan roots table lists `C:\Users\<user>\Downloads` at rank 5 with no filter at all. It's the only root that isn't an AI-system folder by design. The others are your hub, the Code workspace, installed skills and the workshop. Its note calls it "The junk drawer." and the intro lists "stray assets in Downloads" as a kind of entropy. Taken together, every file in Downloads counts as a target.
3. The only AI-specific test anywhere in the file is "recognized Clief/Vault asset", and it applies to just one auto-fix: filing an asset into `Clief Notes\`. No test tells the scan or the classify step that a file is outside the AI system and should be ignored.
4. With no way out of scope, an unrecognized personal file can only go through the approval rules. "Deleting or moving anything that is NOT byte-identical" and "Anything you are less than certain about. When in doubt, report, don't act." both send it to the approval list. The model followed the file correctly, and the result was about 256 MB of business and personal downloads offered for deletion.
5. Your own summary backs this up: "Nothing it did was wrong". When the model obeyed every rule and the output was still off-purpose, the problem is in what the file gives it to work with, not in the model's reasoning.

RULED OUT

1. Surface or environment (Step 0). Every root resolved on Claude Code. Running it on a surface where roots fail would change what gets skipped, not what Downloads contains. Not a factor here.
2. Model judgment in sorting files. If the model had sorted every personal file perfectly, the rules would still have sent each one to the approval list, because there is no ignore option. It's downstream.
3. Downloads ranking last ("Always the loser"). Rank only decides which of two identical copies survives. Change the rank and personal files that exist only once still get surfaced. Unrelated.
4. The "When in doubt, report" catch-all. This is a co-factor. Remove it and the "junk drawer" and "stray assets in Downloads" framing still makes those files targets. It made the list bigger; it didn't create the problem.
5. A possible clash with "Never delete a file that exists in only ONE location". If the 256 MB were mostly single-copy files, proposing their deletion strains that rule. The approval gate stopped any harm, though, and even if that rule were tightened the files would still be scanned and reported. Without the approval list I can't tell whether this happened. Left as an open question, not a cause.
6. The approval gate itself. It worked as designed. It limited the damage; it didn't cause it.
7. Naming-convention checks. Those apply only to the Code workspace and played no part in the Downloads findings.

CONFIDENCE

Medium. The cap comes from author bias and the missing transcript. The scope mismatch can be read straight from the skill file, but the run behind it is only described in your log. What would raise it: the actual approval list from that run, split into personal files that exist only once versus byte-identical duplicates of personal files.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The description says the skill is for your AI system, but the scan list includes your whole Downloads folder, and nothing in the file says which Downloads files belong to the AI system. The folder paths are stored as hard data and were followed exactly. The phrase "AI system" is only a phrase, with no stored test behind it, so in practice the skill's reach is the whole folder.
