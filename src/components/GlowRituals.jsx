// // GlowRituals.jsx - Skincare Products Component
// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Plus,
//   Filter,
//   Eye,
//   Edit2,
//   Trash2,
//   X,
//   Save,
//   Sparkles,
// } from "lucide-react";

// const GlowRituals = () => {
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       name: "Vitamin C Serum",
//       category: "Serum",
//       price: 45.99,
//       description: "Brightening serum with 20% Vitamin C for radiant skin",
//       image:
//         "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
//       rating: 4.8,
//     },
//     {
//       id: 2,
//       name: "Hydrating Face Mask",
//       category: "Mask",
//       price: 29.99,
//       description: "Deep hydration overnight mask with hyaluronic acid",
//       image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
//       rating: 4.6,
//     },
//     {
//       id: 3,
//       name: "Rose Water Toner",
//       category: "Toner",
//       price: 19.99,
//       description: "Natural rose water toner for balanced skin",
//       image:
//         "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400",
//       rating: 4.7,
//     },
//     {
//       id: 4,
//       name: "Retinol Night Cream",
//       category: "Moisturizer",
//       price: 55.99,
//       description: "Anti-aging night cream with retinol and peptides",
//       image:
//         "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400",
//       rating: 4.9,
//     },
//   ]);
//   const [filteredProducts, setFilteredProducts] = useState(products);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("view");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [editForm, setEditForm] = useState({});

//   useEffect(() => {
//     filterProducts();
//   }, [searchQuery, selectedCategory, products]);

//   const filterProducts = () => {
//     let filtered = products;

