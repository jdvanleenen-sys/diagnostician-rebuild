# Live path (comp #15): original arm, sealed request C01 (control: not a fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (4271 output tokens), claude-haiku-5-5 (302 output tokens);
turn 2: claude-opus-5-5 (5017 output tokens), claude-haiku-5-5 (302 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:18:21Z to 2026-10-26T00:19:19Z (UTC).
Session id: d4c436b1-4644-4de4-88fc-0b32b1905e09.
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

**Author bias:** You wrote this skill, so I've capped confidence at medium. Your stated intent ("I did not build it to police my personal downloads") is not used as evidence below. Whether you also built me doesn't change any of the evidence.

**Intake state:** Latent defect. The run succeeded and did what the text says; the problem is the gap between what it swept and what it is for. The environment was Claude Code with every root resolving, so the surface can be ruled out.

```
DEATH TYPE:      fired wrong (scope mismatch, latent)
LAYER:           substrate

PRIMARY CAUSE
The description says the skill sweeps "Jeff's AI system," but the scan
config adds the whole of C:\Users\<user>\Downloads as a root. Nothing in
the skill, as data, says which Downloads files belong to the AI system.
So "AI system" exists only as a phrase. The actual reach is a general-
purpose folder, and every file in it is in scope.

EVIDENCE CHAIN
1. Frontmatter description: "Sweep Jeff's AI system for entropy." That
   is the stated purpose. The same sentence then lists "Downloads" as a
   scan target with no qualifier.
2. Scan roots table, rank 5: the entry is the full Downloads path,
   labelled "The junk drawer." Unlike rank 3 ("Skip .git") and the
   Jeff's Brain row ("top level only"), it has no exclusion and no
   filter. It is the only root whose contents are mostly unrelated to
   the AI system.
3. Process step 1 says "Scan all resolved roots," and step 2 says
   "Classify every finding." No step admits a Downloads file into the
   findings only if it relates to ranks 1-4. Only the two AUTO-FIX
   bullets have a relational test (a byte-identical copy higher up, or a
   "recognized Clief/Vault" asset). "Recognized" is prose with no list
   behind it.
4. APPROVAL-REQUIRED catches whatever the auto-fix tests did not: "Deleting
   or moving anything that is NOT byte-identical to another copy" and
   "Anything you are less than certain about. When in doubt, report."
   Every unique personal or business file in Downloads lands here.
5. So the run did what the data told it to. The root path was literal,
   and it was copied faithfully. The boundary "AI system" was prose, so
   it never constrained anything. Result: about 256 MB of unrelated
   files came up for approval.

RULED OUT
- Wrong surface / missing roots (Step 0): every root resolved, and the
  partial-run path never ran. If you flip it, nothing changes.
- Hashing or duplicate detection: the byte-identical matches were
  correct by your account. If you flip it, the noise is still there,
  because most of it was not duplicate-driven.
- Standing Docs protection, rank tiebreaker: both worked. The tiebreaker
  only applies to duplicate pairs, and the noise came from files that
  were not duplicates.
- Model judgment / over-caution: "When in doubt, report" is an
  instruction, not a model choice. If the model had been more confident,
  the same unique files would still match the "NOT byte-identical"
  approval bullet.
- The "junk drawer" label: it frames the folder as disposable, but it is
  a co-factor. Remove the label and the approval rules in step 4 still
  pull in every Downloads file.
- Rule collision, NEVER ("Never delete a file that exists in only ONE
  location") vs APPROVAL-REQUIRED ("Deleting ... anything that is NOT
  byte-identical"): this is real, and it probably explains why the items
  were *deletions* rather than notes. But it shapes the verb, not the
  reach. If you resolve the collision, those files still surface as
  "move, lane ambiguous" items. It is downstream of the scope, so it is
  not a second diagnosis.
- Trigger/description vocabulary: it fired on the right request, so
  that's not the issue.

CONFIDENCE
Medium. Capped for author bias, and the run evidence is a paraphrase in
your build log, not a transcript. The mechanism itself can be proved from
the artifact. What would move it: the actual approval list with each
item's stated reason. If the 256 MB were mostly unique files tagged "not
byte-identical" or "ambiguous lane," this is confirmed. If they were
mostly `(1)`-style exact duplicates inside Downloads, a second mechanism
was involved: the same-session-dup auto-fix should have taken those
without asking, and I would want to see why it didn't.
```

## Response to message 2

Nothing. I can't read intent from that label, and the rules I work under bar me from trying. I only know what the text does when the model reads it, not why you wrote it. "The junk drawer" could mean "everything here is disposable," or "strays end up here, so this is the copy that loses," or just a joke. The row's next sentence supports the second reading ("a duplicate here is always the one to remove"), but that's still what the text says, not what you meant.

What the label tells me is how it reads to a model at runtime. It sits next to a root path with no filter, and it describes the whole folder as junk rather than describing which files in it are candidates. To a model deciding whether an unfamiliar PDF in Downloads is in scope, that wording leans toward yes. That's a claim about the instruction's effect, not your purpose.

Your question also shows a weakness in my evidence chain. In step 2 I quoted the label alongside the real point, and then in RULED OUT I demoted it to a co-factor. The load-bearing fact in step 2 is structural: rank 5 is the only mostly-unrelated root, and it has no exclusion or filter, while other rows do ("Skip `.git`", "top level only"). If you deleted the words "The junk drawer," step 4's approval rules would still pull in every unique file in Downloads. The label shouldn't be in the chain at all. The diagnosis doesn't change without it, but it's cleaner to drop it than to let it look like evidence of what you intended.
