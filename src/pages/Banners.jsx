// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Video,
//   Eye,
//   Edit2,
//   Trash2,
//   AlertCircle,
//   X,
//   Calendar,
//   ExternalLink,
//   Loader2,
//   RefreshCw,
//   Search,
//   Filter,
//   Play,
//   MousePointerClick,
//   Plus,
//   ChevronDown,
// } from "lucide-react";

// const Banners = () => {
//   const navigate = useNavigate();
//   const [banners, setBanners] = useState([]);
//   const [filteredBanners, setFilteredBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [bannerToDelete, setBannerToDelete] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedBanner, setSelectedBanner] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [categories, setCategories] = useState(["All"]);
//   const [visibleCount, setVisibleCount] = useState(3); // Start with 3 banners

//   const API_URL = "https://api.houseofresha.com/banner/";

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   useEffect(() => {
//     filterBanners();
//     setVisibleCount(3); // Reset to 3 when search or category changes
//   }, [banners, searchQuery, selectedCategory]);

//   const fetchBanners = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(API_URL);

//       if (response.data.success && response.data.data) {
//         const transformedData = response.data.data.map((item) => ({
//           id: item._id,
//           title: item.title || "Untitled Banner",
//           buttonText: item.buttonText || "",
//           buttonLink: item.buttonLink || "",
//           videoUrl: item.videoUrl
//             ? `https://api.houseofresha.com${item.videoUrl}`
//             : "",
//           category: item.category || "uncategorized",
//           createdAt: item.createdAt,
//           updatedAt: item.updatedAt,
//         }));

//         setBanners(transformedData);
//         setVisibleCount(3); // Reset to 3 when refreshing

//         // Extract unique categories
//         const uniqueCategories = [
//           "All",
//           ...new Set(transformedData.map((b) => b.category)),
//         ];
//         setCategories(uniqueCategories);
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (error) {
//       console.error("Error fetching banners:", error);
//       setError(
//         error.response?.data?.message ||
//           "Failed to load banners. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterBanners = () => {
//     let filtered = banners;

//     // Filter by category
//     if (selectedCategory !== "All") {
//       filtered = filtered.filter(
//         (b) => b.category?.toLowerCase() === selectedCategory.toLowerCase()
//       );
//     }

//     // Filter by search query
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (b) =>
//           b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           b.buttonText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           b.category?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredBanners(filtered);
//   };

//   const handleLoadMore = () => {
//     setVisibleCount((prevCount) => prevCount + 3);
//   };

//   const handleView = (banner) => {
//     setSelectedBanner(banner);
//     setShowViewModal(true);
//   };

//   const handleEdit = (banner) => {
//     navigate(`/edit-banner/${banner.id}`);
//   };

//   const handleDeleteClick = (banner) => {
//     setBannerToDelete(banner);
//     setShowDeleteConfirm(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!bannerToDelete) return;

//     try {
//       setDeleteLoading(bannerToDelete.id);
//       await axios.delete(`${API_URL}${bannerToDelete.id}`);

//       const updatedBanners = banners.filter((b) => b.id !== bannerToDelete.id);
//       setBanners(updatedBanners);

//       // Adjust visible count if needed after deletion
//       if (visibleCount > updatedBanners.length) {
//         setVisibleCount(Math.max(3, updatedBanners.length));
//       }

//       setShowDeleteConfirm(false);
//       setBannerToDelete(null);
//     } catch (error) {
//       console.error("Error deleting banner:", error);
//       setError(
//         error.response?.data?.message ||
//           "Failed to delete banner. Please try again."
//       );
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   const handleRefresh = () => {
//     fetchBanners();
//   };

//   // Get banners to display (first 'visibleCount' items)
//   const bannersToDisplay = filteredBanners.slice(0, visibleCount);
//   const hasMoreBanners = visibleCount < filteredBanners.length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
//       <div className="">
//         {/* Header */}
//         <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 mb-6 border border-white/20">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                   <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//                 </div>
//                 <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   Video Banners
//                 </h1>
//               </div>
//               <p className="text-sm sm:text-base text-gray-600">
//                 Manage your promotional video banners
//               </p>
//             </div>
//             <div className="flex gap-3 w-full md:w-auto">
//               <button
//                 onClick={() => navigate("/add-banner")}
//                 className="flex-1 md:flex-none bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl flex items-center justify-center gap-2 hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
//               >
//                 <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
//                 Add Banner
//               </button>
//               <button
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 className="flex-1 md:flex-none bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <RefreshCw
//                   className={`w-4 h-4 sm:w-5 sm:h-5 ${
//                     loading ? "animate-spin" : ""
//                   }`}
//                 />
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//               <div className="flex-1">
//                 <p className="text-sm">{error}</p>
//               </div>
//               <button
//                 onClick={() => setError(null)}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           )}

//           {/* Search & Filters */}
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
//               <input
//                 type="text"
//                 placeholder="Search banners..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white/70"
//               />
//             </div>
//             <div className="flex gap-2 overflow-x-auto pb-2">
//               <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 self-center flex-shrink-0" />
//               {categories.map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap text-sm capitalize ${
//                     selectedCategory === cat
//                       ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
//                       : "bg-white/70 text-gray-700 hover:bg-white border border-gray-200"
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <p className="text-gray-600 mt-4 text-xs sm:text-sm">
//             Showing{" "}
//             <span className="font-semibold text-indigo-600">
//               {bannersToDisplay.length}
//             </span>{" "}
//             of <span className="font-semibold">{filteredBanners.length}</span>{" "}
//             banners
//             {hasMoreBanners && (
//               <span className="ml-2 text-purple-600">
//                 • Click "Load More" to load{" "}
//                 {Math.min(3, filteredBanners.length - visibleCount)} more
//               </span>
//             )}
//           </p>
//         </div>

//         {/* Banners Grid */}
//         {loading ? (
//           <div className="flex flex-col justify-center items-center h-64">
//             <div className="relative">
//               <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200"></div>
//               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 absolute top-0"></div>
//             </div>
//             <p className="text-gray-600 mt-4">Loading banners...</p>
//           </div>
//         ) : filteredBanners.length === 0 ? (
//           <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
//             <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               No banners found
//             </h3>
//             <p className="text-gray-500">
//               {searchQuery || selectedCategory !== "All"
//                 ? "Try adjusting your search or filters"
//                 : "Add your first banner to get started"}
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               {bannersToDisplay.map((banner) => (
//                 <div
//                   key={banner.id}
//                   className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 flex flex-col h-full"
//                 >
//                   <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-900">
//                     {banner.videoUrl ? (
//                       <video
//                         src={banner.videoUrl}
//                         className="w-full h-full object-cover"
//                         muted
//                         loop
//                         playsInline
//                         onMouseEnter={(e) => e.target.play()}
//                         onMouseLeave={(e) => {
//                           e.target.pause();
//                           e.target.currentTime = 0;
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                         <Video className="w-12 h-12 text-gray-400" />
//                       </div>
//                     )}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
//                     <div className="absolute top-3 right-3">
//                       <span className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg capitalize">
//                         {banner.category}
//                       </span>
//                     </div>
//                     <div className="absolute bottom-3 left-3 right-3">
//                       <div className="flex items-center gap-2 text-white">
//                         <Play className="w-4 h-4" />
//                         <span className="text-xs font-medium">
//                           Hover to preview
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-4 flex flex-col flex-grow">
//                     <div className="flex-grow">
//                       <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 line-clamp-1">
//                         {banner.title}
//                       </h3>
//                       {banner.buttonText && (
//                         <div className="flex items-center gap-2 text-xs text-purple-600 mb-2 bg-purple-50 px-2 py-1 rounded-lg">
//                           <MousePointerClick className="w-3 h-3" />
//                           <span className="font-medium">
//                             {banner.buttonText}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                     <div className="grid grid-cols-3 gap-2 mt-4">
//                       <button
//                         onClick={() => handleView(banner)}
//                         className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 sm:px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium shadow-md hover:shadow-lg"
//                       >
//                         <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
//                         View
//                       </button>
//                       <button
//                         onClick={() => handleEdit(banner)}
//                         className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 sm:px-3 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium shadow-md hover:shadow-lg"
//                       >
//                         <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteClick(banner)}
//                         className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-2 sm:px-3 py-2 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium shadow-md hover:shadow-lg"
//                       >
//                         <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Load More Button - Shows when there are more banners to load */}
//             {hasMoreBanners && (
//               <div className="mt-8 flex justify-center">
//                 <button
//                   onClick={handleLoadMore}
//                   className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium group hover:-translate-y-0.5"
//                 >
//                   <ChevronDown className="w-4 h-4 group-hover:animate-bounce" />
//                   Load More ({filteredBanners.length - visibleCount} remaining)
//                 </button>
//               </div>
//             )}

//             {/* Show completion message when all banners are loaded */}
//             {filteredBanners.length > 0 &&
//               !hasMoreBanners &&
//               filteredBanners.length > 3 && (
//                 <div className="mt-8 text-center">
//                   <p className="text-gray-500 font-medium">
//                     🎉 All {filteredBanners.length} banners are displayed!
//                   </p>
//                 </div>
//               )}
//           </>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                 <AlertCircle className="w-6 h-6 text-red-600" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg text-gray-800">
//                   Delete Banner
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   This action cannot be undone
//                 </p>
//               </div>
//             </div>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete{" "}
//               <span className="font-semibold text-gray-800">
//                 "{bannerToDelete?.title}"
//               </span>
//               ?
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 disabled={deleteLoading}
//                 className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 disabled={deleteLoading}
//                 className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 font-medium disabled:opacity-50"
//               >
//                 {deleteLoading ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Deleting...
//                   </>
//                 ) : (
//                   "Delete"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Banner Modal */}
//       {showViewModal && selectedBanner && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 sm:p-6 z-10">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-lg sm:text-xl font-bold">Banner Details</h2>
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="hover:bg-white/20 p-2 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-4 sm:p-6 space-y-6">
//               {/* Banner Video */}
//               <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-900">
//                 {selectedBanner.videoUrl ? (
//                   <video
//                     src={selectedBanner.videoUrl}
//                     className="w-full h-64 sm:h-96 object-cover"
//                     controls
//                     autoPlay
//                     loop
//                   />
//                 ) : (
//                   <div className="w-full h-64 sm:h-96 flex items-center justify-center bg-gray-200">
//                     <Video className="w-16 h-16 text-gray-400" />
//                     <p className="text-gray-500 ml-3">No video available</p>
//                   </div>
//                 )}
//                 <div className="absolute top-4 right-4">
//                   <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg capitalize">
//                     {selectedBanner.category}
//                   </span>
//                 </div>
//               </div>

//               {/* Banner Info */}
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
//                     {selectedBanner.title}
//                   </h3>
//                 </div>

//                 {/* Button Info */}
//                 {selectedBanner.buttonText && (
//                   <div className="bg-purple-50 rounded-xl p-4">
//                     <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                       <MousePointerClick className="w-4 h-4" />
//                       Button Text
//                     </h4>
//                     <p className="text-purple-700 font-medium">
//                       {selectedBanner.buttonText}
//                     </p>
//                   </div>
//                 )}

//                 {selectedBanner.buttonLink && (
//                   <div className="bg-indigo-50 rounded-xl p-4">
//                     <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                       <ExternalLink className="w-4 h-4" />
//                       Button Link
//                     </h4>
//                     <a
//                       href={selectedBanner.buttonLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-indigo-600 hover:text-indigo-700 break-all underline"
//                     >
//                       {selectedBanner.buttonLink}
//                     </a>
//                   </div>
//                 )}

//                 {/* Video URL */}
//                 {selectedBanner.videoUrl && (
//                   <div className="bg-gray-50 rounded-xl p-4">
//                     <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                       <Video className="w-4 h-4" />
//                       Video URL
//                     </h4>
//                     <p className="text-gray-600 text-sm break-all">
//                       {selectedBanner.videoUrl}
//                     </p>
//                   </div>
//                 )}

//                 {/* Dates */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
//                   {selectedBanner.createdAt && (
//                     <div>
//                       <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                         <Calendar className="w-4 h-4" />
//                         Created On
//                       </h4>
//                       <p className="text-gray-600 text-sm">
//                         {new Date(selectedBanner.createdAt).toLocaleDateString(
//                           "en-IN",
//                           {
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           }
//                         )}
//                       </p>
//                     </div>
//                   )}
//                   {selectedBanner.updatedAt && (
//                     <div>
//                       <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                         <Calendar className="w-4 h-4" />
//                         Last Updated
//                       </h4>
//                       <p className="text-gray-600 text-sm">
//                         {new Date(selectedBanner.updatedAt).toLocaleDateString(
//                           "en-IN",
//                           {
//                             year: "numeric",
//                             month: "long",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           }
//                         )}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Action Button */}
//               <div className="pt-6 flex gap-3">
//                 <button
//                   onClick={() => {
//                     setShowViewModal(false);
//                     handleEdit(selectedBanner);
//                   }}
//                   className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium flex items-center justify-center gap-2"
//                 >
//                   <Edit2 className="w-4 h-4" />
//                   Edit Banner
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowViewModal(false);
//                     handleDeleteClick(selectedBanner);
//                   }}
//                   className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all font-medium flex items-center justify-center gap-2"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   Delete Banner
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Banners;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Video,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  X,
  Calendar,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  Filter,
  Play,
  MousePointerClick,
  Plus,
  ChevronDown,
  BarChart3,
  Users,
  Tag,
  Clock,
  Package,
  Layers,
  Shield,
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

const Banners = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [visibleCount, setVisibleCount] = useState(6); // Start with 6 banners

  const API_URL = "https://api.houseofresha.com/banner/";

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    filterBanners();
  }, [banners, searchQuery, selectedCategory]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_URL);

      if (response.data.success && response.data.data) {
        const transformedData = response.data.data.map((item) => ({
          id: item._id,
          title: item.title || "Untitled Banner",
          buttonText: item.buttonText || "",
          buttonLink: item.buttonLink || "",
          videoUrl: item.videoUrl
            ? `https://api.houseofresha.com${item.videoUrl}`
            : "",
          category: item.category || "uncategorized",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        setBanners(transformedData);

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set(transformedData.map((b) => b.category)),
        ];
        setCategories(uniqueCategories);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load banners. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const filterBanners = () => {
    let filtered = banners;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (b) => b.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.buttonText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBanners(filtered);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  const handleView = (banner) => {
    setSelectedBanner(banner);
    setShowViewModal(true);
  };

  const handleEdit = (banner) => {
    navigate(`/edit-banner/${banner.id}`);
  };

  const handleDeleteClick = (banner) => {
    setBannerToDelete(banner);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bannerToDelete) return;

    try {
      setDeleteLoading(bannerToDelete.id);
      await axios.delete(`${API_URL}${bannerToDelete.id}`);

      const updatedBanners = banners.filter((b) => b.id !== bannerToDelete.id);
      setBanners(updatedBanners);

      setShowDeleteConfirm(false);
      setBannerToDelete(null);
    } catch (error) {
      console.error("Error deleting banner:", error);
      setError(
        error.response?.data?.message ||
          "Failed to delete banner. Please try again."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRefresh = () => {
    fetchBanners();
  };

  // Get banners to display (first 'visibleCount' items)
  const bannersToDisplay = filteredBanners.slice(0, visibleCount);
  const hasMoreBanners = visibleCount < filteredBanners.length;

  // Calculate stats
  const totalBanners = banners.length;
  const activeBanners = banners.filter(b => b.videoUrl).length;
  const categoriesCount = [...new Set(banners.map(b => b.category))].length;
  const bannersWithButton = banners.filter(b => b.buttonText).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Video Banners
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your promotional video banners
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={() => navigate("/add-banner")}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Banner
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Package}
            label="Total Banners"
            value={totalBanners}
            color="bg-blue-500"
          />
          <StatsCard
            icon={Video}
            label="Active Banners"
            value={activeBanners}
            color="bg-green-500"
          />
          <StatsCard
            icon={Tag}
            label="Categories"
            value={categoriesCount}
            color="bg-purple-500"
          />
          <StatsCard
            icon={MousePointerClick}
            label="With Buttons"
            value={bannersWithButton}
            color="bg-yellow-500"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search banners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <Filter className="w-4 h-4" />
                Category:
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors text-sm ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-indigo-600">
              {bannersToDisplay.length}
            </span>{" "}
            of <span className="font-semibold">{filteredBanners.length}</span>{" "}
            banners
            {hasMoreBanners && (
              <span className="ml-2">
                • {filteredBanners.length - visibleCount} more available
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

        {/* Banners Grid */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading banners...</p>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No banners found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search or filters"
                : "Add your first banner to get started"}
            </p>
            <button
              onClick={() => navigate("/add-banner")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add First Banner
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bannersToDisplay.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Video Preview */}
                  <div className="relative h-48 overflow-hidden bg-gray-900">
                    {banner.videoUrl ? (
                      <video
                        src={banner.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => {
                          e.target.pause();
                          e.target.currentTime = 0;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Video className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold capitalize">
                        {banner.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-1 text-white bg-black/50 px-2 py-1 rounded text-xs">
                        <Play className="w-3 h-3" />
                        <span>Hover to play</span>
                      </div>
                    </div>
                  </div>

                  {/* Banner Info */}
                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                        {banner.title}
                      </h3>
                      {banner.buttonText && (
                        <div className="flex items-center gap-2 text-sm text-purple-600">
                          <MousePointerClick className="w-3 h-3" />
                          <span>{banner.buttonText}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(banner)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(banner)}
                        disabled={deleteLoading === banner.id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
                      >
                        {deleteLoading === banner.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreBanners && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <ChevronDown className="w-4 h-4" />
                  Load More ({filteredBanners.length - visibleCount} remaining)
                </button>
              </div>
            )}

            {/* Completion Message */}
            {filteredBanners.length > 0 && !hasMoreBanners && (
              <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg inline-flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <span className="font-medium">All {filteredBanners.length} banners are displayed!</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delete Banner</h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                "{bannerToDelete?.title}"
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Banner Modal */}
      {showViewModal && selectedBanner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Banner Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Banner Video */}
              <div className="relative rounded-lg overflow-hidden bg-gray-900">
                {selectedBanner.videoUrl ? (
                  <video
                    src={selectedBanner.videoUrl}
                    className="w-full h-64 sm:h-96 object-cover"
                    controls
                    autoPlay
                    loop
                  />
                ) : (
                  <div className="w-full h-64 sm:h-96 flex items-center justify-center bg-gray-200">
                    <Video className="w-16 h-16 text-gray-400" />
                    <p className="text-gray-500 ml-3">No video available</p>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold capitalize">
                    {selectedBanner.category}
                  </span>
                </div>
              </div>

              {/* Banner Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedBanner.title}
                  </h3>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Button Text */}
                  {selectedBanner.buttonText && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4" />
                        Button Text
                      </h4>
                      <p className="text-purple-700 font-medium">
                        {selectedBanner.buttonText}
                      </p>
                    </div>
                  )}

                  {/* Button Link */}
                  {selectedBanner.buttonLink && (
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Button Link
                      </h4>
                      <a
                        href={selectedBanner.buttonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 break-all text-sm underline"
                      >
                        {selectedBanner.buttonLink}
                      </a>
                    </div>
                  )}

                  {/* Created Date */}
                  {selectedBanner.createdAt && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Created On
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {new Date(selectedBanner.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  )}

                  {/* Updated Date */}
                  {selectedBanner.updatedAt && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Last Updated
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {new Date(selectedBanner.updatedAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Video URL */}
                {selectedBanner.videoUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video URL
                    </h4>
                    <p className="text-gray-600 text-sm break-all">
                      {selectedBanner.videoUrl}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedBanner);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Banner
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleDeleteClick(selectedBanner);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;