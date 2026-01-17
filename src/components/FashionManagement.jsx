import React, { useState, useEffect, useRef, useMemo } from "react";
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

const FashionManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const toggleMobileFilters = () => setShowMobileFilters((s) => !s);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quillLoaded, setQuillLoaded] = useState(false);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const clearSearch = () => setSearchQuery("");

  useEffect(() => {
    fetchProducts();

    // Load Quill for viewing
    setQuillLoaded(true);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://api.houseofresha.com/clothing");

      if (!response.ok) {
        throw new Error(`Failed to fetch products`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const transformedData = result.data.map((item) => ({
          id: item._id,
          name: item.name,
          category: (item.categoryId?.name || "unisex").toLowerCase(),
          price: Math.round(item.price),
          description: item.description || "",
          text: item.text || "",
          image: item.images
            ? `https://api.houseofresha.com${item.images}`
            : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
          sizes: item.sizes || [],
          details: item.details || [],
          commitment: item.commitment || [],
          createdAt: item.createdAt,
        }));

        transformedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setProducts(transformedData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Unable to load products. Showing demo data.");

      const demoData = [
        {
          id: "4",
          name: "Denim Jacket",
          category: "Men",
          price: 149,
          description: "Vintage denim jacket with premium quality fabric",
          text: "<h3>Premium Denim Jacket</h3><p>This <strong>denim jacket</strong> features:</p><ul><li>Classic design with modern tailoring</li><li>Perfect for casual outings and layered looks</li><li>Made from <em>100% premium cotton denim</em></li><li>Available in multiple washes</li></ul>",
          image:
            "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400",
          sizes: ["M", "L", "XL"],
          details: ["Premium denim", "Vintage wash", "Durable stitching"],
          commitment: ["Sustainable", "30-day return"],
        },
        {
          id: "3",
          name: "White Shirt",
          category: "Unisex",
          price: 89,
          description: "Classic white shirt for formal and casual wear",
          text: "<h3>Classic White Shirt</h3><p>Our classic white shirt is made from <strong>100% organic cotton</strong>, offering comfort and style for any occasion.</p><p><strong>Features:</strong></p><ol><li>Easy iron fabric</li><li>Breathable material</li><li>Available in all sizes</li></ol>",
          image:
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
          sizes: ["XS", "S", "M", "L", "XL"],
          details: ["100% Cotton", "Easy iron", "Breathable fabric"],
          commitment: ["Eco-friendly", "Quality guaranteed"],
        },
        {
          id: "2",
          name: "Orange Power Suit",
          category: "Women",
          price: 199,
          description: "Bold orange suit for confident professionals",
          text: "<h2>Orange Power Suit</h2><p>Make a <strong>bold statement</strong> with this vibrant orange suit. Perfect for:</p><ul><li>Business meetings</li><li>Special events</li><li>Confidence boosting</li></ul><p><em>Available in limited quantities!</em></p>",
          image:
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400",
          sizes: ["S", "M", "L", "XL"],
          details: ["Bold design", "High quality wool", "Perfect fit"],
          commitment: ["Quality guaranteed", "Free alterations"],
        },
        {
          id: "1",
          name: "Sage Blazer",
          category: "Women",
          price: 129,
          description: "Elegant sage green blazer for modern professionals",
          text: "<h3>Sage Green Blazer</h3><p>This <strong>sage green blazer</strong> features:</p><ul><li>Tailored fit</li><li>Wrinkle-resistant fabric</li><li>Ideal for work and special occasions</li><li>Made from sustainable materials</li></ul><p><strong>Color:</strong> Sage Green<br><strong>Material:</strong> Premium Wool Blend</p>",
          image:
            "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400",
          sizes: ["S", "M", "L"],
          details: ["Premium fabric", "Professional fit", "Wrinkle-resistant"],
          commitment: ["30 days return", "Free shipping"],
        },
      ];
      setProducts(demoData);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (p) => p.category === selectedCategory.toLowerCase(),
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product.id}`, {
      state: { price: product.price },
    });
  };

  const handleAddNewProduct = () => {
    navigate("/add-product");
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      setDeleteLoading(productToDelete.id);
      const response = await fetch(
        `https://api.houseofresha.com/clothing/${productToDelete.id}`,
        { method: "DELETE" },
      );

      if (response.ok) {
        const updatedProducts = products.filter(
          (p) => p.id !== productToDelete.id,
        );
        setProducts(updatedProducts);
        setShowDeleteConfirm(false);
        setProductToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  const categories = ["All", "women", "men", "unisex"];

  const productsToDisplay = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < filteredProducts.length;

  const totalProducts = products.length;
  const womenProducts = products.filter((p) => p.category === "women").length;
  const menProducts = products.filter((p) => p.category === "men").length;
  const unisexProducts = products.filter((p) => p.category === "unisex").length;

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
                  Fashion Management
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                  Manage your clothing products and collections
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

              {/* Add Product Button */}
              <button
                onClick={handleAddNewProduct}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-medium shadow-sm hover:shadow-md text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">Add Product</span>
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
            label="Total Products"
            value={totalProducts}
            color="bg-blue-500"
          />
          <StatsCard
            icon={Users}
            label="Women"
            value={womenProducts}
            color="bg-pink-500"
          />
          <StatsCard
            icon={BarChart3}
            label="Men"
            value={menProducts}
            color="bg-green-500"
          />
          <StatsCard
            icon={Tag}
            label="Unisex"
            value={unisexProducts}
            color="bg-purple-500"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Bar - Full Width on Mobile */}
            <div className="w-full">
              <div className="relative">
                <Search
                  onClick={() => searchInputRef.current?.focus()}
                  className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name, category..."
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
              {/* Desktop Category Filters */}
              <div className="hidden lg:flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium whitespace-nowrap">
                  <Filter className="w-4 h-4" />
                  <span>Category:</span>
                </div>
                <div className="flex gap-2 flex-wrap">
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

              {/* Mobile/Tablet Filter Button + View Toggle */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Mobile/Tablet filter button */}
                <button
                  className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  onClick={toggleMobileFilters}
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
                    onClick={() => setSelectedCategory("All")}
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
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowMobileFilters(false);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap text-xs sm:text-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-indigo-600">
              {productsToDisplay.length}
            </span>{" "}
            of <span className="font-semibold">{filteredProducts.length}</span>{" "}
            products
            {hasMoreProducts && (
              <span className="ml-1 sm:ml-2 text-gray-500">
                • {filteredProducts.length - visibleCount} more available
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

        {/* Products Grid */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your search or filters"
                : "Add your first product to get started"}
            </p>
            <button
              onClick={handleAddNewProduct}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add First Product
            </button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {productsToDisplay.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] sm:aspect-[4/3] md:aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400";
                        }}
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs sm:text-xs font-semibold capitalize whitespace-nowrap">
                          {product.category.charAt(0).toUpperCase() +
                            product.category.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <div className="mb-3 sm:mb-4 flex-1">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <p className="text-lg sm:text-xl font-bold text-indigo-600">
                            ₹{product.price}
                          </p>
                          {product.sizes.length > 0 && (
                            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded hidden sm:inline-flex items-center">
                              <Package className="w-3 h-3 inline mr-1 flex-shrink-0" />
                              <span className="truncate max-w-[60px] sm:max-w-[80px]">
                                {product.sizes.slice(0, 2).join(", ")}
                                {product.sizes.length > 2 && "..."}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(product)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs sm:text-sm"
                          title="View product details"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">View</span>
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-xs sm:text-sm"
                          title="Edit product"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          disabled={deleteLoading === product.id}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-xs sm:text-sm disabled:opacity-50"
                          title="Delete product"
                        >
                          {deleteLoading === product.id ? (
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
                {productsToDisplay.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4"
                  >
                    {/* Mobile Layout - Stack vertically */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Image */}
                      <div className="w-full sm:w-28 h-48 sm:h-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400";
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
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm truncate">
                              {product.description}
                            </p>
                            {product.text &&
                              product.text.replace(/<[^>]*>/g, "").trim() && (
                                <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  <span className="hidden sm:inline">
                                    Rich text content available
                                  </span>
                                  <span className="sm:hidden">
                                    Rich content
                                  </span>
                                </div>
                              )}
                          </div>

                          {/* Price and Category */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:text-right">
                            <p className="text-lg sm:text-xl font-bold text-indigo-600">
                              ₹{product.price}
                            </p>
                            <div className="text-xs text-gray-500">
                              {product.category.charAt(0).toUpperCase() +
                                product.category.slice(1)}
                            </div>
                          </div>
                        </div>

                        {/* Sizes and Actions */}
                        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          {/* Sizes */}
                          <div className="flex items-center gap-2 text-xs text-gray-500 order-2 sm:order-1">
                            {product.sizes.length > 0 && (
                              <div className="bg-gray-50 px-2 py-1 rounded text-xs">
                                <Package className="w-3 h-3 inline mr-1" />
                                <span className="hidden sm:inline">
                                  {product.sizes.slice(0, 2).join(", ")}
                                  {product.sizes.length > 2 && "..."}
                                </span>
                                <span className="sm:hidden">
                                  {product.sizes.length} size
                                  {product.sizes.length > 1 ? "s" : ""}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 order-1 sm:order-2">
                            <button
                              onClick={() => handleView(product)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1"
                            >
                              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product)}
                              disabled={deleteLoading === product.id}
                              className="flex-1 sm:flex-none px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium disabled:opacity-50 inline-flex items-center justify-center gap-1"
                            >
                              {deleteLoading === product.id ? (
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
            {hasMoreProducts && (
              <div className="mt-6 sm:mt-8 text-center px-4">
                <button
                  onClick={handleLoadMore}
                  className="
      inline-flex items-center justify-center gap-2
      w-full sm:w-auto
      px-4 sm:px-6
      py-3
      text-sm sm:text-base
      bg-indigo-600 text-white
      rounded-lg
      hover:bg-indigo-700
      active:scale-95
      transition-all
      font-medium
      shadow-md
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
    "
                >
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">
                    Load More ({filteredProducts.length - visibleCount}{" "}
                    remaining)
                  </span>
                </button>
              </div>
            )}

            {/* Completion Message */}
            {filteredProducts.length > 0 && !hasMoreProducts && (
              <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg inline-flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <span className="font-medium">
                    All {filteredProducts.length} products are displayed!
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
                <h3 className="font-bold text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                "{productToDelete?.name}"
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

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 md:p-6 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Product Details
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
              {/* Product Image */}
              <div className="relative rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover object-top"
                />
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                  <span className="bg-indigo-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold capitalize">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    {selectedProduct.description}
                  </p>

                  {/* Additional Text with React Quill Viewer */}
                  {selectedProduct.text &&
                    selectedProduct.text.replace(/<[^>]*>/g, "").trim() && (
                      <div className="mb-3 sm:mb-4">
                        <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                          <FileText className="w-4 h-4" />
                          Additional Information
                        </h4>
                        <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                          {quillLoaded ? (
                            <ReactQuill
                              value={selectedProduct.text}
                              readOnly={true}
                              theme="bubble"
                              modules={{ toolbar: false }}
                              className="border-0 bg-transparent text-sm sm:text-base"
                            />
                          ) : (
                            <div
                              className="prose prose-sm sm:prose max-w-none text-gray-700"
                              dangerouslySetInnerHTML={{
                                __html: selectedProduct.text,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}

                  <div className="flex items-center justify-between">
                    <p className="text-2xl sm:text-3xl font-bold text-indigo-600">
                      ₹{selectedProduct.price}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Sizes */}
                  {selectedProduct.sizes.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <Package className="w-4 h-4" />
                        Available Sizes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((size, idx) => (
                          <span
                            key={idx}
                            className="bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Created Date */}
                  {selectedProduct.createdAt && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <Calendar className="w-4 h-4" />
                        Added On
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {new Date(selectedProduct.createdAt).toLocaleDateString(
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

                  {/* Features */}
                  {selectedProduct.details.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-3 sm:p-4 sm:col-span-2">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <Check className="w-4 h-4" />
                        Features
                      </h4>
                      <ul className="space-y-2">
                        {selectedProduct.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-xs sm:text-sm">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Guarantee */}
                  {selectedProduct.commitment.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3 sm:p-4 sm:col-span-2">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <Shield className="w-4 h-4" />
                        Guarantee
                      </h4>
                      <ul className="space-y-2">
                        {selectedProduct.commitment.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-xs sm:text-sm">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedProduct);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden xs:inline">Edit Product</span>
                  <span className="xs:hidden">Edit</span>
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleDeleteClick(selectedProduct);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden xs:inline">Delete Product</span>
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

export default FashionManagement;
