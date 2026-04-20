#!/bin/bash
# pre-tool-use hook: Protect docs/manifest.json from direct deletion
# and prevent removing the docs/ root directory.
set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
TOOL_ARGS=$(echo "$INPUT" | jq -r '.toolArgs')

# Only inspect destructive tools
if [ "$TOOL_NAME" = "bash" ]; then
  COMMAND=$(echo "$TOOL_ARGS" | jq -r '.command // empty')

  # Block direct deletion of manifest.json
  if echo "$COMMAND" | grep -qE "(rm|del|Remove-Item).*manifest\.json"; then
    echo '{"permissionDecision":"deny","permissionDecisionReason":"Cannot delete docs/manifest.json directly. Use the @docs-agent remove skill to properly clean up documentation."}'
    exit 0
  fi

  # Block rm -rf on the entire docs/ directory
  if echo "$COMMAND" | grep -qE "rm\s+-rf\s+(\.\/)?docs\/?$"; then
    echo '{"permissionDecision":"deny","permissionDecisionReason":"Cannot delete the entire docs/ directory. Use the @docs-agent remove skill to remove individual packages."}'
    exit 0
  fi
fi

# Allow everything else
