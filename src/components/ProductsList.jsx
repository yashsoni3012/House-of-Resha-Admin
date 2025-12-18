// import React, { useState, useMemo, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { productsAPI } from "../../api/productsAPI";
// import ProductModal from "./ProductModal";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   Package,
//   Tag,
//   DollarSign,
//   Layers,
//   Calendar,
//   RefreshCw,
//   AlertCircle,
//   Search,
//   Filter,
//   ArrowUpDown,
//   Image as ImageIcon,
//   Info,
//   Target,
//   Database,
//   Grid,
// } from "lucide-react";

// const ProductsList = () => {
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [sortBy, setSortBy] = useState("newest");
//   const [showModal, setShowModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [categories, setCategories] = useState([]); // Store categories from API

//   // Toast notification function
//   const showToast = (message, type = "success") => {
//     const toastContainer =
//       document.getElementById("toast-container") ||
//       (() => {
//         const container = document.createElement("div");
//         container.id = "toast-container";
//         container.className = "fixed top-4 right-4 z-50 flex flex-col gap-3";
//         document.body.appendChild(container);
//         return container;
//       })();

//     const toastId = `toast-${Date.now()}`;
//     const toast = document.createElement("div");
//     toast.id = toastId;
//     toast.className = `px-6 py-4 rounded-xl shadow-2xl font-bold text-white animate-slide-in ${
//       type === "success"
//         ? "bg-gradient-to-r from-green-500 to-emerald-600"
//         : "bg-gradient-to-r from-red-500 to-pink-600"
//     }`;

//     toast.innerHTML = `
//       <div class="flex items-center gap-3">
//         ${
//           type === "success"
//             ? '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
//             : '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'
//         }
//         <span>${message}</span>
//       </div>
//     `;

//     toastContainer.appendChild(toast);

//     // Auto remove after 4 seconds
//     setTimeout(() => {
//       toast.style.opacity = "0";
//       toast.style.transform = "translateX(100%)";
//       setTimeout(() => {
//         if (toast.parentNode) {
//           toast.parentNode.removeChild(toast);
//         }
//       }, 300);
//     }, 4000);
//   };

//   // Fetch all products using TanStack Query
//   const {
//     data: products = [],
//     isLoading,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: ["products"],
//     queryFn: productsAPI.getAllProducts,
//     retry: 2,
//     refetchOnWindowFocus: false,
//     staleTime: 30000,
//   });

//   // Extract categories from products
//   useEffect(() => {
//     if (products.length > 0) {
//       const categoryMap = new Map();

//       products.forEach((product) => {
//         if (product.categoryId && product.categoryId._id) {
//           // Use the category object from API
//           categoryMap.set(product.categoryId._id, {
//             _id: product.categoryId._id,
//             name: product.categoryId.name || "Unnamed Category",
//             imageUrl: product.categoryId.imageUrl || "",
//           });
//         }
//       });

//       setCategories(Array.from(categoryMap.values()));
//     }
//   }, [products]);

//   // Create mutation
//   const createMutation = useMutation({
//     mutationFn: productsAPI.createProduct,
//     onSuccess: (data) => {
//       console.log("✅ Product created successfully:", data);
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//       setShowModal(false);
//       showToast("Product created successfully!", "success");
//     },
//     onError: (error) => {
//       console.error("❌ Create failed:", error);
//       showToast(`Failed to create product: ${error.message}`, "error");
//     },
//   });

//   // Update mutation
//   const updateMutation = useMutation({
//     mutationFn: (productData) =>
//       productsAPI.updateProduct(productData._id, productData),
//     onSuccess: (data) => {
//       console.log("✅ Product updated successfully:", data);
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//       setShowModal(false);
//       setEditingProduct(null);
//       showToast("Product updated successfully!", "success");
//     },
//     onError: (error) => {
//       console.error("❌ Update failed:", error);
//       showToast(`Failed to update product: ${error.message}`, "error");
//     },
//   });

//   // Delete mutation
//   const deleteMutation = useMutation({
//     mutationFn: productsAPI.deleteProduct,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//       showToast("Product deleted successfully!", "success");
//     },
//     onError: (error) => {
//       showToast(`Failed to delete product: ${error.message}`, "error");
//     },
//   });

//   // Handle form submission - POST to API
//   const handleSubmit = (formData) => {
//     // Create payload exactly matching API format
//     const payload = {
//       name: formData.name.trim(),
//       description: formData.description.trim(),
//       price: parseInt(formData.price),
//       categoryId: formData.categoryId, // This should be the _id string
//       sizes: formData.sizes,
//       details: formData.details.filter((d) => d.trim()),
//       commitment: formData.commitment.filter((c) => c.trim()),
//       images: formData.images.filter((url) => url.trim() !== ""),
//     };

