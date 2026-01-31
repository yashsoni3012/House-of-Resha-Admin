import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Clock, Calendar, PlusCircle, ListChecks, Menu, X } from "lucide-react";

const Slots = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      label: "Manage Slots",
      path: "/slots/manage",
      icon: ListChecks,
    },
    {
      label: "Appointments",
      path: "/slots/appointments",
      icon: Calendar,
    },
    {
      label: "Create Slots",
      path: "/slots/create",
      icon: PlusCircle,
    },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Mobile Header with Menu Button */}
          <div className="flex items-center justify-between py-3 sm:hidden">
            <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Slots
            </h1>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex gap-6">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <nav className="sm:hidden pb-3 space-y-1">
              {navItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-4 rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-purple-50 text-purple-600 border-l-4 border-purple-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Child Pages Render Here */}
      <div className="max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Slots;