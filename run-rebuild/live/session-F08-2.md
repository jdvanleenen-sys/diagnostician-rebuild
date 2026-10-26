# Live path (comp #15): rebuild arm, sealed request F08 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (24 output tokens), claude-opus-5-5 (4170 output tokens);
turn 2: claude-haiku-5-5 (24 output tokens), claude-opus-5-5 (4384 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:24:26Z to 2026-10-26T00:25:15Z (UTC).
Session id: 6ac639f4-16c0-43ab-8a12-d8be7790dca1.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F08, exact:

> What I'm thinking is a third option: keep Downloads but only let the skill act on files that already have a duplicate elsewhere, and never surface the rest. Is that good? Better than the filter or dropping Downloads?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you wrote this skill, and you also built the diagnostician reading it. The procedure doesn't change, but confidence is capped at medium. The run evidence is a paraphrase from your build log, not a transcript I can point at.

Intake state: latent defect. The run worked as written, and the output shows the skill reaches further than its stated purpose.

DEATH TYPE: fired wrong (scope mismatch)

LAYER: substrate

PRIMARY CAUSE

The skill's stated purpose is to "Sweep Jeff's AI system for entropy," but its scan config gives it the whole of `C:\Users\<user>\Downloads`, a folder holding everything you download. Nowhere does the skill define which files count as part of your AI system. The only test it applies is location, so every file in Downloads became system entropy.

EVIDENCE CHAIN

1. The frontmatter description and the opening line set the boundary as your AI system: "Sweep Jeff's AI system for entropy and clean the safe parts." Its examples ("duplicate downloads" and "stray assets in Downloads") assume that whatever sits in Downloads is the system's overflow.
2. The Scan roots table lists `C:\Users\<user>\Downloads` at rank 5 with no filter at all: no file types, no name patterns, no list of AI-system assets. Its only note is about rank: "The junk drawer." and "Always the loser". The other rows narrow their roots where needed (Standing Docs is read-only, `.git` is skipped, the nested Obsidian vault is skipped), so the table does have a way to narrow a root. Downloads just never got one.
3. Process step 1 says to scan "all resolved roots" and hash candidate files. Step 0 confirmed that every root resolved in Claude Code, so the sweep covered all of Downloads, exactly as configured.
4. The APPROVAL-REQUIRED list is written to catch anything doubtful: "Deleting or moving anything that is NOT byte-identical to another copy.", "Moving files whose correct lane is ambiguous.", and "Anything you are less than certain about." Every unrelated business or personal file meets at least one of these. A tax PDF has no lane in your AI system, so its lane is ambiguous by definition.
5. The result is the run you saw. The safety rules (SHA-256 checks, Standing Docs protection, ask before deleting) all held, and they were applied to a set of files the skill was never meant to own. That is why the ~256 MB proposal could be technically correct and still off-mandate.

RULED OUT

- Wrong surface or missing access (the Step 0 problem). The run was in Claude Code and every root resolved. Flipping this only shrinks the run or stops it, without fixing the scope. Demoted.
- A judgment error in classification. You report that nothing it did was wrong. Give it perfect classification, keep the config, and the personal files still show up, because the rules put them in scope. Demoted.
- The approval gate or the dedupe logic. Both worked. Changing either changes how the files are handled, not whether they are swept. Demoted.
- The catch-all "Anything you are less than certain about." It's a co-factor. Remove it and the ambiguous-lane and not-byte-identical rules still pull in personal files. Demoted.
- The undefined "recognized Clief/Vault asset" (no file lists what counts as recognized). This is a real gap, but adding that list only affects the auto-move rule. The approval categories would still cover every other Downloads file. Demoted.
- Broad trigger phrases such as "clean up my files". The invoking prompt wasn't kept, but the scan table, not the prompt, decides what gets swept. A precise invocation fails the same way. Demoted.
- The rank tiebreaker. It only applies to duplicates found in two ranked roots. It doesn't decide which files are swept in the first place. Demoted.

CONFIDENCE

Medium. The artifact alone supports the cause: Downloads is a whole-folder root with no test for what belongs to your AI system. The cap comes from author bias plus a run known only from your build log. The evidence that would move it is the run's own report: Step 5 writes a dated file to `_hygiene\YYYY-MM-DD-hygiene.md` under the AI Systems folder. If that file exists, it shows which rule surfaced each personal file. It would confirm or overturn the claim that the volume came from the approval catch-alls rather than from the same-folder duplicate rule.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed: The skill's stated purpose is to "Sweep Jeff's AI system for entropy," but its scan config gives it the whole of `C:\Users\<user>\Downloads`, a folder holding everything you download. Nowhere does the skill define which files count as part of your AI system. The only test it applies is location, so every file in Downloads became system entropy.
