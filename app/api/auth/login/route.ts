import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // 1. Find user by email
        const user = await prisma.user.findUnique({ where: { email }});
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, {status: 401 });
        }

        // 2. Generate JWT token
        const token = await generateToken(user);

        // 3. Set token in HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return NextResponse.json({ 
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        })


    } catch (error) {
        console.error("[moodmeals][auth][login] Error: ", error);
        return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
    }
}