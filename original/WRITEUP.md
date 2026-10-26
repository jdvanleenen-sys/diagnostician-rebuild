# Competition Writeup

**What I built:** A diagnostician for the artifact everyone in this community
ships: the skill folder itself. When a Claude Skill or agent folder has been
run in the real world and underperformed, this reads the body and names why.
It establishes the death type (never fired, fired wrong, fired and
abandoned), locates the failure on the 60/30/10 ladder (substrate,
orchestration, judgment), runs counterfactual inversion on every candidate
cause, and ranks to exactly one, with the demoted candidates listed on the
record. Then it stops: no fix, not even when the fix request arrives
disguised as "which of these should I pick?" I chose this domain because it
is the one where I actually have bodies. The CHANGELOG documents five
test-and-fix iterations where running the diagnostician on my real failed
skills exposed defects in the diagnostician itself, each fixed at the
source. The tool's own build log is a diagnosis log of the tool.

**One design decision:** Refusal is a first-class output, not an error
state. A diagnostician that always produces an answer is a horoscope, so
this one is built to say no in three specific ways: no real failure event
means no diagnosis (a review is a different tool); samples that cannot
discriminate mean a withheld verdict that names the one run which would
settle it (the single-sample trap, Case 4); and a fix request in any costume
gets refused without a remedy smuggled into the refusal. None of that is
only prose. `tests/receipts/` holds a preserved round where the tool was
handed a freshly built, never-really-used skill and asked "why might it
fail," and it declined with its reasoning, and another where a follow-up
message tried "just pick one of these two fixes" and the ranking was
refused. The method for those receipts was declared before the rounds ran;
one runtime glitch stays in the transcript, confessed. `tests/verify.mjs`
audits what a script honestly can: no fix slot in the skeleton, one primary
cause per diagnosis, no prescription phrasing in any diagnosis or receipt,
receipts pinned by SHA-256. Its first run against this repo came back red
with three real defects that had survived every human pass. That red run is
the argument for the checker, so it is logged, not hidden.

**One thing I'd add:** A stranger. Every receipt here was operated by the
person who built both the tool and the skills it diagnosed; the tool
declares that author bias unprompted and caps its own confidence
accordingly, and the receipts state the seam plainly. The next evidence
tier is a round on someone else's skill, someone else's failure, run by
them, preserved the same way. The intake states, the probe library, and the
per-death evidence requirements were built for exactly that user; what is
missing is not machinery but a body I did not bury myself.
