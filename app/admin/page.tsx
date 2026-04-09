"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  ChevronRight,
  Loader2,
  Calendar,
  DollarSign,
  UtensilsCrossed,
  LayoutDashboard,
  RefreshCw
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    quantity: number;
    menuItem: {
      name: string;
    };
  }>;
  user: {
    name: string;
    email: string;
  };
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  outForDeliveryOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalIncome: number;
  totalItems: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [ongoingOrders, setOngoingOrders] = useState<Order[]>([]);
  const [recentCompletedOrders, setRecentCompletedOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    outForDeliveryOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalIncome: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/admin/orders");
      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login?redirect=/admin");
          return;
        }
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      
      // Separate ongoing orders (not delivered or cancelled)
      const ongoing = data.orders.filter((order: Order) => 
        order.status !== "DELIVERED" && order.status !== "CANCELLED"
      );
      
      // Get recent completed orders (last 10 delivered/cancelled)
      const completed = data.orders.filter((order: Order) => 
        order.status === "DELIVERED" || order.status === "CANCELLED"
      ).slice(0, 10);
      
      setOngoingOrders(ongoing);
      setRecentCompletedOrders(completed);
      
      // Calculate stats
      const pending = data.orders.filter((o: Order) => o.status === "PENDING").length;
      const preparing = data.orders.filter((o: Order) => o.status === "PREPARING").length;
      const ready = data.orders.filter((o: Order) => o.status === "READY").length;
      const outForDelivery = data.orders.filter((o: Order) => o.status === "OUT_FOR_DELIVERY").length;
      const completedOrders = data.orders.filter((o: Order) => o.status === "DELIVERED").length;
      const cancelledOrders = data.orders.filter((o: Order) => o.status === "CANCELLED").length;
      const income = data.orders
        .filter((o: Order) => o.status === "DELIVERED")
        .reduce((sum: number, o: Order) => sum + o.totalAmount, 0);
      const totalItems = data.orders.reduce((sum: number, o: Order) => 
        sum + o.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0), 0);
      
      setStats({
        totalOrders: data.orders.length,
        pendingOrders: pending,
        preparingOrders: preparing,
        readyOrders: ready,
        outForDeliveryOrders: outForDelivery,
        completedOrders: completedOrders,
        cancelledOrders: cancelledOrders,
        totalIncome: income,
        totalItems: totalItems,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-700";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "PREPARING":
        return "bg-purple-100 text-purple-700";
      case "READY":
        return "bg-green-100 text-green-700";
      case "OUT_FOR_DELIVERY":
        return "bg-indigo-100 text-indigo-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-3 w-3" />;
      case "PREPARING":
        return <UtensilsCrossed className="h-3 w-3" />;
      case "READY":
        return <CheckCircle className="h-3 w-3" />;
      case "OUT_FOR_DELIVERY":
        return <Truck className="h-3 w-3" />;
      case "DELIVERED":
        return <CheckCircle className="h-3 w-3" />;
      case "CANCELLED":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    return status === "PAID" 
      ? "bg-green-100 text-green-700" 
      : "bg-red-100 text-red-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}>
        <div className="container mx-auto px-4 py-0">
          {/* Compact Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/50 p-4 rounded-3xl backdrop-blur-sm border border-stone-100 shadow-sm">
            
            <div className="flex items-center gap-4">
              {/* Cute Icon Badge */}
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-orange-200 shadow-lg">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              
              <div>
                <h1 className="text-2xl font-black text-stone-800 tracking-tight">
                  Dashboard
                </h1>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Admin Overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Description - Hidden on small mobile to keep it tight */}
              <p className="hidden lg:block text-sm text-stone-400 italic mr-4">
                Real-time performance tracking
              </p>

              {/* Refresh Button - Refined & Minimal */}
              <button
                onClick={fetchOrders}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 hover:border-amber-200 transition-all active:scale-95 shadow-sm"
              >
                <RefreshCw className={`h-4 w-4 text-amber-600 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-semibold">Refresh</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
            {/* Pending Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900">{stats.pendingOrders}</h3>
              <p className="text-xs text-stone-500 truncate">Pending</p>
            </div>

            {/* Preparing */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <UtensilsCrossed className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900">{stats.preparingOrders}</h3>
              <p className="text-xs text-stone-500 truncate">Preparing</p>
            </div>

            {/* Ready */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900">{stats.readyOrders}</h3>
              <p className="text-xs text-stone-500 truncate">Ready</p>
            </div>

            {/* Out for Delivery */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900">{stats.outForDeliveryOrders}</h3>
              <p className="text-xs text-stone-500 truncate">On Way</p>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900">{stats.totalOrders}</h3>
              <p className="text-xs text-stone-500 truncate">Total</p>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900">{stats.completedOrders}</h3>
              <p className="text-xs text-stone-500 truncate">Completed</p>
            </div>

            {/* Cancelled */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900">{stats.cancelledOrders}</h3>
              <p className="text-xs text-stone-500 truncate">Cancelled</p>
            </div>

            {/* Total Income */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-stone-900 truncate">NPR {stats.totalIncome.toFixed(0)}</h3>
              <p className="text-xs text-stone-500 truncate">Income</p>
            </div>
          </div>

          {/* Ongoing Orders Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-stone-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Ongoing Orders ({ongoingOrders.length})
                </h2>
                <span className="text-xs text-stone-500">Real-time updates</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {ongoingOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <p>No ongoing orders! All caught up 🎉</p>
                      </td>
                    </tr>
                  ) : (
                    ongoingOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50">
                        <td className="px-6 py-4 text-sm font-medium text-stone-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-stone-900">{order.user.name}</div>
                          <div className="text-xs text-stone-500">{order.user.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-600">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-amber-600">
                          NPR {order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/orders/${order.id}`}>
                            <button className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Link href="/admin/menu">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <UtensilsCrossed className="h-8 w-8 mb-2" />
                    <h3 className="text-xl font-bold">Manage Menu</h3>
                    <p className="text-white/80 text-sm mt-1">Add, edit, or remove menu items</p>
                  </div>
                  <ChevronRight className="h-8 w-8" />
                </div>
              </div>
            </Link>

            <Link href="/admin/order-book">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <Package className="h-8 w-8 mb-2" />
                    <h3 className="text-xl font-bold">Order Book</h3>
                    <p className="text-white/80 text-sm mt-1">View all completed and past orders</p>
                  </div>
                  <ChevronRight className="h-8 w-8" />
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Completed Orders Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Recent Completed Orders
                </h2>
                <Link href="/admin/order-book">
                  <button className="text-sm text-amber-600 hover:text-amber-700 font-semibold">
                    View All →
                  </button>
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {recentCompletedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-stone-500">
                        <Package className="h-12 w-12 text-stone-400 mx-auto mb-2" />
                        <p>No completed orders yet</p>
                      </td>
                    </tr>
                  ) : (
                    recentCompletedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-stone-50">
                        <td className="px-6 py-4 text-sm font-medium text-stone-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-stone-900">{order.user.name}</div>
                          <div className="text-xs text-stone-500">{order.user.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-600">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-amber-600">
                          NPR {order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/orders/${order.id}`}>
                            <button className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}