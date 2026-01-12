import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FileText, HelpCircle, BookOpen, Menu, X } from "lucide-react";

const ContentManager = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: "privacy",
      label: "Privacy Policy",
      icon: FileText,
      color: "indigo",
      colorClasses: {
        text: "text-indigo-600",
        bg: "bg-indigo-600",
        bgLight: "bg-indigo-50",
      },
      path: "privacy-policy",
    },
    {
      id: "faq",
      label: "FAQ",
      icon: HelpCircle,
      color: "green",
      colorClasses: {
        text: "text-green-600",
        bg: "bg-green-600",
        bgLight: "bg-green-50",
      },
      path: "faq",
    },
    {
      id: "story",
      label: "Our Story",
      icon: BookOpen,
      color: "purple",
      colorClasses: {
        text: "text-purple-600",
        bg: "bg-purple-600",
        bgLight: "bg-purple-50",
      },
      path: "our-story",
    },
  ];

  // Get current active tab based on route
  const getActiveTab = () => {
    const currentPath = location.pathname.split("/").pop() || "";
    const activeTab = tabs.find(
      (tab) => location.pathname.includes(tab.path) || currentPath === tab.path
    );
    return activeTab || tabs[0];
  };

  const activeTabInfo = getActiveTab();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between py-4 md:hidden">
            <div className="flex items-center gap-3">
              {React.createElement(activeTabInfo.icon, {
                className: `${activeTabInfo.colorClasses.text} w-6 h-6`,
              })}
              <h1 className="text-lg font-bold text-gray-800">
                {activeTabInfo.label}
              </h1>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTabInfo.id === tab.id;
                return (
                  <NavLink
                    key={tab.id}
                    to={tab.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive: isNavActive }) => {
                      const active = isNavActive || activeTabInfo.id === tab.id;
                      return `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        active
                          ? `${tab.colorClasses.bgLight} ${tab.colorClasses.text}`
                          : "text-gray-600 hover:bg-gray-50"
                      }`;
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    {(activeTabInfo.id === tab.id ||
                      location.pathname.includes(tab.path)) && (
                      <div
                        className={`ml-auto w-2 h-2 rounded-full ${tab.colorClasses.bg}`}
                      ></div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* Desktop Header */}
          <div className="hidden md:flex md:items-center md:justify-between py-4">
            <div className="flex items-center gap-3">
              {React.createElement(activeTabInfo.icon, {
                className: `${activeTabInfo.colorClasses.text} w-6 h-6`,
              })}
              <h1 className="text-xl font-bold text-gray-800">
                Content Manager
              </h1>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex gap-2 lg:gap-4 border-b-2 border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabInfo.id === tab.id;
              return (
                <NavLink
                  key={tab.id}
                  to={tab.path}
                  className={({ isActive: isNavActive }) => {
                    const active = isNavActive || activeTabInfo.id === tab.id;
                    return `flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 font-medium transition-all relative whitespace-nowrap ${
                      active
                        ? tab.colorClasses.text
                        : "text-gray-600 hover:text-gray-800"
                    }`;
                  }}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-sm lg:text-base">{tab.label}</span>
                  {(activeTabInfo.id === tab.id ||
                    location.pathname.includes(tab.path)) && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.colorClasses.bg}`}
                    ></div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
