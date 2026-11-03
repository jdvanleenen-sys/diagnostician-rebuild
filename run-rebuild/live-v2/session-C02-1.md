# Live path (comp #15): rebuild arm, sealed request C02 (control: not a fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (262 output tokens), claude-opus-5-5 (4919 output tokens);
turn 2: claude-haiku-5-5 (262 output tokens), claude-opus-5-5 (6487 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-11-03T04:13:58Z to 2026-11-03T04:15:11Z (UTC).
Session id: 485b96c8-7bd6-487f-9e3a-45522150f015. Cost as the CLI reported it: turn 1 US$0.2551, turn 2 US$0.3319.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request C02, exact:

> How confident are you in this diagnosis, given the original transcript wasn't preserved? What evidence would raise or lower that confidence?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

I'm declaring author bias first. You wrote this skill, so everything below comes from what the file does, not from what you meant it to do. You also built me, but that gives your account of the run no extra weight here.

This is the latent-defect case: the run worked, and the problem is the gap between what it did and what the skill says it is for. The line numbers below count from the opening `---` of the frontmatter.

DEATH TYPE: fired wrong (a clean run that did more than its stated purpose)

LAYER: substrate

PRIMARY CAUSE

The skill says its job is your "AI system", but it never defines which files belong to that system. It treats being inside a scan root as membership. That works for the four roots that hold only AI-system files. It fails for `C:\Users\<user>\Downloads`, where most files have nothing to do with the AI system, so the whole folder got swept as if it did.

EVIDENCE CHAIN

1. The description promises to "Sweep Jeff's AI system for entropy and clean the safe parts," and the body opens with "Jeff's AI system spans several locations" (line 8). Both state a boundary: AI-system files.
2. The Scan roots table (line 28) lists the whole Downloads folder as rank 5, with no file filter. Its only note is about which copy wins a tiebreak ("The junk drawer", "Always the loser"). Nothing in the table, or anywhere else in the file, says how to tell an AI-system file from an ordinary download.
3. Process step 1 (line 44) scans "all resolved roots". In Claude Code all five roots resolved, so step 0 sent the entire Downloads folder into the scan.
4. Step 2 (line 45) sorts "every finding as AUTO-FIX or APPROVAL-REQUIRED". There is no third option for out of scope. The only rule that recognizes an AI-system file is the "recognized Clief/Vault asset" auto-fix (line 54), which only decides where a file gets moved, not whether it should be scanned at all.
5. The approval list catches everything else: "Deleting or moving anything that is NOT byte-identical to another copy." (line 58) and "Anything you are less than certain about. When in doubt, report, don't act." (line 63). So every unrelated business or personal file it found in Downloads had nowhere to go except your approval list. That is the 256 MB you saw. The skill followed its own rules exactly, which is why nothing it did looked wrong.

RULED OUT

1. Surface or environment. All roots resolved and step 0 behaved as written. Running the same text on a surface where Downloads didn't resolve would hide the symptom without fixing the missing boundary. Environment didn't cause this.
2. A bad judgment call by the model. Flip it and assume perfect judgment: the rules still force every in-root finding into one of the two buckets, so the same files appear. Demoted.
3. Duplicate detection. Hashing, protecting rank 1 and asking before deleting all worked as written. Flipping them changes nothing about which files show up. Demoted.
4. The Downloads tiebreak (line 28). It only decides which copy survives. Flip it and unrelated files still surface. A co-factor at most.
5. The contradiction between line 58 and the NEVER rule "Never delete a file that exists in only ONE location" (line 67). Line 58 assumes non-duplicates can be proposed for deletion, while line 67 forbids deleting single copies. That contradiction is real, but resolving it one way or the other doesn't stop unrelated duplicate files in Downloads from surfacing. Whether it shaped this particular run depends on details the build log doesn't have.
6. Triggering, length and wording. The skill fired when it should have, and the over-wide scope is stated outright in the file, not buried in the middle. Demoted.

CONFIDENCE

Medium. The file alone shows the cause: Downloads is a full scan root with no membership filter and no out-of-scope bucket. Two things cap the rating. You wrote the skill, and the run survives only as your build-log summary, so there's no transcript to check against. What would move it is the actual approval list from that run. If the 256 MB was duplicate pairs inside Downloads, this verdict holds and confidence goes up. If some of those files had only one copy, then the skill also proposed deleting files its NEVER rules protect. That would be a second, separate failure in the line 58 and line 67 contradiction, and it would need its own diagnosis.

## Response to message 2

I'm at medium, and the number covers two claims that rest on different evidence.

**Claim 1: the file as written today scans every file in Downloads.** This is close to certain and doesn't depend on the transcript. Line 28 lists the whole folder as a scan root, line 44 scans "all resolved roots", and line 45 puts "every finding" into one of two buckets, neither of which means out of scope. Anyone can check this by reading the file.

**Claim 2: that mechanism produced the 256 MB in your run.** This is where the missing transcript hurts. All I have is your build-log summary, and you're the author, so the summary is already your interpretation of what happened. That's why the rating stays at medium even though the mechanism itself is clear.

**What would raise it**

1. **The dated report from that run.** Step 5 writes the report to `_hygiene\YYYY-MM-DD-hygiene.md` in the AI Systems hub, separately from the chat. Losing the transcript doesn't mean that file is gone. If it exists and its approval items are unrelated Downloads files sent there by the line 58 or line 63 catch-alls, the verdict becomes high.
2. **Proof that the file that ran is the file you pasted.** You gave me the skill "as it exists today." If it hasn't changed since the run, the diagnosis applies directly. If it has, I may have diagnosed a later version.
3. **A new run built to discriminate.** Put three test files in Downloads: an unrelated duplicate pair, an unrelated file with only one copy, and a known Clief asset. Correct scoping and the current scoping handle the first two differently. If the duplicate pair shows up in the approval list, the mechanism is confirmed by a run you can show me rather than a log entry.

**What would lower it, or change the verdict**

1. **Some of the 256 MB had only one copy.** Then the run proposed deleting files that the "Never delete a file that exists in only ONE location" rule (line 67) protects. That points at the line 58 and line 67 contradiction, or at the model breaking a rule, as a second failure with its own diagnosis.
2. **The unrelated files came from the OneDrive hub, not Downloads.** The underlying cause would still be that membership is never defined, but my evidence chain points at the wrong root and would need rewriting.
3. **Unrelated files were classed as Clief or Vault assets.** That would mean the "recognized Clief/Vault asset" call (line 54) went wrong. That's a judgment-layer problem, and step 4 of the chain would need to account for it.
4. **The skill file at run time differed in its scan roots or classification rules.** Then the verdict applies to today's file, not to that run, and the run itself can't be diagnosed from what we have.

The quickest thing to check is the first item under raising it: whether the `_hygiene` report from that date is still on disk.
