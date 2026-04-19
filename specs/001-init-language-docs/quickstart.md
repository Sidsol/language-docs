# Quickstart: Auto-Sync Language & Package Documentation

**Date**: 2026-04-18  
**Feature**: `001-init-language-docs`

---

## Prerequisites

- VS Code with GitHub Copilot agent support
- Node.js 18+ (for MCP server)

## Setup

### 1. Agent (no setup required)

The agent and skill files are included in the repository under `.github/agents/` and `.github/prompts/skills/`. They are automatically discovered by VS Code.

### 2. MCP Server

```bash
cd mcp-server
npm install
npm run build
```

Configure your MCP client (e.g., VS Code `mcp.json` or Claude Desktop):

```json
{
  "servers": {
    "language-docs": {
      "command": "node",
      "args": ["mcp-server/dist/index.js"]
    }
  }
}
```

**Note**: A pre-configured `.vscode/mcp.json` is already included in the repository.

## Usage

### Import Documentation

1. Open VS Code chat
2. Select `@docs-agent`
3. Provide a documentation URL:
   ```
   Import docs from https://react.dev/reference/react
   ```
4. The agent fetches, converts, and saves markdown files to `docs/react/`

### Update Documentation

```
@docs-agent Update the React documentation
```

### List Tracked Sources

```
@docs-agent List all tracked documentation
```

### Query via MCP

Any MCP-compatible client can search the docs:
- Search: `search-docs` tool with a query string
- List: `list-languages` tool
- Read: `doc://language/react/hooks` resource URI

## File Structure After Import

```
docs/
├── manifest.json          # Tracking metadata
├── react/
│   ├── hooks.md           # Imported page with frontmatter
│   └── components.md
└── csharp/
    └── language-reference.md
```
