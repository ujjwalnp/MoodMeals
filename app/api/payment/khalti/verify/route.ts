import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { lookupKhaltiPayment } from "@/lib/khalti";

export async function POST(request: NextRequest) {
  try {
    // Get parameters from request body
    const body = await request.json();
    const { pidx, transactionId, status, amount, mobile, purchaseOrderId } = body;

    console.log("Khalti verification API called:", { pidx, transactionId, status, amount, mobile, purchaseOrderId });

    // Validate required parameters
    if (!pidx) {
      return NextResponse.json(
        { error: "Missing pidx parameter", success: false },
        { status: 400 }
      );
    }

    // IMPORTANT: Lookup payment status from Khalti for security
    // This ensures the payment is genuine and not faked
    console.log("Looking up payment from Khalti...");
    const lookupResult = await lookupKhaltiPayment(pidx);
    console.log("Lookup result:", lookupResult);

    // Find the payment record using pidx (stored in transactionId during initiation)
    const payment = await prisma.payment.findFirst({
      where: {
        transactionId: pidx,
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      console.error("Payment record not found for pidx:", pidx);
      return NextResponse.json(
        { error: "Payment record not found", success: false },
        { status: 404 }
      );
    }

    console.log("Found payment record:", { paymentId: payment.id, orderId: payment.orderId });

    // Check if payment is already processed
    if (payment.status === "PAID") {
      console.log("Payment already processed");
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
        orderId: payment.orderId,
      });
    }

    // Verify payment status from Khalti lookup
    const isSuccess = lookupResult.status === "Completed";

    if (isSuccess && lookupResult.transaction_id) {
      // Payment successful - Update database using transaction
      console.log("Payment successful, updating database...");
      
      const result = await prisma.$transaction(async (tx) => {
        // Update payment record
        const updatedPayment = await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            transactionId: lookupResult.transaction_id,
            paidAt: new Date(),
            gatewayResponse: {
              pidx: pidx,
              khaltiTransactionId: lookupResult.transaction_id,
              amount: lookupResult.total_amount,
              status: lookupResult.status,
              refunded: lookupResult.refunded,
              fee: lookupResult.fee,
            } as any, // Type assertion to bypass JSON type checking
          },
        });

        // Update order payment status and confirm order
        const updatedOrder = await tx.order.update({
          where: { id: payment.orderId },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED", // Auto-confirm order after successful payment
          },
        });

        return { updatedPayment, updatedOrder };
      });

      console.log("Database updated successfully:", { orderId: result.updatedOrder.id });

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        orderId: payment.orderId,
      });
    } else {
      // Payment failed - Update payment status
      console.log("Payment failed:", lookupResult.status);
      
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          gatewayResponse: {
            pidx: pidx,
            status: lookupResult.status,
            message: lookupResult.status === "User canceled" ? "User cancelled the payment" : "Payment failed",
          } as any, // Type assertion to bypass JSON type checking
        },
      });

      return NextResponse.json(
        { error: `Payment ${lookupResult.status}`, success: false },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Khalti verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment", success: false },
      { status: 500 }
    );
  }
}