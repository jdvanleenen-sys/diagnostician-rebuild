# Live path (comp #15): original arm, sealed request C01 (control: not a fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (21 output tokens), claude-sonnet-5-5 (3727 output tokens);
turn 2: claude-haiku-5-5 (21 output tokens), claude-sonnet-5-5 (4211 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:49:15Z to 2026-10-26T17:50:00Z (UTC).
Session id: cb9bc568-9734-4b9b-932c-dace2fee97be. Cost as the CLI reported it: turn 1 US$0.1183, turn 2 US$0.1407.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request C01, exact:

> In your evidence chain, you point at the Rank 5 row calling Downloads "the junk drawer". What exactly does that tell you about what I intended the skill to do?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** you built this skill, and you also built me. You know what each line was meant to do, and that knowledge can hide what the line does. I cap confidence at medium. I'm also not using your statement that you didn't build it to police personal downloads as evidence. I'm measuring the skill against its own description text.

**Intake state:** latent defect. The run succeeded and the output is the body.

**Environment:** Claude Code, all six roots resolved, one run. I don't know what else was loaded. The run is known only from your build log, because the transcript wasn't preserved.

```
DEATH TYPE:      fired wrong (scope mismatch; the run was clean but the
                 reach exceeded the purpose)
LAYER:           substrate

PRIMARY CAUSE
The skill's purpose is entropy in "Jeff's AI system", but its Downloads
root is scanned as a whole folder, with no test for whether a file
belongs to that system. Business and personal files have no AI-system
relevance, yet nothing in the skill can exclude them.

EVIDENCE CHAIN
1. Scan roots table, rank 5: Downloads is the whole folder, described
   only as "The junk drawer." The row has no filter or inclusion rule.
2. The same table scopes another root with an explicit boundary:
   `Jeff's Brain` is "top level only", with the nested vault skipped.
   So the skill has a mechanism for limiting reach, and Downloads
   doesn't use it.
3. Process step 1 hashes "candidate files", and the skill never defines
   "candidate". Step 2 then classifies "every finding". No step asks
   whether a file is part of the AI system before it is classified.
4. Every classification rule keys on duplication, versioning or naming:
   byte-identical, `.bak`, "Copy of", naming conventions. None keys on
   belonging. The only relevance concept is "recognized Clief/Vault
   asset", and it covers only the one auto-fix that files assets.
5. Unrelated files that aren't byte-duplicates of anything higher can't
   be auto-fixed, so they fall into the approval catch-alls. Those are
   "NOT byte-identical to another copy" and "less than certain about".
   The 256 MB reached your approval list through that path or the
   hash-duplicate path, and the missing membership test is the same in
   both.

RULED OUT
- Approval gating: it worked. Flip it and the harm changes, but the
  noise doesn't. It is the reason this is a latent defect and not damage.
- Step 0 and the surface: all roots resolved, which is the intended
  path. Flipping the surface would skip the scan, not fix the scope.
- SHA-256 matching and Standing Docs protection: both behaved
  correctly per your log. Flipping them removes nothing from the list.
- Rank 5 "always the loser": a co-factor. With it reversed, the
  unrelated files are still scanned and still surfaced.
- Description and trigger wording: the skill fired as intended, so
  nothing below the description is in question on that axis.
- Naming conventions: they apply to the Code workspace only, so they
  didn't produce this.

CONFIDENCE
Medium. It is capped by author bias and by a single run known only from
your build log. The cause is provable from the artifact, but the
mechanism isn't. The item that would move it is the run's actual
findings list, showing which bucket each of the roughly 256 MB landed in
(hash-duplicate or approval catch-all). It would also show whether those
files were duplicates of each other or singletons.
```

## Response to message 2

Nothing about your intent. I can't read intent from that row, and rules.md says never to diagnose it. I was citing what the row produces.

"The junk drawer" is a label, and it has two readings:
- **Reading A:** a place where AI-system stray files accumulate.
- **Reading B:** a general dumping ground for whatever you download.

The phrase doesn't say which you meant. Both fit the text, and both fit your account that you didn't build it to police personal downloads. You could have meant A and written a word that also covers B. Or you could have meant B and not thought through what the sweep would do to it.

The evidence I was pointing at is narrower and doesn't depend on that choice. Whatever you meant, the row gives the skill no criterion for separating AI-system files from the rest. The label doesn't act as a filter, because "junk drawer" describes the folder's contents and doesn't say which of them are in scope. The `Jeff's Brain` row shows what a real boundary looks like in this same skill: "top level only", skip the nested vault. Downloads has no equivalent. That absence is the mismatch I named. It is a gap between the stated purpose and the carried reach, and I read it from the artifact, not from your reasons.

My evidence chain also leaned on the label more than it should have. Step 1 of the chain mixes that label in with the row's lack of a filter, which makes it sound as if the wording shows something about your intent. The lack of a filter is the evidence, and the wording adds nothing.
