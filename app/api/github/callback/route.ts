import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {prisma} from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code not found." },
      { status: 400 }
    );
  }

  const response = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    }
  );

  const data = await response.json();

  const { userId } = await auth();

  if(!userId) {
    return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
  }

  await prisma.user.update({
    where: {
        clerkId: userId,
    },
    data: {
        githubAccessToken: data.access_token,
    },
  });

  return NextResponse.redirect(
  new URL("/dashboard", request.url)
);
}