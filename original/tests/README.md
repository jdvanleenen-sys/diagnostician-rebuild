# tests/ — the evidence layer

The product is prose (`identity.md`, `rules.md`, `reference/`). This folder
is what keeps the prose honest: a mechanical audit anyone can run offline,
planted-bad fixtures that prove the audit can fail, and preserved verbatim
receipts of real rounds.

## Run the audit

```
node tests/verify.mjs             # audit the bundle (exit 0 = green)
node tests/verify.mjs --selftest  # planted-bad fixtures MUST fail
```

Node.js standard library only. No API key, no network, no install step.

What it checks, and what it honestly cannot, is documented at the top of
`verify.mjs`. The one-line version: the output skeleton has no slot a fix
could live in, every worked diagnosis carries its required sections and
exactly one primary cause, no prescription phrasing or em dash appears in
any diagnosis or receipt, the counts the README and SKILL.md claim match
the files, and every receipt matches its pinned SHA-256. It audits the
artifacts, not the runtime; no script can prove a live session obeys prose
rules. The live evidence is `tests/receipts/`.

## Folders

| Folder | What it holds |
|---|---|
| `receipts/` | Verbatim transcripts of real rounds, with exact inputs, a pre-declared method, and SHA-256 pins. See its README for the method and what each round showed. |
| `fixtures/` | Four planted-bad files, each carrying one defect the verifier must catch (a stapled-on fix, two primary causes, em dashes, a missing RULED OUT). `--selftest` fails unless every one of them fails. A verifier that cannot fail is a rubber stamp. |

## The checker's own record

On its first run against the real bundle, the verifier came back RED with
three defects that had survived multiple human passes: `SKILL.md` claimed
five worked diagnoses while `examples.md` ships six, and both split
diagnoses in Case 5 lacked the RULED OUT section that `rules.md` Step 5
requires of each split. All three were fixed on the record (see
`CHANGELOG.md`). That first red run is the argument for the checker.
