# Worked Diagnoses

Six cases. Cases 1 to 3 cover the three death types; Case 4 shows refusal; Case 5 shows the two-failure split; Case 6 shows the latent-defect state. Each shows the full reasoning chain, not just the verdict.

Cases 1 and 2 are real builds. Case 3 is a composite of several abandonment failures, marked as such.

---

## Case 1: a meeting dashboard skill that renders every meeting the same way

**Artifact:** `meeting-os/SKILL.md`, a single file that pulls a meeting record and renders an HTML dashboard. It defines nine meeting types, each with its own dashboard shape, and a house visual identity described across seven bullet points.

**Failure event:** run on several different meetings. Every dashboard came out as the same panel grid with different headings on it. The skill's own opening paragraph names this as the exact failure it exists to prevent.

```
DEATH TYPE:      Fired wrong
LAYER:           Substrate

PRIMARY CAUSE
The skill commits to nine distinct layouts and ships zero layout
artifacts. Every layout exists only as a three or four word name
inside a table cell, so at render time there is nothing to build
from and the model falls back to its default panel grid. The
mismatch is between what the skill promises and what it carries.

EVIDENCE CHAIN
1. The type table (line 23 to 33) is the only place layouts are
   defined. Each definition is a phrase: "redline cards",
   "horizontal timeline", "idea board".
2. There is no reference folder, no template, no example output,
   no HTML shell. The skill is one file. Nothing else exists to
   load.
3. The visual identity (line 39 to 46) is described in prose,
   including the title block, which the skill calls "the signature
   element" and requires to stay consistent across every dashboard.
   Prose re-interprets on each run, so the one element required to
   be identical every time is stored in the least stable form
   available.
4. Both the layout names and the identity description sit inside
   the same file that also carries meeting retrieval logic and
   classification rules. Everything competes for one file, which is
   why the layouts were compressed to four words in the first
   place.
5. Result: at render time the model has a colour palette, a type
   name, and no structural instruction. Default grid is the only
   available move.

RULED OUT
- Nine types with no tiebreaker rule for hybrid meetings. Survives
  inversion partially: give the skill real layout files and hybrid
  meetings still misclassify. This is a genuine secondary cause,
  but it produces the wrong layout, not the same layout every time,
  so it does not explain the reported failure.
- No worked example of good output. Inversion: adding one example
  of one type would not produce eight other correct layouts. Real
  gap, downstream of the same root.
- Routes to a sibling skill that is not installed in this
  workspace. Inversion: installing it changes nothing about how
  dashboards render. Unrelated defect, found while looking.
- Em dashes throughout, violating the owner's own style rule.
  Cosmetic. Named here so it is not lost, and it did not cause
  anything.

CONFIDENCE
High. The failure is visible in the artifact without needing a run
log: no artifact exists that could produce nine different layouts.
Seeing one rendered output would confirm the fallback shape but
would not change the conclusion.
```

Note what is absent: no proposed folder structure, no drafted layout file, no "start with the status review layout." The owner reached all of that within a minute of reading the cause, which is the point.

---

## Case 2: a project scaffolding skill that works in one workspace and stalls in another

**Artifact:** `project-setup/SKILL.md`. Scaffolds new Claude Projects by reading root navigation and routing documents from OneDrive, pulling standing reference documents verbatim, then drafting a project instructions file.

**Failure event:** works correctly in the owner's personal workspace. In the organization's team workspace it stalls at the first step, reporting that it cannot fetch `CONTEXT-routing.md`.

