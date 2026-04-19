---
description: "**WORKFLOW SKILL** — List all tracked documentation sources in the repository with metadata including package name, source URL, last updated date, and file count. USE FOR: discovering what documentation is available, checking when docs were last refreshed, getting an overview of tracked sources. DO NOT USE FOR: importing new docs (use import-docs skill), updating existing docs (use update-docs skill)."
---

## Overview

This skill reads the documentation manifest and presents a formatted inventory of all tracked documentation sources. It helps users discover what language/package documentation is already available in the repository and when it was last refreshed.

## Inputs

- **Package name** (optional): Filter the inventory to show only a specific language/package. If omitted, show all tracked sources.

## Workflow

### Step 1: Read Manifest

1. Read `docs/manifest.json`
2. If the manifest does not exist or cannot be read:
   - Report: "No documentation manifest found. No documentation has been imported yet."
   - **STOP**

### Step 2: Check for Sources

1. If `sources` array is empty:
   - Report: "No documentation sources are currently tracked. Use the import-docs skill to import documentation from a URL."
   - **STOP**
2. If a package name filter was provided, filter `sources` to only matching entries (case-insensitive)
3. If the filter matches no sources:
   - Report: "No documentation found for `<package>`. Available packages: `<comma-separated list>`"
   - **STOP**

### Step 3: Format and Display

For each `DocumentationSource`, display:

```
## <language> (<packageName>)

- **Source URL**: <sourceUrl>
- **Status**: <status>
- **Imported**: <importedAt>
- **Last Updated**: <lastUpdatedAt>
- **Files**: <files.length> files (<total size formatted>)
- **Local Path**: <localPath>
```

### Step 4: Display Summary

At the end, show aggregate stats from the manifest:

```
---
**Summary**: <totalSources> sources | <totalFiles> files | <totalSizeBytes formatted> total | <activeSources> active
```

## Outputs

- Formatted text listing all (or filtered) documentation sources with metadata
- Summary statistics

## Example

**User input**: "List all tracked documentation"

**Expected output**:
```
## JavaScript/React (react)

- **Source URL**: https://react.dev/reference/react/hooks
- **Status**: active
- **Imported**: 2026-04-18T14:25:00Z
- **Last Updated**: 2026-04-18T14:25:00Z
- **Files**: 3 files (125 KB)
- **Local Path**: docs/react

## C# (csharp)

- **Source URL**: https://learn.microsoft.com/en-us/dotnet/csharp/
- **Status**: active
- **Imported**: 2026-04-17T10:00:00Z
- **Last Updated**: 2026-04-17T10:00:00Z
- **Files**: 5 files (450 KB)
- **Local Path**: docs/csharp

---
**Summary**: 2 sources | 8 files | 575 KB total | 2 active
```
