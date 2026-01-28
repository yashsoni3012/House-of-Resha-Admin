import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  IndianRupee,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// Use the environment variable for API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.houseofresha.com";

const Dashboard = () => {
  // Fetch real products data
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["dashboard-products"],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clothing`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();

        // Handle different response structures
        if (Array.isArray(data)) return data;
        if (data.data && Array.isArray(data.data)) return data.data;
        if (data.success && Array.isArray(data.data)) return data.data;
        return [];
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  // Fetch real orders data
  const {
    data: orders = [],
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["dashboard-orders"],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }
        const data = await response.json();

        // Handle different response structures
        if (Array.isArray(data)) return data;
        if (data.data && Array.isArray(data.data)) return data.data;
        if (data.orders && Array.isArray(data.orders)) return data.orders;
        if (data.success && Array.isArray(data.data)) return data.data;
        return [];
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  // Fetch real users data from the /data endpoint
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["dashboard-users"],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/data`);
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }
        const data = await response.json();

        // Handle the response structure from the /data endpoint
        if (data.success && Array.isArray(data.data)) {
          return data.data; // Return the users array
        }
        if (Array.isArray(data)) return data;
        if (data.data && Array.isArray(data.data)) return data.data;
        return [];
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  // Calculate stats from real data
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users.length; // Get total users count from the API

  // Calculate total revenue from real orders
  const totalRevenue = React.useMemo(() => {
    return orders.reduce((sum, order) => {
      const orderAmount = parseFloat(order.amount) || 0;
      return sum + orderAmount;
    }, 0);
  }, [orders]);

  // Calculate total customers (unique users from orders)
  const totalCustomers = React.useMemo(() => {
    const uniqueCustomerIds = new Set();
    orders.forEach((order) => {
      if (order.userId?._id) {
        uniqueCustomerIds.add(order.userId._id);
      }
    });
    return uniqueCustomerIds.size;
  }, [orders]);

  // Calculate today's revenue
  const todayRevenue = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return orders.reduce((sum, order) => {
      const orderDate = new Date(order.createdAt || order.date);
      orderDate.setHours(0, 0, 0, 0);

      if (orderDate.getTime() === today.getTime()) {
        const orderAmount = parseFloat(order.amount) || 0;
        return sum + orderAmount;
      }
      return sum;
    }, 0);
  }, [orders]);

  // Calculate today's orders
  const todayOrders = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.date);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length;
  }, [orders]);

  // Calculate percentage change for users (dummy data for now)
  const usersChange = React.useMemo(() => {
    if (users.length === 0) return "+0%";
    const yesterdayUsers = Math.floor(totalUsers * 0.95); // Simulated yesterday's users
    const change = ((totalUsers - yesterdayUsers) / yesterdayUsers) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  }, [totalUsers, users]);

  // Calculate percentage change (dummy data for now)
  const revenueChange = React.useMemo(() => {
    if (orders.length === 0) return "+0%";
    const yesterdayRevenue = totalRevenue * 0.85; // Simulated yesterday's revenue
    const change = ((totalRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  }, [totalRevenue, orders]);

  const ordersChange = React.useMemo(() => {
    if (orders.length === 0) return "+0%";
    const yesterdayOrders = Math.floor(totalOrders * 0.8); // Simulated yesterday's orders
    const change = ((totalOrders - yesterdayOrders) / yesterdayOrders) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  }, [totalOrders, orders]);

  // Get order status counts
  const orderStatusCounts = React.useMemo(() => {
    const counts = {
      paid: 0,
      pending: 0,
      failed: 0,
      total: 0,
    };

    orders.forEach((order) => {
      const status = (order.paymentStatus || order.status || "").toLowerCase();
      if (status.includes("paid") || status.includes("completed")) {
        counts.paid++;
      } else if (status.includes("pending")) {
        counts.pending++;
      } else if (status.includes("failed") || status.includes("cancelled")) {
        counts.failed++;
      }
      counts.total++;
    });

    return counts;
  }, [orders]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with K/M suffix
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: revenueChange,
      trend: revenueChange.startsWith("+") ? "up" : "down",
      icon: IndianRupee,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      subValue: `₹${(todayRevenue / 100).toLocaleString()} today`,
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: ordersChange,
      trend: ordersChange.startsWith("+") ? "up" : "down",
      icon: ShoppingCart,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      subValue: `${todayOrders} today`,
      details: `${orderStatusCounts.paid} paid • ${orderStatusCounts.pending} pending`,
    },
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      change: "+15.3%",
      trend: "up",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Users",
      value: isLoadingUsers ? "Loading..." : totalUsers.toLocaleString(),
      change: isLoadingUsers ? "..." : usersChange,
      trend: usersChange.startsWith("+") ? "up" : "down",
      icon: Package,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      subValue: `${users.filter((user) => user.role === "admin").length} admins`,
    },
  ];

  // Get recent products for activity section
  const recentProducts = React.useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.updatedAt || 0) -
          new Date(a.createdAt || a.updatedAt || 0),
      )
      .slice(0, 4);
  }, [products]);

  // Get recent orders for activity section
  const recentOrders = React.useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date || 0) -
          new Date(a.createdAt || a.date || 0),
      )
      .slice(0, 5);
  }, [orders]);

  // Get recent users for activity section
  const recentUsers = React.useMemo(() => {
    return [...users]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.lastActive || 0) -
          new Date(a.createdAt || a.lastActive || 0),
      )
      .slice(0, 5);
  }, [users]);

  const isLoading = isLoadingProducts || isLoadingOrders || isLoadingUsers;
  const hasError = productsError || ordersError || usersError;

  return (
    <div className="space-y-4 ">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* LEFT: Welcome Text */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
              Welcome Back, Admin!
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm lg:text-base">
              {isLoading
                ? "Loading store data..."
                : "Here you can see today what's happening in your store"}
            </p>
          </div>

          {/* RIGHT: Date + Refresh */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-white/10 backdrop-blur-md
                border border-white/20
                shadow-sm"
            >
              <Calendar size={16} className="text-white/80" />
              <span className="text-sm font-medium text-white/90 tracking-wide">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* <button
              onClick={() => {
                refetchProducts();
                refetchOrders();
                refetchUsers();
              }}
              disabled={isLoading}
              className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Data"
            >
              <RefreshCw
                size={18}
                className={isLoading ? "animate-spin" : ""}
              />
            </button> */}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {hasError && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-3 sm:p-4">
          <p className="text-red-700 text-xs sm:text-sm flex items-start sm:items-center gap-2">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Error Loading Data:</strong>{" "}
              {productsError?.message ||
                ordersError?.message ||
                usersError?.message}
            </span>
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUp : ArrowDown;
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-lg sm:rounded-md p-4 sm:p-5 lg:p-4 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div
                  className={`${stat.iconBg} p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className={stat.iconColor} size={20} />
                </div>
                {/* <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                    stat.trend === "up"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <TrendIcon size={10} sm:size={12} />
                  <span className="text-xs">{stat.change}</span>
                </div> */}
              </div>
              <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                {stat.title}
              </p>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
                {stat.value}
              </h3>
              {stat.subValue && (
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  {stat.subValue}
                </p>
              )}
              {stat.details && (
                <p className="text-xs text-gray-400">{stat.details}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-md shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="text-purple-600 flex-shrink-0" size={20} />
              <span className="truncate">Recent Products</span>
            </h3>
            <Link
              to="/fashion"
              className="text-purple-600 hover:text-purple-700 font-medium text-xs sm:text-sm flex items-center gap-1 flex-shrink-0"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
              <ArrowUp size={14} className="rotate-90" />
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <RefreshCw
                className="animate-spin text-purple-600"
                size={20}
                sm:size={24}
              />
              <span className="ml-3 text-gray-600 text-sm">
                Loading products...
              </span>
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <Package
                size={28}
                sm:size={32}
                className="mx-auto text-gray-400 mb-3"
              />
              <p className="text-gray-500 text-sm">No products found</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentProducts.map((product, index) => (
                <div
                  key={product._id || index}
                  className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition-all border border-gray-200 hover:border-purple-200 group"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm group-hover:scale-110 transition-transform flex-shrink-0">
                      {product.name?.charAt(0).toUpperCase() || "P"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                        {product.name || "Unnamed Product"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {product.categoryId?.name || "No Category"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-xs sm:text-sm font-bold text-purple-600 whitespace-nowrap">
                      ₹{parseFloat(product.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-md shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingCart
                className="text-green-600 flex-shrink-0"
                size={20}
              />
              <span className="truncate">Recent Orders</span>
            </h3>
            <Link
              to="/orders"
              className="text-green-600 hover:text-green-700 font-medium text-xs sm:text-sm flex items-center gap-1 flex-shrink-0"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
              <ArrowUp size={14} className="rotate-90" />
            </Link>
          </div>

          {isLoadingOrders ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <RefreshCw
                className="animate-spin text-green-600"
                size={20}
                sm:size={24}
              />
              <span className="ml-3 text-gray-600 text-sm">
                Loading orders...
              </span>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <ShoppingCart
                size={28}
                sm:size={32}
                className="mx-auto text-gray-400 mb-3"
              />
              <p className="text-gray-500 text-sm">No orders yet</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                New orders will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentOrders.map((order, index) => {
                const status = (
                  order.paymentStatus ||
                  order.status ||
                  ""
                ).toLowerCase();
                const statusColor = status.includes("paid")
                  ? "bg-green-100 text-green-800"
                  : status.includes("pending")
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800";

                return (
                  <div
                    key={order._id || index}
                    className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-all border border-gray-200 hover:border-green-200 group"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm group-hover:scale-110 transition-transform flex-shrink-0">
                        {order.address?.firstName?.charAt(0) || "C"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                          {order.address?.firstName || "Customer"}{" "}
                          {order.address?.lastName || ""}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${statusColor}`}
                          >
                            {status.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {order.items?.length || 0} items
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="text-xs sm:text-sm font-bold text-green-600 whitespace-nowrap">
                        ₹{parseFloat(order.amount || 0).toLocaleString()}
                      </span>
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "Recent"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
