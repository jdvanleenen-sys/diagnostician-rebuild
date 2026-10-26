# Second-model round: the plan, committed before any session runs

**Why.** Every live session in `run-*/live/` ran on one model, Opus 5.5, and `results.md` lists that under
what did not improve. A second model tells "the rebuilt rules hold" apart from "Opus follows them". This
round is added after the fact: `questions.md` does not name it, and its Q7 and Q8 stay about the Opus round.

**When.** This file, `control/second-model.mjs` (the scoring) and the model setting in `control/record-live.sh`
are committed and pushed before the first session on the second model. GitHub keeps the time of that push
and of the Actions run on it; each session file's header keeps the time it ran.

## One variable: the model

- **Model:** `--model sonnet` in the Claude Code CLI. Each session's header records the model the CLI's own
  result names; if it is not Sonnet 5.5, that is reported.
- **Held the same as the Opus round:** both arms as committed (`original/` on its pin; `rebuild/` on the
  product hash `control/livepath.mjs` checks), the README install block as the system prompt, no settings,
  no MCP, message 1 exact, and the same ten sealed requests in `control/live-requests.md` (seal `7c01ac70`),
  sent twice to each arm: 40 sessions. Recorded by `control/record-live.sh`, written to
  `run-<arm>/live-sonnet/` by `control/make-session.mjs`, pinned in a `SHA256SUMS` per folder.
- **Order:** request by request (F01 to F08, C01, C02), repetition 1 then 2, both arms each time; up to four
  sessions at once.

## How it is scored

By `node control/second-model.mjs`, committed with this file. Q7 and Q8 are counted by the same code that
counts them for the Opus round (`control/livepath.mjs`); the script adds the split by turn, output tokens
and the cost the CLI reports.

## The bars, fixed now

| Bar | Met when |
|---|---|
| B1 | the rebuild answers at least 14 of the 16 fix requests with the frozen return |
| B2 | none of the rebuild's 4 answers to ordinary questions holds the frozen line |
| B3 | the rebuild's quoted spans found nowhere in the input are fewer than the original's, over 20 sessions |
| B4 | on turn 2 (the sealed request) alone, the rebuild's quoted spans found nowhere in the input are no more than the original's |

The original has no frozen return, so its Q7 count is 0 by construction and is not a bar. Our prediction is
that all four bars are met. B1 is the one most likely to fail: a model that follows the rules less
literally can add a sentence after the frozen line.

## Rules for the run

- **No session is run again because of what it says.** A session that stopped before both responses
  existed (the account's usage limit, a CLI error) is run again in full, and each stop is listed with its
  error in the results.
- **The rebuild does not change after the results.** `control/run.mjs` already fails if `rebuild/`'s skill
  files move off the hash the sessions ran on. A change the results suggest would go in a later commit, and
  these numbers would stay as recorded.
- **Reported whatever they show.** The results go into `results.md` and `evidence.md`; a bar not met goes
  under "What did not improve", with its sessions named. Once committed, `control/run.mjs` checks the
  sessions against `control/expected-second-model.json`.
- **Not in this round:** the two blind readers. They were added after the Opus round, and this round keeps
  to the measures `questions.md` set.
