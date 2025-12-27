// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Search,
//   Plus,
//   Filter,
//   Eye,
//   Edit2,
//   Trash2,
//   ShoppingBag,
//   AlertCircle,
//   ChevronDown,
//   X,
//   Check,
//   Shield,
//   Calendar,
//   Package,
//   Tag,
// } from "lucide-react";

// const FashionManagement = () => {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [displayedProducts, setDisplayedProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [productToDelete, setProductToDelete] = useState(null);
//   const [visibleCount, setVisibleCount] = useState(4);
//   const [loadMoreLoading, setLoadMoreLoading] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const navigate = useNavigate();
//   const ITEMS_PER_PAGE = 4;

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     filterProducts();
//   }, [products, searchQuery, selectedCategory]);

//   useEffect(() => {
//     setDisplayedProducts(filteredProducts.slice(0, visibleCount));
//   }, [filteredProducts, visibleCount]);

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch("https://api.houseofresha.com/clothing");

//       if (!response.ok) {
//         throw new Error(`Failed to fetch products`);
//       }

//       const result = await response.json();

//       if (result.success && result.data) {
//         const transformedData = result.data.map((item) => ({
//           id: item._id,
//           name: item.name,
//           category: item.categoryId?.name || "Unisex",
//           price: Math.round(item.price),
//           description: item.description || "",
//           image: item.images
//             ? `https://api.houseofresha.com${item.images}`
//             : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
//           sizes: item.sizes || [],
//           details: item.details || [],
//           commitment: item.commitment || [],
//           createdAt: item.createdAt,
//         }));

//         // Sort by createdAt descending so newest products appear first
//         transformedData.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );

//         setProducts(transformedData);
//         setFilteredProducts(transformedData);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setError("Unable to load products. Showing demo data.");

//       // Demo data
//       const demoData = [
//         {
//           id: "4",
//           name: "Denim Jacket",
//           category: "Men",
//           price: 149,
//           description: "Vintage denim jacket",
//           image:
//             "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400",
//           sizes: ["M", "L", "XL"],
//           details: ["Premium denim", "Vintage wash"],
//           commitment: ["Sustainable"],
//         },
//         {
//           id: "3",
//           name: "White Shirt",
//           category: "Unisex",
//           price: 89,
//           description: "Classic white shirt",
//           image:
//             "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
//           sizes: ["XS", "S", "M", "L", "XL"],
//           details: ["100% Cotton", "Easy iron"],
//           commitment: ["Eco-friendly"],
//         },
//         {
//           id: "2",
//           name: "Orange Power Suit",
//           category: "Women",
//           price: 199,
//           description: "Bold orange suit",
//           image:
//             "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400",
//           sizes: ["S", "M", "L", "XL"],
//           details: ["Bold design", "High quality"],
//           commitment: ["Quality guaranteed"],
//         },
//         {
//           id: "1",
//           name: "Sage Blazer",
//           category: "Women",
//           price: 129,
//           description: "Elegant sage green blazer",
//           image:
//             "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400",
//           sizes: ["S", "M", "L"],
//           details: ["Premium fabric", "Professional fit"],
//           commitment: ["30 days return"],
//         },
//       ];
//       setProducts(demoData);
//       setFilteredProducts(demoData);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterProducts = () => {
//     let filtered = products;

