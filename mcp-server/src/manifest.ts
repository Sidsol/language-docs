import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";

export interface DocumentationFile {
  name: string;
  relativePath: string;
  sourceUrl: string;
  fetchedAt: string;
  contentHash: string;
  size: number;
}

export interface DocumentationSource {
  id: string;
  language: string;
  packageName: string;
  sourceUrl: string;
  localPath: string;
  importedAt: string;
  lastUpdatedAt: string;
  description: string;
  files: DocumentationFile[];
  status: "active" | "archived" | "failed";
}

export interface ManifestStats {
  totalSources: number;
  totalFiles: number;
  totalSizeBytes: number;
  activeSources: number;
}

export interface DocumentationManifest {
  version: string;
  lastUpdated: string;
  sources: DocumentationSource[];
  stats: ManifestStats;
}

function computeStats(sources: DocumentationSource[]): ManifestStats {
  const activeSources = sources.filter((s) => s.status === "active");
  const totalFiles = sources.reduce((sum, s) => sum + s.files.length, 0);
  const totalSizeBytes = sources.reduce(
    (sum, s) => sum + s.files.reduce((fSum, f) => fSum + f.size, 0),
    0
  );
  return {
    totalSources: sources.length,
    totalFiles,
    totalSizeBytes,
    activeSources: activeSources.length,
  };
}

export async function readManifest(docsRoot: string): Promise<DocumentationManifest> {
  const manifestPath = join(docsRoot, "manifest.json");
  const raw = await readFile(manifestPath, "utf-8");
  const manifest: DocumentationManifest = JSON.parse(raw);
  return manifest;
}

export async function writeManifest(
  docsRoot: string,
  manifest: DocumentationManifest
): Promise<void> {
  const manifestPath = join(docsRoot, "manifest.json");
  manifest.stats = computeStats(manifest.sources);
  manifest.lastUpdated = new Date().toISOString();
  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");
}

export function findSource(
  manifest: DocumentationManifest,
  packageName: string
): DocumentationSource | undefined {
  return manifest.sources.find(
    (s) => s.packageName.toLowerCase() === packageName.toLowerCase()
  );
}
