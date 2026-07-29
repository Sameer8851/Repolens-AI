import { cloneRepository } from "./clone";
import { scanRepository } from "./scan";
import { rm } from "fs/promises";

export async function scanGitRepository(cloneUrl: string, accessToken: string) {
  const repositoryPath = await cloneRepository(cloneUrl, accessToken);

  try {
    return await scanRepository(repositoryPath);
  } finally {
    await rm(repositoryPath, {
    recursive: true,
    force: true,
  });
  }
}
