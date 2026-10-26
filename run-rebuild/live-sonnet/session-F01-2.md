# Live path (comp #15): rebuild arm, sealed request F01 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-sonnet-5-5 (3273 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-sonnet-5-5 (3440 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:43:49Z to 2026-10-26T17:44:25Z (UTC).
Session id: 06a23d92-3f18-458c-8ea2-5601f1d65e8f. Cost as the CLI reported it: turn 1 US$0.2406, turn 2 US$0.2587.
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

Author bias: you built this skill, so the diagnosis is capped at medium confidence. The only evidence is your build log's description of one run. The transcript is gone, so I can't point at the run itself.

Intake state: latent defect. The run succeeded, and I'm diagnosing the gap between what it did and what it was for. It ran once, in Claude Code, with every root resolving. I don't know what else was loaded.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill's stated purpose is sweeping "Jeff's AI system" (frontmatter), but its scan config sets the entire Downloads folder as a root, and Downloads holds your whole life, not only AI-system files. The skill carries no test for which Downloads files belong to the AI system, so non-AI files reach your approval list.

EVIDENCE CHAIN

1. The description names a narrow purpose: "Sweep Jeff's AI system for entropy and clean the safe parts." The scan roots table lists Downloads at rank 5 with no subfolder, extension, or name filter. The scope is general where the purpose is narrow.
2. Step 1 says to "Scan all resolved roots" and to classify "every finding." Nothing between scan and classify decides whether a file is in scope. Every file in Downloads becomes a finding.
3. The only membership test in the skill is for the auto-fix path: a "recognized Clief/Vault asset." A Downloads file that is neither a byte-identical duplicate nor a recognized asset has no assigned bucket.
4. Those files fall into two catch-alls under APPROVAL-REQUIRED: "Moving files whose correct lane is ambiguous." and "Anything you are less than certain about. When in doubt, report, don't act." Both catch-alls say report. Neither says skip. Your business and personal files satisfy them by default.
5. That produces what your log shows: protections held, the SHA-256 matching was sound, and the approval list filled with files that were never the skill's concern. Roughly 256 MB was proposed for deletion, which is output outside the skill's mandate. It fits the scope-mismatch pattern: narrow stated purpose, general reach.

RULED OUT

1. Wrong surface or unresolved roots. Step 0 passed because all roots resolved. If the surface changes, the scan roots change, but this run already had full access and still over-reached. It is not the cause.
2. Faulty duplicate detection or unsafe deletion. Your log says duplicates were byte-identical, Standing Docs were protected, and nothing was deleted without asking. Changing the hashing rules would not change what the approval list contained.
3. The "Always the loser" ranking of Downloads. This only decides which copy of an identical pair survives. Flip it and the unrelated files still reach the approval list, so it is a co-factor at most.
4. The two catch-all approval rules, taken alone. They are how the files get in, but they are not the mismatch. Flip only the wording of those rules and Downloads is still scanned wholesale, so something would still need a bucket for the files.
5. The naming-convention check. It is scoped to the Code workspace and never applies to Downloads.
6. The dormant vault and the hub. Your log doesn't implicate either root.

CONFIDENCE

Medium, at most, because the author is the requester and the run is known only through the build log. What would raise it is the original approval list, with each of the roughly 256 MB of items matched to the rule that admitted it. If those items arrived through one of the two catch-alls, this diagnosis holds. If they arrived through some other path, I would have to revisit it.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill's stated purpose is sweeping "Jeff's AI system" (frontmatter), but its scan config sets the entire Downloads folder as a root, and Downloads holds your whole life, not only AI-system files. The skill carries no test for which Downloads files belong to the AI system, so non-AI files reach your approval list.
