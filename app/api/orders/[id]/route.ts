import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        address: true,
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      subtotal: Number(order.subtotal),
      deliveryCharge: Number(order.deliveryCharge),
      totalAmount: Number(order.totalAmount),
      specialInstructions: order.specialInstructions,
      createdAt: order.createdAt,
      items: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        menuItem: {
          id: item.menuItem.id,
          name: item.menuItem.name,
          image: item.menuItem.image,
          price: Number(item.menuItem.price),
        },
      })),
      address: {
        addressLine1: order.address.addressLine1,
        addressLine2: order.address.addressLine2,
        city: order.address.city,
        state: order.address.state,
        postalCode: order.address.postalCode,
        country: order.address.country,
        phoneNumber: order.address.phoneNumber,
      },
      payment: order.payment ? {
        method: order.payment.method,
        status: order.payment.status,
        transactionId: order.payment.transactionId,
      } : null,
    };

    return NextResponse.json({ order: transformedOrder });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}