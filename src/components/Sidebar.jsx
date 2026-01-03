import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoImg from "../../src/assets/resha-logo.png";

import {
  X,
  Home,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  AlertTriangle,
  Image,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, toggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: Home },
    { path: "/fashion", name: "Products", icon: Package },
    { path: "/banners", name: "Banner", icon: Image },
    { path: "/blogs", name: "Blogs", icon: BookOpen },
    { path: "/orders", name: "Orders", icon: ShoppingCart },
    { path: "/customers", name: "Customers", icon: Users },
    { path: "/users", name: "Users", icon: Users },
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

  // Check if current route is either fashion or featured-images
  const isProductsActive = () => {
    return (
      location.pathname === "/fashion" ||
      location.pathname === "/glow-rituals" ||
      location.pathname === "/featured-images"
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 lg:translate-x-0 shadow-xl lg:shadow-none`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="relative p-6 border-b border-gray-100">
            {/* Close button for mobile */}
            <button
              onClick={toggle}
              className="absolute top-5 right-5 lg:hidden text-gray-600 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>

            {/* Logo Container */}
            <div className="flex flex-col items-center justify-center gap-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-0"></div>
                <div className="relative w-40 h-20 bg-white rounded-xl p-2">
                  <img
                    src={logoImg}
                    alt="House of Resha Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Brand Name */}
              <div className="text-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  House of Resha
                </h1>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === "/fashion"
                    ? isProductsActive()
                    : location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 text-purple-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-r-full"></div>
                    )}

                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-gradient-to-br from-purple-100 to-pink-100"
                            : "group-hover:bg-gray-200"
                        }`}
                      >
                        <Icon
                          size={18}
                          className={
                            isActive ? "text-purple-600" : "text-gray-600"
                          }
                        />
                      </div>
                      <span className="font-semibold text-sm">{item.name}</span>
                    </div>

                    <ChevronRight
                      size={16}
                      className={`transition-all duration-200 ${
                        isActive
                          ? "text-purple-600 opacity-100 translate-x-0"
                          : "text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-gray-100">
            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-md transition-all duration-200 text-white shadow-md hover:shadow-lg text-sm font-semibold group"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all animate-in zoom-in duration-200 border border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    Confirm Logout
                  </h3>
                  <p className="text-sm text-gray-600 mt-1.5">
                    Are you sure you want to logout from your account?
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-5 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
