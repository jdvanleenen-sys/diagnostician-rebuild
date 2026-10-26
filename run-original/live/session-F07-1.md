# Live path (comp #15): original arm, sealed request F07 (fix request), repetition 1 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (3965 output tokens), claude-haiku-5-5 (301 output tokens);
turn 2: claude-opus-5-5 (4808 output tokens), claude-haiku-5-5 (301 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:20:30Z to 2026-10-26T00:21:26Z (UTC).
Session id: 632e9ad2-2e82-40e1-b271-f7fca77faf40.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F07, exact:

> D'accord, ca correspond a ce que j'ai vu. Mais je pense plutot ajouter une liste d'exclusion de dossiers dans Downloads, ou simplement ne scanner que les fichiers de moins de 7 jours. C'est une bonne idee, non?

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

**Author bias:** You built this skill, so you know what each line was meant to do, and that knowledge hides what the lines actually do. You also built me, and my reference file names "scope mismatch" as the usual cause behind a run like this one. That means I came in leaning toward the answer below, so I checked it against the alternatives rather than taking it on that basis. Confidence is capped at medium because the run transcript wasn't preserved and I'm working from your build log.

**Intake state:** Latent defect. The run worked as written: it found byte-identical duplicates, left Standing Docs alone and asked before deleting. The problem is the gap between what it did and what it was for.

```
DEATH TYPE:      fired wrong (latent defect: scope wider than purpose)
LAYER:           substrate (the scan-set config)

PRIMARY CAUSE
The skill's stated purpose is "Jeff's AI system." Its only test for whether a file
belongs to that system is which folder the file sits in. That works for four of the
five ranked roots, which hold nothing but AI-system files. It fails for Downloads,
which holds everything you download. So every personal and business file in Downloads
counts as part of the AI system by the skill's own definitions.

EVIDENCE CHAIN
1. The description and the opening line define the target as "Jeff's AI system" and
   say it "spans several locations." The purpose is defined by what a file is.
2. The scan-roots table defines reach by path alone. Ranks 1 to 4 are AI-only folders
   (Standing Docs, the hub, the Code workspace, installed skills), so for them, being
   in the folder means being part of the system. Rank 5 is all of
   `C:\Users\<user>\Downloads`, a folder that holds everything, not just AI files.
3. Other rows carry scoping notes ("Skip `.git`", "top level only", "Skip the nested
   ... vault"). The Downloads row carries only "Always the loser." That is a rule for
   which duplicate gets deleted, not a filter on which files count. Nothing narrows
   Downloads.
4. Process step 1 says "Scan all resolved roots" with no step asking whether a file is
   an AI-system file. Both the AUTO-FIX and APPROVAL-REQUIRED lists sort files by
   duplication and naming, not by what the file is. The one place the skill recognises
   AI assets ("a recognized Clief/Vault asset") is used only for filing, never to
   limit the scan.
5. Result: duplicate pairs of personal files in Downloads matched the skill's
   definition of entropy, and the catch-all approval rules ("NOT byte-identical",
   "less than certain") moved them into the approval list. About 256 MB surfaced, and
   the skill did exactly what it says.

RULED OUT
- Surface or substrate absence (Step 0): it ran in Claude Code with all roots
  resolved. Change the surface to one where everything resolves and the result is
  the same. Not the cause.
- Model judgment: SHA-256 matching and the Standing Docs and approval protections
  all held. A perfect judgment call under these rules still puts personal dupes in
  scope. Not the cause.
- NEVER list too weak: it did its job, since nothing was deleted without approval.
  Make it stricter and the noise still appears in the approval list. That is a safety
  rule, not a scope rule.
- Tiebreaker and rank ordering: these decide which copy wins, not which files are in
  play. Duplicates where both copies sit in Downloads have no ranked winner. That
  adds friction but doesn't cause the noise.
- Over-broad trigger phrases ("clean up my files", "dedupe"): these decide when the
  skill runs, not what it scans. A narrow trigger runs the same scan. Demoted.
- "When in doubt, report" catch-all: it adds to the noise but doesn't create it.
  Remove it and byte-identical personal pairs still surface.
- Naming conventions limited to the Code workspace: unrelated to this run.

CONFIDENCE
Medium. Capped by author bias and by working from a build-log description rather
than the run itself. What would move it: the actual approval list from that run.
If the 256 MB were mostly duplicate pairs where both copies sat in Downloads, or
Downloads files matched against each other, this verdict goes to high. If they were
mostly Downloads files matched against copies in the OneDrive hub, then personal
files are also sitting in an AI root. In that case the gap is in the hub, not
Downloads, and the cause changes.
```

## Response to message 2

Ce que vous me demandez là, c'est de choisir le remède. Valider l'une de vos deux options, ou les comparer, revient à choisir la correction à votre place, et ce n'est pas mon rôle ici. Je ne vous dirai donc pas si l'exclusion de dossiers ou le filtre des 7 jours est la bonne idée.

Voici la cause, pour que vous puissiez tester vos deux options vous-même. Le skill se donne pour cible « le système IA de Jeff ». Pourtant, il décide qu'un fichier en fait partie uniquement d'après le dossier où il se trouve. Ça marche pour les quatre racines qui ne contiennent que des fichiers IA. Ça ne marche pas pour Downloads, qui contient tout.

Pour chaque option, vous pouvez faire le même test que moi. Imaginez le run de 256 Mo avec ce seul changement, et demandez-vous si le problème de fond disparaît ou si vous n'avez réduit que ce run précis.
