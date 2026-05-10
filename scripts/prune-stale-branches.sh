#!/usr/bin/env bash
# Prune stale local + remote branches.
#
# Usage:
#   ./scripts/prune-stale-branches.sh           # dry-run, print what it would delete
#   ./scripts/prune-stale-branches.sh --apply   # actually delete
#
# What this does:
#   1. Local: deletes every local branch that's already merged into main.
#   2. Remote: deletes every origin/* branch whose tip is an ancestor of main
#      (i.e., its PR was merged) and prints a list of unmerged remote branches
#      for human review.
#
# This script never force-deletes. Branches with unmerged commits are left alone.

set -euo pipefail

APPLY=false
if [[ "${1:-}" == "--apply" ]]; then
  APPLY=true
fi

run_or_print() {
  if $APPLY; then
    echo "+ $*"
    "$@"
  else
    echo "would run: $*"
  fi
}

echo "=== Fetching latest refs from origin ==="
git fetch --prune

echo
echo "=== Local branches merged into main ==="
LOCAL_MERGED=$(git branch --merged main --format='%(refname:short)' | grep -vE '^(main|\*)?$' || true)
if [[ -z "$LOCAL_MERGED" ]]; then
  echo "(none)"
else
  while IFS= read -r b; do
    run_or_print git branch -d "$b"
  done <<< "$LOCAL_MERGED"
fi

echo
echo "=== Remote branches whose tip is in main (PR was merged) ==="
git for-each-ref --format='%(refname:short)' refs/remotes/origin \
  | grep -v '^origin/main$' \
  | grep -v '^origin/HEAD' \
  | while read -r ref; do
      sha=$(git rev-parse "$ref")
      if git merge-base --is-ancestor "$sha" main; then
        short=${ref#origin/}
        run_or_print git push origin --delete "$short"
      fi
    done

echo
echo "=== Remote branches NOT yet merged (manual review needed) ==="
git for-each-ref --format='%(refname:short)' refs/remotes/origin \
  | grep -v '^origin/main$' \
  | grep -v '^origin/HEAD' \
  | while read -r ref; do
      sha=$(git rev-parse "$ref")
      if ! git merge-base --is-ancestor "$sha" main; then
        echo "  ${ref#origin/}"
      fi
    done

echo
if $APPLY; then
  echo "=== Done. Re-run 'git fetch --prune' on other clones to pick up the deletions. ==="
else
  echo "=== Dry run complete. Pass --apply to actually delete. ==="
fi
