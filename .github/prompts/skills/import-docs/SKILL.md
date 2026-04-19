---
description: "**WORKFLOW SKILL** — Import documentation from a URL into the repository. Fetches web content, converts to well-structured markdown with YAML frontmatter, organizes into docs/<package-name>/ folders, and updates the manifest. USE FOR: importing new documentation from a URL for any language, framework, or package. DO NOT USE FOR: updating existing docs (use update-docs skill), listing tracked docs (use inventory-docs skill)."
---

## Overview

This skill imports documentation from a provided URL into the repository. It fetches the web content, **discovers all child/sibling documentation links** on the page, recursively fetches each linked page, extracts the main documentation body, converts it to clean markdown with source attribution frontmatter, and saves it to an organized folder structure under `docs/`.

## Inputs

- **URL** (required): A link to a documentation page or documentation root (e.g., `https://react.dev/reference/react`)
- **Package name** (optional): Override the auto-detected package/language name (e.g., `react`, `csharp`)
- **Depth** (optional): Maximum link-following depth (default: 4). Use `1` for a single page only.

## Workflow

### Step 1: Determine Package Name

1. If the user provided an explicit package name, use it (lowercase, no spaces, hyphens for separators)
2. Otherwise, infer the package name from the URL:
   - Extract the domain or path segment that identifies the language/package
   - Examples: `react.dev` → `react`, `learn.microsoft.com/.../csharp/` → `csharp`, `docs.python.org` → `python`
3. Normalize: lowercase, replace spaces with hyphens, remove special characters

### Step 2: Check for Existing Documentation

1. Read `docs/manifest.json` to check if this package already has an entry
2. If the package already exists in the manifest:
   - **STOP** and ask the user: "Documentation for `<package>` already exists (imported from `<existing-url>`). Do you want to: (a) merge new content alongside existing files, (b) replace all existing content, or (c) cancel?"
   - Wait for user response before proceeding
3. If the package does not exist, proceed to Step 3

### Step 3: Fetch and Discover Documentation Pages

