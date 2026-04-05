import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return NextResponse.json({
            success: true,
            message: "Database connection successful",
        },
        { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Database connection failed",
            error: String(error),
        },
        { status: 500 }
    );
    }
}