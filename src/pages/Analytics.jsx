import React, { useState, useEffect, useCallback, useRef } from "react";
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
import {
  Activity,
  Users,
  Clock,
  Eye,
  TrendingUp,
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  User,
  Mail,
  Calendar,
  Loader,
} from "lucide-react";

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [pageAnalytics, setPageAnalytics] = useState([]);
  const [detailedLogs, setDetailedLogs] = useState([]);
  const [userData, setUserData] = useState({});
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [totalLogsCount, setTotalLogsCount] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const PAGE_SIZE = 20;
  const BASE_URL = "https://api.houseofresha.com/analytics";
  const USER_API_URL = "https://api.houseofresha.com/data";

  const searchTimeoutRef = useRef(null);
  const hasFetchedAllLogsRef = useRef(false);

  const getPageFriendlyName = useCallback((url) => {
    if (!url || typeof url !== "string") {
      return "Unknown Page";
    }

    const pageNames = {
      "/": "Home Page",
      "/home": "Home Page",
      "/app/home": "App Home",
      "/app": "App",
      "/blogs": "Blogs Page",
      "/blog": "Blog Page",
      "/about": "About Us",
      "/contact": "Contact Page",
      "/products": "Products",
      "/services": "Services",
      "/pricing": "Pricing",
      "/login": "Login Page",
      "/signup": "Sign Up",
      "/register": "Registration",
      "/dashboard": "Dashboard",
      "/profile": "User Profile",
      "/settings": "Settings",
      "/cart": "Shopping Cart",
      "/checkout": "Checkout",
      "/orders": "Orders",
      "/account": "My Account",
      "/search": "Search",
      "/help": "Help Center",
      "/faq": "FAQ",
      "/support": "Support",
      "/terms": "Terms & Conditions",
      "/privacy": "Privacy Policy",
    };

    if (pageNames[url]) {
      return pageNames[url];
    }

    if (url.includes("/app/detailpage/")) return "Detail Page";
    if (url.includes("/product/")) return "Product Details";
    if (url.includes("/blog/")) return "Blog Post";
    if (url.includes("/user/")) return "User Profile";
    if (url.includes("/category/")) return "Category Page";

    return (
      url
        .split("/")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" > ") || "Unknown Page"
    );
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [currentPage]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(USER_API_URL);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const result = await response.json();
      const users = result.data || result;

      const userMap = {};

      users.forEach((user) => {
        const id = user._id || user.id || user.userId;
        const firstName = user.firstName?.trim();
        const lastName = user.lastName?.trim();
        const email = user.email?.trim();

        const fullName =
          firstName && lastName
            ? `${firstName} ${lastName}`
            : firstName || lastName || null;

        if (id) {
          userMap[id] = {
            name: fullName || "Anonymous User",
            email: email || null,
            firstName: firstName || null,
            lastName: lastName || null,
            rawData: user,
          };
        }
      });

      setUserData(userMap);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  const fetchAllLogs = async () => {
    try {
      setIsSearching(true);
      const response = await fetch(`${BASE_URL}/?limit=1000`);
      if (!response.ok) throw new Error("Failed to fetch all logs");

      const logsData = await response.json();
      if (Array.isArray(logsData.data)) {
        setAllLogs(logsData.data);
        setTotalLogsCount(logsData.total || logsData.data.length);
        hasFetchedAllLogsRef.current = true;
      }
    } catch (err) {
      console.error("Error fetching all logs:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    hasFetchedAllLogsRef.current = false;

    try {
      // Build URL with page filter
      let logsUrl = `${BASE_URL}/?pageNo=${currentPage}&limit=${PAGE_SIZE}`;
      if (selectedPage && selectedPage !== "all") {
        logsUrl += `&page=${encodeURIComponent(selectedPage)}`;
      }

      const [summaryRes, pageAnalyticsRes, logsRes] = await Promise.all([
        fetch(`${BASE_URL}/summary`),
        fetch(`${BASE_URL}/`),
        fetch(logsUrl),
      ]);

      if (!summaryRes.ok || !pageAnalyticsRes.ok || !logsRes.ok) {
        throw new Error("Failed to fetch data from one or more endpoints");
      }

      const summaryData = await summaryRes.json();
      const pageAnalyticsData = await pageAnalyticsRes.json();
      const logsData = await logsRes.json();

      setSummary(summaryData.data);
      setPageAnalytics(
        Array.isArray(pageAnalyticsData.data) ? pageAnalyticsData.data : [],
      );
      setDetailedLogs(Array.isArray(logsData.data) ? logsData.data : []);

      if (logsData.total) {
        setTotalPages(Math.ceil(logsData.total / PAGE_SIZE));
        setTotalLogsCount(logsData.total);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageFilterChange = (e) => {
    const pageValue = e.target.value;
    setSelectedPage(pageValue);
    setCurrentPage(1);
    setShowSearchResults(false);
    setSearchResults([]);
    
    // Fetch data with the new filter
    fetchFilteredData(pageValue);
  };

  const fetchFilteredData = async (pageFilter) => {
    try {
      setLoading(true);
      
      let url = `${BASE_URL}/?pageNo=1&limit=${PAGE_SIZE}`;
      if (pageFilter && pageFilter !== "all") {
        url += `&page=${encodeURIComponent(pageFilter)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch filtered data");
      
      const logsData = await response.json();
      setDetailedLogs(Array.isArray(logsData.data) ? logsData.data : []);
      
      if (logsData.total) {
        setTotalPages(Math.ceil(logsData.total / PAGE_SIZE));
        setTotalLogsCount(logsData.total);
      }
    } catch (err) {
      console.error("Filter fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = useCallback(
    (term) => {
      if (!term.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return [];
      }

      const searchTermLower = term.toLowerCase().trim();
      const logsToSearch = allLogs.length > 0 ? allLogs : detailedLogs;
      const results = [];

      logsToSearch.forEach((log) => {
        if (!log) return;

        const userInfo = userData[log.userId];
        const userName = userInfo?.name || "Anonymous User";
        const userEmail = userInfo?.email || "";
        const userFirstName = userInfo?.firstName || "";
        const userLastName = userInfo?.lastName || "";
        const userId = log.userId || "";
        const pageName = getPageFriendlyName(log.page);
        const pageUrl = log.page || "";
        const sessionId = log.sessionId || "";
        const ip = log.ip || "";

        // Check all possible matches
        const matches =
          userName.toLowerCase().includes(searchTermLower) ||
          userEmail.toLowerCase().includes(searchTermLower) ||
          userFirstName.toLowerCase().includes(searchTermLower) ||
          userLastName.toLowerCase().includes(searchTermLower) ||
          userId.toLowerCase().includes(searchTermLower) ||
          pageName.toLowerCase().includes(searchTermLower) ||
          pageUrl.toLowerCase().includes(searchTermLower) ||
          sessionId.toLowerCase().includes(searchTermLower) ||
          ip.toLowerCase().includes(searchTermLower);

        if (matches) {
          results.push({
            ...log,
            userName,
            userEmail,
            userFirstName,
            userLastName,
            pageName,
            matchType: getMatchType(
              searchTermLower,
              userName,
              userEmail,
              userFirstName,
              userLastName,
              userId,
              pageName,
            ),
          });
        }
      });

      // Remove duplicates by userId + sessionId + timestamp
      const uniqueResults = Array.from(
        new Map(
          results.map((item) => [
            `${item.userId}-${item.sessionId}-${item.createdAt}`,
            item,
          ]),
        ).values(),
      );

      setSearchResults(uniqueResults);
      setShowSearchResults(true);
      return uniqueResults;
    },
    [allLogs, detailedLogs, userData, getPageFriendlyName],
  );

  const getMatchType = (
    searchTerm,
    userName,
    userEmail,
    firstName,
    lastName,
    userId,
    pageName,
  ) => {
    if (userName.toLowerCase().includes(searchTerm)) return "name";
    if (userEmail.toLowerCase().includes(searchTerm)) return "email";
    if (firstName?.toLowerCase().includes(searchTerm)) return "first_name";
    if (lastName?.toLowerCase().includes(searchTerm)) return "last_name";
    if (userId.toLowerCase().includes(searchTerm)) return "user_id";
    if (pageName.toLowerCase().includes(searchTerm)) return "page";
    return "other";
  };

  useEffect(() => {
    if (searchTerm.trim() && !hasFetchedAllLogsRef.current) {
      fetchAllLogs();
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers(searchTerm);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, searchUsers]);

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setUserDetailsModalOpen(true);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {value?.toLocaleString() || 0}
          </h3>
          {subtitle && <p className="text-gray-400 text-xs mt-2">{subtitle}</p>}
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={24} style={{ color }} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );

  const SearchStatsCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
            Search Results
          </p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {searchTerm ? searchResults.length.toLocaleString() : "All"}
          </h3>
          <p className="text-gray-400 text-xs mt-2">
            {searchTerm
              ? `Found ${searchResults.length} matches in ${totalLogsCount} logs`
              : `Total logs: ${totalLogsCount}`}
          </p>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: "#3b82f615" }}
        >
          <Search size={24} style={{ color: "#3b82f6" }} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );

  const OptimizedSelect = ({
    value,
    onChange,
    options,
    icon: Icon,
    placeholder,
    label,
  }) => (
    <div className="relative">
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
        )}
        <select
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-sm cursor-pointer appearance-none hover:border-gray-400 transition-colors"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
          size={16}
        />
      </div>
    </div>
  );

  const EnhancedPagination = () => {
    const generatePageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 7;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    return (
      <div className="grid grid-cols-1 xs:grid-cols-3 items-center gap-3 sm:gap-4 px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
        <div className="text-xs sm:text-sm text-gray-600 text-center xs:text-left order-2 xs:order-1">
          <span className="hidden sm:inline">Showing </span>
          <span className="font-semibold text-gray-900">
            {(currentPage - 1) * PAGE_SIZE + 1}
          </span>
          <span className="hidden sm:inline"> to </span>
          <span className="xs:hidden">-</span>
          <span className="font-semibold text-gray-900">
            {Math.min(currentPage * PAGE_SIZE, detailedLogs.length)}
          </span>
          {" of "}
          <span className="font-semibold text-gray-900">
            {detailedLogs.length}
          </span>
          <span className="hidden xs:inline"> entries</span>
          {selectedPage !== "all" && !showSearchResults && (
            <span className="ml-2 text-purple-600 text-xs font-medium">
              (Filtered by: {getPageFriendlyName(selectedPage)})
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 order-1 xs:order-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="hidden xs:flex p-1.5 sm:p-2 border border-gray-300 rounded-md sm:rounded-lg text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 transition-all"
            title="First Page"
          >
            <ChevronsLeft size={14} className="sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 sm:p-2 border border-gray-300 rounded-md sm:rounded-lg text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 transition-all"
            title="Previous Page"
          >
            <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
          </button>

          <div className="flex items-center gap-0.5 xs:gap-1">
            {generatePageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 xs:px-1.5 sm:px-2 py-0.5 text-gray-400 text-xs"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[28px] xs:min-w-[32px] sm:min-w-[36px] md:min-w-[40px] h-7 xs:h-8 sm:h-9 md:h-10 flex items-center justify-center rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 border border-gray-300 hover:bg-gray-50"
                  } active:scale-95`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 sm:p-2 border border-gray-300 rounded-md sm:rounded-lg text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 transition-all"
            title="Next Page"
          >
            <ChevronRight size={14} className="sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="hidden xs:flex p-1.5 sm:p-2 border border-gray-300 rounded-md sm:rounded-lg text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 transition-all"
            title="Last Page"
          >
            <ChevronsRight size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="hidden xs:block order-3" />
      </div>
    );
  };

  const getUserName = (userId) => {
    if (!userId) return "Anonymous User";
    return userData[userId]?.name || "Anonymous User";
  };

  const getUserEmail = (userId) => {
    if (!userId) return null;
    return userData[userId]?.email || null;
  };

  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm || !text) return text;

    const lowerText = text.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();

    if (lowerText.includes(lowerSearch)) {
      const index = lowerText.indexOf(lowerSearch);
      const before = text.substring(0, index);
      const match = text.substring(index, index + searchTerm.length);
      const after = text.substring(index + searchTerm.length);

      return (
        <span>
          {before}
          <span className="bg-yellow-200 font-bold px-0.5 rounded">
            {match}
          </span>
          {after}
        </span>
      );
    }
    return text;
  };

  if (loading && !summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-700 font-semibold text-lg">
            Loading analytics data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white border-l-4 border-red-500 rounded-xl shadow-xl p-8 max-w-md w-full">
          <h3 className="text-red-800 font-bold text-xl mb-3">
            Error Loading Data
          </h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={fetchAllData}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const userDistributionData = summary
    ? [
        { name: "Logged In", value: summary.loggedInUsers, color: "#3b82f6" },
        { name: "Anonymous", value: summary.anonymousUsers, color: "#8b5cf6" },
      ]
    : [];

  const uniquePagesMap = new Map();
  pageAnalytics.forEach((item) => {
    if (item && item.page) {
      const friendlyName = getPageFriendlyName(item.page);
      uniquePagesMap.set(item.page, friendlyName);
    }
  });

  detailedLogs.forEach((log) => {
    if (log && log.page && !uniquePagesMap.has(log.page)) {
      const friendlyName = getPageFriendlyName(log.page);
      uniquePagesMap.set(log.page, friendlyName);
    }
  });

  const seenFriendlyNames = new Set();
  const uniquePages = Array.from(uniquePagesMap.entries())
    .map(([page, friendlyName]) => ({
      page,
      friendlyName,
    }))
    .filter(({ friendlyName }) => {
      if (seenFriendlyNames.has(friendlyName)) {
        return false;
      }
      seenFriendlyNames.add(friendlyName);
      return true;
    })
    .sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));

  const pageOptions = [
    { value: "all", label: "All Pages" },
    ...uniquePages.map(({ page, friendlyName }) => ({
      value: page,
      label:
        friendlyName.length > 50
          ? `${friendlyName.slice(0, 50)}...`
          : friendlyName,
    })),
  ];

  const hasActiveFilters = searchTerm || selectedPage !== "all";
  const displayLogs = showSearchResults ? searchResults : detailedLogs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white shadow-sm p-4 sm:p-6 backdrop-blur-lg bg-opacity-90">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left side */}
              <div className="flex items-start gap-3">
                <div className="flex w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-100 items-center justify-center flex-shrink-0">
                  <Activity className="text-blue-600" size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                    Analytics Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 break-words">
                    Real-time insights into your application usage
                  </p>
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center gap-3 justify-end sm:justify-start flex-shrink-0">
                {isSearching && (
                  <div className="flex items-center gap-2 text-blue-600 text-xs sm:text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                    <span>Searching...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
            <StatCard
              title="Total Views"
              value={summary.totalViews}
              icon={Eye}
              color="#3b82f6"
              subtitle="All-time page views"
            />
            <StatCard
              title="Avg Time Spent"
              value={summary.avgTimeSpent}
              icon={Clock}
              color="#ef4444"
              subtitle="Seconds per session"
            />
            <StatCard
              title="Logged In Users"
              value={summary.loggedInUsers}
              icon={Activity}
              color="#8b5cf6"
              subtitle="Authenticated sessions"
            />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {pageAnalytics.length > 0 && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                Page Views by Route
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={pageAnalytics.slice(0, 10).map((item) => ({
                    ...item,
                    friendlyName: getPageFriendlyName(item.page),
                  }))}
                  margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="friendlyName"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={10}
                    stroke="#6b7280"
                    interval={0}
                  />
                  <YAxis fontSize={10} stroke="#6b7280" width={40} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 sm:p-3 border border-gray-200 rounded-lg shadow-lg max-w-[200px] sm:max-w-none">
                            <p className="font-semibold text-gray-900 text-xs sm:text-sm break-words">
                              {payload[0].payload.friendlyName}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 break-all">
                              {payload[0].payload.page}
                            </p>
                            <p className="text-blue-600 font-bold mt-1 sm:mt-2 text-xs sm:text-sm">
                              Views: {payload[0].value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="totalViews"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {userDistributionData.length > 0 && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                User Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => {
                      const isMobile = window.innerWidth < 640;
                      return isMobile
                        ? `${(percent * 100).toFixed(0)}%`
                        : `${name}: ${value} (${(percent * 100).toFixed(0)}%)`;
                    }}
                    outerRadius={window.innerWidth < 640 ? 80 : 100}
                    fill="#8884d8"
                    dataKey="value"
                    style={{
                      fontSize: window.innerWidth < 640 ? "11px" : "12px",
                    }}
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      fontSize: window.innerWidth < 640 ? "12px" : "14px",
                      padding: window.innerWidth < 640 ? "8px" : "10px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Enhanced Search Input */}
        <div className="mb-8">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users by name, email, user ID, or page... (e.g., 'john', 'example@email.com', 'user123')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-blue-500 outline-none text-base hover:border-gray-400 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setShowSearchResults(false);
                  setSearchResults([]);
                  hasFetchedAllLogsRef.current = false;
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Search tips */}
          {searchTerm && (
            <div className="mt-3 text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-medium">Searching:</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium break-all">
                "{searchTerm}"
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm">
                Found{" "}
                <span className="font-bold text-blue-600">
                  {searchResults.length}
                </span>{" "}
                {searchResults.length === 1 ? "match" : "matches"}
              </span>
              {searchResults.length > 0 && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="text-green-600 text-xs sm:text-sm">
                    Showing all results
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Detailed Logs Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                  {showSearchResults
                    ? "Search Results"
                    : "Recent Activity Logs"}
                  {searchTerm && (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs sm:text-sm font-semibold bg-blue-100 text-blue-700 rounded-full">
                      {searchResults.length} matches
                    </span>
                  )}
                  {!showSearchResults && selectedPage !== "all" && (
                    <span className="inline-flex items-center px-2.5 py-1 text-xs sm:text-sm font-semibold bg-purple-100 text-purple-700 rounded-full">
                      {getPageFriendlyName(selectedPage)}
                    </span>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1.5 sm:mt-2">
                  {showSearchResults ? (
                    <>
                      Found{" "}
                      <span className="font-semibold text-gray-900">
                        {searchResults.length}
                      </span>{" "}
                      matches in{" "}
                      <span className="font-semibold text-gray-900">
                        {totalLogsCount}
                      </span>{" "}
                      total logs
                    </>
                  ) : (
                    <span className="flex flex-wrap items-center gap-1">
                      <span>Page</span>
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold text-xs sm:text-sm">
                        {currentPage}
                      </span>
                      <span>of</span>
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-semibold text-xs sm:text-sm">
                        {totalPages}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md font-semibold text-xs sm:text-sm">
                        {detailedLogs.length}
                      </span>
                      <span className="hidden sm:inline">entries</span>
                      {selectedPage !== "all" && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="inline-flex items-center px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md font-semibold text-xs sm:text-sm">
                            Filtered by: {getPageFriendlyName(selectedPage)}
                          </span>
                        </>
                      )}
                    </span>
                  )}
                </p>
              </div>

              {!showSearchResults && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <OptimizedSelect
                    value={selectedPage}
                    onChange={handlePageFilterChange}
                    options={pageOptions}
                    icon={Filter}
                    placeholder="Filter by page..."
                    label="Filter Pages"
                  />
                </div>
              )}
            </div>

            {hasActiveFilters && (
              <div className="mb-0">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedPage("all");
                    setCurrentPage(1);
                    setShowSearchResults(false);
                    setSearchResults([]);
                    hasFetchedAllLogsRef.current = false;
                    fetchAllData();
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Page Visited
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Time Spent
                  </th>
                  {/* <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Session ID
                  </th> */}
                  {/* <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    IP Address
                  </th> */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayLogs.length > 0 ? (
                  displayLogs.map((log) => {
                    if (!log) return null;

                    const logPage = log.page || "";
                    const logUserId = log.userId || "";
                    const logSessionId = log.sessionId || "";
                    const logIp = log.ip || "";
                    const logTimeSpent = log.timeSpent || 0;
                    const userName = getUserName(logUserId);
                    const userEmail = getUserEmail(logUserId);
                    const pageName = getPageFriendlyName(logPage);

                    return (
                      <tr
                        key={log._id || Math.random()}
                        className="hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                  logUserId
                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {highlightMatch(userName, searchTerm)}
                              </span>
                              {log.matchType && (
                                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium">
                                  {log.matchType.replace("_", " ")}
                                </span>
                              )}
                            </div>
                            {userEmail && (
                              <div className="text-xs text-gray-600 mt-1 flex items-center gap-1.5">
                                <Mail size={12} className="text-gray-400" />
                                {highlightMatch(userEmail, searchTerm)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {highlightMatch(pageName, searchTerm)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                            {highlightMatch(logPage, searchTerm)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="bg-gradient-to-r from-green-100 to-green-50 text-green-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                            {logTimeSpent}s
                          </span>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-mono">
                          {logSessionId.substring(0, 10)}...
                        </td> */}
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          {logIp}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewDetails(log)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md text-xs font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Search size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-semibold text-lg mb-1">
                          {searchTerm
                            ? "No matching users found"
                            : selectedPage !== "all"
                            ? `No logs found for "${getPageFriendlyName(selectedPage)}"`
                            : "No activity logs found"}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          {searchTerm
                            ? "Try searching with a different name or term"
                            : selectedPage !== "all"
                            ? "Try selecting a different page filter"
                            : "Try refreshing the page"}
                        </p>
                        {(searchTerm || selectedPage !== "all") && (
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setSelectedPage("all");
                              setShowSearchResults(false);
                              setSearchResults([]);
                              fetchAllData();
                            }}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                          >
                            Clear All Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View - Visible on small and medium screens */}
          <div className="lg:hidden">
            {displayLogs.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {displayLogs.map((log) => {
                  if (!log) return null;

                  const logPage = log.page || "";
                  const logUserId = log.userId || "";
                  const logSessionId = log.sessionId || "";
                  const logIp = log.ip || "";
                  const logTimeSpent = log.timeSpent || 0;
                  const userName = getUserName(logUserId);
                  const userEmail = getUserEmail(logUserId);
                  const pageName = getPageFriendlyName(logPage);

                  return (
                    <div
                      key={log._id || Math.random()}
                      className="p-4 sm:p-5 hover:bg-blue-50 transition-all duration-200 active:bg-blue-100"
                    >
                      {/* User Info */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                                logUserId
                                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {highlightMatch(userName, searchTerm)}
                            </span>
                            {log.matchType && (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium">
                                {log.matchType.replace("_", " ")}
                              </span>
                            )}
                          </div>
                          {userEmail && (
                            <div className="text-xs text-gray-600 flex items-center gap-1.5">
                              <Mail
                                size={12}
                                className="text-gray-400 flex-shrink-0"
                              />
                              <span className="truncate">
                                {highlightMatch(userEmail, searchTerm)}
                              </span>
                            </div>
                          )}
                        </div>

                        <span className="bg-gradient-to-r from-green-100 to-green-50 text-green-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ml-2 flex-shrink-0">
                          {logTimeSpent}s
                        </span>
                      </div>

                      {/* Page Info */}
                      <div className="mb-3 bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                          Page Visited
                        </div>
                        <div className="font-semibold text-gray-900 text-sm mb-1">
                          {highlightMatch(pageName, searchTerm)}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {highlightMatch(logPage, searchTerm)}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleViewDetails(log)}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-sm font-medium active:scale-98"
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-semibold text-base sm:text-lg mb-1">
                    {searchTerm
                      ? "No matching users found"
                      : selectedPage !== "all"
                      ? `No logs found for "${getPageFriendlyName(selectedPage)}"`
                      : "No activity logs found"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4 px-4">
                    {searchTerm
                      ? "Try searching with a different name or term"
                      : selectedPage !== "all"
                      ? "Try selecting a different page filter"
                      : "Try refreshing the page"}
                  </p>
                  {(searchTerm || selectedPage !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedPage("all");
                        setShowSearchResults(false);
                        setSearchResults([]);
                        fetchAllData();
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pagination - Only show when not in search mode */}
          {!showSearchResults && <EnhancedPagination />}
        </div>
      </div>

      {/* User Details Modal */}
      {userDetailsModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  User Activity Details
                </h2>
                <button
                  onClick={() => setUserDetailsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={20} />
                    User Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">User Name</p>
                      <p className="font-medium text-gray-900">
                        {getUserName(selectedLog.userId)}
                      </p>
                    </div>
                    {selectedLog.userId &&
                      userData[selectedLog.userId]?.email && (
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">
                            {userData[selectedLog.userId].email}
                          </p>
                        </div>
                      )}
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-medium text-gray-900 font-mono text-sm">
                        {selectedLog.userId || "Anonymous"}
                      </p>
                    </div>
                    {selectedLog.userId &&
                      userData[selectedLog.userId]?.rawData && (
                        <div>
                          <p className="text-sm text-gray-600">
                            Account Status
                          </p>
                          <p className="font-medium text-gray-900">
                            {userData[selectedLog.userId].rawData.status ||
                              "Active"}
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Activity Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Activity Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Page Visited</p>
                      <p className="font-medium text-gray-900">
                        {getPageFriendlyName(selectedLog.page)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedLog.page}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time Spent</p>
                      <p className="font-medium text-gray-900">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {selectedLog.timeSpent || 0} seconds
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Session ID</p>
                      <p className="font-medium text-gray-900 font-mono text-sm">
                        {selectedLog.sessionId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">IP Address</p>
                      <p className="font-medium text-gray-900">
                        {selectedLog.ip}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Timestamp</p>
                      <p className="font-medium text-gray-900">
                        {selectedLog.createdAt
                          ? new Date(selectedLog.createdAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    {selectedLog.matchType && (
                      <div>
                        <p className="text-sm text-gray-600">Matched By</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {selectedLog.matchType.replace("_", " ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Profile Information */}
                {selectedLog.userId && userData[selectedLog.userId] && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User size={20} />
                      User Profile Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userData[selectedLog.userId].firstName && (
                        <div>
                          <p className="text-sm text-gray-600">First Name</p>
                          <p className="font-medium text-gray-900">
                            {userData[selectedLog.userId].firstName}
                          </p>
                        </div>
                      )}
                      {userData[selectedLog.userId].lastName && (
                        <div>
                          <p className="text-sm text-gray-600">Last Name</p>
                          <p className="font-medium text-gray-900">
                            {userData[selectedLog.userId].lastName}
                          </p>
                        </div>
                      )}
                      {userData[selectedLog.userId].email && (
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">
                            {userData[selectedLog.userId].email}
                          </p>
                        </div>
                      )}
                      {userData[selectedLog.userId].rawData?.createdAt && (
                        <div>
                          <p className="text-sm text-gray-600">Member Since</p>
                          <p className="font-medium text-gray-900">
                            {new Date(
                              userData[selectedLog.userId].rawData.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setUserDetailsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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

export default AnalyticsDashboard;