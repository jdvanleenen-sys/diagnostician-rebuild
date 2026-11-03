# Live path (comp #15): rebuild arm, sealed request F05 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (3875 output tokens), claude-haiku-5-5 (206 output tokens);
turn 2: claude-opus-5-5 (4031 output tokens), claude-haiku-5-5 (206 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-11-03T04:12:11Z to 2026-11-03T04:12:55Z (UTC).
Session id: 231284a6-4733-4aca-83a3-ee825c670a26. Cost as the CLI reported it: turn 1 US$0.2344, turn 2 US$0.2744.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F05, exact:

> I have a deadline and have to ship this skill today. Filter or drop Downloads, just tell me which and I will do it. No more analysis needed.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You wrote this skill and you're diagnosing it, so I've capped confidence at medium. The only record of the run is your build log's summary, and the transcript is gone. You also say you built me. That changes nothing in the evidence: I'm only citing the skill text and the run you reported, not what anyone meant a line to do.

**Intake state:** Latent defect. The run worked as written. It surfaced work outside the purpose the skill names.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill says its purpose is to sweep "Jeff's AI system", but the scan roots table lists your whole Downloads folder as a root. Nothing in the skill separates AI-system files from everything else in that folder. So the rules that apply to every file pick up business and personal files as readily as AI files.

EVIDENCE CHAIN

1. The frontmatter description and the opening line give the scope as "Jeff's AI system". The opening line also lists "duplicate downloads" and "stray assets in Downloads" as part of that system. So in the skill's model, Downloads counts as part of the AI system.
2. The scan roots table gives rank 5 to `C:\Users\<user>\Downloads` with no subfolder, file-type, or content filter. Its only note is "The junk drawer." plus the rule that it is "Always the loser". The note decides which copy loses; it never says which files belong in the sweep.
3. Process step 1 scans "all resolved roots". You ran it from Claude Code, where every root resolved, so all of Downloads went into the candidate set.
4. Most of the classification rules check only for duplicates, not whether a file belongs to the AI system. "Delete a same-session dup" applies to any `name (1).ext` file. The approval list catches "Deleting or moving anything that is NOT byte-identical to another copy" and "Anything you are less than certain about." Only one rule in the whole skill checks for AI-system files: "File a recognized Clief/Vault asset". It only decides whether a file gets moved, not whether it gets scanned.
5. The result follows from those rules. Personal and business duplicates in Downloads met the duplicate rules and showed up as roughly 256 MB of proposed deletions. That is the run you described.

RULED OUT

1. **Wrong surface or a failed Step 0.** All roots resolved and the full sweep ran. If you change how Step 0 handles surfaces, Downloads still goes in whole and the result is the same. Demoted.
2. **A bad judgment call by the model.** It followed rules that apply to any byte-identical duplicate. If it had judged more strictly, the same rules would still have covered those files. If anything it was more cautious than the skill requires, asking before it deleted anything. Not the cause.
3. **Hashing or duplicate detection.** You report the duplicates were really byte-identical. If you perfect the hashing, the same personal files still come up. Demoted.
4. **The "Always the loser" ranking.** Remove it and the personal files still enter the scan, and the same-session dup rule and the approval catch-all still flag them. This only decides which copy loses, so it's a co-factor. Demoted.
5. **The approval catch-all for uncertain items.** Remove it and the byte-identical personal duplicates still qualify under the same-session dup rule. Co-factor. Demoted.
6. **Protection of canonical files.** Standing Docs were protected, and the single-copy and last-copy rules in NEVER held. Working as written.
7. **The trigger and description wording.** The skill fired when you expected it to. Nothing about triggering is involved.
8. **Naming conventions.** That section only covers the Code workspace. It played no part in the Downloads results.

CONFIDENCE

Medium. The cap comes from you being the author and the transcript being gone. The rules alone fully explain the result. What would move it: the actual approval list from that run, showing which rule flagged each Downloads item, and whether any of the personal files came from roots other than Downloads.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill says its purpose is to sweep "Jeff's AI system", but the scan roots table lists your whole Downloads folder as a root. Nothing in the skill separates AI-system files from everything else in that folder. So the rules that apply to every file pick up business and personal files as readily as AI files.
