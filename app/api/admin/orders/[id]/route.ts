import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

// GET single order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
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
      user: order.user,
      items: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        menuItem: {
          id: item.menuItem.id,
          name: item.menuItem.name,
          price: Number(item.menuItem.price),
          discountedPrice: item.menuItem.discountedPrice ? Number(item.menuItem.discountedPrice) : null,
          isDiscount: item.menuItem.isDiscount,
          image: item.menuItem.image,
          preparationTime: item.menuItem.preparationTime,
        },
      })),
      address: {
        addressLine1: order.address.addressLine1,
        addressLine2: order.address.addressLine2,
        city: order.address.city,
        state: order.address.state,
        postalCode: order.address.postalCode,
        country: order.address.country,
        landmark: order.address.landmark,
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

// PUT update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { 
        status,
        ...(status === "READY" && { readyAt: new Date() }),
        ...(status === "DELIVERED" && { deliveredAt: new Date() }),
        ...(status === "CANCELLED" && { cancelledAt: new Date() }),
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}