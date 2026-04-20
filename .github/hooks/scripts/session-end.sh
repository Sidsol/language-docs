#!/bin/bash
# session-end hook: Auto-commit uncommitted docs/ changes when session ends
set -e

INPUT=$(cat)
REASON=$(echo "$INPUT" | jq -r '.reason')

# Only auto-commit on clean session end
if [ "$REASON" != "complete" ]; then
  exit 0
fi

# Check for uncommitted changes under docs/
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  exit 0
fi

DOCS_CHANGES=$(git status --porcelain docs/ 2>/dev/null)

if [ -z "$DOCS_CHANGES" ]; then
  exit 0
fi

# Stage and commit docs/ changes
git add docs/
git commit -m "docs: auto-commit documentation changes from agent session"
