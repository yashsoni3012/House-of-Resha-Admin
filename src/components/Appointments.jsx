// import React, { useState, useEffect } from "react";
// import {
//   Calendar,
//   Clock,
//   User,
//   Phone,
//   Mail,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   RefreshCw,
//   Search,
//   Filter,
//   ChevronDown,
//   X,
//   Eye,
//   Edit2,
//   Package,
//   Users,
//   Tag,
//   Shield,
// } from "lucide-react";
// import axios from "axios";

// // Stats Card Component
// const StatsCard = ({ icon: Icon, label, value, color }) => (
//   <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-xs text-gray-500 font-medium">{label}</p>
//         <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
//       </div>
//       <div className={`p-2 rounded-lg ${color}`}>
//         <Icon className="w-5 h-5 text-white" />
//       </div>
//     </div>
//   </div>
// );

// // Notification Component
// function Notification({ message, type, onClose }) {
//   return (
//     <div className="fixed top-4 right-4 z-50 animate-slide-in">
//       <div
//         className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
//           type === "success"
//             ? "bg-green-500 text-white"
//             : "bg-red-500 text-white"
//         }`}
//       >
//         {type === "success" ? (
//           <CheckCircle size={24} />
//         ) : (
//           <AlertCircle size={24} />
//         )}
//         <span className="font-medium">{message}</span>
//         <button
//           onClick={onClose}
//           className="ml-4 text-white hover:text-gray-200"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// }

// // API Client - UPDATED with Axios
// class AppointmentsAPI {
//   constructor(baseURL = "https://api.houseofresha.com") {
//     this.axios = axios.create({
//       baseURL,
//       timeout: 10000,
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//     });
//   }

//   async getAllAppointments() {
//     try {
//       const response = await this.axios.get("/appointments");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       throw new Error(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to fetch appointments",
//       );
//     }
//   }

//   async updateAppointmentStatus(id, status) {
//     // Ensure status is valid
//     const validStatuses = ["booked", "cancelled", "completed"];
//     if (!validStatuses.includes(status)) {
//       throw new Error(
//         `Invalid status: ${status}. Must be one of: ${validStatuses.join(", ")}`,
//       );
//     }

//     try {
//       const response = await this.axios.patch(`/appointments/${id}`, {
//         status,
//       });
//       console.log("Update response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error updating appointment:", error);

//       // Enhanced error message
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to update appointment status";

//       throw new Error(
//         `HTTP ${error.response?.status || "Network Error"}: ${errorMessage}`,
//       );
//     }
//   }

//   // Test function to debug API
//   async testUpdateAPI(id) {
//     try {
//       const response = await this.axios.patch(`/appointments/${id}`, {
//         status: "cancelled",
//       });
//       console.log("Test API response:", response);
//       return {
//         status: response.status,
//         data: response.data,
//       };
//     } catch (error) {
//       console.error("Test API error:", error);
//       throw error;
//     }
//   }
// }

// const api = new AppointmentsAPI();

// // Status Change Modal
// function StatusModal({ appointment, isOpen, onClose, onConfirm }) {
//   const validStatuses = [
//     { value: "booked", label: "Booked", color: "bg-blue-100 text-blue-800" },
//     {
//       value: "cancelled",
//       label: "Cancelled",
//       color: "bg-red-100 text-red-800",
//     },
//     {
//       value: "completed",
//       label: "Completed",
//       color: "bg-purple-100 text-purple-800",
//     },
//   ];

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-md w-full p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
//             <Edit2 className="w-5 h-5 text-blue-600" />
//           </div>
//           <div>
//             <h3 className="font-bold text-gray-900">
//               Update Appointment Status
//             </h3>
//             <p className="text-sm text-gray-600">
//               Current Status:{" "}
//               <span className="font-semibold capitalize">
//                 {appointment?.status || "N/A"}
//               </span>
//             </p>
//           </div>
//         </div>

