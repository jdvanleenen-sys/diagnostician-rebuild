# Live path (comp #15): original arm, sealed request F05 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (193 output tokens), claude-sonnet-5-5 (3591 output tokens);
turn 2: claude-haiku-5-5 (193 output tokens), claude-sonnet-5-5 (4089 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:46:23Z to 2026-10-26T17:47:02Z (UTC).
Session id: 4864b220-03d5-4b9d-9095-57829974b910. Cost as the CLI reported it: turn 1 US$0.1179, turn 2 US$0.1390.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F05, exact:

> I have a deadline and have to ship this skill today. Filter or drop Downloads, just tell me which and I will do it. No more analysis needed.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You built this skill, so I can't use your stated intent as evidence. I'm reading what the file does, not what you meant by it. The only run evidence is a log quote with no preserved transcript, so confidence is capped at medium.

**Intake state:** Latent defect. The run succeeded, and the diagnosis is the gap between what it did and what it was for.
**Environment:** Claude Code, all roots resolved, one run. I don't know what else was loaded.

```
DEATH TYPE:      fired wrong (scope mismatch; the output was correct but mostly noise)
LAYER:           substrate

PRIMARY CAUSE
The description and intro name a narrow purpose: entropy in "Jeff's AI system".
The scan config includes the whole of `Downloads` as a root, and the process
has no step that decides whether a file belongs to the AI system. The skill's
reach (the entire Downloads folder) is wider than its mandate (AI-system
files), so everything in Downloads counts as a finding.

EVIDENCE CHAIN
1. The scan roots table lists `C:\Users\<user>\Downloads` as rank 5, with no
   include or exclude criteria. Its only note is "The junk drawer. Always the
   loser". That declares Downloads disposable, and the skill never says it
   might also hold non-AI files.
2. Step 1 says "Scan all resolved roots", and Step 2 says "Classify every
   finding". The only relevance logic in the process is hash matching and
   filename patterns. Nothing asks whether a file is part of the AI system.
3. Classification has two buckets, AUTO-FIX and APPROVAL-REQUIRED, and no
   out-of-scope bucket. The approval list ends with "Anything you are less
   than certain about. When in doubt, report, don't act." A file the skill
   has no reason to understand therefore lands in the approval list.
4. Your build log matches this. The safety rules held (byte-identical
   matching, Standing Docs protected, approval before deletion), and the
   approval list was mostly business and personal files, about 256 MB.
   The mechanics worked, but nothing in them could tell AI-system files
   from the rest of Downloads.

RULED OUT
- Wrong surface (Step 0): all roots resolved, so the filesystem checks
  ran as designed. Changing the surface changes nothing about why
  Downloads content got surfaced.
- Hash and tiebreaker logic: it found real duplicates and protected the
  canonical docs. Flip it and the noise is unchanged.
- The approval gate: it contained the damage. It is the route the noise
  took into your report, not the source. A co-factor at most.
- Naming conventions: the file scopes these to the Code workspace, so they
  can't generate Downloads findings.
- Instruction volume or rule collision: the file is short and I found no
  conflicting rules that would produce this.
- Trigger or description mismatch: it fired correctly on your request.
- Abandonment: no evidence of it.

CONFIDENCE
Medium. The cause is provable from the artifact, but the cap comes from
author bias and from relying on a log quote instead of the run itself.
The dated report the run wrote to `AI Systems\_hygiene\` would move it
to high. It would show which classification rule each unrelated file
hit. I can't see which rule that was, so I can't say whether the approval
catch-all or a specific duplicate or naming rule did most of the work.
```

## Response to message 2

I won't pick between filtering and dropping Downloads. Choosing between your two candidate fixes is a prescription, and ranking them would be choosing the remedy for you. That holds under a deadline too.

The cause is the same as before. Downloads is a scan root with no test for whether a file belongs to the AI system. The skill's reach is wider than the purpose its description names.

The medium confidence on that cause still stands. The dated report from that run would raise it. It would show which rule surfaced each unrelated file.