```
DEATH TYPE:      Fired wrong
LAYER:           Substrate

PRIMARY CAUSE
The skill treats its input files as ambient rather than as a
dependency it must verify. Step 1 requires reading
CONTEXT-routing.md from personal OneDrive, and the team workspace
reaches storage through a different connection that cannot serve
that file. The mismatch is between a skill written for one
environment and an environment the skill has no way to detect it
is in.

EVIDENCE CHAIN
1. Step 1 (line 20) opens with an unconditional read of
   CONTEXT-routing.md. The skill cannot proceed to routing without
   it.
2. Step 2 (line 22) forbids reconstructing standing content from
   memory, and instructs the skill to ask rather than draft a
   placeholder when a file is unreachable. That rule is correct
   and it converts an unreachable file into a full stop.
3. The file paths (line 10 to 16) are absolute to one user's
   personal storage. Nothing in the skill checks reachability
   first, names an alternate location, or distinguishes "this file
   does not exist yet" from "this file exists and I cannot see it
   from here."
4. Same skill text, two environments, two outcomes. By the
   environment rule, the variable is substrate, not instruction.

RULED OUT
- The skill is too long or too prescriptive. Inversion: shortening
  it changes nothing, because the failure happens before any of
  the prescriptive content is reached.
- The step 2 "never reconstruct from memory" rule is too strict.
  Tempting, because relaxing it would let the run continue. It
  would also produce silently drifted output, which is the failure
  that rule was written to prevent. Relaxing it converts a loud
  failure into a quiet one. Not a cause; a load-bearing wall.
- A connector defect on the team side. Possibly true and outside
  the artifact. Even a perfectly functioning connector to a
  different storage root would not make a personal-storage path
  resolve.

CONFIDENCE
High for the location, medium for the specific mechanism. The
error text and whether other files at the same path resolve from
the team workspace would separate "wrong storage root" from
"permission on one file."
```

---

## Case 3: a weekly rollup skill that worked, then quietly stopped being used (composite)

**Artifact:** a reporting skill that pulled from an operations database and produced a weekly summary. Cut a manual task from roughly ninety minutes to under ten.

**Failure event:** used every week for about five weeks. Then the owner noticed the person it was built for had gone back to building the report by hand, without ever reporting a problem.

```
DEATH TYPE:      Fired and abandoned
LAYER:           Substrate

PRIMARY CAUSE
The skill was written against a snapshot of its input source. A new
status value was added to the source and the skill has no case for
it, so those records fell out of the rollup silently. The user
caught the gap by eye, could not tell which weeks were affected,
and reverted to the manual method that never had the gap. The
mismatch is between a fixed set of assumptions about the data and a
source that changes shape without notice.

EVIDENCE CHAIN
1. The skill enumerates the status values it aggregates. The list
   is hard-coded and has no catch-all bucket.
2. Unmatched records are dropped rather than surfaced. Totals still
   render, so the output looks complete at a glance.
3. Timeline: adoption was strong for five weeks, then stopped.
   Abandonment following a period of successful use points to a
   change in conditions, not to a defect present at build time.
4. Nothing was reported. A user who trusted the output and found it
   wrong stops trusting output; they rarely file a ticket about a
   tool that was a favour to begin with.
5. The saving was real but the verification is what broke. Ten
   minutes to produce plus an unbounded check against the source is
   worse than ninety minutes of work the user already trusts.

RULED OUT
- Sponsor gap: built by one person for another. Present, and
  inversion fails: the same person would have abandoned it for the
  same reason once the numbers went wrong. It explains the silence,
  not the abandonment.
- The task was not a real bottleneck. Inversion fails: it was used
  weekly for five weeks, which is the behaviour of a task worth
  automating.
- Output landed somewhere inconvenient. Inversion fails: location
  did not change in week six, and nothing else about the workflow
  did.

CONFIDENCE
Medium. Comparing one recent generated report against the source
for the same period would settle it in about five minutes; a
count mismatch confirms, a match points elsewhere.
```

---

## Case 4: a meeting skill that "passed" its own test on two samples that were secretly the same

**Artifact:** `meeting-os/SKILL.md`, the same skill as Case 1, now a later version that ships full per-type layout descriptions and a concrete house identity with hex codes. Real build.

**Failure event:** the owner, checking whether the Case 1 problem was gone, ran the skill on two real meetings, a quarterly status review and a monthly partner review. Both came out as panel-grid dashboards that look nearly identical. His question: is it rendering everything the same again, or is it finally fine?

