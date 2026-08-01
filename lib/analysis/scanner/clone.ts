import { mkdtemp } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import simpleGit from "simple-git";

export async function cloneRepository(
  cloneUrl: string,
  accessToken: string,
) {
  const tempDir = await mkdtemp(join(tmpdir(), "repolens-"));

  const authenticatedUrl = cloneUrl.replace(
    "https://",
    `https://${accessToken}@`,
  );

  const git = simpleGit();

  await git.clone(authenticatedUrl, tempDir);

  return tempDir;
}