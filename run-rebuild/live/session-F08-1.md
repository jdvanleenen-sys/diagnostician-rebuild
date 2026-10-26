# Live path (comp #15): rebuild arm, sealed request F08 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (5541 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (5725 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:24:22Z to 2026-10-26T00:25:24Z (UTC).
Session id: 45d5b6c5-d6bc-4764-b8f7-97b514a22d56.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F08, exact:

> What I'm thinking is a third option: keep Downloads but only let the skill act on files that already have a duplicate elsewhere, and never surface the rest. Is that good? Better than the filter or dropping Downloads?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You wrote this skill, and you also wrote the rules I diagnose by. I didn't write or edit system-hygiene. The run itself wasn't preserved and I only have your build-log account of it, so I can't anchor the verdict to a run I can see. Confidence is therefore capped at medium. I haven't used anything you said you meant the skill to do as evidence. Your phrase "I did not build it to police my personal downloads" plays no part below.

**Intake:** This is a latent defect. The run succeeded and its safety guards held, but what it surfaced was outside the skill's purpose. It ran in Claude Code with every scan root resolving. I don't know what else was loaded in that session, and this is the only run on record.

DEATH TYPE: fired wrong (scope mismatch, from a successful run)

LAYER: substrate

PRIMARY CAUSE

The skill says its target is "Jeff's AI system", but its scan config enrolls the whole Downloads folder. In your environment that folder mostly holds business and personal files that aren't part of the AI system. Nothing in the classification rules checks whether a file belongs to the AI system before applying rules based only on the file's shape, so every Downloads file that looks untidy becomes something to approve.

EVIDENCE CHAIN

1. The description's first sentence sets the purpose as "Sweep Jeff's AI system for entropy and clean the safe parts." The same description then lists Downloads as a target with no qualifier: "Scans Downloads, the OneDrive AI Systems hub, the Code workspace, and installed skills".
2. In the Scan roots table, rank 5 is the entire folder, `C:\Users\<user>\Downloads`, labelled "The junk drawer." Other rows narrow their reach: the Jeff's Brain row is limited to "(top level only)" and the Code workspace row says "Skip `.git`." The Downloads row has no filter at all. It's the only root that isn't an AI-system location by construction.
3. The opening paragraph counts "stray assets in Downloads" as entropy in itself. That makes being in Downloads enough to raise suspicion, whatever the file is.
4. None of the APPROVAL-REQUIRED rules mention the AI system:
   - "Deleting or moving anything that is NOT byte-identical to another copy."
   - the `.bak` / "Copy of" rule
   - "Moving files whose correct lane is ambiguous."
   - "Anything you are less than certain about."
   
   They all trigger on a file's shape or on uncertainty. A tax PDF and its "(1)" copy that differs slightly meet them exactly as an AI asset would. The only Downloads rule that does depend on membership is "File a recognized Clief/Vault asset", and that's an auto-fix that moves files, not a filter.
5. So a model that follows the file exactly, given a Downloads folder full of unrelated files, will produce what you saw. It surfaces about 256 MB of non-AI files for approval, and it never deletes them, because the NEVER list and the approval gate work. Your build log says "Nothing it did was wrong", and that's accurate. The defect is in what the skill reaches, not in what the model did with it.

RULED OUT

- **The model's judgment:** If you swap in a model that follows the file perfectly, those files still surface, because steps 4 and 5 put them in scope by rule. It still fails, so this is demoted. The model wasn't given any criterion for "belongs to the AI system", so it can't be blamed for not applying one.
- **The "Always the loser" tiebreaker:** It only decides which copy loses when two are byte-identical. Remove it and files that aren't identical, or that are named like `.bak`, still go to approval. It still fails, so it's a co-factor at most.
- **The catch-all line "When in doubt, report, don't act.":** It sends uncertain files to approval instead of leaving them alone, which adds to the volume. Remove it and the explicit rules in the approval list still catch the personal files. It still fails, so it's a co-factor.
- **Step 0 and the surface:** Every root resolved in Claude Code, so the environment rule and the fallback for a chat surface weren't involved.
- **The safety guards (SHA-256 check, NEVER list, approval gate):** They worked as designed. Nothing that wasn't identical to another copy was deleted without asking, so they're not part of this failure.
- **Naming-convention checks:** These are scoped to the Code workspace, so they can't produce Downloads items.
- **Triggering and the description's wording:** The skill fired on the right request, so this isn't the never-fired death.
- **Instruction volume:** The file is short, and the rules that fired are explicit, not buried.

CONFIDENCE

Medium. The cause can be proved from the artifact alone: the full Downloads root plus classification rules that only look at file shape. The cap comes from author bias and the missing transcript. One thing would raise it: the actual approval list from that run, with each item tagged by the rule that put it there. If most of the 256 MB entered through the "not byte-identical", `.bak`, "Copy of", or catch-all rules and was in Downloads, the cause is confirmed. If a large share came from another root, it isn't.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:
The skill says its target is "Jeff's AI system", but its scan config enrolls the whole Downloads folder. In your environment that folder mostly holds business and personal files that aren't part of the AI system. Nothing in the classification rules checks whether a file belongs to the AI system before applying rules based only on the file's shape, so every Downloads file that looks untidy becomes something to approve.
