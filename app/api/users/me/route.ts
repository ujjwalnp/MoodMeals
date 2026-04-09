import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Session {
  email: string;
  name: string;
  role: string;
  id: string;
}

export async function GET() {
  try {
    console.log("[moodmeals][user][me] Fetching current user info...", );

    // 1. Get session
    const session = (await getSession()) as Session | null;

    console.log("[moodmeals][user][me] Session:", session);

    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Return user info
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("[moodmeals][user][me] Error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}