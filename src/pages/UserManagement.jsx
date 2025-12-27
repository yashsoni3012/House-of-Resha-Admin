// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { exportToCSV } from "../utils/exportCSV";

// import {
//   Users,
//   RefreshCw,
//   UserCheck,
//   UserX,
//   Search,
//   Mail,
//   Phone,
//   Activity,
//   Download,
//   Eye,
//   Filter,
//   Calendar,
//   ArrowUp,
//   ArrowDown,
//   Shield,
//   CheckCircle,
//   XCircle,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";

// const UserManagement = () => {
//   const [activeTab, setActiveTab] = useState("active");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("name");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [exporting, setExporting] = useState(false);
//   const usersPerPage = 5;

//   // download user data with CSV

//   const handleExportCSV = async () => {
//     if (filteredUsers.length === 0) {
//       alert("No users to export!");
//       return;
//     }

//     setExporting(true);

//     try {
//       const result = await exportToCSV(filteredUsers, activeTab, getUserField);

//       // Optional: Show success message
//       console.log(`✅ Exported ${result.count} users to ${result.fileName}`);

//       // Optional: Show notification
//       if (result.success) {
//         // You can add a toast notification here
//         console.log("Export successful!");
//       }
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert(`Export failed: ${error.message}`);
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Fetch active users
//   const {
//     data: activeUsers = [],
//     isLoading: activeUsersLoading,
//     error: activeUsersError,
//     refetch: refetchActiveUsers,
//     isFetching: activeUsersFetching,
//   } = useQuery({
//     queryKey: ["active-users"],
//     queryFn: async () => {
//       const response = await fetch("https://api.houseofresha.com/data");
//       if (!response.ok)
//         throw new Error(`HTTP error! status: ${response.status}`);
//       const userData = await response.json();
//       let usersArray = userData;
//       if (!Array.isArray(userData)) {
//         usersArray = userData.users || userData.data || userData.result || [];
//       }
//       return usersArray;
//     },
//     staleTime: 5 * 60 * 1000, // Cache for 5 minutes
//     gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
//     retry: 2,
//     refetchOnWindowFocus: false,
//   });

//   // Fetch inactive users
//   const {
//     data: inactiveUsers = [],
//     isLoading: inactiveUsersLoading,
//     error: inactiveUsersError,
//     refetch: refetchInactiveUsers,
//     isFetching: inactiveUsersFetching,
//   } = useQuery({
//     queryKey: ["inactive-users"],
//     queryFn: async () => {
//       const response = await fetch(
//         "https://api.houseofresha.com/inactive-users"
//       );
//       if (!response.ok)
//         throw new Error(`HTTP error! status: ${response.status}`);
//       const userData = await response.json();
//       let usersArray = userData;
//       if (!Array.isArray(userData)) {
//         usersArray = userData.users || userData.data || userData.result || [];
//       }
//       return usersArray;
//     },
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//     retry: 2,
//     refetchOnWindowFocus: false,
//   });

//   // Helper function to get user fields
//   const getUserField = (user, fieldNames) => {
//     for (let field of fieldNames) {
//       if (
//         user[field] !== undefined &&
//         user[field] !== null &&
//         user[field] !== ""
//       ) {
//         return user[field];
//       }
//     }
//     return "N/A";
//   };

//   const handleRefreshAll = () => {
//     refetchActiveUsers();
//     refetchInactiveUsers();
//     setCurrentPage(1);
//   };

//   const isLoading = activeUsersLoading || inactiveUsersLoading;
//   const isFetching = activeUsersFetching || inactiveUsersFetching;
//   const hasError = activeUsersError || inactiveUsersError;

//   // Get current users based on active tab
//   const currentUsers = activeTab === "active" ? activeUsers : inactiveUsers;

//   // Sort users
//   const sortedUsers = [...currentUsers].sort((a, b) => {
//     const aName = getUserField(a, [
//       "firstname",
//       "firstName",
//       "first_name",
//       "fname",
//       "name",
//     ]).toLowerCase();
//     const bName = getUserField(b, [
//       "firstname",
//       "firstName",
//       "first_name",
//       "fname",
//       "name",
//     ]).toLowerCase();

//     if (sortBy === "name") {
//       return sortOrder === "asc"
//         ? aName.localeCompare(bName)
//         : bName.localeCompare(aName);
//     }
//     return 0;
//   });

