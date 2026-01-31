import React, { useState, useEffect } from "react";
import {
  Users,
  RefreshCw,
  Search,
  Mail,
  Phone,
  AlertCircle,
  Eye,
  X,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BarChart3,
  Package,
  CreditCard,
  MapPin,
  Calendar,
  IndianRupee,
  Filter,
  Shield,
  Tag,
  Plus,
} from "lucide-react";

const StatsCard = ({ icon: Icon, label, value, color, isLoading }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-800 mt-1">
          {isLoading ? "..." : value}
        </p>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const customersPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("https://api.houseofresha.com/orders");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Process orders to extract customer data
      const processedCustomers = processOrdersToCustomers(data);
      setCustomers(processedCustomers);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.message || "Failed to load customer data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const processOrdersToCustomers = (ordersData) => {
    const ordersArray = Array.isArray(ordersData)
      ? ordersData
      : ordersData.data || ordersData.orders || ordersData.items || [];

    const customersMap = new Map();

    ordersArray.forEach((order, index) => {
      // Extract customer information
      const userId = order.userId?._id || order.userId?.id || `user-${index}`;
      const userEmail =
        order.userId?.email || order.email || `customer${index}@example.com`;
      const userName =
        order.userId?.name ||
        (order.userId?.firstName
          ? `${order.userId.firstName} ${order.userId.lastName || ""}`.trim()
          : order.userId?.username || userEmail.split("@")[0] || "Customer");

      const userPhone =
        order.userId?.mobile ||
        order.userId?.phone ||
        order.address?.phone ||
        "N/A";
      const userLocation =
        order.address?.city || order.address?.state || "Unknown";

      const orderAmount = parseFloat(order.amount || order.totalAmount || 0);
      const orderDate =
        order.createdAt || order.date || new Date().toISOString();
      const orderStatus = order.paymentStatus || order.status || "pending";

      if (customersMap.has(userId)) {
        const existingCustomer = customersMap.get(userId);
        existingCustomer.orders += 1;
        existingCustomer.totalSpent += orderAmount;

        // Update latest order
        if (new Date(orderDate) > new Date(existingCustomer.lastOrderDate)) {
          existingCustomer.lastOrderDate = orderDate;
          existingCustomer.latestOrderStatus = orderStatus;
        }

        // Track order status counts
        if (orderStatus === "paid" || orderStatus === "completed") {
          existingCustomer.completedOrders += 1;
        } else if (orderStatus === "pending") {
          existingCustomer.pendingOrders += 1;
        }

        // Add to order history
        existingCustomer.orderHistory.push({
          id: order._id || order.id || `order-${index}`,
          amount: orderAmount,
          date: orderDate,
          status: orderStatus,
          items: order.items || [],
        });
      } else {
        customersMap.set(userId, {
          id: userId,
          name: userName,
          email: userEmail,
          phone: userPhone,
          location: userLocation,
          avatarInitial: userName.charAt(0).toUpperCase(),
          orders: 1,
          totalSpent: orderAmount,
          lastOrderDate: orderDate,
          latestOrderStatus: orderStatus,
          completedOrders:
            orderStatus === "paid" || orderStatus === "completed" ? 1 : 0,
          pendingOrders: orderStatus === "pending" ? 1 : 0,
          joinDate: orderDate,
          status: "active",
          orderHistory: [
            {
              id: order._id || order.id || `order-${index}`,
              amount: orderAmount,
              date: orderDate,
              status: orderStatus,
              items: order.items || [],
            },
          ],
          address: order.address || {},
        });
      }
    });

    // Convert to array and add formatted values
    return Array.from(customersMap.values()).map((customer) => ({
      ...customer,
      formattedTotal: formatINR(customer.totalSpent),
      formattedLastOrder: formatDate(customer.lastOrderDate),
      formattedJoinDate: formatDate(customer.joinDate),
      avgOrderValue:
        customer.orders > 0 ? customer.totalSpent / customer.orders : 0,
      formattedAvgOrder: formatINR(
        customer.orders > 0 ? customer.totalSpent / customer.orders : 0,
      ),
    }));
  };

  const formatINR = (amount) => {
    const numAmount = Number(amount) || 0;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCustomers();
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  // Filter and sort customers
  const filteredCustomers = customers.filter((customer) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower) ||
      customer.location.toLowerCase().includes(searchLower)
    );
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "orders") {
      return sortOrder === "asc" ? a.orders - b.orders : b.orders - a.orders;
    } else if (sortBy === "totalSpent") {
      return sortOrder === "asc"
        ? a.totalSpent - b.totalSpent
        : b.totalSpent - a.totalSpent;
    }
    return 0;
  });

  // Calculate totals
  const totalCustomers = customers.length;
  const totalOrders = customers.reduce(
    (sum, customer) => sum + customer.orders,
    0,
  );
  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0,
  );
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Pagination
  const totalPages = Math.ceil(sortedCustomers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const endIndex = startIndex + customersPerPage;
  const currentCustomers = sortedCustomers.slice(startIndex, endIndex);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customer data...</p>
        </div>
      </div>
    );
  }

  if (error && customers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                Error loading customers
              </h3>
              <p className="text-gray-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchCustomers}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
      </div>
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
          Customer Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
          Manage and analyze your customer base
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3 sm:gap-4">
      {/* <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base"
      >
        <RefreshCw
          className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
        />
        <span className="hidden sm:inline">Refresh</span>
      </button> */}
    </div>
  </div>
</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Users}
            label="Total Customers"
            value={totalCustomers}
            color="bg-blue-500"
            isLoading={loading}
          />
          <StatsCard
            icon={Package}
            label="Total Orders"
            value={totalOrders}
            color="bg-purple-500"
            isLoading={loading}
          />
          <StatsCard
            icon={CreditCard}
            label="Total Revenue"
            value={formatINR(totalRevenue)}
            color="bg-indigo-500"
            isLoading={loading}
          />
          <StatsCard
            icon={BarChart3}
            label="Avg. Order Value"
            value={formatINR(avgOrderValue)}
            color="bg-green-500"
            isLoading={loading}
          />
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search customers by name, email, phone, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-blue-600">
              {Math.min(startIndex + 1, sortedCustomers.length)}-
              {Math.min(endIndex, sortedCustomers.length)}
            </span>{" "}
            of <span className="font-semibold">{sortedCustomers.length}</span>{" "}
            customers
            {searchTerm && (
              <span>
                {" "}
                matching "
                <span className="font-semibold text-gray-900">
                  {searchTerm}
                </span>
                "
              </span>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Customer
                      {sortBy === "name" && (
                        <span className="text-gray-400">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                    Contact Info
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden xl:table-cell">
                    Location
                  </th>
                  <th
                    className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("orders")}
                  >
                    <div className="flex items-center gap-1">
                      Orders
                      {sortBy === "orders" && (
                        <span className="text-gray-400">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("totalSpent")}
                  >
                    <div className="flex items-center gap-1">
                      <span className="hidden lg:inline">Total Spent</span>
                      <span className="lg:hidden">Spent</span>
                      {sortBy === "totalSpent" && (
                        <span className="text-gray-400">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                    Last Order
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">
                          {searchTerm
                            ? "No customers found"
                            : "No customer data available"}
                        </p>
                        {searchTerm && (
                          <button
                            onClick={clearSearch}
                            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {customer.avatarInitial}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {customer.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              <span className="hidden lg:inline">Joined: </span>
                              {customer.formattedJoinDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {customer.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 hidden xl:table-cell">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{customer.location}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 lg:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 w-fit">
                            {customer.orders}{" "}
                            <span className="hidden lg:inline">orders</span>
                          </span>
                          <div className="text-xs text-gray-500">
                            <span className="hidden lg:inline">Avg: </span>
                            {customer.formattedAvgOrder}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-green-600">
                            {customer.formattedTotal}
                          </span>
                          <div className="flex gap-1 lg:gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-green-600 bg-green-50 px-1.5 lg:px-2 py-0.5 rounded">
                              ✓ {customer.completedOrders}
                            </span>
                            {customer.pendingOrders > 0 && (
                              <span className="text-xs text-yellow-600 bg-yellow-50 px-1.5 lg:px-2 py-0.5 rounded">
                                ⏳ {customer.pendingOrders}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
                        <div className="text-sm text-gray-700">
                          {customer.formattedLastOrder}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {customer.latestOrderStatus}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs lg:text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden lg:inline">View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-4">
            {currentCustomers.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mb-4 mx-auto" />
                <p className="text-gray-500 mb-2">
                  {searchTerm
                    ? "No customers found"
                    : "No customer data available"}
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              currentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  {/* Header - Customer Info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-base">
                        {customer.avatarInitial}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-base mb-1">
                        {customer.name}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        Joined: {customer.formattedJoinDate}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{customer.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {customer.phone}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Orders */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs text-blue-600 mb-1">Orders</div>
                      <div className="text-lg font-bold text-blue-700">
                        {customer.orders}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Avg: {customer.formattedAvgOrder}
                      </div>
                    </div>

                    {/* Total Spent */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs text-green-600 mb-1">
                        Total Spent
                      </div>
                      <div className="text-lg font-bold text-green-700">
                        {customer.formattedTotal}
                      </div>
                      <div className="flex gap-1 mt-1">
                        <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                          ✓ {customer.completedOrders}
                        </span>
                        {customer.pendingOrders > 0 && (
                          <span className="text-xs text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">
                            ⏳ {customer.pendingOrders}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Last Order Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-xs text-gray-600 mb-1">Last Order</div>
                    <div className="text-sm text-gray-900 font-medium">
                      {customer.formattedLastOrder}
                    </div>
                    <div className="text-xs text-gray-500 capitalize mt-1">
                      Status: {customer.latestOrderStatus}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleViewCustomer(customer)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Details
                  </button>
                </div>
              ))
            )}
          </div>
          {/* Pagination */}
          {sortedCustomers.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* First Page */}
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  {/* Previous Page */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {(() => {
                      const pages = [];
                      const maxVisible = 5;
                      let startPage = Math.max(
                        1,
                        currentPage - Math.floor(maxVisible / 2),
                      );
                      let endPage = Math.min(
                        totalPages,
                        startPage + maxVisible - 1,
                      );

                      if (endPage - startPage + 1 < maxVisible) {
                        startPage = Math.max(1, endPage - maxVisible + 1);
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                              currentPage === i
                                ? "bg-blue-600 text-white"
                                : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {i}
                          </button>,
                        );
                      }
                      return pages;
                    })()}
                  </div>

                  {/* Next Page */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  {customersPerPage} customers per page
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer View Modal */}
      {viewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeViewModal}
          ></div>

          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 flex-shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center border-2 sm:border-4 border-white/30">
                      <span className="text-white text-lg sm:text-2xl font-bold">
                        {selectedCustomer.avatarInitial}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                      {selectedCustomer.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                        Customer
                      </span>
                      <span className="text-white/80 text-xs sm:text-sm whitespace-nowrap">
                        {selectedCustomer.orders} Orders
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeViewModal}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors group"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Customer Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-blue-100">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                      Customer Information
                    </h3>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-500">
                          Email Address
                        </p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base break-all">
                          {selectedCustomer.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-500">
                          Phone Number
                        </p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-gray-500">
                          Location
                        </p>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                          {selectedCustomer.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Statistics Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-purple-100">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                      Order Statistics
                    </h3>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center gap-3">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Total Orders
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          {selectedCustomer.orders}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-gray-500">
                          Completed
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600">
                          {selectedCustomer.completedOrders}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center gap-3">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Total Spent
                          </p>
                          <p className="text-base sm:text-xl font-bold text-gray-900">
                            {selectedCustomer.formattedTotal}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs sm:text-sm text-gray-500">
                            Avg. Order
                          </p>
                          <p className="text-base sm:text-xl font-bold text-purple-600">
                            {selectedCustomer.formattedAvgOrder}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        Latest Order
                      </p>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 text-xs sm:text-sm">
                          {selectedCustomer.formattedLastOrder}
                        </span>
                        <span
                          className={`px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full capitalize ${
                            selectedCustomer.latestOrderStatus === "paid" ||
                            selectedCustomer.latestOrderStatus === "completed"
                              ? "bg-green-100 text-green-800"
                              : selectedCustomer.latestOrderStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedCustomer.latestOrderStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History Section */}
              <div className="mt-4 sm:mt-6 bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl p-4 sm:p-5 border border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                    Recent Orders ({selectedCustomer.orderHistory.length})
                  </h3>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {selectedCustomer.orderHistory.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            Order #{order.id.substring(0, 8)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(order.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-10 sm:pl-0">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {formatINR(order.amount)}
                        </span>
                        <span
                          className={`px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full capitalize flex-shrink-0 ${
                            order.status === "paid" ||
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}

                  {selectedCustomer.orderHistory.length > 5 && (
                    <div className="text-center pt-2 sm:pt-3 border-t border-gray-200">
                      <p className="text-xs sm:text-sm text-gray-500">
                        +{selectedCustomer.orderHistory.length - 5} more orders
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4 flex-shrink-0">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                  Customer since {selectedCustomer.formattedJoinDate}
                </div>
                <button
                  onClick={closeViewModal}
                  className="w-full sm:w-auto px-5 py-2 sm:py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
