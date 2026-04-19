# Tasks: Auto-Sync Language & Package Documentation

**Input**: Design documents from `specs/001-init-language-docs/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included (not explicitly requested in the feature specification).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, folder structure, and manifest bootstrap

- [x] T001 Create `docs/` directory and initialize empty manifest at `docs/manifest.json` with version `1.0`, empty sources array, and zeroed stats
- [x] T002 [P] Initialize MCP server project with `package.json` and `tsconfig.json` in `mcp-server/`
- [x] T003 [P] Install MCP server dependencies (`@modelcontextprotocol/sdk`, `zod`, `glob`) in `mcp-server/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Agent definition and core skill infrastructure that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until the agent and manifest infrastructure are in place

- [x] T004 Create the docs-agent definition file at `.github/agents/docs-agent.agent.md` with description, persona, and skill references for import, update, and inventory capabilities
- [x] T005 [P] Create the manifest reading/writing utility module at `mcp-server/src/manifest.ts` with functions to read, write, and validate `docs/manifest.json` per the data model schema (DocumentationManifest, DocumentationSource, DocumentationFile, ManifestStats)

**Checkpoint**: Agent is discoverable in VS Code; manifest utilities are ready for use by skills and MCP server

---

## Phase 3: User Story 1 - Import New Documentation from a Link (Priority: P1) 🎯 MVP

**Goal**: User provides a documentation URL and the agent fetches, converts, and saves markdown files to the appropriate `docs/<package-name>/` folder, creating it if needed. Each file includes source attribution frontmatter. The manifest is updated.

**Independent Test**: Invoke `@docs-agent` with a documentation URL. Verify files appear in `docs/<package-name>/` with YAML frontmatter containing `sourceUrl` and `fetchedAt`. Verify `docs/manifest.json` is updated with the new source entry.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create the import-docs skill file at `.github/prompts/skills/import-docs/SKILL.md` with instructions for: accepting a URL, fetching content via `fetch_webpage`, extracting main documentation body, converting to markdown with YAML frontmatter (`sourceUrl`, `fetchedAt`, `language`), determining package name from URL or user input, creating the `docs/<package-name>/` folder if it doesn't exist, writing markdown files, and updating `docs/manifest.json` with a new DocumentationSource entry including file content hashes
- [x] T007 [US1] Create a seed `docs/manifest.json` JSON Schema file at `docs/manifest.schema.json` for manifest validation, covering DocumentationManifest, DocumentationSource, DocumentationFile, and ManifestStats structures per the data model

**Checkpoint**: User Story 1 is fully functional — a user can invoke `@docs-agent`, provide a URL, and get structured markdown files in the repo with full manifest tracking

---

## Phase 4: User Story 2 - Update Previously Imported Documentation (Priority: P2)

**Goal**: User requests an update for a previously imported language/package. The agent re-fetches from the original source URL, compares content hashes, updates only changed files, adds new pages, and reports a summary.

**Independent Test**: Import docs via US1, then invoke `@docs-agent` to update that package. Verify only changed files are modified, new pages are added, and unchanged files are untouched. Verify manifest timestamps and hashes are updated.

### Implementation for User Story 2

- [x] T008 [US2] Create the update-docs skill file at `.github/prompts/skills/update-docs/SKILL.md` with instructions for: reading `docs/manifest.json` to find the source entry for the requested package, re-fetching content from the stored `sourceUrl`, comparing SHA256 content hashes per file against stored hashes in the manifest, updating only files whose content has changed, adding new files not previously tracked, updating manifest `lastUpdatedAt` timestamps and file hashes, and reporting a summary of changes (files updated, added, unchanged)

**Checkpoint**: User Story 2 is fully functional — a user can update previously imported docs and only changed files are modified

---

## Phase 5: User Story 3 - Discover and Navigate Imported Documentation (Priority: P3)

**Goal**: User asks to list all tracked documentation sources. The agent reads the manifest and displays a formatted inventory showing each language/package name, source URL, last updated date, and file count.

**Independent Test**: Import docs for two or more packages, then invoke `@docs-agent` to list all tracked documentation. Verify all sources are listed with correct metadata.

### Implementation for User Story 3

- [x] T009 [US3] Create the inventory-docs skill file at `.github/prompts/skills/inventory-docs/SKILL.md` with instructions for: reading `docs/manifest.json`, formatting each DocumentationSource as a readable entry showing package name, language, source URL, last updated timestamp, file count, and status, handling the empty case (no sources tracked), and optionally filtering by package name

