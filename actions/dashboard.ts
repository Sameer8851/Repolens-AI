"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getDashboardRepositories() {
    const { userId } = await auth();
    if(!userId) {
        throw new Error("User not authenticated");
    }
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if(!user) {
        throw new Error("User not found");
    }
    const repositories = await prisma.repository.findMany({
        where: {
            ownerId: user.id,
        },
        include: {
            analysis: true,
        },
        orderBy: {
            stargazersCount: "desc",
        },
    });
    return repositories;
}