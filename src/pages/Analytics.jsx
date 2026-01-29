import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
  LineChart,
  Line,
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
  Calculator,
  Timer,
  Target,
  TrendingDown,
  BarChart3,
  Home,
  FileText,
  ShoppingCart,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useQuery,
  useQueries,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

// Constants
const PAGE_SIZE = 20;
const BASE_URL = "https://api.houseofresha.com/analytics";
const USER_API_URL = "https://api.houseofresha.com/data";

// API fetch functions with error handling
const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, i)),
      ); // Exponential backoff
    }
  }
};

const fetchSummary = async () => {
  return fetchWithRetry(`${BASE_URL}/summary`);
};

const fetchPageAnalytics = async () => {
  return fetchWithRetry(`${BASE_URL}/`);
};

const fetchPageAnalyticsDetails = async () => {
  return fetchWithRetry(`${BASE_URL}/pages`);
};

const fetchDetailedLogs = async ({ pageNo = 1, selectedPage = "all" }) => {
  let url = `${BASE_URL}/?pageNo=${pageNo}&limit=${PAGE_SIZE}`;
  if (selectedPage && selectedPage !== "all") {
    url += `&page=${encodeURIComponent(selectedPage)}`;
  }

  const data = await fetchWithRetry(url);
  return {
    logs: data.data || [],
    total: data.total || 0,
    page: pageNo,
    totalPages: Math.ceil((data.total || 0) / PAGE_SIZE),
  };
};

const fetchAllLogs = async () => {
  const data = await fetchWithRetry(`${BASE_URL}/?limit=1000`);
  return data.data || [];
};

const fetchUserData = async () => {
  const users = await fetchWithRetry(USER_API_URL);
  const userMap = {};

  (Array.isArray(users) ? users : []).forEach((user) => {
    if (!user) return;

    const id = user._id || user.id || user.userId;
    const firstName = user.firstName?.trim();
    const lastName = user.lastName?.trim();
    const email = user.email?.trim();

    const fullName =
      firstName && lastName
        ? `${firstName} ${lastName}`
        : firstName || lastName || "Anonymous User";

    if (id) {
      userMap[id] = {
        name: fullName,
        email: email || null,
        firstName: firstName || null,
        lastName: lastName || null,
        rawData: user,
      };
    }
  });

  return userMap;
};

// Add this API fetch function for traffic flow
const fetchTrafficFlow = async () => {
  return fetchWithRetry("https://api.houseofresha.com/traffic-flow");
};

// Utility function for page friendly names
const getPageFriendlyName = (url) => {
  if (!url || typeof url !== "string") {
    return "Unknown Page";
  }

  // Remove query parameters and hash
  const cleanUrl = url.split("?")[0].split("#")[0];

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

  if (pageNames[cleanUrl]) {
    return pageNames[cleanUrl];
  }

  if (cleanUrl.includes("/app/detailpage/")) return "Product Detail";
  if (cleanUrl.includes("/product/")) return "Product Details";
  if (cleanUrl.includes("/blog/")) return "Blog Post";
  if (cleanUrl.includes("/user/")) return "User Profile";
  if (cleanUrl.includes("/category/")) return "Category Page";

  // Extract last meaningful part of the URL
  const parts = cleanUrl.split("/").filter(Boolean);
  if (parts.length === 0) return "Home Page";

  const lastPart = parts[parts.length - 1];
  return (
    lastPart
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") + " Page"
  );
};

// Helper to get page icon
const getPageIcon = (pageName) => {
  if (pageName.includes("Home")) return Home;
  if (pageName.includes("Blog")) return FileText;
  if (
    pageName.includes("Cart") ||
    pageName.includes("Product") ||
    pageName.includes("Shop")
  )
    return ShoppingCart;
  if (pageName.includes("Profile") || pageName.includes("Account")) return User;
  return FileText;
};

// Custom Tooltip component for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-semibold text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            <span className="font-bold">{entry.value.toFixed(2)}s</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Loading spinner component
const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  </div>
);

// Error display component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
      <div className="flex-1">
        <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
        <p className="text-sm text-red-700 mt-1">{error.message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-4 text-sm font-medium text-red-800 hover:text-red-900"
        >
          Retry
        </button>
      )}
    </div>
  </div>
);

