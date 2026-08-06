import { ScannedFile } from "../scanner/types";
import { RepositoryIssue } from "./types";

const MAX_FILE_LINES = 500;

export function detectLongFiles(
  files: ScannedFile[],
): RepositoryIssue[] {
  const issues: RepositoryIssue[] = [];

  for (const file of files) {
    if (file.lineCount <= MAX_FILE_LINES) {
      continue;
    }

    issues.push({
      type: "LONG_FILE",
      category: "Maintainability",
      severity: "HIGH",
      message: `File contains ${file.lineCount} lines. Consider splitting it into smaller modules.`,
      filePath: file.path,
    });
  }

  return issues;
}