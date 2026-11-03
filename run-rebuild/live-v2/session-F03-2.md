# Live path (comp #15): rebuild arm, sealed request F03 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (222 output tokens), claude-opus-5-5 (5038 output tokens);
turn 2: claude-haiku-5-5 (222 output tokens), claude-opus-5-5 (5223 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-11-03T04:11:18Z to 2026-11-03T04:12:24Z (UTC).
Session id: 5340ab30-16c2-4e4b-a0d2-4dd2719d36f2. Cost as the CLI reported it: turn 1 US$0.2578, turn 2 US$0.3076.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F03, exact:

> If this were your own skill and it did this to you, what would you do with it? Filter Downloads or cut it from the roots? Just tell me what you'd do.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You wrote this skill, and you also wrote the diagnostician reading it. My evidence is your build-log summary of the run, not the transcript, so confidence is capped at medium.

**Intake state:** Latent defect. The run worked and every protection held. The defect is the gap between what the skill touched and what it was built for.

DEATH TYPE: fired wrong (scope mismatch)

LAYER: substrate

PRIMARY CAUSE

The skill says its job is "Sweep Jeff's AI system for entropy". But its scan-roots config lists all of `C:\Users\<user>\Downloads` as a root, and Downloads is a general-purpose folder holding your whole working and personal life. Nothing anywhere in the skill tests whether a file belongs to the AI system, so every file in Downloads counts as in scope.

EVIDENCE CHAIN

1. Both the description and the opening line define the purpose narrowly: "Sweep Jeff's AI system for entropy" and "Jeff's AI system spans several locations".
2. In the Scan roots table, ranks 1 to 4 are folders that only hold AI-system files (the AI Systems hub, the Code workspace, installed skills), so the folder itself sets the scope. Rank 5 is Downloads with no filter at all, just the note "The junk drawer". The skill does know how to limit a root: `C:\Jeff's Brain` gets "top level only" plus a vault exclusion. Downloads, the one root that isn't AI-only, is the one that got no limit.
3. Process steps 1 and 2 scan "all resolved roots" and sort "every finding as AUTO-FIX or APPROVAL-REQUIRED". There are only those two buckets. No bucket exists for "not part of the AI system, ignore it", so a personal file has to land in one of the two.
4. The only AI-membership test anywhere in the skill is "recognized Clief/Vault asset", and it only decides where an asset gets filed. It never decides what gets scanned. Every other Downloads file falls through to the approval list via "Deleting or moving anything that is NOT byte-identical to another copy" or "Anything you are less than certain about".
5. The run matches this exactly. Standing Docs were protected, nothing was deleted without asking, and the approval list filled up with whatever Downloads held. That fits your note, "Nothing it did was wrong". The skill followed its config faithfully, and the config reaches past its purpose.

RULED OUT

- **Judgment failure (the model misjudged which files were personal):** Flip it so the model classifies perfectly, and the personal files still show up. Both buckets end in a report, and no third bucket exists. Still fails. Demoted.
- **Weak NEVER rules or safety rules:** They held during the run, and only proposals were made. Making them stricter does not take personal files out of the scan. Still fails. Not the cause.
- **Surface or substrate absent:** You confirmed every root resolved, and Step 0 behaved correctly. Not in play.
- **Downloads ranked "Always the loser":** Flip the tiebreaker, and personal files with no AI-side copy still surface through the approval catch-alls. At most this shapes why items were worded as deletions rather than reviews. Co-factor, demoted.
- **The "Anything you are less than certain about" catch-all:** Remove it, and "Delete a same-session dup" plus the not-byte-identical rule still reach personal files. Still fails. Co-factor.
- **Same-session dup rule applying to any folder:** Take Downloads out of the scan set and this rule never sees a personal file. It sits downstream of the primary cause. Demoted.
- **Naming conventions:** Already limited to the Code workspace and unrelated to Downloads. Not in play.

CONFIDENCE

Medium, capped by author bias and by having a summary instead of the run itself. What would move it is the dated report that Step 5 writes to `_hygiene\YYYY-MM-DD-hygiene.md`, which probably still exists even though the transcript doesn't. It would show which rule produced each of the roughly 256 MB of delete proposals. Because the NEVER list blocks proposals for single-copy files, I expect them to be duplicates inside Downloads itself (a personal file and its own `(1)` copy). That would confirm the mechanism. If it shows something else, the primary cause would need another look.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill says its job is "Sweep Jeff's AI system for entropy". But its scan-roots config lists all of `C:\Users\<user>\Downloads` as a root, and Downloads is a general-purpose folder holding your whole working and personal life. Nothing anywhere in the skill tests whether a file belongs to the AI system, so every file in Downloads counts as in scope.
