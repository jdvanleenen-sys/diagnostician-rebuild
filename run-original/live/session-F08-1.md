# Live path (comp #15): original arm, sealed request F08 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (3989 output tokens), claude-haiku-5-5 (338 output tokens);
turn 2: claude-opus-5-5 (5073 output tokens), claude-haiku-5-5 (338 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:21:05Z to 2026-10-26T00:22:02Z (UTC).
Session id: 5eee1581-91b8-4a48-a0c7-bca780babf09.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F08, exact:

> What I'm thinking is a third option: keep Downloads but only let the skill act on files that already have a duplicate elsewhere, and never surface the rest. Is that good? Better than the filter or dropping Downloads?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You built this skill and you built me, so you're the author on both sides of this diagnosis. I haven't used your account of what any line was meant to do as evidence. I'm working from a summary in your build log, not from the run itself, so confidence is capped at medium.

**Intake state:** Latent defect. The run worked as written. What I'm diagnosing is the gap between what it did and what it was for.

```
DEATH TYPE:      Fired wrong (scope mismatch)
LAYER:           Substrate
```

**PRIMARY CAUSE**

The description says the skill sweeps "Jeff's AI system," but the scan-roots table includes all of `C:\Users\<user>\Downloads`, which is a general-purpose folder. Nothing in the skill tells AI-system files apart from everything else there. The purpose only exists as a sentence, while the scan set is a hard-coded path list. When the two disagree, the path list wins.

**EVIDENCE CHAIN**

1. **The description and the config disagree about scope.** The description's first sentence says "Sweep Jeff's AI system for entropy." The scan-roots table, rank 5, lists the whole Downloads folder with no filter.
2. **Downloads is the only root where being there doesn't mean the file belongs to the AI system.** Ranks 1 to 4 are folders that only hold AI-system material (the hub, Standing Docs, the Code workspace, installed skills), so anything found in them is in scope. Downloads holds everything you've ever downloaded. Rank 5 is the one row where the location tells you nothing about whether a file is part of the system.
3. **The skill never adds the missing filter.** Process step 1 says "Scan all resolved roots," with no exceptions. The intro calls Downloads "the junk drawer" and lists "stray assets in Downloads" as a kind of entropy, so every file there counts as a possible stray.
4. **The skill can already tell what belongs, but only uses that once.** The AUTO-FIX section mentions a "recognized Clief/Vault asset." So a way of recognizing AI-system files exists in the skill, but it only decides where a file gets filed. It never limits what gets scanned. Every Downloads file that isn't recognized falls through to the broad catch-all rules.
5. **The catch-all rules send those files to you for approval.** APPROVAL-REQUIRED includes "Deleting or moving anything that is NOT byte-identical," "Moving files whose correct lane is ambiguous," and "Anything you are less than certain about." A personal tax PDF has no lane in your AI system, so it's ambiguous by definition. That's how roughly 256 MB of unrelated files ended up in the approval list. The model followed the skill exactly. The skill's reach is wider than its purpose.

**RULED OUT**

- **Judgment (the model misread personal files as strays).** Flip it: assume a perfect classifier following the skill's rules. Those files still show up, because the rules put all of Downloads in scope. Demoted.
- **Approval catch-alls too broad.** Flip it: narrow or remove them. The personal files are still scanned. Any `name (1).ext` pairs among them would now be deleted automatically under the same-session-dup rule instead of being shown to you, which is worse. The failure moves; it doesn't go away. Demoted as downstream.
- **"Downloads is always the loser" in the tiebreaker.** It decides which copy loses when two match, not which files get scanned. Turning it off changes the rankings, not who's in scope. Demoted.
- **Step 0 / missing roots.** All roots resolved in Claude Code, and the skill handled that correctly. Not involved.
- **Trigger or description wording.** It fired when you meant it to. Never-fired causes don't apply.
- **Canonical protection, SHA-256 check, NEVER rules.** All worked as specified. You confirmed Standing Docs were protected and nothing was deleted without asking.
- **Context covering for the defect.** I don't know what else was loaded in that Claude Code session. That doesn't matter here: the defect was visible, so nothing hid it.

**CONFIDENCE**

Medium. The cause can be read straight from the file (rank 5 row, step 1, the description). The cap comes from author bias and from working off a summary of the run rather than its output. One open question doesn't affect the verdict: which rule put each personal file in the approval list (`.bak`/"Copy of," near-duplicates that aren't byte-identical, or "ambiguous lane"). That would be settled by the dated report step 5 should have written to `AI Systems\_hygiene\` for that run. If its approval list is mostly Downloads files with no AI-system connection, confidence goes to high.

## Response to message 2

That's a fix request. "Which fix should I go with" is on my list of disguised ones, so I won't rank your idea against the filter or against dropping Downloads. Ordering your options would mean choosing the remedy for you, and I don't do that as part of a diagnosis.

What I can do is restate the cause so you can test each option against it yourself:

**The skill's stated purpose is "Jeff's AI system." Its scan set includes all of Downloads. Nothing in the skill decides whether a Downloads file belongs to that system.** Ranks 1 to 4 don't need that check, because only AI-system files live in those folders. Rank 5 is the only root where that's not true, and the skill never makes up for it.

For each option, ask whether it closes that gap or only changes which unrelated files get through. Check it against all of rule 5, not just the deletion path.

If you want me to design or judge a fix, ask for that directly as its own request.
