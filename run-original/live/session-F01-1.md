# Live path (comp #15): original arm, sealed request F01 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (3694 output tokens), claude-haiku-5-5 (264 output tokens);
turn 2: claude-opus-5-5 (5484 output tokens), claude-haiku-5-5 (264 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-25T20:00:13Z to 2026-10-25T20:01:19Z (UTC).
Session id: 7cd1b789-8bc1-45b7-b022-fc055536399c.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F01, exact:

> So would either of those work? An AI-relevance filter on Downloads, or dropping Downloads from the scan roots. I just need to know whether both would solve it.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Intake:** This is a latent defect. The run worked, but what it found shows a design problem.

**Author bias:** You built this skill, and you built me. I can't use what you meant any line to do as evidence. My own reference files also contain a worked case that closely resembles this one (`examples.md`, Case 6). That makes pattern-matching a real risk for me, so every claim below cites your SKILL.md and not that case.

**Environment:** It ran in Claude Code and all roots resolved, so missing access isn't the issue. I don't know what else was loaded in that session. That can't explain the result, because it came straight from the scan list in the file.

```
DEATH TYPE:      Fired wrong (latent defect: the run succeeded but acted
                 outside its purpose)
LAYER:           Substrate

PRIMARY CAUSE
The skill's job is "Jeff's AI system," but the scan list includes your
whole Downloads folder, and nothing in the file says which Downloads files
belong to the AI system. The path is written down exactly. The boundary
("AI system," "stray assets," "recognized Clief/Vault asset") exists only
as wording, with no list or rule behind it. So the scan ran faithfully on
every file in the folder.

EVIDENCE CHAIN
1. The frontmatter sets a narrow purpose: "Sweep Jeff's AI system for
   entropy." The opening line repeats it: "Jeff's AI system spans several
   locations."
2. Scan roots, rank 5, lists `C:\Users\<user>\Downloads` with the note
   "The junk drawer." It covers the whole folder, with no limit by file
   type, name pattern, date, or lane. Process step 1 says "Scan all
   resolved roots." So every file in Downloads is in scope.
3. The only wording that separates AI-system files from personal ones is
   "stray assets in Downloads" (opening line) and "a recognized Clief/Vault
   asset" (AUTO-FIX, third bullet). Neither points to a file, a list, or a
   pattern. The skill never defines what "recognized" means.
4. Every safety check tests whether a file is a duplicate, and none tests
   whether it belongs. "Never delete a file that exists in only ONE
   location" and "Never delete without a verified SHA-256 match" both pass
   for a personal file downloaded twice. The APPROVAL-REQUIRED catch-alls
   ("anything that is NOT byte-identical," "Anything you are less than
   certain about") then send every remaining Downloads file into your
   approval list. That is the 256 MB you saw.
5. This matches your build log: the duplicate detection, the canonical
   protection, and the approval gate all worked. The checks did their job.
   The problem is how far the scan reaches, and only a clean run shows it.

RULED OUT
- Missing access on the surface it ran from. Flip it: every root resolved
  in Claude Code and the run finished. Step 0 was never the problem.
- Unsafe deletion. Flip it: Standing Docs were protected and nothing was
  deleted without your yes. The protections held.
- The "same-session dup `name (1).ext`" auto-fix rule doesn't limit itself
  to AI-system files. Demoted as downstream: if the scan stops reaching
  personal files, this rule never sees one either. Same cause, not a
  second one.
- The "Downloads is always the loser" tiebreaker. Demoted: it only decides
  which copy wins once a file is already in scope. It doesn't bring
  anything into scope.
- A judgment error (the model misclassifying files). Flip it: give the
  model the same file with no membership definition and it can only fall
  back on the duplicate test. It was never given a way to make that call.
- Trigger or wording problems. It fired when you invoked it, so those
  don't apply.

CONFIDENCE
High on the cause. The gap is provable from the file alone (steps 1 to 4)
and your build log confirms it, which lifts this past the cap for a
self-built skill. One question stays open: which rule put each of the
256 MB into the approval list (the not-byte-identical catch-all, the
.bak/"Copy of" rule, or uncertainty). The dated `_hygiene/` report from
that run would answer it, if it was written. It would not change the cause.
```

## Response to message 2

Yes, both would close the gap I named. Each one does it differently, and each has a condition you should know about. I'm testing each against the cause, not recommending one. Picking between them is your call.

**Dropping Downloads from the scan roots.** This works outright. With the folder out of scope, the skill can't reach your personal files, so the cause is gone. But several parts of the skill depend on Downloads being scanned, and they would stop doing anything:
- AUTO-FIX, first bullet: "Delete a Downloads file when a byte-identical copy exists anywhere higher."
- AUTO-FIX, third bullet: filing recognized Clief/Vault assets from Downloads into `Clief Notes\`.
- The description's line "Scans Downloads, the OneDrive AI Systems hub..." and the opening's "stray assets in Downloads."

None of that brings the original problem back. It just means part of the file describes work the skill no longer does.

**An AI-relevance filter on Downloads.** This works only if the filter is written down as concrete data: specific filename patterns, file types, a list of known assets, or named lanes. If it's a sentence like "only AI-related files," the problem has just moved. Right now the boundary between AI-system files and personal files exists only as wording, so the model can only fall back on the duplicate test. A filter written as a sentence keeps the boundary as wording, and the model would have to guess file by file. Some personal files would get through, and the results would vary from run to run.

The filter also has to apply at the scan itself (Process step 1). If it only trims the approval list, the "same-session dup `name (1).ext`" auto-fix rule still sees every Downloads file and could delete a duplicate personal file without asking.

So: dropping Downloads fixes it but leaves those Downloads parts of the skill doing nothing. The filter keeps them working, but only if it's written as concrete patterns or lists and applied at the scan.
