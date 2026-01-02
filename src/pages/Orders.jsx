import React, { useState, useEffect } from "react";
import { exportOrdersToCSV } from "../utils/exportCSV";

import {
  Package,
  Truck,
  ChevronRight,
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Calendar,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock3,
  Search,
  Download,
  Eye,
  Filter,
  IndianRupee,
  ShoppingCart,
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://api.houseofresha.com/orders");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.data && Array.isArray(data.data)) {
        setOrders(data.data);
      } else if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        console.warn("Unexpected API response structure:", data);
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatTime = (dateString) => {
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  const formatPrice = (price) => {
    try {
      const numericPrice = Number(price) || 0;
      const hasDecimals = numericPrice % 1 !== 0;

      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: 2,
      }).format(numericPrice);
    } catch (error) {
      return "₹0";
    }
  };

  // Calculate total revenue from all orders
  const calculateTotalRevenue = () => {
    return orders.reduce((total, order) => {
      const amount = Number(order.amount || order.totalAmount || 0);
      return total + amount;
    }, 0);
  };

  // Get order status statistics
  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      paid: 0,
      pending: 0,
      failed: 0,
      totalRevenue: calculateTotalRevenue(),
    };

    orders.forEach((order) => {
      const status = (order.paymentStatus || order.status || "").toLowerCase();
      if (
        status.includes("paid") ||
        status.includes("completed") ||
        status.includes("success")
      ) {
        stats.paid++;
      } else if (status.includes("pending")) {
        stats.pending++;
      } else if (status.includes("failed") || status.includes("cancelled")) {
        stats.failed++;
      }
    });

    return stats;
  };

  const getStatusConfig = (status) => {
    if (!status)
      return {
        color: "gray",
        icon: Clock3,
        bg: "bg-gray-100",
        text: "text-gray-700",
      };

    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
      case "success":
        return {
          color: "green",
          icon: CheckCircle,
          bg: "bg-green-100",
          text: "text-green-700",
        };
      case "pending":
        return {
          color: "yellow",
          icon: Clock3,
          bg: "bg-yellow-100",
          text: "text-yellow-700",
        };
      case "failed":
      case "cancelled":
      case "declined":
        return {
          color: "red",
          icon: XCircle,
          bg: "bg-red-100",
          text: "text-red-700",
        };
      default:
        return {
          color: "gray",
          icon: Clock3,
          bg: "bg-gray-100",
          text: "text-gray-700",
        };
    }
  };

  const getStatusText = (status) => {
    if (!status) return "UNKNOWN";
    return status.toUpperCase();
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const orderId = order._id || order.id || "";
    const customerName = `${order.address?.firstName || ""} ${
      order.address?.lastName || ""
    }`.toLowerCase();
    const status = (order.paymentStatus || order.status || "").toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      orderId.toLowerCase().includes(searchLower) ||
      customerName.includes(searchLower);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" &&
        (status.includes("paid") || status.includes("completed"))) ||
      (statusFilter === "pending" && status.includes("pending")) ||
      (statusFilter === "failed" &&
        (status.includes("failed") || status.includes("cancelled")));

    return matchesSearch && matchesStatus;
  });

  const stats = getOrderStats();

  const OrderModal = ({ order, onClose }) => {
    if (!order) return null;

    const orderId = order._id || order.id || "N/A";
    const paymentStatus = order.paymentStatus || order.status || "pending";
    const amount = order.amount || order.totalAmount || 0;
    const createdAt = order.createdAt || order.date || new Date().toISOString();
    const items = order.items || [];
    const address = order.address || {};
    const user = order.userId || {};
    const razorpay = order.razorpay || {};

    const statusConfig = getStatusConfig(paymentStatus);
    const StatusIcon = statusConfig.icon;

    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Order Details
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-mono mt-1 truncate">
                ID: {orderId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            </button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Order Status & Amount Card */}
            <div className="bg-gray-50 border border-gray-200 p-4 sm:p-6 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">
                    Order Status
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full ${statusConfig.bg}`}
                  >
                    <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
                    <span
                      className={`text-xs sm:text-sm font-semibold ${statusConfig.text}`}
                    >
                      {getStatusText(paymentStatus)}
                    </span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">
                    Total Amount
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {formatPrice(amount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  Placed on {formatDate(createdAt)} at {formatTime(createdAt)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-700" />
                Order Items
                <span className="ml-auto text-xs sm:text-sm bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full font-semibold">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </span>
              </h3>
              {items.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {items.map((item, idx) => {
                    const product = item.productId || {};
                    const productName = product.name || "Unnamed Product";
                    const productImage = product.images
                      ? `https://api.houseofresha.com${product.images}`
                      : null;
                    const itemPrice = item.price || 0;
                    const itemQuantity = item.quantity || 1;
                    const itemSize = item.size || "One Size";

                    return (
                      <div
                        key={idx}
                        className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-lg overflow-hidden border border-gray-200">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" dy=".3em" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 truncate">
                            {productName}
                          </h4>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                            <span className="text-xs bg-white px-2 sm:px-3 py-1 rounded-full border border-gray-300 font-medium">
                              Size: {itemSize}
                            </span>
                            <span className="text-xs bg-white px-2 sm:px-3 py-1 rounded-full border border-gray-300 font-medium">
                              Qty: {itemQuantity}
                            </span>
                          </div>
                          <p className="text-base sm:text-lg font-bold text-gray-900">
                            {formatPrice(itemPrice * itemQuantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    No items in this order
                  </p>
                </div>
              )}
            </div>

            {/* Shipping Address */}
            {address && Object.keys(address).length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-700" />
                  Shipping Address
                </h3>
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
                  <p className="font-bold text-base sm:text-lg text-gray-900 mb-3">
                    {address.firstName || ""} {address.lastName || ""}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {address.addressLine1}
                    {address.addressLine2 && (
                      <>
                        <br />
                        {address.addressLine2}
                      </>
                    )}
                    <br />
                    {address.city || ""}, {address.state || ""} -{" "}
                    {address.postCode || ""}
                    <br />
                    {address.country || ""}
                  </p>
                  {address.phone && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-sm sm:text-base text-gray-900">
                        {address.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customer Info */}
            {user.email && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-700" />
                  Customer Information
                </h3>
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200 space-y-2">
                  <p className="font-bold text-base sm:text-lg text-gray-900">
                    {user.firstName || ""} {user.lastName || ""}
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                  {user.mobile && (
                    <p className="text-sm sm:text-base text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {user.mobile}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Payment Details */}
            {razorpay.paymentId && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-700" />
                  Payment Details
                </h3>
                <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200 font-mono text-xs sm:text-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-gray-600 font-semibold">
                      Payment ID:
                    </span>
                    <span className="text-gray-900 font-bold break-all">
                      {razorpay.paymentId}
                    </span>
                  </div>
                  {razorpay.orderId && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 pt-3 border-t border-gray-200">
                      <span className="text-gray-600 font-semibold">
                        Order ID:
                      </span>
                      <span className="text-gray-900 font-bold break-all">
                        {razorpay.orderId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-base sm:text-lg font-semibold text-gray-700">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full">
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                Error loading orders
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                {error}
              </p>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            No orders found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Order history will appear here
          </p>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              {/* Left: Title + Icon */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Manage Orders
                  </h1>
                  <p className="text-sm text-gray-600">
                    View and manage customer orders
                  </p>
                </div>
              </div>

              {/* Right: Refresh Button */}
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Monitor and manage your orders effectively
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    Total Orders
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    Paid Orders
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stats.paid}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    Pending Orders
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stats.pending}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock3 className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    Total Revenue
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {formatPrice(stats.totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    from {stats.total} orders
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Status Filter Tabs */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    statusFilter === "all"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setStatusFilter("paid")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    statusFilter === "paid"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Paid ({stats.paid})
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    statusFilter === "pending"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setStatusFilter("failed")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    statusFilter === "failed"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Failed ({stats.failed})
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex-1 lg:max-w-md">
                <div className="relative">
                  {/* Search Icon */}
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  {/* Input */}
                  <input
                    type="text"
                    placeholder="Search orders by ID, name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 outline-none text-sm"
                  />

                  {/* Clear (X) Button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                   text-gray-400 hover:text-gray-600 transition"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={() => exportOrdersToCSV(filteredOrders)}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
              >
                Export CSV
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {filteredOrders.length > 0
                  ? "1-" + Math.min(filteredOrders.length, 10)
                  : "0"}
              </span>{" "}
              of <span className="font-semibold">{filteredOrders.length}</span>{" "}
              orders
              {searchQuery && (
                <span>
                  {" "}
                  matching "
                  <span className="font-semibold text-gray-900">
                    {searchQuery}
                  </span>
                  "
                </span>
              )}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200 hidden lg:grid lg:grid-cols-12 gap-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <div className="col-span-3">Order</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No orders found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                filteredOrders.slice(0, 10).map((order) => {
                  const orderId = order._id || order.id || "N/A";
                  const paymentStatus =
                    order.paymentStatus || order.status || "pending";
                  const amount = order.amount || order.totalAmount || 0;
                  const createdAt =
                    order.createdAt || order.date || new Date().toISOString();
                  const address = order.address || {};
                  const customerName =
                    `${address.firstName || ""} ${
                      address.lastName || ""
                    }`.trim() || "N/A";
                  const customerEmail =
                    order.userId?.email || address.email || "N/A";

                  const statusConfig = getStatusConfig(paymentStatus);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={orderId}
                      className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors lg:grid lg:grid-cols-12 gap-4 items-center"
                    >
                      {/* Order Info - Mobile & Desktop */}
                      <div className="col-span-3 mb-3 lg:mb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-700 font-bold text-sm">
                              {customerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {customerName}
                            </p>
                            <p className="text-xs text-gray-500 font-mono truncate">
                              ID: {orderId.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Customer Info - Desktop Only */}
                      <div className="col-span-3 hidden lg:block">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{customerEmail}</span>
                        </div>
                        {address.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{address.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Date - Mobile & Desktop */}
                      <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600 mb-3 lg:mb-0">
                        <Clock className="w-4 h-4 text-gray-400 lg:hidden" />
                        <span className="text-xs lg:text-sm">
                          {formatDate(createdAt)}
                        </span>
                      </div>

                      {/* Status - Mobile & Desktop */}
                      <div className="col-span-2 mb-3 lg:mb-0">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bg}`}
                        >
                          <StatusIcon
                            className={`w-3.5 h-3.5 ${statusConfig.text}`}
                          />
                          <span
                            className={`text-xs font-semibold ${statusConfig.text}`}
                          >
                            {getStatusText(paymentStatus)}
                          </span>
                        </div>
                      </div>

                      {/* Actions - Mobile & Desktop */}
                      <div className="col-span-2 flex items-center justify-between lg:justify-end gap-3">
                        <div className="lg:hidden">
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(amount)}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
