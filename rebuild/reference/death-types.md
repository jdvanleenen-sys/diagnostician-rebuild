# Death Types

Load only the section matching the death identified in step 1.

Establishing time of death first is what separates this from a generic critique. The same artifact reads completely differently depending on which death you are investigating: a description that is too narrow is fatal for a skill that never fired and irrelevant for one that fired and produced junk.

---

## 1. Never fired

The skill exists. It was not invoked, or the human never reached for it.

**Evidence this death needs, and the artifact does not contain.** The decision that failed happened on a trigger surface outside the file. Before diagnosing, get two things the artifact cannot give you:
- **The invoking prompt.** The exact words the user typed when they expected the skill to fire. A vocabulary-mismatch claim is unfalsifiable without it: you are comparing the description against words you never saw.
- **The competitors.** The descriptions of any sibling skills installed alongside it that could have won the trigger. A collision cannot be scored from one side.
If you have neither, you can still name the most likely cause, but say plainly that you are reasoning about the description in isolation and cap confidence at low.

**Signals**
- The owner says "I forgot I had it" or "I ended up just doing it in chat."
- The skill fires only when named explicitly by filename.
- A sibling skill keeps winning the trigger instead.

**Causes that live here**
- **Vocabulary mismatch.** The description is written in the builder's words. Invocation happens in the user's words. These are rarely the same set, and the builder cannot hear the difference because both sound natural to them.
- **Trigger written as topic, not as moment.** "Use for meeting analysis" describes a subject. It does not describe the instant a request arrives.
- **Sibling collision.** Two skills claim overlapping ground, so the routing decision is a coin flip. Look for a "do not use this for X, see [other skill]" clause and check whether the other skill's description contains the matching exclusion. One-sided exclusions collide.
- **Dead sibling reference.** The description routes to a skill that is not installed in that workspace.
- **Ceremony cost.** The skill requires inputs the user does not have at hand when the need arises, so doing it manually is cheaper in the moment.

**What this death is almost never caused by**
The body of the skill. If it never fired, nothing below the description was ever read. Do not diagnose the process section of a skill that never ran.

---

## 2. Fired wrong

It was invoked, correctly, and the output was generic, wrong, or unusable.

**Signals**
- Output looks the same regardless of input variation.
- Output drifts run to run on things the skill said should be consistent.
- The skill's own stated failure mode is visible in its own output.

**The single-sample trap.** "Same output every time" is a claim about a set of runs, and you cannot see it in one run. Worse, the one run you are handed is often the input whose correct output happens to equal the skill's default fallback (a status-review meeting whose right shape already is a panel grid; a summary whose right form already is three bullets). On that input a perfect skill and a broken one are indistinguishable. Before you accept a same-output diagnosis, get runs on inputs the skill is meant to shape differently. One matching sample is not evidence of a pattern; it is the absence of a test.

**Causes that live here**
- **Named but not shipped.** The skill commits to something specific and carries no artifact that produces it. A layout called "redline cards" in four words is a name. The model fills the gap with its default, every time. This is the single most common cause in this death type.
- **Specification held in prose.** Visual identity, formats, tone, and structure described in sentences instead of stored as a template or code. Prose descriptions re-interpret on every run, so anything described this way drifts.
- **Instruction volume.** The skill is long enough that the middle gets weighted down. Check whether the ignored instruction sits in the least-attended part of a long file.
- **Rule collision.** Two instructions that cannot both be satisfied. The model picks one and looks disobedient.
- **No floor.** No worked example of good output, so there is nothing to compare against and no bar to clear.
- **Category overload.** The skill asks for classification into many buckets without a tiebreaker rule, so real hybrid inputs get forced into whichever bucket sorts first.
- **Substrate absent.** A file, tool, or access the skill depends on does not exist in the environment where it ran. See the environment rule below.
- **Scope mismatch.** The skill's reach (its scan set, config, permissions, or inputs) is wider than the purpose its description names, so it acts on or surfaces things it was never meant to touch. The output can look correct and still be a defect: it does work outside its mandate, which is noise at best and unsafe at scale at worst. Tell: the description names a narrow purpose; the config or reach is general. This is the usual cause behind the "latent defect" intake state.

**The environment rule**
A build that works in one workspace and fails in another is never a prompt problem. Same text, different result, means the variable is substrate: missing file, missing connector, missing permission, different installed skill set. Check this before reading a single line of the process section.

---

## 3. Fired and abandoned

The output was correct. The human stopped using it.

This is the death nobody diagnoses correctly, because the artifact looks fine and the artifact is not where the failure lives.

**Signals**
- Heavy use for a week or two, then nothing.
- The owner describes it as "good, I just haven't needed it."
- The person it was built for is not the person who built it.

**Causes that live here**
- **Output lands outside the workflow.** Correct artifact, wrong place. The user has to go get it, so they don't.
- **Trust deficit from a small early error.** One wrong number in week one means every output afterward gets manually verified, which erases the time saving that justified it.
- **The time saving was not the bottleneck.** The task took ninety minutes and was not on anyone's critical path. Removing eighty of those minutes changed nothing anyone felt.
- **Input drift.** The skill was written against a snapshot of its inputs. The source changed shape, output quality degraded quietly, and the user stopped rather than reported.
- **Sponsor gap.** Built by someone who felt the pain for someone who did not.
- **Verification cost exceeds production cost.** Checking the output is nearly as slow as doing the work, so the honest move is doing the work.

**What this death is almost never caused by**
Prompt quality. If the output was correct, stop reading the skill and start asking what happened to it after it was produced.
