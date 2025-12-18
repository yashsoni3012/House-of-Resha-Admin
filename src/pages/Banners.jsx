import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Video,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  SlidersHorizontal,
  Calendar,
  Tag,
  Grid,
  List,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/api"; // adjust path
import BannerFormModel from "../components/BannerFormModal";

const API_BASE_URL = "/api";

// simple toast (same as in model)
const showToast = (message, type = "success") => {
  const toastContainer =
    document.getElementById("toast-container") ||
    (() => {
      const container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed top-4 right-4 z-50 flex flex-col gap-3";
      document.body.appendChild(container);
      return container;
    })();

  const toastId = `toast-${Date.now()}`;
  const toast = document.createElement("div");
  toast.id = toastId;
  toast.className = `px-6 py-4 rounded-xl shadow-2xl font-bold text-white animate-slide-in ${
    type === "success"
      ? "bg-gradient-to-r from-green-500 to-emerald-600"
      : "bg-gradient-to-r from-red-500 to-pink-600"
  }`;

  toast.innerHTML = `
    <div class="flex items-center gap-3">
      ${
        type === "success"
          ? '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
          : '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'
      }
      <span>${message}</span>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
};

// fetch banners
const fetchBanners = async () => {
  const res = await fetch(`${API_BASE_URL}/banner`);
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  if (Array.isArray(data)) return { success: true, banners: data };
  if (Array.isArray(data?.data)) return { success: true, banners: data.data };
  if (Array.isArray(data?.banners))
    return { success: true, banners: data.banners };
  if (data?.success && Array.isArray(data.banners)) return data;

  return { success: true, banners: [] };
};

const deleteBanner = async (id) => {
  const res = await fetch(`${API_BASE_URL}/banner/${id}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.message || data.error || `HTTP ${res.status}: Failed to delete`
    );
  }
  return data;
};

