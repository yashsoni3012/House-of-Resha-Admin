import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../src/assets/resha-logo.png";

import {
  X,
  Home,
  Package,
  ShoppingCart,
  Users,
  Sparkles,
  LogOut,
  AlertTriangle,
  Image,
  BookOpen
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, toggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: Home },
    { path: "/products", name: "Products", icon: Package },
    { path: "/orders", name: "Orders", icon: ShoppingCart },
    { path: "/customers", name: "Customers", icon: Users },
    { path: "/mieh-by-resha", name: "Glow Rituals", icon: Sparkles },
    { path: "/banners", name: "Banner", icon: Image },
    { path: "/users", name: "Users", icon: Users },
    { path: "/blogs", name: "Blogs", icon: BookOpen },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) toggle();
  };

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  };

  const handleCancelLogout = () => setShowLogoutModal(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section - Improved */}
          <div className="p-6 border-b border-gray-200">
            {/* Logo Container - Perfectly centered */}
            <div className="flex flex-col items-center justify-center gap-4 mb-0">
              <div className="w-28 h-14 flex items-center justify-center">
                <img
                  src={logoImg}
                  alt="House of Resha Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Brand Name */}
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                House of Resha
              </h1>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={toggle}
              className="absolute top-4 right-4 lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-4 px-6 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-purple-50 border-l-4 border-purple-600 text-purple-600"
                      : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-200 text-white shadow-md hover:shadow-lg"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-200">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Logout
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Are you sure you want to logout?
                </p>
              </div>
            </div>

            {/* Body */}
            {/* <div className="p-6">
              <p className="text-gray-700">
                You will be redirected to the login page and will need to enter your
                credentials again to access the admin panel.
              </p>
            </div> */}

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
