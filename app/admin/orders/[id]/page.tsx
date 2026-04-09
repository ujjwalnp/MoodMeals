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
  MessageCircle
} from "lucide-react";

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
  user: {
    name: string;
    email: string;
  };
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

const statusOptions = [
  { value: "PENDING", label: "Pending", color: "bg-orange-100 text-orange-700" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  { value: "PREPARING", label: "Preparing", color: "bg-purple-100 text-purple-700" },
  { value: "READY", label: "Ready for Pickup/Delivery", color: "bg-green-100 text-green-700" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery", color: "bg-indigo-100 text-indigo-700" },
  { value: "DELIVERED", label: "Delivered", color: "bg-green-100 text-green-700" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-700" },
];

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);

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
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (!response.ok) throw new Error("Failed to fetch order");
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!confirm(`Change order status to ${newStatus}?`)) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error("Failed to update status");
      
      const data = await response.json();
      setOrder(prev => prev ? { ...prev, status: data.order.status } : null);
      
      // If status changed to READY, refresh to show in order book
      if (newStatus === "READY") {
        setTimeout(() => {
          router.push("/admin/order-book");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || "bg-stone-100 text-stone-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Order Not Found</h2>
          <Link href="/admin">
            <button className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}>
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin">
              <button className="mb-4 text-stone-600 hover:text-amber-600 flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            </Link>
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-stone-900">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-stone-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex gap-3">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                  disabled={updating}
                  className={`px-4 py-2 rounded-full font-semibold text-sm border-0 focus:ring-2 focus:ring-amber-500 ${getStatusColor(order.status)}`}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {updating && <Loader2 className="h-5 w-5 animate-spin text-amber-600" />}
              </div>
            </div>
          </div>

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
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-stone-100 last:border-0">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.menuItem.image || "/placeholder-food.jpg"}
                          alt={item.menuItem.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-stone-900">{item.menuItem.name}</h3>
                            <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                            <p className="text-xs text-stone-400">
                              Prep time: {item.menuItem.preparationTime} mins
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
                  ))}
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
              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-amber-600" />
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-stone-400" />
                    <span className="text-stone-700">{order.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-stone-400" />
                    <span className="text-stone-700">{order.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-stone-400" />
                    <span className="text-stone-700">{order.address.phoneNumber}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  Delivery Address
                </h2>
                <div className="space-y-1 text-stone-600">
                  <p>{order.address.addressLine1}</p>
                  {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                  <p>{order.address.city}, {order.address.state}</p>
                  <p>{order.address.country} - {order.address.postalCode}</p>
                  {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  Payment Information
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Method:</span>
                    <span className="font-semibold text-stone-900">
                      {order.payment?.method || "Cash on Delivery"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Status:</span>
                    <span className={`font-semibold ${
                      order.paymentStatus === "PAID" ? "text-green-600" : "text-red-600"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  {order.payment?.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-stone-600">Transaction ID:</span>
                      <span className="text-sm text-stone-500">{order.payment.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  Order Summary
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Subtotal:</span>
                    <span className="text-stone-900">NPR {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Delivery Charge:</span>
                    <span className="text-stone-900">
                      {order.deliveryCharge === 0 ? "Free" : `NPR ${order.deliveryCharge.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-stone-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-stone-900">Total:</span>
                      <span className="font-bold text-amber-600 text-lg">
                        NPR {order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Order Timeline
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">Order Placed</p>
                      <p className="text-xs text-stone-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  {order.status !== "PENDING" && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-900">Order Confirmed</p>
                        <p className="text-xs text-stone-500">Status updated to {order.status}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}