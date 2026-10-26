// lib.mjs - what control/run.mjs and control/heldout.mjs share: fresh copies of an arm, a verify run with
// a timeout, plants as unified diffs, the provenance pins (original/ against the judged commit, feedback.md
// against the judges' letter), and atomic file writes. No question lives here.

import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, relative } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const REPO = dirname(dirname(fileURLToPath(import.meta.url)));

// Provenance of original/: the judged entry, pinned. The tree hash is what `git rev-parse HEAD:original`
// must print; control/original-tree.txt is `git ls-tree -r <commit>` (modes and blobs), checked file by file.
export const UPSTREAM = "https://github.com/jdvanleenen-sys/skill-diagnostician";
export const ORIGINAL_COMMIT = "01abab3229da2a22f84a82be071425ce66fac5ee"; // 01abab3, "Add competition writeup", 2026-08-06
export const ORIGINAL_TREE = "95d9615caafa8f3d2ec00e8167d9b7e6c495d4cd"; // git rev-parse 01abab3^{tree}
// Provenance of feedback.md: the judges' package (feedback-package.zip), file package/letters/jeff-van-leenen.md.
export const FEEDBACK_SHA256 = "cb689060112d5349bc03d98bf074ffadc33fe638ac427861dce3b88feae77c0e";

// One verify run may take this long before it counts as hung (a normal run takes well under a second).
export const TIMEOUT_MS = Number(process.env.CTL_TIMEOUT_MS) || 60_000;

export const lf = (s) => s.replace(/\r\n/g, "\n");
const lfBuf = (buf) => Buffer.from(buf.toString("binary").replaceAll("\r\n", "\n"), "binary");
export const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
export const shaLF = (buf) => sha256(lfBuf(buf));
// git's blob id of a file's LF-normalised bytes (every pinned file is LF, so a CRLF checkout still matches).
const gitBlob = (buf) => { const b = lfBuf(buf); return createHash("sha1").update(`blob ${b.length}\0`).update(b).digest("hex"); };

export const walk = (dir, out = []) => {
  for (const n of readdirSync(dir).sort()) { const p = join(dir, n); if (statSync(p).isDirectory()) walk(p, out); else out.push(p); }
  return out;
};
export const rel = (root, p) => relative(root, p).replaceAll("\\", "/");

// SHA-256 over a folder: sorted relative paths, each followed by its LF-normalised bytes.
export function folderSha256(dir) {
  const h = createHash("sha256");
  for (const p of walk(dir)) { h.update(rel(dir, p) + "\0"); h.update(lfBuf(readFileSync(p))); h.update("\0"); }
  return h.digest("hex");
}

