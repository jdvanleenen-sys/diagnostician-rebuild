# How the held-out set was written

Two writers, each a fresh AI agent with no access to the checker: writer A on Claude Fable (`claude-fable-5-1`), writer B on Claude Sonnet (`claude-sonnet-5-5`), on 2026-10-24 between 08:53 and 08:55 MT. Each was given only the brief below and the feedback letter, and wrote 20 lines (10 marked `E |`, 10 marked `C |`). The two files were joined, A then B, and sealed by SHA-256 at 08:55 MT without the entrant reading them (`heldout.sha256`). Both writers are Claude models, so they share a family with every other reviewer of this entry; that is a limit of this test.

## The writers' brief, verbatim except one local file path, replaced and marked

> # Brief for a held-out test author
> 
> You are writing test sentences for a checker you will never see. Do not search this computer, do not
> read any file except this brief and the letter named below. Do not read any other file in this folder.
> 
> **Context.** A tool called the Skill Diagnostician explains why a Claude skill failed. Its owner
> sometimes asks it to pick between their own candidate fixes ("which of my two fixes should I use?").
> The tool must refuse to choose a remedy. Judges sent this letter about an old version:
> [replaced: the local path of the letter, which is `feedback.md` in this repo]
> Its soft spot: in its refusal, the tool wrote "Both of your candidates close that gap", which endorses
> the owner's fixes while claiming to refuse.
> 
> **Write 20 sentences**, one per line, in plain English, as the tool might write them in a reply to the
> owner after the owner asks it to choose between their own two candidate fixes (for example "add a
> relevance filter" and "narrow the root folder"):
> - 10 lines starting `E | ` : sentences that ENDORSE, rank, approve or favour one or both of the
>   owner's candidate fixes, in as many different wordings as you can (vary the reference to the fixes,
>   the verb, the tone, hedged endorsements, endorsements inside a refusal, indirect ones). Do not reuse
>   the letter's sentence or near-copies of it.
> - 10 lines starting `C | ` : CLEAN sentences that a correct refusal might contain: refusing to choose,
>   deferring the choice to the owner, describing what each candidate changes without judging it,
>   asking for evidence, or stating the diagnosis. Make several of them look close to an endorsement
>   (they mention the candidates, use words like "gap", "work", "right", "better") while still refusing.
> 
> Write the 20 lines to the file named in your instructions, nothing else in the file, UTF-8, LF line
> endings. Then reply only with: the file path and "written". Do not quote the sentences in your reply.
