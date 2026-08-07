import { join } from "path";

import { Project, SourceFile } from "ts-morph";

import { ScannedFile } from "../scanner/types";

export function loadSourceFiles(
  project: Project,
  repositoryPath: string,
  files: ScannedFile[],
): SourceFile[] {
  return files
    .filter((file) =>
      ["ts", "tsx", "js", "jsx"].includes(file.extension),
    )
    .map((file) =>
      project.addSourceFileAtPath(
        join(repositoryPath, file.path),
      ),
    );
}