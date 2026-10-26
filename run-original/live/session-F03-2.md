# Live path (comp #15): original arm, sealed request F03 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (4064 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-opus-5-5 (4830 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:19:28Z to 2026-10-26T00:20:29Z (UTC).
Session id: d87be533-5cc8-469a-befb-090fa5c3e400.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F03, exact:

> If this were your own skill and it did this to you, what would you do with it? Filter Downloads or cut it from the roots? Just tell me what you'd do.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You built this skill, so this diagnosis is capped at medium confidence. The run I'm working from is a summary in your build log, not a transcript I can check. You also built me, which doesn't change the procedure but is worth keeping in mind.

**Intake state:** Latent defect. The run succeeded, and the defect shows in the output: it reached further than the skill is meant to. All roots resolved in Claude Code, so Step 0 and the surface fallback never came into play.

```
DEATH TYPE:      Fired wrong (scope mismatch)
LAYER:           Substrate
```

**PRIMARY CAUSE**
The skill's purpose is described only in words: "Sweep Jeff's AI system." Its reach is a literal path: all of `C:\Users\<user>\Downloads`. Downloads is a general-purpose folder where AI-system files are a minority. Nothing in the skill tests whether a file belongs to the AI system. So the path won and the words were ignored: every file in Downloads went through classification, including your business and personal files.

**EVIDENCE CHAIN**
1. **The boundary is described but never enforced.** The description and the opening paragraph define the target as "Jeff's AI system." That phrase never turns into a check anywhere in Process steps 1 through 4. Step 1 says "Scan all resolved roots," with no filter.
2. **The reach is a hard-coded path.** Scan roots, rank 5, lists Downloads with no subfolder, file type or name pattern. The rank 3 Code workspace has a narrowing rule ("Skip `.git`"), and so does the n/a workshop row ("top level only," skip the vault). The broadest, most mixed root has none.
3. **The row's note assumes everything in Downloads is AI clutter.** "The junk drawer. Always the loser" only makes sense if Downloads holds AI-system strays. It decides which copy loses in a duplicate. It doesn't decide which files count as candidates in the first place.
4. **The only recognizer is a name.** The single place the skill tries to tell AI-system files apart is the AUTO-FIX rule "File a recognized Clief/Vault asset." No list, pattern or file defines "recognized," and it only applies to filing, never to whether a file is scanned.
5. **The safety rule sent everything to you.** Your personal files entered classification with no way to rule them out. The APPROVAL-REQUIRED catch-all ("Anything you are less than certain about... report, don't act") then did exactly what it says and put them on your approval list. Since the rank 5 note says Downloads copies are "always the one to remove," deletion was the action proposed. That's how you got roughly 256 MB of unrelated files queued for deletion, while every rule was followed correctly.

**RULED OUT**
- **Judgment error (the model misread personal files as clutter):** The skill never gave the model a way to tell them apart. Give it one, keep everything else the same, and the failure goes away. This is a substrate gap, not bad judgment.
- **The "when in doubt, report" catch-all:** This is the route the files took, not the reason they were scanned. Fix the scope and it has nothing out of scope to report. It's downstream.
- **The rank and tiebreaker system:** It only settles which duplicate wins. Remove it and the files are still scanned and surfaced, just with a different proposed action.
- **APPROVAL-REQUIRED's first bullet vs NEVER's "Never delete a file that exists in only ONE location":** These two rules really do conflict, since one lets you be offered deletion of a file with no duplicate and the other forbids deleting it. But resolve it and personal files still show up as move or rename proposals. It's a co-factor, not the cause.
- **Step 0, the surface check:** Every root resolved, so it never ran.
- **Description and triggering:** It fired when you meant it to, so this isn't a "never fired" problem.
- **The undefined "Clief/Vault asset":** It's the same missing recognizer in a narrower spot. It affects filing, not which files get scanned.

**CONFIDENCE**
Medium, capped by author bias and the lost transcript. What would move it is the actual approval list from that run. It would show which rule carried the personal files: the "same-session dup" rule (duplicates within Downloads) or the catch-all (files with no copy elsewhere). The cause holds either way, but the list would confirm the route. A re-run with the Downloads row removed would settle the cause directly.

## Response to message 2

I won't pick for you. "If it were your skill, what would you do" is a request for a fix. Choosing between your two options is ranking your fixes, and once I order them I've chosen the remedy.

Here's the cause again, since it's what you'd check any change against. Your scan roots point at all of Downloads by path. The only limit to "AI system files" is a phrase in the description, and nothing in the skill turns that phrase into a test of whether a file belongs.

Both of your options act on that gap. Think about what each one does to it, what each costs you in AI strays that still land in Downloads, and whether either leaves the "AI system" boundary as words only. You know your Downloads folder better than I do, and that's where the decision is.
