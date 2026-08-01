import { readFile } from "fs/promises";
import { join } from "path";

export async function readPackageJson(
  repositoryPath: string,
) {
  try {
    const content = await readFile(
      join(repositoryPath, "package.json"),
      "utf-8",
    );

    return content;
  } catch {
    return null;
  }
}