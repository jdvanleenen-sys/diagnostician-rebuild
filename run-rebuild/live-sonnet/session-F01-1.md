# Live path (comp #15): rebuild arm, sealed request F01 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (211 output tokens), claude-sonnet-5-5 (3702 output tokens);
turn 2: claude-haiku-5-5 (211 output tokens), claude-sonnet-5-5 (3845 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:43:49Z to 2026-10-26T17:44:26Z (UTC).
Session id: b246f855-5d1b-48b2-aaad-9ed2ca0fd612. Cost as the CLI reported it: turn 1 US$0.2457, turn 2 US$0.2646.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F01, exact:

> So would either of those work? An AI-relevance filter on Downloads, or dropping Downloads from the scan roots. I just need to know whether both would solve it.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built this skill, and the only evidence of the run is a description from your build log. The transcript wasn't preserved. Confidence is capped at medium.

Intake state: latent defect. The run succeeded, and the diagnosis is the gap between what it did and what it was for.

DEATH TYPE: fired wrong (scope mismatch)

LAYER: substrate

PRIMARY CAUSE

The skill's purpose is entropy in the AI system, but its scan-roots config names all of Downloads as in scope with no test for whether a file belongs to the AI system. Any file in that folder that has no duplicate higher up therefore still reaches the approval list.

EVIDENCE CHAIN

1. The description and the intro frame the purpose as the AI system: "Sweep Jeff's AI system for entropy". The intro lists "stray assets in Downloads" as one kind of entropy.
2. The scan-roots table gives Downloads whole-folder scope. Its note column calls it "The junk drawer", so the config treats everything in that folder as mess, not just AI-system files. Rank 5 is a ranking for resolving duplicates. It is not a membership test.
3. Step 1 scans all resolved roots. Step 0 confirms every root resolved on Claude Code, so nothing narrowed the scan.
4. The AUTO-FIX list only touches Downloads files that are byte-identical to something higher up. The unrelated business and personal files had no match, so they fell through to APPROVAL-REQUIRED. That list has two broad buckets: "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about. When in doubt, report, don't act."
5. The result is what you saw. The safeguards held, because the duplicates were handled, Standing Docs were protected and nothing was deleted without approval. But the approval list was filled mostly with files the skill had no business judging, about 256 MB of proposed deletions.

RULED OUT

1. Step 0 and the surface fallback: all roots resolved. The skill ran as designed, and flipping this changes nothing about the noise.
2. Auto-fix misfiring: you report nothing wrong there. Standing Docs were protected and the duplicates were byte-identical, so the inversion shows no failure.
3. The approval gate: it worked. Removing it would make the noise more dangerous, not smaller.
4. The "When in doubt, report" catch-all: this is downstream. If Downloads did not admit unrelated files, the catch-all would have nothing unrelated to catch, so it does not fail independently.
5. The output format, a numbered checklist with no grouping or cap: a co-factor on how painful the report was to read. It does not decide what got surfaced, and it shrinks with the in-scope set.
6. The broad trigger phrases such as "clean up my files": I don't have the invoking prompt. Nothing in your account suggests the skill fired wrongly, and you say it was invoked on purpose.

CONFIDENCE

Medium, capped by author bias and a single run. The cause is visible in the artifact, but I can't see which rule classified each of the roughly 256 MB of items. The step 5 report is written to `_hygiene\YYYY-MM-DD-hygiene.md` in your AI Systems folder and should still exist. If its approval list shows the unrelated Downloads files under the not-byte-identical or when-in-doubt buckets, that confirms the chain. If they appear under some other rule, the cause is wrong.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill's purpose is entropy in the AI system, but its scan-roots config names all of Downloads as in scope with no test for whether a file belongs to the AI system. Any file in that folder that has no duplicate higher up therefore still reaches the approval list.
