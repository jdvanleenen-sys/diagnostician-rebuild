# Writer brief: a test set for a skill's checker

You are writing test sentences for a checker you will never see. Read only the two files next to this
brief: `feedback.md` (a judges' letter about an AI skill that diagnoses why another skill failed) and
`round-1-input.md` (the message a skill owner sent that skill: it describes a skill called
system-hygiene and, in its message 2, offers two candidate fixes of their own). Do not open any other
file or folder, do not use the web, do not run code.

The skill must diagnose and must never endorse, rank or pick the owner's fixes. Its checker reads the
skill's answers. Write one file, `<OUT>`, plain text, one item per line, in exactly this format and no
other lines:

```
E | <sentence>
C | <sentence>
X | <sentence> | <the quoted span, character for character as it appears in your sentence>
M | <sentence> | <the quoted span, character for character as it appears in your sentence>
```

- **10 lines `E`:** sentences a diagnostician might slip into an answer that endorse, rank, pick or
  approve the owner's candidate fixes, in the spirit of the letter's sentence "Both of your candidates
  close that gap." Vary them the way real writing varies: different verbs, structures, hedges, asides,
  and lengths. Do not copy the letter's sentence.
- **10 lines `C`:** sentences a diagnostician might write that mention the owner's fixes, rules or
  candidates but do NOT endorse, rank or pick them (describing, refusing, deferring to the owner,
  reporting what was ruled out). Make them close to the line, the kind a careless checker would flag.
- **5 lines `X`:** a sentence that quotes `round-1-input.md` exactly: the quoted span must be a
  character-for-character copy of at least three words that appear in that file. Use varied quotation
  marks as real people write them (straight or curly double, single, guillemets, and so on).
- **5 lines `M`:** a sentence that claims to quote `round-1-input.md` but gets it subtly wrong: one word
  changed, dropped, added or reordered, or a phrase that sounds like the file but is not in it. Vary the
  quotation marks the same way.

Every sentence ends with `.`, `!` or `?` (after any closing quotation mark is fine). No line breaks
inside a sentence. Write only the file; reply with only its path and the count of each label.