//   // Filter after sorting
//   const filteredUsers = sortedUsers.filter((user) => {
//     const searchLower = searchTerm.toLowerCase();
//     const firstName = getUserField(user, [
//       "firstname",
//       "firstName",
//       "first_name",
//       "fname",
//       "name",
//     ]).toLowerCase();
//     const lastName = getUserField(user, [
//       "lastname",
//       "lastName",
//       "last_name",
//       "lname",
//       "surname",
//     ]).toLowerCase();
//     const email = getUserField(user, [
//       "email",
//       "emailAddress",
//       "email_address",
//     ]).toLowerCase();
//     const phone = getUserField(user, [
//       "phone",
//       "phoneNumber",
//       "phone_number",
//       "number",
//       "mobile",
//       "contact",
//     ]).toLowerCase();

//     return (
//       firstName.includes(searchLower) ||
//       lastName.includes(searchLower) ||
//       email.includes(searchLower) ||
//       phone.includes(searchLower)
//     );
//   });

//   // Pagination calculations
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
//   const startIndex = (currentPage - 1) * usersPerPage;
//   const endIndex = startIndex + usersPerPage;
//   const currentUsersPage = filteredUsers.slice(startIndex, endIndex);

//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(field);
//       setSortOrder("asc");
//     }
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const goToFirstPage = () => setCurrentPage(1);
//   const goToLastPage = () => setCurrentPage(totalPages);
//   const goToPreviousPage = () =>
//     setCurrentPage((prev) => Math.max(prev - 1, 1));
//   const goToNextPage = () =>
//     setCurrentPage((prev) => Math.min(prev + 1, totalPages));

//   // Reset to first page when tab changes or search term changes
//   React.useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab, searchTerm]);

//   // Stats calculations
//   const totalActiveUsers = activeUsers.length;
//   const totalInactiveUsers = inactiveUsers.length;
//   const totalUsers = totalActiveUsers + totalInactiveUsers;
//   // const verifiedUsers = Math.round(totalUsers * 0.85);

//   return (
//     <div className="space-y-6">
//       {/* Header */}

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {/* Active Users Card */}
//         <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-gray-200 hover:shadow-xl transition-all duration-300">
//           <div className="flex items-center gap-3">
//             <div className="bg-green-100 p-5 rounded-lg">
//               <UserCheck className="text-green-600" size={20} />
//             </div>
//             <div>
//               <p className="text-gray-600 text-1xs font-medium">Active Users</p>
//               <h3 className="text-2xl font-bold text-gray-900">
//                 {isLoading ? "..." : totalActiveUsers}
//               </h3>
//             </div>
//           </div>
//         </div>

//         {/* Inactive Users Card */}
//         <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-gray-200 hover:shadow-xl transition-all duration-300">
//           <div className="flex items-center gap-3">
//             <div className="bg-red-100 p-5 rounded-lg">
//               <UserX className="text-red-600" size={20} />
//             </div>
//             <div>
//               <p className="text-gray-600 text-1xs font-medium">
//                 Inactive Users
//               </p>
//               <h3 className="text-2xl font-bold text-gray-900">
//                 {isLoading ? "..." : totalInactiveUsers}
//               </h3>
//             </div>
//           </div>
//         </div>

//         {/* Total Users Card */}
//         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-gray-200 hover:shadow-xl transition-all duration-300">
//           <div className="flex items-center gap-3">
//             <div className="bg-purple-100 p-5 rounded-lg">
//               <Users className="text-purple-600" size={20} />
//             </div>
//             <div>
//               <p className="text-gray-600 text-1xs font-medium">Total Users</p>
//               <h3 className="text-2xl font-bold text-gray-900">
//                 {isLoading ? "..." : totalUsers}
//               </h3>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main User Management Section */}
//       <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div>
//               <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
//                 <Users size={28} />
//                 User Management Dashboard
//               </h2>
//               <p className="text-purple-100 text-sm">
//                 Monitor and manage your user base effectively
//               </p>
//             </div>
//             {/* <button
//               onClick={handleRefreshAll}
//               disabled={isFetching}
//               className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 px-6 py-3 rounded-lg transition font-semibold disabled:opacity-50"
//             >
//               <RefreshCw
//                 size={18}
//                 className={isFetching ? "animate-spin" : ""}
//               />
//               <span>Refresh Data</span>
//             </button> */}
//           </div>
//         </div>

