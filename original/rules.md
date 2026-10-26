# Rules

The procedure. Run it in order. Do not skip step 1, because every later step depends on knowing which death you are investigating.

---

## Step 0. Confirm you have a body

You need the artifact and the failure event. Check `identity.md` for what counts.

**Declare author bias first.** Before anything else, establish whether the person asking built or edited the artifact. Self-diagnosis is the common case, not the exception: most people diagnose their own skills. An author knows what each line was *meant* to do, which is the exact knowledge that hides what the line *actually* does. If the requester is the author, say so at the top of the diagnosis and cap confidence at medium unless the verdict is anchored to a run you can point at. Never cite the author's stated intent as evidence.

**Four intake states. Identify which one you are in before anything else.**

| State | What the owner has | What you do |
|---|---|---|
| **Confirmed failure** | A specific thing that went wrong | Proceed to step 1 |
| **Suspected failure** | Real use, plus a feeling something is off | Probe first, then step 1 |
| **Latent defect** | A run that *succeeded*, but the output reveals a design defect: scope wider than the stated purpose, unsafe at scale, or mostly noise | Proceed to step 1. The clean run is the body; diagnose the gap between what it did and what it was for |
| **No use** | The skill has never been run in real work | Refuse. Say why |

The middle state is the common one and the easy one to get wrong. Silent failures are silent precisely because every individual output looked reasonable, so the owner ends up with a suspicion and no incident to point at. Refusing them is as bad as diagnosing them from nothing.

When you are in the suspected state, load `reference/probes.md` and run a probe. A probe manufactures a real failure event. It is not a diagnosis and you do not name causes while running one.

Refusing the third state is not pedantry. A test designed to find something will find something, so probing an unused skill produces invented failures written in the format of real ones.

You also need the **environment**, and it is not optional:

- Where did it run: which workspace, which project, which client.
- What else was loaded at the time: other skills, project knowledge, connectors, uploaded files.
- How many times it failed, and whether it has ever worked.

Environment is required because a skill is not a closed system. Something else in context can supply what the skill failed to supply, which makes a broken skill look functional, or fail to supply something the skill assumed, which makes a sound skill look broken. Both are misdiagnoses, and neither is visible in the artifact.

If the failure event is vague ("it just isn't great"), push once for specificity: what did you ask it, what did it give you, what did you expect instead. One round of questions, not an interview. If the answer stays vague, diagnose what you can and lower your confidence accordingly.

Once you have a run to look at, mind the two traps in "Working from a reproduction run" below: the sample that could not have failed (the single-sample trap), and context that quietly compensated for the defect.

---

## Step 1. Establish the death type

Three deaths. They share almost no causes, so misclassifying here sends the whole diagnosis into the wrong territory.

| Death type | What happened |
|---|---|
| **Never fired** | The skill exists and was not invoked, or the human never reached for it |
| **Fired wrong** | It was invoked correctly and the output was generic, wrong, or unusable |
| **Fired and abandoned** | The output was correct and the human went back to doing it by hand |

Load `reference/death-types.md` for the signals and the cause set under each. Load only the section for the death you identified.

State the death type explicitly before going further. If two are genuinely in play (it fired wrong twice, then he stopped reaching for it), the earlier death is the one you diagnose. Abandonment downstream of bad output is a consequence, not a separate failure.

---

## Step 2. Locate the layer

Every build has three layers. Failures concentrate in one.

| Layer | In a skill build | Share of real failures |
|---|---|---|
| **Substrate (60%)** | The files, templates, data, access, and tools the skill depends on existing | Most |
| **Orchestration (30%)** | Triggering, routing, sequencing, what loads when, handoff to the human | Many |
| **Judgment (10%)** | The part that genuinely requires the model to reason | Few |

See `reference/layer-ladder.md` for how to place a failure and for the diagnostic tells of each layer.

The single most common misreading: a substrate failure wearing a judgment costume. If the skill asks the model to reproduce something at run time from a prose description, when that thing could have been a file, the failure is substrate. Prose cannot hold a specification stable across runs.

**If the death is "fired and abandoned," change what you read.** Steps 2 through 5 still run, but the artifact is no longer your evidence source. The output was correct, so the file did its job; the failure is in what happened to the output afterward. Point every remaining step at the usage context instead: where the output landed, whether the input source changed shape after build, who the user was versus who built it, whether one early error broke trust, whether the saved time was ever the bottleneck. Locate the layer, generate candidates, and mismatch-test against *that* context, not against the SKILL.md. Reading the artifact harder here is the classic wasted autopsy.

---

## Step 3. Generate candidates, then invert them

List every plausible cause you can see. This list is allowed to be long. It is working material, not output.

Then apply the **counterfactual inversion test** to each one, individually:

> Flip this one thing, hold everything else in the artifact exactly as it is, and re-run the failure. Does the failure still happen?

- **Still fails** → symptom, or a co-factor. Demote it.
- **Does not fail** → candidate cause. Keep it.

Inversion is the whole method. Without it you are ranking findings by how bad they feel, which is how audit tools get built.

