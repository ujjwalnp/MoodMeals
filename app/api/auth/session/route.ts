import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";


export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "No active session", user: null }, { status: 401 });
        }

        return NextResponse.json({ user: session, message: "Session retrieved successfully" }, { status: 200 });

    } catch (error) {
        console.error("[moodmeals][auth][session] Error: ", error);
        return NextResponse.json({ error: "Failed to retrieve session", user: null }, { status: 500 });
    }
}