// React component
const AnalyticsDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState("all");
  const [selectedLog, setSelectedLog] = useState(null);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [pageTimeAnalysis, setPageTimeAnalysis] = useState(null);
  const [showPageTimeModal, setShowPageTimeModal] = useState(false);

  // Add these state variables for traffic flow
  const [trafficData, setTrafficData] = useState(null);
  const [showTrafficModal, setShowTrafficModal] = useState(false);
  const [trafficLoading, setTrafficLoading] = useState(false);
  const [trafficError, setTrafficError] = useState(null);

  const searchTimeoutRef = useRef(null);
  const queryClient = useQueryClient();

  // TanStack Query hooks with proper error handling
  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["summary"],
    queryFn: fetchSummary,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const {
    data: pageAnalytics,
    isLoading: pageAnalyticsLoading,
    error: pageAnalyticsError,
  } = useQuery({
    queryKey: ["pageAnalytics"],
    queryFn: fetchPageAnalytics,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const {
    data: pageAnalyticsDetails,
    isLoading: pageAnalyticsDetailsLoading,
    error: pageAnalyticsDetailsError,
  } = useQuery({
    queryKey: ["pageAnalyticsDetails"],
    queryFn: fetchPageAnalyticsDetails,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const {
    data: userData,
    isLoading: userDataLoading,
    error: userDataError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });

  const {
    data: allLogs,
    isLoading: allLogsLoading,
    error: allLogsError,
  } = useQuery({
    queryKey: ["allLogs"],
    queryFn: fetchAllLogs,
    staleTime: 2 * 60 * 1000,
    enabled: false, // Only fetch when needed
  });

  const {
    data: logsData,
    isLoading: logsLoading,
    error: logsError,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["detailedLogs", currentPage, selectedPage],
    queryFn: () => fetchDetailedLogs({ pageNo: currentPage, selectedPage }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    retry: 2,
  });

  // Calculate page time analysis with proper validation
  useEffect(() => {
    if (pageAnalyticsDetails && Array.isArray(pageAnalyticsDetails)) {
      const validPages = pageAnalyticsDetails.filter(
        (page) =>
          page &&
          page.page &&
          typeof page.avgTimeSpent === "number" &&
          !isNaN(page.avgTimeSpent) &&
          page.avgTimeSpent > 0,
      );

      if (validPages.length > 0) {
        // Calculate averages
        const totalTime = validPages.reduce(
          (sum, page) => sum + page.avgTimeSpent,
          0,
        );
        const simpleAverage = totalTime / validPages.length;

        // Calculate weighted average
        const totalWeightedTime = validPages.reduce(
          (sum, page) => sum + page.avgTimeSpent * (page.totalViews || 1),
          0,
        );
        const totalViews = validPages.reduce(
          (sum, page) => sum + (page.totalViews || 1),
          0,
        );
        const weightedAverage =
          totalViews > 0 ? totalWeightedTime / totalViews : simpleAverage;

        // Find extremes
        let highestPage = validPages[0];
        let lowestPage = validPages[0];

        validPages.forEach((page) => {
          if (page.avgTimeSpent > highestPage.avgTimeSpent) {
            highestPage = page;
          }
          if (page.avgTimeSpent < lowestPage.avgTimeSpent) {
            lowestPage = page;
          }
        });

        // Prepare data for charts
        const allPages = validPages
          .map((page) => ({
            name: getPageFriendlyName(page.page),
            url: page.page,
            avgTimeSpent: Number(page.avgTimeSpent.toFixed(2)),
            totalViews: page.totalViews || 0,
            uniqueSessionsCount: page.uniqueSessionsCount || 0,
          }))
          .sort((a, b) => b.avgTimeSpent - a.avgTimeSpent);

        setPageTimeAnalysis({
          simpleAverage: Number(simpleAverage.toFixed(2)),
          weightedAverage: Number(weightedAverage.toFixed(2)),
          totalValidPages: validPages.length,
          totalViews,
          highestPage: {
            name: getPageFriendlyName(highestPage.page),
            url: highestPage.page,
            avgTimeSpent: Number(highestPage.avgTimeSpent.toFixed(2)),
            totalViews: highestPage.totalViews || 0,
          },
          lowestPage: {
            name: getPageFriendlyName(lowestPage.page),
            url: lowestPage.page,
            avgTimeSpent: Number(lowestPage.avgTimeSpent.toFixed(2)),
            totalViews: lowestPage.totalViews || 0,
          },
          allPages: allPages.slice(0, 10),
        });
      } else {
        setPageTimeAnalysis(null);
      }
    }
  }, [pageAnalyticsDetails]);

  // Derived data
  const detailedLogs = logsData?.logs || [];
  const totalPages = logsData?.totalPages || 1;
  const totalLogsCount = logsData?.total || 0;

  // Prefetch next page
  useEffect(() => {
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["detailedLogs", currentPage + 1, selectedPage],
        queryFn: () =>
          fetchDetailedLogs({ pageNo: currentPage + 1, selectedPage }),
      });
    }
  }, [currentPage, totalPages, selectedPage, queryClient]);

  // Handle page filter change
  const handlePageFilterChange = (e) => {
    const pageValue = e.target.value;
    setSelectedPage(pageValue);
    setCurrentPage(1);
    setShowSearchResults(false);
    setSearchResults([]);
  };

  // Enhanced search function
  const searchUsers = useCallback(
    (term) => {
      if (!term.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return [];
      }

      const searchTermLower = term.toLowerCase().trim();
      const logsToSearch = allLogs || [];
      const results = [];

      logsToSearch.forEach((log) => {
        if (!log) return;

        const userInfo = userData?.[log.userId];
        const userName = userInfo?.name || "Anonymous User";
        const userEmail = userInfo?.email || "";
        const pageName = getPageFriendlyName(log.page);
        const userId = log.userId || "";

        // Check for matches in relevant fields
        const searchFields = [
          userName.toLowerCase(),
          userEmail.toLowerCase(),
          pageName.toLowerCase(),
          userId.toLowerCase(),
          log.page?.toLowerCase() || "",
          log.sessionId?.toLowerCase() || "",
          log.ip?.toLowerCase() || "",
        ];

        if (searchFields.some((field) => field.includes(searchTermLower))) {
          results.push({
            ...log,
            userName,
            userEmail,
            pageName,
            matchType: getMatchType(searchTermLower, {
              userName,
              userEmail,
              pageName,
              userId,
            }),
          });
        }
      });

      // Remove duplicates based on unique combination
      const uniqueResults = Array.from(
        new Map(
          results.map((item) => [
            `${item.userId}-${item.sessionId}-${item.page}-${item.createdAt}`,
            item,
          ]),
        ).values(),
      );

      setSearchResults(uniqueResults);
      setShowSearchResults(true);
      return uniqueResults;
    },
    [allLogs, userData],
  );

  const getMatchType = (searchTerm, fields) => {
    if (fields.userName.toLowerCase().includes(searchTerm)) return "name";
    if (fields.userEmail.toLowerCase().includes(searchTerm)) return "email";
    if (fields.pageName.toLowerCase().includes(searchTerm)) return "page";
    if (fields.userId.toLowerCase().includes(searchTerm)) return "user_id";
    return "other";
  };

  // Debounced search handler
  const handleSearchChange = useCallback(
    (e) => {
      const term = e.target.value;
      setSearchTerm(term);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (term.trim()) {
          searchUsers(term);
        } else {
          setSearchResults([]);
          setShowSearchResults(false);
        }
      }, 300);
    },
    [searchUsers],
  );

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setUserDetailsModalOpen(true);
  };

  const handleShowPageTimeAnalysis = () => {
    setShowPageTimeModal(true);
  };

  // Add this function to handle traffic data fetching
  const handleShowTrafficFlow = async () => {
    setTrafficLoading(true);
    setTrafficError(null);

    try {
      const data = await fetchTrafficFlow();
      setTrafficData(data.data || data);
      setShowTrafficModal(true);
    } catch (error) {
      setTrafficError(error);
      console.error("Error fetching traffic data:", error);
    } finally {
      setTrafficLoading(false);
    }
  };

  // Refresh all data
  const handleRefreshAll = () => {
    queryClient.invalidateQueries();
    setSearchTerm("");
    setSelectedPage("all");
    setCurrentPage(1);
    setShowSearchResults(false);
    setSearchResults([]);
  };

  // StatCard component
  const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick }) => {
    const formattedValue =
      typeof value === "number" ? value.toLocaleString() : value || "0";

    return (
      <div
        className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200 ${onClick ? "cursor-pointer hover:border-blue-200" : ""}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
              {title}
            </p>
            <h3 className="text-3xl font-bold mt-2 text-gray-900">
              {formattedValue}
            </h3>
            {subtitle && (
              <p className="text-gray-400 text-xs mt-2">{subtitle}</p>
            )}
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
  };

  // PageTimeStatCard component
  const PageTimeStatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    trend,
    trendValue,
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">
            {typeof value === "number" ? `${value}s` : value}
          </h3>
          {subtitle && <p className="text-gray-400 text-xs mt-2">{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-xs ${trend === "up" ? "text-green-600" : "text-red-600"}`}
            >
              {trend === "up" ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span>{trendValue}</span>
            </div>
          )}
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

  // Pagination component
  const Pagination = () => {
    const generatePageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      const delta = Math.floor(maxVisiblePages / 2);

      let start = Math.max(1, currentPage - delta);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200 gap-4">
        <div className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-semibold">
            {(currentPage - 1) * PAGE_SIZE + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(currentPage * PAGE_SIZE, totalLogsCount)}
          </span>{" "}
          of <span className="font-semibold">{totalLogsCount}</span> results
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center space-x-1">
            {generatePageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 py-1">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  // Helper functions
  const getUserName = (userId) => {
    if (!userId) return "Anonymous User";
    return userData?.[userId]?.name || "Anonymous User";
  };

  const getUserEmail = (userId) => {
    if (!userId) return null;
    return userData?.[userId]?.email || null;
  };

  // Highlight search matches
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm || !text || typeof text !== "string") return text;

    const lowerText = text.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();

    if (lowerText.includes(lowerSearch)) {
      const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
      return (
        <span>
          {parts.map((part, i) =>
            part.toLowerCase() === lowerSearch ? (
              <mark key={i} className="bg-yellow-200 px-0.5 rounded">
                {part}
              </mark>
            ) : (
              part
            ),
          )}
        </span>
      );
    }
    return text;
  };

  // Prepare unique pages for filter dropdown
  const uniquePages = useMemo(() => {
    if (!pageAnalytics || !Array.isArray(pageAnalytics)) return [];

    const pagesMap = new Map();
    pageAnalytics.forEach((item) => {
      if (item?.page) {
        const friendlyName = getPageFriendlyName(item.page);
        if (!pagesMap.has(item.page)) {
          pagesMap.set(item.page, friendlyName);
        }
      }
    });

    return Array.from(pagesMap.entries())
      .map(([page, friendlyName]) => ({ page, friendlyName }))
      .sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));
  }, [pageAnalytics]);

  // Prepare data for charts
  const userDistributionData = summary
    ? [
        {
          name: "Logged In",
          value: summary.loggedInUsers || 0,
          color: "#3b82f6",
        },
        {
          name: "Anonymous",
          value: summary.anonymousUsers || 0,
          color: "#8b5cf6",
        },
      ]
    : [];

  // Top Pages Chart Component
  const TopPagesChart = () => {
    if (!pageTimeAnalysis || pageTimeAnalysis.allPages.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No page time data available
        </div>
      );
    }

    const chartData = pageTimeAnalysis.allPages.map((page) => ({
      name:
        page.name.length > 15 ? page.name.substring(0, 15) + "..." : page.name,
      avgTime: page.avgTimeSpent,
      views: page.totalViews,
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            fontSize={12}
          />
          <YAxis fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="avgTime"
            name="Average Time (s)"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Traffic Analysis Modal Component
  const TrafficAnalysisModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-purple-600 flex-shrink-0" size={20} />
              <span className="truncate">User Traffic Flow Analysis</span>
            </h2>
            <button
              onClick={() => setShowTrafficModal(false)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors p-2 rounded-lg flex-shrink-0"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Shows user navigation patterns between pages
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {trafficLoading ? (
              <LoadingSpinner text="Loading traffic data..." />
            ) : trafficError ? (
              <ErrorDisplay
                error={trafficError}
                onRetry={handleShowTrafficFlow}
              />
            ) : trafficData && trafficData.length > 0 ? (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-gray-600 text-sm font-medium">
                      Total Transitions
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {trafficData
                        .reduce((sum, item) => sum + (item.transitions || 0), 0)
                        .toLocaleString()}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      Page-to-page navigations
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-gray-600 text-sm font-medium">
                      Unique Routes
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {trafficData.length}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      Distinct navigation paths
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-gray-600 text-sm font-medium">
                      Avg Transition Time
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {(
                        trafficData.reduce(
                          (sum, item) => sum + (item.avgTimeSpent || 0),
                          0,
                        ) / trafficData.length
                      ).toFixed(2)}
                      s
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      Average per route
                    </p>
                  </div>
                </div>

                {/* Traffic Flow Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Traffic Flow Details
                    </h3>
                  </div>

                  {/* Mobile Card View */}
                  <div className="block sm:hidden divide-y divide-gray-200">
                    {trafficData.map((item, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50">
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-gray-900 mb-1">
                                {getPageFriendlyName(item.fromPage)} →{" "}
                                {getPageFriendlyName(item.toPage)}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="truncate">
                                  {item.fromPage}
                                </span>
                                <ChevronRight size={12} />
                                <span className="truncate">{item.toPage}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Transitions
                              </p>
                              <p className="text-lg font-bold text-purple-700">
                                {item.transitions}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                Avg Time
                              </p>
                              <p className="text-lg font-bold text-blue-700">
                                {item.avgTimeSpent}s
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            From Page
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            To Page
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Transitions
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Avg Time (s)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {trafficData.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {getPageFriendlyName(item.fromPage)}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-xs">
                                  {item.fromPage}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {getPageFriendlyName(item.toPage)}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-xs">
                                  {item.toPage}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {item.transitions} transitions
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-lg font-bold text-gray-900">
                                {item.avgTimeSpent}s
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Traffic Flow Insights */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-purple-600" />
                    Traffic Flow Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Most Frequent Navigation
                      </p>
                      {(() => {
                        const maxTransitions = Math.max(
                          ...trafficData.map((item) => item.transitions),
                        );
                        const mostFrequent = trafficData.find(
                          (item) => item.transitions === maxTransitions,
                        );
                        return mostFrequent ? (
                          <div>
                            <p className="text-lg font-bold text-purple-700">
                              {mostFrequent.transitions} times
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {getPageFriendlyName(mostFrequent.fromPage)} →{" "}
                              {getPageFriendlyName(mostFrequent.toPage)}
                            </p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Longest Average Time
                      </p>
                      {(() => {
                        const maxTime = Math.max(
                          ...trafficData.map((item) => item.avgTimeSpent),
                        );
                        const longestTime = trafficData.find(
                          (item) => item.avgTimeSpent === maxTime,
                        );
                        return longestTime ? (
                          <div>
                            <p className="text-lg font-bold text-blue-700">
                              {longestTime.avgTimeSpent}s
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {getPageFriendlyName(longestTime.fromPage)} →{" "}
                              {getPageFriendlyName(longestTime.toPage)}
                            </p>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-900 font-semibold text-lg mb-2">
                  No Traffic Data Available
                </p>
                <p className="text-gray-600">
                  User traffic flow data is not available at the moment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Page Time Analysis Modal Component
  const PageTimeAnalysisModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="text-blue-600 flex-shrink-0" size={20} />
              <span className="truncate">Page Time Analysis</span>
            </h2>
            <button
              onClick={() => setShowPageTimeModal(false)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors p-2 rounded-lg flex-shrink-0"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {pageTimeAnalysis ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Simple Average */}
                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium">
                      Simple Average
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      {pageTimeAnalysis.simpleAverage}s
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      Across {pageTimeAnalysis.totalValidPages} pages
                    </p>
                  </div>

                  {/* Weighted Average */}
                  <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium">
                      Weighted Average
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      {pageTimeAnalysis.weightedAverage}s
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      Based on {pageTimeAnalysis.totalViews.toLocaleString()}{" "}
                      views
                    </p>
                  </div>

                  {/* Highest Average */}
                  <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium">
                      Highest Average
                    </p>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mt-1 truncate">
                      {pageTimeAnalysis.highestPage.name}
                    </h3>
                    <p className="text-green-600 text-lg sm:text-xl font-bold mt-1">
                      {pageTimeAnalysis.highestPage.avgTimeSpent}s
                    </p>
                  </div>

                  {/* Lowest Average */}
                  <div className="bg-red-50 rounded-lg p-3 sm:p-4 border border-red-200">
                    <p className="text-gray-600 text-xs sm:text-sm font-medium">
                      Lowest Average
                    </p>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mt-1 truncate">
                      {pageTimeAnalysis.lowestPage.name}
                    </h3>
                    <p className="text-red-600 text-lg sm:text-xl font-bold mt-1">
                      {pageTimeAnalysis.lowestPage.avgTimeSpent}s
                    </p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Top Pages Chart */}
                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Top Pages by Average Time
                    </h3>
                    <div className="h-56 sm:h-64 lg:h-80">
                      <TopPagesChart />
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Performance Metrics
                    </h3>
                    <div className="space-y-4 sm:space-y-6">
                      {/* Simple Average Progress */}
                      <div>
                        <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
                          <span className="text-gray-600 font-medium">
                            Simple Average
                          </span>
                          <span className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">
                            {pageTimeAnalysis.simpleAverage}s
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 lg:h-3">
                          <div
                            className="bg-blue-600 h-2 sm:h-2.5 lg:h-3 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${Math.min(100, (pageTimeAnalysis.simpleAverage / 10) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1.5">
                          <span className="text-xs text-gray-500">
                            Across {pageTimeAnalysis.totalValidPages} pages
                          </span>
                          <span className="text-xs text-blue-600 font-medium">
                            {Math.min(
                              100,
                              Math.round(
                                (pageTimeAnalysis.simpleAverage / 10) * 100,
                              ),
                            )}
                            %
                          </span>
                        </div>
                      </div>

                      {/* Weighted Average Progress */}
                      <div>
                        <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
                          <span className="text-gray-600 font-medium">
                            Weighted Average
                          </span>
                          <span className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg">
                            {pageTimeAnalysis.weightedAverage}s
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 lg:h-3">
                          <div
                            className="bg-green-600 h-2 sm:h-2.5 lg:h-3 rounded-full transition-all duration-500 ease-out"
                            style={{
                              width: `${Math.min(100, (pageTimeAnalysis.weightedAverage / 10) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1.5">
                          <span className="text-xs text-gray-500">
                            {pageTimeAnalysis.totalViews.toLocaleString()} total
                            views
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            {Math.min(
                              100,
                              Math.round(
                                (pageTimeAnalysis.weightedAverage / 10) * 100,
                              ),
                            )}
                            %
                          </span>
                        </div>
                      </div>

                      {/* Info Card */}
                      <div className="mt-3 sm:mt-4 lg:mt-6 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-blue-100">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
                              More Accurate Metric
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              Weighted average accounts for page popularity,
                              providing a more accurate representation of user
                              engagement.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Page Performance Details
                    </h3>
                  </div>

                  {/* Mobile Card View */}
                  <div className="block sm:hidden divide-y divide-gray-200">
                    {pageTimeAnalysis.allPages.map((page, index) => {
                      const isAboveAverage =
                        page.avgTimeSpent > pageTimeAnalysis.weightedAverage;
                      return (
                        <div key={index} className="p-4 hover:bg-gray-50">
                          <div className="mb-2">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {page.name}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {/* {page.url} */}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-600 mb-0.5">
                                Avg Time
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                {page.avgTimeSpent}s
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600 mb-0.5">
                                Views
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {page.totalViews.toLocaleString()}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                isAboveAverage
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {isAboveAverage ? "Above" : "Below"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Page
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Avg Time
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pageTimeAnalysis.allPages.map((page, index) => {
                          const isAboveAverage =
                            page.avgTimeSpent >
                            pageTimeAnalysis.weightedAverage;
                          return (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 sm:px-6 py-4">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {page.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate max-w-xs lg:max-w-md">
                                    {/* {page.url} */}
                                  </p>
                                </div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span className="text-base sm:text-lg font-bold text-gray-900">
                                  {page.avgTimeSpent}s
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                  {page.totalViews.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                    isAboveAverage
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {isAboveAverage
                                    ? "Above Average"
                                    : "Below Average"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Calculator className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                  No page time data available
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  Page analytics data is required for time analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  const isLoading = summaryLoading || pageAnalyticsLoading || logsLoading;

  if (isLoading && !isPlaceholderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-700 font-semibold text-lg">
            Loading analytics dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state - show first error encountered
  const error = summaryError || pageAnalyticsError || logsError;
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay error={error} onRetry={handleRefreshAll} />
        </div>
      </div>
    );
  }

  const displayLogs = showSearchResults ? searchResults : detailedLogs;
  const hasActiveFilters = searchTerm || selectedPage !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white shadow-sm p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Header Section */}
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 items-center justify-center flex-shrink-0">
                  <Activity className="text-blue-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Analytics Dashboard
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Real-time insights into your application usage
                  </p>
                </div>
              </div>

              {/* Buttons Section - Updated with User Traffic button */}
              <div className="flex flex-row items-center gap-2 sm:gap-3">
                <button
                  onClick={handleShowTrafficFlow}
                  disabled={trafficLoading}
                  className="flex-1 sm:flex-initial px-3 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-sm hover:shadow-md text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {trafficLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <TrendingUp size={16} className="flex-shrink-0" />
                  )}
                  <span className="hidden xs:inline">User Traffic</span>
                  <span className="xs:hidden">Traffic</span>
                </button>
                <button
                  onClick={handleShowPageTimeAnalysis}
                  className="flex-1 sm:flex-initial px-3 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm hover:shadow-md text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                >
                  <Calculator size={16} className="flex-shrink-0" />
                  <span className="hidden xs:inline">Page Analysis</span>
                  <span className="xs:hidden">Analysis</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Views"
                value={summary.totalViews || 0}
                icon={Eye}
                color="#3b82f6"
                subtitle="All-time page views"
              />
              <StatCard
                title="Avg Time Spent"
                value={summary.avgTimeSpent || 0}
                icon={Clock}
                color="#ef4444"
                subtitle="Seconds per session"
              />
              <StatCard
                title="Logged In Users"
                value={summary.loggedInUsers || 0}
                icon={Users}
                color="#8b5cf6"
                subtitle="Authenticated sessions"
              />
              <StatCard
                title="Total Sessions"
                value={summary.totalSessions || summary.totalLogs || 0}
                icon={Activity}
                color="#10b981"
                subtitle="User sessions"
              />
            </div>
          </div>
        )}

        {/* PAGE TIME ANALYSIS SECTION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Timer className="text-blue-600" size={20} />
                <span>Page Time Analysis</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Average time users spend on each page
              </p>
            </div>
            {pageTimeAnalysis && (
              <div className="sm:text-right bg-green-50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600">
                  Weighted Average
                </p>
                <p className="text-lg sm:text-xl font-bold text-green-700">
                  {pageTimeAnalysis.weightedAverage}s
                </p>
              </div>
            )}
          </div>

          {pageTimeAnalysis ? (
            <>
              {/* Page Time Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <PageTimeStatCard
                  title="Simple Average"
                  value={pageTimeAnalysis.simpleAverage}
                  icon={Calculator}
                  color="#3b82f6"
                  subtitle={`Across ${pageTimeAnalysis.totalValidPages} pages`}
                />
                <PageTimeStatCard
                  title="Weighted Average"
                  value={pageTimeAnalysis.weightedAverage}
                  icon={Target}
                  color="#10b981"
                  subtitle={`${pageTimeAnalysis.totalViews.toLocaleString()} views`}
                  trend="up"
                  trendValue="More accurate"
                />
                <PageTimeStatCard
                  title="Highest Average"
                  value={pageTimeAnalysis.highestPage.avgTimeSpent}
                  icon={TrendingUp}
                  color="#f59e0b"
                  subtitle={pageTimeAnalysis.highestPage.name}
                />
                <PageTimeStatCard
                  title="Lowest Average"
                  value={pageTimeAnalysis.lowestPage.avgTimeSpent}
                  icon={TrendingDown}
                  color="#ef4444"
                  subtitle={pageTimeAnalysis.lowestPage.name}
                />
              </div>

              {/* Top Pages List */}
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                    Page Performance Ranking
                  </h3>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Top {Math.min(5, pageTimeAnalysis.allPages.length)}
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="block sm:hidden space-y-3">
                  {pageTimeAnalysis.allPages.slice(0, 5).map((page, index) => {
                    const Icon = getPageIcon(page.name);
                    const isAboveAverage =
                      page.avgTimeSpent > pageTimeAnalysis.weightedAverage;

                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                        {/* Header with Icon and Page Info */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 h-9 w-9 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 mb-0.5 line-clamp-1">
                              {page.name}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {/* {page.url} */}
                            </div>
                          </div>
                          <span
                            className={`flex-shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              isAboveAverage
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {isAboveAverage ? "Above" : "Below"}
                          </span>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">
                              Average Time
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              {page.avgTimeSpent}s
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-600 mb-1">
                              Total Views
                            </div>
                            <div className="text-base font-semibold text-gray-900">
                              {page.totalViews.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tablet View (Compact Cards) */}
                <div className="hidden sm:block md:hidden space-y-2">
                  {pageTimeAnalysis.allPages.slice(0, 5).map((page, index) => {
                    const Icon = getPageIcon(page.name);
                    const isAboveAverage =
                      page.avgTimeSpent > pageTimeAnalysis.weightedAverage;

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {page.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {/* {page.url} */}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs text-gray-600">Time</div>
                            <div className="text-lg font-bold text-gray-900">
                              {page.avgTimeSpent}s
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-600">Views</div>
                            <div className="text-sm font-semibold text-gray-900">
                              {page.totalViews.toLocaleString()}
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              isAboveAverage
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {isAboveAverage ? "Above" : "Below"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto -mx-2 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Page
                          </th>
                          <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Avg Time
                          </th>
                          <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Views
                          </th>
                          <th className="px-3 lg:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pageTimeAnalysis.allPages
                          .slice(0, 5)
                          .map((page, index) => {
                            const Icon = getPageIcon(page.name);
                            const isAboveAverage =
                              page.avgTimeSpent >
                              pageTimeAnalysis.weightedAverage;

                            return (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-3 lg:px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 h-9 w-9 lg:h-10 lg:w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <Icon className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-semibold text-gray-900 truncate">
                                        {page.name}
                                      </div>
                                      <div className="text-xs text-gray-500 truncate max-w-xs lg:max-w-md">
                                        {/* {page.url} */}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 lg:px-4 py-4 whitespace-nowrap">
                                  <div className="text-lg lg:text-xl font-bold text-gray-900">
                                    {page.avgTimeSpent}s
                                  </div>
                                </td>
                                <td className="px-3 lg:px-4 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {page.totalViews.toLocaleString()}
                                  </div>
                                </td>
                                <td className="px-3 lg:px-4 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                      isAboveAverage
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {isAboveAverage
                                      ? "Above Average"
                                      : "Below Average"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* View All Button */}
                {pageTimeAnalysis.allPages.length > 5 && (
                  <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-100 text-center">
                    <button
                      onClick={handleShowPageTimeAnalysis}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors group"
                    >
                      <span>View all pages</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-6 sm:p-8 border border-gray-100 text-center">
              <Timer className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 font-semibold text-base sm:text-lg mb-2">
                Page Time Analysis Unavailable
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                Collecting page analytics data...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {userDetailsModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  User Activity Details
                </h2>
                <button
                  onClick={() => setUserDetailsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
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
                    {getUserEmail(selectedLog.userId) && (
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">
                          {getUserEmail(selectedLog.userId)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-medium text-gray-900 font-mono text-sm break-all">
                        {selectedLog.userId || "Anonymous"}
                      </p>
                    </div>
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
                      <p className="text-xs text-gray-500 mt-1 truncate">
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
                      <p className="font-medium text-gray-900 font-mono text-sm break-all">
                        {selectedLog.sessionId}
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
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
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

      {/* Page Time Analysis Modal */}
      {showPageTimeModal && <PageTimeAnalysisModal />}

      {/* Traffic Analysis Modal */}
      {showTrafficModal && <TrafficAnalysisModal />}
    </div>
  );
};

export default AnalyticsDashboard;
