import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { User } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

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

export async function getCurrentUser() {
    try {
        const session = await getSession();
        if (!session || typeof session === 'string') {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: (session as any).id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return user;
    } catch (error) {
        console.error("[moodmeals][auth][getCurrentUser] Error: ", error);
        return null;
    }
}

export async function isAdmin() {
    try {
        const user = await getCurrentUser();
        return user?.role === "ADMIN";
    } catch (error) {
        console.error("[moodmeals][auth][isAdmin] Error: ", error);
        return false;
    }
}

export async function requireAdmin() {
    const admin = await isAdmin();
    if (!admin) {
        throw new Error("Unauthorized: Admin access required");
    }
    return true;
}