// Products.jsx - Clean Product Listing Component
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

const FashionManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  useEffect(() => {
    setDisplayedProducts(filteredProducts.slice(0, visibleCount));
  }, [filteredProducts, visibleCount]);

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
          category: item.categoryId?.name || "Unisex",
          price: Math.round(item.price / 100),
          description: item.description || "",
          image: item.images
            ? `https://api.houseofresha.com${item.images}`
            : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
          sizes: item.sizes || [],
          details: item.details || [],
          commitment: item.commitment || [],
          createdAt: item.createdAt,
        }));

        setProducts(transformedData);
        setFilteredProducts(transformedData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Unable to load products. Showing demo data.");
      
      // Demo data
      const demoData = [
        {
          id: "1",
          name: "Sage Blazer",
          category: "Women",
          price: 129,
          description: "Elegant sage green blazer",
          image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400",
          sizes: ["S", "M", "L"],
          details: ["Premium fabric", "Professional fit"],
          commitment: ["30 days return"],
        },
        {
          id: "2",
          name: "Orange Power Suit",
          category: "Women",
          price: 199,
          description: "Bold orange suit",
          image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400",
          sizes: ["S", "M", "L", "XL"],
          details: ["Bold design", "High quality"],
          commitment: ["Quality guaranteed"],
        },
        {
          id: "3",
          name: "White Shirt",
          category: "Unisex",
          price: 89,
          description: "Classic white shirt",
          image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
          sizes: ["XS", "S", "M", "L", "XL"],
          details: ["100% Cotton", "Easy iron"],
          commitment: ["Eco-friendly"],
        },
        {
          id: "4",
          name: "Denim Jacket",
          category: "Men",
          price: 149,
          description: "Vintage denim jacket",
          image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400",
          sizes: ["M", "L", "XL"],
          details: ["Premium denim", "Vintage wash"],
          commitment: ["Sustainable"],
        },
      ];
      setProducts(demoData);
      setFilteredProducts(demoData);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setVisibleCount(4);
  };

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setLoadMoreLoading(false);
    }, 300);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product.id}`);
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
        { method: "DELETE" }
      );

      if (response.ok) {
        const updatedProducts = products.filter(p => p.id !== productToDelete.id);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product");
    } finally {
      setDeleteLoading(null);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const categories = ["All", "Women", "Men", "Unisex"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ShoppingBag className="w-8 h-8 text-pink-600" />
                <h1 className="text-3xl font-bold text-gray-800">Fashion Collection</h1>
              </div>
              <p className="text-gray-600">Manage your products with ease</p>
            </div>
            <button
              onClick={handleAddNewProduct}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-500 self-center flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-600 mt-4 text-sm">
            Showing {displayedProducts.length} of {filteredProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400";
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800 truncate">{product.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-2xl font-bold text-pink-600">₹{product.price}</p>
                      {product.sizes.length > 0 && (
                        <div className="text-xs text-gray-500">
                          <Package className="w-4 h-4 inline mr-1" />
                          {product.sizes.slice(0, 2).join(", ")}
                          {product.sizes.length > 2 && "..."}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(product)}
                        className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {visibleCount < filteredProducts.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadMoreLoading}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  {loadMoreLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" />
                      Load More ({filteredProducts.length - visibleCount} more)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Delete Product</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Product Details</h2>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="hover:bg-white/20 p-2 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Product Image */}
              <div className="relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover object-top rounded-xl"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-pink-600">₹{selectedProduct.price}</p>
                  </div>
                </div>

                <p className="text-gray-600">{selectedProduct.description}</p>

                {/* Sizes */}
                {selectedProduct.sizes.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Available Sizes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size, idx) => (
                        <span key={idx} className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details */}
                {selectedProduct.details.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Features
                    </h4>
                    <ul className="space-y-2">
                      {selectedProduct.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Commitments */}
                {selectedProduct.commitment.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Guarantee
                    </h4>
                    <ul className="space-y-2">
                      {selectedProduct.commitment.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Shield className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Created Date */}
                {selectedProduct.createdAt && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Added On
                    </h4>
                    <p className="text-gray-600">
                      {new Date(selectedProduct.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedProduct);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all"
                >
                  Edit Product
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleDeleteClick(selectedProduct);
                  }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all"
                >
                  Delete
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