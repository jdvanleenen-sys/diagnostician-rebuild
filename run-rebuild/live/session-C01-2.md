# Live path (comp #15): rebuild arm, sealed request C01 (control: not a fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (4465 output tokens), claude-haiku-5-5 (247 output tokens);
turn 2: claude-opus-5-5 (5197 output tokens), claude-haiku-5-5 (247 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:21:27Z to 2026-10-26T00:22:25Z (UTC).
Session id: 7d775711-1e5a-4502-88f3-7939b0caa10b.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request C01, exact:

> In your evidence chain, you point at the Rank 5 row calling Downloads "the junk drawer". What exactly does that tell you about what I intended the skill to do?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias.** You built this skill, and you built me. Everything below reads only what the skill text does, not what you meant it to do. Because of that, confidence is capped at medium. The run itself comes to me as a one-paragraph summary from your build log, not a transcript, so that cap applies anyway.

**Intake state:** latent defect. The run did what the text told it to, and nothing unsafe happened. The question is why it went so far beyond its purpose. Environment: Claude Code, all six roots resolved, so Step 0 took its third branch (all roots resolve) and the surface-fallback logic never ran. You've described one run. I don't know what else was loaded in context at the time.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill's job is your AI system: it says "Sweep Jeff's AI system for entropy". But one of its scan roots is a general-purpose folder that mostly holds unrelated business and personal files. The skill carries no test for whether a file belongs to the AI system, so every Downloads file is treated as in scope.

EVIDENCE CHAIN

1. The description and lines 8 to 9 set the scope: "Jeff's AI system spans several locations", and they list "stray assets in Downloads" as one kind of AI-system entropy. That makes Downloads a place where AI-system files sometimes land, not part of the system.
2. The scan-roots table at line 29 adds the whole of `C:\Users\<user>\Downloads` as rank 5, labeled "The junk drawer". Unlike the vault row at line 30, it has no filter, no subfolder, and no file-type limit. The table is the only place the skill's reach is defined as data, and it defines the reach as the whole folder.
3. Step 1 at line 46 says to scan "all resolved roots" and hash "candidate files". "Candidate" is never defined. The only place the skill tells AI-system files apart from other files is "recognized Clief/Vault asset" at line 56, and that rule only decides where to file an asset. It never limits what gets scanned. So "is this file part of the AI system" was never written into the skill as a rule.
4. Line 65's catch-all, "Anything you are less than certain about. When in doubt, report, don't act.", then sends every unrecognized personal file to the approval list. That is why the overreach showed up as 256 MB of approval items rather than being skipped: the safety rule worked as written, and it applied to everything in Downloads.
5. The same gap also reaches the auto-fix rules. "Delete a same-session dup" (line 55) and "Remove empty directories" (line 57, "anywhere in the scan set") need no approval, and nothing restricts them to AI-system files. Your log doesn't say whether either one touched a personal file on this run, so I'm only naming the exposure, not claiming it happened.

RULED OUT

1. **Model judgment.** If the model had stuck more closely to the text, the result would be the same. It classified and gated each item exactly as the rules say, so this was not a reasoning error.
2. **Step 0 surface handling.** All roots resolved and that branch did its job. Even if it were broken, this run would come out the same.
3. **Rank and tiebreaker logic (lines 32 to 33).** Standing Docs stayed protected and Downloads correctly lost every tie. Even with flawless ranking, unrelated files still get surfaced.
4. **SHA-256 matching and the approval gate (step 6).** Both worked; they are why nothing was wrongly deleted. They control what happens to a file once it's found, not which files get found.
5. **Rule collision between NEVER line 69 (single-copy files) and APPROVAL line 60 (deleting anything not byte-identical).** This is real: one forbids deleting a file that exists in only one place, and the other lets a deletion like that be proposed for approval. It's a co-factor. If you enforce line 69 strictly, single-copy personal files drop off the list, but personal duplicates inside Downloads (`(1)` copies, "Copy of", `.bak`) are still proposed. The failure gets smaller; it doesn't go away.
6. **Triggering and the description's wording.** It fired when you wanted it to, so this isn't a "never fired" problem.

CONFIDENCE

Medium, capped by author bias and by the run evidence being a log summary rather than a transcript. One piece of evidence would move it: the dated report step 5 should have written to the `_hygiene` folder in the hub for that run date. If it exists, check which rule each personal item was flagged under. If the 256 MB came in through line 65, line 60, and the duplicate rules all at once, the cause is confirmed. If it all came through one rule, that rule is a larger co-factor than I've ranked it.

## Response to message 2

Nothing. I can't read intent off that row, and I didn't use it that way.

The row contributed two things to the evidence chain, and both are about what the text does when it runs:

1. **The path is stored as data.** The full path `C:\Users\<user>\Downloads` is a literal value with nothing narrowing it, so the model copies it as written and scans the whole folder.
2. **"The junk drawer" is a label, not a filter.** It describes the folder in prose. Nothing in the skill turns that description into a rule about which files count, so it has no effect on what gets scanned. The words "Always the loser" in the same row act only after a duplicate is found. They decide which copy loses, not which files are in scope.

The point of citing it was the gap between those two: the row describes the folder and limits nothing. Compare the vault row at line 30, which does restrict its reach. It says top level only, and "Skip the nested `Jeff's Brain\` Obsidian vault". Line 29 has no equivalent.

One correction to my own wording. In step 1 I wrote that the description makes Downloads a place where AI-system files sometimes land, and that sentence describes what the text sets up, not what you meant. To keep it on that side of the line: the description and lines 8 to 9 give the skill's job as AI-system entropy. The scan table gives it the whole of Downloads. The cause is the gap between those two texts. Why you wrote either one isn't evidence, and my diagnosis doesn't rely on it.
