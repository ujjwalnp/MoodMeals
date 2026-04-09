"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Truck, Clock, Package, ArrowLeft, Download } from "lucide-react";

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error("Failed to fetch order");
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Order Not Found</h2>
            <Link href="/">
              <button className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold">
                Go Home
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
        style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Animation */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-stone-900 mb-2">
                Order Confirmed! 🎉
              </h1>
              <p className="text-stone-600">
                Thank you for your order. We'll notify you when it's ready.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="border-b border-stone-200 pb-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-stone-500">Order Number</p>
                    <p className="text-xl font-bold text-stone-900">{order.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone-500">Total Amount</p>
                    <p className="text-2xl font-bold text-amber-600">NPR {order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Order Status</p>
                    <p className="font-semibold text-stone-900 capitalize">{order.status.toLowerCase()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Estimated Delivery Time</p>
                    <p className="font-semibold text-stone-900">30-45 minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Delivery Method</p>
                    <p className="font-semibold text-stone-900">Standard Delivery</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="font-bold text-stone-900 mb-3">Payment Information</h3>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">Payment Status</span>
                <span className={`font-semibold ${
                  order.paymentStatus === "PAID" ? "text-green-600" : "text-orange-600"
                }`}>
                  {order.paymentStatus === "PAID" ? "Paid ✓" : "Pending - Pay on Delivery"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link href="/orders" className="flex-1">
                <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <Package className="h-5 w-5" />
                  View My Orders
                </button>
              </Link>
              <Link href="/menu" className="flex-1">
                <button className="w-full border-2 border-stone-200 text-stone-600 py-3 rounded-xl font-semibold hover:border-amber-600 hover:text-amber-600 transition-all duration-300 flex items-center justify-center gap-2">
                  <ArrowLeft className="h-5 w-5" />
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}