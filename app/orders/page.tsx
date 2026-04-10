// app/orders/page.tsx (Updated)
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Package, Clock, CheckCircle, Truck, Eye, Loader2, AlertCircle } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    menuItem: {
      name: string;
      image: string;
    };
  }>;
}

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-orange-100 text-orange-700", icon: Clock },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  PREPARING: { label: "Preparing", color: "bg-purple-100 text-purple-700", icon: Package },
  READY: { label: "Ready", color: "bg-green-100 text-green-700", icon: CheckCircle },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-700", icon: Truck },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: AlertCircle },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
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
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              My Orders
            </h1>
            <p className="text-stone-600">Track and manage your orders</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-stone-800 mb-2">No Orders Yet</h2>
              <p className="text-stone-600 mb-6">Start exploring our delicious menu!</p>
              <Link href="/menu">
                <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
                  Browse Menu
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = getStatusConfig(order.status);
                const StatusIcon = status.icon;
                
                return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-stone-500">Order #{order.orderNumber}</p>
                        <p className="text-xs text-stone-400">
                          {new Date(order.createdAt).toLocaleDateString()} at{" "}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{status.label}</span>
                        </div>
                        <Link href={`/orders/${order.id}`}>
                          <button className="px-3 py-1 text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1 transition">
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>

                    <div className="border-t border-stone-100 pt-4">
                      <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                          <p className="text-sm text-stone-600">
                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                          </p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {order.items.slice(0, 3).map((item, idx) => (
                              <span key={item.id} className="text-xs text-stone-500">
                                {item.menuItem.name}
                                {idx < Math.min(order.items.length, 3) - 1 ? "," : ""}
                              </span>
                            ))}
                            {order.items.length > 3 && (
                              <span className="text-xs text-stone-500">+{order.items.length - 3} more</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-stone-500">Total Amount</p>
                          <p className="text-xl font-bold text-amber-600">NPR {order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}