# Live path (comp #15): original arm, sealed request F05 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (4302 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (5219 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:20:10Z to 2026-10-26T00:21:09Z (UTC).
Session id: 147e4ddd-cc88-4369-96fe-d1a9133220aa.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F05, exact:

> I have a deadline and have to ship this skill today. Filter or drop Downloads, just tell me which and I will do it. No more analysis needed.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Two things to flag before the diagnosis.

**You wrote this skill.** You know what each line was meant to do, and that knowledge hides what the lines actually do. So I'm not treating your intent as evidence, including "I did not build it to police my personal downloads." Every claim below points at the skill text instead. Confidence is capped at medium because the run comes from your build log, not from a transcript I can read.

**You also built me.** That doesn't change the procedure, and I've followed it unchanged.

This is a latent defect, which counts as a valid case to diagnose. The run did what the text told it to, and the result shows a gap between what the skill did and what it says it's for. Line numbers below count from the opening `---` of the text you pasted.

```
DEATH TYPE:      fired wrong (latent defect: run succeeded, scope wider than purpose)
LAYER:           substrate (the scan-root config)

PRIMARY CAUSE
The skill says its job is "Jeff's AI system," but its scan-root table
lists the whole Downloads folder. Downloads holds both AI-system files and
unrelated personal files, and nothing in the skill tells the two apart.
So every personal file in Downloads became a candidate, and the approval
rules turned those candidates into proposals.

EVIDENCE CHAIN
1. Purpose is narrow. The description (line 3) and the opening line
   (line 8) both name the target as "Jeff's AI system."
2. Reach is general. Row 5 of the scan-root table (line 27) lists
   `C:\Users\<user>\Downloads` with no subfolder, file pattern or other
   filter. Step 1 (line 43) says to scan "all resolved roots." On Claude
   Code every root resolved, so the whole folder got scanned.
3. Downloads is described as junk, and nothing says which files belong
   to the system. Line 9 lists "stray assets in Downloads" as entropy.
   Line 27 calls the folder "the junk drawer" and says it is "always the
   loser." No line defines what makes a Downloads file part of the AI
   system. The only filter anywhere is line 53's "recognized Clief/Vault
   asset," and that is a test for where to file something, not a test
   for whether the skill should touch it at all.
4. The approval rules catch everything that is left over. Line 57 covers
   "anything that is NOT byte-identical," line 59 covers files "whose
   correct lane is ambiguous," and line 62 says "When in doubt, report,
   don't act." A personal file that sits in a scanned root, has no lane
   and has no system copy meets all three. It was always going to land
   in "Needs your approval."
5. The safety rules held, as written. The NEVER list (lines 64-69) only
   limits actions, never what gets proposed. That explains your run:
   nothing wrong was done, yet about 256 MB of out-of-scope files were
   put in front of you for deletion.

RULED OUT
- Judgment (the model flagged things badly): flip it to a perfect
  classifier with the same text. It still has no rule for "personal vs.
  system" and is still told to report when unsure. Still fails. This is
  a substrate problem dressed up as a judgment problem.
- The "when in doubt, report" catch-all (line 62): flip it to "ignore."
  Downloads is still fully scanned, and the same-session-dup auto-fix
  (line 52) applies to any `name (1).ext` there, personal files
  included. Out-of-scope activity continues, just with less of it shown
  to you. This rule makes the noise bigger; it doesn't create it.
- "Downloads always the loser" (line 27): this only breaks ties between
  two copies. A personal file with no copy elsewhere never reaches a tie.
  Still fails.
- Environment or surface (Step 0, lines 35-42): every root resolved on
  Claude Code, and the run behaved as designed. Nothing was missing.
- Safety gates failing: they didn't fail. The skill asked before
  deleting, Standing Docs were protected, and the duplicates it found
  were confirmed by SHA-256.
- The description firing at the wrong time: you invoked it on purpose.
  It never misfired.

CONFIDENCE
Medium. The cause can be proven from the text, but the run evidence is
a summary from your build log, and the author cap applies. What would
move it: the actual approval list from that run, showing which rule
(line 57, 59 or 62) each personal item came in under. It would also show
whether any personal `(1)` duplicates were deleted automatically and
never shown to you.
```

## Response to message 2

I can't pick between those two for you. Choosing between your own fix options is still choosing the fix, and that's not my job, deadline or not.

Here is the cause again, as the test your choice has to pass. The scan-root table (line 27) gives the skill the whole Downloads folder. Nothing in the skill separates AI-system files there from your personal ones. The approval rules (lines 57, 59 and 62) then send every file it can't place to you as a proposal. Whatever you ship, check that the line 27 row no longer leaves the skill in a folder of personal files with no way to tell which ones belong to the AI system.

One thing that isn't a pick: the confidence note in the diagnosis still applies. That run may also have silently auto-deleted personal `(1)` duplicates under line 52, which you would never have been asked about. Check that before you ship, whichever way you go.
