import { readFile } from "fs/promises";
import { join } from "path";

export async function readPackageJson(
  repositoryPath: string,
): Promise<string | null> {
  try {
    return await readFile(
      join(repositoryPath, "package.json"),
      "utf-8",
    );
  } catch {
    return null;
  }
}