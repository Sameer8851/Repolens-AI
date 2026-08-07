import { readFile } from "fs/promises";
import { join } from "path";

import { DetectedDependency } from "../analyzers/dependency";
import { ScannedFile } from "../scanner/types";
import { RepositoryIssue } from "./types";

const NODE_BUILTINS = new Set([
  "fs",
  "path",
  "os",
  "http",
  "https",
  "crypto",
  "stream",
  "events",
  "buffer",
  "url",
  "util",
  "child_process",
]);

const IGNORED_DEPENDENCIES = new Set([
  "react",
  "react-dom",
  "next",
  "typescript",
  "eslint",
  "eslint-config-next",
  "tailwindcss",
  "@types/node",
  "@types/react",
  "@types/react-dom",
  "@tailwindcss/postcss",
]);

export async function detectUnusedDependencies(
  repositoryPath: string,
  files: ScannedFile[],
  dependencies: DetectedDependency[],
): Promise<RepositoryIssue[]> {
  const importedPackages = new Set<string>();

  for (const file of files) {
    if (!["ts", "tsx", "js", "jsx"].includes(file.extension)) {
      continue;
    }

    const content = await readFile(
      join(repositoryPath, file.path),
      "utf-8",
    );

    // Matches: import x from "pkg"
    const packageMatches = [
  ...(content.match(/from\s+["']([^"']+)["']/g) ?? []),
  ...(content.match(/import\s+["']([^"']+)["']/g) ?? []),
  ...(content.match(/require\(\s*["']([^"']+)["']\s*\)/g) ?? []),
  ...(content.match(/import\(\s*["']([^"']+)["']\s*\)/g) ?? []),
];

    for (const match of packageMatches) {
     const pkgMatch = match.match(/["']([^"']+)["']/);

if (!pkgMatch) {
  continue;
}

const pkg = pkgMatch[1];

      // Ignore local imports
      if (
        pkg.startsWith(".") ||
        pkg.startsWith("/") ||
        pkg.startsWith("@/")
      ) {
        continue;
      }

      let packageName = pkg;

      // Handle scoped packages
      if (pkg.startsWith("@")) {
        const parts = pkg.split("/");

        if (parts.length >= 2) {
          packageName = `${parts[0]}/${parts[1]}`;
        }
      } else {
        packageName = pkg.split("/")[0];
      }

      if (NODE_BUILTINS.has(packageName)) {
        continue;
      }

      importedPackages.add(packageName);
    }
  }

  const issues: RepositoryIssue[] = [];

  for (const dependency of dependencies) {
  if (dependency.type !== "PRODUCTION") {
    continue;
  }

  if (IGNORED_DEPENDENCIES.has(dependency.name)) {
    continue;
  }

  if (!importedPackages.has(dependency.name)) {
    issues.push({
      type: "UNUSED_DEPENDENCY",
      category: "Dependencies",
      severity: "MEDIUM",
      message: `Dependency "${dependency.name}" appears to be unused.`,
    });
  }
}

  return issues;
}