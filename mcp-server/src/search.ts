import { readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { glob } from "glob";

export interface SearchResult {
  filePath: string;
  relativePath: string;
  sourceUrl: string;
  language: string;
  snippet: string;
}

function extractFrontmatter(content: string): { sourceUrl: string; language: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return { sourceUrl: "", language: "" };
  }
  const frontmatter = match[1];
  const sourceUrl = frontmatter.match(/sourceUrl:\s*(.+)/)?.[1]?.trim() ?? "";
  const language = frontmatter.match(/language:\s*(.+)/)?.[1]?.trim() ?? "";
  return { sourceUrl, language };
}

function extractSnippet(content: string, query: string, contextChars = 200): string {
  // Remove frontmatter for search
  const body = content.replace(/^---\n[\s\S]*?\n---\n*/, "");
  const lowerBody = body.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerBody.indexOf(lowerQuery);
  if (idx === -1) {
    return body.slice(0, contextChars) + (body.length > contextChars ? "..." : "");
  }
  const start = Math.max(0, idx - contextChars / 2);
  const end = Math.min(body.length, idx + lowerQuery.length + contextChars / 2);
  let snippet = body.slice(start, end).trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < body.length) snippet = snippet + "...";
  return snippet;
}

export async function searchDocs(
  docsRoot: string,
  query: string,
  options?: { language?: string; limit?: number }
): Promise<SearchResult[]> {
  const limit = options?.limit ?? 10;
  const languageFilter = options?.language?.toLowerCase();

  // Find all markdown files under docs/, excluding manifest files
  const pattern = join(docsRoot, "**/*.md").replace(/\\/g, "/");
  const files = await glob(pattern);

  const results: SearchResult[] = [];

  for (const filePath of files) {
    if (results.length >= limit) break;

    const content = await readFile(filePath, "utf-8");
    const { sourceUrl, language } = extractFrontmatter(content);

    // Filter by language if specified
    if (languageFilter && language.toLowerCase() !== languageFilter) {
      continue;
    }

    // Check if query matches (case-insensitive)
    const body = content.replace(/^---\n[\s\S]*?\n---\n*/, "");
    if (!body.toLowerCase().includes(query.toLowerCase())) {
      continue;
    }

    const rel = relative(docsRoot, filePath).replace(/\\/g, "/");
    results.push({
      filePath,
      relativePath: `docs/${rel}`,
      sourceUrl,
      language,
      snippet: extractSnippet(content, query),
    });
  }

  return results;
}
