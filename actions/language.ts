"use server";

import { prisma } from "@/lib/prisma";

export async function getRepositoryLanguageStats(repositoryId: string) {
  return prisma.languageStat.findMany({
    where: {
      repositoryId,
    },
    orderBy: {
      percentage: "desc",
    },
  });
}