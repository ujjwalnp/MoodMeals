import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "@/generated/prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

export async function generateToken(user: User) {
    return jwt.sign({ 
        id: user.id, 
        email: user.email,
        name: user.name,
        role: user.role,
    }, JWT_SECRET, { expiresIn: "7d" })
}

export async function getSession() {
    try {
        const cookieStore = await cookies();

        const token = cookieStore.get("auth_token")?.value;
        if (!token) {
            return null;
        }

        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error("[moodmeals][auth][session] Error: ", error);
        return null;
    }
}
