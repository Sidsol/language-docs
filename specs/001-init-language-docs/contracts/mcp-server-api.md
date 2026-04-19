# MCP Server API Contract

**Date**: 2026-04-18  
**Feature**: `001-init-language-docs`  
**Server Name**: `language-docs-mcp-server`

---

## Transport

- **Primary**: stdio (for local integration with Claude Desktop, VS Code Copilot, CLI tools)
- **Future**: Streamable HTTP (for remote/multi-user access)

## Tools

### `search-docs`

Search all imported documentation for a query string or topic.

**Input Schema**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | ✓ | Search term or topic |
| `language` | string | | Filter by language/package name (e.g., `react`, `python`) |
| `limit` | number | | Max results to return (default: 10) |

**Output**: Array of text content blocks, each containing:
- File path
- Source URL
- Matching content snippet with surrounding context

**Error Responses**:
- No results found → empty content array with informational message
- Invalid language filter → error message listing valid languages

---

### `list-languages`

List all imported programming languages and packages with metadata.

**Input Schema**: _(no parameters)_

**Output**: Text content block listing each source with:
- Package name
- Language
- Source URL
- Last updated timestamp
- File count
- Status

---

## Resources

### `doc://language/{language}/{file}`

Direct access to a specific imported documentation markdown file.

**URI Parameters**:

| Parameter | Description |
|-----------|-------------|
| `language` | Package/language name (e.g., `react`, `csharp`) |
| `file` | Filename without extension (e.g., `hooks`, `language-reference`) |

**Response**:
- MIME type: `text/markdown`
- Body: Full markdown content including YAML frontmatter

**Error Responses**:
- Language not found → resource not found error
- File not found → resource not found error

---

## Configuration

### `mcp.json` / Claude Desktop config

```json
{
  "mcpServers": {
    "language-docs": {
      "command": "node",
      "args": ["mcp-server/dist/index.js"],
      "cwd": "<repo-root>"
    }
  }
}
```
