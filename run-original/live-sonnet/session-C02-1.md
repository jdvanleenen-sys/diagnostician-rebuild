# Live path (comp #15): original arm, sealed request C02 (control: not a fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-sonnet-5-5 (3841 output tokens), claude-haiku-5-5 (246 output tokens);
turn 2: claude-sonnet-5-5 (4898 output tokens), claude-haiku-5-5 (246 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:50:01Z to 2026-10-26T17:50:45Z (UTC).
Session id: 0d3be1af-c78a-442f-b803-0826ac60e03a. Cost as the CLI reported it: turn 1 US$0.1197, turn 2 US$0.1481.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request C02, exact:

> How confident are you in this diagnosis, given the original transcript wasn't preserved? What evidence would raise or lower that confidence?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You built this skill, so your account of what it was "meant" to do is not evidence. I also have no transcript, only your build log of one run. That caps confidence at medium.

**Intake state:** Latent defect. The run succeeded and the output reveals a gap between what the skill did and what it was for.

**Environment as I have it:** Claude Code, all five scan roots resolved, one run. I don't know what else was loaded or whether it has run before.

```
DEATH TYPE:      fired wrong (scope mismatch, with correct-looking output)
LAYER:           substrate

PRIMARY CAUSE
The purpose is "entropy in Jeff's AI system", but the scan set includes
Downloads, a general-purpose folder, and the skill defines that root by
location, not by content. Nothing in the file says what makes a
Downloads file part of the AI system, so every file there is in scope.

EVIDENCE CHAIN
1. The description and the opening paragraph name a narrow mandate:
   duplicates, stray assets and naming drift in "Jeff's AI system".
2. The scan-roots table lists Downloads at Rank 5 as "The junk drawer.
   Always the loser." That frames the whole folder as disposable by
   position. No rule or table row separates AI-system files from
   business or personal ones.
3. The only content test anywhere in the file is "recognized Clief/Vault
   asset", and it covers one filing case. Every other Downloads file is
   therefore either a hash-match candidate or unclassified.
4. Unclassified files fall into the catch-alls under APPROVAL-REQUIRED:
   "Deleting or moving anything that is NOT byte-identical" and
   "Anything you are less than certain about". Those rules turn
   out-of-mandate files into approval items.
5. Step 1 says "Scan all resolved roots", and Step 0 only checks that a
   root exists, not that it belongs to the system. Claude Code is where
   Downloads resolves, so the reach was fully live. That fits the report:
   about 256 MB of unrelated files surfaced while the safety rails held.

RULED OUT
- Description or trigger: it fired as intended. If it had not fired, this
  would be a different death.
- Surface and substrate availability: all roots resolved, so Step 0
  worked. A chat-surface run would have scanned nothing.
- Approval gate, SHA-256 rule, rank tiebreaker, Standing Docs protection:
  these behaved as written. Remove the Downloads root and they still
  hold. They contain the defect but do not cause it.
- Naming-conventions section: it is scoped to the Code workspace, so it
  cannot account for Downloads files.
- Instruction volume or missing worked example: the file is short and
  well structured, and nothing in the symptom points to ignored
  instructions.
- Inversion on the primary cause: drop Downloads from the scan set and
  hold everything else as written. The personal and business files
  never enter the run, so the symptom goes away. Keep the root and
  change anything else, and it stays.

SECONDARY CAUSE (survives the test)
The file contradicts itself about unique files. NEVER says "Never delete
a file that exists in only ONE location" and "Never delete the last
remaining copy of anything". APPROVAL-REQUIRED item 1 invites proposing
deletion of anything not byte-identical to another copy, which is exactly
a unique file. Fix the Downloads scope and this still produces
delete-the-only-copy proposals from the other roots. I can't tell from
your log how much of the 256 MB came from this rule and how much from
identical-hash duplicates among the unrelated files, so I rank it second.

CONFIDENCE
Medium. The scope mismatch is provable from the artifact. The cap is for
author bias and a single secondhand run. The evidence that would move it
is the dated report this run wrote to _hygiene\2026-xx-xx-hygiene.md. It
would show the approval items by category: hash-match duplicates, unique
files, and naming or ambiguity items. It would also show whether the
256 MB was mostly unique files (secondary cause) or duplicates among
personal files (primary cause alone). Which skills and connectors were
loaded in that session would rule out context compensating for the
defect.
```

## Response to message 2

**Confidence: medium on the primary cause, low-to-medium on the secondary.**

**Why the missing transcript matters less for the primary**

The primary cause is a mismatch between two parts of the artifact itself. One is the stated purpose, "my AI system's entropy". The other is the scan-roots table, which includes a general-purpose folder and defines it by position ("junk drawer, always the loser") with no content test. That can be read directly from the file you pasted, and the missing transcript doesn't change it. Your build log supplies the symptom: roughly 256 MB of unrelated files surfaced, with the safety rails intact. A symptom that fits this cause is consistent with it, but it doesn't prove it.

**Why it is capped at medium**

- **Author bias.** You built the skill, so your sense of what it was meant to do can't count as evidence.
- **One run, described secondhand.** It is a build-log summary, not a record I can inspect. I can't tell which approval items came from which rule.
- **Unknown context.** I don't know what else was loaded in that session.
- **Single sample.** One run on one Downloads folder can't show which input would behave differently.

**Why the secondary cause is weaker**

The contradiction is real in the text. NEVER forbids deleting the last copy, and the first APPROVAL-REQUIRED item invites proposing exactly that. But I have no evidence that this rule produced any of the 256 MB. The surfaced files could all have been byte-identical duplicates among personal files, and then only the primary cause is at work.

**Evidence that would raise confidence**

1. **The dated report** the run wrote to `_hygiene\YYYY-MM-DD-hygiene.md`. This is the best single piece of evidence. Its numbered approval items would show which category each of the 256 MB fell into.
   - If most items were unique files, the secondary cause is confirmed.
   - If most were hash-match duplicates among personal files, the primary cause is confirmed alone.
   - If the items were mostly in the AI roots, both causes are in doubt.
2. **A second run with Downloads excluded**, on the same machine, with everything else unchanged. If the unrelated files disappear, the primary cause is confirmed. That run would also show whether anything out of mandate surfaces from the other roots.
3. **A re-run that includes a discriminating input.** Place a few unrelated unique files in Downloads and see whether the skill proposes deleting them. Place a few unrelated byte-identical pairs there and see whether it auto-fixes them. Together these separate the two causes cleanly.
4. **The session's loaded skills and connectors**, to rule out another skill steering the run.

**Evidence that would lower confidence**

- If the report shows the 256 MB were almost all AI-system files (Clief assets, skill exports, playbooks), then "unrelated business and personal files" was a misjudgment and the diagnosis is wrong.
- If the same unrelated files had surfaced before Downloads was added to the roots, the cause is something other than the scan set.
- If another loaded skill or instruction told the model to review Downloads broadly, the skill text would be only a partial cause.

If you can recover the report, I'd start there.
