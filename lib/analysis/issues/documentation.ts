import { ScannedFile } from "../scanner/types";
import { RepositoryIssue } from "./types";

const REQUIRED_FILES = [
  "README.md",
  "LICENSE",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
];

export function detectMissingDocumentation(
  files: ScannedFile[],
): RepositoryIssue[] {
  const issues: RepositoryIssue[] = [];

  const fileNames = files.map((file) =>
    file.name.toUpperCase(),
  );

  for (const required of REQUIRED_FILES) {
    if (
      !fileNames.includes(required.toUpperCase())
    ) {
      issues.push({
        type: "MISSING_DOCUMENTATION",
        category: "Documentation",
        severity: "MEDIUM",
        message: `${required} is missing.`,
      });
    }
  }

  return issues;
}