//         {/* Tabs & Controls */}
//         <div className="p-6 border-b bg-gray-50">
//           <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
//             {/* Tabs */}
//             <div className="flex flex-wrap gap-2 bg-white rounded-lg p-1 shadow-inner border border-gray-200">
//               <button
//                 onClick={() => setActiveTab("active")}
//                 className={`flex items-center justify-center gap-2 px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all flex-1 min-w-[140px] sm:min-w-0 ${
//                   activeTab === "active"
//                     ? "bg-green-500 text-white shadow-lg"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <UserCheck size={18} className="shrink-0" />
//                 <span className="whitespace-nowrap">Active</span>
//                 <span
//                   className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${
//                     activeTab === "active"
//                       ? "bg-white text-green-600"
//                       : "bg-gray-200 text-gray-700"
//                   }`}
//                 >
//                   {totalActiveUsers}
//                 </span>
//               </button>
//               <button
//                 onClick={() => setActiveTab("inactive")}
//                 className={`flex items-center justify-center gap-2 px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all flex-1 min-w-[140px] sm:min-w-0 ${
//                   activeTab === "inactive"
//                     ? "bg-red-500 text-white shadow-lg"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <UserX size={18} className="shrink-0" />
//                 <span className="whitespace-nowrap">Inactive</span>
//                 <span
//                   className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${
//                     activeTab === "inactive"
//                       ? "bg-white text-red-600"
//                       : "bg-gray-200 text-gray-700"
//                   }`}
//                 >
//                   {totalInactiveUsers}
//                 </span>
//               </button>
//             </div>

//             {/* Search & Filter */}
//             <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:max-w-2xl">
//               <div className="relative flex-1">
//                 <Search
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search users by name, email, or phone..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
//                 />
//                 {/* X button to clear search */}
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm("")}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                     aria-label="Clear search"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </button>
//                 )}
//               </div>

//               <button
//                 onClick={() => handleExportCSV()}
//                 disabled={isLoading || exporting || filteredUsers.length === 0}
//                 className="relative flex items-center justify-center gap-2 px-4 py-3 min-w-[100px] sm:min-w-[130px] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
//               >
//                 {/* Icon */}
//                 <div className="relative">
//                   {exporting ? (
//                     <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
//                   ) : (
//                     <Download size={18} />
//                   )}
//                 </div>

//                 {/* Text */}
//                 <span className="hidden sm:inline">
//                   {exporting ? "Exporting..." : "Export CSV"}
//                 </span>
//                 <span className="sm:hidden">
//                   {exporting ? "..." : "Export"}
//                 </span>

//                 {/* User count badge */}
//                 {!exporting && filteredUsers.length > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-white text-purple-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
//                     {filteredUsers.length}
//                   </span>
//                 )}
//               </button>
//             </div>

//             {/* Export Button */}
//             {/* <button className="flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium shadow-lg">
//               <Download size={18} />
//               <span className="hidden sm:inline">Export CSV</span>
//             </button> */}
//           </div>

//           {/* Results Info */}
//           <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//             <div className="text-sm text-gray-600">
//               Showing{" "}
//               <span className="font-semibold text-gray-900">
//                 {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}
//               </span>{" "}
//               of{" "}
//               <span className="font-semibold text-gray-900">
//                 {filteredUsers.length}
//               </span>{" "}
//               users
//               {searchTerm && (
//                 <span>
//                   {" "}
//                   matching "
//                   <span className="font-semibold text-gray-900">
//                     {searchTerm}
//                   </span>
//                   "
//                 </span>
//               )}
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-600">Sort by:</span>
//               <button
//                 onClick={() => handleSort("name")}
//                 className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium"
//               >
//                 Name
//                 {sortBy === "name" &&
//                   (sortOrder === "asc" ? (
//                     <ArrowUp size={14} />
//                   ) : (
//                     <ArrowDown size={14} />
//                   ))}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Loading State */}
//         {isLoading && (
//           <div className="text-center py-16">
//             <div className="inline-flex flex-col items-center gap-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
//               <p className="text-gray-600 font-medium">Loading users...</p>
//             </div>
//           </div>
//         )}

