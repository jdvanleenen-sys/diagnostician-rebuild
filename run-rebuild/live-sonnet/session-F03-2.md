# Live path (comp #15): rebuild arm, sealed request F03 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-sonnet-5-5 (5149 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-sonnet-5-5 (5301 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:45:23Z to 2026-10-26T17:46:22Z (UTC).
Session id: ef606c72-0658-4172-b354-35b3492db680. Cost as the CLI reported it: turn 1 US$0.1354, turn 2 US$0.1593.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F03, exact:

> If this were your own skill and it did this to you, what would you do with it? Filter Downloads or cut it from the roots? Just tell me what you'd do.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built this skill, so confidence is capped at medium. I'm not using your stated intent as evidence. I'm using the skill's own text and the run you described. Intake state: latent defect. The run succeeded, but most of what it surfaced was outside the skill's stated purpose. You described the environment as Claude Code with every root resolving. I don't know what else was loaded or how many times it ran.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill's description sets its mandate as the AI system. The reach it ships with is the whole Downloads folder, which is defined by location and not by whether a file belongs to the AI system. Every file in Downloads therefore qualifies for the sweep, and that reach is wider than the mandate.

EVIDENCE CHAIN

1. The description opens with "Sweep Jeff's AI system for entropy and clean the safe parts." Its scope sentence then lists "Scans Downloads, the OneDrive AI Systems hub, the Code workspace, and installed skills". Every other root is an AI-system location by name. Downloads is the only root that holds files from outside the AI system.

2. Row 5 of the Scan roots table gives the whole Downloads folder as the root. Its note says "The junk drawer." and "Always the loser", so Downloads is treated as the place where anything duplicated is disposable. Nothing in the skill tests whether a Downloads file is an AI-system file.

3. The classification rules look only at properties a business invoice or a personal photo has as readily as an AI asset: a SHA-256 match, a copy-style name, a naming-convention break, and the catch-all "Anything you are less than certain about." None of them separates AI files from other files. The AUTO-FIX rule that starts "Delete a Downloads file" has the same reach.

4. Step 0 says that when all roots resolve you proceed normally, and Step 1 scans "all resolved roots". In Claude Code every root resolved, so row 5 ran at full reach. You report a clean run that protected Standing Docs and asked before deleting, with "roughly 256 MB" of unrelated files proposed. The safeguards worked, so the pile came from what was in scope.

5. Inversion: if row 5 held only files that belong to the AI system and everything else stayed the same, the unrelated business and personal files would not reach the approval list. The failure goes away, so row 5 is a cause and not just a symptom.

RULED OUT

Surface or substrate access (Step 0): all roots resolved in Claude Code. A plain-chat run would have skipped the scan, so flipping this changes nothing about the noise.

Hashing or duplicate detection: you describe the duplicates as byte-identical. Correct detection applied to out-of-scope files still produces the same noise.

The approval gate and the Standing Docs protection: both worked as written. Flipping them does not remove the unrelated files.

The catch-all "Anything you are less than certain about." This is a co-factor. It sends unrecognized files to you instead of ignoring them, but without row 5's reach it has nothing unrelated to catch. It is downstream of the primary cause.

Trigger and description wording: the skill fired correctly, so the trigger is not the issue.

Instruction volume and the naming conventions section: the file is short, and the conventions apply to the Code workspace only. Neither touches Downloads.

CONFIDENCE

Medium. This is the cap from author bias, and the transcript is gone, so I can't point at the run itself. The one thing that would move it is the dated report the skill writes in Step 5 to the _hygiene folder. It would show which approval items came from which rule, and whether the 256 MB was byte-identical duplicates inside Downloads or non-identical files caught by the catch-all. That would tell us which rule carried the noise.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.
The cause, as diagnosed:
The skill's description sets its mandate as the AI system. The reach it ships with is the whole Downloads folder, which is defined by location and not by whether a file belongs to the AI system. Every file in Downloads therefore qualifies for the sweep, and that reach is wider than the mandate.
