// app/orders/[id]/page.tsx (Fixed)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  UtensilsCrossed,
  Loader2,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MessageCircle,
  Home,
  Receipt,
  AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  specialInstructions: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
  customerName?: string;
  customerEmail?: string;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    menuItem: {
      id: string;
      name: string;
      price: number;
      discountedPrice: number | null;
      isDiscount: boolean;
      image: string | null;
      preparationTime: number;
    };
  }>;
  address: {
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    landmark: string | null;
    phoneNumber: string;
  };
  payment: {
    method: string;
    status: string;
    transactionId: string | null;
  } | null;
}

const statusConfig = {
  PENDING: { label: "Pending", color: "bg-orange-100 text-orange-700", icon: Clock, step: 1 },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle, step: 2 },
  PREPARING: { label: "Preparing", color: "bg-purple-100 text-purple-700", icon: Package, step: 3 },
  READY: { label: "Ready for Pickup/Delivery", color: "bg-green-100 text-green-700", icon: CheckCircle, step: 4 },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-700", icon: Truck, step: 5 },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle, step: 6 },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle, step: 0 },
};

export default function UserOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
    
    // Unwrap params
    const unwrapParams = async () => {
      const { id } = await params;
      setOrderId(id);
    };
    
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error("Failed to fetch order");
      const data = await response.json();
      console.log("Order data:", data); // Debug log to see actual structure
      setOrder(data.order || data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;
    
    setCancelling(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) throw new Error("Failed to cancel order");
      
      const data = await response.json();
      setOrder(prev => prev ? { ...prev, status: data.order.status } : null);
      
      alert("Order has been cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canCancel = (status: string) => {
    return ["PENDING", "CONFIRMED"].includes(status);
  };

  // Helper function to get customer name
  const getCustomerName = () => {
    if (order?.user?.name) return order.user.name;
    if (order?.customerName) return order.customerName;
    return "Customer";
  };

  // Helper function to get customer email
  const getCustomerEmail = () => {
    if (order?.user?.email) return order.user.email;
    if (order?.customerEmail) return order.customerEmail;
    return "Not provided";
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

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-stone-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Order Not Found</h2>
            <p className="text-stone-600 mb-6">The order you're looking for doesn't exist.</p>
            <Link href="/orders">
              <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold">
                View My Orders
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const statusConfigData = getStatusConfig(order.status);
  const StatusIcon = statusConfigData.icon;

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
        style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}
      >
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/orders">
              <button className="mb-4 text-stone-600 hover:text-amber-600 flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to My Orders
              </button>
            </Link>
            
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-stone-900">
                  Order #{order.orderNumber}
                </h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <p className="text-stone-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(order.createdAt)}
                  </p>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${statusConfigData.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span>{statusConfigData.label}</span>
                  </div>
                </div>
              </div>
              
              {/* {canCancel(order.status) && (
                <button
                  onClick={cancelOrder}
                  disabled={cancelling}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {cancelling && <Loader2 className="h-4 w-4 animate-spin" />}
                  Cancel Order
                </button>
              )} */}
            </div>
          </div>

          {/* Order Status Timeline */}
          {order.status !== "CANCELLED" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-x-auto">
              <h2 className="text-lg font-bold text-stone-900 mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Order Status
              </h2>
              <div className="relative min-w-[600px]">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-stone-200"></div>
                <div className="relative flex justify-between">
                  {[
                    { step: 1, label: "Order Placed", icon: Clock },
                    { step: 2, label: "Confirmed", icon: CheckCircle },
                    { step: 3, label: "Preparing", icon: Package },
                    { step: 4, label: "Ready", icon: CheckCircle },
                    { step: 5, label: "Out for Delivery", icon: Truck },
                    { step: 6, label: "Delivered", icon: CheckCircle },
                  ].map((step) => {
                    const Icon = step.icon;
                    const isCompleted = statusConfigData.step >= step.step;
                    const isCurrent = statusConfigData.step === step.step;
                    
                    return (
                      <div key={step.step} className="relative flex flex-col items-center z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? "bg-green-500 text-white" 
                            : isCurrent 
                            ? "bg-amber-500 text-white ring-4 ring-amber-100"
                            : "bg-stone-200 text-stone-400"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className={`text-xs font-semibold mt-2 text-center ${
                          isCompleted || isCurrent ? "text-stone-800" : "text-stone-400"
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-amber-600" />
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-stone-100 last:border-0">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                          <Image
                            src={item.menuItem.image || "/placeholder-food.jpg"}
                            alt={item.menuItem.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between flex-wrap gap-2">
                            <div>
                              <h3 className="font-semibold text-stone-900">{item.menuItem.name}</h3>
                              <p className="text-sm text-stone-500">Quantity: {item.quantity}</p>
                              <p className="text-xs text-stone-400">
                                Prep time: ~{item.menuItem.preparationTime} mins
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-amber-600">
                                NPR {item.totalPrice.toFixed(2)}
                              </p>
                              <p className="text-xs text-stone-400">
                                NPR {item.unitPrice.toFixed(2)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-500 text-center py-4">No items found</p>
                  )}
                </div>

                {/* Special Instructions */}
                {order.specialInstructions && (
                  <div className="mt-4 pt-4 border-t border-stone-200">
                    <div className="flex items-start gap-2">
                      <MessageCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-stone-700">Special Instructions:</p>
                        <p className="text-sm text-stone-600">{order.specialInstructions}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Details */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  Delivery Address
                </h2>
                {order.address ? (
                  <div className="space-y-1 text-stone-600">
                    <p className="font-medium">{getCustomerName()}</p>
                    <p>{order.address.addressLine1}</p>
                    {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                    <p>{order.address.city}, {order.address.state}</p>
                    <p>{order.address.country} - {order.address.postalCode}</p>
                    {order.address.landmark && <p>📍 Landmark: {order.address.landmark}</p>}
                    <div className="flex items-center gap-2 pt-2">
                      <Phone className="h-4 w-4 text-stone-400" />
                      <p className="text-sm">{order.address.phoneNumber}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-stone-500">No address information available</p>
                )}
              </div>

              {/* Customer Information */}
              {/* <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-amber-600" />
                  Customer Information
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-stone-400" />
                    <span className="text-stone-700">{getCustomerName()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-stone-400" />
                    <span className="text-stone-700">{getCustomerEmail()}</span>
                  </div>
                </div>
              </div> */}

              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  Payment Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <span className="text-stone-600">Payment Method:</span>
                    <span className="font-semibold text-stone-900">
                      {order.payment?.method || "Cash on Delivery"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <span className="text-stone-600">Payment Status:</span>
                    <span className={`font-semibold ${
                      order.paymentStatus === "PAID" ? "text-green-600" : "text-red-600"
                    }`}>
                      {order.paymentStatus || "PENDING"}
                    </span>
                  </div>
                  {order.payment?.transactionId && (
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">Transaction ID:</span>
                      <span className="text-sm text-stone-500 font-mono">{order.payment.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <Receipt className="h-5 w-5 text-amber-600" />
                  Order Summary
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Subtotal:</span>
                    <span className="text-stone-900">NPR {order.subtotal?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Delivery Charge:</span>
                    <span className="text-stone-900">
                      {order.deliveryCharge === 0 ? "Free" : `NPR ${order.deliveryCharge?.toFixed(2) || "0.00"}`}
                    </span>
                  </div>
                  <div className="border-t border-stone-200 pt-3 mt-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-stone-900 text-lg">Total:</span>
                      <span className="font-bold text-amber-600 text-xl">
                        NPR {order.totalAmount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help? */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
                <h3 className="font-semibold text-stone-800 mb-2">Need Help?</h3>
                <p className="text-sm text-stone-600 mb-3">
                  Having issues with your order? Contact our support team.
                </p>
                <Link href="/contact">
                  <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition">
                    Contact Support
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}