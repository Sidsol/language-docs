# post-tool-use hook: Log documentation changes after file tools execute
$ErrorActionPreference = "Stop"

$rawInput = [Console]::In.ReadToEnd()
$hookInput = $rawInput | ConvertFrom-Json

$toolName = $hookInput.toolName
$resultType = $hookInput.toolResult.resultType

# Only track successful file operations
if ($resultType -ne "success") { exit 0 }

$filePath = $null
$argsObj = $hookInput.toolArgs | ConvertFrom-Json -ErrorAction SilentlyContinue

switch ($toolName) {
    { $_ -in "edit", "create" } {
        $filePath = if ($argsObj.path) { $argsObj.path } elseif ($argsObj.filePath) { $argsObj.filePath } else { $null }
    }
    default { exit 0 }
}

if (-not $filePath) { exit 0 }

# Only log docs/ changes
if ($filePath -match "docs[/\\]") {
    $timestamp = $hookInput.timestamp
    $logDir = "logs"
    if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }
    Add-Content -Path "$logDir/docs-changes.csv" -Value "$timestamp,$toolName,$filePath"
}