export function repin(d) {
  const dir = join(d, "tests/receipts");
  const lines = readdirSync(dir).filter((n) => /^round-.*\.md$/.test(n)).sort()
    .map((n) => `${shaLF(readFileSync(join(dir, n)))}  ${n}`);
  writeFileSync(join(dir, "SHA256SUMS"), lines.join("\n") + "\n");
}
// A fresh copy of an arm in a unique temp dir (mkdtemp: two runs at once never share one).
let swept = false;
// Copies left by a killed run (ctl-*, older than ten minutes) are removed once per process.
function sweepStale() {
  if (swept) return;
  swept = true;
  const old = Date.now() - 10 * 60_000;
  for (const n of readdirSync(tmpdir())) {
    if (!n.startsWith("ctl-")) continue;
    const p = join(tmpdir(), n);
    try { if (statSync(p).isDirectory() && statSync(p).mtimeMs < old) rmSync(p, { recursive: true, force: true }); } catch {}
  }
}
export function fresh(arm) {
  sweepStale();
  const d = mkdtempSync(join(tmpdir(), `ctl-${arm}-`));
  cpSync(join(REPO, arm), d, { recursive: true });
  return d;
}
// A copy whose checker was just killed can still be held open for a moment (Windows): retry, then leave
// it for the next run's sweep rather than fail the whole check.
export const drop = (d) => { try { rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {} };

// Run an arm's own checker in its copy. A timeout, a signal, a spawn error or output with no verdict line
// is a harness error (the arm hung or crashed), never a "caught" or a "clean".
export function verify(d, args = []) {
  const r = spawnSync(process.execPath, ["tests/verify.mjs", ...args], { cwd: d, encoding: "utf8", timeout: TIMEOUT_MS, killSignal: "SIGKILL" });
  const raw = (r.stdout || "") + (r.stderr || "");
  const out = lf(raw.replaceAll(d, "<copy>").replaceAll(d.replaceAll("\\", "/"), "<copy>"));
  let harness = null;
  if (r.error) harness = r.error.code === "ETIMEDOUT" ? `hung: no exit after ${TIMEOUT_MS} ms (killed)` : `spawn failed: ${r.error.message}`;
  else if (r.signal) harness = `killed by ${r.signal}`;
  else if (!/^(?:RED|GREEN|SELFTEST:)/m.test(out)) harness = `crashed: exit ${r.status} with no verdict line`;
  return { code: r.status, out, harness };
}
export const failureLines = (out) => out.split("\n").filter((l) => /^\s+- \[/.test(l));
// Lines of `out` that `base` lacks, counted as a multiset: a second copy of an already-failing line counts.
export function newLines(base, out) {
  const count = new Map();
  for (const l of base.split("\n")) count.set(l, (count.get(l) || 0) + 1);
  return out.split("\n").filter((l) => {
    if (!l.trim()) return false;
    const n = count.get(l) || 0;
    if (n) { count.set(l, n - 1); return false; }
    return true;
  });
}
// Do the unplanted run's findings survive the plant? Line numbers are dropped (a plant above them shifts them).
export function persisted(unplanted, planted) {
  const strip = (l) => l.replace(/:\d+:/, ":N:");
  const have = new Set(planted.split("\n").map(strip));
  const base = failureLines(unplanted).map(strip);
  const lost = base.filter((l) => !have.has(l));
  return { total: base.length, lost };
}

// Unified diff of one changed region (every plant here is one contiguous edit).
export function unifiedDiff(path, before, after) {
  const a = before.split("\n"), b = after.split("\n");
  let p = 0;
  while (p < a.length && p < b.length && a[p] === b[p]) p++;
  let s = 0;
  while (s < a.length - p && s < b.length - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
  const ctx = 2, from = Math.max(0, p - ctx);
  const oldMid = a.slice(p, a.length - s), newMid = b.slice(p, b.length - s);
  const tail = a.slice(a.length - s, Math.min(a.length, a.length - s + ctx));
  const lines = [`--- a/${path}`, `+++ b/${path}`,
    `@@ -${from + 1},${(p - from) + oldMid.length + tail.length} +${from + 1},${(p - from) + newMid.length + tail.length} @@`];
  for (const l of a.slice(from, p)) lines.push(` ${l}`);
  for (const l of oldMid) lines.push(`-${l}`);
  for (const l of newMid) lines.push(`+${l}`);
  for (const l of tail) lines.push(` ${l}`);
  return lines.join("\n");
}
// Apply a plant to a fresh copy. The mutation sees LF text; the file keeps its own line ending.
export function plant(d, path, mutate, pin) {
  const p = join(d, path);
  const raw = readFileSync(p, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const before = lf(raw), after = mutate(before);
  if (after === before) throw new Error(`plant made no change in ${path}`);
  writeFileSync(p, after.replaceAll("\n", eol));
  if (pin) repin(d);
  return unifiedDiff(path, before, after);
}
export const lineOf = (text, needle) => { const i = text.indexOf(needle); return i < 0 ? -1 : text.slice(0, i).split("\n").length; };
// The line of the LAST occurrence: an inserted paragraph that repeats text already in the file (the letter's own
// sentence, say) is found where it was inserted, not where the file already had it.
export const lastLineOf = (text, needle) => { const i = text.lastIndexOf(needle); return i < 0 ? -1 : text.slice(0, i).split("\n").length; };

// Write a file whole or not at all: to a temp name beside it, then rename.
export function writeAtomic(p, text) {
  const tmp = `${p}.${process.pid}.tmp`;
  writeFileSync(tmp, text);
  renameSync(tmp, p);
}

// ---------------------------------------------------------------- provenance
function pinnedTree() {
  const p = join(REPO, "control", "original-tree.txt");
  if (!existsSync(p)) return null;
  return lf(readFileSync(p, "utf8")).split("\n").filter(Boolean).map((l) => {
    const [mode, , blob, ...path] = l.split(/[\s\t]+/);
    return { mode, blob, path: path.join(" ") };
  });
}
// The git tree id that a list of (mode, blob, path) entries makes, built the way git builds it: one tree
// object per folder, entries sorted by name (a folder sorts as its name plus "/"), each entry
// "<mode> <name>\0<20-byte id>". Lets a copy with no git prove control/original-tree.txt is the pinned tree.
export function treeId(entries) {
  const build = (list) => {
    const files = new Map(), dirs = new Map();
    for (const e of list) {
      const i = e.path.indexOf("/");
      if (i < 0) files.set(e.path, e);
      else { const d = e.path.slice(0, i); (dirs.get(d) ?? dirs.set(d, []).get(d)).push({ ...e, path: e.path.slice(i + 1) }); }
    }
    const items = [...[...files].map(([n, e]) => ({ key: n, mode: e.mode, name: n, id: e.blob })),
                   ...[...dirs].map(([n, l]) => ({ key: n + "/", mode: "40000", name: n, id: build(l) }))]
      .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
    const body = Buffer.concat(items.map((it) => Buffer.concat([Buffer.from(`${it.mode} ${it.name}\0`), Buffer.from(it.id, "hex")])));
    return createHash("sha1").update(`tree ${body.length}\0`).update(body).digest("hex");
  };
  return build(entries);
}
function compareEntries(pinned, have, modesKnown) {
  const bad = [];
  const byPath = new Map(have.map((e) => [e.path, e]));
  for (const e of pinned) {
    const h = byPath.get(e.path);
    if (!h) { bad.push(`missing: ${e.path}`); continue; }
    if (h.blob !== e.blob) bad.push(`content differs: ${e.path}`);
    if (modesKnown && h.mode !== e.mode) bad.push(`mode differs: ${e.path} is ${h.mode}, pinned ${e.mode}`);
  }
  const pinnedPaths = new Set(pinned.map((e) => e.path));
  for (const e of have) if (!pinnedPaths.has(e.path)) bad.push(`not in the pinned tree: ${e.path}`);
  return bad;
}
// original/ against the judged commit: in a git work tree by tree hash, ls-tree (modes and blobs) and a
// clean working tree; otherwise (a zip, no git) file by file against control/original-tree.txt, where
// content is checked and modes cannot be.
export function pinCheck() {
  const pinned = pinnedTree();
  const dir = join(REPO, "original");
  if (!existsSync(dir)) return { ok: false, text: "pin: original/ is ABSENT" };
  if (!pinned) return { ok: false, text: "pin: control/original-tree.txt is missing, so original/ cannot be checked" };
  const git = (args) => spawnSync("git", args, { cwd: REPO, encoding: "utf8" });
  const inside = git(["rev-parse", "--is-inside-work-tree"]);
  const committed = inside.status === 0 && inside.stdout.trim() === "true" && git(["rev-parse", "HEAD:original"]).status === 0;
  const notes = [];
  if (committed) {
    const tree = git(["rev-parse", "HEAD:original"]).stdout.trim();
    if (tree !== ORIGINAL_TREE) notes.push(`tree ${tree} DOES NOT MATCH ${ORIGINAL_TREE}`);
    const have = lf(git(["ls-tree", "-r", "HEAD:original"]).stdout).split("\n").filter(Boolean)
      .map((l) => { const [mode, , blob, ...path] = l.split(/[\s\t]+/); return { mode, blob, path: path.join(" ") }; });
    notes.push(...compareEntries(pinned, have, true));
    if (git(["diff", "--quiet", "HEAD", "--", "original"]).status !== 0) notes.push("the working tree has uncommitted edits under original/");
    const how = `git: tree hash, ls-tree modes and blobs (${pinned.length} files), working tree`;
    return { ok: !notes.length, text: notes.length ? `pin: original/ FAILS (${how}): ${notes.join("; ")}` : `pin: original/ matches commit ${ORIGINAL_COMMIT} of ${UPSTREAM} (${how}; tree ${ORIGINAL_TREE})` };
  }
  const rebuilt = treeId(pinned);
  if (rebuilt !== ORIGINAL_TREE) notes.push(`control/original-tree.txt builds tree ${rebuilt}, not the pinned ${ORIGINAL_TREE}`);
  const have = walk(dir).map((p) => ({ mode: null, blob: gitBlob(readFileSync(p)), path: rel(dir, p) }));
  notes.push(...compareEntries(pinned, have, false));
  const how = `no git here: control/original-tree.txt rebuilds tree ${ORIGINAL_TREE}, and ${pinned.length} files checked by content (git blob id, line endings folded) against it; file modes not checkable without git`;
  return { ok: !notes.length, text: notes.length ? `pin: original/ FAILS (${how}): ${notes.join("; ")}` : `pin: original/ matches commit ${ORIGINAL_COMMIT} of ${UPSTREAM} (${how})` };
}
export function feedbackCheck() {
  const p = join(REPO, "feedback.md");
  if (!existsSync(p)) return { ok: false, text: "feedback.md: ABSENT" };
  const buf = readFileSync(p), got = sha256(buf), folded = shaLF(buf);
  const ok = got === FEEDBACK_SHA256 || folded === FEEDBACK_SHA256;
  const how = got === FEEDBACK_SHA256 ? "" : " (after folding CRLF to LF; the letter is LF)";
  return { ok, text: ok ? `feedback.md: SHA-256 ${FEEDBACK_SHA256} matches the judges' letter (feedback-package.zip, package/letters/jeff-van-leenen.md)${how}`
                        : `feedback.md: SHA-256 ${got} DOES NOT MATCH the judges' letter ${FEEDBACK_SHA256}` };
}
// The headline claims: control/claims.json lists the strings README.md and results.md must each still
// contain (the held-out numbers and the two gate hashes). An entry with a folder is computed live:
// with a text too, the folder's SHA-256 must equal it (the frozen gate is still the frozen gate); with
// no text, the live hash itself must appear in the files (the shipped gate's hash is never stale).
export function claimsCheck() {
  const p = join(REPO, "control", "claims.json");
  if (!existsSync(p)) return { ok: false, text: "claims: control/claims.json is missing, so the headline numbers cannot be checked" };
  // The brief's order: results.md is written last. Before it exists there are no headline claims to guard.
  if (!existsSync(join(REPO, "results.md"))) return { ok: true, text: "claims: not checked here: results.md is not written yet at this commit" };
  const spec = JSON.parse(readFileSync(p, "utf8"));
  const bad = [];
  const docs = spec.files.map((f) => ({ f, text: existsSync(join(REPO, f)) ? lf(readFileSync(join(REPO, f), "utf8")) : null }));
  for (const { f, text } of docs) if (text === null) bad.push(`${f} is missing`);
  for (const c of spec.required) {
    let want = c.text;
    if (c.folder) {
      const dir = join(REPO, c.folder);
      if (!existsSync(dir)) { bad.push(`${c.folder}/ is missing (${c.claim})`); continue; }
      const live = folderSha256(dir);
      if (want && live !== want) { bad.push(`${c.folder}/ has SHA-256 ${live}, not the recorded ${want} (${c.claim})`); continue; }
      want = want || live;
    }
    // A claim with "in" names, per file, the exact sentence that states it: the whole sentence must be
    // there, so a number changed inside it fails. Without "in", the text must be in every file.
    if (c.in) {
      for (const [f, sentence] of Object.entries(c.in)) {
        const text = docs.find((d) => d.f === f)?.text ?? (existsSync(join(REPO, f)) ? lf(readFileSync(join(REPO, f), "utf8")) : null);
        if (text === null) { bad.push(`${f} is missing (${c.claim})`); continue; }
        const s = want ? sentence.replace("{}", want) : sentence;
        if (!text.includes(s)) bad.push(`${f} no longer says ${JSON.stringify(s)} (${c.claim})`);
      }
      continue;
    }
    for (const { f, text } of docs) if (text !== null && !text.includes(want)) bad.push(`${f} no longer says ${JSON.stringify(want)} (${c.claim})`);
  }
  const how = `${spec.required.length} claims, each in the sentences control/claims.json names`;
  return { ok: !bad.length, text: bad.length ? `claims: FAIL (${how}): ${bad.join("; ")}` : `claims: ${how} present (the headline numbers, seals and checker hashes; the shipped checker's hash computed live)` };
}
// The receipts are one archive in two places: rebuild/ carries the same bytes as original/ (CRLF folded).
export function receiptsCheck() {
  const o = join(REPO, "original", "tests", "receipts"), r = join(REPO, "rebuild", "tests", "receipts");
  if (!existsSync(o) || !existsSync(r)) return { ok: true, text: "receipts: not compared (an arm has no tests/receipts/)" };
  const names = [...new Set([...readdirSync(o), ...readdirSync(r)].filter((n) => /^round-.*\.md$/.test(n)))].sort();
  const bad = names.filter((n) => !existsSync(join(o, n)) || !existsSync(join(r, n)) || shaLF(readFileSync(join(o, n))) !== shaLF(readFileSync(join(r, n))));
  return { ok: !bad.length, text: bad.length ? `receipts: rebuild/tests/receipts/ DIFFERS from original/tests/receipts/: ${bad.join(", ")} (the archive is never edited)`
                                             : `receipts: rebuild/tests/receipts/ holds the same ${names.length} receipt files as original/ (bytes equal, CRLF folded)` };
}
