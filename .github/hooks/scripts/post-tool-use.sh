#!/bin/bash
# post-tool-use hook: Log documentation changes after file tools execute
set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
TOOL_ARGS=$(echo "$INPUT" | jq -r '.toolArgs')
RESULT_TYPE=$(echo "$INPUT" | jq -r '.toolResult.resultType')

# Only track successful file operations
if [ "$RESULT_TYPE" != "success" ]; then
  exit 0
fi

# Check if the tool touched files under docs/
FILE_PATH=""
case "$TOOL_NAME" in
  edit|create)
    FILE_PATH=$(echo "$TOOL_ARGS" | jq -r '.path // .filePath // empty')
    ;;
  bash)
    # Skip bash commands — too complex to reliably extract file paths
    exit 0
    ;;
  *)
    exit 0
    ;;
esac

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only log docs/ changes
if echo "$FILE_PATH" | grep -q "docs/"; then
  TIMESTAMP=$(echo "$INPUT" | jq -r '.timestamp')
  LOG_DIR="logs"
  mkdir -p "$LOG_DIR"
  echo "${TIMESTAMP},${TOOL_NAME},${FILE_PATH}" >> "${LOG_DIR}/docs-changes.csv"
fi