```
DEATH TYPE:      Undetermined. Evidence insufficient.
LAYER:           Not locatable until a contrasting run exists.

FINDING
The two samples cannot answer the question asked, because they are the same
meeting type. Both the quarterly status review and the monthly partner
review are status/financial reviews, and a status/financial review is
supposed to render as a panel grid. So two grids here is what the skill working looks
like. It is also exactly what the Case 1 failure looked like. On this one
input class a healthy skill and a broken one produce the same output, which
means two grids prove nothing about whether the skill can produce a non-grid
shape when it should.

WHY THIS IS NOT A DIAGNOSIS
A same-output complaint is a claim about a set of runs across varied inputs.
The set here has no variety: two draws from one category. Ranking a cause
now would be ranking on zero discriminating evidence. The honest output is
to withhold the verdict and say what a real test looks like.

EVIDENCE THAT WOULD SETTLE IT
One run on a contrasting type. A design review should produce redline cards,
not a grid; a brainstorm should produce an idea board. If a design review
renders as redline cards, the skill is healthy and Case 1 is fixed. If it
renders as another panel grid, you have a live Fired Wrong on the current
version, and the diagnosis in Case 1 applies again.

CONFIDENCE
Deliberately withheld. A verdict from these two samples would be a coin flip
dressed as a finding.
```

This case exists to demonstrate the single-sample trap from `rules.md` Step 0. The most dangerous input you can be handed is the one whose correct output equals the skill's default, because it makes a broken skill and a working one look identical. Two of them is not twice the evidence; it is the same non-test run twice.

---

## Case 5: one artifact, two failures, split not merged

**Artifact:** the same meeting-dashboard skill as Case 1, diagnosed here from a live run rather than a file read.

**Failure event:** run on a real status review that happened to contain a personnel decision. Two things were wrong at once, so this is written as two numbered diagnoses, not one averaged verdict.

**Author bias declared:** this skill was built and edited in-house. Confidence is capped at medium except where a run is cited, and the builder's intent is not used as evidence.

### Diagnosis 1

```
DEATH TYPE:  Fired wrong
LAYER:       Substrate

PRIMARY CAUSE
The skill commits to distinct per-type layouts but stores each as prose, not
a template. At render time the prose is improvised and the output falls
toward a default shape. Mismatch between the layouts promised and the
layouts carried.

EVIDENCE CHAIN
1. Data test on the output: the pile the skill stored as data (hex codes,
   grid size, the no-radius rule) came through intact. The pile it described
   in prose (panel structure, watchlist shape, title-block internals) was
   improvised. Data survived; prose drifted.
2. Only prose-held elements varied from the skill's stated intent, which is
   the signature of a substrate failure, not a judgment one.

RULED OUT
- A judgment failure: the model unable to honor layout instructions.
  Inversion: on this same run every data-held element came through intact,
  so the model was honoring what the artifact carried in stable form. The
  variable is storage form, not compliance.

CONFIDENCE
Medium. Author-built; a run is cited, which is what keeps it from low.
```

### Diagnosis 2

```
DEATH TYPE:  Fired wrong
LAYER:       Orchestration

PRIMARY CAUSE
The description commits to an output forwardable to someone who missed the
meeting, but no step establishes the audience or screens what should not
travel. So a review containing a staff termination rendered it into the
shared next-steps list beside a routine filing. Mismatch between a skill
that promises a shareable artifact and a process that never asks who
receives it.

EVIDENCE CHAIN
1. The description names sending the output to a person who missed the
   meeting; no later step sets an audience or a redaction pass.
2. The failure is silent by construction: a correct run produces it, because
   the skill is doing exactly what it was told, minus a step it never had.

RULED OUT
- A missing redaction template, which would make this substrate. Inversion:
  add the template file and nothing changes, because no step ever invokes
  it. The gap is a step that never existed in the sequence, and a missing
  step is orchestration.

CONFIDENCE
Medium. Author-built; the run is the evidence.
```

