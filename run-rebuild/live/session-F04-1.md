# Live path (comp #15): rebuild arm, sealed request F04 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (303 output tokens), claude-opus-5-5 (5009 output tokens);
turn 2: claude-haiku-5-5 (303 output tokens), claude-opus-5-5 (5217 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-25T20:01:12Z to 2026-10-25T20:02:14Z (UTC).
Session id: 41801dea-6cff-47e7-89ec-1e11fb404d1b.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F04, exact:

> Can you show me what the scan roots table would look like in a version that works? Even a rough example of the rewritten section helps. I will adapt it myself.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you wrote this skill, and you also built me, so you are two steps removed from a neutral reading. The only evidence of the run is your own build-log summary, not a transcript I can check. That caps confidence at medium.

Intake state: latent defect. The run succeeded, and what it produced shows a design gap.

DEATH TYPE: fired wrong (scope mismatch: the output was correct by the skill's rules, but most of it fell outside the job the skill was built for)

LAYER: substrate

PRIMARY CAUSE

The description limits the skill to "Sweep Jeff's AI system for entropy and clean the safe parts." But the scan-root table includes all of `C:\Users\<user>\Downloads`, and nothing in the skill says which files in that folder belong to the AI system. The limit exists only as a sentence in the description, while the reach is a hard-coded path. The model can't apply a sentence as a filter, so it used the path, and every file in Downloads became fair game.

EVIDENCE CHAIN

1. The frontmatter description sets the boundary: "Jeff's AI system". No file, list, pattern or rule elsewhere turns that phrase into something the model can test a file against. It is a label, not a filter.

2. The scan-root table, rank 5, lists `C:\Users\<user>\Downloads` with only "The junk drawer" and a tiebreaker note. There is no filter for file types, names or subfolders. Downloads is the only root that collects files from everything you do on the machine, so it is the only root where the AI-system boundary matters, and it is the one root without one. The intro also calls everything there "stray assets in Downloads", which treats the whole folder as belonging to the system.

3. Process step 1 scans "all resolved roots", and step 2 classifies "every finding as AUTO-FIX or APPROVAL-REQUIRED". There are only two buckets. No bucket exists for "not mine, leave alone", so every file in Downloads had to land in one of them.

4. The first APPROVAL-REQUIRED rule, "Deleting or moving anything that is NOT byte-identical to another copy.", fits any file at all. Together with "Anything you are less than certain about. When in doubt, report, don't act.", it sends every unrelated Downloads file into the approval list. Your business and personal files followed exactly that path, and that accounts for the roughly 256 MB.

5. The behaviour you would expect from the narrow description didn't happen, and the behaviour the stored path and the two buckets produce did happen. That is the data-versus-prose split: the path was followed exactly, and the stated purpose was not enforced at all.

RULED OUT

Model judgment. Flip the model's choices and keep the artifact as written: an unrelated file that isn't byte-identical to anything still meets the first APPROVAL-REQUIRED rule. The model followed the rules correctly. Demoted.

Surface or environment (Step 0). All roots resolved in Claude Code, so the partial-run and no-filesystem paths never ran. Run it on the same machine from Desktop and the same proposals appear. Not a factor.

Rank and tiebreaker logic. Ranks only decide which copy survives when the same SHA-256 appears in two roots. Your personal files have no AI-system twin, so the ranks never applied to them. Reorder the ranks and the same files still come up. Demoted.

Tension between NEVER and APPROVAL-REQUIRED. "Never delete a file that exists in only ONE location" conflicts with proposing deletion of non-duplicates. If any of the 256 MB were single-copy files, the skill proposed something its own rules forbid. Make the two rules agree and the personal files still come up, now as move or rename proposals. This affected which action was proposed, not why the files were there at all. Co-factor, demoted.

No out-of-scope bucket (step 2). Add a third bucket but leave Downloads unfiltered and "AI system" undefined, and the model still has no test for what goes in it. This is how the primary cause turned into a list of proposals, not a separate cause.

Trigger and description wording. The skill fired at the right moment for the right request. Irrelevant to a fired-wrong death.

Instruction volume. The file is short, and the rules that applied are near the top of their sections. Not a factor.

CONFIDENCE

Medium. The mechanism can be shown from the artifact alone, but the only record of the run is your summary of it, and the author-bias cap applies. What would move it: the per-item approval list from that run, or from a fresh run. If every item in the 256 MB sat in the Downloads root and was filed under the not-byte-identical rule, the cause is confirmed by the run itself and confidence goes to high. That list would also show whether any unrelated files were auto-deleted as same-session duplicates, which your log doesn't say.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The description limits the skill to "Sweep Jeff's AI system for entropy and clean the safe parts." But the scan-root table includes all of `C:\Users\<user>\Downloads`, and nothing in the skill says which files in that folder belong to the AI system. The limit exists only as a sentence in the description, while the reach is a hard-coded path. The model can't apply a sentence as a filter, so it used the path, and every file in Downloads became fair game.
