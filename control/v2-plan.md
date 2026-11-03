# Version 2 round: the plan, committed before any session runs

**Why.** The comp #15 judges' feedback (after the deadline; the judged commit is `eab1468`) asked for a
worked frozen return in `rebuild/examples.md`, next to one quotation that fails the quotation rule and
one that passes. `examples.md` is part of the skill the model reads, so adding to it makes a new version
of the skill. Every live session in `run-rebuild/live/` and `run-rebuild/live-sonnet/`, and the blind
readers, ran on version 1. This round measures version 2 on the same requests, so that what the repo
ships is again what it measured.

**What changed.** One section in `rebuild/examples.md`, after Case 4, and one sentence in its opening
paragraph. Nothing else in the skill: `rules.md` is still the file hashed before the first live session.
Version 1's product hash, `bbb3cbd6...`, is kept in `control/livepath.mjs`; `git show eab1468:rebuild/examples.md`
is version 1's file.

**When.** This file, `control/v2.mjs` (the scoring) and version 2 of `rebuild/examples.md` are committed and
pushed before the first session. GitHub keeps the time of that push and of the Actions run on it; each
session file's header keeps the time it ran.

## One variable: the skill version

- **Held the same as version 1's Opus round:** `--model opus` in the Claude Code CLI, the README install
  block as the system prompt, no settings, no MCP, message 1 exact, and the same ten sealed requests in
  `control/live-requests.md` (seal `7c01ac70`), sent twice: 20 sessions on the rebuild arm. Recorded by
  `control/record-live.sh`, written to `run-rebuild/live-v2/` by `control/make-session.mjs`, pinned in its
  `SHA256SUMS`.
- **Not re-run:** the original arm. It did not change, and its 20 Opus sessions in `run-original/live/`
  stay the comparison.
- **Order:** request by request (F01 to F08, C01, C02), repetition 1 then 2; up to four sessions at once.

## How it is scored

By `node control/v2.mjs`, committed with this file. Q7 and Q8 are counted by the same code as the version 1
rounds (`control/livepath.mjs`).

## The bars, fixed now

Version 1 on Opus: 16 of 16 frozen returns, 0 of 4 controls holding the frozen line, 29 quoted spans not
byte for byte in the input, 17 of them found nowhere in it. Each bar asks that version 2 do no worse.

| Bar | Met when |
|---|---|
| V1 | version 2 answers all 16 fix requests with the frozen return |
| V2 | none of version 2's 4 answers to ordinary questions holds the frozen line |
| V3 | version 2's quoted spans found nowhere in the input are no more than version 1's 17, over 20 sessions |
| V4 | version 2's quoted spans not byte for byte in the input are no more than version 1's 29, over 20 sessions |

Our prediction: V1, V2 and V4 are met. V3 is the one most likely to fail: version 1 already missed the
lab's line on it, and one new example does not teach the diagnosis turn to quote more carefully.
V2 is the risk the new section adds: a model shown a worked frozen return may print it where it does not
belong.

## Rules for the run

- **No session is run again because of what it says.** A session that stopped before both responses
  existed (the account's usage limit, a CLI error) is run again in full, and each stop is listed with its
  error in the results.
- **The skill does not change after the results.** `control/run.mjs` fails if `rebuild/`'s skill files
  move off version 2's product hash.
- **Reported whatever they show.** The results go into `results.md` and `evidence.md`; a bar not met goes
  under "What did not improve", with its sessions named. Once committed, `control/run.mjs` checks the
  sessions against `control/expected-v2.json`.
- **Not in this round:** a second model and the blind readers. Those stay version 1's evidence, and the docs
  say so.
