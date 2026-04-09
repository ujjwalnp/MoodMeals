"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function KhaltiVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "failed">("processing");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Get all parameters from URL
      const pidx = searchParams.get("pidx");
      const transactionId = searchParams.get("transaction_id");
      const status = searchParams.get("status");
      const amount = searchParams.get("amount");
      const mobile = searchParams.get("mobile");
      const purchaseOrderId = searchParams.get("purchase_order_id");

      console.log("Khalti callback received:", {
        pidx,
        transactionId,
        status,
        amount,
        mobile,
        purchaseOrderId,
      });

      if (!pidx) {
        setStatus("failed");
        setMessage("Invalid payment callback. Missing payment ID.");
        return;
      }

      // Call our backend API to verify the payment
      const response = await fetch("/api/payment/khalti/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pidx,
          transactionId,
          status,
          amount,
          mobile,
          purchaseOrderId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage("Payment successful! Redirecting to order confirmation...");
        
        // Redirect to order confirmation after 2 seconds
        setTimeout(() => {
          router.push(`/order-confirmation?orderId=${data.orderId}&payment=success`);
        }, 2000);
      } else {
        setStatus("failed");
        setMessage(data.error || "Payment verification failed");
        
        // Redirect back to checkout after 3 seconds
        setTimeout(() => {
          router.push("/checkout?payment=failed");
        }, 3000);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("failed");
      setMessage("An error occurred while verifying your payment");
      
      setTimeout(() => {
        router.push("/checkout?payment=failed");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {status === "processing" && (
          <>
            <div className="relative mb-6">
              <Loader2 className="h-16 w-16 animate-spin text-amber-600 mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">💸</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Processing Payment</h2>
            <p className="text-stone-600">{message}</p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <img 
                src="https://khalti.com/static/images/logo.png" 
                alt="Khalti" 
                className="h-6"
              />
              <span className="text-sm text-stone-400">Secure payment gateway</span>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Payment Successful! 🎉</h2>
            <p className="text-stone-600 mb-4">{message}</p>
            <div className="animate-pulse text-sm text-amber-600">Redirecting...</div>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Payment Failed</h2>
            <p className="text-stone-600 mb-6">{message}</p>
            <Link href="/checkout">
              <button className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:scale-105 transition-all">
                Return to Checkout
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}