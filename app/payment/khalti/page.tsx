"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, AlertCircle } from "lucide-react";

export default function KhaltiPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    initiatePayment();
  }, [orderId]);

  const initiatePayment = async () => {
    try {
      // 1. Call our backend to initiate Khalti payment
      const response = await fetch("/api/payment/khalti/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to initiate payment");
      }

      const data = await response.json();

      // 2. Redirect to Khalti payment page
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(err instanceof Error ? err.message : "Payment initiation failed");
      setLoading(false);
      
      // Redirect back to checkout after 3 seconds
      setTimeout(() => {
        router.push("/checkout?payment=failed");
      }, 3000);
    }
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Payment Failed</h2>
            <p className="text-stone-600 mb-4">{error}</p>
            <p className="text-sm text-stone-500">Redirecting you back to checkout...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-amber-600 mx-auto mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">💸</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Redirecting to Khalti</h2>
          <p className="text-stone-600">Please wait while we prepare your payment...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <img 
              src="https://khalti.com/static/images/logo.png" 
              alt="Khalti" 
              className="h-8"
            />
            <span className="text-stone-400">Secure payment gateway</span>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}