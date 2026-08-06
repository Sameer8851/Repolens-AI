import { readFile } from "fs/promises";
import { join } from "path";

import { ScannedFile } from "../scanner/types";
import { RepositoryIssue } from "./types";

const TODO_PATTERNS = [
  "TODO",
  "FIXME",
  "HACK",
  "XXX",
];

export async function detectTodos(
  repositoryPath: string,
  files: ScannedFile[],
): Promise<RepositoryIssue[]> {
  const issues: RepositoryIssue[] = [];

  for (const file of files) {
    if (
      !["ts", "tsx", "js", "jsx", "java", "py", "cpp", "c"].includes(
        file.extension,
      )
    ) {
      continue;
    }

    const content = await readFile(
      join(repositoryPath, file.path),
      "utf-8",
    );

    const lines = content.split("\n");

    lines.forEach((line, index) => {
      if (
        TODO_PATTERNS.some((pattern) =>
          line.toUpperCase().includes(pattern),
        )
      ) {
        issues.push({
          type: "TODO_FOUND",
          category: "Documentation",
          severity: "LOW",
          message: line.trim(),
          filePath: file.path,
          lineNumber: index + 1,
        });
      }
    });
  }

  return issues;
}