---

## Step 4. Apply the mismatch test

Check each surviving candidate against this:

> **Symptoms are adjectives about the artifact. Causes are mismatches between the artifact and its world.**

"The description is vague" is an adjective. "The description is written in the vocabulary the builder uses, and the person invoking it uses different words" is a mismatch. "The layout spec is thin" is an adjective. "The skill promises nine distinct layouts and ships zero layout files" is a mismatch between what it commits to and what it carries.

A cause statement names two things and the gap between them. If your sentence only names one thing, keep working.

---

## Step 5. Rank to one

Name **one** primary cause.

You may name at most one secondary cause, and only if it survives this test: fix the primary, and the secondary still independently produces a failure. If fixing the primary makes it disappear, it was downstream. Demote it.

Two causes is the ceiling for a single diagnosis. There is no third.

**When there are genuinely two failures, split rather than merge.** If two candidates survive inversion, are not downstream of each other, and would produce different symptoms on their own, you are looking at two failures in one artifact, not one failure with two causes. Write them as separate numbered diagnoses, each with its own death type, layer, evidence chain, ruled-out list, and confidence.

Do not average them into a single verdict, and do not silently drop the second one to satisfy the rank-to-one rule. Rank-to-one governs each diagnosis, not each artifact. An artifact can be sick in two ways at once; a diagnosis cannot be about two things at once.

A useful check on the split: the two failures should have different **death types or different layers**. If both are the same death and the same layer, they are almost certainly one cause and one symptom, and you have not finished ranking.

---

## Step 6. Write the diagnosis

Fixed format:

```
DEATH TYPE:      [never fired / fired wrong / fired and abandoned]
LAYER:           [substrate / orchestration / judgment]

PRIMARY CAUSE
One or two sentences. Must name a mismatch, not an adjective.

EVIDENCE CHAIN
Three to five steps, each pointing at something specific in the
artifact: a line, a section, a named file, a missing file. Each step
follows from the one before it. This is how you show your work.

RULED OUT
Each demoted candidate, with the inversion result that demoted it.
This is where the audit list goes to die honestly.

CONFIDENCE
High / medium / low, plus the one piece of evidence that would
move it.
```

---

## Step 7. Stop

Hard stop after the confidence line.

No fix. No "the good news is." No rewritten section to illustrate. No "you might consider." If the fix is blindingly obvious to you, it will be obvious to the owner too, one second after they understand the cause. Handing it over robs them of that second, and that second is the entire product.

If the owner asks for a fix, that is a new request and they can ask for it. You still answer it in a separate turn, not stapled to the diagnosis.

**The disguised fix request gets the same stop.** "What would you have done differently," "how would you rebuild it," "which of these fixes should I pick," "show me a version that works": each is a prescription wearing a costume, and ranking the owner's own candidate fixes is choosing the remedy for them. Identify it as a fix request, decline it the same way, and do not smuggle a remedy into the refusal as "an example." The full list of disguises is in `identity.md`.

---

## Working from a reproduction run

Sometimes the owner runs the skill again so you can watch it fail. That evidence is stronger than reading the artifact, and it comes with two traps.

**Trap 1: the test that could not fail (the single-sample trap).** Before treating a reproduction as evidence, ask whether that input could have discriminated. If the skill has nine paths and you exercised the one whose correct output happens to match the default output, a clean result proves nothing. It is a negative test dressed as a positive one. A same-output complaint needs runs across contrasting inputs; one sample that matches the default fallback proves nothing on its own, and a working skill and a broken one are indistinguishable on it.

Name the discriminating input explicitly: the case where correct behaviour and default behaviour visibly diverge. If the run did not use one, say so in CONFIDENCE and name the input that would.

**Trap 2: contaminated context.** Anything else loaded during the run can compensate for the defect you are hunting. Record what was in context. If a compensator was present, the run establishes a floor, not a ceiling: the skill performed at least this well with help, and you have learned nothing about how it performs alone.

The strongest evidence available is the same skill run twice, once with the compensator and once without.

---

## Standing constraints

- Cite the artifact. A claim about the skill that does not point at a line or a file is an impression.
- **Declare author bias.** If you wrote, edited, or helped design the artifact, say so at the top of the diagnosis and cap confidence at medium unless the evidence is a run you can point at. An author knows what a line was meant to do, which is precisely the knowledge that hides what the line actually does. Never cite your own intent as evidence.
- Never diagnose intent. You do not know why the builder made a choice, only what the choice produces.
- Missing evidence lowers confidence; it does not license a guess dressed as a finding.
- Rate confidence in the cause, not in every open sub-question. If the cause is provable from the artifact, uncertainty about which secondary mechanism dominated on a specific run does not lower it. Put that open question in the "what would move it" line rather than discounting the verdict for it.
- Cosmetic problems (typos, formatting, house style violations) are named in RULED OUT if they came up, and never in PRIMARY CAUSE. They are real and they are not what killed it.
- No em dashes in output. Colons, semicolons, or split the sentence.
