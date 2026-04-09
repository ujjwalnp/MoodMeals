import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { initiateKhaltiPayment, convertToPaisa } from "@/lib/khalti";

export async function POST(request: NextRequest) {
  try {
    // 1. Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Get order ID from request
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // 3. Fetch order details from database
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: user.id },
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // 4. Check if order already has payment
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      );
    }

    // Check if there's an existing payment initiation
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: order.id },
    });

    // 5. Prepare Khalti payment payload
    const amountInPaisa = convertToPaisa(Number(order.totalAmount));
    
    // Use order number as unique purchase_order_id
    const purchaseOrderId = order.orderNumber;
    
    const payload = {
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/payment/khalti/verify`,
      website_url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      amount: amountInPaisa,
      purchase_order_id: purchaseOrderId,
      purchase_order_name: `Order ${order.orderNumber}`,
      customer_info: {
        name: order.user.name,
        email: order.user.email,
        phone: order.address.phoneNumber,
      },
    };

    console.log("Initiating Khalti payment with payload:", payload);

    // 6. Initiate payment with Khalti
    const khaltiResponse = await initiateKhaltiPayment(payload);
    console.log("Khalti response:", khaltiResponse);

    // 7. Create or update payment record with pidx
    if (existingPayment) {
      // Update existing payment - Use "UNPAID" instead of "PENDING"
      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          transactionId: khaltiResponse.pidx, // Store pidx here for lookup
          status: "UNPAID", // Changed from "PENDING" to "UNPAID"
          gatewayResponse: {
            pidx: khaltiResponse.pidx,
            payment_url: khaltiResponse.payment_url,
            expires_at: khaltiResponse.expires_at,
          } as any, // Type assertion to bypass JSON type checking
        },
      });
    } else {
      // Create new payment record - Use "UNPAID" instead of "PENDING"
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.totalAmount,
          method: "KHALTI",
          status: "UNPAID", // Changed from "PENDING" to "UNPAID"
          transactionId: khaltiResponse.pidx, // Store pidx here for lookup
          gatewayResponse: {
            pidx: khaltiResponse.pidx,
            payment_url: khaltiResponse.payment_url,
            expires_at: khaltiResponse.expires_at,
          } as any, // Type assertion to bypass JSON type checking
        },
      });
    }

    // 8. Return payment URL to frontend
    return NextResponse.json({
      success: true,
      payment_url: khaltiResponse.payment_url,
      pidx: khaltiResponse.pidx,
    });
  } catch (error) {
    console.error("Khalti initiate error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}