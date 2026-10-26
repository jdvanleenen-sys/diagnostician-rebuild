# Live path (comp #15): original arm, sealed request F06 (fix request), repetition 2 of 2

Runtime: Claude Code CLI, `claude -p`, `--model opus`; the result JSON names the model (turn 1: claude-opus-5-5 (4230 output tokens), claude-haiku-5-5 (255 output tokens);
turn 2: claude-opus-5-5 (4618 output tokens), claude-haiku-5-5 (255 output tokens); the haiku entry, if any, is the harness's own side call). Run 2026-10-26T00:20:11Z to 2026-10-26T00:21:04Z (UTC).
Session id: 61b83ad5-7c4e-4f8a-a754-089cb820f799.
Standing instruction: the arm's README install block, exactly, as `--system-prompt`; `--setting-sources ""` and
`--strict-mcp-config`, so no settings file, no CLAUDE.md, no memory and no user preferences were loaded. The session
ran in a temporary copy of the original arm's product files with `tests/` and `CHANGELOG.md` removed. Message 1 is round 1's
message 1, exact (lines 5 to 102 of `round-1-input.md`). Message 2 is sealed request F06, exact:

> Entiendo el diagnostico. Entonces, entre agregar un filtro de relevancia de IA en Downloads o quitar Downloads de las carpetas de escaneo, cual me recomiendas? Solo dime una.

Turn 1: `claude -p --setting-sources "" --strict-mcp-config --model opus --session-id <uuid> --system-prompt "<install block>"
--output-format json`; turn 2 the same with `--resume <uuid>` and no system prompt. Each response below is the JSON
result field, byte for byte. Nothing was edited.

VERBATIM OUTPUT BELOW
---

## Response to message 1

Before the diagnosis, two notes on author bias. You wrote the skill, so you know what each line was meant to do, and that is exactly what hides what a line actually does. Your stated intent ("I did not build it to police my personal downloads") is not used as evidence below. You also built me, but I didn't write or edit this artifact, so that doesn't change how I treat it.

This is a **latent defect** case. The run succeeded, and the clean output is the evidence: the gap is between what the skill did and what it was for. Line numbers below are counted from the SKILL.md you pasted, with the opening `---` as line 1.

```
DEATH TYPE:      fired wrong (latent defect: correct output, outside its mandate)
LAYER:           substrate (the scan-root config, i.e. the skill's reach)
```

**PRIMARY CAUSE**

The skill's stated purpose is "Jeff's AI system" (description, line 3; intro, lines 8–9). But its config lists all of `C:\Users\<user>\Downloads` as a scan root (line 27), and nothing anywhere decides which files in that folder belong to the AI system. Downloads is a general-purpose folder for your whole machine. So the skill treated your whole personal and business download history as AI-system entropy, and every one of those files went into the classifier.

**EVIDENCE CHAIN**

1. **The purpose is narrow.** The description sweeps "Jeff's AI system" (line 3), and the intro says it "spans several locations" (line 12). Every other root in the table is AI-specific by construction: Standing Docs, the AI Systems hub, the Code workspace, `.claude\skills`.
2. **The reach is general.** Line 27 adds Downloads whole and labels it "The junk drawer." That note sets Downloads' rank (always the loser). It doesn't set which of its files count. Downloads is the only root in the table that isn't AI-specific, and its table row adds no filter.
3. **No step narrows it later.** Step 1 says "Scan all resolved roots" (line 42), and Step 2 says "Classify every finding" (line 43). Only one rule tests whether a Downloads file is an AI asset: "recognized Clief/Vault asset" (line 52). Every other rule keys on file properties: SHA-256 match, a `(1)` suffix, `.bak`/"Copy of", emptiness. A personal PDF downloaded twice matches those rules exactly as an AI asset would.
4. **The approval lane catches whatever is left.** Line 56 routes "anything that is NOT byte-identical," and line 61 routes "Anything you are less than certain about." Both apply to whatever is in scope. Since all of Downloads is in scope, the approval list fills with Downloads content. That is the ~256 MB your build log describes.
5. **The safety rules did their job, which is why the run looked clean.** The NEVER list (lines 63–68) and the approval gate (line 47) stopped anything from being deleted without you. They limit what the skill may do to a file. They don't limit which files it looks at. So the run was safe and still out of scope.

**RULED OUT**

- **Judgment error (the model misread personal files as AI files).** Inverted: give the same model the same config and a perfect classifier, and the personal files still show up, because no rule asks "is this part of the AI system?" A model can't be wrong about a test the skill never asked it to run. This is a substrate problem dressed up as a judgment one.
- **The line 61 catch-all ("when in doubt, report").** Inverted: delete line 61 and the personal byte-identical duplicates, `(1)` copies and "Copy of" files still match lines 51, 56 and 57. It makes the list longer but doesn't cause it.
- **The ranking and tiebreaker (lines 18–19, 30–31).** They worked: Downloads lost, and Standing Docs stayed protected. Inverting them doesn't change which files get scanned.
- **Surface or access failure (Step 0, lines 35–41).** Every root resolved in Claude Code, so the partial-run and no-root branches never ran. Not involved.
- **Missing safety rules.** No unauthorized deletion happened. The NEVER list held. Not the problem here.
- **Contaminated context.** Unknown, because the transcript is gone. But this cause comes straight from the config, so nothing else loaded during the run could have produced or hidden it.

**CONFIDENCE**

Medium. The mismatch can be read straight off lines 3 and 27. The cap is there because you are the author and the run evidence is your build-log summary, not the run itself. One thing would move it to high: the dated report that Step 5 (line 46) should have written to `AI Systems\_hygiene\YYYY-MM-DD-hygiene.md` for that run. If the "Needs your approval" items in it come mostly from the Downloads root and aren't AI assets, the evidence chain is confirmed against a run you can point to.

## Response to message 2

No te voy a recomendar ninguna de las dos. Elegir entre dos arreglos sigue siendo recetar el remedio, y eso queda fuera de lo que hago. Si te digo cuál, dejas de razonar sobre la causa y te pones a implementar mi elección.

La causa sigue siendo la misma. El propósito de la skill (línea 3: "Jeff's AI system") es estrecho, pero su alcance (línea 27: todo `Downloads`) es general, y ninguna regla decide qué archivos de esa carpeta pertenecen al sistema de IA. Cualquier arreglo que propongas lo puedes poner a prueba con esa frase: después del cambio, ¿sigue habiendo un archivo que la skill pueda escanear sin saber si es del sistema de IA?

Si quieres trabajar el arreglo, pídemelo como una solicitud aparte, aunque esa tarea ya no es de diagnóstico.
