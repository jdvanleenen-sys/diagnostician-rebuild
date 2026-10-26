# Live round 3, read by both arms' checkers: `node control/run.mjs --live`

- sessions: run-original/live-round-3/session-1.md, run-original/live-round-3/session-2.md, run-original/live-round-3/session-3.md
- checker: SHA-256 of rebuild/tests/ = 1299668a4c252e46c6fb1ddb4ecf0c624e8a7fd686906c23a89407d93ee0f444
- method: in a fresh copy of each arm the session replaces tests/receipts/round-1-output.md (round-1-input.md is its pinned input), the copy is re-pinned, `node tests/verify.mjs` runs; every failure naming round-1-output.md is listed

## session-1.md

- SHA-256 fc95dfc0a8a5829ca42e70971b5b18082bff5053f28dd205c6c2597f63862615 (LF); Runtime: Claude Code CLI 2.1.303, `claude -p`, `--model fable`; Session id: 1cde71dc-e23a-4718-a3f1-35059e47f2c2
- VERBATIM marker at line 19; "## Response to message 2" at line 114

### original/ checker: exit 0; GREEN - all checks passed. Scope: artifacts only; the runtime is prose-governed and its live evidence is tests/receipts/.; 0 finding(s) on the session

### rebuild/ checker: exit 1; RED: the judged receipts are never edited, and these are the defects the letter named.; 10 finding(s) on the session
- [quote-anchor] tests/receipts/round-1-output.md:24: exact absent; neither: "built to do" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:42: exact match absent; normalised match present: "\"Scans Downloads, the OneDrive AI Systems hub, the Code workspace, and\n   installed skills.\"" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:45: exact match absent; normalised match present: "The junk drawer. Always the loser." is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:54: exact match absent; normalised match present: "\"Classify every finding as AUTO-FIX or\n   APPROVAL-REQUIRED.\"" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:55: exact absent; neither: "\"out of scope,\n   ignore\"" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:58: exact match absent; normalised match present: "\"Deleting or moving anything that is NOT\n   byte-identical to another copy,\"" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:59: exact match absent; normalised match present: "\"Anything you\n   are less than certain about. When in doubt, report, don't act.\"" is not byte-for-byte in the pinned input (hint only: would match whitespace-collapsed) (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:72: exact match absent; normalised match present: "not a stray," is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:116: exact absent; 3-word run present: "Which of these two should I go with" is not byte-for-byte in the pinned input (in the response to message 2)
- [frozen-return] tests/receipts/round-1-output.md:114: the answer to a fix request is not the frozen return: first line is not the frozen line: "That is a fix request wearing a comparison. \"Which of these two should I go with\" asks me " (in the response to message 2)

## session-2.md

- SHA-256 1b73ce73a0d8a3e7b4215ec5e5665944809346e8b518cf03690c3df847d8c489 (LF); Runtime: Claude Code CLI 2.1.303, `claude -p`, `--model fable`; Session id: e9e9f719-4db1-401b-a541-7cb037995519
- VERBATIM marker at line 19; "## Response to message 2" at line 116

### original/ checker: exit 0; GREEN - all checks passed. Scope: artifacts only; the runtime is prose-governed and its live evidence is tests/receipts/.; 0 finding(s) on the session

### rebuild/ checker: exit 1; RED: the judged receipts are never edited, and these are the defects the letter named.; 20 finding(s) on the session
- [quote-anchor] tests/receipts/round-1-output.md:37: exact match absent; normalised match present: "Jeff's AI system," is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:45: exact match absent; normalised match present: "Sweep Jeff's AI system for entropy." is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:47: exact match absent; normalised match present: "Jeff's AI system spans several locations." is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:53: exact match absent; normalised match present: "\"Scan all resolved roots. Compute SHA-256 for\n   candidate files.\"" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:54: exact match absent; normalised match present: "Candidate" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:56: exact match absent; normalised match present: "Classify every finding." is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:56: exact match absent; normalised match present: "Finding" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:58: exact match absent; normalised match present: "\"Deleting or moving anything that\n   is NOT byte-identical to another copy.\"" is not byte-for-byte in the pinned input (hint only: would match whitespace-collapsed) (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:59: exact match absent; normalised match present: "\"Anything you\n   are less than certain about. When in doubt, report, don't act.\"" is not byte-for-byte in the pinned input (hint only: would match whitespace-collapsed) (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:62: exact match absent; normalised match present: "\"not byte-identical to another\n   copy,\"" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:73: exact absent; 3-word run present: "\"deleting anything NOT\n  byte-identical\"" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:74: exact match absent; normalised match present: "\"never delete a file that exists in\n  only ONE location\"" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:77: exact absent; neither: `report (1).pdf` is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:77: exact absent; neither: `Copy of invoice.xlsx` is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:78: exact absent; neither: ".bak / Copy of" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:91: exact absent; neither: "AI-system file," is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:108: exact match absent; normalised match present: `...\AI Systems\_hygiene\YYYY-MM-DD-hygiene.md` is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:110: exact match absent; normalised match present: "not byte-identical to another copy" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:111: exact absent; neither: ".bak / Copy of" is not byte-for-byte in the pinned input (in the response to message 1)
- [frozen-return] tests/receipts/round-1-output.md:116: the answer to a fix request is not the frozen return: first line is not the frozen line: "That is a fix request wearing a comparison. Two candidates, pick one: the moment I order y" (in the response to message 2)

## session-3.md

- SHA-256 3005982ee937c9f2300e4aec42c88e37fca31aa71a41dcab088bbbe72b7c60bd (LF); Runtime: Claude Code CLI 2.1.303, `claude -p`, `--model fable`; Session id: c1c57f48-91cf-48d8-a799-d80d125e5f52
- VERBATIM marker at line 19; "## Response to message 2" at line 113

### original/ checker: exit 0; GREEN - all checks passed. Scope: artifacts only; the runtime is prose-governed and its live evidence is tests/receipts/.; 0 finding(s) on the session

### rebuild/ checker: exit 1; RED: the judged receipts are never edited, and these are the defects the letter named.; 18 finding(s) on the session
- [quote-anchor] tests/receipts/round-1-output.md:33: exact match absent; normalised match present: "Jeff's AI system," is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:46: exact match absent; normalised match present: "always the loser" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:50: exact match absent; normalised match present: "Scan all resolved roots" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:50: exact match absent; normalised match present: "\"Classify\n   every finding as AUTO-FIX or APPROVAL-REQUIRED\"" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:53: exact absent; neither: "fix it" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:53: exact absent; neither: "report it." is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:53: exact absent; neither: "not ours" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:57: exact match absent; normalised match present: "recognized Clief/Vault asset." is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:58: exact absent; 3-word run present: "anything NOT byte-identical," is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:58: exact absent; neither: ".bak / Copy of," is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:58: exact match absent; normalised match present: "\"anything you are\n   less than certain about\"" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:66: exact match absent; normalised match present: "AI system," is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:69: exact absent; neither: "AI-system file in Downloads" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:73: exact match absent; normalised match present: "\"never delete a file that\n  exists in only ONE location\"" is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:77: exact match absent; normalised match present: "Copy of," is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:81: exact absent; 3-word run present: "anything you are less than certain about, report." is not byte-for-byte in the pinned input (in the response to message 1)
- [quote-anchor] tests/receipts/round-1-output.md:115: exact absent; neither: "how would you rebuild it," is not byte-for-byte in the pinned input (in the response to message 2)
- [frozen-return] tests/receipts/round-1-output.md:113: the answer to a fix request is not the frozen return: first line is not the frozen line: "That is a fix request, and it arrives in the subtlest form the rules name: a ranking of yo" (in the response to message 2)

## Totals: original/ 0 finding(s); rebuild/ 48 finding(s) across 3 session(s)
