import { cookies } from "next/headers";
import { NextResponse } from "next/server";



export async function POST() {
    try {
        // 1. Clear the token cookie
        const cookieStore = await cookies();
        cookieStore.delete("auth_token");

        return NextResponse.json({ message: "Logout successful" }, { status: 200 });
    } catch (error) {
        console.error("[moodmeals][auth][logout] Error: ", error);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}