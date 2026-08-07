import { join } from "path";

import { Project } from "ts-morph";

import { RepositoryIssue } from "./types";
import { ScannedFile } from "../scanner/types";

const MAX_FUNCTION_LINES = 100;

export async function detectLongFunctions(
  repositoryPath: string,
  files: ScannedFile[],
): Promise<RepositoryIssue[]> {
  const issues: RepositoryIssue[] = [];

  const project = new Project({
    useInMemoryFileSystem: false,
  });
  for (const file of files) {
    if (!["ts", "tsx", "js", "jsx"].includes(file.extension)) {
      continue;
    }

    const sourceFile = project.addSourceFileAtPath(
      join(repositoryPath, file.path),
    );
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
          filePath: file.path,
          lineNumber: startLine,
        });
      }
    }
  }

  return issues;
}
