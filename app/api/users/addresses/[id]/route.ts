import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma"

interface Session {
  email: string;
  name: string;
  role: string;
  id: string;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = (await getSession()) as Session | null;
    if (!session?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.email }, select: { id: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { id } = params;
    const body = await request.json();

    // If updating isDefault, unset previous default
    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.updateMany({
      where: { id, userId: user.id },
      data: body,
    });

    if (updatedAddress.count === 0) {
      return NextResponse.json({ error: "Address not found or not yours" }, { status: 404 });
    }

    return NextResponse.json({ message: "Address updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("[user][addresses][PATCH] Error:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // Note: params is a Promise now
) {
  try {
    const session = (await getSession()) as Session | null;
    if (!session?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.email }, select: { id: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // --- THE CRITICAL FIX ---
    const { id } = await params; 
    // ------------------------

    if (!id) {
      return NextResponse.json({ error: "Address ID is missing" }, { status: 400 });
    }

    const deleted = await prisma.address.deleteMany({
      where: { 
        id: id,      
        userId: user.id 
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Address not found or not yours" }, { status: 404 });
    }

    return NextResponse.json({ message: "Address deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("[user][addresses][DELETE] Error:", error);
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}