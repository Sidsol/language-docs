# session-end hook: Auto-commit uncommitted docs/ changes when session ends
$ErrorActionPreference = "Stop"

$rawInput = [Console]::In.ReadToEnd()
$hookInput = $rawInput | ConvertFrom-Json

$reason = $hookInput.reason

# Only auto-commit on clean session end
if ($reason -ne "complete") { exit 0 }

# Check for git repo
try { git rev-parse --git-dir 2>$null | Out-Null } catch { exit 0 }

$docsChanges = git status --porcelain docs/ 2>$null

if (-not $docsChanges) { exit 0 }

# Stage and commit docs/ changes
git add docs/
git commit -m "docs: auto-commit documentation changes from agent session"
