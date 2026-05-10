#!/usr/bin/env node
// Post-processes the @synth-tree/api-types generated file to strip output
// that's incompatible with Apollo Client v4.
//
// Two specific surgeries:
//   1. Strip every `useFooSuspenseQuery` function body and its associated
//      `*SuspenseQueryHookResult` type alias. The codegen template emits
//      `baseOptions?` (optional), but Apollo Client v4's `useSuspenseQuery`
//      requires `variables` to be present, so the call signature doesn't
//      compile. None of these hooks are used by the apps; just remove them.
//   2. Drop the `import * as Apollo from "@apollo/client"` when it's unused.
//      Once `withResultType` / `withMutationFn` / `withMutationOptionsType`
//      are off in `codegen.yml`, no `Apollo.*` usages remain in the file.
//
// This script runs automatically as part of `pnpm codegen`.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, "../../../packages/api-types/src/graphql.ts");

const original = readFileSync(target, "utf8");
const lines = original.split("\n");
const out = [];

let removedSuspense = 0;
let removedAliases = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Drop the suspense-hook function definitions (multi-line, brace-balanced).
  if (/^export function use\w+SuspenseQuery\(/.test(line)) {
    let depth = (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0);
    i++;
    while (i < lines.length && depth > 0) {
      const l = lines[i];
      depth += (l.match(/\{/g)?.length ?? 0) - (l.match(/\}/g)?.length ?? 0);
      i++;
    }
    i--; // outer loop will i++ again
    removedSuspense++;
    continue;
  }

  // Drop the `*SuspenseQueryHookResult` aliases that referenced the removed hooks.
  if (/^export type \w+SuspenseQueryHookResult\s*=\s*ReturnType<typeof use\w+SuspenseQuery>;\s*$/.test(line)) {
    removedAliases++;
    continue;
  }

  out.push(line);
}

// If `Apollo` is no longer used anywhere in the file, drop the import.
const sansImport = out.filter(
  (l) => l.trim() !== `import * as Apollo from '@apollo/client';`,
);
const stillUsesApollo = sansImport.some((l) => /\bApollo\./.test(l));
const finalLines = stillUsesApollo ? out : sansImport;

writeFileSync(target, finalLines.join("\n"));

console.log(
  `[sanitize-codegen] removed ${removedSuspense} suspense hook(s) and ${removedAliases} suspense type alias(es)${
    stillUsesApollo ? "" : ", dropped unused 'import * as Apollo'"
  }`,
);
