# Live path (comp #15): original arm, sealed request F05 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-sonnet-5-5 (3356 output tokens), claude-haiku-5-5 (201 output tokens);
turn 2: claude-sonnet-5-5 (4498 output tokens), claude-haiku-5-5 (201 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:46:38Z to 2026-10-26T17:47:21Z (UTC).
Session id: 57bbb410-bf4d-479e-9221-cb42d786a415. Cost as the CLI reported it: turn 1 US$0.1101, turn 2 US$0.1376.
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

**AUTHOR BIAS:** You built this skill, so you know what each line was meant to do, and that can hide what it actually does. Your remark that you also built me doesn't change this, because I'm diagnosing the skill and not my own rules. The run is only described from a build log and the transcript is gone, so confidence is capped at medium. I'm treating your intent as no evidence.

**INTAKE STATE:** Latent defect. The run succeeded, but the output shows scope wider than the stated purpose and is mostly noise.

**DEATH TYPE:** Fired wrong. It was invoked correctly, and the output was mostly unusable noise.
**LAYER:** Substrate

**PRIMARY CAUSE**
The skill's purpose is sweeping "Jeff's AI system" (opening paragraph), but its reach is the whole Downloads folder, which is mostly not that system. The skill carries no test for whether a Downloads file belongs to the AI system. So every Downloads file that isn't a verified duplicate lands in the approval buckets.

**EVIDENCE CHAIN**
1. The scan-roots table puts `C:\Users\<user>\Downloads` at rank 5 and scans it whole. The note says "The junk drawer. Always the loser." That defines Downloads by what it is (a dumping ground) and not by what in it belongs to the system.
2. Auto-fix applies only to a byte-identical duplicate, a `(1)` copy, or a "recognized Clief/Vault asset". "Recognized" is never defined, because no file list, naming pattern, or manifest of AI-system assets exists in the skill. Anything else in Downloads is unclassifiable.
3. The approval-required list has catch-alls with no ownership filter: "Deleting or moving anything that is NOT byte-identical to another copy," "Moving files whose correct lane is ambiguous," and "Anything you are less than certain about." An unrelated business or personal file is uncertain by definition, so it routes to your approval checklist.
4. The skill states its own noise limit nowhere: no cap, no grouping, no "out of scope" bucket. The output format says "Keep it scannable" but has no outcome for "not mine".
5. The result matches the run: no wrong deletions (the NEVER rules held), and a roughly 256 MB checklist of files the skill had no basis to claim.

**RULED OUT**
- **Safety rules failed.** Standing Docs were protected and nothing was deleted without approval. Flip the NEVER list and the noise is unchanged, so it's not the cause.
- **Step 0 surface check.** All roots resolved, and a partial-run fallback would not have changed what Downloads contributed.
- **SHA-256 matching or tiebreaker logic.** These worked, since duplicates were found correctly. The surfaced files weren't mismatches of this logic, they were files it had no rule for.
- **The catch-all "when in doubt, report" rule.** This is downstream. With a membership test in place, it would stop producing the noise. It does not independently fail, so it is not a secondary cause.
- **Vague description or instruction volume.** The description is specific and the file is short. Neither explains why unrelated files appeared.
- **Judgment error by the model.** It applied the rules as written. The inputs it was given were the problem, not its reasoning.

**CONFIDENCE**
Medium. The cause is provable from the artifact: reach is the whole folder and no rule excludes non-system files. What would raise it is the actual approval list from that run, with each item tagged by which rule produced it. That would show how much of the 256 MB came from the non-duplicate catch-alls versus same-folder duplicates, which the tiebreaker doesn't cover. It would also show whether anything in the list was a real system file. A second run where Downloads holds only system files would be the contrasting input, since it should come out clean.

## Response to message 2

Filter, and keep it narrow. This is a separate request from the diagnosis, so it's a recommendation and not a finding.

For Downloads, report only files whose SHA-256 matches a file in a higher-ranked root. Everything else in Downloads goes unreported and isn't treated as in scope. That needs no definition of what belongs to your AI system, so you can finish it today.

I'd pick this over dropping Downloads because dropping it removes the one part of the run that worked: finding duplicates of your canonical files. The filter keeps that and cuts the noise.

Two caveats:
- **The Clief filing rule stays unreliable.** "Recognized Clief/Vault asset" is still undefined, so that rule remains the weakest part of Downloads handling. It needs either a defined list or to be left out of the first ship.
- **My diagnosis was medium confidence, and I haven't seen the fix run.** Re-run it against the same Downloads folder before you ship. If the approval list is still large, the 256 MB came from somewhere other than the non-duplicate catch-alls, and I'd want to see that list.