//         <div className="space-y-2 mb-6">
//           {validStatuses.map((status) => (
//             <button
//               key={status.value}
//               onClick={() => onConfirm(status.value)}
//               disabled={appointment?.status === status.value}
//               className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
//                 appointment?.status === status.value
//                   ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                   : `${status.color} hover:opacity-90`
//               }`}
//             >
//               {status.label}
//             </button>
//           ))}
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Appointment Details Modal
// function AppointmentDetailsModal({ appointment, isOpen, onClose }) {
//   if (!isOpen) return null;

//   // Get status color based on valid statuses
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "booked":
//         return "bg-blue-100 text-blue-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       case "completed":
//         return "bg-purple-100 text-purple-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
//           <div className="flex justify-between items-center gap-4">
//             <h2 className="text-xl font-bold text-gray-900">
//               Appointment Details
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Customer Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-blue-50 rounded-lg p-4">
//               <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 Customer Information
//               </h3>
//               <div className="space-y-2">
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Name:</span>{" "}
//                   {appointment.customerName || "N/A"}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Email:</span>{" "}
//                   {appointment.customerEmail || "N/A"}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Phone:</span>{" "}
//                   {appointment.customerPhone || "N/A"}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-green-50 rounded-lg p-4">
//               <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                 <Calendar className="w-4 h-4" />
//                 Appointment Details
//               </h3>
//               <div className="space-y-2">
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Date:</span>{" "}
//                   {appointment.date || "N/A"}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Time:</span>{" "}
//                   {appointment.time || "N/A"}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Status:</span>
//                   <span
//                     className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(appointment.status)}`}
//                   >
//                     {appointment.status || "N/A"}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Additional Info */}
//           {appointment.notes && (
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
//               <p className="text-gray-600 text-sm">{appointment.notes}</p>
//             </div>
//           )}

//           {/* Service Details */}
//           {appointment.service && (
//             <div className="bg-purple-50 rounded-lg p-4">
//               <h3 className="font-semibold text-gray-700 mb-2">
//                 Service Details
//               </h3>
//               <div className="space-y-2">
//                 {appointment.service.name && (
//                   <p className="text-sm text-gray-600">
//                     <span className="font-medium">Service:</span>{" "}
//                     {appointment.service.name}
//                   </p>
//                 )}
//                 {appointment.service.price && (
//                   <p className="text-sm text-gray-600">
//                     <span className="font-medium">Price:</span> ₹
//                     {appointment.service.price}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Meta Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
//             {appointment.createdAt && (
//               <p>
//                 Created: {new Date(appointment.createdAt).toLocaleDateString()}
//               </p>
//             )}
//             {appointment.updatedAt && (
//               <p>
//                 Last Updated:{" "}
//                 {new Date(appointment.updatedAt).toLocaleDateString()}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Main Appointments Component
// const Appointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [notification, setNotification] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(6);
//   const [updatingStatus, setUpdatingStatus] = useState(false);

