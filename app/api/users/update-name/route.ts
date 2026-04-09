import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Session {
  email: string;
  name: string;
  role: string;
  id: string;
}

export async function PATCH(req: Request) {
  try {
    // 1. Get session
    const session = await getSession() as Session | null;
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const body = await req.json();
    const name = body.name as string;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    // 3. Update user
    const updatedUser = await prisma.user.update({
      where: { email: session.email },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("[moodmeals][user][update-name] Error: ", error);
    return NextResponse.json({ error: "Failed to update name" }, { status: 500 });
  }
}