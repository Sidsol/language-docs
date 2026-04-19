# Research: Auto-Sync Language & Package Documentation

**Date**: 2026-04-18  
**Feature**: `001-init-language-docs`

---

## 1. VS Code Agent and Skill File Format

### Decision
Use YAML frontmatter + Markdown body pattern with `.agent.md` for orchestration and `SKILL.md` files for domain-specific capabilities.

### Rationale
- The existing speckit infrastructure uses this exact pattern (15+ agent files in `.github/agents/`)
- VS Code natively discovers `.agent.md` files in `.github/agents/` and skill files in `.github/prompts/skills/`
- Frontmatter provides machine-readable metadata (`description`, `handoffs`, `tools`); body contains human-readable instructions
- Skills are modular and reusable — each skill defines a single capability (import, update, inventory)

### Key Format Details
- **Agent file**: `.github/agents/docs-agent.agent.md` — YAML frontmatter with `description` and optional `handoffs` array, Markdown body with goals, execution steps, and output format
- **Skill files**: `.github/prompts/skills/<skill-name>/SKILL.md` — YAML frontmatter with `description`, Markdown body with overview, inputs, outputs, and implementation notes
- Skills are referenced by agents, not invoked directly by users

### Alternatives Considered
- YAML-only files: No agent discovery; requires custom tooling — rejected
- Single `.instructions.md`: Scales poorly; can't express handoffs — rejected
- JSON schema files: Less human-readable; breaks VS Code agent conventions — rejected

---

## 2. MCP Server Implementation

### Decision
Create an MCP server using the high-level `McpServer` API from `@modelcontextprotocol/sdk` with stdio transport (primary) and optional Streamable HTTP transport for remote access.

### Rationale
- `McpServer` is the recommended API (low-level `Server` class is deprecated)
- stdio transport integrates directly with Claude Desktop, VS Code Copilot, and local CLI tools
- Tools for search/query operations; Resources for direct file content retrieval
- Documentation search is naturally a **tool** (takes query input, returns results); full file retrieval is naturally a **resource** (static content access)

### Architecture
- **Tools**: `search-docs` (full-text search across all docs), `list-languages` (list all tracked sources)
- **Resources**: `doc://language/{language}/{file}` URI template for direct file access
- **Dependencies**: `@modelcontextprotocol/sdk`, `zod` (input validation)
- Start with stdio transport only; add HTTP transport in a future iteration

### Alternatives Considered
- Custom REST API: Reinvents the wheel; not MCP-compatible — rejected
- Single transport (HTTP only): No local integration — rejected
- Prompts instead of tools: Wrong abstraction for data retrieval — rejected

---

## 3. Documentation Manifest Format

### Decision
Use JSON format (`docs/manifest.json`) with a schema-driven structure for tracking all imported documentation sources and their files.

### Rationale
- Native type validation (numbers, booleans, arrays)
- Easy programmatic access from both TypeScript (MCP server) and agent skills
- Can be supplemented with a JSON Schema for validation
- Git-friendly (well-formatted JSON diffs cleanly)

### Key Fields
- **Root**: `version`, `lastUpdated`, `sources[]`, `stats`
- **Source**: `id`, `language`, `packageName`, `sourceUrl`, `localPath`, `importedAt`, `lastUpdatedAt`, `files[]`, `status`
- **File**: `name`, `relativePath`, `sourceUrl`, `fetchedAt`, `contentHash` (SHA256 for change detection), `size`
- **Content hashes** enable efficient update detection — compare hash of current content vs stored hash

### Alternatives Considered
- YAML: Human-readable but indentation-sensitive, fewer validators — viable alternative
- SQLite: Overkill for small dataset — rejected
- Markdown table: Not machine-parseable — rejected

---

## 4. Web Content Extraction to Markdown

### Decision
Three-layer approach: (1) content extraction via Cheerio, (2) HTML-to-Markdown conversion via Turndown.js, (3) post-processing for cleanup and metadata injection as YAML frontmatter.

### Rationale
- Cheerio handles boilerplate removal (nav, sidebars, footers) and extracts main content from `<article>`, `<main>`, or `[role="main"]` elements
- Turndown.js preserves markdown-friendly HTML (code blocks, tables, lists) and converts accurately
- Frontmatter metadata (`sourceUrl`, `fetchedAt`, `language`) enables tracking and attribution per FR-011
- Content hashing enables efficient change detection for updates per FR-007

### Multi-Page Handling
- Detect internal links on the provided page to discover sub-pages
- Respect `robots.txt` and use a descriptive `User-Agent` header
- Rate limiting: configurable delay between requests (default 1 second)
- Progress reporting for large doc sets

### Important Note for Agent Context
The agent itself uses VS Code's built-in `fetch_webpage` tool to retrieve web content. The Cheerio/Turndown libraries described here are for the MCP server's potential standalone crawling capability. The agent's primary workflow will leverage VS Code agent tools directly.

### Alternatives Considered
- Readability.js: Good for article extraction but less flexible for structured docs — viable alternative
- Puppeteer/Playwright: Handles JavaScript-rendered pages but heavy dependency — overkill for most doc sites
- Raw regex parsing: Fragile and unmaintainable — rejected
