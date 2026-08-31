import { Project, SourceFile } from "ts-morph";

import { ScannedFile } from "../scanner/types";
import { createProject } from "./project";
import { loadSourceFiles } from "./source-files";

export interface ASTContext {
  project: Project;
  sourceFiles: SourceFile[];
}

export function createASTContext(
  repositoryPath: string,
  files: ScannedFile[],
): ASTContext {
  const project = createProject();

  const sourceFiles = loadSourceFiles(
    project,
    repositoryPath,
    files,
  );

  return {
    project,
    sourceFiles,
  };
}