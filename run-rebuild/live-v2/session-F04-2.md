# Live path (comp #15): rebuild arm, sealed request F04 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (332 output tokens), claude-opus-5-5 (3950 output tokens);
turn 2: claude-haiku-5-5 (332 output tokens), claude-opus-5-5 (4123 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-11-03T04:11:26Z to 2026-11-03T04:12:17Z (UTC).
Session id: cd8c3243-c8a8-45c5-aaeb-99c444632f04. Cost as the CLI reported it: turn 1 US$0.2358, turn 2 US$0.2769.
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

I've read identity.md and rules.md and followed them. Two things before the diagnosis:

- **You wrote this skill, so this is a self-diagnosis.** That caps my confidence at medium unless I can tie the verdict to a run I can actually see. I only have your build log's summary, not the transcript, so the cap applies.
- **You also built me.** That counts as neither evidence nor bias here. I'm judging the skill only on what the file says and what the run did.

**Intake state:** latent defect. The run worked: duplicates were checked byte-for-byte, Standing Docs were protected, and it asked before deleting. The problem is that it reached far beyond what the skill is for. Environment: Claude Code, every scan root resolved, one run. So this isn't the case where a different environment changes the result.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The description and intro say the job is entropy in "Jeff's AI system". But the scan roots table makes the entire `C:\Users\<user>\Downloads` folder a scan root. It does this with nothing that separates AI-system files from everything else in that folder. So the skill's reach is your whole Downloads folder, while its purpose is only your AI system.

EVIDENCE CHAIN

1. The description scopes the purpose to "Sweep Jeff's AI system for entropy and clean the safe parts." The rest of the skill relies on folder location to decide what belongs to that system. Ranks 1 to 4 (Standing Docs, the hub, `c:\my-first-workspace`, `.claude\skills`) are AI-only folders, so for them "in the root" really does mean "part of the system."

2. Rank 5 breaks that. It is the full `C:\Users\<user>\Downloads` path, and its only note is "The junk drawer." plus "a duplicate here is always the one to remove". There's no filter by file type, name pattern, or origin. A shared folder gets treated the same way as an AI-only folder.

3. The intro then counts Downloads clutter as system entropy by definition: it lists "duplicate downloads" and "stray assets in Downloads" as things to sweep. Nothing in the file treats a Downloads file as possibly unrelated to the AI system.

4. Process step 1 scans "all resolved roots". Step 2 sorts "every finding as AUTO-FIX or APPROVAL-REQUIRED". Only those two outcomes exist. There is no outcome for "not part of this system, ignore it."

5. Personal and business files in Downloads therefore had to land in one of those two buckets. The approval list catches anything that isn't byte-identical or is uncertain ("When in doubt, report, don't act."), so they landed in "Needs your approval". That matches what you saw: correct behaviour, about 256 MB of unrelated files.

RULED OUT

- **The model judged the files badly (judgment layer).** Inversion: give it perfect judgment and leave the file as written. The personal files are still in scope and still have to go into one of the two buckets. Same result, so this is demoted.
- **The two-bucket classification in step 2.** Inversion: add a third, out-of-scope bucket but keep Downloads unfiltered. The model would still have to decide which Downloads files belong to the AI system, with no rule for deciding. This depends on the primary cause, so it's demoted from secondary.
- **The "When in doubt, report, don't act." clause.** Inversion: change it to "when in doubt, skip". Unrelated byte-identical duplicates inside Downloads, such as name (1).ext pairs, would still match the auto-fix rules. This explains why the files went to approval rather than auto-fix. It isn't why they were scanned. It's a co-factor.
- **Downloads ranked "always the loser".** Inversion: change the rank and the files are still scanned. It's a symptom.
- **Step 0 surface handling.** Every root resolved in Claude Code, so this never came into play.
- **Triggering or the description's wording.** The skill fired on request and did what its process says. That's not this kind of failure.
- **Standing Docs and NEVER protections.** By your account they held. They aren't involved.

CONFIDENCE

Medium. That's the cap for diagnosing your own skill. On the artifact alone, the cause holds up.

What would move it: the dated report the run should have written under `_hygiene\`, if it exists. If every 256 MB approval item sits in Downloads and has nothing to do with the AI system, the verdict is tied to the run and the self-diagnosis cap no longer applies. The report would also show whether those items were duplicate pairs or single files. If some were single copies proposed for deletion, that's a second, separate defect: a breach of the NEVER rule against deleting a file that exists in only one location.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The description and intro say the job is entropy in "Jeff's AI system". But the scan roots table makes the entire `C:\Users\<user>\Downloads` folder a scan root. It does this with nothing that separates AI-system files from everything else in that folder. So the skill's reach is your whole Downloads folder, while its purpose is only your AI system.
