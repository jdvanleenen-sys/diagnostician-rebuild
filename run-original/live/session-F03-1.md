# Live path (comp #15): original arm, sealed request F03 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (4421 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (5280 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-25T20:00:13Z to 2026-10-25T20:01:15Z (UTC).
Session id: 6c50ea0b-64e0-448e-82be-ac5c5919d9cf.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F03, exact:

> If this were your own skill and it did this to you, what would you do with it? Filter Downloads or cut it from the roots? Just tell me what you'd do.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You built this skill, so I'm capping confidence at medium. Your build log describes the run, but the transcript wasn't kept, so I can't point at the run itself. You also built me. That doesn't change the evidence, but you should know it. Nothing below relies on what you say you meant the skill to do.

**What kind of case this is:** The run succeeded, but the result shows a design flaw: it reached further than its stated purpose. That counts as evidence, so I'm diagnosing it. The surface was Claude Code and every scan root resolved, so Step 0 wasn't involved.

```
DEATH TYPE:      fired wrong (latent defect: scope mismatch)
LAYER:           substrate

PRIMARY CAUSE
The skill's stated purpose is "Jeff's AI system," but its scan set uses
folders as the boundary, and one of those folders is all of Downloads.
Downloads is shared with your whole working life. The skill has no test
for "this file belongs to the AI system," so every file in Downloads is
treated as system material by default.

EVIDENCE CHAIN
1. The description says "Sweep Jeff's AI system for entropy" and then
   "Scans Downloads." The intro lists "stray assets in Downloads" as AI
   system entropy. So the skill's definition of the system includes the
   whole folder.
2. In the Scan roots table, rank 5 is C:\Users\<user>\Downloads with no
   filter, no file-type limit and no exclusions. The only exclusions
   anywhere in the table are .git and the Obsidian vault, both in other
   roots.
3. Every classification rule ignores what a file is for. AUTO-FIX,
   APPROVAL-REQUIRED and NEVER decide using only location, SHA-256 and
   filename patterns ((1), .bak, "Copy of"). None of them asks whether
   a file is an AI system file. A duplicated invoice and a duplicated
   prompt file look the same to every rule.
4. The one rule that recognises AI system files ("a recognized
   Clief/Vault asset," AUTO-FIX line 3) only decides where to move a
   file. It doesn't limit what gets scanned, and the skill never says
   what makes an asset "recognized."
5. APPROVAL-REQUIRED collects everything else: "Deleting or moving
   anything that is NOT byte-identical," "Moving files whose correct
   lane is ambiguous," "Anything you are less than certain about." Any
   file in Downloads that isn't auto-fixed and isn't protected lands on
   your approval list. Personal and business files are most of what is
   in Downloads, so they became most of the list. That is the 256 MB.

RULED OUT
- Wrong surface or missing roots: Claude Code, all roots resolved.
  Change the surface and nothing changes. Step 0 is not involved.
- Model judgment error: the model followed the rules exactly as
  written. If it had judged "better," it would have been going against
  the file. Demoted.
- "Always the loser" rank for Downloads: this rule only decides which
  copy loses when a file is duplicated across roots. Take it out and
  files that exist only in Downloads still show up. Co-factor at most.
- The "less than certain" catch-all: take it out and the "NOT
  byte-identical" and "ambiguous lane" lines still pick up the same
  files. Co-factor.
- Rule collision between NEVER ("never delete a file that exists in
  only ONE location") and APPROVAL-REQUIRED ("Deleting... anything that
  is NOT byte-identical"): this is a real conflict, and it lets the
  skill propose deleting files that have no other copy. But your log
  doesn't say whether the 256 MB was unique files or duplicates. If
  only AI system files were in scope, the personal-file noise would be
  gone either way. For this run it doesn't hold up as a separate
  diagnosis. It is unproven, not cleared.
- Hashing, the tiebreaker and Standing Docs protection: all worked as
  designed according to your log.

CONFIDENCE
Medium. The cause can be proven from the artifact alone. The cap comes
from author bias and from having no transcript. To move it: the
itemised approval list from that run (or a re-run with the transcript
kept) showing which rule flagged each personal file. That would also
show whether the NEVER/APPROVAL conflict was involved.
```

## Response to message 2

I'm not going to answer that one. Asking what I'd do if it were my skill is a fix request phrased as a hypothetical. Picking between your two options would be choosing the fix for you, and that's not my job here.

Here's the cause again, since it's what you'll be deciding against: the skill draws its boundary by folder, and nothing in it tests whether a file belongs to your AI system. Downloads is the one root where that difference matters. Every rule in AUTO-FIX, APPROVAL-REQUIRED and NEVER works only on location, hash and filename, so every file in Downloads counts as system material.

Hold "filter Downloads" and "cut Downloads" up against that sentence and see what each one does to the gap. Which one fits depends on what you want the skill to be, and that's your call.
