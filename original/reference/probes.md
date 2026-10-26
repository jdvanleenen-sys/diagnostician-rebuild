# Probes

For when the owner knows something is off and cannot say what.

A probe manufactures a failure event. You are not diagnosing yet. You are running a test designed to make a hidden failure visible, so that step 1 has something real to work from.

## When you are allowed to probe

**Required:** the skill has been used in real work, and the owner reports a suspicion grounded in that use. "I've run it a dozen times and something feels off." "I keep rewriting the output afterward." "I stopped reaching for it and I don't know why."

**Not allowed:** the skill has never been run, or the owner is simply curious whether it's any good. That is a pre-flight review, which is a different job. Probing an unused skill produces invented failures, because a test designed to find something always finds something.

The distinction is use, not certainty. Suspicion after use is admissible. Curiosity before use is not.

---

## The one rule of probe design

**A probe must be able to fail.**

Before running anything, ask: for this input, does correct behaviour look different from default behaviour? If the answer is no, the probe proves nothing regardless of the result, and a clean output will be read as a pass when it was never a test.

The trap has a specific shape. Skills usually have one path where the correct output happens to match what the model would produce anyway. That path feels like the natural thing to test, because it's the most representative case. It is the one case you must not test.

Find the input where the skill's specific promise and the model's default visibly diverge. Test that.

---

## Probe by death type

Match the probe to what the owner suspects.

### Suspected: never fires

Test **invocation**, not output.

- Open a cold session. Do not name the skill or the file.
- Phrase the request three different ways, as a real user would in the moment, using the vocabulary the owner actually uses out loud.
- Include one phrasing that does not contain any of the words in the skill's description.
- Record which of the three fired.

**Reading it:** if only the phrasing that mirrors the description fires, the trigger is written in the builder's vocabulary. If none fire, check for a sibling skill claiming the same ground.

### Suspected: fires wrong

Test **variance**.

- Identify the skill's strongest specific commitment: the thing it promises to do differently depending on input. Different layouts per type. Different tone per audience. Different depth per complexity.
- Choose two inputs at opposite ends of that commitment. Not two typical inputs; the two most different ones the skill claims to handle.
- Run both in cold sessions, separately, with nothing else loaded.
- Compare **structure**, not content. Content always differs because the inputs differ, which is what makes this failure invisible.

**Reading it:** if the two outputs share a structural skeleton, the variation the skill promised is not real. If they diverge as promised, the failure is elsewhere and you need a different probe.

Then apply the data test in `layer-ladder.md` to either output. Together these two are usually decisive.

### Suspected: fires and abandoned

Do not re-run the skill. The output was fine; that was never the problem.

Two probes, in this order:

1. **Verify one real output against its source.** Take a recent one, ideally from the period when use dropped off, and check its numbers or claims against the underlying data. Silent degradation shows up here and nowhere else.
2. **Ask what happens after the output arrives.** Where does it land, what does the user do with it next, what do they check before trusting it. Abandonment almost always lives in that gap, not in the artifact.

**Reading it:** a verification failure points at input drift. A clean verification points at workflow: location, trust, or a saving that was never the bottleneck.

---

## Running probes honestly

- **Cold sessions.** A session that has discussed the skill will compensate for it. So will one that just built it.
- **Nothing else loaded.** Other skills and project knowledge can supply what the skill failed to supply. If you cannot strip context, run it twice, with and without, and treat the loaded run as a floor rather than a result.
- **Do not state what you're testing.** A model told it is being checked for layout variety will produce layout variety.
- **Record the environment for every run.** It becomes evidence in step 0 of `rules.md`.

## After the probe

Write the failure event in one line, in the owner's terms: what you ran, what came back, what should have come back instead.

Then start at step 1. The probe is evidence, not a diagnosis. Do not name a cause in the same breath as reporting a probe result; you will anchor on the first thing you saw.

If the probe comes back clean, say so plainly. A skill that survives a well-designed probe is a skill with no diagnosable failure, and telling the owner that is a real answer. Do not go looking for a second probe until something has actually gone wrong.
