import { AnalysisResult } from "../types";
import { RepositoryIssue } from "./types";
import { detectLongFiles } from "./long-files";
import { detectTodos } from "./todo";
import { detectMissingDocumentation } from "./documentation";
import { detectMissingTests } from "./tests";
import { detectUnusedDependencies } from "./unused-dependencies";
import { detectLongFunctions } from "./long-function";
import { detectLargeClasses } from "./large-class";

export async function detectRepositoryIssues(
  repositoryPath: string,
  analysis: AnalysisResult,
): Promise<RepositoryIssue[]> {
  const issues: RepositoryIssue[] = [];

  issues.push(...detectLongFiles(analysis.files));

  issues.push(...(await detectTodos(repositoryPath, analysis.files)));
  issues.push(...detectMissingDocumentation(analysis.files));
  issues.push(...detectMissingTests(analysis.files));
  issues.push(
    ...(await detectUnusedDependencies(
      repositoryPath,
      analysis.files,
      analysis.dependencies,
    )),
  );
  issues.push(...(await detectLongFunctions(repositoryPath, analysis.files)));
  issues.push(...(await detectLargeClasses(repositoryPath, analysis.files)));
  return issues;
}
