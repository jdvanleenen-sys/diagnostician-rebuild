// common.mjs - what the gates and verify.mjs share: the VERBATIM marker (defined once, here) and the
// list of receipt outputs with their pinned inputs. No check lives in this file.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const VERBATIM_MARKER = "VERBATIM OUTPUT BELOW";

export const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");

// File bytes with CRLF folded to LF, the same form the receipts' SHA-256 pins use.
export const lfBytes = (p) =>
  Buffer.from(readFileSync(p).toString("binary").replaceAll("\r\n", "\n"), "binary");

// Every tests/receipts/round-N-output.md with its round's pinned input (null when the input is missing).
export function receiptOutputs(root) {
  const dir = join(root, "tests", "receipts");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((n) => /^round-.*-output\.md$/.test(n)).sort().map((name) => {
    const inputPath = join(dir, name.replace(/-output\.md$/, "-input.md"));
    return {
      name, rel: `tests/receipts/${name}`,
      text: readFileSync(join(dir, name), "utf8"),
      input: existsSync(inputPath) ? readFileSync(inputPath) : null,
    };
  });
}

// The output part of a receipt: from the VERBATIM marker on, with the file line it starts at (1-based).
export function receiptBody(text) {
  const at = text.indexOf(VERBATIM_MARKER);
  if (at < 0) return null;
  return { text: text.slice(at), line: text.slice(0, at).split("\n").length };
}

// Which turns of which receipt answer a fix request, pinned when the receipt is recorded (data, not a guess
// from the text). The frozen-return gate checks exactly these turns. Round 1's message 2 asks the skill to
// pick between the owner's two fixes; round 2 has one message and no fix request.
export const FIX_REQUEST_TURNS = {
  "round-1-output.md": ["Response to message 2"],
};
// The turns each receipt holds, in order, pinned the same way. The frozen-return gate splits a receipt on
// these headings only, so a heading written inside a response stays part of that response.
export const RECEIPT_TURNS = {
  "round-1-output.md": ["Response to message 1", "Response to message 2"],
};