This is the most critical step. Documentation sites typically have **deeply nested navigation structures** (e.g., C# Language Reference → Operators and expressions → Arithmetic operators, Boolean logical operators, etc.). You MUST crawl these structures to import complete documentation.

#### 3a: Fetch the Root Page

1. Use the `fetch_webpage` tool to retrieve the content from the provided URL
2. If the URL is unreachable or returns an error:
   - Report: "Failed to fetch documentation from `<url>`: `<error message>`"
   - **Do NOT create any folders or files**
   - **STOP**

#### 3b: Discover Child Links

1. From the fetched page content, identify **all documentation links** that are children or siblings within the same documentation section. Look for:
   - **Navigation menus / sidebars**: These often list all pages in a section (e.g., table of contents, left-nav, breadcrumb trails)
   - **In-page links**: Links within the content body that point to sub-topics
   - **"See also" / "Related" sections**: Links at the bottom of pages pointing to related topics
   
2. **Link filtering rules** — Only follow links that:
   - Are on the **same domain** as the root URL
   - Are within the **same documentation path prefix** (e.g., if root is `learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/`, only follow links under that path or its parent `language-reference/` path)
   - Point to **documentation content pages** (not API references for individual methods unless that's the section being imported, not blog posts, not download pages)
   - Have NOT already been fetched in this import session (avoid cycles)

3. **Link discovery strategies** (try these in order):
   - **Strategy 1 — Sidebar/Nav extraction**: Look for navigation structures (`<nav>`, `<aside>`, `.sidebar`, `.toc`, table of contents) and extract ALL links from them. This is the most reliable for getting complete documentation trees.
   - **Strategy 2 — Content body links**: Extract links from the main content body that point to pages under the same documentation path.
   - **Strategy 3 — Section index pages**: If the page appears to be an index/overview page listing sub-topics, extract all listed topic links.

4. Build a **complete URL queue** of all discovered pages to fetch.

#### 3c: Recursively Fetch All Discovered Pages

1. For each discovered URL in the queue (up to the configured depth limit):
   - Fetch the page using `fetch_webpage`
   - Extract the main documentation content
   - Discover any NEW child links not already in the queue (repeat 3b)
   - Add new links to the queue
2. Continue until:
   - All discovered links have been fetched, OR
   - The depth limit is reached, OR
   - No new links are discovered
3. **Rate limiting**: Wait briefly between fetches to be respectful to the source server
4. **Progress reporting**: For large documentation sets (>10 pages), report progress periodically (e.g., "Fetched 15 of ~30 pages...")
5. If a specific child page fails to fetch, log a warning and continue with the remaining pages — do NOT abort the entire import

#### 3d: Organize Into Logical Files

After fetching all pages, organize them into files:
- Each fetched page becomes one markdown file
- Use the page's heading/title to derive the filename
- If a section has sub-pages, consider using subdirectories to mirror the documentation hierarchy:
  - Example: `docs/csharp/operators/` for all operator pages under the operators section
  - OR flat structure with descriptive names: `operators-arithmetic.md`, `operators-boolean-logical.md`
- Prefer **flat structure with descriptive names** unless the hierarchy is very deep (4+ levels)

### Step 4: Convert to Markdown

1. Convert the extracted content to well-structured markdown:
   - Preserve headings hierarchy (h1 → `#`, h2 → `##`, etc.)
   - Preserve code blocks with language annotations (````typescript`, ````python`, etc.)
   - Preserve tables, lists, and links
   - Remove HTML artifacts, inline styles, and script tags
2. Add YAML frontmatter at the top of each file:

```yaml
---
sourceUrl: <original page URL>
fetchedAt: <ISO 8601 timestamp, e.g., 2026-04-18T14:25:00Z>
language: <package name>
---
```

3. Determine a descriptive filename from the page title or main heading (lowercase, hyphens, `.md` extension)
   - Example: "React Hooks Reference" → `hooks-reference.md`

### Step 5: Save Files

1. Create the `docs/<package-name>/` directory if it doesn't exist
2. Write each markdown file to `docs/<package-name>/<filename>.md`
3. Do NOT overwrite any existing files (skip and warn if a filename collision occurs)

### Step 6: Update Manifest

1. Read the current `docs/manifest.json`
2. Create a new `DocumentationSource` entry:

```json
{
  "id": "<package-name>-docs",
  "language": "<human-readable name, e.g., JavaScript/React>",
  "packageName": "<package-name>",
  "sourceUrl": "<root URL provided by user>",
  "localPath": "docs/<package-name>",
  "importedAt": "<current ISO 8601 timestamp>",
  "lastUpdatedAt": "<current ISO 8601 timestamp>",
  "description": "<one-sentence description of the documentation>",
  "files": [
    {
      "name": "<filename>.md",
      "relativePath": "docs/<package-name>/<filename>.md",
      "sourceUrl": "<original page URL for this file>",
      "fetchedAt": "<ISO 8601 timestamp>",
      "contentHash": "<SHA256 hash of the file content>",
      "size": <file size in bytes>
    }
  ],
  "status": "active"
}
```

3. Add the new source to the `sources` array
4. Recompute `stats`:
   - `totalSources`: count of all sources
   - `totalFiles`: count of all files across all sources
   - `totalSizeBytes`: sum of all file sizes
   - `activeSources`: count of sources with `status: "active"`
5. Update `lastUpdated` to the current timestamp
6. Write the updated manifest back to `docs/manifest.json`

### Step 7: Generate Index Files

After all documentation files are saved, generate `README.md` index files for navigability:

#### 7a: Package-Level Index (`docs/<package-name>/README.md`)

Create (or overwrite) a `README.md` in each package folder that serves as a table of contents:

```markdown
# <Language/Package Name> Documentation

> Source: <sourceUrl>  
> Last imported: <timestamp>

## Contents

| File | Description |
|------|-------------|
| [tour-of-csharp.md](tour-of-csharp.md) | Tour of C# |
| [type-system.md](type-system.md) | Type system |
| [operators.md](operators.md) | Operators overview |
| [operators-arithmetic.md](operators-arithmetic.md) | Arithmetic operators |
| ... | ... |

*<N> files | Imported from [source](<sourceUrl>)*
```

**Rules for the package README**:
- List ALL documentation files in the folder (exclude README.md itself and any non-documentation files)
- Sort files logically: group related files together (e.g., all operator files together), then alphabetically within groups
- The "Description" column should use the file's top-level heading (`# ...`) or the filename if no heading is found
- Include the source URL and import timestamp at the top

#### 7b: Root-Level Index (`docs/README.md`)

Create (or overwrite) a `docs/README.md` that lists all imported packages:

```markdown
# Documentation Index

Imported documentation for languages and packages.

| Package | Language | Files | Last Updated | Source |
|---------|----------|-------|--------------|--------|
| [csharp](csharp/) | C# | 13 | 2026-04-19 | [learn.microsoft.com](https://learn.microsoft.com/...) |
| [react](react/) | JavaScript/React | 13 | 2026-04-19 | [react.dev](https://react.dev/...) |

*<N> packages | <M> total files*
```

**Rules for the root README**:
- Read `docs/manifest.json` to get the list of all sources
- Link each package name to its folder (which contains its own README.md)
- Show file count, last updated date (short format), and a shortened source link
- Sort packages alphabetically

### Step 8: Report Results

Report to the user:
- Package name and folder created
- Number of files imported
- List of file names with brief descriptions
- Source URL recorded
- Any warnings (skipped files, content quality concerns)

## Outputs

- Markdown files in `docs/<package-name>/` with YAML frontmatter
- `docs/<package-name>/README.md` — package-level table of contents
- `docs/README.md` — root-level index of all packages
- Updated `docs/manifest.json` with new source entry and recalculated stats

## Content Hash Computation

To compute the SHA256 content hash for each file, hash the full file content (including frontmatter). This hash is used later by the update-docs skill to detect changes.

**Important**: Use a consistent hashing approach. The agent should compute the hash as a hex-encoded SHA256 digest of the UTF-8 file content.

## Example

**User input**: "Import docs from https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/"

**Expected behavior**:
1. Fetch the root operators page (Overview)
2. Discover child links in the sidebar/nav: Arithmetic operators, Boolean logical operators, Bitwise and shift operators, Collection expressions, Equality operators, Comparison operators, etc.
3. Fetch each child page
4. Convert each page to markdown with frontmatter
5. Save all files to `docs/csharp/`

**Expected result**:
```
docs/
├── README.md                              (root index updated)
├── manifest.json                          (updated with "csharp" source)
└── csharp/
    ├── README.md                          (package index)
    ├── operators-overview.md              (root page)
    ├── operators-arithmetic.md            (child page)
    ├── operators-boolean-logical.md       (child page)
    ├── operators-bitwise-and-shift.md     (child page)
    ├── operators-collection-expressions.md (child page)
    ├── operators-equality.md              (child page)
    └── operators-comparison.md            (child page)
```

**Single page example**: "Import docs from https://react.dev/reference/react/hooks" (with depth=1)

```
docs/
├── README.md             (root index updated)
├── manifest.json         (updated with "react" source)
└── react/
    ├── README.md          (package index)
    └── hooks.md           (single page with frontmatter)
```

**hooks.md content**:
```markdown
---
sourceUrl: https://react.dev/reference/react/hooks
fetchedAt: 2026-04-18T14:25:00Z
language: react
---

# Hooks

[Documentation content here...]
```

## Error Handling

### Unreachable URL
If the URL returns a network error, timeout, 404, 500, or any non-success HTTP status:
- Report: "Failed to fetch documentation from `<url>`: `<error details>`"
- Do NOT create any folders or files
- Do NOT modify the manifest
- Suggest the user verify the URL is correct and accessible

### Non-Documentation Content
If the fetched page does not appear to contain structured documentation (e.g., it's a marketing page, login page, or mostly images):
- Warn: "The content at `<url>` does not appear to be structured documentation. Proceeding with best-effort extraction."
- Import whatever content is available but flag the warning in the report
- Let the user review the imported content and decide whether to keep it

### Duplicate Package Name Conflict
If the user provides a URL for a package that already exists in the manifest:
- Do NOT silently overwrite
- Ask: "Documentation for `<package>` already exists (imported from `<existing-url>`). Do you want to: (a) merge new content alongside existing files, (b) replace all existing content, or (c) cancel?"
- Wait for user response

### Empty Content
If the extracted content is empty or only contains boilerplate:
- Report: "No meaningful documentation content could be extracted from `<url>`."
- Do NOT create any files or folders
- Suggest trying a more specific documentation page URL
