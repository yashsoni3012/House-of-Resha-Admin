import React, { useState, useEffect, useRef } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { Menu, Bell, Search, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";

// Define all available routes and their components (only those that exist in App.jsx)
const availableComponents = [
  { path: "/dashboard", name: "Dashboard", icon: "📊", category: "Overview" },

  // Products Management
  {
    path: "/fashion",
    name: "Fashion Management",
    icon: "👕",
    category: "Products",
  },
  {
    path: "/glow-rituals",
    name: "Glow Rituals",
    icon: "✨",
    category: "Products",
  },
  {
    path: "/featured-images",
    name: "Featured Images",
    icon: "🖼️",
    category: "Products",
  },
  {
    path: "/add-perfume",
    name: "Add Perfume",
    icon: "➕",
    category: "Products",
  },
  {
    path: "/add-product",
    name: "Add Product",
    icon: "➕",
    category: "Products",
  },

  // Banner Management
  { path: "/banners", name: "Banners", icon: "🖼️", category: "Marketing" },
  {
    path: "/add-banner",
    name: "Add Banner",
    icon: "➕",
    category: "Marketing",
  },

  // Blog Management
  { path: "/blogs", name: "Blogs", icon: "📝", category: "Content" },
  { path: "/add-blog", name: "Add Blog", icon: "➕", category: "Content" },

  // Orders Management
  { path: "/orders", name: "Orders", icon: "📦", category: "Sales" },

  // Customer Management
  { path: "/customers", name: "Customers", icon: "👥", category: "Users" },

  // User Management
  { path: "/users", name: "Users", icon: "👤", category: "Management" },

  // Content Management (Main route)
  {
    path: "/content",
    name: "Content Manager",
    icon: "📄",
    category: "Content",
  },

  // Content Management - Sub Routes
  {
    path: "/content/privacy-policy",
    name: "Privacy Policy",
    icon: "🔒",
    category: "Content",
  },
  {
    path: "/content/faq",
    name: "FAQ",
    icon: "❓",
    category: "Content",
  },
  {
    path: "/content/our-story",
    name: "Our Story",
    icon: "📖",
    category: "Content",
  },
];

// List of pages to exclude from search (edit pages only)
const excludedPages = [
  "/edit-product/:id",
  "/edit-blog/:id",
  "/edit-banner/:id",
  "/edit-perfume/:id",
];

const Navbar = ({ toggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const searchInputRef = useRef(null);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // detect dynamic route
  const isEditProduct = useMatch("/edit-product/:id");
  const isEditBlog = useMatch("/edit-blog/:id");
  const isEditBanner = useMatch("/edit-banner/:id");
  const isEditPerfume = useMatch("/edit-perfume/:id");

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/banners": "Banners",
    "/add-banner": "Add Banner",
    "/fashion": "Products",
    "/glow-rituals": "Products",
    "/featured-images": "Products",
    "/add-perfume": "Add Perfume",
    "/orders": "Orders",
    "/customers": "Customers",
    "/users": "Users",
    "/blogs": "Blogs",
    "/add-product": "Add Product",
    "/add-blog": "Add Blog",
    "/content": "Content Manager",
    "/content/privacy-policy": "Content Manager",
    "/content/faq": "Content Manager",
    "/content/our-story": "Content Manager",
    "/edit-product/:id": "Edit Product",
    "/edit-blog/:id": "Edit Blog",
    "/edit-banner/:id": "Edit Banner",
    "/edit-perfume/:id": "Edit Perfume",
    "/analytics": "Analytics",
  };

  let pageTitle = pageTitles[location.pathname] || "Dashboard";

  // Set page title for edit pages
  if (isEditProduct) {
    pageTitle = "Edit Product";
  } else if (isEditBlog) {
    pageTitle = "Edit Blog";
  } else if (isEditBanner) {
    pageTitle = "Edit Banner";
  } else if (isEditPerfume) {
    pageTitle = "Edit Perfume";
  }

  // Filter components based on search query and exclude edit pages
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    // Filter components that match search query and are not excluded
    const filtered = availableComponents.filter((component) => {
      // Check if this component matches search query
      const matchesSearch =
        component.name.toLowerCase().includes(query) ||
        component.category.toLowerCase().includes(query) ||
        component.path.toLowerCase().includes(query);

      // Check if this component is in excluded pages
      const isExcluded = excludedPages.some((excludedPath) => {
        // Handle dynamic routes (like :id) by checking pattern
        if (excludedPath.includes(":id")) {
          const pattern = excludedPath.replace(":id", ".*");
          return new RegExp(pattern).test(component.path);
        }
        return excludedPath === component.path;
      });

      return matchesSearch && !isExcluded;
    });

    // Group by category
    const groupedResults = filtered.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = [];
      }
      acc[component.category].push(component);
      return acc;
    }, {});

    // Convert to array format for rendering
    const resultsArray = Object.entries(groupedResults).map(
      ([category, items]) => ({
        category,
        items,
      })
    );

    setSearchResults(resultsArray);
  }, [searchQuery]);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle search item click
  const handleSearchItemClick = (path) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  // Handle search input keydown
  const handleSearchKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
    if (
      e.key === "Enter" &&
      searchResults.length > 0 &&
      searchResults[0].items.length > 0
    ) {
      // Navigate to first result
      handleSearchItemClick(searchResults[0].items[0].path);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && !event.target.closest(".search-container")) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  return (
    <>
      <nav className="bg-white shadow-md px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Left Section - Menu & Title */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
            <button
              onClick={toggle}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg lg:hidden flex-shrink-0 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 truncate">
              {pageTitle}
            </h2>
          </div>

          {/* Right Section - Search, Notifications, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 relative search-container flex-shrink-0">
            {/* Search Button/Bar */}
            {isSearchOpen ? (
              <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 top-0 sm:top-full mt-2 w-auto sm:w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[calc(100vh-5rem)] sm:max-h-[32rem]">
                {/* Search Input */}
                <div className="p-2.5 sm:p-3 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <div className="relative">
                    <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                      autoComplete="off"
                    />
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Close search"
                    >
                      <X size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                <div
                  className="overflow-y-auto"
                  style={{ maxHeight: "calc(100% - 60px)" }}
                >
                  {searchResults.length > 0 ? (
                    <div>
                      {searchResults.map(({ category, items }) => (
                        <div
                          key={category}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-50 sticky top-0 z-10">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {category}
                            </span>
                          </div>
                          {items.map((component) => (
                            <button
                              key={component.path}
                              onClick={() =>
                                handleSearchItemClick(component.path)
                              }
                              className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                            >
                              <span className="text-base sm:text-lg flex-shrink-0">
                                {component.icon}
                              </span>
                              <div className="flex-1 text-left min-w-0">
                                <p className="font-medium text-sm sm:text-base text-gray-800 group-hover:text-indigo-600 truncate">
                                  {component.name}
                                </p>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="p-6 sm:p-8 text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 font-medium">
                        No results found
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Try searching for a different term
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 sm:p-6">
                      <p className="text-xs sm:text-sm text-gray-500 text-center">
                        Start typing to search for pages
                      </p>
                      <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
                        {availableComponents.slice(0, 6).map((component) => (
                          <div
                            key={component.path}
                            className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded truncate"
                          >
                            {component.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                aria-label="Open search"
              >
                <Search size={18} className="sm:w-5 sm:h-5 text-gray-600" />
              </button>
            )}

            {/* Notification Bell */}
            {/* <button
              className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Notifications"
            >
              <Bell size={18} className="sm:w-5 sm:h-5 text-gray-600" />
              <span className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
            </button> */}

            {/* User Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 pl-1.5 sm:pl-2 lg:pl-3 border-l border-gray-300 flex-shrink-0">
              <div className="hidden md:block text-right">
                <p className="text-xs lg:text-sm font-semibold text-gray-800 truncate max-w-[120px] lg:max-w-none">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm lg:text-base flex-shrink-0">
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen overlay when search is open */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => {
            setIsSearchOpen(false);
            setSearchQuery("");
          }}
        />
      )}
    </>
  );
};

// ChevronRight icon component
const ChevronRight = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default Navbar;