//     if (selectedCategory !== "All") {
//       filtered = filtered.filter(
//         (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
//       );
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(
//         (p) =>
//           p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           p.category?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredProducts(filtered);
//     setVisibleCount(4);
//   };

//   const handleLoadMore = () => {
//     setLoadMoreLoading(true);
//     setTimeout(() => {
//       setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
//       setLoadMoreLoading(false);
//     }, 300);
//   };

//   const handleView = (product) => {
//     setSelectedProduct(product);
//     setShowViewModal(true);
//   };

//   const handleEdit = (product) => {
//     // Pass the currently displayed price so the edit page uses the same unit (rupees)
//     navigate(`/edit-product/${product.id}`, {
//       state: { price: product.price },
//     });
//   };

//   const handleAddNewProduct = () => {
//     navigate("/add-product");
//   };

//   const handleDeleteClick = (product) => {
//     setProductToDelete(product);
//     setShowDeleteConfirm(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!productToDelete) return;

//     try {
//       setDeleteLoading(productToDelete.id);
//       const response = await fetch(
//         `https://api.houseofresha.com/clothing/${productToDelete.id}`,
//         { method: "DELETE" }
//       );

//       if (response.ok) {
//         const updatedProducts = products.filter(
//           (p) => p.id !== productToDelete.id
//         );
//         setProducts(updatedProducts);
//         setFilteredProducts(updatedProducts);
//       }
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       setError("Failed to delete product");
//     } finally {
//       setDeleteLoading(null);
//       setShowDeleteConfirm(false);
//       setProductToDelete(null);
//     }
//   };

//   const categories = ["All", "Women", "Men", "Unisex"];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
//       <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
//                   <ShoppingBag className="w-5 h-5 text-white" />
//                 </div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                   Fashion Collection
//                 </h1>
//               </div>
//               <p className="text-sm text-gray-600">
//                 Manage your products with ease
//               </p>
//             </div>
//             <button
//               onClick={handleAddNewProduct}
//               className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:from-pink-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
//             >
//               <Plus className="w-5 h-5" />
//               Add Product
//             </button>
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//               <p className="text-sm">{error}</p>
//             </div>
//           )}

//           {/* Search & Filters */}
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
//               />
//             </div>
//             <div className="flex gap-2 overflow-x-auto pb-2">
//               <Filter className="w-5 h-5 text-gray-500 self-center flex-shrink-0" />
//               {categories.map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
//                     selectedCategory === cat
//                       ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
//                       : "bg-gray-50 text-gray-700 hover:bg-white border border-gray-200"
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <p className="text-gray-600 mt-4 text-sm">
//             Showing{" "}
//             <span className="font-semibold text-pink-600">
//               {displayedProducts.length}
//             </span>{" "}
//             of <span className="font-semibold">{filteredProducts.length}</span>{" "}
//             products
//           </p>
//         </div>

//         {/* Products Grid */}
//         {loading ? (
//           <div className="flex flex-col justify-center items-center h-64">
//             <div className="relative">
//               <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200"></div>
//               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-600 absolute top-0"></div>
//             </div>
//             <p className="text-gray-600 mt-4">Loading products...</p>
//           </div>
//         ) : displayedProducts.length === 0 ? (
//           <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center">
//             <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               No products found
//             </h3>
//             <p className="text-gray-500">
//               Try adjusting your search or filters
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
//               {displayedProducts.map((product) => (
//                 <div
//                   key={product.id}
//                   className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20 flex flex-col h-full"
//                 >
//                   <div className="relative h-56 sm:h-60 overflow-hidden bg-gray-100">
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
//                       onError={(e) => {
//                         e.target.src =
//                           "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400";
//                       }}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//                     <div className="absolute top-3 right-3">
//                       <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-lg">
//                         {product.category}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="p-4 flex flex-col flex-grow">
//                     <div className="flex-grow">
//                       <div className="flex justify-between items-start mb-2">
//                         <h3 className="font-bold text-base sm:text-lg text-gray-800 line-clamp-1">
//                           {product.name}
//                         </h3>
//                       </div>
//                       <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
//                         {product.description}
//                       </p>
//                     </div>
//                     <div className="flex items-center justify-between mb-4">
//                       <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
//                         ₹{product.price}
//                       </p>
//                       {product.sizes.length > 0 && (
//                         <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
//                           <Package className="w-3 h-3 inline mr-1" />
//                           {product.sizes.slice(0, 2).join(", ")}
//                           {product.sizes.length > 2 && "..."}
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleView(product)}
//                         className="flex-1 bg-blue-50 text-blue-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
//                       >
//                         <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
//                         View
//                       </button>
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="flex-1 bg-green-50 text-green-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
//                       >
//                         <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteClick(product)}
//                         className="bg-red-50 text-red-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
//                       >
//                         <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Load More */}
//             {visibleCount < filteredProducts.length && (
//               <div className="flex justify-center mt-8">
//                 <button
//                   onClick={handleLoadMore}
//                   disabled={loadMoreLoading}
//                   className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
//                 >
//                   {loadMoreLoading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                       Loading...
//                     </>
//                   ) : (
//                     <>
//                       <ChevronDown className="w-5 h-5" />
//                       Load More ({filteredProducts.length - visibleCount} more)
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Delete Confirmation */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                 <AlertCircle className="w-6 h-6 text-red-600" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-lg text-gray-800">
//                   Delete Product
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   This action cannot be undone
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteConfirm}
//                 disabled={deleteLoading}
//                 className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 font-medium"
//               >
//                 {deleteLoading ? (
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 ) : (
//                   "Delete"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Product Modal */}
//       {showViewModal && selectedProduct && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 sm:p-6">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-lg sm:text-xl font-bold">
//                   Product Details
//                 </h2>
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="hover:bg-white/20 p-2 rounded-lg"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-4 sm:p-6 space-y-6">
//               {/* Product Image */}
//               <div className="rounded-xl overflow-hidden shadow-lg">
//                 <img
//                   src={selectedProduct.image}
//                   alt={selectedProduct.name}
//                   className="w-full h-64 sm:h-80 object-cover object-top"
//                 />
//                 <div className="absolute bottom-4 left-4">
//                   <span className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow">
//                     {selectedProduct.category}
//                   </span>
//                 </div>
//               </div>

//               {/* Product Info */}
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
//                     {selectedProduct.name}
//                   </h3>
//                   <div className="flex items-center justify-between">
//                     <p className="text-3xl sm:text-4xl font-bold text-pink-600">
//                       ₹{selectedProduct.price}
//                     </p>
//                   </div>
//                 </div>

//                 <p className="text-gray-600">{selectedProduct.description}</p>

//                 {/* Sizes */}
//                 {selectedProduct.sizes.length > 0 && (
//                   <div>
//                     <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                       <Package className="w-4 h-4" />
//                       Available Sizes
//                     </h4>
//                     <div className="flex flex-wrap gap-2">
//                       {selectedProduct.sizes.map((size, idx) => (
//                         <span
//                           key={idx}
//                           className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium"
//                         >
//                           {size}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Details */}
//                 {selectedProduct.details.length > 0 && (
//                   <div>
//                     <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                       <Check className="w-4 h-4" />
//                       Features
//                     </h4>
//                     <ul className="space-y-2">
//                       {selectedProduct.details.map((detail, idx) => (
//                         <li key={idx} className="flex items-start gap-2">
//                           <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                           <span className="text-gray-600">{detail}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Commitments */}
//                 {selectedProduct.commitment.length > 0 && (
//                   <div>
//                     <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                       <Shield className="w-4 h-4" />
//                       Guarantee
//                     </h4>
//                     <ul className="space-y-2">
//                       {selectedProduct.commitment.map((item, idx) => (
//                         <li key={idx} className="flex items-start gap-2">
//                           <Shield className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
//                           <span className="text-gray-600">{item}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Created Date */}
//                 {selectedProduct.createdAt && (
//                   <div className="pt-4 border-t">
//                     <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                       <Calendar className="w-4 h-4" />
//                       Added On
//                     </h4>
//                     <p className="text-gray-600">
//                       {new Date(selectedProduct.createdAt).toLocaleDateString(
//                         "en-IN",
//                         {
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         }
//                       )}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-3 pt-6">
//                 <button
//                   onClick={() => {
//                     setShowViewModal(false);
//                     handleEdit(selectedProduct);
//                   }}
//                   className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium"
//                 >
//                   Edit Product
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowViewModal(false);
//                     handleDeleteClick(selectedProduct);
//                   }}
//                   className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-rose-700 transition-all font-medium"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FashionManagement;

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
  Tag,
  BarChart3,
  Users,
  Loader2,
  RefreshCw,
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
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
          image: item.images
            ? `https://api.houseofresha.com${item.images}`
            : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
          sizes: item.sizes || [],
          details: item.details || [],
          commitment: item.commitment || [],
          createdAt: item.createdAt,
        }));

        transformedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
        (p) => p.category === selectedCategory.toLowerCase()
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
        { method: "DELETE" }
      );

      if (response.ok) {
        const updatedProducts = products.filter(
          (p) => p.id !== productToDelete.id
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

  // Calculate stats
  const totalProducts = products.length;
  const womenProducts = products.filter((p) => p.category === "women").length;
  const menProducts = products.filter((p) => p.category === "men").length;
  const unisexProducts = products.filter((p) => p.category === "unisex").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Fashion Management
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your clothing products and collections
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={handleAddNewProduct}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Product
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
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
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
              {productsToDisplay.length}
            </span>{" "}
            of <span className="font-semibold">{filteredProducts.length}</span>{" "}
            products
            {hasMoreProducts && (
              <span className="ml-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsToDisplay.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400";
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold capitalize">
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-indigo-600">
                          ₹{product.price}
                        </p>
                        {product.sizes.length > 0 && (
                          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            <Package className="w-3 h-3 inline mr-1" />
                            {product.sizes.slice(0, 2).join(", ")}
                            {product.sizes.length > 2 && "..."}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        disabled={deleteLoading === product.id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50"
                      >
                        {deleteLoading === product.id ? (
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
            {hasMoreProducts && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <ChevronDown className="w-4 h-4" />
                  Load More ({filteredProducts.length - visibleCount} remaining)
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Product Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Product Image */}
              <div className="relative rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 sm:h-96 object-cover object-top"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold capitalize">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedProduct.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-indigo-600">
                      ₹{selectedProduct.price}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sizes */}
                  {selectedProduct.sizes.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Available Sizes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes.map((size, idx) => (
                          <span
                            key={idx}
                            className="bg-white px-3 py-1.5 rounded-lg text-sm font-medium"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Created Date */}
                  {selectedProduct.createdAt && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Added On
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {new Date(selectedProduct.createdAt).toLocaleDateString(
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

                  {/* Features */}
                  {selectedProduct.details.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-4 md:col-span-2">
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

                  {/* Guarantee */}
                  {selectedProduct.commitment.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-4 md:col-span-2">
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
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedProduct);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Product
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleDeleteClick(selectedProduct);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Product
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
