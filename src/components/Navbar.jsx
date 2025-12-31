// import React from "react";
// import { useLocation, useMatch } from "react-router-dom";
// import { Menu, Bell, Search } from "lucide-react";
// import { useAuthStore } from "../store/authStore";

// const Navbar = ({ toggle }) => {
//   const location = useLocation();
//   const user = useAuthStore((state) => state.user);

//   // detect dynamic route
//   const isEditProduct = useMatch("/edit-product/:id");

//   const pageTitles = {
//     "/dashboard": "Dashboard",
//     "/banners": "Banners",
//     "/products": "Products",
//     "/orders": "Orders",
//     "/customers": "Customers",
//     "/mieh-by-resha": "MIEH by Resha",
//     "/users": "User Management",
//     "/blogs": "Blog Management",
//     "/add-product": "Add Product",
//   };

//   let pageTitle = pageTitles[location.pathname] || "Dashboard";

//   // 🔥 FIX FOR EDIT PRODUCT
//   if (isEditProduct) {
//     pageTitle = "Edit Product";
//   }

//   return (
//     <nav className="bg-white shadow-md px-4 py-4 lg:px-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={toggle}
//             className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
//           >
//             <Menu size={24} />
//           </button>
//           <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
//             {pageTitle}
//           </h2>
//         </div>

//         <div className="flex items-center gap-3 lg:gap-4">
//           <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg">
//             <Search size={20} className="text-gray-600" />
//           </button>

//           <button className="relative p-2 hover:bg-gray-100 rounded-lg">
//             <Bell size={20} className="text-gray-600" />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//           </button>

//           <div className="flex items-center gap-2 lg:gap-3 pl-3 border-l border-gray-300">
//             <div className="hidden sm:block text-right">
//               <p className="text-sm font-semibold text-gray-800">
//                 {user?.name || "Admin User"}
//               </p>
//               <p className="text-xs text-gray-500">Administrator</p>
//             </div>

//             <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
//               {user?.name?.charAt(0) || "A"}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { Menu, Bell, Search, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";

// Define all available routes and their components (excluding edit pages)
const availableComponents = [
  { path: "/dashboard", name: "Dashboard", icon: "📊", category: "Overview" },
  { path: "/products", name: "Products", icon: "📦", category: "Inventory" },
  {
    path: "/add-product",
    name: "Add Product",
    icon: "➕",
    category: "Inventory",
  },
  { path: "/banners", name: "Banners", icon: "🖼️", category: "Marketing" },
  {
    path: "/add-banner",
    name: "Add Banner",
    icon: "➕",
    category: "Marketing",
  },
  { path: "/blogs", name: "Blogs", icon: "📝", category: "Content" },
  { path: "/add-blog", name: "Add Blog", icon: "➕", category: "Content" },
  { path: "/orders", name: "Orders", icon: "📦", category: "Sales" },
  { path: "/customers", name: "Customers", icon: "👥", category: "Users" },
  { path: "/users", name: "Users", icon: "👤", category: "Management" },
  {
    path: "/products",
    name: "MIEH by Resha",
    icon: "⭐",
    category: "Brand",

    path: "/products",
    name: "Glow Rituals",
    Category: "Brand",
    icon: "✨",
  },
];

// List of pages to exclude from search (edit pages)
const excludedPages = [
  "/edit-product/:id",
  "/edit-blog/:id",
  "/edit-banner/:id",
  // Add other edit pages here if needed
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

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/banners": "Banners",
    "/add-banner": "Add Banner",
    "/products": "Products",
    "/orders": "Orders",
    "/customers": "Customers",
    "/mieh-by-resha": "MIEH by Resha",
    "/users": "User Management",
    "/blogs": "Blog Management",
    "/add-product": "Add Product",
    "/add-blog": "Add Blog",
    "/edit-product/:id": "Edit Product", // Still keep for page title
    "/edit-blog/:id": "Edit Blog", // Still keep for page title
    "/edit-banner/:id": "Edit Banner", // Added for edit banner page title
  };

  let pageTitle = pageTitles[location.pathname] || "Dashboard";

  // Set page title for edit pages
  if (isEditProduct) {
    pageTitle = "Edit Product";
  } else if (isEditBlog) {
    pageTitle = "Edit Blog";
  } else if (isEditBanner) {
    pageTitle = "Edit Banner";
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
      <nav className="bg-white shadow-md px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-4 relative search-container">
            {/* Search Button/Bar */}
            {isSearchOpen ? (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for pages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                      autoComplete="off"
                    />
                    <button
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.map(({ category, items }) => (
                      <div
                        key={category}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <div className="px-3 py-2 bg-gray-50">
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
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                          >
                            <span className="text-lg">{component.icon}</span>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-gray-800 group-hover:text-indigo-600">
                                {component.name}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      No results found
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try searching for a different term
                    </p>
                  </div>
                ) : (
                  <div className="p-6">
                    <p className="text-sm text-gray-500 text-center">
                      Start typing to search for pages
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {availableComponents.slice(0, 4).map((component) => (
                        <div
                          key={component.path}
                          className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded"
                        >
                          {component.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search size={20} className="text-gray-600" />
              </button>
            )}

            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-2 lg:gap-3 pl-3 border-l border-gray-300">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen overlay when search is open */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" />
      )}
    </>
  );
};

// Add the missing ChevronRight icon component
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
