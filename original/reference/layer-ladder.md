# The Layer Ladder (60/30/10)

A working AI build is roughly **60% substrate, 30% orchestration, 10% judgment**. That ratio is a claim about where the work lives, and by extension about where failures live.

Diagnosis uses it as a locator. Once you know which layer a failure sits in, most of the candidate causes eliminate themselves.

---

## The three layers

### Substrate (60%)

The things that must already exist for the skill to have anything to work with: template files, layout specs, schemas, reference documents, data, connectors, credentials, installed sibling skills, folder structure.

**Tells that you are in the substrate layer**
- The skill references something by name that does not exist as a file.
- The output drifts on exactly the dimensions the skill described in prose.
- Same skill text, different environment, different result.
- The skill needs a capability the invoking *surface* does not have (filesystem, connector, tool). Same skill, different surface (Claude Code vs Desktop vs a plain chat), different result.
- The skill asks the model to reconstruct at run time something that could have been stored once.

### Orchestration (30%)

The sequencing and routing. When it triggers, what loads at which step, what order things happen in, where the human checks, what gets handed to whom.

**Tells that you are in the orchestration layer**
- The skill has the right materials and applies them at the wrong moment.
- It loads everything at once, so the specific parts get compressed to fit.
- Two skills contest the same trigger.
- A step that depends on a human remembering to do it, with nothing holding the sequence together if they are busy.

### Judgment (10%)

The part where the model actually has to reason: classify, weigh, synthesize, choose.

**Tells that you are in the judgment layer**
- The skill supplied real materials, routed them correctly, and the call the model made was wrong.
- The task genuinely has no correct deterministic answer.

Real judgment failures are rare. Before accepting one, check that the model was actually given what it needed to make the call. Most apparent judgment failures are substrate failures where the model was asked to invent the criteria and then blamed for inventing them badly.

---

## The data test

The fastest substrate check available, and it works on a single output without needing a second run.

Take one output and sort everything in it into two piles:

- **Stored as data** in the skill: literal values, hex codes, numbers, exact strings, file paths, code, templates.
- **Described in prose**: structure, layout, tone, format, identity, anything explained in sentences.

Then check which pile survived.

Prose descriptions get re-interpreted on every run, so anything held that way drifts by design and the drift is invisible to the builder, because each individual output looks reasonable. Data does not drift. It is copied.

**If the data pile came through intact and the prose pile was improvised, you have a substrate failure, and you can point at exactly which instructions were structurally incapable of holding.** No comparison run required.

This also tells you what the skill was really asking the model to do. Anything in the prose pile that the skill claims must be consistent across runs was never a consistency requirement; it was a suggestion wearing one.

## The inversion within the ratio

The most useful diagnostic move the ratio provides:

> **Compare where the effort went to where the failure is.**

A skill built almost entirely of instructions about how the model should think, sitting on no files, has inverted the ratio. It is 10% work standing where 60% work should be. That build fails on specificity, reliably, and the failure will look like the model being lazy.

The reverse inversion exists too and is rarer: elaborate substrate, no orchestration, so nothing ever routes to the files that were built.

---

## Costume check

Failures dress up as other layers. Three common disguises:

| Looks like | Usually is | How to tell |
|---|---|---|
| The model ignored my instructions (judgment) | Substrate | The instruction described an artifact instead of storing one |
| The skill is badly written (substrate) | Orchestration | The content is fine; it loads at the wrong time or all at once |
| Nobody adopted it (orchestration) | Substrate | The input source changed shape and output quietly degraded |

---

## Boundary

The ladder locates a failure. It does not name a cause on its own. "This is a substrate failure" is a location, not a diagnosis. You still have to say which specific thing was assumed present and was not, and show what in the artifact assumed it.
