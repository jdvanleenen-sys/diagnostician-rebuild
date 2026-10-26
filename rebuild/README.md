# The Skill Diagnostician

A folder-based diagnostician that tells you **why your Claude Skill or agent folder didn't work.** Not how to fix it. Why it failed.

You built a skill. You ran it. It came out generic, or it never triggered, or it worked fine and you quietly went back to doing the thing by hand. This tells you which of those happened and what caused it, and then it stops talking.

## Who this is for

People who build Claude Skills, `CLAUDE.md` workspaces, or agent folders and have at least one sitting in a repo that underperforms. If you have never shipped one, there is nothing here for you yet.

## What it does

1. Establishes **time of death**: never fired, fired wrong, or fired and abandoned. These three share almost no causes, so this decides everything downstream.
2. Locates the failure on the **60/30/10 ladder**: substrate, orchestration, or judgment.
3. Runs **counterfactual inversion** on every candidate cause: flip one thing, hold the rest, does it still fail? If yes, it was a symptom.
4. Names **one primary cause**, shows the evidence chain, lists what it ruled out and why, states its confidence.
5. Stops.

## What it deliberately does not do

- It will not rewrite your skill.
- It will not give you a fix, even if you ask in the same message. Ask again afterward and it will answer separately.
- It will not answer the fix request in disguise either: "what would you have done differently," "how would you rebuild it," "which of these fixes should I pick," "show me a version that works." Ranking your candidate fixes is choosing the remedy; `identity.md` names every disguise it refuses.
- It will not hand you a ranked list of everything wrong. A list of twelve findings is a symptom inventory.
- It will not diagnose a skill you have never run. No failure event, no diagnosis.
- It will not invent a cause when the evidence is thin. It will tell you what evidence would settle it.

## Install

Drop the folder into a Claude Project (upload the files as Project knowledge), or into a repo you open with Claude Code. Then paste this into the Project instructions:

```
You are the Skill Diagnostician. Read identity.md and rules.md
before responding. Follow rules.md in order, every time. Load
reference files only as rules.md directs.
```

## Use

Give it two things:

| You provide | Example |
|---|---|
| **The artifact** | Paste the `SKILL.md`, or point it at the folder |
| **The failure event** | "Ran it on four meetings, every dashboard came out identical" |

Both are required. The artifact alone gets you a critique, which is a different tool.

Then ask: **why did this fail?**

## What you get back

```
DEATH TYPE:      Fired wrong
LAYER:           Substrate

PRIMARY CAUSE
[one mismatch, in one or two sentences]

EVIDENCE CHAIN
[3 to 5 steps, each citing a specific line or missing file]

RULED OUT
[demoted candidates, each with the inversion result]

CONFIDENCE
[high / medium / low, and what would move it]
```

See `examples.md` for six full worked diagnoses.

## Files

| File | Job |
|---|---|
| `SKILL.md` | Entry point: frontmatter triggers plus the load order for the files below |
| `WRITEUP.md` | What this is, the one design decision that matters, and what is honestly missing |
| `identity.md` | Who the diagnostician is, what it requires, what it refuses |
| `rules.md` | The eight-step procedure, cause versus symptom tests, output format |
| `examples.md` | Six worked diagnoses: one per death type, a refusal, a two-failure split, and a latent defect |
| `reference/death-types.md` | Signals and cause sets for each of the three deaths |
| `reference/layer-ladder.md` | 60/30/10 applied to skill builds, the data test, and the costume check |
| `reference/probes.md` | How to manufacture a real failure event when the owner suspects but cannot point at one |
| `tests/verify.mjs` | Offline mechanical audit of the bundle, with a selftest that proves it can fail |
| `tests/receipts/` | Verbatim transcripts of real rounds: pre-declared method, exact inputs, SHA-256 pins |
| `tests/fixtures/` | Planted-bad files the selftest must catch, one defect each |

`rules.md` says when to load the reference files. They are shelves, not required reading. The `tests/` folder is evidence, not product: the runtime never loads it.

## Verify it yourself

```
node tests/verify.mjs             # the audit: it stays red, because the archived receipts keep their defects and are never edited (tests/README.md)
node tests/verify.mjs --selftest  # planted-bad fixtures MUST fail
```

The audit being red is not the checker failing; it is the checker reporting the record. The acceptance check that proves the checker behaves as promised is `node control/run.mjs` at the root of the comp repo, one level up.

Offline, Node standard library only, no API key. The audit covers the artifacts (no fix slot in the skeleton, one primary cause per diagnosis, no prescription phrasing or em dashes in any diagnosis or receipt, claimed counts match the files, receipts match their pinned hashes). It cannot prove a live session obeys prose rules; the live evidence is the preserved receipts in `tests/receipts/`, whose method was declared before the rounds ran and whose errors stay in the transcripts.

## The idea behind it

Most feedback on a broken build is an audit: here are eleven things that are wrong. That is easy to produce and nearly useless, because it does not tell you which one is killing you. A diagnosis ranks. It names one cause, shows how it got there, and separates the thing that caused the failure from the things that merely accompanied it.

The test that does the work is inversion. Flip a candidate and re-run the failure in your head. If it still fails, you were looking at a symptom. Most audit findings do not survive that test, which is exactly why an audit and a diagnosis are different products.

## Method

Built on Interpretable Context Methodology: folders as architecture, one file one job, load only what the step needs. Method by Van Clief and McDermott, arXiv:2603.16021, MIT-licensed.

The 60/30/10 ratio is used here as a locator for failures rather than as a build guideline.

## Licence

MIT.
