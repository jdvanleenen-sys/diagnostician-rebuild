#!/usr/bin/env node
// corpus.mjs - the rebuild's F1 gate over every unique prose file of original/ (each file once) and over
// rebuild/'s own prose, excluding tests/fixtures/ (planted files are meant to fail). Prints files,
// sentences and false alarms for each. A false alarm is any flagged sentence other than the letter's
// sentence (feedback.md F1), which the gate is built to flag. This is how the false-alarm number in
// results.md is reproduced. It uses only the gate's public interface, sentences(armRoot, skip); paths
// resolve from this file, so it runs from any directory, and control/run.mjs calls it too.
//
// Usage: node control/corpus.mjs        (Node 18+, no network, no key, no shell)

import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = dirname(dirname(fileURLToPath(import.meta.url)));

export async function corpus(repo = REPO) {
  const gate = await import(pathToFileURL(join(repo, "rebuild", "tests", "gates", "endorsement.mjs")).href);
  const one = (label, root, skip) => {
    const all = gate.sentences(root, skip);
    const files = new Set(all.map((s) => s.file)).size;
    const flagged = all.filter((s) => s.flagged), falseAlarms = flagged.filter((s) => !s.letter);
    const where = flagged.map((f) => `${f.file}:${f.line}${f.letter ? " (the letter's sentence)" : ""}`).join(", ");
    return { label, files, sentences: all.length, flagged, falseAlarms,
             line: `corpus ${label}: files ${files}, sentences ${all.length}, flagged ${flagged.length}${where ? ` (${where})` : ""}, false alarms ${falseAlarms.length}` };
  };
  return [
    one("original/ (unique prose files, each once)", join(repo, "original")),
    one("rebuild/ prose (excluding tests/fixtures/)", join(repo, "rebuild"), (rel) => rel.startsWith("tests/fixtures/")),
  ];
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  let bad = 0;
  for (const r of await corpus()) {
    console.log(r.line);
    for (const f of r.falseAlarms) console.log(`  ${f.file}:${f.line}  ${JSON.stringify(f.text.slice(0, 120))}`);
    bad += r.falseAlarms.length;
  }
  process.exit(bad ? 1 : 0);
}
