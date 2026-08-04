import { readFile } from "fs/promises";
import { join } from "path";

export interface FileCodeMetric {
  path: string;
  functions: number;
  classes: number;
  interfaces: number;
  imports: number;
  exports: number;
}

export async function analyzeCodeMetrics(
  repositoryPath: string,
  relativePath: string,
): Promise<FileCodeMetric> {
  const absolutePath = join(repositoryPath, relativePath);

  const content = await readFile(absolutePath, "utf-8");

  const functions =
    (content.match(/function\s+\w+/g) ?? []).length +
    (content.match(/=>/g) ?? []).length;

  const classes =
    (content.match(/class\s+\w+/g) ?? []).length;

  const interfaces =
    (content.match(/interface\s+\w+/g) ?? []).length;

  const imports =
    (content.match(/^import\s/mg) ?? []).length;

  const exports =
    (content.match(/^export\s/mg) ?? []).length;

  return {
    path: relativePath,
    functions,
    classes,
    interfaces,
    imports,
    exports,
  };
}