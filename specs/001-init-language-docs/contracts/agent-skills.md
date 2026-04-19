# Agent Skill Contracts

**Date**: 2026-04-18  
**Feature**: `001-init-language-docs`

---

## Agent: `docs-agent`

**Location**: `.github/agents/docs-agent.agent.md`  
**Description**: Imports, updates, and manages language/package documentation from web sources.

### Handoffs
- None (standalone agent, no inter-agent workflows)

### Invocation
User selects `@docs-agent` in VS Code chat and provides a command or URL.

---

## Skills

### `import-docs`

**Location**: `.github/prompts/skills/import-docs/SKILL.md`  
**Trigger**: User provides a documentation URL  

**Inputs**:
- URL to documentation page or root
- Optional: language/package name override

**Outputs**:
- Markdown files in `docs/<package-name>/` folder
- Updated `docs/manifest.json`

**Behavior**:
1. Fetch content from URL using `fetch_webpage` tool
2. Extract main documentation content (strip navigation/chrome)
3. Convert to well-structured markdown with YAML frontmatter
4. Determine package name from URL or user input
5. Create folder if it doesn't exist
6. Write files and update manifest

---

### `update-docs`

**Location**: `.github/prompts/skills/update-docs/SKILL.md`  
**Trigger**: User requests update for a specific language/package  

**Inputs**:
- Language/package name to update (or "all")

**Outputs**:
- Updated markdown files (only changed ones)
- Updated `docs/manifest.json`
- Summary of changes (files added, updated, unchanged)

**Behavior**:
1. Read manifest to find source URL for requested package
2. Re-fetch content from source URL
3. Compare content hashes to detect changes
4. Update only changed files; add new files
5. Update manifest timestamps and hashes

---

### `inventory-docs`

**Location**: `.github/prompts/skills/inventory-docs/SKILL.md`  
**Trigger**: User asks to list or show tracked documentation  

**Inputs**:
- Optional: filter by language/package name

**Outputs**:
- Formatted list of all tracked documentation sources with metadata

**Behavior**:
1. Read `docs/manifest.json`
2. Format and display sources with name, URL, last updated, file count
3. Report if no sources are tracked
