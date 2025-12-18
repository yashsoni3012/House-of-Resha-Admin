import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Bell, Search } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Navbar = ({ toggle }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/banners": "Banners",
    "/products": "Products",
    "/orders": "Orders",
    "/customers": "Customers",
    "/mieh-by-resha": "MIEH by Resha",
    "/users": "User Management",
    "/blogs": "Blog Management",
  };

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
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
        <div className="flex items-center gap-3 lg:gap-4">
          <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg">
            <Search size={20} className="text-gray-600" />
          </button>
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
  );
};

export default Navbar;
