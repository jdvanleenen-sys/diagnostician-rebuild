# Live path (comp #15): original arm, sealed request C02 (control: not a fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (5089 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (6720 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:18:21Z to 2026-10-26T00:19:36Z (UTC).
Session id: 70e3673d-8a1c-4707-b453-c4091926327c.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request C02, exact:

> How confident are you in this diagnosis, given the original transcript wasn't preserved? What evidence would raise or lower that confidence?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias.** You built this skill, and you also built the framework I diagnose with. That framework's own reference file says "scope mismatch" is the usual cause in this situation, so the method could be leaning toward the answer below. I tested that cause with the inversion step on its own merits rather than taking the label on trust. Separately, the original transcript is gone, so I can't point at the run itself. Under the rules, that caps confidence at medium.

**Intake state:** latent defect. The run succeeded, but what it produced shows the skill reaches further than its stated purpose. Every root resolved, so the problem isn't the surface it ran on.

```
DEATH TYPE:      fired wrong (latent defect: correct execution, out-of-mandate reach)
LAYER:           substrate

PRIMARY CAUSE
The skill says its job is "Jeff's AI system" (description line 3, body
line 8), but its scan set includes all of C:\Users\<user>\Downloads
(line 28). That folder is mostly not AI-system material, and the skill has
no rule for telling which Downloads files belong to the AI system and which
don't. The purpose boundary exists only as a phrase, while the reach is a
literal folder path, so the path is what the run actually followed.

EVIDENCE CHAIN
1. Line 28 adds Downloads as a whole folder, with no filter. Its note
   ("The junk drawer. Always the loser") only decides which copy loses when
   two are identical. It says nothing about whether a file belongs in the
   sweep at all.
2. Step 1 (line 44) scans "all resolved roots" and Step 2 (line 45) says to
   classify "every finding." So every file in Downloads, including your
   business and personal files, becomes a finding the model has to sort.
3. The only rules that recognize Downloads files as AI-system material are
   narrow: a SHA match against a higher-ranked root (line 52) or a
   "recognized Clief/Vault asset" (line 54). A personal invoice meets
   neither test, but nothing excludes it either.
4. Anything that doesn't fit lands in the catch-all on line 63: "Anything
   you are less than certain about... report, don't act." For a file the
   skill gives no way to classify, uncertainty is the correct state. So
   the approval list fills up with unrelated files. The model did what the
   skill told it to; you got about 256 MB of personal files proposed for
   deletion.
5. Contrast: line 72 limits the naming checks to "(Code workspace)", so
   the skill does limit some checks to one root. No similar limit is
   applied to what counts as a stray in Downloads. The data test shows
   the split: the folder path came through intact, and the purpose
   boundary, written only in prose, had no data to back it up.

RULED OUT
- Judgment error in classification. Invert it: give the model perfect
  judgment with the same skill and the personal files still come up for
  approval, because line 63 tells it to route anything it can't classify to
  the approval list. Demoted.
- Surface or substrate absence (Step 0). Every root resolved; the
  environment rule doesn't apply here. Not in play.
- Safety rules (NEVER section, SHA-256 gate, approval before acting). Flip
  them and the scope problem stays the same; they're why this was noise
  and not damage. They held, so they're not the cause.
- "Always the loser" ranking (line 28). Remove it and the personal files
  are still scanned and still reach the approval list. Co-factor at most.
- The auto-fix rules for same-session duplicates (line 53) and empty
  directories (line 55). Both apply "anywhere in the scan set," so they
  can act on personal files in Downloads without asking. That's the same
  cause showing up as an unsafe-at-scale risk, not a second cause. Fix the
  primary and it goes away.
- Instruction volume and rule collision. The file is short, and the
  auto-fix and approval lists don't conflict. Demoted.
- Description and trigger problems. It fired when it was supposed to.
  Not this kind of failure.

CONFIDENCE
Medium. Capped by author bias and the missing transcript. The cause can
be shown from the skill text alone, so the open question is how much of
the 256 MB came from which rule, not whether this is the cause. The
evidence that would move it: the dated report the run should have written
to AI Systems\_hygiene\YYYY-MM-DD-hygiene.md under Step 5 (line 48). It
would show which bucket each Downloads item fell into and whether any
personal files were auto-fixed under line 53 or 55 without approval.
```

## Response to message 2

Medium. That rating covers two separate questions, and the missing transcript affects only one of them.

**What the skill text proves on its own: high.** Line 28 adds all of Downloads, no step limits it, the only Downloads rules apply to SHA matches or Clief/Vault assets, and line 63 sends anything unclassified to the approval list. Personal files in that folder will be surfaced every time, on any run. That doesn't depend on the transcript.

**Whether that's what produced your 256 MB: medium.** Three things hold it there:

- **No run I can point at.** Your build log is your own summary of the run, written by the person who built the skill. It isn't the run's output.
- **Author bias, twice over.** You wrote the skill, and you wrote the framework that steered me toward "scope mismatch." My inversion test supports the cause, but it was run inside a framework built by the same person.
- **One run.** I can't tell whether this happens every time or depended on what was in Downloads that day.

**What would raise it:**

1. **The Step 5 report** (`AI Systems\_hygiene\YYYY-MM-DD-hygiene.md`). This is the strongest evidence, and it may exist even though the transcript doesn't. If the approval items are mostly Downloads paths with no matching copy in any ranked root, filed under line 58 or the line 63 catch-all, the cause is confirmed. I tried to look for it just now, but the read permission for your user folder wasn't granted, so I haven't seen it.
2. **A test run that can tell the causes apart.** Seed a Downloads-like folder with a few clearly personal files, a few real Clief assets, and one exact duplicate of a hub file. Run the skill against it with nothing extra in context. If the personal files reach the approval list and the scoped files behave correctly, that's a direct reproduction.
3. **Context from the original session.** Knowing what else was loaded (CLAUDE.md, memory, other skills) would tell me whether anything pushed the run wider or narrower than the skill alone would.

**What would lower or overturn it:**

- **The 256 MB came mostly from other roots**, such as the hub or the Code workspace. Then the Downloads scope isn't the cause, and I'd need to look again.
- **The flagged files were actually AI-system files** that you consider personal, such as client deliverables made with Claude. Then the scope is fine and the question becomes how files get classified, which is a different diagnosis.
- **A clean test run.** If the seeded run doesn't surface the personal files, something in the original session's context, not the skill text, widened the reach.

One finding would raise the stakes without changing the cause. If the report shows personal files were auto-fixed under line 53 (same-session duplicates) or line 55 (empty folders), files were deleted without asking. That would make this more serious than noise.

If you grant read access to that `_hygiene` folder, I'll check the report.
