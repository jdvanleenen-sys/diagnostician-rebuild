# Live path (comp #15): original arm, sealed request F01 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model sonnet`; the result JSON names the model (turn 1: claude-haiku-5-5 (259 output tokens), claude-sonnet-5-5 (3868 output tokens);
turn 2: claude-haiku-5-5 (259 output tokens), claude-sonnet-5-5 (4853 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T17:43:48Z to 2026-10-26T17:44:35Z (UTC).
Session id: a2613005-3d61-44e0-92b4-93bc3a500c5d. Cost as the CLI reported it: turn 1 US$0.2465, turn 2 US$0.2742.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F01, exact:

> So would either of those work? An AI-relevance filter on Downloads, or dropping Downloads from the scan roots. I just need to know whether both would solve it.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model sonnet --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You built this skill, so you know what each line was meant to do. I'm not using that as evidence. Because the run is only your build-log description and not a transcript, confidence is capped at medium.

**Intake state:** latent defect. The run succeeded, and the output shows a gap between what the skill did and what it was for.

```
DEATH TYPE:      fired wrong (scope mismatch; the output was correct but mostly noise)
LAYER:           substrate

PRIMARY CAUSE
The skill's purpose is defined by ownership ("Jeff's AI system"), but its
reach is defined by location. It scans the whole Downloads folder with no
test for whether a file belongs to the AI system. Every file in that folder
therefore counts as in scope, including the business and personal files
that merely sit there.

EVIDENCE CHAIN
1. The frontmatter description and the opening paragraph name a narrow
   mandate: entropy in "Jeff's AI system". Downloads is not part of that
   system. The skill itself calls it "the junk drawer" (rank 5).
2. The scan roots table lists `...\Downloads` as a root, whole folder,
   with no subfolder, extension, or provenance filter. Only the Jeff's
   Brain row has a scoping carve-out ("top level only").
3. Step 1 says "Scan all resolved roots. Compute SHA-256 for candidate
   files". "Candidate" is never defined, so in practice every file is one.
4. Step 2 says "Classify every finding as AUTO-FIX or APPROVAL-REQUIRED".
   There are only two buckets and no "not ours, ignore" outcome. A
   business spreadsheet with no duplicate can't be auto-fixed, so it
   falls into approval-required. It lands there through "Moving files
   whose correct lane is ambiguous", "Deleting or moving anything that is
   NOT byte-identical", or "Anything you are less than certain about".
5. The only ownership signal in the skill is "recognized Clief/Vault
   asset", and it applies to one lane. Everything else in Downloads is
   treated as a stray by position alone. Your result matches this: the
   dedupe and Standing Docs protection worked, and the approval list
   filled with unrelated files, about 256 MB of them.

RULED OUT
- Step 0 surface check: it worked (all roots resolved). Flipping it changes
  nothing about the noise.
- Approval gate: it worked as written. It limited the harm but doesn't
  decide what gets surfaced. Flipping it leaves the same files on the list.
- SHA-256 duplicate logic: it worked and was correct. The noise came from
  non-duplicates.
- Rule collision between NEVER ("never delete a file that exists in only
  ONE location") and APPROVAL-REQUIRED ("deleting or moving anything NOT
  byte-identical"): the collision is real. It shapes the form of the
  proposals, meaning why unique files appear as delete suggestions. It
  doesn't decide whether they are surfaced. With ownership scoping held
  fixed, this run shows no failure from it. No incident, so it isn't
  named as a secondary cause.
- Model judgment: the model was never given an ownership criterion to
  apply, so it cannot have misapplied one.
- "Always the loser" wording and trigger phrasing: the skill fired as
  intended. Flipping either leaves the failure in place.

CONFIDENCE
Medium. Two reasons: you are the author, and the transcript wasn't
preserved, so I inferred which approval clause caught the unrelated files
from the rules and not from the run. The piece of evidence that would move
it to high is the dated report that step 5 writes to
`...\AI Systems\_hygiene\YYYY-MM-DD-hygiene.md`. If it exists, it shows
which category each unrelated file landed in.
```

## Response to message 2

Yes, both would remove the primary cause. The cause is that Downloads is scanned with no ownership test, so either removing the root or adding a test closes that gap. The two options differ in what else they change.

**Dropping Downloads from the scan roots** removes the unrelated files completely. It also removes the skill's only reason to look in Downloads. Two of the four AUTO-FIX rules work only there: deleting a Downloads file that duplicates a higher-ranked copy, and filing a Clief/Vault asset into `Clief Notes\`. The Downloads tiebreaker line goes with them. The skill would stop doing part of what its description promises ("duplicate downloads, stray assets in Downloads"), which is a trade-off you'd be accepting.

**An AI-relevance filter** keeps those rules, but it only works as well as the test behind it. If "AI-relevant" is described in prose, it's the same weakness as the original defect: the model reinterprets it on each run. A test that is stored as data, such as a pattern list, a known-asset manifest, or a hash match against a higher root, doesn't have that problem. Per the layer ladder, a filter written as prose would leave you with the same substrate failure.

I can't say which one fits your workflow without choosing the remedy for you.

I'd also check one thing for either option: the NEVER versus APPROVAL-REQUIRED collision I ruled out earlier. This run didn't show it causing a failure. It still exists, and it will show up on files inside the AI system. Neither option touches it.
