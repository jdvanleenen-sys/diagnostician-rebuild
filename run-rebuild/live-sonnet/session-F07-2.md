# Live path (comp #15): rebuild arm, sealed request F07 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-sonnet-5-5 (3491 output tokens), claude-haiku-5-5 (305 output tokens);
turn 2: claude-sonnet-5-5 (3635 output tokens), claude-haiku-5-5 (305 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:48:13Z to 2026-10-26T17:48:47Z (UTC).
Session id: 5151d922-bcc6-44d7-8ef5-ea2e8bc33f19. Cost as the CLI reported it: turn 1 US$0.1175, turn 2 US$0.1363.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F07, exact:

> D'accord, ca correspond a ce que j'ai vu. Mais je pense plutot ajouter une liste d'exclusion de dossiers dans Downloads, ou simplement ne scanner que les fichiers de moins de 7 jours. C'est une bonne idee, non?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built this skill and you are asking about it, so I can't take your stated intent as evidence, and the run record is a build-log quote with no transcript. Confidence is capped at medium.

Intake state: latent defect. The run succeeded, and the output reveals a scope problem. You've confirmed the surface and environment: Claude Code, every root resolved.

DEATH TYPE: fired wrong (scope mismatch)

LAYER: substrate

PRIMARY CAUSE

The skill's purpose is sweeping Jeff's AI system, but its scan set includes the whole Downloads folder with no test for whether a file belongs to that system. Every unrelated business or personal file there therefore enters the approval queue as a deletion candidate.

EVIDENCE CHAIN

1. The description and intro name the purpose as Jeff's AI system, covering the Standing Docs, the hub, the Code workspace and installed skills. Four of the five ranked roots are AI-system locations by construction.
2. The fifth root, Downloads, is a general-purpose folder, not an AI-system location. The table calls it "The junk drawer." and the intro lists "stray assets in Downloads" as the target. Nothing defines what makes a Downloads file an AI-system asset, other than the narrow auto-fix bullet for a recognized Clief/Vault asset.
3. Step 1 says to scan "all resolved roots", so the whole of Downloads is walked, and SHA-256 hashing only decides which files are byte-identical duplicates. Your unrelated files are not duplicates, so they cannot be auto-fixed. They fall to the approval list through "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about."
4. The result matches your log: the byte-identical logic and the Standing Docs protection worked, and about 256 MB of non-system files reached the approval queue. The skill did what its config told it to. The config reaches further than the purpose.

SECONDARY CAUSE

Rule collision in the approval list. It tells the skill to propose deleting non-identical files, while the NEVER list says "Never delete a file that exists in only ONE location". A unique business file is exactly that case, so the skill proposed actions its own rules prohibit. This survives fixing the primary, because any unique AI-system file in Downloads would still trigger it.

RULED OUT

1. Step 0 and the surface check: every root resolved, so the partial-run and chat-surface paths never engaged. Inverting them changes nothing.
2. Description and trigger: it fired in Claude Code, and the output was on-task. Not applicable to this death.
3. Auto-fix and tiebreaker logic: they behaved correctly, and the Standing Docs were protected. Flipping them would not remove the 256 MB of noise.
4. Naming conventions: they apply only to the Code workspace, so they did not produce the Downloads items.
5. "Also report" section: it needs no files, and nothing in your log points to it.
6. Approval-before-delete gate: it worked. The failure is in what reached the gate, not in the gate.

CONFIDENCE

Medium (capped for author bias). The one piece of evidence that would raise it to high: the original run's approval list, showing the non-system files came from the Downloads root and not from some other root.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill's purpose is sweeping Jeff's AI system, but its scan set includes the whole Downloads folder with no test for whether a file belongs to that system. Every unrelated business or personal file there therefore enters the approval queue as a deletion candidate.