//         {/* Error State */}
//         {hasError && (
//           <div className="p-8">
//             <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
//                 <Activity className="text-red-600" size={32} />
//               </div>
//               <h3 className="text-lg font-bold text-red-800 mb-2">
//                 Error Loading Users
//               </h3>
//               <p className="text-red-600 mb-4">
//                 {activeUsersError?.message || inactiveUsersError?.message}
//               </p>
//               <button
//                 onClick={handleRefreshAll}
//                 className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold shadow-lg"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Users Table */}
//         {!isLoading && !hasError && (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead
//                 className={`${
//                   activeTab === "active" ? "bg-green-50" : "bg-red-50"
//                 }`}
//               >
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
//                     User
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 hidden lg:table-cell">
//                     Contact Info
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 hidden md:table-cell">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {currentUsersPage.map((user, index) => (
//                   <tr
//                     key={user.id || user._id || index}
//                     className={`hover:${
//                       activeTab === "active" ? "bg-green-50" : "bg-red-50"
//                     } transition-colors`}
//                   >
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`w-12 h-12 rounded-full ${
//                             activeTab === "active"
//                               ? "bg-green-100"
//                               : "bg-red-100"
//                           } flex items-center justify-center font-bold text-lg ${
//                             activeTab === "active"
//                               ? "text-green-700"
//                               : "text-red-700"
//                           }`}
//                         >
//                           {getUserField(user, [
//                             "firstname",
//                             "firstName",
//                             "first_name",
//                             "fname",
//                             "name",
//                           ]).charAt(0)}
//                         </div>
//                         <div>
//                           <div className="text-sm font-semibold text-gray-900">
//                             {getUserField(user, [
//                               "firstname",
//                               "firstName",
//                               "first_name",
//                               "fname",
//                               "name",
//                             ])}{" "}
//                             {getUserField(user, [
//                               "lastname",
//                               "lastName",
//                               "last_name",
//                               "lname",
//                               "surname",
//                             ])}
//                           </div>
//                           <div className="text-xs text-gray-500 mt-1">
//                             User ID: {user.id || user._id || "N/A"}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-2 text-sm text-gray-700">
//                           <Mail size={14} className="text-gray-400" />
//                           {getUserField(user, [
//                             "email",
//                             "emailAddress",
//                             "email_address",
//                           ])}
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-gray-700">
//                           <Phone size={14} className="text-gray-400" />
//                           {getUserField(user, [
//                             "phone",
//                             "phoneNumber",
//                             "phone_number",
//                             "number",
//                             "mobile",
//                             "contact",
//                           ])}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
//                       <div className="flex items-center gap-2">
//                         <div
//                           className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
//                             activeTab === "active"
//                               ? "bg-green-100 text-green-700"
//                               : "bg-red-100 text-red-700"
//                           }`}
//                         >
//                           {activeTab === "active" ? (
//                             <>
//                               <CheckCircle size={12} />
//                               Active
//                             </>
//                           ) : (
//                             <>
//                               <XCircle size={12} />
//                               Inactive
//                             </>
//                           )}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {user.lastLogin
//                             ? "Recently active"
//                             : "No recent activity"}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition text-sm font-medium">
//                           <Eye size={14} />
//                           <span className="hidden sm:inline">View</span>
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {filteredUsers.length === 0 && (
//               <div className="text-center py-16">
//                 <div className="inline-flex flex-col items-center gap-4">
//                   <div
//                     className={`w-20 h-20 rounded-full ${
//                       activeTab === "active" ? "bg-green-100" : "bg-red-100"
//                     } flex items-center justify-center`}
//                   >
//                     {activeTab === "active" ? (
//                       <UserCheck className="text-green-600" size={40} />
//                     ) : (
//                       <UserX className="text-red-600" size={40} />
//                     )}
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-800 mb-1">
//                       {searchTerm ? "No users found" : `No ${activeTab} users`}
//                     </h3>
//                     <p className="text-gray-500 text-sm">
//                       {searchTerm
//                         ? "Try adjusting your search"
//                         : `There are no ${activeTab} users at the moment`}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Pagination Controls */}
//             {filteredUsers.length > 0 && (
//               <div className="border-t border-gray-200 px-6 py-4">
//                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                   <div className="text-sm text-gray-600">
//                     Page <span className="font-semibold">{currentPage}</span> of{" "}
//                     <span className="font-semibold">{totalPages}</span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     {/* First Page */}
//                     <button
//                       onClick={goToFirstPage}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       <ChevronsLeft size={16} />
//                     </button>

//                     {/* Previous Page */}
//                     <button
//                       onClick={goToPreviousPage}
//                       disabled={currentPage === 1}
//                       className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       <ChevronLeft size={16} />
//                     </button>

//                     {/* Page Numbers */}
//                     <div className="flex gap-1">
//                       {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                         (page) => (
//                           <button
//                             key={page}
//                             onClick={() => handlePageChange(page)}
//                             className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
//                               currentPage === page
//                                 ? "bg-purple-600 text-white shadow-lg"
//                                 : "border border-gray-300 hover:bg-gray-50 text-gray-700"
//                             }`}
//                           >
//                             {page}
//                           </button>
//                         )
//                       )}
//                     </div>

//                     {/* Next Page */}
//                     <button
//                       onClick={goToNextPage}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       <ChevronRight size={16} />
//                     </button>

//                     {/* Last Page */}
//                     <button
//                       onClick={goToLastPage}
//                       disabled={currentPage === totalPages}
//                       className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                     >
//                       <ChevronsRight size={16} />
//                     </button>
//                   </div>

//                   <div className="text-sm text-gray-600">
//                     {usersPerPage} users per page
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagement;

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
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="text-sm text-gray-600">
                  Monitor and manage your user base effectively
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefreshAll}
                disabled={isFetching}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
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
                            ]).charAt(0)}
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
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
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
    </div>
  );
};

export default UserManagement;
