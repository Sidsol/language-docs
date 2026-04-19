---
description: "**WORKFLOW SKILL** — Remove previously imported documentation from the repository. Deletes the package folder and all its files, removes the source entry from the manifest, and regenerates index files. USE FOR: removing documentation that is no longer needed, cleaning up stale or unwanted packages. DO NOT USE FOR: importing docs (use import-docs skill), updating docs (use update-docs skill), listing docs (use inventory-docs skill)."
---

## Overview

This skill removes a previously imported documentation package from the repository. It deletes the package folder and all its documentation files, removes the corresponding entry from `docs/manifest.json`, recomputes manifest stats, and regenerates the index files.

## Inputs

- **Package name** (required): The language/package to remove (e.g., `react`, `csharp`)

## Workflow

### Step 1: Look Up Source in Manifest

1. Read `docs/manifest.json`
2. Find the `DocumentationSource` entry matching the requested package name (case-insensitive)
3. If no matching source exists:
   - Report: "No documentation found for `<package>`. Nothing to remove."
   - List available packages from the manifest
   - **STOP**

### Step 2: Confirm Removal

1. Display what will be removed:
   - Package name and language
   - Number of files that will be deleted
   - Total size of files
   - Source URL
   - Local path
2. Ask: "Are you sure you want to remove all documentation for `<package>`? This will delete `<N>` files from `<localPath>/`. (yes/no)"
3. Wait for user confirmation
4. If user says "no" or "cancel":
   - Report: "Removal cancelled. No changes made."
   - **STOP**

### Step 3: Delete Documentation Files

1. Delete the entire `docs/<package-name>/` directory, including:
   - All `.md` documentation files
   - The `README.md` index file for the package
   - Any subdirectories within the package folder
2. If any file fails to delete, log a warning but continue with the remaining files

### Step 4: Update Manifest

1. Remove the `DocumentationSource` entry for this package from the `sources` array
2. Recompute `stats`:
   - `totalSources`: count of remaining sources
   - `totalFiles`: count of all files across remaining sources
   - `totalSizeBytes`: sum of all file sizes across remaining sources
   - `activeSources`: count of remaining sources with `status: "active"`
3. Update `lastUpdated` to the current timestamp
4. Write the updated manifest to `docs/manifest.json`

### Step 5: Regenerate Root Index

1. Regenerate `docs/README.md` to reflect the removal:
   - If sources remain, update the table to exclude the removed package
   - If no sources remain, replace with a message: "No documentation has been imported yet."

### Step 6: Report Results

Report to the user:
- Package name and number of files deleted
- Confirmation that the manifest has been updated
- Updated package count

## Outputs

- Deleted: `docs/<package-name>/` directory and all contents
- Updated: `docs/manifest.json` with source removed and stats recomputed
- Regenerated: `docs/README.md` root index

## Example

**User input**: "Remove the React documentation"

**Expected behavior**:
1. Look up `react` in manifest — found: 13 files, `docs/react/`
2. Confirm: "Are you sure you want to remove all documentation for `react`? This will delete 13 files from `docs/react/`."
3. User confirms
4. Delete `docs/react/` folder
5. Remove `react` entry from manifest, recompute stats
6. Regenerate `docs/README.md`

**Expected output**:
```
Removed documentation for react

  Deleted: 13 files from docs/react/
  Manifest updated: 1 source remaining (csharp)

docs/README.md regenerated.
```
