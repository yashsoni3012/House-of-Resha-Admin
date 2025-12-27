import React, { useState } from "react";
import FashionManagement from "../components/FashionManagement";
import GlowRituals from "../components/GlowRituals";
import FeaturedImages from "../components/FeaturedImages";
import { ShoppingBag, Sparkles, Menu, X, Image } from "lucide-react";

const Products = () => {
  const [activeTab, setActiveTab] = useState("fashion");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: "fashion",
      label: "Fashion Management",
      icon: ShoppingBag,
      color: "pink",
    },
    {
      id: "glow",
      label: "Glow Rituals",
      icon: Sparkles,
      color: "purple",
    },
    {
      id: "featured",
      label: "Featured Images",
      icon: Image,
      color: "indigo",
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const getActiveTabInfo = () => {
    return tabs.find((tab) => tab.id === activeTab);
  };

  const activeTabInfo = getActiveTabInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="flex items-center justify-between py-4 md:hidden">
            <div className="flex items-center gap-3">
              {React.createElement(activeTabInfo.icon, {
                className: `w-6 h-6 text-${activeTabInfo.color}-600`,
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
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? `bg-${tab.color}-50 text-${tab.color}-600`
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div
                        className={`ml-auto w-2 h-2 rounded-full bg-${tab.color}-600`}
                      ></div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Desktop Tabs */}
          <div className="hidden md:flex gap-2 lg:gap-4 border-b-2 border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 lg:px-6 py-3 lg:py-4 font-medium transition-all relative whitespace-nowrap ${
                    isActive
                      ? `text-${tab.color}-600`
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-sm lg:text-base">{tab.label}</span>
                  {isActive && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-600`}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        {activeTab === "fashion" && <FashionManagement />}
        {activeTab === "glow" && <GlowRituals />}
        {activeTab === "featured" && <FeaturedImages />}
      </div>
    </div>
  );
};

export default Products;
