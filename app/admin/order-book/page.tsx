"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  Search, 
  Eye, 
  Calendar,
  DollarSign,
  Download,
  Filter,
  X,
  Loader2,
  ArrowLeft
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    quantity: number;
    menuItem: {
      name: string;
    };
  }>;
}

export default function AdminOrderBook() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      // Filter for completed/cancelled orders only
      const pastOrders = data.orders.filter((order: Order) => 
        order.status === "DELIVERED" || 
        order.status === "CANCELLED" ||
        order.status === "READY"
      );
      setOrders(pastOrders);
      setFilteredOrders(pastOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "READY":
        return "bg-green-100 text-green-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "Email", "Status", "Total", "Date"];
    const csvData = filteredOrders.map(order => [
      order.orderNumber,
      order.user.name,
      order.user.email,
      order.status,
      order.totalAmount,
      formatDate(order.createdAt),
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin">
              <button className="mb-4 text-stone-600 hover:text-amber-600 flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            </Link>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Order Book
                </h1>
                <p className="text-stone-600">View all completed and past orders</p>
              </div>
              <button
                onClick={exportToCSV}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Export to CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div className="relative min-w-[200px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="READY">Ready</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {(searchTerm || statusFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-stone-600 hover:text-amber-600 flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                  {filteredOrders.map((order) => (
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
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-500">
                        {formatDate(order.createdAt)}
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
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-500">No orders found</p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {filteredOrders.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Total Orders</p>
                    <p className="text-2xl font-bold text-stone-900">{filteredOrders.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-stone-900">
                      NPR {filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Average Order Value</p>
                    <p className="text-2xl font-bold text-stone-900">
                      NPR {(filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0) / filteredOrders.length).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}