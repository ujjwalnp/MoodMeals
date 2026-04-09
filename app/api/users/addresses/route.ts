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
    const session = (await getSession()) as Session | null;
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user and their addresses
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: "desc" }, // default address first
    });

    return NextResponse.json({ addresses }, { status: 200 });
  } catch (error) {
    console.error("[user][addresses][GET] Error:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = (await getSession()) as Session | null;
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await request.json();
    const { addressLine1, addressLine2, city, state, postalCode, country, landmark, phoneNumber, isDefault } = body;

    if (!addressLine1 || !postalCode || !phoneNumber) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    // If isDefault=true, unset previous default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        addressLine1,
        addressLine2,
        city: city || "Hetauda",
        state: state || "Bagmati",
        postalCode,
        country: country || "Nepal",
        landmark,
        phoneNumber,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json({ address: newAddress });
  } catch (error) {
    console.error("[user][addresses][POST] Error:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}