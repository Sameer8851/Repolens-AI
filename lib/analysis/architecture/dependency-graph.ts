import { readFile } from "fs/promises";
import { join, dirname, normalize } from "path";

import { ScannedFile } from "../scanner/types";

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}

function resolveImportPath(
  currentFile: string,
  importPath: string,
  files: ScannedFile[],
): string | null {
  let targetPath: string;

  if (importPath.startsWith("@/")) {
    targetPath = importPath.slice(2);
  } else if (importPath.startsWith(".")) {
    targetPath = normalize(
      join(dirname(currentFile), importPath),
    );
  } else {
    return null;
  }

  targetPath = normalizePath(targetPath);

  const extensions = [
    "",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
  ];

  for (const extension of extensions) {
    const candidate = `${targetPath}${extension}`;

    if (
      files.some(
        (file) =>
          normalizePath(file.path) === candidate,
      )
    ) {
      return candidate;
    }
  }

  const indexExtensions = [
    "index.ts",
    "index.tsx",
    "index.js",
    "index.jsx",
  ];

  for (const extension of indexExtensions) {
    const candidate = `${targetPath}/${extension}`;

    if (
      files.some(
        (file) =>
          normalizePath(file.path) === candidate,
      )
    ) {
      return candidate;
    }
  }

  return null;
}

export async function buildDependencyGraph(
  repositoryPath: string,
  files: ScannedFile[],
): Promise<Map<string, string[]>> {
  const graph = new Map<string, string[]>();

  for (const file of files) {
    if (
      !["ts", "tsx", "js", "jsx"].includes(
        file.extension,
      )
    ) {
      continue;
    }

    const content = await readFile(
      join(repositoryPath, file.path),
      "utf-8",
    );

    const imports =
      content.match(
        /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g,
      ) ?? [];

    const dependencies: string[] = [];

    for (const importStatement of imports) {
      const match = importStatement.match(
        /["']([^"']+)["']/,
      );

      if (!match) {
        continue;
      }

      const importPath = match[1];

      const resolvedPath = resolveImportPath(
        file.path,
        importPath,
        files,
      );

      if (resolvedPath) {
        dependencies.push(resolvedPath);
      }
    }

    graph.set(
      normalizePath(file.path),
      dependencies,
    );
  }

  return graph;
}