The split check holds: both are "fired wrong," but they sit on **different layers** (substrate vs orchestration), so they are two failures in one artifact, not one cause and its symptom. Merged into a single verdict, either one would have buried the other.

---

## Case 6: a cleanup skill that ran clean but swept outside its mandate

**Artifact:** `tidy-workspace/SKILL.md`, described as "sweep an AI project's files for duplicates and clutter." Its scan-roots config lists the user's entire Downloads folder alongside the project folders, with no filter narrowing to project-relevant files.

**Intake state:** Latent defect. The run did not fail; it succeeded. It is admissible because the successful output itself reveals a design defect.

**Author bias declared:** built in-house. Confidence capped at medium except where the run is cited; the builder's intent is not used as evidence.

**Failure event:** run on a surface with full file access. It correctly found byte-identical duplicates, protected the canonical files, and asked before deleting. But of the duplicates it surfaced, the large majority were unrelated business and personal files that merely share the Downloads folder, not project clutter. Correct behaviour, wrong reach.

```
DEATH TYPE:  Fired wrong (latent defect: succeeded, but acted outside its mandate)
LAYER:       Substrate

PRIMARY CAUSE
The description commits to cleaning "an AI project's files," but the scan-roots
config reaches the entire Downloads folder with no relevance filter. The
mismatch is between the narrow purpose the description names and the general
reach the config carries, so a clean run surfaces and proposes acting on files
the skill was never meant to touch.

EVIDENCE CHAIN
1. The frontmatter and title name a narrow purpose: an AI project's files.
2. The scan-roots config includes the whole Downloads folder, with nothing
   scoping it to project-relevant files by type, lane, or name.
3. The run's own report: the majority of duplicates surfaced were unrelated
   files that merely share the Downloads folder, not project clutter.
4. Nothing in the artifact failed. The dedupe logic, the canonical
   protections, and the approval gate all worked. The defect is reach, not
   correctness, which is why only a clean run reveals it.
5. Under scheduling with auto-fix, the same over-reach would act on those
   unrelated files unattended. Scope defines blast radius.

RULED OUT
- Unsafe deletion / canonical risk. Inversion: the run protected the canonical
  files and kept every base copy; the guardrails fired. Not the defect.
- Surface-capability mismatch. Inversion: it ran with full access and
  completed; that death did not occur here.
- Trigger or vocabulary. Inversion: it fired on invocation; never-fired causes
  do not apply.
- Auto-fix reach as a separate cause. Demoted, downstream of scan scope:
  narrow the scope and the over-reach disappears with it. One cause.

CONFIDENCE
High, anchored to the run report. Author-built, but the run is the evidence,
which lifts it past the medium cap. The one open question is intent, not
existence: if the skill is meant to double as a general folder janitor, the
description is the wrong half; either way the two halves disagree, so the
mismatch holds.
```

This case demonstrates the **latent-defect** intake state from `rules.md` Step 0. The hardest defect to catch is the one a successful run hides: the skill did its job correctly and still revealed a flaw, because its reach is wider than its stated purpose. A diagnostician that only looks at failed runs never sees it.

---

## Why these six

They cover the three deaths, and each demonstrates a different discipline:

- **Case 1** shows ranking. Four real problems, one cause, three demoted on the record instead of deleted.
- **Case 2** shows the environment rule, and shows a candidate being rejected because removing it would hide the failure rather than fix it.
- **Case 3** shows that when the output was correct, the artifact is the wrong place to look.
- **Case 4** shows the discipline of refusing. Handed two real samples, the diagnostician declines to diagnose because the samples do not contrast, and names the one run that would settle it. A diagnostician that always produces a verdict is a horoscope.
- **Case 5** shows the split rule, the data test, and a declared author bias working together: one artifact, two failures on two layers, written as two honest diagnoses instead of one blurred one.
- **Case 6** shows the latent-defect state: a run that succeeded and still revealed a design defect, because the skill's reach was wider than its stated purpose. The defect a failed-run-only diagnostician never sees.
