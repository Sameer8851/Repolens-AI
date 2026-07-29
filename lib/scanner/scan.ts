import { readdir, stat, readFile } from "fs/promises";
import { join, relative, extname, basename } from "path";

import { IGNORE_DIRECTORIES } from "./ignore";
import { detectLanguage } from "./language";
import { ScannedFile } from "./types";

export async function scanRepository(
  repositoryPath: string,
): Promise<ScannedFile[]> {
  const files: ScannedFile[] = [];

  async function walk(currentPath: string) {
    const entries = await readdir(currentPath);

    for (const entry of entries) {
      if (IGNORE_DIRECTORIES.includes(entry)) {
        continue;
      }

      const fullPath = join(currentPath, entry);
      const fileStats = await stat(fullPath);

      if (fileStats.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      const content = await readFile(fullPath, "utf-8").catch(() => "");

      files.push({
        path: relative(repositoryPath, fullPath),
        name: basename(fullPath),
        extension: extname(fullPath).replace(".", ""),
        size: fileStats.size,
        language: detectLanguage(
          extname(fullPath).replace(".", "")
        ),
        lineCount: content.split("\n").length,
      });
    }
  }

  await walk(repositoryPath);

  return files;
}