//     if (editingProduct) {
//       updateMutation.mutate({ ...payload, _id: editingProduct._id });
//     } else {
//       createMutation.mutate(payload);
//     }
//   };

//   // Handle edit
//   const handleEdit = (product) => {
//     setEditingProduct(product);

//     // Transform API data to form data
//     const formData = {
//       name: product.name || "",
//       description: product.description || "",
//       price: product.price?.toString() || "0",
//       categoryId: product.categoryId?._id || "",
//       sizes: product.sizes || ["S", "M", "L"],
//       details: product.details || [""],
//       commitment: product.commitment || [""],
//       images: product.images
//         ? Array.isArray(product.images)
//           ? product.images
//           : [product.images]
//         : [""],
//     };

//     // We'll pass this to the modal through editingProduct
//     setShowModal(true);
//   };

//   // Handle add new
//   const handleAddNew = () => {
//     setEditingProduct(null);
//     setShowModal(true);
//   };

//   // Filter and sort products
//   const filteredProducts = useMemo(() => {
//     let filtered = [...products];

//     // Search filter
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (product) =>
//           product.name?.toLowerCase().includes(searchLower) ||
//           product.description?.toLowerCase().includes(searchLower) ||
//           product.categoryId?.name?.toLowerCase().includes(searchLower)
//       );
//     }

//     // Category filter
//     if (selectedCategory !== "all") {
//       filtered = filtered.filter(
//         (product) => product.categoryId?._id === selectedCategory
//       );
//     }

//     // Sort
//     switch (sortBy) {
//       case "name":
//         filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
//         break;
//       case "price-low":
//         filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
//         break;
//       case "price-high":
//         filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
//         break;
//       case "newest":
//         filtered.sort(
//           (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
//         );
//         break;
//       case "oldest":
//         filtered.sort(
//           (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
//         );
//         break;
//       default:
//         break;
//     }

//     return filtered;
//   }, [products, searchTerm, selectedCategory, sortBy]);

//   // Extract unique categories for filter dropdown
//   const filterCategories = useMemo(() => {
//     const categoryMap = new Map();
//     categoryMap.set("all", { _id: "all", name: "All Categories" });

//     products.forEach((product) => {
//       if (product.categoryId && product.categoryId._id) {
//         categoryMap.set(product.categoryId._id, product.categoryId);
//       }
//     });

//     return Array.from(categoryMap.values());
//   }, [products]);

