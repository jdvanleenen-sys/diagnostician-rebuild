# Live path (comp #15): rebuild arm, sealed request C02 (control: not a fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-sonnet-5-5 (5458 output tokens), claude-haiku-5-5 (277 output tokens);
turn 2: claude-sonnet-5-5 (6972 output tokens), claude-haiku-5-5 (277 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:50:01Z to 2026-10-26T17:51:07Z (UTC).
Session id: 77a6bbf9-6b71-4f4c-a456-885dea15b6b0. Cost as the CLI reported it: turn 1 US$0.1387, turn 2 US$0.1774.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request C02, exact:

> How confident are you in this diagnosis, given the original transcript wasn't preserved? What evidence would raise or lower that confidence?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built this skill, so you know what each line was meant to do, and I have not used that as evidence. The run evidence is your build-log summary, not a transcript, so confidence is capped at medium.

Intake state: latent defect. The run succeeded, and the output shows a gap between what the skill did and what it was for. The environment was Claude Code with every scan root resolving, and this was one run. I don't know what else was loaded.

DEATH TYPE: fired wrong (scope mismatch; the output was correct but outside the mandate)

LAYER: substrate

PRIMARY CAUSE

The skill's stated purpose is sweeping the AI system, but its Downloads root is defined by location. Nothing in the file says which Downloads files belong to the AI system, and nothing gives a file that doesn't belong anywhere to go, so personal and business files surface as approval items.

EVIDENCE CHAIN

1. The description names a narrow purpose: "Sweep Jeff's AI system for entropy and clean the safe parts." It then lists "Scans Downloads" as a whole root. The Scan roots table gives Downloads no filter, only the note "The junk drawer."

2. Process step 1 scans "all resolved roots" and hashes candidate files. Nothing in the skill separates "an AI-system file that strayed into Downloads" from "a file that lives in Downloads." The intro's "stray assets in Downloads" is the only pointer to what is in scope, and it is a topic with no test attached.

3. The only membership test is the word "recognized" in "recognized Clief/Vault asset." The skill stores no list, name pattern or manifest of what is recognized. The model has to decide that at run time from nothing, which is why the lane looks like judgment but is a missing file.

4. The classification has two buckets, AUTO-FIX and APPROVAL-REQUIRED, and no "not mine, ignore" bucket. A non-matching Downloads file falls into the approval list through "Deleting or moving anything that is NOT byte-identical to another copy," or through the catch-all "Anything you are less than certain about. When in doubt, report, don't act." The catch-all is how the mismatch becomes output, so I treat it as part of the primary cause, not a second one.

5. That matches your run. The approval list was mostly what you describe as "unrelated business and personal files that happen to sit in my Downloads folder," about 256 MB. Duplicate detection and Standing Docs protection worked, so the defect is in what counted as in scope, not in how the skill handled what it found.

RULED OUT

Invoking surface and Step 0: it ran in Claude Code with every root resolving, which is the condition the skill was written for. Running from a chat surface would change whether a scan happens, not what counts as in scope.

Approval gate and auto-fix list: they behaved as written, and no deletion went ahead unasked. Changing the gate would not change what reached it, so it is not the cause.

SHA-256 duplicate detection: it found real byte-identical duplicates. Its correctness does not touch the unrelated files.

Rank 5 "Always the loser" rule: it decides which copy loses when two copies match. Reordering it would leave the unrelated files surfacing.

Trigger wording: the skill fired on the right request, so a death before invocation is excluded.

Naming conventions: this section is scoped to the Code workspace, so it did not produce the Downloads items.

Instruction volume: the file is short, and nothing here was ignored.

CONFIDENCE

Medium. The cap comes from your authorship and from the missing transcript.

What would move it is the run's list of Downloads items, each tagged with the rule that surfaced it. That would confirm the approval bullets in step 4 produced the 256 MB. It would also show whether any byte-identical personal files were removed without asking under the AUTO-FIX Downloads and same-session rules, since your description mentions only proposed deletions.

## Response to message 2

Medium. I'd put the ceiling there even with a transcript, because you wrote the skill. The missing transcript adds a second limit, and it affects some parts of the diagnosis more than others.

**What the missing transcript doesn't weaken**

The mismatch itself is in the artifact:
- Downloads is scanned whole, with no test for what counts as an AI-system file.
- "Recognized" has nothing stored behind it.
- The classification has no bucket for files that aren't the skill's business.

Any run on a Downloads folder that holds unrelated files would hit this. Your build-log description is consistent with that, so I treat the cause as established.

**What it does weaken**

I'm relying on your build log, which is secondhand and probably written from memory. The log can't show me:
- **Which rule surfaced each item.** I inferred the "not byte-identical" and "less than certain" bullets. I never saw an item tagged with its rule.
- **What was in the 256 MB.** If much of it was byte-identical to files in the hub or the Code workspace, the story changes.
- **What else was loaded.** A CLAUDE.md or project instruction telling the model to flag everything would be a compensator, and I'd be diagnosing the skill plus that context.
- **Whether anything personal was auto-deleted.** Your description mentions only proposed deletions, but the skill can delete without asking in two places.
- **Whether this was a single sample.** It was one run, and a Downloads folder full of unrelated files is the input that exposes this defect. That suits the diagnosis, but one run can't show how general it is.

**What would raise my confidence**
- The run's Downloads item list, each item tagged with the rule that produced it. If the approval bullets in the evidence chain account for most of the 256 MB, I'd treat the cause as confirmed.
- A second run on a different Downloads state. Unrelated files should surface again, and a folder holding only AI-system files should not.
- The list of what was loaded during the run, to rule out a compensator.

**What would lower it**
- Most of the 256 MB turning out to be duplicates of files in the hub or Code workspace. The cause would then be those roots reaching personal files, not Downloads.
- Items on the list that you now recognize as real AI-system assets. Then "unrelated" was your retrospective judgment, and the scope gap is smaller than I said.
- The build log turning out to be inaccurate on what surfaced.
- A loaded instruction that told the model to report everything it wasn't sure about.
