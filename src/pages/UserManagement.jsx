import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { exportToCSV } from "../utils/exportCSV";
import {
  Users,
  RefreshCw,
  UserCheck,
  UserX,
  Search,
  Mail,
  Phone,
  AlertCircle,
  Download,
  Eye,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown,
  Shield,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BarChart3,
  Tag,
  Package,
  X,
} from "lucide-react";

const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const usersPerPage = 5;

  // View modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const handleView = (user) => {
    setSelectedUser(user || null);
    setViewModalOpen(true);
  };

  const closeView = () => {
    setViewModalOpen(false);
    setSelectedUser(null);
  };

  const handleExportCSV = async () => {
    if (filteredUsers.length === 0) {
      setError("No users to export!");
      return;
    }

    setExporting(true);
    setError(null);

    try {
      const result = await exportToCSV(filteredUsers, activeTab, getUserField);
      console.log(`✅ Exported ${result.count} users to ${result.fileName}`);
    } catch (error) {
      console.error("Export failed:", error);
      setError(`Export failed: ${error.message}`);
    } finally {
      setExporting(false);
    }
  };

  // Fetch active users
  const {
    data: activeUsers = [],
    isLoading: activeUsersLoading,
    error: activeUsersError,
    refetch: refetchActiveUsers,
    isFetching: activeUsersFetching,
  } = useQuery({
    queryKey: ["active-users"],
    queryFn: async () => {
      const response = await fetch("https://api.houseofresha.com/data");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const userData = await response.json();
      let usersArray = userData;
      if (!Array.isArray(userData)) {
        usersArray = userData.users || userData.data || userData.result || [];
      }
      return usersArray;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Fetch inactive users
  const {
    data: inactiveUsers = [],
    isLoading: inactiveUsersLoading,
    error: inactiveUsersError,
    refetch: refetchInactiveUsers,
    isFetching: inactiveUsersFetching,
  } = useQuery({
    queryKey: ["inactive-users"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.houseofresha.com/inactive-users"
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const userData = await response.json();
      let usersArray = userData;
      if (!Array.isArray(userData)) {
        usersArray = userData.users || userData.data || userData.result || [];
      }
      return usersArray;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const getUserField = (user, fieldNames) => {
    for (let field of fieldNames) {
      if (
        user[field] !== undefined &&
        user[field] !== null &&
        user[field] !== ""
      ) {
        return user[field];
      }
    }
    return "N/A";
  };

  const handleRefreshAll = () => {
    setError(null);
    refetchActiveUsers();
    refetchInactiveUsers();
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const isLoading = activeUsersLoading || inactiveUsersLoading;
  const isFetching = activeUsersFetching || inactiveUsersFetching;
  const hasError = activeUsersError || inactiveUsersError;

  const currentUsers = activeTab === "active" ? activeUsers : inactiveUsers;

  const sortedUsers = [...currentUsers].sort((a, b) => {
    const aName = getUserField(a, [
      "firstname",
      "firstName",
      "first_name",
      "fname",
      "name",
    ]).toLowerCase();
    const bName = getUserField(b, [
      "firstname",
      "firstName",
      "first_name",
      "fname",
      "name",
    ]).toLowerCase();

    if (sortBy === "name") {
      return sortOrder === "asc"
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const firstName = getUserField(user, [
      "firstname",
      "firstName",
      "first_name",
      "fname",
      "name",
    ]).toLowerCase();
    const lastName = getUserField(user, [
      "lastname",
      "lastName",
      "last_name",
      "lname",
      "surname",
    ]).toLowerCase();
    const email = getUserField(user, [
      "email",
      "emailAddress",
      "email_address",
    ]).toLowerCase();
    const phone = getUserField(user, [
      "phone",
      "phoneNumber",
      "phone_number",
      "number",
      "mobile",
      "contact",
    ]).toLowerCase();

    return (
      firstName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      email.includes(searchLower) ||
      phone.includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsersPage = filteredUsers.slice(startIndex, endIndex);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Stats calculations
  const totalActiveUsers = activeUsers.length;
  const totalInactiveUsers = inactiveUsers.length;
  const totalUsers = totalActiveUsers + totalInactiveUsers;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Manage Users
                </h1>
                <p className="text-sm text-gray-600">
                  Monitor and manage your user base effectively
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* <button
                onClick={handleRefreshAll}
                disabled={isFetching}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Users}
            label="Total Users"
            value={isLoading ? "..." : totalUsers}
            color="bg-blue-500"
          />
          <StatsCard
            icon={UserCheck}
            label="Active Users"
            value={isLoading ? "..." : totalActiveUsers}
            color="bg-green-500"
          />
          <StatsCard
            icon={UserX}
            label="Inactive Users"
            value={isLoading ? "..." : totalInactiveUsers}
            color="bg-red-500"
          />
          <StatsCard
            icon={BarChart3}
            label="Search Results"
            value={filteredUsers.length}
            color="bg-purple-500"
          />
        </div>

        {/* Search & Tabs Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("active")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  activeTab === "active"
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Active ({totalActiveUsers})
              </button>
              <button
                onClick={() => setActiveTab("inactive")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  activeTab === "inactive"
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <UserX className="w-4 h-4" />
                Inactive ({totalInactiveUsers})
              </button>
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              disabled={isLoading || exporting || filteredUsers.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 whitespace-nowrap"
            >
              {exporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export CSV ({filteredUsers.length})
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-indigo-600">
              {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}
            </span>{" "}
            of <span className="font-semibold">{filteredUsers.length}</span>{" "}
            users
            {searchTerm && (
              <span>
                {" "}
                matching "
                <span className="font-semibold text-gray-900">
                  {searchTerm}
                </span>
                "
              </span>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <AlertCircle className="text-red-600 w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-red-800 mb-2">
                Error Loading Users
              </h3>
              <p className="text-red-600 mb-4">
                {activeUsersError?.message || inactiveUsersError?.message}
              </p>
              <button
                onClick={handleRefreshAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && !hasError && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentUsersPage.map((user, index) => (
                    <tr
                      key={user.id || user._id || index}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${
                              activeTab === "active"
                                ? "bg-green-100"
                                : "bg-red-100"
                            } flex items-center justify-center font-bold ${
                              activeTab === "active"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {getUserField(user, [
                              "firstname",
                              "firstName",
                              "first_name",
                              "fname",
                              "name",
                            ]).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {getUserField(user, [
                                "firstname",
                                "firstName",
                                "first_name",
                                "fname",
                                "name",
                              ])}{" "}
                              {getUserField(user, [
                                "lastname",
                                "lastName",
                                "last_name",
                                "lname",
                                "surname",
                              ])}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {user.id || user._id || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {getUserField(user, [
                              "email",
                              "emailAddress",
                              "email_address",
                            ])}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {getUserField(user, [
                              "phone",
                              "phoneNumber",
                              "phone_number",
                              "number",
                              "mobile",
                              "contact",
                            ])}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                              activeTab === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {activeTab === "active" ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleView(user)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div
                  className={`w-16 h-16 rounded-full ${
                    activeTab === "active" ? "bg-green-100" : "bg-red-100"
                  } flex items-center justify-center mx-auto mb-4`}
                >
                  {activeTab === "active" ? (
                    <UserCheck className="text-green-600 w-8 h-8" />
                  ) : (
                    <UserX className="text-red-600 w-8 h-8" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {searchTerm ? "No users found" : `No ${activeTab} users`}
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search"
                    : `There are no ${activeTab} users at the moment`}
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Page <span className="font-semibold">{currentPage}</span> of{" "}
                    <span className="font-semibold">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* First Page */}
                    <button
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>

                    {/* Previous Page */}
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
                                : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    {/* Next Page */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Last Page */}
                    <button
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    {usersPerPage} users per page
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User View Modal */}
      {/* {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeView}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-lg">
                  {getUserField(selectedUser, [
                    "firstname",
                    "firstName",
                    "name",
                  ]).charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {getUserField(selectedUser, [
                      "firstname",
                      "firstName",
                      "name",
                    ])}{" "}
                    {getUserField(selectedUser, ["lastname", "lastName"])}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ID: {selectedUser.id || selectedUser._id || "N/A"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeView}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Contact
                </h4>
                <div className="text-sm text-gray-700">
                  <strong>Email:</strong>{" "}
                  {getUserField(selectedUser, ["email", "emailAddress"])}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <strong>Phone:</strong>{" "}
                  {getUserField(selectedUser, [
                    "phone",
                    "phoneNumber",
                    "mobile",
                  ])}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <strong>Last Login:</strong>{" "}
                  {selectedUser.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleString()
                    : "N/A"}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                  Profile
                </h4>
                <div className="text-sm text-gray-700">
                  <strong>Role:</strong>{" "}
                  {getUserField(selectedUser, ["role", "roles"])}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <strong>Created at:</strong>{" "}
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString()
                    : "N/A"}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <strong>Address:</strong>{" "}
                  {getUserField(selectedUser, ["address", "location", "city"])}
                </div>
              </div>

            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={closeView}
                className="px-4 py-2 bg-gray-100 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}

      {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeView}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                      <span className="text-white text-2xl font-bold">
                        {getUserField(selectedUser, [
                          "firstname",
                          "firstName",
                          "name",
                        ])
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {getUserField(selectedUser, [
                        "firstname",
                        "firstName",
                        "name",
                      ])}{" "}
                      {getUserField(selectedUser, ["lastname", "lastName"])}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                        {getUserField(selectedUser, ["role", "roles"])}
                      </span>
                      <span className="text-white/80 text-sm">
                        ID: {selectedUser.id || selectedUser._id || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeView}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors group"
                >
                  <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800">
                      Contact Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-900">
                          {getUserField(selectedUser, [
                            "email",
                            "emailAddress",
                          ]) || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-900">
                          {getUserField(selectedUser, [
                            "phone",
                            "phoneNumber",
                            "mobile",
                          ]) || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">
                          {getUserField(selectedUser, [
                            "address",
                            "location",
                            "city",
                          ]) || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-800">
                      Account Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Login</p>
                        <p className="font-medium text-gray-900">
                          {selectedUser.lastLogin
                            ? new Date(selectedUser.lastLogin).toLocaleString()
                            : "Never logged in"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Created</p>
                        <p className="font-medium text-gray-900">
                          {selectedUser.createdAt
                            ? new Date(selectedUser.createdAt).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Status</p>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              {/* <div className="mt-6 bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800">
                    Additional Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(selectedUser).map(([key, value]) => {
                    // Skip already displayed fields
                    const skipFields = [
                      "id",
                      "_id",
                      "firstname",
                      "firstName",
                      "name",
                      "lastname",
                      "lastName",
                      "email",
                      "emailAddress",
                      "phone",
                      "phoneNumber",
                      "mobile",
                      "address",
                      "location",
                      "city",
                      "role",
                      "roles",
                      "lastLogin",
                      "createdAt",
                      "profilePicture",
                      "avatar",
                    ];

                    if (skipFields.includes(key) || !value) return null;

                    return (
                      <div
                        key={key}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2h4l2 2h4a2 2 0 012 2v10a2 2 0 01-2 2H5z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-sm text-gray-900 font-medium mt-1 truncate">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : value.toString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div> */}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Updated just now</span> */}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeView}
                    className="px-5 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Close
                  </button>
                  {/* <button
              onClick={() => {
                // Add edit functionality here
                console.log('Edit user:', selectedUser);
                closeView();
              }}
              className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Edit Profile
            </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
