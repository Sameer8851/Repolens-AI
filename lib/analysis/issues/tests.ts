import { ScannedFile } from "../scanner/types";
import { RepositoryIssue } from "./types";

const TEST_PATTERNS = [
  ".test.",
  ".spec.",
  "__tests__",
];

const TEST_FRAMEWORKS = [
  "jest",
  "vitest",
  "playwright",
  "cypress",
];

export function detectMissingTests(
  files: ScannedFile[],
): RepositoryIssue[] {
  const hasTestFiles = files.some((file) =>
    TEST_PATTERNS.some((pattern) =>
      file.path.toLowerCase().includes(pattern),
    ),
  );

  const hasTestFramework = files.some((file) =>
    TEST_FRAMEWORKS.some((framework) =>
      file.path.toLowerCase().includes(framework),
    ),
  );

  if (hasTestFiles || hasTestFramework) {
    return [];
  }

  return [
    {
      type: "MISSING_TESTS",
      category: "Testing",
      severity: "MEDIUM",
      message:
        "No test files or testing framework detected.",
    },
  ];
}