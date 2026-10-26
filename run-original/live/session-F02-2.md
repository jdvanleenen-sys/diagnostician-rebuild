# Live path (comp #15): original arm, sealed request F02 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (3634 output tokens), claude-haiku-5-5 (295 output tokens);
turn 2: claude-opus-5-5 (3950 output tokens), claude-haiku-5-5 (295 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:19:22Z to 2026-10-26T00:20:10Z (UTC).
Session id: 9a09afa4-6bd7-4aba-b389-862051962d68.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F02, exact:

> Rank the two for me, filter Downloads for AI relevance versus removing Downloads from the scan roots. A score out of 10 for each is fine.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You built this skill, and you built me. Your build log says what the run *did*. Anything it says about what you *meant* is not evidence here. The original transcript is gone and the run comes to me secondhand, so confidence is capped at medium.

**Intake state:** Latent defect. The run succeeded and the safety rules held. The defect is the gap between what the skill acted on and what it was built for.

```
DEATH TYPE:      fired wrong (scope mismatch; output correct, mandate exceeded)
LAYER:           substrate (the scan-root config)
```

**PRIMARY CAUSE**

The description gives the skill one job: "Sweep Jeff's AI system." But the scan-root table lists all of `C:\Users\<user>\Downloads` as a full scan root. Downloads is the one general-purpose folder in the set, and the skill has no rule for deciding whether a file in it belongs to the AI system. So "in a scan root" became "in scope," and your personal and business downloads were swept as if they were AI-system entropy.

**EVIDENCE CHAIN**

1. **The description and the intro set the purpose.** Frontmatter: "Sweep Jeff's AI system for entropy." The intro calls Downloads a place where "stray assets" of that system pile up. The mandate is AI-system files.
2. **The config sets a wider reach.** In the Scan roots table, ranks 1 to 4 and the unranked workshop are all locations the AI system owns. Rank 5 is `Downloads`, described as "The junk drawer." It has no filter, subfolder or file-type limit. It is the only root whose contents are mostly not part of the AI system.
3. **Nothing in the process narrows it.** Process step 1 says "Scan all resolved roots." Your run resolved every root, so every file in Downloads became a candidate. The only membership test anywhere in the skill is the folder a file sits in.
4. **The classification rules route every candidate somewhere.** "Delete a same-session dup like `name (1).ext`... in the same folder" applies to any folder, Downloads included. The APPROVAL-REQUIRED list catches "Deleting or moving anything that is NOT byte-identical" and "Anything you are less than certain about." A personal file in Downloads has to land in one of these buckets. Leaving it out is not an option the rules offer.
5. **The one AI-relevance check isn't defined anywhere.** AUTO-FIX mentions a "recognized Clief/Vault asset," but the skill never lists what counts as recognized. So even the one place that tries to tell AI-system files apart gives the model nothing to recognize with.

**RULED OUT**

- **Judgment (the model classified badly):** Give the model perfect classification and the run still fails. Personal files are in a scan root, so following the rules correctly still surfaces them. Demoted.
- **Undefined "recognized Clief/Vault asset":** Give it a real list and Downloads is still scanned whole, so personal duplicates still surface. This adds to the problem but doesn't cause it.
- **The "when in doubt, report" catch-all:** Remove it and Downloads-internal duplicates still qualify under the same-session dup rule, and non-identical files still qualify under the "NOT byte-identical" approval rule. It makes the list longer but isn't the cause.
- **"Downloads is always the loser" tiebreaker:** This rule only decides which of two copies survives, not whether a file is in scope. Flip it and the same files still surface.
- **Step 0 and surface handling:** All roots resolved in Claude Code, so this branch didn't matter to the run.
- **Safety rule failure:** The Standing Docs were protected, nothing was deleted without approval, and the NEVER rules held. Nothing failed here.
- **Trigger or description wording:** The skill fired when invoked and ran correctly. This is not a never-fired death.

**CONFIDENCE**

Medium, because of author bias and a secondhand run. The cause itself can be proven from the config table and step 1. What's still open is which rule put the 256 MB on the approval list: duplicates inside Downloads, or non-identical files caught by the catch-all. The evidence that would settle it is the dated report that run should have written to `_hygiene\YYYY-MM-DD-hygiene.md`, specifically the reason given for each approval item.

## Response to message 2

You're asking me to rank fixes, and a score out of 10 is still a ranking. Putting your two options in order picks the remedy for you, and that's the one thing I don't do in a diagnosis. I won't score either one, and I won't hint at which I'd lean toward.

Here is the cause again, as a test you can apply to both options yourself. Your description says the skill's job is your AI system. The scan-root table gives it all of `Downloads`. The only test for whether a file is in scope is which folder it's in, and Downloads is the one folder that mostly isn't yours to sweep. Hold each option up against that gap. Ask whether it closes the gap or only moves it, and what each one costs the job Downloads was in the table to do.

If you want to work through the remedy, ask for it in a new request.
