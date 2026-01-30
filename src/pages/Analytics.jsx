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
      return data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, i)),
      );
    }
  }
};

const fetchSummary = async () => {
  const data = await fetchWithRetry(`${BASE_URL}/summary`);
  return data.data || data;
};

const fetchPageAnalytics = async () => {
  const data = await fetchWithRetry(`${BASE_URL}/`);
  return data.data || data;
};

const fetchPageAnalyticsDetails = async () => {
  const data = await fetchWithRetry(`${BASE_URL}/pages`);
  return data.data || data;
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

// Traffic flow API functions
const fetchTrafficFlow = async () => {
  try {
    const data = await fetchWithRetry(
      "https://api.houseofresha.com/traffic-flow",
    );
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching traffic flow:", error);
    return [];
  }
};

const fetchEntryTraffic = async (page) => {
  try {
    const response = await fetchWithRetry(
      `https://api.houseofresha.com/traffic-flow/entry?page=${encodeURIComponent(page)}`,
    );
    if (Array.isArray(response)) {
      return response;
    } else if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching entry traffic:", error);
    return [];
  }
};

const fetchExitTraffic = async (page) => {
  try {
    const response = await fetchWithRetry(
      `https://api.houseofresha.com/traffic-flow/exit?page=${encodeURIComponent(page)}`,
    );
    if (Array.isArray(response)) {
      return response;
    } else if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching exit traffic:", error);
    return [];
  }
};

// Utility function for page friendly names
const getPageFriendlyName = (url) => {
  if (!url || typeof url !== "string") {
    return "Unknown Page";
  }

  const cleanUrl = url.split("?")[0].split("#")[0];

  const pageNames = {
    "/": "Login Page",
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

  const [trafficData, setTrafficData] = useState(null);
  const [showTrafficModal, setShowTrafficModal] = useState(false);
  const [trafficLoading, setTrafficLoading] = useState(false);
  const [trafficError, setTrafficError] = useState(null);
  const [selectedTrafficPage, setSelectedTrafficPage] = useState(null);
  const [entryTrafficData, setEntryTrafficData] = useState(null);
  const [exitTrafficData, setExitTrafficData] = useState(null);
  const [entryLoading, setEntryLoading] = useState(false);
  const [exitLoading, setExitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const searchTimeoutRef = useRef(null);
  const queryClient = useQueryClient();

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
    enabled: false,
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
        const totalTime = validPages.reduce(
          (sum, page) => sum + page.avgTimeSpent,
          0,
        );
        const simpleAverage = totalTime / validPages.length;

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

  const detailedLogs = logsData?.logs || [];
  const totalPages = logsData?.totalPages || 1;
  const totalLogsCount = logsData?.total || 0;

  useEffect(() => {
    if (currentPage < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["detailedLogs", currentPage + 1, selectedPage],
        queryFn: () =>
          fetchDetailedLogs({ pageNo: currentPage + 1, selectedPage }),
      });
    }
  }, [currentPage, totalPages, selectedPage, queryClient]);

  useEffect(() => {
    if (showTrafficModal) {
      setSelectedTrafficPage(null);
      setEntryTrafficData(null);
      setExitTrafficData(null);
      setActiveTab("overview");
    }
  }, [showTrafficModal]);

  const handlePageFilterChange = (e) => {
    const pageValue = e.target.value;
    setSelectedPage(pageValue);
    setCurrentPage(1);
    setShowSearchResults(false);
    setSearchResults([]);
  };

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

  const handleShowTrafficFlow = async () => {
    setTrafficLoading(true);
    setTrafficError(null);

    try {
      const data = await fetchTrafficFlow();
      setTrafficData(data);
      setShowTrafficModal(true);
    } catch (error) {
      setTrafficError(error);
      console.error("Error fetching traffic data:", error);
      setTrafficData([]);
    } finally {
      setTrafficLoading(false);
    }
  };

  const handlePageTrafficDetails = async (pageUrl) => {
    setSelectedTrafficPage(pageUrl);
    setEntryTrafficData(null);
    setExitTrafficData(null);
    setActiveTab("entry");

    setEntryLoading(true);
    try {
      const entryData = await fetchEntryTraffic(pageUrl);
      setEntryTrafficData(entryData);
    } catch (error) {
      console.error("Error fetching entry traffic:", error);
      setEntryTrafficData([]);
    } finally {
      setEntryLoading(false);
    }

    setExitLoading(true);
    try {
      const exitData = await fetchExitTraffic(pageUrl);
      setExitTrafficData(exitData);
    } catch (error) {
      console.error("Error fetching exit traffic:", error);
      setExitTrafficData([]);
    } finally {
      setExitLoading(false);
    }
  };

  const handleRefreshAll = () => {
    queryClient.invalidateQueries();
    setSearchTerm("");
    setSelectedPage("all");
    setCurrentPage(1);
    setShowSearchResults(false);
    setSearchResults([]);
  };

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

  const getUserName = (userId) => {
    if (!userId) return "Anonymous User";
    return userData?.[userId]?.name || "Anonymous User";
  };

  const getUserEmail = (userId) => {
    if (!userId) return null;
    return userData?.[userId]?.email || null;
  };

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

  const TrafficAnalysisModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 truncate">
                <TrendingUp
                  className="text-purple-600 flex-shrink-0"
                  size={20}
                />
                <span className="truncate">
                  {selectedTrafficPage
                    ? `Traffic Analysis: ${getPageFriendlyName(selectedTrafficPage)}`
                    : "User Traffic Flow Analysis"}
                </span>
              </h2>
              <p className="text-sm text-gray-600 mt-2 truncate">
                {selectedTrafficPage
                  ? `Analyzing traffic for ${selectedTrafficPage}`
                  : "Shows user navigation patterns between pages"}
              </p>
            </div>
            <button
              onClick={() => setShowTrafficModal(false)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors p-2 rounded-lg flex-shrink-0 ml-2"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {selectedTrafficPage && (
            <div className="mt-4 flex space-x-1">
              <button
                onClick={() => setActiveTab("entry")}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "entry" ? "bg-purple-100 text-purple-700" : "text-gray-500 hover:text-gray-700"}`}
              >
                Entry Traffic
              </button>
              <button
                onClick={() => setActiveTab("exit")}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "exit" ? "bg-purple-100 text-purple-700" : "text-gray-500 hover:text-gray-700"}`}
              >
                Exit Traffic
              </button>
              <button
                onClick={() => {
                  setSelectedTrafficPage(null);
                  setActiveTab("overview");
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "overview" ? "bg-purple-100 text-purple-700" : "text-gray-500 hover:text-gray-700"}`}
              >
                Back to Overview
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {selectedTrafficPage ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {getPageFriendlyName(selectedTrafficPage)}
                      </h3>
                      <p className="text-sm text-gray-600 truncate max-w-2xl">
                        {selectedTrafficPage}
                      </p>
                    </div>
                  </div>
                </div>

                {activeTab === "entry" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        How Users Arrive at This Page
                      </h3>
                      <div className="text-sm text-gray-500">
                        Entry Traffic Analysis
                      </div>
                    </div>

                    {entryLoading ? (
                      <LoadingSpinner text="Loading entry traffic data..." />
                    ) : entryTrafficData && entryTrafficData.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-gray-600 text-sm font-medium">
                              Total Entry Visits
                            </p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                              {entryTrafficData
                                .reduce(
                                  (sum, item) => sum + (item.visits || 0),
                                  0,
                                )
                                .toLocaleString()}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1">
                              Total arrivals to this page
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-gray-600 text-sm font-medium">
                              Direct Entries
                            </p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                              {entryTrafficData
                                .filter((item) => item.previousPage === null)
                                .reduce(
                                  (sum, item) => sum + (item.visits || 0),
                                  0,
                                )
                                .toLocaleString()}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1">
                              Direct access/refresh
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <p className="text-gray-600 text-sm font-medium">
                              Avg Entry Time
                            </p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                              {(() => {
                                const totalVisits = entryTrafficData.reduce(
                                  (sum, item) => sum + (item.visits || 0),
                                  0,
                                );
                                const weightedTime = entryTrafficData.reduce(
                                  (sum, item) =>
                                    sum +
                                    (item.avgTimeSpent || 0) *
                                      (item.visits || 0),
                                  0,
                                );
                                return totalVisits > 0
                                  ? (weightedTime / totalVisits).toFixed(2)
                                  : "0.00";
                              })()}
                              s
                            </h3>
                            <p className="text-gray-500 text-xs mt-1">
                              Average time spent
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h4 className="text-base font-semibold text-gray-900">
                              Entry Sources
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Where users came from before this page
                            </p>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Source Page
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Entry Visits
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Avg Time on Source
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Entry Type
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {entryTrafficData
                                  .sort(
                                    (a, b) => (b.visits || 0) - (a.visits || 0),
                                  )
                                  .map((item, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-4">
                                        <div className="min-w-0">
                                          <p className="text-sm font-medium text-gray-900">
                                            {item.previousPage === null
                                              ? "Direct Entry/Refresh"
                                              : getPageFriendlyName(
                                                  item.previousPage,
                                                )}
                                          </p>
                                          {item.previousPage && (
                                            <p className="text-xs text-gray-500 truncate max-w-xs">
                                              {item.previousPage}
                                            </p>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                          {item.visits || 0} visits
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-lg font-bold text-gray-900">
                                          {item.avgTimeSpent || 0}s
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            item.previousPage === null
                                              ? "bg-green-100 text-green-800"
                                              : "bg-purple-100 text-purple-800"
                                          }`}
                                        >
                                          {item.previousPage === null
                                            ? "Direct"
                                            : "Internal"}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-900 font-semibold text-lg mb-2">
                          No Entry Traffic Data
                        </p>
                        <p className="text-gray-600">
                          No data available for how users arrive at this page
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "exit" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Where Users Go From This Page
                      </h3>
                      <div className="text-sm text-gray-500">
                        Exit Traffic Analysis
                      </div>
                    </div>

                    {exitLoading ? (
                      <LoadingSpinner text="Loading exit traffic data..." />
                    ) : exitTrafficData && exitTrafficData.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-gray-600 text-sm font-medium">
                              Total Exit Visits
                            </p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                              {exitTrafficData
                                .reduce(
                                  (sum, item) => sum + (item.visits || 0),
                                  0,
                                )
                                .toLocaleString()}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1">
                              Total exits from this page
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-gray-600 text-sm font-medium">
                              Most Popular Exit
                            </p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                              {(() => {
                                const maxVisits = Math.max(
                                  ...exitTrafficData.map(
                                    (item) => item.visits || 0,
                                  ),
                                );
                                const popularExit = exitTrafficData.find(
                                  (item) => item.visits === maxVisits,
                                );
                                return popularExit ? popularExit.visits : 0;
                              })()}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1">
                              Highest exit count
                            </p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <p className="text-gray-600 text-sm font-medium">
                              Avg Exit Time
                            </p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                              {(() => {
                                const totalVisits = exitTrafficData.reduce(
                                  (sum, item) => sum + (item.visits || 0),
                                  0,
                                );
                                const weightedTime = exitTrafficData.reduce(
                                  (sum, item) =>
                                    sum +
                                    (item.avgTimeSpent || 0) *
                                      (item.visits || 0),
                                  0,
                                );
                                return totalVisits > 0
                                  ? (weightedTime / totalVisits).toFixed(2)
                                  : "0.00";
                              })()}
                              s
                            </h3>
                            <p className="text-gray-500 text-xs mt-1">
                              Average time before exit
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h4 className="text-base font-semibold text-gray-900">
                              Exit Destinations
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Where users go after leaving this page
                            </p>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Destination Page
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Exit Visits
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Avg Time on Page
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Exit Rate
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {exitTrafficData
                                  .sort(
                                    (a, b) => (b.visits || 0) - (a.visits || 0),
                                  )
                                  .map((item, index) => {
                                    const totalExits = exitTrafficData.reduce(
                                      (sum, i) => sum + (i.visits || 0),
                                      0,
                                    );
                                    const exitRate =
                                      totalExits > 0
                                        ? (
                                            ((item.visits || 0) / totalExits) *
                                            100
                                          ).toFixed(1)
                                        : 0;

                                    return (
                                      <tr
                                        key={index}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-6 py-4">
                                          <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                              {getPageFriendlyName(
                                                item.nextPage,
                                              )}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate max-w-xs">
                                              {item.nextPage}
                                            </p>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                            {item.visits || 0} exits
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span className="text-lg font-bold text-gray-900">
                                            {item.avgTimeSpent || 0}s
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="w-24">
                                            <div className="flex items-center">
                                              <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                  className="bg-purple-600 h-2 rounded-full"
                                                  style={{
                                                    width: `${Math.min(100, exitRate)}%`,
                                                  }}
                                                ></div>
                                              </div>
                                              <span className="ml-2 text-sm font-medium text-gray-700">
                                                {exitRate}%
                                              </span>
                                            </div>
                                          </div>
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
                      <div className="text-center py-12">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-900 font-semibold text-lg mb-2">
                          No Exit Traffic Data
                        </p>
                        <p className="text-gray-600">
                          No data available for where users go from this page
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                {trafficLoading ? (
                  <LoadingSpinner text="Loading traffic data..." />
                ) : trafficError ? (
                  <ErrorDisplay
                    error={trafficError}
                    onRetry={handleShowTrafficFlow}
                  />
                ) : trafficData && trafficData.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-gray-600 text-sm font-medium">
                          Total Transitions
                        </p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                          {trafficData
                            .reduce(
                              (sum, item) => sum + (item.transitions || 0),
                              0,
                            )
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
                          {(() => {
                            const totalTransitions = trafficData.reduce(
                              (sum, item) => sum + (item.transitions || 0),
                              0,
                            );
                            const weightedTime = trafficData.reduce(
                              (sum, item) =>
                                sum +
                                (item.avgTimeSpent || 0) *
                                  (item.transitions || 0),
                              0,
                            );
                            return totalTransitions > 0
                              ? (weightedTime / totalTransitions).toFixed(2)
                              : "0.00";
                          })()}
                          s
                        </h3>
                        <p className="text-gray-500 text-xs mt-1">
                          Weighted average per transition
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Traffic Flow Overview
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Click on any page to see detailed entry/exit analysis
                        </p>
                      </div>

                      <div className="block sm:hidden divide-y divide-gray-200">
                        {trafficData.map((item, index) => (
                          <div
                            key={index}
                            className="p-4 hover:bg-gray-50 cursor-pointer"
                            onClick={() =>
                              handlePageTrafficDetails(item.toPage)
                            }
                          >
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
                                    <span className="truncate">
                                      {item.toPage}
                                    </span>
                                  </div>
                                </div>
                                <ChevronRight
                                  size={16}
                                  className="text-gray-400"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">
                                    Transitions
                                  </p>
                                  <p className="text-lg font-bold text-purple-700">
                                    {item.transitions || 0}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">
                                    Avg Time
                                  </p>
                                  <p className="text-lg font-bold text-blue-700">
                                    {item.avgTimeSpent || 0}s
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

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
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {trafficData.map((item, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() =>
                                  handlePageTrafficDetails(item.toPage)
                                }
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
                                    {item.transitions || 0} transitions
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-lg font-bold text-gray-900">
                                    {item.avgTimeSpent || 0}s
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-purple-600 hover:text-purple-800 font-medium text-sm">
                                    Analyze →
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

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
                              ...trafficData.map(
                                (item) => item.transitions || 0,
                              ),
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
                              ...trafficData.map(
                                (item) => item.avgTimeSpent || 0,
                              ),
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const PageTimeAnalysisModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
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

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {pageTimeAnalysis ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Top Pages by Average Time
                    </h3>
                    <div className="h-56 sm:h-64 lg:h-80">
                      <TopPagesChart />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Performance Metrics
                    </h3>
                    <div className="space-y-4 sm:space-y-6">
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

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Page Performance Details
                    </h3>
                  </div>

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
        <div className="mb-8">
          <div className="bg-white shadow-sm p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <PageTimeStatCard
                  title="Simple Average"
                  value={pageTimeAnalysis.simpleAverage}
                  icon={Calculator}
                  color="#3b82f6"
                  // subtitle={`Across ${pageTimeAnalysis.totalValidPages} pages`}
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

              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                    Page Performance Ranking
                  </h3>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Top {Math.min(5, pageTimeAnalysis.allPages.length)}
                  </div>
                </div>

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

      {showPageTimeModal && <PageTimeAnalysisModal />}

      {showTrafficModal && <TrafficAnalysisModal />}
    </div>
  );
};

export default AnalyticsDashboard;
