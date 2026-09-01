import { AnalysisResult } from "../types";
import { RepositoryIssue } from "./types";
import { detectLongFiles } from "./long-files";
import { detectTodos } from "./todo";
import { detectMissingDocumentation } from "./documentation";
import { detectMissingTests } from "./tests";
import { detectUnusedDependencies } from "./unused-dependencies";
import { detectLongFunctions } from "./long-function";
import { detectLargeClasses } from "./large-class";
import { createASTContext } from "../ast/engine";
import { detectComplexity } from "./complexity";
import { detectDuplicateCode } from "./duplicate-code";


export async function detectRepositoryIssues(
  repositoryPath: string,
  analysis: AnalysisResult,
): Promise<RepositoryIssue[]> {
  const issues: RepositoryIssue[] = [];
  
  const astContext = createASTContext(repositoryPath, analysis.files);
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
  issues.push(
  ...(await detectDuplicateCode(
    repositoryPath,
    analysis.files,
  )),
);
  issues.push(...detectLongFunctions(astContext));
  issues.push(...detectLargeClasses(astContext));
  issues.push(...detectComplexity(astContext));
  
  return issues;
}
