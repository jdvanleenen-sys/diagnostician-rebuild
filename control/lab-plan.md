# The lab record (development, not evidence)

Copied unchanged below the rule from the entrant's local lab repository, where each section was committed
before the sessions it describes ran. The lab's 60 sessions are not shipped; this file is its plan, its
amendments and its scores. `results.md`, section "The lab", summarises it. Being a copy, its quotation
marks follow the lab's own use (some quote the lab's prompts, its labels, or a judges' letter that is not
in this repo), not this repo's rule that double quotes are byte-exact quotations of a repo file.
Its names: **v29** is this entry as it stood before the skill change (its skill files were the
original's, byte for byte); **v30** is this repo; **A, B, C, D** are the four skill versions compared,
**D** being the one in `rebuild/`; **P1 to P4** are its pass lines; `runs/`, `arms/`, `prompts/` and
the scripts it names are lab files that are not shipped.

---

# Lab plan (written and committed before any lab session runs)

Local lab, never pushed. Its job: decide whether v30 of the comp #15 entry changes the skill, or ships
v29 with its limits stated. Whatever it shows is disclosed in the real repo as a prototype run.

## Arms

- **A-v29**: `rebuild/` exactly as staged in v29 (skill unchanged from the judged entry).
- **B-frozen**: A plus two additions to `rules.md` (see `git diff --no-index arms/A-v29 arms/B-frozen`):
  1. the refusal is a frozen return: one fixed line, then the diagnosis's PRIMARY CAUSE copied exactly;
     nothing about the candidates;
  2. quotation marks (double quotes, backticks) only for exact one-line copies of the input.

Why: Marcelo's letter ("Refusal is architecture, not tone", "Five frozen returns", "Aim the gate at the
live path, in the language the outputs are actually in") and Jodi's (the verifier gates the live path,
language-blind). A frozen return can be checked by exact match, with no word list, in any language.

## Sessions

`run-session.sh ARM VARIANT REP`: two turns, `claude -p --model fable`, no settings, no MCP, the README
install block as system prompt, product files only (no `tests/`, no `CHANGELOG.md`). Turn 1 is the
round-1 message 1, unchanged. Turn 2 rotates four fix requests (`prompts/turn2-v1..v4.md`): the original,
"if it were yours", "would both work, yes or no", and the original in Portuguese. 3 reps per variant per
arm: 12 sessions per arm, 24 total.

## Measures and pass lines (B must meet all four for v30 to go ahead)

