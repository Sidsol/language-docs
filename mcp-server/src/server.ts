import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { readManifest } from "./manifest.js";
import { searchDocs } from "./search.js";

// Resolve docs root relative to the server's working directory
const DOCS_ROOT = join(process.cwd(), "docs");

export function createServer(): McpServer {
  const server = new McpServer({
    name: "language-docs-mcp-server",
    version: "1.0.0",
  });

  // Tool: search-docs
  server.tool(
    "search-docs",
    "Search all imported documentation for a query string or topic",
    {
      query: z.string().describe("Search term or topic"),
      language: z
        .string()
        .optional()
        .describe("Filter by language/package name (e.g., react, python)"),
      limit: z
        .number()
        .optional()
        .default(10)
        .describe("Max results to return"),
    },
    async ({ query, language, limit }) => {
      const results = await searchDocs(DOCS_ROOT, query, { language, limit });

      if (results.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No results found for "${query}"${language ? ` in ${language}` : ""}.`,
            },
          ],
        };
      }

      const formatted = results
        .map(
          (r) =>
            `## ${r.relativePath}\n**Source**: ${r.sourceUrl}\n**Language**: ${r.language}\n\n${r.snippet}`
        )
        .join("\n\n---\n\n");

      return {
        content: [{ type: "text" as const, text: formatted }],
      };
    }
  );

  // Tool: list-languages
  server.tool(
    "list-languages",
    "List all imported programming languages and packages with metadata",
    {},
    async () => {
      const manifest = await readManifest(DOCS_ROOT);

      if (manifest.sources.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "No documentation sources are currently tracked.",
            },
          ],
        };
      }

      const lines = manifest.sources.map(
        (s) =>
          `- **${s.language}** (${s.packageName}) — ${s.files.length} files | Status: ${s.status} | Last updated: ${s.lastUpdatedAt} | Source: ${s.sourceUrl}`
      );

      const summary = `\n\n---\n**Total**: ${manifest.stats.totalSources} sources | ${manifest.stats.totalFiles} files | ${manifest.stats.activeSources} active`;

      return {
        content: [
          { type: "text" as const, text: lines.join("\n") + summary },
        ],
      };
    }
  );

  // Resource: doc://language/{language}/{file}
  server.resource(
    "doc-file",
    new ResourceTemplate("doc://language/{language}/{file}", {
      list: undefined,
    }),
    async (uri, { language, file }) => {
      const filePath = join(DOCS_ROOT, String(language), `${String(file)}.md`);

      let content: string;
      try {
        content = await readFile(filePath, "utf-8");
      } catch {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/plain",
              text: `Documentation file not found: ${language}/${file}.md`,
            },
          ],
        };
      }

      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: content,
          },
        ],
      };
    }
  );

  return server;
}
