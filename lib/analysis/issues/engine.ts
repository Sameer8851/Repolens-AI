import { AnalysisResult } from "../types";
import { RepositoryIssue } from "./types";
import { detectLongFiles } from "./long-files";
import { detectTodos } from "./todo";
import { detectMissingDocumentation } from "./documentation";
import { detectMissingTests } from "./tests";

export async function detectRepositoryIssues(
  repositoryPath: string,
  analysis: AnalysisResult,
): Promise<RepositoryIssue[]> {
  const issues: RepositoryIssue[] = [];

  issues.push(...detectLongFiles(analysis.files));

  issues.push(...(await detectTodos(repositoryPath, analysis.files)));
  issues.push(...detectMissingDocumentation(analysis.files));
  issues.push(
  ...detectMissingTests(
    analysis.files,
  ),
);

  return issues;
}
