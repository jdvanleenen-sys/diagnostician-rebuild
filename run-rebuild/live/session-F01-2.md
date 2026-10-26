# Live path (comp #15): rebuild arm, sealed request F01 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (4639 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (5043 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:22:24Z to 2026-10-26T00:23:20Z (UTC).
Session id: 9ef36a05-476e-4451-beb0-253965816d84.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F01, exact:

> So would either of those work? An AI-relevance filter on Downloads, or dropping Downloads from the scan roots. I just need to know whether both would solve it.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Before the diagnosis, the bias declaration. You wrote this skill, so you know what each line was meant to do, and that knowledge tends to hide what the lines actually do. I set your stated intent aside and treat it as the description of the failure, not as evidence. You also built me, which doesn't change the procedure. It's another reason to stick to what the skill's text says. My confidence is capped at medium because the run evidence is your build log's summary, not the run's own output.

Intake state: latent defect. The run succeeded, but it went beyond the purpose the skill states. That counts as a body.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill says its domain is your AI system, but the only boundary it actually stores is a list of folder paths. One of those paths, `C:\Users\<user>\Downloads`, is your whole general-purpose Downloads folder, not an AI-system location. So every file in it, personal or business, becomes an in-scope candidate, and the catch-all approval rules then put those files on your checklist.

EVIDENCE CHAIN

1. The description and the opening paragraph name a narrow purpose: "Sweep Jeff's AI system for entropy". Nothing in the file defines what counts as an AI-system file. The term is a name, and the skill carries no criterion that would let a run apply it.
2. The Scan roots table is the only scope data the skill has, and the rank 5 row lists `C:\Users\<user>\Downloads` with no filter. The other roots do have limits: the Code workspace skips `.git`, and `C:\Jeff's Brain` is marked "(top level only)". Downloads gets only the note "The junk drawer", which describes how to rank its copies, not which files belong in scope.
3. Process step 1 says to scan "all resolved roots". The run was in Claude Code with every root resolving, so the whole Downloads folder entered the candidate set exactly as written.
4. The APPROVAL-REQUIRED list includes "Deleting or moving anything that is NOT byte-identical to another copy.", "Moving files whose correct lane is ambiguous." and "Anything you are less than certain about." A personal file in Downloads fits at least one of these by definition, because it has no lane in your AI system. The only AI-specific recognition in the skill, "recognized Clief/Vault asset", is used to file assets into a lane, never to exclude files from scope.
5. The run matches this chain exactly. It behaved correctly on the AI roots (byte-identical duplicates found, Standing Docs protected, approval requested) and produced "roughly 256 MB it proposed deleting" of files from Downloads that have nothing to do with the system.

RULED OUT

- Surface or environment (substrate absent): every root resolved in Claude Code and Step 0 took the "All resolve" branch. Flipping the surface would only shrink the sweep by accident, not because the scope changed. Demoted.
- Judgment error: the model applied the rules as written and none of its classifications broke them. A perfect classifier working from these rules would still put unrelated Downloads files on the checklist. Demoted.
- Tiebreaker or rank logic: it worked. Standing Docs were protected and duplicates resolved toward the canonical copy. Demoted.
- Rule collision between "Never delete a file that exists in only ONE location" and the approval rule that allows proposing deletion of files that are not byte-identical: this could explain why some items were proposed for deletion rather than just listed. But fix the collision and the same files would still appear under "Moving files whose correct lane is ambiguous." It shapes what the symptom looks like, not whether it happens. It is also unconfirmed, because we don't know which rule each item came through. Demoted.
- Auto-fix reach into non-AI files ("anywhere in the scan set" for empty directories, and the same-session duplicate rule): these can also act silently on personal Downloads content. That is the same cause showing up in the auto-fix lane instead of the approval lane, not an independent failure. Folded into the primary.
- Trigger or description wording: the skill fired when it should have. The death is not "never fired". Demoted.

CONFIDENCE

Medium. The cap comes from author bias and from relying on the build log's summary rather than the run's output. The cause itself follows from the skill's text alone. The evidence that would move this is the dated report Step 5 should have written to the `_hygiene` folder for that run. It would show which approval rule each of the roughly 256 MB of items came through, and whether every one of them came from Downloads.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed: The skill says its domain is your AI system, but the only boundary it actually stores is a list of folder paths. One of those paths, `C:\Users\<user>\Downloads`, is your whole general-purpose Downloads folder, not an AI-system location. So every file in it, personal or business, becomes an in-scope candidate, and the catch-all approval rules then put those files on your checklist.
