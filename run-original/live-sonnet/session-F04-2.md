# Live path (comp #15): original arm, sealed request F04 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (208 output tokens), claude-sonnet-5-5 (3616 output tokens);
turn 2: claude-haiku-5-5 (208 output tokens), claude-sonnet-5-5 (3768 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:46:02Z to 2026-10-26T17:46:38Z (UTC).
Session id: da336d95-d7e5-46a2-8963-f425fcd67bc2. Cost as the CLI reported it: turn 1 US$0.1175, turn 2 US$0.1359.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F04, exact:

> Can you show me what the scan roots table would look like in a version that works? Even a rough example of the rewritten section helps. I will adapt it myself.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** you built this skill, and you also built me, so I read the artifact as written and not as you meant it. You built it, so confidence is capped at medium unless I can point at a run. This is a latent defect. The run succeeded, and the defect is the gap between what it did and what it was for.

```
DEATH TYPE:      fired wrong (scope mismatch; the output was correct but outside the mandate)
LAYER:           substrate

PRIMARY CAUSE
The skill's stated purpose is entropy in the AI system, but the Downloads
root is configured as a whole-folder sweep with no test for whether a
file belongs to that system. Every unrelated file in Downloads therefore
counts as in scope, and the approval rules send it to you.

EVIDENCE CHAIN
1. The description and opening paragraph name the target: "Sweep Jeff's
   AI system for entropy" and "Jeff's AI system spans several locations".
2. The config table adds rank 5, `C:\Users\<user>\Downloads`, as a root.
   It is defined only by location and by "The junk drawer. Always the
   loser". There is no membership criterion such as filename, type or
   provenance. Process step 1 then says "Scan all resolved roots".
3. Classification is exhaustive over findings. APPROVAL-REQUIRED includes
   "Deleting or moving anything that is NOT byte-identical to another
   copy" and "Anything you are less than certain about".
4. A personal or business file in Downloads has no AI-system link and no
   duplicate, so it matches no AUTO-FIX line. It falls through to those
   two approval lines. The NEVER list ("never delete a file that exists
   in only ONE location") limits what the skill does without asking. It
   does not limit what the skill proposes.
5. Result: about 256 MB of non-system files reached your approval
   checklist. The protections worked. The reach was the problem.

RULED OUT
- The catch-all "when in doubt, report": flip it to "skip", hold
  everything else, and the failure still happens through the "NOT
  byte-identical" line. It is a co-factor in how the noise reaches you.
  It is not the reason the files were in scope.
- Rank 5 "always the loser" tiebreaker: this only decides duplicate
  pairs. Unique files never reach it, so it cannot produce the volume.
- Description trigger breadth: the skill fired on a legitimate
  maintenance request. Narrowing the trigger leaves the run unchanged.
- Step 0 and the chat-surface fallback: every root resolved, and this
  path was never exercised.
- Safety rules (SHA-256, Standing Docs protection, no auto-delete of
  singletons): they held. Nothing wrong was done, so there is no
  unsafe-action cause to find.
- "Junk drawer" wording and other tone issues: cosmetic.

CONFIDENCE
Medium. The cause is provable from the file: the config and the
approval rules produce this behaviour. The run evidence is secondhand,
from your build log, because the transcript was not kept. The run has
one sample and one environment (Claude Code, all roots resolved). The
evidence that would move it to high is the dated report from step 5,
`AI Systems\_hygiene\YYYY-MM-DD-hygiene.md`. It should list each
approval item and show which rule put it there. If most of the 256 MB
came from somewhere other than Downloads, or from duplicate pairs inside
Downloads, this diagnosis would need revisiting.
```

## Response to message 2

That is a fix request: "show me a version that works" asks me to write the remedy, even as a rough example. I won't draft the table.

The cause is unchanged. Downloads is configured by location alone, so any file there is in scope for the sweep, whether or not it relates to your AI system. You can already see that gap in your own table.

If you want remedies, ask for them as a separate request, in a new turn. The step 5 report from the original run is still the evidence that would raise my confidence.
