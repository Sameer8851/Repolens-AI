"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getRepositories, getRepositoryReadme } from "@/lib/github";
import { analyzeRepository } from "@/lib/ai";
import { scanGitRepository } from "@/lib/scanner";

export async function syncRepositories() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.githubAccessToken) {
    throw new Error("GitHub account not connected");
  }
  const repositories = await getRepositories(user.githubAccessToken);
  let analyzedCount = 0;
  const MAX_ANALYSIS_PER_SYNC = 4;

  for (const repo of repositories) {
    const repository = await prisma.repository.upsert({
      where: {
        githubId: repo.id,
      },
      update: {
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        htmlUrl: repo.html_url,
        cloneUrl: repo.clone_url,
        defaultBranch: repo.default_branch,
        isPrivate: repo.private,
        language: repo.language,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
      },
      create: {
        githubId: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        htmlUrl: repo.html_url,
        cloneUrl: repo.clone_url,
        defaultBranch: repo.default_branch,
        isPrivate: repo.private,
        language: repo.language,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        ownerId: user.id,
      },
    });
    const scannedFiles = await scanGitRepository(
      repo.clone_url,
      user.githubAccessToken,
    );

    await prisma.repositoryFile.deleteMany({
      where: {
        repositoryId: repository.id,
      },
    });

    await prisma.repositoryFile.createMany({
      data: scannedFiles.map((file) => ({
        repositoryId: repository.id,
        path: file.path,
        name: file.name,
        extension: file.extension,
        language: file.language ?? null,
        size: file.size,
        lineCount: file.lineCount,
      })),
    });

    const existingAnalysis = await prisma.repositoryAnalysis.findUnique({
      where: {
        repositoryId: repository.id,
      },
    });

    if (existingAnalysis) {
      continue;
    }
    const owner = repo.full_name.split("/")[0];
    const readme = await getRepositoryReadme(
      user.githubAccessToken,
      owner,
      repo.name,
    );
    if (!readme) {
      continue;
    }
    const readmeContent = Buffer.from(readme.content, "base64").toString(
      "utf-8",
    );
    if (analyzedCount >= MAX_ANALYSIS_PER_SYNC) {
      continue;
    }
    const analysis = await analyzeRepository(readmeContent);
    await prisma.repositoryAnalysis.upsert({
      where: {
        repositoryId: repository.id,
      },
      update: {
        summary: analysis.summary,
        techStack: analysis.techStack,
        difficulty: analysis.difficulty,
        architecture: analysis.architecture,
        suggestions: analysis.suggestions,
      },
      create: {
        repositoryId: repository.id,
        summary: analysis.summary,
        techStack: analysis.techStack,
        difficulty: analysis.difficulty,
        architecture: analysis.architecture,
        suggestions: analysis.suggestions,
      },
    });
    analyzedCount++;
  }
  return {
    success: true,
    message: "Repositories synced successfully",
  };
}
