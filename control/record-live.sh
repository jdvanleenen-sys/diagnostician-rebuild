#!/bin/bash
# record-live.sh ARM REQUEST [OUTDIR] : record one live-path session the way run-*/live/ was recorded.
#
#   bash control/record-live.sh rebuild F01            # -> live-new/rebuild.F01.<time>/t1.json, t2.json
#   bash control/record-live.sh original C02 /tmp/x
#   MODEL=sonnet bash control/record-live.sh rebuild F01 run-new   # the second-model round (control/second-model-plan.md)
#
# MODEL is the --model value, opus unless set (the round in run-*/live/ ran on opus). ARM is original or
# rebuild. REQUEST is an id in control/live-requests.md (F01..F08, C01, C02). Needs the Claude Code CLI
# (`claude`) signed in; it spends that account's usage (each session in run-*/live/ cost US$0.49 to 1.10 on
# Opus 5.5, as the CLI reported it). Everything else is as the committed sessions say in their headers: a
# temporary copy of the arm's product files with tests/ and CHANGELOG.md removed; the arm's README install
# block as the system prompt; no settings, no MCP; message 1 is lines 5 to 102 of
# tests/receipts/round-1-input.md; message 2 is the request, exact; turn 2 resumes turn 1's session. The two
# result fields in t1.json and t2.json are what a session file's two responses hold. The skill is a model, so
# a new session is a new sample, not a replay: compare it by reading it with the checker (put it in a session
# file and run `node control/run.mjs`, or read it by eye), not by bytes.
set -euo pipefail
ARM="${1:?usage: record-live.sh original|rebuild REQUEST [OUTDIR]}"; REQ="${2:?request id, e.g. F01}"
MODEL="${MODEL:-opus}"
HERE="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${3:-$HERE/live-new}/$ARM.$REQ.$(date -u +%Y%m%dT%H%M%SZ)"
[ -d "$HERE/$ARM" ] || { echo "no arm $ARM"; exit 2; }
command -v claude >/dev/null || { echo "the Claude Code CLI (claude) is not installed"; exit 2; }
mkdir -p "$OUT"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
cp -r "$HERE/$ARM"/. "$WORK"/; rm -rf "$WORK/tests" "$WORK/CHANGELOG.md"
# message 1, exact
sed -n '5,102p' "$HERE/$ARM/tests/receipts/round-1-input.md" | tr -d '\r' > "$OUT/message-1.md"
# message 2: the request's text in control/live-requests.md, exact
node -e '
const fs=require("fs");const [f,id,out]=process.argv.slice(1);
const t=fs.readFileSync(f,"utf8").replace(/\r\n/g,"\n");
const s=t.split(/^## /m).find((x)=>x.startsWith(id+"\n"));
if(!s){console.error("no request "+id);process.exit(2)}
fs.writeFileSync(out,s.slice(s.indexOf("\n")+1).trim()+"\n");' "$HERE/control/live-requests.md" "$REQ" "$OUT/message-2.md"
# the install block, as the README states it (the same text for both arms)
SP='You are the Skill Diagnostician. Read identity.md and rules.md
before responding. Follow rules.md in order, every time. Load
reference files only as rules.md directs.'
grep -qF "Follow rules.md in order, every time." "$HERE/$ARM/README.md" || { echo "the install block is not in $ARM/README.md"; exit 2; }
UUID=$(node -e 'console.log(require("crypto").randomUUID())'); echo "$UUID" > "$OUT/uuid"
cd "$WORK"
date -u +%FT%TZ > "$OUT/t1.start"
claude -p --setting-sources "" --strict-mcp-config --model "$MODEL" --session-id "$UUID" --system-prompt "$SP" --output-format json < "$OUT/message-1.md" > "$OUT/t1.json"
claude -p --setting-sources "" --strict-mcp-config --model "$MODEL" --resume "$UUID" --output-format json < "$OUT/message-2.md" > "$OUT/t2.json"
date -u +%FT%TZ > "$OUT/done"; echo "$MODEL" > "$OUT/model"
echo "recorded: $OUT"
