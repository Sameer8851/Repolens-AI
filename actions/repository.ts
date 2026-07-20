"use server"

import {auth} from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getRepositories } from "@/lib/github";

export async function syncRepositories() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: userId, },
    });

    if (!user) {
        throw new Error("User not found");
    }
}