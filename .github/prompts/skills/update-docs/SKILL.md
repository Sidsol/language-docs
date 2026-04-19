---
description: "**WORKFLOW SKILL** — Update previously imported documentation by re-fetching from the original source URL, comparing content hashes, and updating only changed files. USE FOR: refreshing stale documentation, pulling new pages from a previously imported source. DO NOT USE FOR: importing new documentation (use import-docs skill), listing tracked docs (use inventory-docs skill)."
---

## Overview

This skill updates documentation that was previously imported into the repository. It reads the manifest to find the original source URL, re-fetches the content, compares SHA256 content hashes to detect changes, and updates only the files that have actually changed. New pages are added; unchanged files are left untouched.

## Inputs

- **Package name** (required): The language/package to update (e.g., `react`, `csharp`), OR the keyword `all` to update every active source
- The source URL is looked up automatically from `docs/manifest.json`

## Workflow

### Step 1: Look Up Source in Manifest

1. Read `docs/manifest.json`
2. Find the `DocumentationSource` entry matching the requested package name (case-insensitive)
3. If no matching source exists:
   - Report: "No documentation found for `<package>`. Use the import-docs skill to import it first."
   - List available packages from the manifest
   - **STOP**
4. If the source status is `archived`:
   - Report: "Documentation for `<package>` is archived. Reactivate it first if you want to update."
   - **STOP**
5. Record the `sourceUrl` for re-fetching

### Step 2: Re-Fetch Documentation Content

1. Use the `fetch_webpage` tool to retrieve the latest content from the stored `sourceUrl`
2. If the URL is unreachable or returns an error:
   - Update the source's `status` to `"failed"` in the manifest
   - Report: "Failed to fetch updates from `<url>`: `<error message>`. Source marked as failed."
   - Write the updated manifest
   - **STOP**
3. **Discover and follow all child/sibling links** using the same link-discovery approach as import-docs:
   - Extract navigation links, sidebar links, and in-content links within the same documentation section
   - Only follow links on the same domain and under the same documentation path prefix
   - Recursively fetch all discovered child pages (up to depth 3)
   - Track all fetched URLs to avoid cycles
4. Extract the main documentation content from each page (same extraction rules as import-docs)

### Step 3: Convert and Compare

1. Convert fetched content to markdown with YAML frontmatter (same format as import-docs):

```yaml
---
sourceUrl: <original page URL>
fetchedAt: <current ISO 8601 timestamp>
language: <package name>
---
```

2. For each converted file, compute the SHA256 content hash
3. Compare against the stored `contentHash` in the manifest for each file:
   - **Changed**: Hash differs from stored hash → update this file
   - **Unchanged**: Hash matches stored hash → skip this file
   - **New**: File not found in manifest's file list → add this file
   - **Removed**: File in manifest but not in fetched content → leave existing file alone (do not delete)

### Step 4: Apply Updates

1. For **changed files**:
   - Overwrite the existing file at `docs/<package-name>/<filename>.md` with the new content
   - Update the file's `contentHash`, `fetchedAt`, and `size` in the manifest
2. For **new files**:
   - Write the new file to `docs/<package-name>/<filename>.md`
   - Add a new `DocumentationFile` entry to the source's `files` array
3. For **unchanged files**:
   - Do nothing — leave file and manifest entry untouched

### Step 5: Update Manifest

1. Update the source's `lastUpdatedAt` to the current timestamp
2. Ensure the source's `status` is `"active"` (in case it was previously `"failed"`)
3. Recompute `stats` (totalSources, totalFiles, totalSizeBytes, activeSources)
4. Update `lastUpdated` at the manifest root
5. Write the updated manifest to `docs/manifest.json`

### Step 6: Regenerate Index Files

If any files were added or updated, regenerate the index files:

1. **Package-level index** (`docs/<package-name>/README.md`): Regenerate the table of contents listing all documentation files in the folder with their descriptions, sorted logically
2. **Root-level index** (`docs/README.md`): Regenerate the root index listing all packages with file counts, last updated dates, and source links from the manifest

See the import-docs skill (Step 7) for the exact format of these index files.

### Step 7: Report Results

Report to the user a summary:
- Package name and source URL
- Files **updated**: count and list of filenames
- Files **added**: count and list of filenames
- Files **unchanged**: count
- Total files now tracked for this package

If no changes were detected:
- Report: "Documentation for `<package>` is already up to date. No changes needed."

## Outputs

- Updated markdown files in `docs/<package-name>/` (only changed ones)
- New markdown files (if new pages were found)
- Updated `docs/manifest.json` with current timestamps and hashes

## Handling "Update All"

If the user requests updating `all` packages:
1. Read the manifest and iterate over all sources with `status: "active"`
2. Run Steps 2-6 for each source sequentially
3. Report a combined summary at the end

## Example

**User input**: "Update the React documentation"

**Expected output** (if changes found):
```
Updated documentation for react (source: https://react.dev/reference/react/hooks)

  Updated: 1 file
    - hooks.md (content changed)
  
  Added: 1 file
    - server-components.md (new page)
  
  Unchanged: 2 files

Total files tracked: 4
```
