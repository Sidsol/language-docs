# Data Model: Auto-Sync Language & Package Documentation

**Date**: 2026-04-18  
**Feature**: `001-init-language-docs`

---

## Entities

### DocumentationSource

Represents a tracked documentation origin in the manifest.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier (lowercase alphanumeric + hyphens, e.g., `react-docs`) |
| `language` | string | ✓ | Human-readable language/framework name (e.g., `JavaScript/React`) |
| `packageName` | string | ✓ | Normalized folder name (lowercase, no spaces, e.g., `react`) |
| `sourceUrl` | string | ✓ | Original documentation root URL |
| `localPath` | string | ✓ | Relative path in repo (e.g., `docs/react`) |
| `importedAt` | ISO 8601 string | ✓ | Timestamp of first import |
| `lastUpdatedAt` | ISO 8601 string | ✓ | Timestamp of last successful update |
| `description` | string | ✓ | One-sentence description of the documentation |
| `files` | DocumentationFile[] | ✓ | Array of imported files |
| `status` | enum | ✓ | One of: `active`, `archived`, `failed` |

**Validation Rules**:
- `id` must be unique across all sources
- `packageName` must match the folder name under `docs/`
- `sourceUrl` must be a valid HTTP/HTTPS URL
- `status` transitions: `active` ↔ `archived`, `active` → `failed`, `failed` → `active`

---

### DocumentationFile

A single markdown file created from fetched content.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✓ | Filename (e.g., `hooks.md`) |
| `relativePath` | string | ✓ | Repo-relative path (e.g., `docs/react/hooks.md`) |
| `sourceUrl` | string | ✓ | URL of the original page |
| `fetchedAt` | ISO 8601 string | ✓ | When this file was last fetched |
| `contentHash` | string | ✓ | SHA256 hash of file content (for change detection) |
| `size` | number | ✓ | File size in bytes |

**Validation Rules**:
- `relativePath` must start with the parent source's `localPath`
- `contentHash` must be recomputed on every fetch and compared for updates

---

### DocumentationManifest

Root-level manifest stored at `docs/manifest.json`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | ✓ | Schema version (e.g., `1.0`) |
| `lastUpdated` | ISO 8601 string | ✓ | When manifest was last modified |
| `sources` | DocumentationSource[] | ✓ | All tracked documentation sources |
| `stats` | ManifestStats | ✓ | Aggregate statistics |

---

### ManifestStats

Computed aggregate statistics.

| Field | Type | Description |
|-------|------|-------------|
| `totalSources` | number | Count of all sources |
| `totalFiles` | number | Count of all files across all sources |
| `totalSizeBytes` | number | Total size of all imported files |
| `activeSources` | number | Count of sources with `status: active` |

---

## Relationships

```
DocumentationManifest (1)
  └── DocumentationSource (many)
        └── DocumentationFile (many)
```

- A manifest contains zero or more sources
- A source contains zero or more files
- Each file belongs to exactly one source
- Each source maps to exactly one folder under `docs/`

## State Transitions

### Source Status

```
  ┌──────────┐
  │  active   │ ←── initial import succeeds
  └────┬──────┘
       │ update fails
       ▼
  ┌──────────┐
  │  failed   │ ←── retry succeeds → back to active
  └──────────┘
       
  active ──── user archives ──── archived
  archived ── user reactivates ── active
```

## Imported Documentation File Format

Each imported markdown file includes YAML frontmatter for attribution:

```markdown
---
sourceUrl: https://react.dev/reference/react/hooks
fetchedAt: 2026-04-18T14:25:00Z
language: react
---

# Hooks

[Main documentation content here...]
```
