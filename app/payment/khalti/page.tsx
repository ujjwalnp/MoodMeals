"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    KhaltiCheckout: any;
  }
}

export default function KhaltiPaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId && window.KhaltiCheckout) {
      initiatePayment();
    }
  }, [orderId]);

  const initiatePayment = async () => {
    try {
      // Fetch payment details from your backend
      const response = await fetch(`/api/payment/khalti/initiate?orderId=${orderId}`);
      const data = await response.json();

      const config = {
        publicKey: "test_public_key_your_public_key",
        productIdentity: orderId,
        productName: "Order Payment",
        productUrl: "http://localhost:3000",
        eventHandler: {
          onSuccess(payload: any) {
            // Handle success
            window.location.href = `/order-confirmation?orderId=${orderId}&payment=success`;
          },
          onError(error: any) {
            // Handle error
            console.error(error);
            window.location.href = `/checkout?payment=failed`;
          },
        },
        paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
      };

      const checkout = new window.KhaltiCheckout(config);
      checkout.show({ amount: data.amount });
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  return (
    <>
      <Script
        src="https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js"
        onLoad={() => setLoading(false)}
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        {loading && (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600">Loading payment gateway...</p>
          </div>
        )}
      </div>
    </>
  );
}