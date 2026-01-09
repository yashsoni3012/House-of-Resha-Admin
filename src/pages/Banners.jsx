import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef } from "react";

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
  const [visibleCount, setVisibleCount] = useState(3); // Start with 3 banners
  const [showFilters, setShowFilters] = useState(false);

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
  const activeBanners = banners.filter((b) => b.videoUrl).length;
  const categoriesCount = [...new Set(banners.map((b) => b.category))].length;
  const bannersWithButton = banners.filter((b) => b.buttonText).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            {/* Left Section: Icon, Title and Description */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Video Banners
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                  Manage your promotional video banners
                </p>
              </div>
            </div>

            {/* Right Section: Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 w-full sm:w-auto">
              {/* Refresh Button (commented out) */}
              {/* <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial"
              >
                <RefreshCw
                  className={`w-4 h-4 flex-shrink-0 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden xs:inline">Refresh</span>
              </button> */}

              {/* Add Banner Button */}
              <button
                onClick={() => navigate("/add-banner")}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-medium shadow-sm hover:shadow-md text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">Add Banner</span>
                <span className="xs:hidden sm:hidden">Add</span>
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
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="w-full">
              <div className="relative">
                {/* Search Icon */}
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

                {/* Input */}
                <input
                  type="text"
                  placeholder="Search banners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg
               focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
               transition-colors"
                />

                {/* Clear Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filters */}
            <div className="w-full">
              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-sm text-gray-700 font-medium 
                           bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors w-full
                           justify-between"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Category Filters
                  {selectedCategory !== "All" && (
                    <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
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

              {/* Desktop Label (Always Visible) */}
              <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 font-medium mb-2">
                <Filter className="w-4 h-4" />
                Category:
              </div>

              {/* Filter Buttons */}
              <div
                className={`flex-wrap gap-2 mt-3 lg:mt-0 ${
                  showFilters ? "flex" : "hidden lg:flex"
                }`}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
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
          </div>

          {/* Results Count */}
          <div className="mt-4 text-xs sm:text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-indigo-600">
              {bannersToDisplay.length}
            </span>{" "}
            of <span className="font-semibold">{filteredBanners.length}</span>{" "}
            banners
            {hasMoreBanners && (
              <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">
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
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {bannersToDisplay.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  {/* Video Preview */}
                  <div className="relative aspect-[16/9] sm:aspect-[16/9] md:aspect-[16/9] overflow-hidden bg-gray-900">
                    {banner.videoUrl ? (
                      <video
                        src={banner.videoUrl}
                        className="w-full h-full object-cover object-center"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => {
                          e.target.pause();
                          e.target.currentTime = 0;
                        }}
                        onTouchStart={(e) => e.target.play()}
                        onTouchEnd={(e) => {
                          e.target.pause();
                          e.target.currentTime = 0;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Video className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs sm:text-xs font-semibold capitalize whitespace-nowrap">
                        {banner.category}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                      <div className="flex items-center gap-1 text-white bg-black/60 px-2 py-1 rounded text-xs">
                        {/* <Play className="w-3 h-3 sm:w-3 sm:h-3" /> */}
                        <span className="hidden xs:inline">
                          {window.innerWidth < 768 ? "Tap" : "Hover"} to play
                        </span>
                        <span className="xs:hidden">▶︎ Play</span>
                      </div>
                    </div>
                  </div>

                  {/* Banner Info */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    <div className="mb-3 sm:mb-4 flex-1">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 line-clamp-1">
                        {banner.title}
                      </h3>
                      {banner.buttonText && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-600">
                          <MousePointerClick className="w-3 h-3 sm:w-3 sm:h-3 flex-shrink-0" />
                          <span className="truncate">{banner.buttonText}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(banner)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs sm:text-sm"
                        title="View banner"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-xs sm:text-sm"
                        title="Edit banner"
                      >
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(banner)}
                        disabled={deleteLoading === banner.id}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-xs sm:text-sm disabled:opacity-50"
                        title="Delete banner"
                      >
                        {deleteLoading === banner.id ? (
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        <span className="hidden xs:inline">Delete</span>
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
                  <span className="font-medium">
                    All {filteredBanners.length} banners are displayed!
                  </span>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto mx-4">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
              <div className="flex justify-between items-center gap-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  Banner Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Banner Video */}
              <div className="relative rounded-lg overflow-hidden bg-gray-900">
                {selectedBanner.videoUrl ? (
                  <div className="relative pt-[56.25%] sm:pt-0 sm:h-64 md:h-80 lg:h-96">
                    <video
                      src={selectedBanner.videoUrl}
                      className="absolute top-0 left-0 w-full h-full object-cover object-top"
                      controls
                      autoPlay
                      loop
                      playsInline
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 flex flex-col items-center justify-center bg-gray-200 p-4">
                    <Video className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                      No video available
                    </p>
                  </div>
                )}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                  <span className="bg-indigo-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold capitalize truncate max-w-[120px] sm:max-w-none">
                    {selectedBanner.category}
                  </span>
                </div>
              </div>

              {/* Banner Info */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">
                    {selectedBanner.title}
                  </h3>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Button Text */}
                  {selectedBanner.buttonText && (
                    <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <MousePointerClick className="w-3 h-3 sm:w-4 sm:h-4" />
                        Button Text
                      </h4>
                      <p className="text-purple-700 font-medium text-sm sm:text-base break-words">
                        {selectedBanner.buttonText}
                      </p>
                    </div>
                  )}

                  {/* Button Link */}
                  {selectedBanner.buttonLink && (
                    <div className="bg-indigo-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        Button Link
                      </h4>
                      <a
                        href={selectedBanner.buttonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 break-all text-xs sm:text-sm underline block truncate"
                        title={selectedBanner.buttonLink}
                      >
                        {selectedBanner.buttonLink}
                      </a>
                    </div>
                  )}

                  {/* Created Date */}
                  {selectedBanner.createdAt && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        Created On
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {new Date(selectedBanner.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
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
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        Last Updated
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {new Date(selectedBanner.updatedAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
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
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                      Video URL
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm break-all font-mono bg-gray-100 p-2 rounded overflow-x-auto">
                      {selectedBanner.videoUrl}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedBanner);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Banner
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleDeleteClick(selectedBanner);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
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
