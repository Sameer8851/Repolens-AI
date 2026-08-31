import { ASTContext } from "../ast/engine";
import { RepositoryIssue } from "./types";

const MAX_FUNCTION_LINES = 100;

export function detectLongFunctions(
  context: ASTContext,
): RepositoryIssue[] {
  const issues: RepositoryIssue[] = [];

  for (const sourceFile of context.sourceFiles) {
    const functions = sourceFile.getFunctions();

    for (const fn of functions) {
      const body = fn.getBody();

      if (!body) {
        continue;
      }

      const startLine = body.getStartLineNumber();
      const endLine = body.getEndLineNumber();

      const functionLength = endLine - startLine + 1;

      if (functionLength > MAX_FUNCTION_LINES) {
        issues.push({
          type: "LONG_FUNCTION",
          category: "Maintainability",
          severity: "HIGH",
          message: `Function "${fn.getName() ?? "anonymous"}" contains ${functionLength} lines.`,
          filePath: sourceFile.getFilePath(),
          lineNumber: startLine,
        });
      }
    }
  }

  return issues;
}