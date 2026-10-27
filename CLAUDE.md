# CLAUDE.md

Routes only. This repo is a comp #15 rebuild: `original/` against `rebuild/`, judged on `feedback.md`.

| You want to | Go to |
|---|---|
| Know what the judges asked for | `feedback.md` |
| See the questions aimed at it | `questions.md` (frozen since commit 2) |
| Check every result | run `node control/run.mjs`; expect `RESULT: pass` |
| Read what changed, what did not, and why | `results.md` |
| See the detail behind a number (live round, lab, held-out set, provenance) | `evidence.md` |
| See the two rounds planned and pushed before their data | `control/second-model-plan.md`, `control/prospective-plan.md` |
| Run the rebuilt skill | `rebuild/README.md` (its install block) |
| Know how a check works | `rebuild/tests/README.md`, then `control/` |

Never edit `original/`, `feedback.md`, `questions.md`, any `tests/receipts/` file, or any session under
`run-*/live*/`: they are pinned, and `node control/run.mjs` reports an integrity violation if they change.
