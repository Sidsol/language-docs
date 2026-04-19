# Implementation Plan: Auto-Sync Language & Package Documentation

**Branch**: `001-init-language-docs` | **Date**: 2026-04-18 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-init-language-docs/spec.md`

## Summary

Build a VS Code agent (`.agent.md` + `SKILL.md` files) that imports, updates, and inventories language/package documentation from URLs into organized repo folders. Additionally, build an MCP server that exposes the imported documentation to any MCP-compatible LLM client for search and retrieval.

## Technical Context

**Language/Version**: TypeScript 5.x (MCP server), Markdown (agent/skill definitions)
**Primary Dependencies**: `@modelcontextprotocol/sdk` (MCP server), VS Code agent infrastructure (`.agent.md`, `SKILL.md`)
**Storage**: File-based (markdown files in `docs/` folders, JSON manifest for inventory)
**Testing**: Manual agent invocation testing; `vitest` or `jest` for MCP server unit tests
**Target Platform**: VS Code (agent), Node.js local server (MCP)
**Project Type**: Agent + MCP server (hybrid: VS Code customization files + local service)
**Performance Goals**: Import up to 50 doc pages within 2 minutes; MCP queries respond within 5 seconds
**Constraints**: Public URLs only (no auth); respectful crawling (rate limiting); serve only committed content via MCP
**Scale/Scope**: Single-user local workflow; dozens of language/package doc sets; hundreds of markdown files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is in template/placeholder form — no principles have been ratified yet. No gates to enforce. **PASS** (no violations possible with undefined constitution).

## Project Structure

### Documentation (this feature)

```text
specs/001-init-language-docs/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
.github/
├── agents/
│   └── docs-agent.agent.md          # Agent definition (persona + orchestration)
├── prompts/
│   └── skills/
│       ├── import-docs/
│       │   └── SKILL.md             # Skill: import docs from URL
│       ├── update-docs/
│       │   └── SKILL.md             # Skill: update previously imported docs
│       └── inventory-docs/
│           └── SKILL.md             # Skill: list tracked doc sources

docs/                                 # Root for all imported documentation
├── manifest.json                    # Documentation inventory/tracking manifest
├── react/                           # Example: imported React docs
│   ├── hooks.md
│   └── components.md
└── csharp/                          # Example: imported C# docs
    └── language-reference.md

mcp-server/                          # MCP server for LLM doc access
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                     # Server entry point
│   ├── server.ts                    # MCP server setup and tool/resource registration
│   ├── search.ts                    # Search logic across markdown files
│   └── manifest.ts                  # Manifest reading utilities
└── tests/
    ├── server.test.ts
    └── search.test.ts
```

**Structure Decision**: Hybrid structure — agent/skill files live under `.github/` following VS Code conventions; imported docs live under `docs/` at the repo root; MCP server is a standalone TypeScript project under `mcp-server/`.

## Complexity Tracking

No constitution violations to justify.
