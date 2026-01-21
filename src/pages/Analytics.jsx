import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_BASE_URL = "https://api.houseofresha.com";

// Page name mapping configuration
const PAGE_NAME_MAPPING = {
  // Exact path matches
  "/": "Home Page",
  "/home": "Home Page",
  "/blogs": "Blogs Page",
  "/blog": "Blog Details",
  "/products": "Products Page",
  "/product": "Product Details",
  "/services": "Services Page",
  "/about": "About Us",
  "/contact": "Contact Us",
  "/login": "Login Page",
  "/register": "Register Page",
  "/dashboard": "User Dashboard",
  "/profile": "User Profile",
  "/cart": "Shopping Cart",
  "/checkout": "Checkout",
  "/wishlist": "Wishlist",
  "/account": "My Account",
  "/settings": "Settings",
  "/faq": "FAQ",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",

  // Dynamic routes patterns (will be matched using regex)
  "/blog/": "Blog Post", // For /blog/*
  "/product/": "Product", // For /product/*
  "/category/": "Category", // For /category/*
  "/user/": "User Profile", // For /user/*
  "/admin/": "Admin Panel", // For /admin/*
  "/api/": "API Endpoint", // For /api/*
};

// Function to get readable page name from URL
const getPageName = (url) => {
  if (!url) return "Unknown Page";

  // Clean the URL (remove query params and fragments)
  const cleanUrl = url.split("?")[0].split("#")[0];

  // First, try exact match
  if (PAGE_NAME_MAPPING[cleanUrl]) {
    return PAGE_NAME_MAPPING[cleanUrl];
  }

  // Then, try pattern matching for dynamic routes
  for (const [pattern, name] of Object.entries(PAGE_NAME_MAPPING)) {
    if (
      pattern.endsWith("/") &&
      cleanUrl.startsWith(pattern.slice(0, -1) + "/")
    ) {
      return name;
    }
  }

  // For nested paths, extract the first part
  const parts = cleanUrl.split("/").filter((part) => part);
  if (parts.length > 0) {
    const basePath = `/${parts[0]}`;
    if (PAGE_NAME_MAPPING[basePath]) {
      return PAGE_NAME_MAPPING[basePath];
    }

    // Capitalize the first part as fallback
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + " Page";
  }

  // Return the original URL if no match found
  return cleanUrl || "Unknown Page";
};

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [pageStats, setPageStats] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  const [filters, setFilters] = useState({
    page: "",
    userId: "",
    startDate: "",
    endDate: "",
    pageNo: 1,
    limit: 20,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    pageNo: 1,
    limit: 20,
  });

  // Get unique pages for dropdown
  const getUniquePages = () => {
    const pagesSet = new Set();
    const pages = [];

    // Add all pages from pageStats
    pageStats.forEach((stat) => {
      const pageName = getPageName(stat.page);
      if (stat.page && !pagesSet.has(pageName)) {
        pagesSet.add(pageName);
        pages.push({
          value: stat.page,
          label: pageName,
        });
      }
    });

    // Add all pages from analyticsData
    analyticsData.forEach((item) => {
      const pageName = getPageName(item.page);
      if (item.page && !pagesSet.has(pageName)) {
        pagesSet.add(pageName);
        pages.push({
          value: item.page,
          label: pageName,
        });
      }
    });

    // Sort alphabetically by label
    return pages.sort((a, b) => a.label.localeCompare(b.label));
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/summary`);
      const result = await response.json();
      if (result.success) {
        setSummary(result.data);
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Failed to load summary data");
    }
  };

  const fetchPageStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/pages`);
      const result = await response.json();
      if (Array.isArray(result)) {
        // Transform page stats to include display names
        const transformedStats = result.map((stat) => ({
          ...stat,
          pageName: getPageName(stat.page),
        }));
        setPageStats(transformedStats);
      } else {
        setPageStats([]);
      }
    } catch (err) {
      console.error("Error fetching page stats:", err);
      setPageStats([]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/analytics?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        // Transform analytics data to include display names
        const transformedData = Array.isArray(result.data)
          ? result.data.map((item) => ({
              ...item,
              pageName: getPageName(item.page),
            }))
          : [];
        setAnalyticsData(transformedData);
        setPagination({
          total: result.total || 0,
          pageNo: result.pageNo || 1,
          limit: result.limit || 20,
        });
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setAnalyticsData([]);
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoadingUserDetails(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics?userId=${userId}&limit=100`,
      );
      const result = await response.json();
      if (result.success) {
        // Transform user details to include display names
        const transformedDetails = Array.isArray(result.data)
          ? result.data.map((item) => ({
              ...item,
              pageName: getPageName(item.page),
            }))
          : [];
        setUserDetails(transformedDetails);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setUserDetails([]);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const handleViewUser = (userId) => {
    setSelectedUser(userId);
    setShowModal(true);
    fetchUserDetails(userId);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchSummary(), fetchPageStats(), fetchAnalytics()]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchAnalytics();
    }
  }, [
    filters.page,
    filters.userId,
    filters.startDate,
    filters.endDate,
    filters.pageNo,
    filters.limit,
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      pageNo: name !== "pageNo" ? 1 : value,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, pageNo: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      page: "",
      userId: "",
      startDate: "",
      endDate: "",
      pageNo: 1,
      limit: 20,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="mt-6 text-gray-700 font-semibold text-lg">
            Loading Analytics Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B"];
  const userTypeData = summary
    ? [
        { name: "Logged In", value: summary.loggedInUsers },
        { name: "Anonymous", value: summary.anonymousUsers },
      ]
    : [];

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const uniquePages = getUniquePages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track your website performance and user engagement
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Total Views */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Total Views
              </p>
              <p className="text-4xl font-bold mb-2">
                {summary.totalViews.toLocaleString()}
              </p>
              <div className="flex items-center text-sm">
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-lg">
                  Today: {summary.todayViews}
                </span>
              </div>
            </div>

            {/* Card 2: Avg Time Spent */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">
                Avg Time Spent
              </p>
              <p className="text-4xl font-bold mb-2">{summary.avgTimeSpent}s</p>
              <p className="text-sm text-green-100">Per session</p>
            </div>

            {/* Card 3: Logged In Users */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-orange-100 text-sm font-medium mb-1">
                Logged In Users
              </p>
              <p className="text-4xl font-bold mb-2">
                {summary.loggedInUsers.toLocaleString()}
              </p>
              <p className="text-sm text-orange-100">
                Anonymous: {summary.anonymousUsers}
              </p>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
              Top Pages Performance
            </h2>
            {pageStats && pageStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={pageStats.slice(0, 10)}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#8B5CF6"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="pageName"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#6B7280" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value, name, props) => {
                      if (name === "totalViews") {
                        return [value, "Total Views"];
                      }
                      return value;
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return `${label} (${payload[0].payload.page})`;
                      }
                      return label;
                    }}
                  />
                  <Bar
                    dataKey="totalViews"
                    fill="url(#colorViews)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-400">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="font-medium">No page statistics available</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full mr-3"></div>
              User Distribution
            </h2>
            {userTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent, value }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-400">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                  <p className="font-medium">No user distribution data</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Statistics Table */}
        {pageStats && pageStats.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden backdrop-blur-lg bg-opacity-90">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white">
                Detailed Page Statistics
              </h2>
              <p className="text-blue-100 mt-1">
                Comprehensive overview of all pages
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Page Name & URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Views
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Avg Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Unique Sessions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {pageStats.map((stat, index) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {stat.pageName}
                          </p>
                          <p className="text-xs text-gray-500 font-mono truncate max-w-xs">
                            {stat.page}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {stat.totalViews}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {stat.avgTimeSpent ? stat.avgTimeSpent.toFixed(1) : 0}
                          s
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {stat.uniqueSessionsCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 backdrop-blur-lg bg-opacity-90">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            Advanced Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Page Select Dropdown */}
            <div className="relative">
              <select
                name="page"
                value={filters.page}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
              >
                <option value="">All Pages</option>
                {uniquePages.map((page, index) => (
                  <option key={index} value={page.value}>
                    {page.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            <input
              type="text"
              name="userId"
              placeholder="User ID"
              value={filters.userId}
              onChange={handleFilterChange}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <select
              name="limit"
              value={filters.limit}
              onChange={handleFilterChange}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Detailed Analytics Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden backdrop-blur-lg bg-opacity-90">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white">User Activity Log</h2>
            <p className="text-indigo-100 mt-1">
              {pagination.total} total records found
            </p>
          </div>
          <div className="overflow-x-auto">
            {analyticsData && analyticsData.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Session
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {analyticsData.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-150"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {item.pageName}
                          </p>
                          <p className="text-xs text-gray-500 font-mono truncate max-w-xs">
                            {item.page}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.userId ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.userId
                              ? `${item.userId.substring(0, 8)}...`
                              : "Anonymous"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Anonymous
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        {item.sessionId
                          ? `${item.sessionId.substring(0, 10)}...`
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.timeSpent}s
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.ip}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString()}{" "}
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4">
                        {item.userId && (
                          <button
                            onClick={() => handleViewUser(item.userId)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <svg
                    className="w-20 h-20 mx-auto mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-xl font-semibold mb-2">
                    No analytics data available
                  </p>
                  <p className="text-sm">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {analyticsData && analyticsData.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700 font-medium">
                Page{" "}
                <span className="font-bold text-indigo-600">
                  {pagination.pageNo}
                </span>{" "}
                of{" "}
                <span className="font-bold text-indigo-600">{totalPages}</span>
                <span className="text-gray-500 ml-2">
                  ({pagination.total} total records)
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.pageNo - 1))
                  }
                  disabled={pagination.pageNo === 1}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(totalPages, pagination.pageNo + 1),
                    )
                  }
                  disabled={pagination.pageNo === totalPages}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for User Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  User Activity Details
                </h3>
                <p className="text-blue-100 mt-1">
                  User ID: {selectedUser?.substring(0, 16)}...
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loadingUserDetails ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                      Loading user activities...
                    </p>
                  </div>
                </div>
              ) : userDetails.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <p className="text-sm text-blue-600 font-semibold mb-1">
                        Total Activities
                      </p>
                      <p className="text-3xl font-bold text-blue-900">
                        {userDetails.length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                      <p className="text-sm text-green-600 font-semibold mb-1">
                        Total Time
                      </p>
                      <p className="text-3xl font-bold text-green-900">
                        {userDetails.reduce(
                          (acc, item) => acc + item.timeSpent,
                          0,
                        )}
                        s
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                      <p className="text-sm text-purple-600 font-semibold mb-1">
                        Unique Pages
                      </p>
                      <p className="text-3xl font-bold text-purple-900">
                        {new Set(userDetails.map((item) => item.pageName)).size}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">
                      Activity Timeline
                    </h4>
                    {userDetails.map((activity, index) => (
                      <div
                        key={activity._id}
                        className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mr-3">
                                {index + 1}
                              </span>
                              <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {activity.pageName}
                                </p>
                                <p className="text-xs text-gray-500 font-mono truncate">
                                  {activity.page}
                                </p>
                              </div>
                            </div>
                            <div className="ml-11 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Session ID
                                </p>
                                <p className="text-sm font-mono text-gray-700">
                                  {activity.sessionId
                                    ? `${activity.sessionId.substring(0, 20)}...`
                                    : "N/A"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Time Spent
                                </p>
                                <p className="text-sm font-semibold text-green-600">
                                  {activity.timeSpent} seconds
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  IP Address
                                </p>
                                <p className="text-sm text-gray-700">
                                  {activity.ip}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Date & Time
                                </p>
                                <p className="text-sm text-gray-700">
                                  {new Date(
                                    activity.createdAt,
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="font-medium">
                      No activities found for this user
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;