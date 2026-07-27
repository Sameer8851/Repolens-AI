"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getRepositories, getRepositoryReadme } from "@/lib/github";
import { analyzeRepository } from "@/lib/ai";

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
  }
  return {
    success: true,
    message: "Repositories synced successfully",
  };
}
