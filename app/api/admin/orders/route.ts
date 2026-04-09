import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, getCurrentUser } from "@/lib/auth";

// GET all orders for admin
export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            menuItem: {
              select: {
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
        address: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      deliveryCharge: Number(order.deliveryCharge),
      totalAmount: Number(order.totalAmount),
      specialInstructions: order.specialInstructions,
      createdAt: order.createdAt,
      user: order.user,
      items: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        menuItem: {
          name: item.menuItem.name,
          price: Number(item.menuItem.price),
          image: item.menuItem.image,
        },
      })),
      address: order.address,
      payment: order.payment,
    }));

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}