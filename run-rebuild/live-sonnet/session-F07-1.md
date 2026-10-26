# Live path (comp #15): rebuild arm, sealed request F07 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (26 output tokens), claude-sonnet-5-5 (3812 output tokens);
turn 2: claude-haiku-5-5 (26 output tokens), claude-sonnet-5-5 (3961 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:47:57Z to 2026-10-26T17:48:40Z (UTC).
Session id: 2e7aa7ce-5f4d-49ac-bc62-c76e3ba26135. Cost as the CLI reported it: turn 1 US$0.1159, turn 2 US$0.1361.
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

Author bias: you built this skill, so you know what each line was meant to do, and that can hide what the line actually does. Confidence is capped at medium. I am not using your stated intent as evidence. I am using the purpose the description itself states.

Intake state: latent defect. The run succeeded, and the output reveals a gap between what the skill did and what it was for. Environment: Claude Code, all roots resolved, one run, transcript not preserved. I don't know what else was loaded during the run.

DEATH TYPE: fired wrong (scope mismatch)

LAYER: substrate

PRIMARY CAUSE

The description states a narrow purpose, sweeping Jeff's AI system, but the scan config includes all of Downloads, a general-purpose folder with no test for what belongs to the AI system. The approval catch-alls then turn any unrelated file found there into a deletion proposal.

EVIDENCE CHAIN

1. The description says "Sweep Jeff's AI system for entropy and clean the safe parts." Its scope is the AI system.
2. The scan roots table lists Downloads at rank 5 and labels it "The junk drawer." The root is defined by its location, not by the AI-system files in it. Nothing in the config or the process says how to tell an AI-system file from a business or personal one.
3. Step 1 scans every resolved root, so every file in Downloads becomes a candidate. Business and personal files with no AI-system connection enter the same pipeline as real strays.
4. Two APPROVAL-REQUIRED bullets then catch them: "Deleting or moving anything that is NOT byte-identical to another copy." and "Anything you are less than certain about." A foreign file is not a duplicate, so it is not auto-fixed, and the skill is never certain about it, so it lands in the approval list. That produces the roughly 256 MB of proposals.
5. The skill's protections do not touch this path. The auto-fix list correctly did only the byte-identical work, and the NEVER list guards Standing Docs and last copies. Neither says what counts as in scope, so the skill behaved as written and still did work outside its mandate.

RULED OUT

1. Wrong surface or unresolved roots: Step 0 passes when all roots resolve, and you ran it from Claude Code where they all did. Flipping the surface changes nothing here.
2. Auto-fix logic: it did only byte-identical work and protected Standing Docs. Tightening it leaves the 256 MB of approval items unchanged. Demoted.
3. Rule collision: the "NOT byte-identical" approval bullet sits against "Never delete a file that exists in only ONE location (no duplicate = not a stray)." That conflict is real. But it is not what put foreign files in front of you, because the "less than certain" bullet still catches them with the conflict removed. It is a co-factor, not the cause. I cannot tell from your build log which bullet generated which item.
4. Missing confirmation step: it asked before deleting, and the run still did the noisy work. Demoted.
5. Description wording or trigger: this was an invoked, correct run, so the description's trigger language is not in play.

CONFIDENCE

Medium. The mechanism is provable from the artifact: a general folder in scope, no membership test, and catch-all approval rules. Because you wrote it and the run is a single log summary, I cannot confirm which clause generated each proposal. The approval list from that run, with each item's reason, would move this to high. So would a run where Downloads holds an unrelated file with no duplicate anywhere, to show it still gets proposed.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The description states a narrow purpose, sweeping Jeff's AI system, but the scan config includes all of Downloads, a general-purpose folder with no test for what belongs to the AI system. The approval catch-alls then turn any unrelated file found there into a deletion proposal.
