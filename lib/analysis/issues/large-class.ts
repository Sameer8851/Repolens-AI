import { ASTContext } from "../ast/engine";
import { RepositoryIssue } from "./types";

const MAX_METHODS = 20;

export function detectLargeClasses(
  context: ASTContext,
): RepositoryIssue[] {
  const issues: RepositoryIssue[] = [];

  for (const sourceFile of context.sourceFiles) {
    const classes = sourceFile.getClasses();

    for (const cls of classes) {
      const methods = cls.getMethods();

      if (methods.length > MAX_METHODS) {
        issues.push({
          type: "LARGE_CLASS",
          category: "Maintainability",
          severity: "HIGH",
          message: `Class "${cls.getName() ?? "Anonymous"}" contains ${methods.length} methods.`,
          filePath: sourceFile.getFilePath(),
          lineNumber: cls.getStartLineNumber(),
        });
      }
    }
  }

  return issues;
}