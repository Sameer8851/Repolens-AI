import { ScannedFile } from "../scanner/types";
import { RepositoryIssue } from "./types";
import { createProject } from "../ast/project";
import { loadSourceFiles } from "../ast/source-files";

const MAX_METHODS = 20;

export async function detectLargeClasses(
  repositoryPath: string,
  files: ScannedFile[],
): Promise<RepositoryIssue[]> {
  const issues: RepositoryIssue[] = [];

  const project = createProject();

  const sourceFiles = loadSourceFiles(project, repositoryPath, files);

  for (const sourceFile of sourceFiles) {
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
