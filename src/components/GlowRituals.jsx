import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  ShoppingBag,
  AlertCircle,
  ChevronDown,
  X,
  Check,
  Shield,
  Calendar,
  Package,
  Tag,
  BarChart3,
  Users,
  LayoutGrid,
  LayoutList,
  Loader2,
  RefreshCw,
  FileText,
} from "lucide-react";

const BASE_URL = "https://api.houseofresha.com"; // Define base URL

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

const GlowRituals = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [perfumeToDelete, setPerfumeToDelete] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [quillLoaded, setQuillLoaded] = useState(false);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const clearSearch = () => setSearchQuery("");

  // Function to construct proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop";
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Construct full URL from base URL and path
    // Remove leading slash if present to avoid double slash
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.substring(1)
      : imagePath;
    return `${BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
    fetchPerfumes();
    setQuillLoaded(true);
  }, []);

  useEffect(() => {
    filterPerfumes();
  }, [perfumes, searchQuery, selectedStock]);

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/perfume`);

      if (!response.ok) {
        throw new Error(`Failed to fetch perfumes: ${response.status}`);
      }

      const result = await response.json();

      // Handle different response structures
      let perfumeData = [];

      if (Array.isArray(result)) {
        perfumeData = result;
      } else if (result.data && Array.isArray(result.data)) {
        perfumeData = result.data;
      } else if (result.success && result.data && Array.isArray(result.data)) {
        perfumeData = result.data;
      }

      const transformedData = perfumeData.map((item) => ({
        id: item._id,
        name: item.name || "Unnamed Perfume",
        price: item.price || 0,
        volume: item.volume || 0,
        text: item.text || "",
        description: item.text
          ? stripHtmlTags(item.text).substring(0, 100) + "..."
          : "No description available",
        inStock: item.inStock !== undefined ? item.inStock : true,
        image: getImageUrl(item.images), // Use the helper function here
        createdAt: item.createdAt || new Date().toISOString(),
      }));

      // Sort by newest first
      transformedData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setPerfumes(transformedData);
      console.log("Fetched perfumes:", transformedData); // Debug log
    } catch (error) {
      console.error("Error fetching perfumes:", error);
      setError("Unable to load perfumes. Showing demo data.");

      // Demo data for fallback
      const demoData = [
        {
          id: "1",
          name: "Midnight Rose",
          price: 2999,
          volume: 100,
          text: "<h3>Midnight Rose Perfume</h3><p>A captivating blend of <strong>rose</strong>, <strong>oud</strong>, and <strong>musk</strong>. Perfect for evening wear.</p><ul><li>Long lasting fragrance</li><li>Unisex scent</li><li>Premium packaging</li></ul>",
          description:
            "A captivating blend of rose, oud, and musk. Perfect for evening wear.",
          inStock: true,
          image: getImageUrl(
            "/uploads/perfume_img/1769233762307-azure_driftwood.png",
          ), // Demo image
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Ocean Breeze",
          price: 2499,
          volume: 50,
          text: "<h3>Ocean Breeze</h3><p>Fresh and aquatic scent inspired by the sea. <strong>Notes:</strong> marine accord, citrus, white musk.</p>",
          description: "Fresh and aquatic scent inspired by the sea.",
          inStock: true,
          image: getImageUrl(
            "/uploads/perfume_img/1768043992947-emerald_moss.png",
          ), // Demo image
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Sandalwood Dreams",
          price: 3499,
          volume: 100,
          text: "<h2>Sandalwood Dreams</h2><p>Warm and woody fragrance with <em>premium sandalwood</em> and spice notes.</p>",
          description:
            "Warm and woody fragrance with premium sandalwood and spice notes.",
          inStock: false,
          image: getImageUrl("/uploads/perfume_img/demo-image.jpg"), // Demo image
          createdAt: new Date().toISOString(),
        },
      ];
      setPerfumes(demoData);
    } finally {
      setLoading(false);
    }
  };

  const stripHtmlTags = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const filterPerfumes = () => {
    let filtered = perfumes;

    if (selectedStock !== "All") {
      const stockStatus = selectedStock === "In Stock";
      filtered = filtered.filter((p) => p.inStock === stockStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stripHtmlTags(p.text)
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredPerfumes(filtered);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleView = (perfume) => {
    setSelectedPerfume(perfume);
    setShowViewModal(true);
  };

  const handleEdit = (perfume) => {
    navigate(`/edit-perfume/${perfume.id}`);
  };

  const handleAddNewPerfume = () => {
    navigate("/add-perfume");
  };

  const handleDeleteClick = (perfume) => {
    setPerfumeToDelete(perfume);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!perfumeToDelete) return;

    try {
      setDeleteLoading(perfumeToDelete.id);
      const response = await fetch(
        `${BASE_URL}/perfume/${perfumeToDelete.id}`,
        { method: "DELETE" },
      );

      if (response.ok) {
        const updatedPerfumes = perfumes.filter(
          (p) => p.id !== perfumeToDelete.id,
        );
        setPerfumes(updatedPerfumes);
        setShowDeleteConfirm(false);
        setPerfumeToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting perfume:", error);
      setError("Failed to delete perfume");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRefresh = () => {
    fetchPerfumes();
  };

  const stockOptions = ["All", "In Stock", "Out of Stock"];

  const perfumesToDisplay = filteredPerfumes.slice(0, visibleCount);
  const hasMorePerfumes = visibleCount < filteredPerfumes.length;

  const totalPerfumes = perfumes.length;
  const inStockPerfumes = perfumes.filter((p) => p.inStock).length;
  const outOfStockPerfumes = perfumes.filter((p) => !p.inStock).length;
  const averagePrice =
    perfumes.length > 0
      ? Math.round(
          perfumes.reduce((sum, p) => sum + p.price, 0) / perfumes.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            {/* Left Section: Title and Description */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  MIE by Resha
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                  Manage your premium perfume collection
                </p>
              </div>
            </div>

            {/* Right Section: Action Button */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
              <button
                onClick={handleAddNewPerfume}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-medium shadow-sm hover:shadow-md text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">Add Perfume</span>
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
            icon={ShoppingBag}
            label="Total Perfumes"
            value={totalPerfumes}
            color="bg-blue-500"
          />
          <StatsCard
            icon={Users}
            label="In Stock"
            value={inStockPerfumes}
            color="bg-green-500"
          />
          <StatsCard
            icon={BarChart3}
            label="Out of Stock"
            value={outOfStockPerfumes}
            color="bg-red-500"
          />
          <StatsCard
            icon={Tag}
            label="Avg. Price"
            value={`₹${averagePrice}`}
            color="bg-purple-500"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <Search
                  onClick={() => searchInputRef.current?.focus()}
                  className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 lg:pl-14 pr-10 sm:pr-12 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base bg-white shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters and View Toggle Row */}
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              {/* Desktop Stock Filters */}
              <div className="hidden lg:flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium whitespace-nowrap">
                  <Filter className="w-4 h-4" />
                  <span>Stock Status:</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {stockOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedStock(option)}
                      className={`px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
                        selectedStock === option
                          ? option === "In Stock"
                            ? "bg-green-600 text-white"
                            : option === "Out of Stock"
                              ? "bg-red-600 text-white"
                              : "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile/Tablet Filter Button + View Toggle */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Mobile/Tablet filter button */}
                <button
                  className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  aria-expanded={showMobileFilters}
                  aria-label="Toggle filters"
                >
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* View Toggle Buttons */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    title="Grid view"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    title="List view"
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <LayoutList className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Filters Panel */}
          {showMobileFilters && (
            <div className="lg:hidden mt-3 sm:mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setSelectedStock("All")}
                    className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-xs sm:text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {stockOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedStock(option);
                      setShowMobileFilters(false);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap text-xs sm:text-sm transition-colors ${
                      selectedStock === option
                        ? option === "In Stock"
                          ? "bg-green-600 text-white shadow-md"
                          : option === "Out of Stock"
                            ? "bg-red-600 text-white shadow-md"
                            : "bg-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-indigo-600">
              {perfumesToDisplay.length}
            </span>{" "}
            of <span className="font-semibold">{filteredPerfumes.length}</span>{" "}
            perfumes
            {hasMorePerfumes && (
              <span className="ml-1 sm:ml-2 text-gray-500">
                • {filteredPerfumes.length - visibleCount} more available
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

        {/* Perfumes Grid */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading perfumes...</p>
          </div>
        ) : filteredPerfumes.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No perfumes found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedStock !== "All"
                ? "Try adjusting your search or filters"
                : "Add your first perfume to get started"}
            </p>
            <button
              onClick={handleAddNewPerfume}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add First Perfume
            </button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {perfumesToDisplay.map((perfume) => (
                  <div
                    key={perfume.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    {/* Perfume Image */}
                    <div className="relative aspect-[4/3] sm:aspect-[4/3] md:aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={perfume.image}
                        alt={perfume.name}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = getImageUrl(
                            "/uploads/placeholder-image.jpg",
                          );
                          console.error(
                            `Failed to load image: ${perfume.image}`,
                          );
                        }}
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs sm:text-xs font-semibold whitespace-nowrap ${
                            perfume.inStock
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {perfume.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    {/* Perfume Info */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <div className="mb-3 sm:mb-4 flex-1">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 line-clamp-1">
                          {perfume.name}
                        </h3>

                        <div className="flex items-center justify-between mt-auto">
                          {/* Price - Left */}
                          <p className="text-lg sm:text-xl font-bold text-indigo-600">
                            ₹{perfume.price}
                          </p>

                          {/* Volume - Right */}
                          <p className="text-xs text-gray-500">
                            {perfume.volume}ml
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(perfume)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs sm:text-sm"
                          title="View perfume details"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">View</span>
                        </button>
                        <button
                          onClick={() => handleEdit(perfume)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-xs sm:text-sm"
                          title="Edit perfume"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(perfume)}
                          disabled={deleteLoading === perfume.id}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-xs sm:text-sm disabled:opacity-50"
                          title="Delete perfume"
                        >
                          {deleteLoading === perfume.id ? (
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
            ) : (
              <div className="space-y-4">
                {perfumesToDisplay.map((perfume) => (
                  <div
                    key={perfume.id}
                    className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4"
                  >
                    {/* Mobile Layout - Stack vertically */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Image */}
                      <div className="w-full sm:w-28 h-48 sm:h-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={perfume.image}
                          alt={perfume.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = getImageUrl(
                              "/uploads/placeholder-image.jpg",
                            );
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title and Price Section */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                          {/* Title and Description */}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 truncate">
                              {perfume.name}
                            </h3>
                            <p className="text-gray-600 text-sm truncate">
                              {perfume.description}
                            </p>
                            {perfume.text &&
                              stripHtmlTags(perfume.text).trim() && (
                                <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  <span className="hidden sm:inline">
                                    Rich text description available
                                  </span>
                                  <span className="sm:hidden">
                                    Rich description
                                  </span>
                                </div>
                              )}
                          </div>

                          {/* Price and Stock */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:text-right">
                            <p className="text-lg sm:text-xl font-bold text-indigo-600">
                              ₹{perfume.price}
                            </p>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                                  perfume.inStock
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {perfume.inStock ? "In Stock" : "Out of Stock"}
                              </span>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {perfume.volume}ml
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Date and Actions */}
                        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          {/* Date */}
                          <div className="text-xs text-gray-500 order-2 sm:order-1">
                            {perfume.createdAt && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(
                                  perfume.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 order-1 sm:order-2">
                            <button
                              onClick={() => handleView(perfume)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() => handleEdit(perfume)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1"
                            >
                              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(perfume)}
                              disabled={deleteLoading === perfume.id}
                              className="flex-1 sm:flex-none px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium disabled:opacity-50 inline-flex items-center justify-center gap-1"
                            >
                              {deleteLoading === perfume.id ? (
                                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMorePerfumes && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <ChevronDown className="w-4 h-4" />
                  Load More ({filteredPerfumes.length - visibleCount} remaining)
                </button>
              </div>
            )}

            {/* Completion Message */}
            {filteredPerfumes.length > 0 && !hasMorePerfumes && (
              <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg inline-flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <span className="font-medium">
                    All {filteredPerfumes.length} perfumes are displayed!
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
                <h3 className="font-bold text-gray-900">Delete Perfume</h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                "{perfumeToDelete?.name}"
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

      {/* View Perfume Modal */}
      {showViewModal && selectedPerfume && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 md:p-6 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Perfume Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
              {/* Perfume Image */}
              <div className="relative rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={selectedPerfume.image}
                  alt={selectedPerfume.name}
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = getImageUrl(
                      "/uploads/placeholder-image.jpg",
                    );
                  }}
                />
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                  <span
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold ${
                      selectedPerfume.inStock
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {selectedPerfume.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Perfume Info */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                    {selectedPerfume.name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <Tag className="w-4 h-4" />
                        Price
                      </h4>
                      <p className="text-2xl sm:text-3xl font-bold text-indigo-600">
                        ₹{selectedPerfume.price}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <Package className="w-4 h-4" />
                        Volume
                      </h4>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {selectedPerfume.volume}ml
                      </p>
                    </div>
                  </div>

                  {/* Additional Text with React Quill Viewer */}
                  {selectedPerfume.text &&
                    stripHtmlTags(selectedPerfume.text).trim() && (
                      <div className="mb-3 sm:mb-4">
                        <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                          <FileText className="w-4 h-4" />
                          Description
                        </h4>
                        <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                          {quillLoaded ? (
                            <ReactQuill
                              value={selectedPerfume.text}
                              readOnly={true}
                              theme="bubble"
                              modules={{ toolbar: false }}
                              className="border-0 bg-transparent text-sm sm:text-base"
                            />
                          ) : (
                            <div
                              className="prose prose-sm sm:prose max-w-none text-gray-700"
                              dangerouslySetInnerHTML={{
                                __html: selectedPerfume.text,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Created Date */}
                  {selectedPerfume.createdAt && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <Calendar className="w-4 h-4" />
                        Added On
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {new Date(selectedPerfume.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  )}

                  {/* Stock Status */}
                  <div
                    className={`rounded-lg p-3 sm:p-4 ${
                      selectedPerfume.inStock ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <Check className="w-4 h-4" />
                      Stock Status
                    </h4>
                    <p
                      className={`text-base sm:text-lg font-bold ${
                        selectedPerfume.inStock
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedPerfume.inStock
                        ? "✓ Available for purchase"
                        : "✗ Currently unavailable"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedPerfume);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden xs:inline">Edit Perfume</span>
                  <span className="xs:hidden">Edit</span>
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleDeleteClick(selectedPerfume);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden xs:inline">Delete Perfume</span>
                  <span className="xs:hidden">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlowRituals;
