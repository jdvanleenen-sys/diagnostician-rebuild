# Live path (comp #15): original arm, sealed request C02 (control: not a fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (3815 output tokens), claude-haiku-5-5 (233 output tokens);
turn 2: claude-opus-5-5 (5693 output tokens), claude-haiku-5-5 (233 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:18:21Z to 2026-10-26T00:19:28Z (UTC).
Session id: 34450eb6-3727-41a1-a836-fa0105adbeb5.
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

**Author bias:** You wrote this skill, and you also wrote me. I can only cite what the artifact and your account of the run show, not what you meant the skill to do. The run is described from your build log, not from a transcript, so confidence is capped at medium.

**Intake state:** Latent defect. The run went fine on its own terms: hashes matched, Standing Docs were protected and nothing was deleted without asking. What went wrong is that it worked on files outside the skill's purpose.

**Environment:** Claude Code, with every scan root resolving, so Step 0 took the "All resolve" path. I don't know what else was loaded in context. It doesn't matter here, because the behaviour follows from the config alone.

```
DEATH TYPE:      fired wrong (scope mismatch; output correct, reach too wide)
LAYER:           substrate

PRIMARY CAUSE
The skill defines its purpose by subject ("Jeff's AI system") but its scope by
location (the whole Downloads folder). Nothing it carries tells an AI-system
file in Downloads apart from any other file there. So every file in Downloads
counts as system entropy and gets handed to you to decide on.

EVIDENCE CHAIN
1. The description and the opening line put the target at "Jeff's AI system."
   That is a subject boundary, and it is written only as prose.
2. Scan roots, rank 5: `C:\Users\<user>\Downloads` is listed as a whole root,
   labelled "The junk drawer. Always the loser." It has no filter, pattern or
   subfolder. In this table the scope is data, and the run followed it exactly.
3. The only place the skill defines an in-scope Downloads file is the AUTO-FIX
   bullet "a recognized Clief/Vault asset." "Recognized" is a word with no
   list behind it. The skill ships no manifest, extension set or naming
   pattern, so being part of the AI system was never stored anywhere the run
   could check.
4. Process Step 2 says "Classify every finding as AUTO-FIX or
   APPROVAL-REQUIRED." There are only two buckets and no "out of scope"
   bucket. A business PDF found in Downloads has nowhere to go but the
   approval list.
5. The APPROVAL-REQUIRED rules then catch those files: "Deleting or moving
   anything that is NOT byte-identical," the "Copy of" rule, and "Anything
   you are less than certain about." That is the ~256 MB of personal and
   business files. The skill did what it says. What it says covers more than
   it is for.

RULED OUT
- Wrong surface or missing roots: all roots resolved, which is what you want
  here. If they hadn't, the run would have been partial, and the personal
  files would still have shown up whenever Downloads resolved.
- Hash or duplicate detection errors: you report the byte-identical matches
  were right. If detection were perfect, the noise would remain.
- Broken safety rules: Standing Docs were protected and nothing ran without
  approval. These guards worked; they just aren't the scope boundary.
- Model judgment: given these rules, putting the files up for approval is the
  correct call. A smarter model would surface the same items, because the
  skill gives it no grounds to exclude them.
- "Downloads is always the loser" tiebreaker: a co-factor. It decides which
  copy loses, not what gets scanned. With it removed, the files still appear.
- The "less than certain, report" catch-all: amplifies the noise but doesn't
  cause it. With it removed, the "NOT byte-identical" rule still surfaces
  the same files.
- Description and triggers: it fired when it was supposed to, so these
  aren't involved.

CONFIDENCE
Medium. The cause can be read straight off the config, but the run evidence is
your secondhand summary, and the author-bias cap applies. What would move it:
the approval list from that run, item by item, showing which rule surfaced
each file. If the personal files all came from the Downloads root through the
rules in step 5, this goes to high. If a meaningful share came from another
root, say the Code workspace or the hub, there is a second failure and this
diagnosis covers only part of it.
```

## Response to message 2

**Still medium.** That has two parts, and they deserve different levels of confidence.

**What the artifact alone proves (high).** The scan roots table lists all of `Downloads` with no filter. Step 2 has two buckets and nowhere to put an out-of-scope file. Nothing defines what a "recognized Clief/Vault asset" is. Any run with all roots resolving will offer your unrelated Downloads files for approval. None of that needs the transcript.

**What I'm inferring (medium).** That this mechanism produced *that specific* 256 MB on *that* run. My only evidence for the run is your build log, which has two weaknesses:

- **It's a summary written by the author.** "Nothing it did was wrong" is your judgment, recorded by the person who built the skill. The author-bias cap applies to the evidence as well as to you.
- **It may describe a different version of the skill.** You gave me the skill "as it exists today." If you edited it after the run, my evidence chain cites lines the run may never have seen. I don't know the run date or the skill's edit history.

**What would raise it to high:**

1. **The dated report from that run.** Step 5 writes `...\AI Systems\_hygiene\YYYY-MM-DD-hygiene.md` on every run. The transcript is gone, but that file may not be. If its approval list shows the personal files coming from the Downloads root through the "NOT byte-identical" or "Copy of" rules, the run backs the diagnosis directly.
2. **Proof the skill hasn't changed since the run.** A file timestamp, version history, or build-log entry showing the scan roots table and Step 2 read the same at run time as they do now.
3. **A run that could tell the two cases apart.** Put a known personal duplicate pair and a known AI asset in Downloads, then run it. It should surface the personal pair alongside the asset. A second run with Downloads removed from the roots should see the noise disappear. Same skill, one variable flipped: that's the inversion test done for real instead of argued. (This is a probe, not a recommended fix.)

**What would lower it:**

- **The noise came from somewhere else.** If a meaningful share came from the OneDrive hub or the Code workspace, the Downloads diagnosis only covers part of it. The hub sits under your work OneDrive `Documents`, so business files living there is plausible. That would be a second failure, and I'd diagnose it separately.
- **The skill that ran already filtered Downloads.** If that run's version had a filter that was later removed, today's artifact isn't the thing that failed, and I've been diagnosing the wrong version.
- **The items didn't map to any listed rule.** If the approval items don't trace to any rule in the APPROVAL-REQUIRED list, the model improvised its own criteria. That points at a secondary judgment-layer problem, and the primary cause would need another look.

If that hygiene report still exists, it's the single piece of evidence most worth finding. I can read it if you point me to it.
