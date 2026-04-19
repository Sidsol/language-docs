# Language Docs

A VS Code agent and MCP server for importing, updating, and querying language and package documentation.

## Features

- **Import documentation** from any public URL — automatically converts to structured markdown with source attribution
- **Update documentation** — re-fetch previously imported docs and update only changed files
- **List tracked sources** — see all imported documentation with metadata
- **MCP server** — exposes imported docs to any MCP-compatible LLM client

## Usage

### VS Code Agent

1. Open VS Code chat
2. Select `@docs-agent`
3. Use natural language commands:

```
Import docs from https://react.dev/reference/react
```

```
Update the React documentation
```

```
List all tracked documentation
```

### MCP Server

The MCP server exposes imported documentation for search and retrieval by LLMs.

#### Setup

```bash
cd mcp-server
npm install
npm run build
```

The server is pre-configured in `.vscode/mcp.json` for VS Code integration.

#### Tools

- **search-docs** — Search documentation by query and optional language filter
- **list-languages** — List all available documentation topics

#### Resources

- **doc://language/{language}/{file}** — Direct access to a specific documentation file

## Folder Structure

```
.github/
├── agents/
│   └── docs-agent.agent.md          # Agent definition
├── prompts/
│   └── skills/
│       ├── import-docs/SKILL.md     # Import skill
│       ├── update-docs/SKILL.md     # Update skill
│       └── inventory-docs/SKILL.md  # Inventory skill

docs/                                 # Imported documentation
├── manifest.json                    # Tracking manifest
├── manifest.schema.json             # JSON Schema for validation
└── <package-name>/                  # One folder per language/package
    └── *.md                         # Documentation files with frontmatter

mcp-server/                          # MCP server (TypeScript)
├── src/
│   ├── index.ts                     # Entry point (stdio transport)
│   ├── server.ts                    # Tool and resource registration
│   ├── search.ts                    # Search logic
│   └── manifest.ts                  # Manifest utilities
└── package.json
```

## Documentation File Format

Each imported markdown file includes YAML frontmatter:

```yaml
---
sourceUrl: https://example.com/docs/page
fetchedAt: 2026-04-18T14:25:00Z
language: example
---
```
