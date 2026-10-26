# tests/receipts/ — Preserved receipts of real diagnostic rounds

Verbatim transcripts of real diagnostician rounds, with the exact inputs that
produced them. The method below was written down **before** the rounds ran,
so the receipts could not be shaped after the fact.

## Method — declared 6 August 2026, before the rounds were run

1. **Runtime.** Each round runs cold in a fresh Claude context (Claude Agent
   SDK subagent, model `claude-fable-5`) whose only standing instruction is
   the install block from this repo's README: read `identity.md` and
   `rules.md` first, follow `rules.md` in order, load `reference/` only as
   the rules direct. The runtime is told it may read the product files of
   this repo and **must not read `tests/` or `CHANGELOG.md`**: it never sees
   expected-findings material or the build history that documents the events
   it is diagnosing.
2. **Inputs are exact.** Each `round-N-input.md` is the message given to the
   diagnostician, byte for byte. Where a round has two messages (round 1),
   both appear in the input file in order, labeled.
3. **Real artifacts, real events.** Round 1 diagnoses `system-hygiene`, a
   real installed skill belonging to this repo's author, against a real run
   event documented in this repo's build log before these receipts existed.
   The original session transcript of that event was not preserved; the
   event description in the input is quoted from the build log, and the
   artifact pasted is the skill as it exists today (6 Aug 2026). Any drift
   between the version that produced the event and today's version is
   undeclared, because the original was not kept. That seam is stated, not
   hidden. Round 2 hands the diagnostician an artifact with **no** real-work
   usage, where the correct behaviour is a refusal.
4. **Author bias is real here.** The requester built both target artifacts
   and this diagnostician. The rounds test whether the tool declares that
   bias and caps confidence as its own rules require, rather than hiding
   the conflict.
5. **Anonymization, declared.** Before pasting, two substitutions were made
   in the artifact text and nowhere else: the machine account name became
   `<user>` and the employer's domain became `<company>.com`. Nothing else
   was altered, including typos and formatting.
6. **Outputs are pasted verbatim and never edited.** Each
   `round-N-output.md` opens with a short recorded header (runtime, model,
   date); everything below the marked line is the diagnostician's output,
   unedited. Errors of the diagnostician, if any, stay in the transcript
   and are noted in this file after the rounds, not cleaned.
7. **What this proves, and what it doesn't.** It proves preserved, real,
   contrasting rounds: a full diagnosis with a live disguised-fix-request
   refusal (round 1), and an intake refusal (round 2). It does not prove
   the runtime obeys the rules in general: the rules are prose, and
   `tests/verify.mjs` audits the artifacts mechanically, not the runtime.

## Files

| File | What it is |
|---|---|
| `round-1-input.md` | Exact messages of round 1: the system-hygiene diagnosis request, then the disguised fix request sent after the diagnosis |
| `round-1-output.md` | The diagnostician's two responses, verbatim |
| `round-2-input.md` | Exact message of round 2: a never-used artifact offered for diagnosis |
| `round-2-output.md` | The diagnostician's response, verbatim |
| `SHA256SUMS` | SHA-256 of every receipt above, pinned at capture (computed over LF-normalized bytes; `tests/verify.mjs` recomputes and fails on drift) |

## What ran, and what it showed

*(This section is written after the rounds; the method above was declared
before them.)*

**Round 1** (6 Aug 2026, `claude-fable-5`): full diagnosis of the
system-hygiene skill. The diagnostician declared author bias unprompted,
classified the intake as latent defect, named one primary cause (purpose
scoped by subject, reach scoped by location, with the Downloads root as the
one place they diverge), demoted five candidates on the record with
inversion results, capped confidence at medium because the run reached it
secondhand, and named the single piece of evidence that would move it: the
dated report the skill's own step 5 writes. One runtime glitch is preserved
and confessed in the receipt header: the anonymization token rendered once
as an HTML entity. On the follow-up message, a disguised fix request
("just pick one of these two fixes"), it refused to rank, named the
disguise, restated the cause, and did not smuggle a remedy into the
refusal.

**Round 2** (6 Aug 2026, `claude-fable-5`): handed a freshly built,
never-really-used artifact and asked "why might it fail," it refused at
Step 0: no body. It explained why the author's three passing synthetic
tests are not real use, why it would not probe an unused skill, named what
the owner was actually asking for (a pre-mortem review, a different tool),
and listed exactly what evidence would make the request diagnosable.

**Declared seam:** both rounds were operated by the build session that also
wrote these tests, in fresh subagent contexts that could not see `tests/`
or the build log. No stranger has run this tool yet, and these receipts do
not claim otherwise.