//     if (selectedCategory !== "All") {
//       filtered = filtered.filter((p) => p.category === selectedCategory);
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(
//         (p) =>
//           p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           p.category.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredProducts(filtered);
//   };

//   const handleView = (product) => {
//     setSelectedProduct(product);
//     setModalMode("view");
//     setShowModal(true);
//   };

//   const handleEdit = (product) => {
//     setSelectedProduct(product);
//     setEditForm({ ...product });
//     setModalMode("edit");
//     setShowModal(true);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       const updatedProducts = products.filter((p) => p.id !== id);
//       setProducts(updatedProducts);
//     }
//   };

//   const handleSave = () => {
//     if (editForm.id) {
//       // Update existing product
//       const updatedProducts = products.map((p) =>
//         p.id === editForm.id ? editForm : p
//       );
//       setProducts(updatedProducts);
//     } else {
//       // Add new product
//       const newProduct = {
//         ...editForm,
//         id: Date.now(),
//       };
//       setProducts([...products, newProduct]);
//     }
//     setShowModal(false);
//     setEditForm({});
//   };

//   const handleAdd = () => {
//     setEditForm({
//       name: "",
//       category: "Serum",
//       price: 0,
//       description: "",
//       image:
//         "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
//       rating: 5,
//     });
//     setModalMode("edit");
//     setShowModal(true);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-blue-50">
//       <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//             <div>
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
//                   <Sparkles className="w-5 h-5 text-white" />
//                 </div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                   MIE by Resha
//                 </h1>
//               </div>
//               <p className="text-sm text-gray-600">
//                 Discover your perfect skincare routine
//               </p>
//             </div>
//             <button
//               onClick={handleAdd}
//               className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
//             >
//               <Plus className="w-5 h-5" />
//               Add Product
//             </button>
//           </div>

//           {/* Search & Filters */}
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search skincare products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
//               />
//             </div>
//             <div className="flex gap-2 overflow-x-auto pb-2">
//               <Filter className="w-5 h-5 text-gray-500 self-center flex-shrink-0" />
//               {["All", "Serum", "Mask", "Toner", "Moisturizer"].map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
//                     selectedCategory === cat
//                       ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
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
//             <span className="font-semibold text-purple-600">
//               {filteredProducts.length}
//             </span>{" "}
//             of <span className="font-semibold">{products.length}</span> items
//           </p>
//         </div>

//         {/* Products Grid */}
//         {filteredProducts.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//             <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               No products found
//             </h3>
//             <p className="text-gray-500">
//               Try adjusting your search or filters
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredProducts.map((product) => (
//               <div
//                 key={product.id}
//                 className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
//               >
//                 <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-cover object-top"
//                   />
//                   <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
//                     {product.category}
//                   </span>
//                   <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-purple-600 shadow-md flex items-center gap-1">
//                     ⭐ {product.rating}
//                   </div>
//                 </div>
//                 <div className="p-5">
//                   <h3 className="font-bold text-xl text-gray-800 mb-2 truncate">
//                     {product.name}
//                   </h3>
//                   <p className="text-gray-600 text-sm mb-3 line-clamp-2">
//                     {product.description}
//                   </p>
//                   <p className="text-2xl font-bold text-purple-600 mb-4">
//                     ${product.price}
//                   </p>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleView(product)}
//                       className="flex-1 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Eye className="w-4 h-4" />
//                       View
//                     </button>
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="flex-1 bg-green-100 text-green-600 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
//               <h2 className="text-2xl font-bold">
//                 {modalMode === "view"
//                   ? "Product Details"
//                   : modalMode === "edit" && editForm.id
//                   ? "Edit Product"
//                   : "Add New Product"}
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowModal(false);
//                   setEditForm({});
//                 }}
//                 className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//             <div className="p-6">
//               {modalMode === "view" ? (
//                 <div>
//                   <img
//                     src={selectedProduct?.image}
//                     alt={selectedProduct?.name}
//                     className="w-full h-64 object-cover object-top rounded-xl mb-4"
//                   />
//                   <div className="space-y-3">
//                     <div>
//                       <label className="text-sm font-semibold text-gray-600">
//                         Name
//                       </label>
//                       <p className="text-lg text-gray-800">
//                         {selectedProduct?.name}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-semibold text-gray-600">
//                         Category
//                       </label>
//                       <p className="text-lg text-gray-800">
//                         {selectedProduct?.category}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-semibold text-gray-600">
//                         Price
//                       </label>
//                       <p className="text-lg text-gray-800">
//                         ${selectedProduct?.price}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-semibold text-gray-600">
//                         Rating
//                       </label>
//                       <p className="text-lg text-gray-800">
//                         ⭐ {selectedProduct?.rating}
//                       </p>
//                     </div>
//                     <div>
//                       <label className="text-sm font-semibold text-gray-600">
//                         Description
//                       </label>
//                       <p className="text-lg text-gray-800">
//                         {selectedProduct?.description}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={editForm.name || ""}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, name: e.target.value })
//                       }
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
//                       placeholder="Enter product name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Category *
//                     </label>
//                     <select
//                       value={editForm.category || "Serum"}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, category: e.target.value })
//                       }
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
//                     >
//                       <option>Serum</option>
//                       <option>Mask</option>
//                       <option>Toner</option>
//                       <option>Moisturizer</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Price *
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={editForm.price || 0}
//                       onChange={(e) =>
//                         setEditForm({
//                           ...editForm,
//                           price: parseFloat(e.target.value) || 0,
//                         })
//                       }
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
//                       placeholder="0.00"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Rating *
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       max="5"
//                       min="0"
//                       value={editForm.rating || 5}
//                       onChange={(e) =>
//                         setEditForm({
//                           ...editForm,
//                           rating: parseFloat(e.target.value) || 5,
//                         })
//                       }
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
//                       placeholder="5.0"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Description
//                     </label>
//                     <textarea
//                       value={editForm.description || ""}
//                       onChange={(e) =>
//                         setEditForm({
//                           ...editForm,
//                           description: e.target.value,
//                         })
//                       }
//                       rows="4"
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
//                       placeholder="Enter product description"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Image URL
//                     </label>
//                     <input
//                       type="text"
//                       value={editForm.image || ""}
//                       onChange={(e) =>
//                         setEditForm({ ...editForm, image: e.target.value })
//                       }
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
//                       placeholder="https://example.com/image.jpg"
//                     />
//                   </div>
//                   <button
//                     onClick={handleSave}
//                     disabled={!editForm.name || !editForm.price}
//                     className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <Save className="w-5 h-5" />
//                     {editForm.id ? "Save Changes" : "Add Product"}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GlowRituals;

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  X,
  Save,
  Sparkles,
  BarChart3,
  Tag,
  Package,
  RefreshCw,
  AlertCircle,
  Loader2,
  Calendar,
  DollarSign,
  LayoutGrid,
  LayoutList,
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

const GlowRituals = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Vitamin C Serum",
      category: "Skincare",
      price: 45.99,
      description: "Brightening serum with 20% Vitamin C for radiant skin",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Hydrating Face Mask",
      category: "Skincare",
      price: 29.99,
      description: "Deep hydration overnight mask with hyaluronic acid",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Rose Water Toner",
      category: "Skincare",
      price: 19.99,
      description: "Natural rose water toner for balanced skin",
      image:
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Retinol Night Cream",
      category: "Skincare",
      price: 55.99,
      description: "Anti-aging night cream with retinol and peptides",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400",
      rating: 4.9,
    },
    {
      id: 5,
      name: "Ocean Whisper Eau de Parfum",
      category: "Perfumes",
      price: 79.99,
      description: "A light, aquatic scent with citrus and marine accords",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      rating: 4.7,
    },
    {
      id: 6,
      name: "Amber Nights Eau de Parfum",
      category: "Perfumes",
      price: 89.99,
      description: "Warm amber and vanilla composition with woody base notes",
      image:
        "https://images.unsplash.com/photo-1503264116251-35a269479413?w=400",
      rating: 4.8,
    },
  ]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // View mode: grid or list
  const [viewMode, setViewMode] = useState("grid");

  // Mobile filters
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const toggleMobileFilters = () => setShowMobileFilters((s) => !s);

  // Search ref for focus + clear
  const searchInputRef = useRef(null);
  const clearSearch = () => setSearchQuery("");

  const categories = ["All", "Perfumes", "Skincare"];

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditForm({ ...product });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setError(null);
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
    }
  };

  const handleSave = () => {
    setError(null);
    if (!editForm.name || !editForm.price) {
      setError("Name and price are required");
      return;
    }

    if (editForm.id) {
      // Update existing product
      const updatedProducts = products.map((p) =>
        p.id === editForm.id ? editForm : p
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      const newProduct = {
        ...editForm,
        id: Date.now(),
      };
      setProducts([...products, newProduct]);
    }
    setShowModal(false);
    setEditForm({});
  };

  const handleAdd = () => {
    setEditForm({
      name: "",
      category: "Serum",
      price: 0,
      description: "",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
      rating: 5,
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleRefresh = () => {
    // Simulate refresh
    setLoading(true);
    setTimeout(() => {
      filterProducts();
      setLoading(false);
    }, 300);
  };

  // Calculate stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const avgRating =
    products.reduce((sum, p) => sum + p.rating, 0) / products.length;
  const uniqueCategories = [...new Set(products.map((p) => p.category))].length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Glow Rituals
                </h1>
                <p className="text-sm text-gray-600">
                  Skincare products and beauty essentials
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
                onClick={handleAdd}
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
            icon={Package}
            label="Total Products"
            value={totalProducts}
            color="bg-purple-500"
          />
          <StatsCard
            icon={DollarSign}
            label="Total Value"
            value={`$${totalValue.toFixed(2)}`}
            color="bg-green-500"
          />
          <StatsCard
            icon={Sparkles}
            label="Avg Rating"
            value={avgRating.toFixed(1)}
            color="bg-yellow-500"
          />
          <StatsCard
            icon={Tag}
            label="Categories"
            value={uniqueCategories}
            color="bg-blue-500"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search
                  onClick={() => searchInputRef.current?.focus()}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name, category, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base sm:text-md bg-white shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <Filter className="w-4 h-4" />
                  <span>Category:</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
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

              {/* Mobile filter button + view toggles */}
              <div className="flex items-center gap-2">
                <button
                  className="sm:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={toggleMobileFilters}
                  aria-expanded={showMobileFilters}
                  aria-label="Toggle filters"
                >
                  <Filter className="w-5 h-5" />
                </button>

                <button
                  title="Grid view"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  title="List view"
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showMobileFilters && (
            <div className="sm:hidden mt-3 bg-white border border-gray-200 rounded-lg p-3 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">Filters</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-sm text-indigo-600"
                  >
                    Done
                  </button>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowMobileFilters(false);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
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
          )}

          <div className="mt-4 text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-indigo-600">
              {filteredProducts.length}
            </span>{" "}
            of <span className="font-semibold">{products.length}</span> products
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
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add First Product
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      ⭐ {product.rating}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xl font-bold text-indigo-600">
                        ${product.price}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
              >
                <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm truncate">
                        {product.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-600">
                        ${product.price}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        {product.category}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="bg-gray-50 px-2 py-1 rounded text-xs">
                        ⭐ {product.rating}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(product)}
                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 inline mr-1" /> View
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4 inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        {" "}
                        <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalMode === "view"
                    ? "Product Details"
                    : modalMode === "edit" && editForm.id
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditForm({});
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {modalMode === "view" ? (
                <>
                  {/* Product Image */}
                  <div className="rounded-lg overflow-hidden bg-gray-900">
                    <img
                      src={selectedProduct?.image}
                      alt={selectedProduct?.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name
                      </label>
                      <p className="text-gray-800">{selectedProduct?.name}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category
                        </label>
                        <span className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">
                          {selectedProduct?.category}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Price
                        </label>
                        <p className="text-2xl font-bold text-indigo-600">
                          ${selectedProduct?.price}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-gray-800 font-medium">
                            {selectedProduct?.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <p className="text-gray-600">
                        {selectedProduct?.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        handleEdit(selectedProduct);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Product
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        handleDelete(selectedProduct.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Product
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Form Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={editForm.name || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={editForm.category || "Serum"}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      >
                        <option value="Serum">Serum</option>
                        <option value="Mask">Mask</option>
                        <option value="Toner">Toner</option>
                        <option value="Moisturizer">Moisturizer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price || 0}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rating
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        max="5"
                        min="0"
                        value={editForm.rating || 5}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            rating: parseFloat(e.target.value) || 5,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="5.0"
                      />
                    </div>
                  </div>

                  {/* Form Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editForm.description || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        rows="4"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                        placeholder="Enter product description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={editForm.image || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, image: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Image Preview */}
                    {editForm.image && (
                      <div className="mt-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Image Preview
                        </label>
                        <div className="border border-gray-300 rounded-lg p-2">
                          <img
                            src={editForm.image}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400";
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleSave}
                      disabled={!editForm.name || !editForm.price}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                      <Save className="w-4 h-4" />
                      {editForm.id ? "Save Changes" : "Add Product"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlowRituals;