//   // Valid statuses
//   const validStatuses = ["All", "booked", "cancelled", "completed"];

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   useEffect(() => {
//     filterAppointments();
//   }, [appointments, searchQuery, selectedStatus]);

//   const showNotification = (message, type = "success") => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 4000);
//   };

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await api.getAllAppointments();

//       // Transform data if needed
//       const appointmentsArray = Array.isArray(data)
//         ? data
//         : data.appointments || [];

//       // Filter out appointments with invalid statuses
//       const validAppointments = appointmentsArray.filter(
//         (app) =>
//           validStatuses.includes(app.status?.toLowerCase()) ||
//           validStatuses[0] === "All",
//       );

//       setAppointments(validAppointments);
//       // showNotification("Appointments loaded successfully");
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       setError("Failed to load appointments. Please try again.");
//       showNotification("Failed to load appointments", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterAppointments = () => {
//     let filtered = appointments;

//     // Filter by status
//     if (selectedStatus !== "All") {
//       filtered = filtered.filter(
//         (app) => app.status?.toLowerCase() === selectedStatus.toLowerCase(),
//       );
//     }

//     // Filter by search query
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (app) =>
//           app.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           app.customerEmail
//             ?.toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           app.customerPhone
//             ?.toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           app.date?.toLowerCase().includes(searchQuery.toLowerCase()),
//       );
//     }

//     setFilteredAppointments(filtered);
//   };

//   // Handle status update
//   const handleUpdateStatus = async (newStatus) => {
//     if (!selectedAppointment) return;

//     setUpdatingStatus(true);
//     try {
//       // Get appointment ID (try both _id and id)
//       const appointmentId = selectedAppointment._id || selectedAppointment.id;

//       if (!appointmentId) {
//         throw new Error("Appointment ID not found");
//       }

//       console.log(`Updating appointment ID: ${appointmentId}`);
//       console.log(`New status: ${newStatus}`);

//       // Send PATCH request using Axios
//       const result = await api.updateAppointmentStatus(
//         appointmentId,
//         newStatus,
//       );

//       console.log("Update successful, result:", result);

//       // Update local state
//       setAppointments((prev) =>
//         prev.map((app) => {
//           const appId = app._id || app.id;
//           if (appId === appointmentId) {
//             return {
//               ...app,
//               status: newStatus,
//               updatedAt: new Date().toISOString(),
//             };
//           }
//           return app;
//         }),
//       );

//       setShowStatusModal(false);
//       setSelectedAppointment(null);
//       showNotification(`Appointment status updated to ${newStatus}`);
//     } catch (error) {
//       console.error("Error updating appointment status:", error);

//       // Show specific error message
//       let errorMessage = error.message;

//       showNotification(errorMessage, "error");

//       // Refresh appointments to get latest data
//       fetchAppointments();
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   // Test function to debug API
//   const testAPIUpdate = async () => {
//     if (appointments.length > 0) {
//       const firstAppointment = appointments[0];
//       const testId = firstAppointment._id || firstAppointment.id;
//       if (testId) {
//         console.log("Testing API with ID:", testId);
//         try {
//           const result = await api.testUpdateAPI(testId);
//           console.log("Test result:", result);
//           showNotification(
//             `Test API response: ${result.status}`,
//             result.status === 200 ? "success" : "error",
//           );
//         } catch (error) {
//           console.error("Test failed:", error);
//           showNotification(`Test failed: ${error.message}`, "error");
//         }
//       } else {
//         showNotification("No appointment ID found for testing", "error");
//       }
//     } else {
//       showNotification("No appointments available for testing", "error");
//     }
//   };

//   const handleViewDetails = (appointment) => {
//     setSelectedAppointment(appointment);
//     setShowDetailsModal(true);
//   };

//   const handleStatusChangeClick = (appointment) => {
//     setSelectedAppointment(appointment);
//     setShowStatusModal(true);
//   };

//   const handleLoadMore = () => {
//     setVisibleCount((prev) => prev + 6);
//   };

//   // Calculate stats
//   const totalAppointments = appointments.length;
//   const bookedCount = appointments.filter(
//     (app) => app.status?.toLowerCase() === "booked",
//   ).length;
//   const cancelledCount = appointments.filter(
//     (app) => app.status?.toLowerCase() === "cancelled",
//   ).length;
//   const completedCount = appointments.filter(
//     (app) => app.status?.toLowerCase() === "completed",
//   ).length;

//   // Get appointments to display
//   const appointmentsToDisplay = filteredAppointments.slice(0, visibleCount);
//   const hasMoreAppointments = visibleCount < filteredAppointments.length;

//   // Get status color for appointment card
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "booked":
//         return "bg-blue-100 text-blue-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       case "completed":
//         return "bg-purple-100 text-purple-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Notification */}
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
//             {/* Left Section */}
//             <div className="flex items-center gap-3 flex-1 min-w-0">

//               <div className="min-w-0 flex-1">
//                 <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
//                   Appointments
//                 </h1>
//                 <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
//                   Manage all customer appointments
//                 </p>
//               </div>
//             </div>

//             {/* Right Section */}
//             <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 w-full sm:w-auto">
//               {/* Debug button - remove in production */}
//               <button
//                 onClick={testAPIUpdate}
//                 className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap"
//               >
//                 <AlertCircle className="w-4 h-4 flex-shrink-0" />
//                 <span className="hidden xs:inline">Test API</span>
//               </button>

//               <button
//                 onClick={fetchAppointments}
//                 disabled={loading || updatingStatus}
//                 className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <RefreshCw
//                   className={`w-4 h-4 flex-shrink-0 ${loading ? "animate-spin" : ""}`}
//                 />
//                 <span className="hidden xs:inline">Refresh</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 px-4 sm:px-0">
//           <StatsCard
//             icon={Calendar}
//             label="Total Appointments"
//             value={totalAppointments}
//             color="bg-blue-500"
//           />
//           <StatsCard
//             icon={CheckCircle}
//             label="Booked"
//             value={bookedCount}
//             color="bg-green-500"
//           />
//           <StatsCard
//             icon={XCircle}
//             label="Cancelled"
//             value={cancelledCount}
//             color="bg-red-500"
//           />
//           <StatsCard
//             icon={AlertCircle}
//             label="Completed"
//             value={completedCount}
//             color="bg-purple-500"
//           />
//         </div>

//         {/* Search & Filters */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
//           <div className="flex flex-col gap-4">
//             {/* Search Input */}
//             <div className="w-full">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search appointments..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 />
//                 {searchQuery && (
//                   <button
//                     type="button"
//                     onClick={() => setSearchQuery("")}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                     aria-label="Clear search"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Status Filters */}
//             <div className="w-full">
//               {/* Mobile Filter Toggle */}
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="lg:hidden flex items-center gap-2 text-sm text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors w-full justify-between"
//               >
//                 <div className="flex items-center gap-2">
//                   <Filter className="w-4 h-4" />
//                   Status Filters
//                   {selectedStatus !== "All" && (
//                     <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
//                       1
//                     </span>
//                   )}
//                 </div>
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform ${
//                     showFilters ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {/* Desktop Label */}
//               <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 font-medium mb-2">
//                 <Filter className="w-4 h-4" />
//                 Filter by Status:
//               </div>

//               {/* Filter Buttons */}
//               <div
//                 className={`flex-wrap gap-2 mt-3 lg:mt-0 ${
//                   showFilters ? "flex" : "hidden lg:flex"
//                 }`}
//               >
//                 {validStatuses.map((status) => (
//                   <button
//                     key={status}
//                     onClick={() => setSelectedStatus(status)}
//                     className={`px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
//                       selectedStatus === status
//                         ? "bg-blue-600 text-white"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                   >
//                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Results Count */}
//           <div className="mt-4 text-xs sm:text-sm text-gray-600">
//             Showing{" "}
//             <span className="font-semibold text-blue-600">
//               {appointmentsToDisplay.length}
//             </span>{" "}
//             of{" "}
//             <span className="font-semibold">{filteredAppointments.length}</span>{" "}
//             appointments
//             {hasMoreAppointments && (
//               <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">
//                 • {filteredAppointments.length - visibleCount} more available
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
//             <div className="flex items-center gap-3">
//               <AlertCircle className="w-5 h-5" />
//               <p className="font-medium">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Appointments Grid */}
//         {loading ? (
//           <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
//             <p className="mt-4 text-gray-600">Loading appointments...</p>
//           </div>
//         ) : filteredAppointments.length === 0 ? (
//           <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
//             <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               No appointments found
//             </h3>
//             <p className="text-gray-500 mb-6">
//               {searchQuery || selectedStatus !== "All"
//                 ? "Try adjusting your search or filters"
//                 : "No appointments scheduled yet"}
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
//               {appointmentsToDisplay.map((appointment) => (
//                 <div
//                   key={appointment._id}
//                   className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
//                 >
//                   {/* Appointment Header */}
//                   <div className="p-4 border-b border-gray-100">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1">
//                           {appointment.customerName || "Customer"}
//                         </h3>

//                         {/* ✅ EMAIL FROM API */}
//                         <p className="text-sm text-gray-600 break-all">
//                           {appointment.user?.email || "No email available"}
//                         </p>
//                       </div>

//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
//                           appointment.status,
//                         )}`}
//                       >
//                         {appointment.status || "N/A"}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Appointment Details */}
//                   <div className="p-4 flex-1">
//                     <div className="space-y-3">
//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <Calendar className="w-4 h-4" />
//                         <span>{appointment.date || "No date"}</span>
//                       </div>

//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <Clock className="w-4 h-4" />
//                         <span>
//                           {appointment.startTime && appointment.endTime
//                             ? `${appointment.startTime} - ${appointment.endTime}`
//                             : "No time"}
//                         </span>
//                       </div>

//                       {appointment.customerPhone && (
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <Phone className="w-4 h-4" />
//                           <span>{appointment.customerPhone}</span>
//                         </div>
//                       )}

//                       {/* ✅ PRODUCT NAME (instead of service) */}
//                       {appointment.product?.name && (
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <Package className="w-4 h-4" />
//                           <span className="line-clamp-1">
//                             {appointment.product.name}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="p-4 border-t border-gray-100">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleViewDetails(appointment)}
//                         className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs sm:text-sm"
//                         title="View details"
//                       >
//                         <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
//                         <span className="hidden xs:inline">Details</span>
//                       </button>

//                       <button
//                         onClick={() => handleStatusChangeClick(appointment)}
//                         disabled={updatingStatus}
//                         className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-xs sm:text-sm disabled:opacity-50"
//                         title="Update status"
//                       >
//                         {updatingStatus &&
//                         selectedAppointment?._id === appointment._id ? (
//                           <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
//                         ) : (
//                           <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                         )}
//                         <span className="hidden xs:inline">Status</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Load More Button */}
//             {hasMoreAppointments && (
//               <div className="mt-8 text-center">
//                 <button
//                   onClick={handleLoadMore}
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   <ChevronDown className="w-4 h-4" />
//                   Load More ({filteredAppointments.length - visibleCount}{" "}
//                   remaining)
//                 </button>
//               </div>
//             )}

//             {/* Completion Message */}
//             {filteredAppointments.length > 0 && !hasMoreAppointments && (
//               <div className="mt-8 text-center">
//                 <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg inline-flex items-center gap-2">
//                   <span className="text-lg">🎉</span>
//                   <span className="font-medium">
//                     All {filteredAppointments.length} appointments are
//                     displayed!
//                   </span>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Status Update Modal */}
//       <StatusModal
//         appointment={selectedAppointment}
//         isOpen={showStatusModal}
//         onClose={() => {
//           setShowStatusModal(false);
//           setSelectedAppointment(null);
//         }}
//         onConfirm={handleUpdateStatus}
//       />

//       {/* Details Modal */}
//       <AppointmentDetailsModal
//         appointment={selectedAppointment}
//         isOpen={showDetailsModal}
//         onClose={() => {
//           setShowDetailsModal(false);
//           setSelectedAppointment(null);
//         }}
//       />
//     </div>
//   );
// };

// export default Appointments;

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  X,
  Eye,
  Edit2,
  Package,
  Users,
  Tag,
  Shield,
  Lock,
} from "lucide-react";
import axios from "axios";

// Stats Card Component
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

// Notification Component
function Notification({ message, type, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
          type === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={24} />
        ) : (
          <AlertCircle size={24} />
        )}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// API Client - UPDATED to prevent completed status changes
class AppointmentsAPI {
  constructor(baseURL = "https://api.houseofresha.com") {
    this.axios = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  async getAllAppointments() {
    try {
      const response = await this.axios.get("/appointments");
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch appointments",
      );
    }
  }

  async updateAppointmentStatus(id, status) {
    // Ensure status is valid
    const validStatuses = ["booked", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status: ${status}. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    try {
      // First, get current appointment details to check if it's already completed
      const currentAppointments = await this.getAllAppointments();
      const currentAppointment1 = currentAppointments.appointments;
      console.log(
        "Current appointments fetched for status check.",
        currentAppointments,
        id,
      );
      const currentAppointment = currentAppointment1.find(
        (app) => (app._id || app.id) === id,
      );

      // Check if current status is "completed"
      if (currentAppointment?.status?.toLowerCase() === "completed") {
        throw new Error("Cannot update status of a completed appointment");
      }

      const response = await this.axios.patch(`/appointments/${id}`, {
        status,
      });
      console.log("Update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating appointment:", error);

      // Enhanced error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update appointment status";

      throw new Error(
        `HTTP ${error.response?.status || "Network Error"}: ${errorMessage}`,
      );
    }
  }

  // Test function to debug API
  async testUpdateAPI(id) {
    try {
      const response = await this.axios.patch(`/appointments/${id}`, {
        status: "cancelled",
      });
      console.log("Test API response:", response);
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      console.error("Test API error:", error);
      throw error;
    }
  }
}

const api = new AppointmentsAPI();

// Status Change Modal - UPDATED with completed status restriction
function StatusModal({ appointment, isOpen, onClose, onConfirm }) {
  const validStatuses = [
    { value: "booked", label: "Booked", color: "bg-blue-100 text-blue-800" },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-purple-100 text-purple-800",
    },
  ];

  // Check if appointment is already completed
  const isCompleted = appointment?.status?.toLowerCase() === "completed";

  if (!isOpen) return null;

  // If appointment is completed, show a warning modal instead
  if (isCompleted) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Cannot Update Status</h3>
              <p className="text-sm text-gray-600">
                This appointment is already marked as completed.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">
                  Status Locked
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Once an appointment is marked as completed, its status cannot
                  be changed. This ensures data integrity and prevents
                  accidental modifications.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Original modal for non-completed appointments
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Edit2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">
              Update Appointment Status
            </h3>
            <p className="text-sm text-gray-600">
              Current Status:{" "}
              <span className="font-semibold capitalize">
                {appointment?.status || "N/A"}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {validStatuses.map((status) => (
            <button
              key={status.value}
              onClick={() => onConfirm(status.value)}
              disabled={appointment?.status === status.value}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                appointment?.status === status.value
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : `${status.color} hover:opacity-90`
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Appointment Details Modal
function AppointmentDetailsModal({ appointment, isOpen, onClose }) {
  if (!isOpen) return null;

  // Get status color based on valid statuses
  const getStatusColor = (status) => {
    switch (status) {
      case "booked":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isCompleted = appointment?.status?.toLowerCase() === "completed";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              Appointment Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Warning for Completed Appointments */}
          {isCompleted && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lock className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 font-medium">
                    Status Locked
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    This appointment is completed and cannot be modified.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Name:</span>{" "}
                  {appointment.customerName || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span>{" "}
                  {appointment.customerEmail || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span>{" "}
                  {appointment.customerPhone || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Appointment Details
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {appointment.date || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Time:</span>{" "}
                  {appointment.time || "N/A"}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span>
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(appointment.status)}`}
                  >
                    {appointment.status || "N/A"}
                  </span>
                  {/* {isCompleted && (
                    <Lock
                      className="w-3 h-3 text-gray-500"
                      title="Status locked"
                    />
                  )} */}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {appointment.notes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-gray-600 text-sm">{appointment.notes}</p>
            </div>
          )}

          {/* Service Details */}
          {appointment.service && (
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                Service Details
              </h3>
              <div className="space-y-2">
                {appointment.service.name && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Service:</span>{" "}
                    {appointment.service.name}
                  </p>
                )}
                {appointment.service.price && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Price:</span> ₹
                    {appointment.service.price}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
            {appointment.createdAt && (
              <p>
                Created: {new Date(appointment.createdAt).toLocaleDateString()}
              </p>
            )}
            {appointment.updatedAt && (
              <p>
                Last Updated:{" "}
                {new Date(appointment.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Appointments Component
const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Valid statuses
  const validStatuses = ["All", "booked", "cancelled", "completed"];

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchQuery, selectedStatus]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllAppointments();

      // Transform data if needed
      const appointmentsArray = Array.isArray(data)
        ? data
        : data.appointments || [];

      // Filter out appointments with invalid statuses
      const validAppointments = appointmentsArray.filter(
        (app) =>
          validStatuses.includes(app.status?.toLowerCase()) ||
          validStatuses[0] === "All",
      );

      setAppointments(validAppointments);
      // showNotification("Appointments loaded successfully");
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments. Please try again.");
      showNotification("Failed to load appointments", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter(
        (app) => app.status?.toLowerCase() === selectedStatus.toLowerCase(),
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.customerEmail
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          app.customerPhone
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          app.date?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredAppointments(filtered);
  };

  // Handle status update
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedAppointment) return;

    // Check if appointment is already completed
    if (selectedAppointment?.status?.toLowerCase() === "completed") {
      showNotification(
        "Cannot update status of a completed appointment",
        "error",
      );
      setShowStatusModal(false);
      setSelectedAppointment(null);
      return;
    }

    setUpdatingStatus(true);
    try {
      // Get appointment ID (try both _id and id)
      const appointmentId = selectedAppointment._id || selectedAppointment.id;

      if (!appointmentId) {
        throw new Error("Appointment ID not found");
      }

      console.log(`Updating appointment ID: ${appointmentId}`);
      console.log(`New status: ${newStatus}`);

      // Send PATCH request using Axios
      const result = await api.updateAppointmentStatus(
        appointmentId,
        newStatus,
      );

      console.log("Update successful, result:", result);

      // Update local state
      setAppointments((prev) =>
        prev.map((app) => {
          const appId = app._id || app.id;
          if (appId === appointmentId) {
            return {
              ...app,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            };
          }
          return app;
        }),
      );

      setShowStatusModal(false);
      setSelectedAppointment(null);
      showNotification(`Appointment status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating appointment status:", error);

      // Show specific error message
      let errorMessage = error.message;

      showNotification(errorMessage, "error");

      // Refresh appointments to get latest data
      fetchAppointments();
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Test function to debug API
  const testAPIUpdate = async () => {
    if (appointments.length > 0) {
      const firstAppointment = appointments[0];
      const testId = firstAppointment._id || firstAppointment.id;
      if (testId) {
        console.log("Testing API with ID:", testId);
        try {
          const result = await api.testUpdateAPI(testId);
          console.log("Test result:", result);
          showNotification(
            `Test API response: ${result.status}`,
            result.status === 200 ? "success" : "error",
          );
        } catch (error) {
          console.error("Test failed:", error);
          showNotification(`Test failed: ${error.message}`, "error");
        }
      } else {
        showNotification("No appointment ID found for testing", "error");
      }
    } else {
      showNotification("No appointments available for testing", "error");
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleStatusChangeClick = (appointment) => {
    // Check if appointment is completed before opening modal
    if (appointment?.status?.toLowerCase() === "completed") {
      showNotification(
        "This appointment is completed and cannot be modified",
        "error",
      );
      return;
    }

    setSelectedAppointment(appointment);
    setShowStatusModal(true);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Calculate stats
  const totalAppointments = appointments.length;
  const bookedCount = appointments.filter(
    (app) => app.status?.toLowerCase() === "booked",
  ).length;
  const cancelledCount = appointments.filter(
    (app) => app.status?.toLowerCase() === "cancelled",
  ).length;
  const completedCount = appointments.filter(
    (app) => app.status?.toLowerCase() === "completed",
  ).length;

  // Get appointments to display
  const appointmentsToDisplay = filteredAppointments.slice(0, visibleCount);
  const hasMoreAppointments = visibleCount < filteredAppointments.length;

  // Get status color for appointment card
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "booked":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Appointments
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                  Manage all customer appointments
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 w-full sm:w-auto">
              {/* Debug button - remove in production */}
              <button
                onClick={testAPIUpdate}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xs:inline">Test API</span>
              </button>

              <button
                onClick={fetchAppointments}
                disabled={loading || updatingStatus}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 flex-shrink-0 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden xs:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 px-4 sm:px-0">
          <StatsCard
            icon={Calendar}
            label="Total Appointments"
            value={totalAppointments}
            color="bg-blue-500"
          />
          <StatsCard
            icon={CheckCircle}
            label="Booked"
            value={bookedCount}
            color="bg-green-500"
          />
          <StatsCard
            icon={XCircle}
            label="Cancelled"
            value={cancelledCount}
            color="bg-red-500"
          />
          <StatsCard
            icon={AlertCircle}
            label="Completed"
            value={completedCount}
            color="bg-purple-500"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Status Filters */}
            <div className="w-full">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-sm text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Status Filters
                  {selectedStatus !== "All" && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      1
                    </span>
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Desktop Label */}
              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 font-medium mb-2">
                <Filter className="w-4 h-4" />
                Filter by Status:
              </div>

              {/* Filter Buttons */}
              <div
                className={`flex-wrap gap-2 mt-3 lg:mt-0 ${
                  showFilters ? "flex" : "hidden lg:flex"
                }`}
              >
                {validStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
                      selectedStatus === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-xs sm:text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-blue-600">
              {appointmentsToDisplay.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold">{filteredAppointments.length}</span>{" "}
            appointments
            {hasMoreAppointments && (
              <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">
                • {filteredAppointments.length - visibleCount} more available
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

        {/* Appointments Grid */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedStatus !== "All"
                ? "Try adjusting your search or filters"
                : "No appointments scheduled yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {appointmentsToDisplay.map((appointment) => {
                const isCompleted =
                  appointment.status?.toLowerCase() === "completed";

                return (
                  <div
                    key={appointment._id}
                    className={`bg-white rounded-lg border ${isCompleted ? "border-gray-300" : "border-gray-200"} shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full`}
                  >
                    {/* Appointment Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1">
                            {appointment.customerName || "Customer"}
                          </h3>

                          {/* ✅ EMAIL FROM API */}
                          <p className="text-sm text-gray-600 break-all">
                            {appointment.user?.email || "No email available"}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                              appointment.status,
                            )}`}
                          >
                            {appointment.status || "N/A"}
                          </span>
                          {/* {isCompleted && (
                            <Lock
                              className="w-3 h-3 text-gray-500"
                              title="Status locked"
                            />
                          )} */}
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="p-4 flex-1">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{appointment.date || "No date"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            {appointment.startTime && appointment.endTime
                              ? `${appointment.startTime} - ${appointment.endTime}`
                              : "No time"}
                          </span>
                        </div>

                        {appointment.customerPhone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{appointment.customerPhone}</span>
                          </div>
                        )}

                        {/* ✅ PRODUCT NAME (instead of service) */}
                        {appointment.product?.name && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Package className="w-4 h-4" />
                            <span className="line-clamp-1">
                              {appointment.product.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs sm:text-sm"
                          title="View details"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">Details</span>
                        </button>

                        {!isCompleted && (
                          <button
                            onClick={() => handleStatusChangeClick(appointment)}
                            disabled={isCompleted || updatingStatus}
                            className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-colors font-medium text-xs sm:text-sm ${
                              isCompleted
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                            title={
                              isCompleted
                                ? "Status locked - cannot modify completed appointments"
                                : "Update status"
                            }
                          >
                            {updatingStatus &&
                            selectedAppointment?._id === appointment._id ? (
                              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                            ) : (
                              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                            <span className="hidden xs:inline">
                              {isCompleted ? "Locked" : "Status"}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMoreAppointments && (
              <div className="mt-6 sm:mt-8 text-center px-4">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium text-sm sm:text-base active:scale-95"
                >
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">
                    Load More ({filteredAppointments.length - visibleCount}{" "}
                    remaining)
                  </span>
                  <span className="sm:hidden">
                    Load More ({filteredAppointments.length - visibleCount})
                  </span>
                </button>
              </div>
            )}

            {/* Completion Message */}
            {filteredAppointments.length > 0 && !hasMoreAppointments && (
              <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg inline-flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <span className="font-medium">
                    All {filteredAppointments.length} appointments are
                    displayed!
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Status Update Modal */}
      <StatusModal
        appointment={selectedAppointment}
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleUpdateStatus}
      />

      {/* Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedAppointment(null);
        }}
      />
    </div>
  );
};

export default Appointments;
