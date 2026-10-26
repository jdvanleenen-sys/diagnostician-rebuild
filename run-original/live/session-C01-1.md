# Live path (comp #15): original arm, sealed request C01 (control: not a fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (4569 output tokens), claude-haiku-5-5 (407 output tokens);
turn 2: claude-opus-5-5 (5519 output tokens), claude-haiku-5-5 (407 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:18:21Z to 2026-10-26T00:19:22Z (UTC).
Session id: 39858993-0383-4aa6-85ee-ab525f6b57f5.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request C01, exact:

> In your evidence chain, you point at the Rank 5 row calling Downloads "the junk drawer". What exactly does that tell you about what I intended the skill to do?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You built this skill, and you built me. I'll treat what you meant each line to do as background only, never as evidence. The run is known only from your build-log summary, not a transcript I can check, so confidence is capped at medium.

**Intake state:** Latent defect. The run worked as designed, and what it produced shows a design problem: the skill reached further than its purpose. Environment: Claude Code, every root resolved, so Step 0's "all resolve" branch ran. You haven't described any other context that would have filled a gap or caused one.

```
DEATH TYPE:      fired wrong (scope mismatch, latent defect intake)
LAYER:           substrate

PRIMARY CAUSE
The skill's purpose ("Sweep Jeff's AI system for entropy") is a boundary
held only in prose. Its scan set is stored as data: an entire
general-purpose folder, `C:\Users\<user>\Downloads`. Nothing in the skill
separates an AI-system file from any other file in that folder. So the
scan covered your personal and business downloads as well as AI files.

EVIDENCE CHAIN
1. Scan roots table, Rank 5: Downloads is listed as a whole root, with no
   file-type, name-pattern or allowlist filter. Every other root is an
   AI-specific location (the hub, the workspace, skills). Downloads is the
   one root whose contents are mostly not your AI system.
2. That row's own note, "The junk drawer. Always the loser", and the
   opening line that counts "stray assets in Downloads" as entropy, tell
   the model that anything in Downloads is a disposal candidate. They give
   a ranking (which copy loses), not a membership test (which files count).
3. The only filter that refers to AI files at all is AUTO-FIX bullet 3,
   "a recognized Clief/Vault asset". "Recognized" points to no list or
   pattern, so the AI-versus-not-AI distinction exists nowhere as data.
4. APPROVAL-REQUIRED catches everything else: "anything that is NOT
   byte-identical", ".bak / Copy of", and "Anything you are less than
   certain about". Every Downloads file that auto-fix didn't handle falls
   through to the approval list. A personal PDF with a "(1)" twin or a
   "Copy of" name qualifies just as an AI asset would.
5. The data test: the stored data (paths, SHA-256 rule, rank tiebreaker,
   Standing Docs protection) came through intact, as you report. The prose
   boundary ("AI system") was not applied, because nothing turned it into
   a rule the scan could check. Result: about 256 MB of unrelated files
   were proposed for deletion.

RULED OUT
- Model judgment error in classification. If classification were perfect,
  personal files would still be in the scan set, and the "less than
  certain -> report" catch-all would still send them to approval. Still
  fails. Demoted.
- Surface/environment (Step 0). Every root resolved and the run behaved as
  the "all resolve" branch says. A different surface would change nothing
  here. Ruled out.
- Hash and tiebreaker logic. Duplicates were truly byte-identical and
  Standing Docs stayed protected. Working as stored. Not involved.
- NEVER rule "no duplicate = not a stray" governs deletion, not proposals.
  Extending it to proposals would still let duplicated personal files
  through (two copies of the same invoice in Downloads). Still fails. It
  also disappears once Downloads is scoped, so it is downstream. Demoted.
- Broad trigger phrases in the description ("clean up my files"). These
  decide when the skill fires, not what it scans. The skill was invoked as
  intended, and changing the phrases leaves the scan set as it is. Still
  fails. Demoted.
- Instruction volume / rule collision. The file is short and no two rules
  conflicted in this run. Not in play.

CONFIDENCE
Medium. The cause shows up in the skill text itself (an unfiltered
general-purpose root against an AI-only purpose), but the cap applies
because you are the author and the run exists only as a build-log
summary. What would move it: the actual approval list from that run, or
from a re-run. It would show which rule sent the personal files to
approval (near-duplicate, ".bak / Copy of", or the plain "Downloads is
the junk drawer" framing) and whether any single-copy files were
proposed.
```

## Response to message 2

It tells me nothing about your intent, and I shouldn't treat it as if it did. I can't know why you wrote "the junk drawer." I can only say what those words give the model at run time. You may have meant it as a joke, a note to yourself, or a real instruction. All three read the same in the file, and the model doesn't know which you meant either.

Rereading step 2, I made two claims in one sentence, and they don't have the same strength:

- **"Always the loser"** has an explicit scope. The note goes on to say "a duplicate here is always the one to remove." It decides which copy of a duplicate loses. It does not mark every Downloads file for disposal, and it should not be cited as evidence that it does.
- **"The junk drawer"** has no scope. It's a label for the whole folder with no rule attached. Saying it led the model to treat everything in Downloads as a disposal candidate is my inference about how the model read it, not something I can see in the run. Without the transcript I can't show that the label shaped what the model proposed.

So step 2 is the weakest link in the chain, and I stated it more firmly than the evidence supports. It's background, not a step the diagnosis depends on.

The primary cause doesn't depend on it. Take the label out entirely:

- Step 1 holds: Downloads is still an unfiltered general-purpose root.
- Step 3 holds: there's still no stored test for what counts as an AI-system file.
- Step 4 holds: the catch-all approval rules still send every personal file that auto-fix didn't handle to the approval list.

Even if the row read only "Downloads," the personal files would still have reached the approval list. Confidence stays at medium. The thing that would settle step 2 is the same item I named before: the run's actual approval list, showing which rule sent each personal file there.
