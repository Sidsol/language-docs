# pre-tool-use hook: Protect docs/manifest.json from direct deletion
# and prevent removing the docs/ root directory.
$ErrorActionPreference = "Stop"

$rawInput = [Console]::In.ReadToEnd()
$hookInput = $rawInput | ConvertFrom-Json

$toolName = $hookInput.toolName
$toolArgs = $hookInput.toolArgs

if ($toolName -eq "bash") {
    $argsObj = $toolArgs | ConvertFrom-Json -ErrorAction SilentlyContinue
    $command = $argsObj.command

    if ($command -and $command -match "(rm|del|Remove-Item).*manifest\.json") {
        @{
            permissionDecision = "deny"
            permissionDecisionReason = "Cannot delete docs/manifest.json directly. Use the @docs-agent remove skill to properly clean up documentation."
        } | ConvertTo-Json -Compress
        exit 0
    }

    if ($command -and $command -match "rm\s+-rf\s+(\.\/)?docs\/?$") {
        @{
            permissionDecision = "deny"
            permissionDecisionReason = "Cannot delete the entire docs/ directory. Use the @docs-agent remove skill to remove individual packages."
        } | ConvertTo-Json -Compress
        exit 0
    }
}

# Allow everything else