**Checkpoint**: User Story 3 is fully functional — a user can list all tracked documentation with metadata

---

## Phase 6: User Story 4 - Access Documentation via MCP Server (Priority: P4)

**Goal**: An MCP server exposes imported documentation for search and retrieval by any MCP-compatible client (e.g., Claude Desktop, VS Code Copilot). The server provides `search-docs` and `list-languages` tools, plus resource access to individual markdown files.

**Independent Test**: Start the MCP server, connect an MCP client, query for a previously imported language/package, and verify relevant documentation content is returned. Query `list-languages` and verify all tracked sources are listed.

### Implementation for User Story 4

- [x] T010 [P] [US4] Create the MCP server entry point at `mcp-server/src/index.ts` that instantiates the server with stdio transport and connects
- [x] T011 [P] [US4] Implement search logic at `mcp-server/src/search.ts` with a function that reads all markdown files under `docs/`, performs case-insensitive text matching against a query string, supports filtering by language/package name, and returns matching file paths with content snippets and source URLs
- [x] T012 [US4] Implement the MCP server setup at `mcp-server/src/server.ts` that registers: (1) `search-docs` tool with `query` (required string), `language` (optional string), and `limit` (optional number, default 10) parameters using zod schemas, calling the search module; (2) `list-languages` tool with no parameters that reads the manifest and returns formatted source metadata; (3) resource template `doc://language/{language}/{file}` for direct markdown file access with `text/markdown` mime type
- [x] T013 [US4] Add npm build script to `mcp-server/package.json` for TypeScript compilation and verify the server starts correctly via `node mcp-server/dist/index.js`
- [x] T014 [US4] Create MCP client configuration example at `.vscode/mcp.json` with the server command, args, and cwd pointing to the repo root

**Checkpoint**: MCP server is fully functional — any MCP client can search docs, list languages, and read individual documentation files

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling improvements, documentation, and validation

- [x] T015 [P] Add error handling instructions to the import-docs skill in `.github/prompts/skills/import-docs/SKILL.md` for unreachable URLs, non-documentation content, and duplicate package name conflicts
- [x] T016 [P] Add a README.md at repo root documenting the project purpose, agent usage (`@docs-agent`), MCP server setup, and folder structure
- [x] T017 Run quickstart.md validation — verify end-to-end flow matches the documented quickstart at `specs/001-init-language-docs/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (Phase 2) — primary MVP
- **US2 (Phase 4)**: Depends on Foundational (Phase 2); logically follows US1 (needs docs to already be imported)
- **US3 (Phase 5)**: Depends on Foundational (Phase 2); logically follows US1 (needs manifest with sources)
- **US4 (Phase 6)**: Depends on Foundational (Phase 2) and T005 manifest utilities; can proceed in parallel with US1-3 for server scaffolding, but needs imported docs for integration testing
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 2 — requires US1 to be complete for meaningful testing (needs existing imports)
- **User Story 3 (P3)**: Can start after Phase 2 — requires US1 to be complete for meaningful testing (needs manifest entries)
- **User Story 4 (P4)**: Can start after Phase 2 — server scaffolding is independent; integration testing requires US1

### Within Each User Story

- Skill files are self-contained markdown definitions (no code compilation dependency chain)
- MCP server tasks follow: entry point → search logic → server registration → build → config

### Parallel Opportunities

- T002 and T003 can run in parallel (both are setup)
- T004 and T005 can run in parallel (agent file vs manifest code)
- T006 and T007 can run in parallel (skill file vs JSON schema)
- T010 and T011 can run in parallel (entry point vs search logic)
- T015 and T016 can run in parallel (polish tasks)
- After Phase 2, US1/US3/US4-scaffolding can run in parallel

---

## Parallel Example: User Story 4

```
# Launch entry point and search logic together:
Task T010: "Create MCP server entry point at mcp-server/src/index.ts"
Task T011: "Implement search logic at mcp-server/src/search.ts"

# Then server registration (depends on T010, T011):
Task T012: "Implement MCP server setup at mcp-server/src/server.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T005)
3. Complete Phase 3: User Story 1 (T006-T007)
4. **STOP and VALIDATE**: Invoke `@docs-agent` with a real documentation URL, verify files are created with correct structure and frontmatter
5. Proceed to User Stories 2-4 incrementally

### Suggested MVP Scope

User Story 1 alone delivers a fully usable agent that can import documentation from any URL into organized repo folders with full tracking. This is sufficient for a working demo and can be shipped independently.