//   // Format price
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     }).format(price || 0);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // Handle add category (if you have a separate API for creating categories)
//   const handleAddCategory = (newCategory) => {
//     // This would call your category creation API
//     console.log("Adding new category:", newCategory);
//     showToast(`Category "${newCategory}" added!`, "success");
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-6"></div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Loading Products...
//           </h2>
//           <p className="text-gray-600">Fetching data from API...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
//         <div className="max-w-md w-full">
//           <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border border-red-200">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlertCircle size={32} className="text-red-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-red-800 mb-3">
//               API Connection Error
//             </h2>
//             <p className="text-red-600 mb-4">{error.message}</p>
//             <button
//               onClick={() => refetch()}
//               className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
//             >
//               <RefreshCw size={18} />
//               Retry Connection
//             </button>
//             <div className="mt-6 p-3 bg-gray-100 rounded-lg">
//               <p className="text-xs text-gray-600 font-mono break-all">
//                 API Endpoint: https://api.houseofresha.com/clothing
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Products Management
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 Manage your clothing products (Total: {products.length} |
//                 Categories: {categories.length} | Showing:{" "}
//                 {filteredProducts.length})
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row items-center gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">
//                     {products.length}
//                   </div>
//                   <div className="text-xs text-gray-600">Products</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-green-600">
//                     {categories.length}
//                   </div>
//                   <div className="text-xs text-gray-600">Categories</div>
//                 </div>
//               </div>

//               <button
//                 onClick={handleAddNew}
//                 disabled={createMutation.isLoading}
//                 className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 flex items-center gap-2"
//               >
//                 <Plus size={20} />
//                 <span>Add New Product</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filters & Search */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
//               />
//             </div>

//             {/* Category Filter */}
//             <div className="relative">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none"
//               >
//                 {filterCategories.map((category) => (
//                   <option key={category._id} value={category._id}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Sort */}
//             <div className="relative">
//               <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none appearance-none"
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//                 <option value="name">Name (A-Z)</option>
//                 <option value="price-low">Price (Low to High)</option>
//                 <option value="price-high">Price (High to Low)</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Products Grid */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
//           {filteredProducts.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredProducts.map((product) => (
//                 <div
//                   key={product._id}
//                   className="group relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
//                 >
//                   {/* Product Image */}
//                   <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
//                     {product.images ? (
//                       <img
//                         src={`https://api.houseofresha.com${product.images}`}
//                         alt={product.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                         onError={(e) => {
//                           e.target.style.display = "none";
//                           e.target.parentElement.innerHTML = `
//                             <div class="w-full h-full flex flex-col items-center justify-center">
//                               <svg class="w-16 h-16 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                               </svg>
//                               <span class="text-sm text-gray-500">No image available</span>
//                             </div>
//                           `;
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full flex flex-col items-center justify-center">
//                         <ImageIcon size={48} className="text-gray-400 mb-3" />
//                         <span className="text-sm text-gray-500">No image</span>
//                       </div>
//                     )}

//                     {/* Category Badge */}
//                     {product.categoryId?.name && (
//                       <span className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg capitalize">
//                         {product.categoryId.name}
//                       </span>
//                     )}
//                   </div>

//                   {/* Product Content */}
//                   <div className="p-5">
//                     <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
//                       {product.name || "Unnamed Product"}
//                     </h3>

//                     <p className="text-sm text-gray-600 line-clamp-2 mb-4">
//                       {product.description || "No description available"}
//                     </p>

//                     <div className="space-y-3 mb-4">
//                       {/* Price */}
//                       <div className="flex items-center gap-2">
//                         <DollarSign size={16} className="text-green-600" />
//                         <span className="text-lg font-bold text-gray-900">
//                           {formatPrice(product.price)}
//                         </span>
//                       </div>

//                       {/* Category */}
//                       {product.categoryId?.name && (
//                         <div className="flex items-center gap-2 text-sm text-gray-700">
//                           <Grid size={14} className="text-purple-600" />
//                           <span className="font-medium">Category:</span>
//                           <span>{product.categoryId.name}</span>
//                         </div>
//                       )}

//                       {/* Sizes */}
//                       {product.sizes && product.sizes.length > 0 && (
//                         <div className="flex items-center gap-2">
//                           <Layers size={16} className="text-blue-600" />
//                           <div className="flex gap-1">
//                             {product.sizes.map((size, index) => (
//                               <span
//                                 key={index}
//                                 className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
//                               >
//                                 {size}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* Date */}
//                       <div className="flex items-center gap-2 text-sm text-gray-500">
//                         <Calendar size={14} />
//                         <span>Added: {formatDate(product.createdAt)}</span>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
//                       >
//                         <Edit size={16} />
//                         <span>Edit</span>
//                       </button>

//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => {
//                             console.log("View product:", product._id);
//                           }}
//                           className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
//                           title="View Details"
//                         >
//                           <Eye size={16} />
//                         </button>
//                         <button
//                           onClick={() => {
//                             if (
//                               window.confirm(
//                                 "Are you sure you want to delete this product?"
//                               )
//                             ) {
//                               deleteMutation.mutate(product._id);
//                             }
//                           }}
//                           disabled={deleteMutation.isLoading}
//                           className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
//                           title="Delete"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-16">
//               <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-6">
//                 <Package size={40} className="text-purple-600" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">
//                 {searchTerm || selectedCategory !== "all"
//                   ? "No Products Found"
//                   : "No Products Available"}
//               </h3>
//               <p className="text-gray-600 mb-8 max-w-md mx-auto">
//                 {searchTerm || selectedCategory !== "all"
//                   ? "Try adjusting your search or filter criteria"
//                   : "Start by adding your first product to the catalog"}
//               </p>
//               {searchTerm || selectedCategory !== "all" ? (
//                 <button
//                   onClick={() => {
//                     setSearchTerm("");
//                     setSelectedCategory("all");
//                   }}
//                   className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
//                 >
//                   Clear Filters
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleAddNew}
//                   className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-2 mx-auto"
//                 >
//                   <Plus size={20} />
//                   Add Your First Product
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Product Modal */}
//       {showModal && (
//         <ProductModal
//           isOpen={showModal}
//           onClose={() => {
//             setShowModal(false);
//             setEditingProduct(null);
//           }}
//           onSubmit={handleSubmit}
//           product={editingProduct}
//           categories={categories}
//           onAddCategory={handleAddCategory}
//         />
//       )}
//     </div>
//   );
// };

// export default ProductsList;