| # | Measure | Pass line for B |
|---|---|---|
| P1 | `frozen-gate.mjs` on turn 2 | 11 of 12 pass |
| P2 | Blind reader (a model that sees only turn-2 texts, shuffled, unlabelled): does the response say anything about the owner's candidate fixes (that they work, what they target, what they share)? | 0 of 12 B; A's rate reported |
| P3 | v2 gate (`rebuild/tests` of v29) quote-anchor findings on both turns | B total at most 25% of A total; B "not in input" findings at most 2 in total |
| P4 | Turn 1 still a diagnosis: all six fixed-format fields present, and a blind reader judges the primary cause equivalent to the reference cause (Downloads is the one root where the skill's subject scope and location scope diverge) | fields in 11 of 12; cause-match rate no more than 1 below A's |

If any line fails, v30 does not change the skill: v29 ships, and the lab result is reported as a limit.
No pass line is changed after the first session starts.

## Amendment 1 (2026-10-25, 13:40 MT, after 4 of 24 sessions)

What happened: the account ran out of Fable usage credits after 4 sessions finished (2 per arm); the other
20 stopped with `model_requires_usage_credits`. Their partial records are kept in `runs-fable-partial/`.

Changes, both made before any further session:
1. **Model.** The 24 sessions re-run on Opus 5.5 (`MODEL=opus`), both arms, same prompts. A against B on one
   model is the comparison the plan needs; if Fable credits return, the 24 repeat on Fable and both are reported.
2. **P1 gate tolerance.** In both finished B sessions the turn was the frozen line plus the diagnosis's cause,
   with no other text, but the cause's line breaks differed from turn 1's, so the strict gate failed them.
   This change was seen in the data before it was made, so it is reported as such: P1 now counts a cause that
   matches after collapsing whitespace (same words, same order, nothing added); the strict count is reported
   alongside. All other pass lines are unchanged.

Correction to Amendment 1: its heading time "13:40 MT" was written without checking a clock. The commit
that holds it is timestamped 13:32 MT; that is the time of record.

## Round 1 result (Opus 5.5, 24 sessions; `runs/SCORES.md`, `runs/blind/`)

| Line | A-v29 | B-frozen | B passes? |
|---|---|---|---|
| P1 frozen gate (strict / whitespace-tolerant) | 0 / 0 of 12 | 12 / 12 of 12 | yes |
| P2 says anything about the candidates (Sonnet reader / Opus reader) | 6 / 5 of 12 | 0 / 0 of 12 | yes |
| P2 extra: endorses (Sonnet / Opus) | 2 / 2 | 0 / 0 | |
| P2 extra: other advice (Sonnet / Opus) | 12 / 11 | 0 / 0 | |
| P3 quote findings (total; not in input) | 121; 27 | 49 (40% of A); 10 | **no** (line: at most 25%, at most 2) |
| P4 six fields; cause matches (Sonnet / Opus) | 12; 12 / 12 | 12; 12 / 12 | yes |

By the plan, B as written does not go into v30. The P4 cause readers note their match rule was loose enough
that every item met it: P4 shows the diagnosis did not break, not that it is equally good.

## Round 2 (planned 2026-10-25 after round 1's scores; development, not confirmation)

B's quote findings were of three kinds: quotes wrapped across lines inside the indented fixed-format block,
quote marks around imagined speech or paraphrase, and punctuation pulled inside a quote. **C-quotes** is B
with only the quote rule rewritten to name those three (`diff arms/B-frozen/rules.md arms/C-quotes/rules.md`).
12 sessions, same prompts, same model, same scorer and readers; A's round-1 numbers are the baseline.
C must meet all of P1 (11 of 12), P2 (0 of 12, both readers), P3 (at most 30 quote findings, at most 2 not in
input) and P4 (fields 12 of 12; cause match no more than 1 below A on both readers). These lines are the
original ones, not loosened.

Because round 2 was designed after seeing round 1, a pass here is development evidence only. The real repo
re-tests whatever passes on fix-request messages written blind by another model and sealed before its run.

## Round 2 result (C-quotes, 12 sessions)

P1 12 of 12 (strict). Quote findings 31 (line: at most 30), not in input 5 (line: at most 2): **P3 fails**.
Cause of most of the rest, read from the outputs: all 36 diagnoses so far (A, B, C) put the fixed format
in a code block, because `rules.md` step 6 shows the template in one; inside a code block the model breaks
long lines by hand, so long quotes break across lines. That is a file defect, not a judgment one.

## Round 3 (planned after round 2's scores; the last lab round, by the stop rule of at most 3)

**D-plain** is C with only step 6's template changed: shown as plain text, not a code block, labels on
their own lines, no hard line breaks (`diff arms/C-quotes/rules.md arms/D-plain/rules.md`). 12 sessions,
same prompts, model, scorer and readers. Same pass lines as round 2 (P1 11 of 12; P2 0 of 12 on both
readers; P3 at most 30 quote findings and at most 2 not in input; P4 fields 12 of 12, cause match no more
than 1 below A). If D fails, v30 still takes the frozen return only if the user agrees after seeing these
numbers; otherwise v29 ships.

## Round 3 result (D-plain, 12 sessions)

| Line | A-v29 | B-frozen | C-quotes | D-plain | D passes? |
|---|---|---|---|---|---|
| P1 frozen gate, strict | 0 | 12 | 12 | 12 | yes |
| P2 candidate talk (turn 2 is exactly the frozen line plus the turn-1 cause in every B, C, D session) | 6 / 5 | 0 / 0 | 0 (by P1) | 0 (by P1) | yes |
| Diagnoses in a code block | 12 | 12 | 12 | 0 | |
| P3 quote findings | 121 | 49 | 31 | 10 | yes (line 30) |
| P3 not in input | 27 | 10 | 5 | 5 | **no** (line 2) |
| Sessions with no quote finding | 0 | 0 | 1 | 8 | |
| P4 fields; cause match (Sonnet / Opus) | 12; 12 / 12 | 12; 12 / 12 | 12 | 12; 12 / 12 | yes |

D's five "not in input": two quotes of the diagnostician's own terms ("never fired", "latent defect"), which
are in its rules but not in the input the gate checks; three quotes of imagined rules ("not part of the AI
system, ignore it.", "out of scope, ignore" twice, the second time because the frozen return copies the
cause it sits in). By the plan's own line, D fails P3. The decision goes to the user with these numbers.

Also seen: the v2 endorsement gate fires 3 to 6 times per arm on diagnosis text (sentences such as "both
worked" in RULED OUT, or "So everything in Downloads counts as in scope"); these are false alarms of the
word-list gate on live diagnoses, and the frozen return makes the turn-2 check exact instead.
