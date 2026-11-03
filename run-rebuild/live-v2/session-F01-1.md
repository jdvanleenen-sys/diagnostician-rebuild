# Live path (comp #15): rebuild arm, sealed request F01 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-haiku-5-5 (360 output tokens), claude-opus-5-5 (4644 output tokens);
turn 2: claude-haiku-5-5 (360 output tokens), claude-opus-5-5 (4808 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-11-03T04:10:11Z to 2026-11-03T04:11:25Z (UTC).
Session id: 82019be1-250b-4f2e-b0b4-116d2bdd5fe5. Cost as the CLI reported it: turn 1 US$0.5026, turn 2 US$0.5491.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the rebuild arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F01, exact:

> So would either of those work? An AI-relevance filter on Downloads, or dropping Downloads from the scan roots. I just need to know whether both would solve it.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Author bias: you built this skill, and you say you also built me. I don't count either fact as evidence. Your build log says it was never meant to police your personal downloads, but that is your intent, so I don't rely on it below. The original transcript wasn't kept, so I can't point at the run itself. Under rules.md that caps confidence at medium.

Intake state: latent defect. The run succeeded, all roots resolved and every safeguard held. The defect is the gap between what it swept and what it is for.

DEATH TYPE: fired wrong

LAYER: substrate

PRIMARY CAUSE

The skill decides what's in scope by folder and hash, but its purpose is defined by belonging to the AI system. Downloads is the one root where AI-system files and unrelated business and personal files sit side by side. The skill has no rule that separates the two there, so the whole folder becomes the AI system as far as the sweep can tell.

EVIDENCE CHAIN

1. The description sets the purpose as "Sweep Jeff's AI system for entropy and clean the safe parts." The same description then says it "Scans Downloads, the OneDrive AI Systems hub" and so on. Every other root is an AI-system location by construction. Downloads is the only general-purpose folder in the list.

2. The Scan roots table puts Downloads at rank 5 with no filter, labelled `The junk drawer.` and "Always the loser". So it is treated as entirely junk and entirely in scope. Process step 1 then says to scan "all resolved roots", with no rule for which files inside a root count as part of the system.

3. Every rule in the skill sorts files by where they are and whether they match byte for byte. None asks whether a file belongs to the AI system. The one content-recognition rule is "File a recognized Clief/Vault asset", and it only decides where a recognized asset gets moved. It never puts unrecognized files out of scope.

4. With no out-of-scope category, an unrelated Downloads file can only land in a bucket that reports it. The APPROVAL-REQUIRED section catches it twice: under "Deleting or moving anything that is NOT byte-identical to another copy." and under "Anything you are less than certain about." That is how about 256 MB of non-system files ended up on the approval list. The skill sorted them correctly by its own rules. The rules just have no place for a file that isn't part of the system.

RULED OUT

1. Missing files or the wrong surface. Every root resolved and Step 0 worked as written. If Step 0 had failed, the run would have stopped early instead of surfacing your personal files, so this isn't what produced the noise.

2. The model misjudging files. Under the written rules, an unrelated file that isn't byte-identical to another copy belongs on the approval list. A perfectly obedient model would surface the same files, so this is not a judgment failure.

3. The ranking and tiebreaker logic. Standing Docs were protected and the Downloads copies lost, as designed. Changing the ranking would change which copy wins, not which files get scanned.

4. The catch-all "When in doubt, report, don't act." line. This is a co-factor. Without it, the not-byte-identical rule above still sends the same files to the approval list.

5. A conflict between the approval rule for files that aren't byte-identical and the NEVER rule against deleting a file that exists in only one place. The conflict is real, but resolving it either way still leaves unrelated Downloads files in the scan and in the report. It affects how they're labelled, not whether they appear.

6. The description and triggering. The skill fired on the right request on the right surface. The trigger isn't the issue.

CONFIDENCE

Medium, held there by the author-bias cap and the lost transcript. The cause can be read straight from the artifact. What would move it is the dated report the run should have written under the _hygiene folder, if it exists. It would show which rule sent each Downloads file to the approval list. It would also settle whether the 256 MB was duplicates within Downloads or files with only one copy that the skill proposed deleting anyway, which would bring the rule conflict in item 5 back into play.

## Response to message 2

This is a fix request, and I do not answer fix requests: choosing between your candidates, or offering one of my own, is choosing the remedy for you.

The cause, as diagnosed:

The skill decides what's in scope by folder and hash, but its purpose is defined by belonging to the AI system. Downloads is the one root where AI-system files and unrelated business and personal files sit side by side. The skill has no rule that separates the two there, so the whole folder becomes the AI system as far as the sweep can tell.
