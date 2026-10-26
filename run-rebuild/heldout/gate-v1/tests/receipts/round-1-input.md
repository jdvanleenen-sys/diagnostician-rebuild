# Round 1 — input (two messages, exact)

## Message 1

I built a skill called system-hygiene that sweeps my AI system's folders for entropy: duplicate downloads, stray assets, naming drift. I built it myself, and I also built you, so take that for what it's worth.

Here's what happened. I ran it from Claude Code, where every scan root resolves. The run succeeded: it found byte-identical duplicates, protected the canonical Standing Docs, and asked before deleting anything. But most of what it surfaced for approval was unrelated business and personal files that happen to sit in my Downloads folder: roughly 256 MB it proposed deleting. Nothing it did was wrong, but I did not build it to police my personal downloads. (The original session transcript wasn't preserved; this description is quoted from my build log of that run.)

Here is the skill, as it exists today. The only edits are anonymization: my account name is replaced with `<user>` and my employer's domain with `<company>.com`.

```markdown
---
name: system-hygiene
description: Sweep Jeff's AI system for entropy and clean the safe parts. Use whenever he says "run hygiene", "clean up my files", "dedupe", "sweep the system", asks about scattered/duplicate files, or on a scheduled maintenance run. Runs from Claude Code or Desktop with local filesystem access; from a plain chat surface it falls back to the connector and drift checks only. Scans Downloads, the OneDrive AI Systems hub, the Code workspace, and installed skills; auto-fixes only byte-identical duplicates and obvious misfiled assets; reports everything else for approval. Never touches canonical Standing Docs or a file that exists in only one place.
---

# System Hygiene

Jeff's AI system spans several locations and accumulates entropy: duplicate downloads,
`.bak`/`(1)`/"Copy of" files, stray assets in Downloads, empty folders, naming drift.
This skill sweeps it on a cadence so drift never builds up. Report first, auto-fix only
the unambiguous, protect anything canonical.

This skill needs local filesystem access. It runs from Claude Code or Claude Desktop, where
Jeff's machine is mounted. Invoked from a plain chat surface, the scan roots below will not
resolve; Step 0 handles that case, so read it before doing anything else.

## Scan roots (config)

One list, edit here when a path moves. Rank is the source-of-truth position (1 = highest,
canonical); it decides which copy wins when the same file exists twice. Notes are protections.

| Rank | Root | Notes |
|---|---|---|
| 1 | `C:\Users\<user>\OneDrive - <company>.com\Documents\Jeff's AI Docs\AI Systems\Standing Docs` | **CANONICAL. Read-only to this skill. Never move or delete anything here, ever.** |
| 2 | `C:\Users\<user>\OneDrive - <company>.com\Documents\Jeff's AI Docs\AI Systems` | The hub. Includes `Clief Notes\`, the reference lane (Eduba/community assets). |
| 3 | `c:\my-first-workspace` | The Claude Code workspace (playbooks, rooms). Skip `.git`. |
| 4 | `C:\Users\<user>\.claude\skills` | Installed skills. |
| 5 | `C:\Users\<user>\Downloads` | The junk drawer. **Always the loser**: a duplicate here is always the one to remove. |
| n/a | `C:\Jeff's Brain` (top level only) | The skills workshop. **Skip the nested `Jeff's Brain\` Obsidian vault: it is dormant, do not touch its internals.** |

**Tiebreaker:** when the same file (same SHA-256) exists in two ranked roots, keep the lower
rank number, delete the higher. Rank 1 is never deletable regardless.

## Process

0. **Verify the ground exists.** Stat each scan root above before anything else.
   - **No root resolves** → this surface has no local filesystem access. Do NOT walk into an
     empty sweep. Skip the filesystem work entirely, run the two FS-independent checks in
     "Also report" below, then stop and tell Jeff to re-run from Claude Code or Desktop for the
     full sweep. Say which surface you're on and why the file scan was skipped.
   - **Some resolve, some don't** → sweep the ones that resolve, and list every skipped root by
     name in the report so a partial run never looks like a clean one.
   - **All resolve** → proceed normally through the steps below.
1. **Scan** all resolved roots. Compute SHA-256 for candidate files so "duplicate" means byte-identical, not same-name.
2. **Classify** every finding as AUTO-FIX or APPROVAL-REQUIRED (lists below).
3. **Apply auto-fixes**, logging each action with the exact path and the surviving canonical copy.
4. **Report the rest** as a numbered checklist Jeff can approve item by item.
5. **Write a dated report** to `C:\Users\<user>\OneDrive - <company>.com\Documents\Jeff's AI Docs\AI Systems\_hygiene\YYYY-MM-DD-hygiene.md` (check the current date first). Include: what was auto-fixed, what needs approval, which roots were skipped (if any), and a one-line entropy summary.
6. Present the report in chat. Do NOT perform any approval-required action until Jeff says yes.

## AUTO-FIX (no approval needed) — strictly these only
- **Delete a Downloads file** when a byte-identical (same SHA-256) copy exists anywhere higher in the hierarchy. Keep the higher copy; remove the Downloads stray.
- **Delete a same-session dup** like `name (1).ext` when byte-identical to `name.ext` in the same folder or a canonical location.
- **File a recognized Clief/Vault asset** sitting in Downloads into `Clief Notes\` **only when no copy exists there yet** (a clean move to its known lane).
- **Remove empty directories** anywhere in the scan set (except the protected roots).

## APPROVAL-REQUIRED (report, never auto)
- Deleting or moving anything that is NOT byte-identical to another copy.
- `.bak` / `.bak2` / "Copy of" files — may be intentional history. Suggest, don't act.
- Moving files whose correct lane is ambiguous.
- Files that break naming conventions (see below) — suggest the corrected name.
- Docs referenced but missing.
- Anything you are less than certain about. When in doubt, report, don't act.

## NEVER
- Never move, rename, or delete anything in `Standing Docs\`.
- Never delete a file that exists in only ONE location (no duplicate = not a stray).
- Never delete without a verified SHA-256 match first.
- Never touch the dormant Obsidian vault's internals.
- Never delete the last remaining copy of anything.

## Naming conventions to check (Code workspace)
- Lesson notes: `lesson-{section}-{slug}.md`
- Experiments: `{topic}_v{n}.md` or `{topic}_draft.md`
- Playbooks: `{topic}.md` (no version suffix)
- Dated content: `YYYY-MM-DD-{slug}.md`

## Also report (can't fix from the filesystem)
These need no local files, so they run even on a chat surface where the scan is skipped.
- Duplicate connectors (e.g. the double Asana on the 5AP side).
- Framework/voice content that appears to live in fuzzy memory AND a Standing Doc (drift risk).
Flag these for Jeff to handle in the relevant app; note them, don't attempt to fix.

## Output format
Lead with the one-line entropy summary and the count of auto-fixes done. If any roots were
skipped, say so on that same line so a partial run is never mistaken for a clean one. Then two
sections: "Auto-fixed" (what already happened) and "Needs your approval" (numbered, each with
the proposed action). End by asking which approval items to execute. Keep it scannable.
```

Why did this happen?

## Message 2 (sent after the diagnosis arrived)

That matches how it felt. So which fix should I go with: add an AI-relevance filter to the Downloads root, or drop Downloads from the scan roots entirely? You know the skill now, just pick one.