const Banner = () => {
  const [sortOrder, setSortOrder] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const {
    data: apiResponse = { success: false, banners: [] },
    isLoading: bannersLoading,
    error: bannersError,
    refetch: refetchBanners,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setDeleteConfirm(null);
      showToast("Banner deleted successfully!", "success");
    },
    onError: (error) => {
      showToast(`Failed to delete banner: ${error.message}`, "error");
    },
  });

  // Extract unique categories
  const categories = useMemo(() => {
    if (!apiResponse) return [];
    let arr = [];
    if (Array.isArray(apiResponse)) arr = apiResponse;
    else if (Array.isArray(apiResponse.banners)) arr = apiResponse.banners;
    else if (Array.isArray(apiResponse.data)) arr = apiResponse.data;

    const uniqueCategories = [
      ...new Set(arr.map((b) => b.category).filter(Boolean)),
    ];
    return uniqueCategories;
  }, [apiResponse]);

  // Filter and sort banners
  const filteredBanners = useMemo(() => {
    if (!apiResponse) return [];
    let arr = [];
    if (Array.isArray(apiResponse)) arr = apiResponse;
    else if (Array.isArray(apiResponse.banners)) arr = apiResponse.banners;
    else if (Array.isArray(apiResponse.data)) arr = apiResponse.data;
    else if (apiResponse.success && apiResponse.banners)
      arr = apiResponse.banners;

    // Apply search filter
    let filtered = arr.filter((banner) => {
      const matchesSearch =
        banner.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        banner.buttonText?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || banner.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "date":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        case "position":
        default:
          return (a.position || 99) - (b.position || 99);
      }
    });
  }, [apiResponse, sortOrder, searchQuery, selectedCategory]);

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    setShowModal(true);
  };

  const handleDelete = () => {
    if (deleteConfirm) deleteMutation.mutate(deleteConfirm._id);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    showToast(`Sorted by ${order}`, "success");
  };

  const BannerCard = ({ banner }) => {
    const videoUrl = banner.videoUrl || banner.video;
    const fullVideoUrl = videoUrl
      ? videoUrl.startsWith("http")
        ? videoUrl
        : `${API_BASE_URL}${videoUrl}`
      : null;

    const createdAt = banner.createdAt ? new Date(banner.createdAt) : null;

    return (
      <div className="group relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-purple-300">
        {/* Category Badge */}
        <div className="absolute top-3 right-3 z-20">
          <span className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg capitalize backdrop-blur-sm">
            {banner.category || "General"}
          </span>
        </div>

        {/* Video Preview */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {fullVideoUrl ? (
            <>
              <video
                src={fullVideoUrl}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                muted
                loop
                playsInline
                preload="metadata"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Video size={14} className="text-white" />
                  <span className="text-white text-xs font-medium">Video</span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <Video size={48} className="text-gray-400 mb-3" />
              <span className="text-sm text-gray-500 font-medium">
                No video uploaded
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {banner.title || "Untitled Banner"}
          </h3>

          {/* Button Preview */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm font-semibold rounded-full shadow-sm">
              <span className="truncate max-w-[120px]">
                {banner.buttonText || "Button"}
              </span>
              <ExternalLink size={12} className="text-gray-500 flex-shrink-0" />
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-3 mb-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{createdAt ? createdAt.toLocaleDateString() : "N/A"}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleEdit(banner)}
              className="group/btn flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              title="Edit"
            >
              <Edit
                size={16}
                className="group-hover/btn:rotate-12 transition-transform"
              />
              <span>Edit</span>
            </button>

            <button
              onClick={() => setDeleteConfirm(banner)}
              className="group/btn flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              title="Delete"
            >
              <Trash2
                size={16}
                className="group-hover/btn:rotate-12 transition-transform"
              />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const BannerListItem = ({ banner }) => {
    const videoUrl = banner.videoUrl || banner.video;
    const fullVideoUrl = videoUrl
      ? videoUrl.startsWith("http")
        ? videoUrl
        : `${API_BASE_URL}${videoUrl}`
      : null;

    const createdAt = banner.createdAt ? new Date(banner.createdAt) : null;

    return (
      <div className="group bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-purple-300">
        <div className="flex flex-col sm:flex-row">
          {/* Video Thumbnail */}
          <div className="relative w-full sm:w-64 aspect-video sm:aspect-auto bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
            {fullVideoUrl ? (
              <>
                <video
                  src={fullVideoUrl}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Video size={40} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg flex-1 group-hover:text-purple-600 transition-colors">
                    {banner.title || "Untitled Banner"}
                  </h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full capitalize flex-shrink-0">
                    {banner.category || "General"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>
                      {createdAt ? createdAt.toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                    <span className="font-medium">
                      {banner.buttonText || "Button"}
                    </span>
                    <ExternalLink size={12} />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(banner)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Edit size={16} />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <button
                onClick={() => setDeleteConfirm(banner)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (bannersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Loading Banners...
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Please wait while we fetch your content
          </p>
        </div>
      </div>
    );
  }

  if (bannersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-3">
              Connection Error
            </h2>
            <p className="text-red-600 mb-4 text-sm sm:text-base">
              {bannersError.message}
            </p>
            <button
              onClick={() => refetchBanners()}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-purple-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Banner Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-purple-600" />
                Manage and organize your promotional content
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-purple-50 to-pink-50 px-4 sm:px-6 py-3 rounded-xl border-2 border-purple-200">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">
                    {filteredBanners.length}
                  </div>
                  <div className="text-xs text-gray-600">Banners</div>
                </div>
                <div className="w-px h-8 bg-purple-200"></div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-pink-600">
                    {categories.length}
                  </div>
                  <div className="text-xs text-gray-600">Categories</div>
                </div>
              </div>

              <button
                onClick={handleAddNew}
                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all flex items-center gap-2 text-sm sm:text-base transform hover:scale-105 active:scale-95"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Create Banner</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
          <div className="flex flex-col gap-4">
            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by title or button text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all text-sm sm:text-base"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-purple-600 shadow-md font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid size={18} />
                  <span className="hidden sm:inline text-sm">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white text-purple-600 shadow-md font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List size={18} />
                  <span className="hidden sm:inline text-sm">List</span>
                </button>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <Filter size={16} className="text-gray-600" />
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    selectedCategory === "all"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all capitalize ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-gray-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  Sort:
                </span>
                {["date", "title", "category"].map((sortType) => (
                  <button
                    key={sortType}
                    onClick={() => handleSortChange(sortType)}
                    className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                      sortOrder === sortType
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
                  </button>
                ))}
                <button
                  onClick={() => refetchBanners()}
                  className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition ml-2"
                  title="Refresh"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredBanners.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                : "flex flex-col gap-4 sm:gap-6"
            }
          >
            {filteredBanners.map((banner) =>
              viewMode === "grid" ? (
                <BannerCard key={banner._id} banner={banner} />
              ) : (
                <BannerListItem key={banner._id} banner={banner} />
              )
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-6">
              {searchQuery || selectedCategory !== "all" ? (
                <Search size={40} className="text-purple-600" />
              ) : (
                <Video size={40} className="text-purple-600" />
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              {searchQuery || selectedCategory !== "all"
                ? "No Banners Found"
                : "No Banners Yet"}
            </h3>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first promotional banner to get started"}
            </p>
            {!(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={handleAddNew}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Create Your First Banner
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <BannerFormModel
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingBanner(null);
            queryClient.invalidateQueries({ queryKey: ["banners"] });
          }}
          initialBanner={editingBanner}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl transform animate-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Delete Banner?
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                This action cannot be undone
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                "{deleteConfirm.title || "Untitled Banner"}"
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 capitalize">
                Category: {deleteConfirm.category || "General"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold text-sm sm:text-base transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition font-bold flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base transform hover:scale-105 active:scale-95"
              >
                {deleteMutation.isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
