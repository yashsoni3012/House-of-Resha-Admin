// // EditProducts.jsx - Enhanced Edit Product Component
// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { showProductUpdated } from "../utils/sweetAlertConfig";
// import axios from "axios";

// import {
//   Save,
//   X,
//   Upload,
//   ArrowLeft,
//   AlertCircle,
//   Check,
//   Package,
//   Tag,
//   FileText,
//   Shield,
// } from "lucide-react";

// const EditProducts = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [detailInput, setDetailInput] = useState("");
//   const [commitmentInput, setCommitmentInput] = useState("");

//   const fileInputRef = useRef(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     categoryId: "",
//     description: "",
//     sizes: [],
//     details: [],
//     commitment: [],
//   });

//   const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

//   useEffect(() => {
//     fetchCategories();
//     fetchProductData();
//   }, [id]);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch("https://api.houseofresha.com/category");
//       const result = await response.json();

//       if (result.success && result.data) {
//         setCategories(result.data);
//       } else {
//         setCategories([
//           { _id: "1", name: "women" },
//           { _id: "2", name: "men" },
//           { _id: "3", name: "unisex" },
//         ]);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setCategories([
//         { _id: "1", name: "women" },
//         { _id: "2", name: "men" },
//         { _id: "3", name: "unisex" },
//       ]);
//     }
//   };

//   const fetchProductData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `https://api.houseofresha.com/clothing/${id}`
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch product: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.success && result.data) {
//         const product = result.data;
//         setFormData({
//           name: product.name || "",
//           categoryId: product.categoryId?._id || "",
//           price: parseFloat((Number(product.price) / 100).toFixed(2)),
//           description: product.description || "",
//           sizes: product.sizes || [],
//           details: product.details || [],
//           commitment: product.commitment || [],
//         });

//         if (product.images) {
//           setPreviewImage(`https://api.houseofresha.com${product.images}`);
//         }
//       } else {
//         throw new Error("Invalid product data");
//       }
//     } catch (error) {
//       console.error("Error fetching product:", error);
//       setError(`Failed to load product data: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     if (!file.type.match("image.*")) {
//       setError("Please select an image file (JPEG, PNG, etc.)");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setError("File size too large. Maximum size is 5MB.");
//       return;
//     }

//     setSelectedFile(file);
//     setError(null);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setPreviewImage(e.target.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const clearImage = () => {
//     setSelectedFile(null);
//     setPreviewImage(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError(null);
//   };

//   const toggleSize = (size) => {
//     setFormData((prev) => ({
//       ...prev,
//       sizes: prev.sizes.includes(size)
//         ? prev.sizes.filter((s) => s !== size)
//         : [...prev.sizes, size],
//     }));
//   };

//   const handleAddDetail = () => {
//     if (detailInput && detailInput.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         details: [...prev.details, detailInput.trim()],
//       }));
//       setDetailInput("");
//     }
//   };

//   const handleRemoveDetail = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       details: prev.details.filter((_, i) => i !== index),
//     }));
//   };

//   const handleAddCommitment = () => {
//     if (commitmentInput && commitmentInput.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         commitment: [...prev.commitment, commitmentInput.trim()],
//       }));
//       setCommitmentInput("");
//     }
//   };

//   const handleRemoveCommitment = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       commitment: prev.commitment.filter((_, i) => i !== index),
//     }));
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError(null);

//   // Validation
//   if (!formData.name.trim()) {
//     setError("Product name is required");
//     return;
//   }
//   if (!formData.price || isNaN(Number(formData.price))) {
//     setError("Valid price is required");
//     return;
//   }
//   if (!formData.categoryId) {
//     setError("Category is required");
//     return;
//   }

//   try {
//     setSaving(true);

//     const fd = new FormData();
//     fd.append("name", formData.name.trim());
//     fd.append("categoryId", formData.categoryId);
//     fd.append("description", formData.description || "");
//     fd.append("price", String(Math.round(Number(formData.price)) * 100));

//     formData.sizes.forEach((s) => fd.append("sizes[]", s));
//     formData.details.forEach((d) => fd.append("details[]", d));
//     formData.commitment.forEach((c) => fd.append("commitment[]", c));

//     if (selectedFile instanceof File) {
//       fd.append("image", selectedFile);
//     }

//     const API_BASE_URL = import.meta.env.DEV
//       ? "/api"
//       : "https://api.houseofresha.com";

//     const res = await axios.patch(`${API_BASE_URL}/clothing/${id}`, fd, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     if (!res.data?.success) {
//       throw new Error(res.data?.message || "Update failed");
//     }

//     // Show success immediately
//     setSuccess(true);

//     // Show sweetalert notification WITHOUT waiting for it
//     showProductUpdated();

//     // Redirect immediately without delay
//     navigate("/products");

//   } catch (err) {
//     console.error("PATCH error:", err);

//     // Axios error handling
//     if (err.response) {
//       setError(err.response.data?.message || "Product update failed");
//     } else if (err.request) {
//       setError(
//         "Network error or CORS issue. Make sure the server allows PATCH requests from your origin."
//       );
//     } else {
//       setError(err.message || "Product update failed");
//     }
//   } finally {
//     setSaving(false);
//   }
// };

//   const handleBack = () => {
//     navigate("/products");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading product data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6 border border-gray-100">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
//             <button
//               onClick={handleBack}
//               className="self-start flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-all font-medium group"
//             >
//               <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center transition-colors">
//                 <ArrowLeft className="w-4 h-4" />
//               </div>
//               Back to Products
//             </button>

//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
//                 <Package className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
//                 Edit Product
//               </h1>
//             </div>

//             <div className="w-32 hidden md:block"></div>
//           </div>

//           {/* Error Message */}
//           {error && !success && (
//             <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm">
//               <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//               <div className="flex-1">
//                 <p className="text-sm">{error}</p>
//               </div>
//             </div>
//           )}

//           {/* Success Message */}
//           {success && (
//             <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm">
//               <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
//               <div>
//                 <p className="font-medium">Product updated successfully!</p>
//                 <p className="text-sm">Redirecting to products page...</p>
//               </div>
//             </div>
//           )}

//           {/* Form */}
//           <div className="space-y-8">
//             {/* Basic Information Section */}
//             <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                 <Tag className="w-5 h-5 text-blue-600" />
//                 Basic Information
//               </h3>

//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Product Name */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     Product Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
//                     placeholder="e.g., Classic Cotton T-Shirt"
//                     required
//                   />
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="categoryId"
//                     value={formData.categoryId}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none capitalize transition-all"
//                     required
//                   >
//                     <option value="">Select category</option>
//                     {categories.map((cat) => (
//                       <option
//                         key={cat._id}
//                         value={cat._id}
//                         className="capitalize"
//                       >
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Price */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     Price <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
//                       ₹
//                     </span>
//                     <input
//                       type="number"
//                       name="price"
//                       step="0.01"
//                       value={formData.price}
//                       onChange={handleInputChange}
//                       className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
//                       placeholder="0.00"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Image Upload Section */}
//             <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                 <Upload className="w-5 h-5 text-purple-600" />
//                 Product Image
//               </h3>

//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileSelect}
//                 accept="image/*"
//                 className="hidden"
//               />

//               {previewImage ? (
//                 <div className="space-y-4">
//                   <div className="relative w-full max-w-md mx-auto">
//                     <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
//                       <img
//                         src={previewImage}
//                         alt="Preview"
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <button
//                       type="button"
//                       onClick={clearImage}
//                       className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg hover:scale-110"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>
//                   <p className="text-center text-sm text-gray-600 font-medium">
//                     {selectedFile
//                       ? "✓ New image selected"
//                       : "Current product image"}
//                   </p>
//                   <button
//                     type="button"
//                     onClick={triggerFileInput}
//                     className="w-full px-4 py-3 bg-white border-2 border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 transition-all font-medium"
//                   >
//                     Change Image
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={triggerFileInput}
//                   className="w-full px-6 py-8 border-3 border-dashed border-purple-300 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all flex flex-col items-center justify-center gap-3 group"
//                 >
//                   <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
//                     <Upload className="w-8 h-8 text-purple-600" />
//                   </div>
//                   <div className="text-center">
//                     <p className="text-gray-700 font-semibold mb-1">
//                       Click to upload product image
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       JPG, PNG, WebP • Max 5MB
//                     </p>
//                   </div>
//                 </button>
//               )}
//             </div>

//             {/* Sizes Section */}
//             <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                 <Tag className="w-5 h-5 text-green-600" />
//                 Available Sizes
//               </h3>
//               <div className="flex flex-wrap gap-3">
//                 {availableSizes.map((size) => (
//                   <button
//                     key={size}
//                     type="button"
//                     onClick={() => toggleSize(size)}
//                     className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
//                       formData.sizes.includes(size)
//                         ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
//                         : "bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300"
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//               <p className="text-sm text-gray-600 mt-4 font-medium">
//                 Selected:{" "}
//                 {formData.sizes.length > 0 ? formData.sizes.join(", ") : "None"}
//               </p>
//             </div>

//             {/* Description Section */}
//             <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-100">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                 <FileText className="w-5 h-5 text-yellow-600" />
//                 Product Description
//               </h3>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="4"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all resize-none"
//                 placeholder="Describe your product in detail..."
//               />
//             </div>

//             {/* Details Section */}
//             <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-100">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                 <FileText className="w-5 h-5 text-indigo-600" />
//                 Product Features
//               </h3>
//               <div className="flex gap-2 mb-4">
//                 <input
//                   type="text"
//                   value={detailInput}
//                   onChange={(e) => setDetailInput(e.target.value)}
//                   onKeyPress={(e) =>
//                     e.key === "Enter" && (e.preventDefault(), handleAddDetail())
//                   }
//                   className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
//                   placeholder="e.g., 100% Cotton, Machine Washable"
//                 />
//                 <button
//                   type="button"
//                   onClick={handleAddDetail}
//                   className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="space-y-2">
//                 {formData.details.map((detail, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border-2 border-indigo-100 shadow-sm group hover:border-indigo-300 transition-all"
//                   >
//                     <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
//                     <span className="flex-1 text-sm text-gray-700 font-medium">
//                       {detail}
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveDetail(idx)}
//                       className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Commitments Section */}
//             <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-6 border-2 border-rose-100">
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//                 <Shield className="w-5 h-5 text-rose-600" />
//                 Our Guarantee
//               </h3>
//               <div className="flex gap-2 mb-4">
//                 <input
//                   type="text"
//                   value={commitmentInput}
//                   onChange={(e) => setCommitmentInput(e.target.value)}
//                   onKeyPress={(e) =>
//                     e.key === "Enter" &&
//                     (e.preventDefault(), handleAddCommitment())
//                   }
//                   className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
//                   placeholder="e.g., 30-day money back guarantee"
//                 />
//                 <button
//                   type="button"
//                   onClick={handleAddCommitment}
//                   className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
//                 >
//                   Add
//                 </button>
//               </div>
//               <div className="space-y-2">
//                 {formData.commitment.map((item, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border-2 border-rose-100 shadow-sm group hover:border-rose-300 transition-all"
//                   >
//                     <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
//                     <span className="flex-1 text-sm text-gray-700 font-medium">
//                       {item}
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveCommitment(idx)}
//                       className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Submit Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 pt-4">
//               <button
//                 type="button"
//                 onClick={handleBack}
//                 className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all text-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={saving}
//                 className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 hover:from-pink-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transform hover:scale-105"
//               >
//                 {saving ? (
//                   <>
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
//                     Updating Product...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-6 h-6" />
//                     Update Product
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProducts;

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Upload,
  Plus,
  X,
  ArrowLeft,
  CheckCircle,
  Eye,
  Clock,
  Tag,
  BarChart3,
  Type,
  MessageSquare,
  Image as ImageIcon,
  Package,
  DollarSign,
  Layers,
  Shield,
  AlertCircle,
  Save,
} from "lucide-react";
import { showProductUpdated } from "../utils/sweetAlertConfig";

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

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [detailInput, setDetailInput] = useState("");
  const [commitmentInput, setCommitmentInput] = useState("");
  const [existingImage, setExistingImage] = useState(null);
  // Whether the original image is marked for removal (will be deleted on save)
  const [removedImage, setRemovedImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    description: "",
    sizes: [],
    details: [],
    commitment: [],
  });

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    fetchCategories();
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://api.houseofresha.com/category");
      const result = await response.json();

      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        setCategories([
          { _id: "1", name: "women" },
          { _id: "2", name: "men" },
          { _id: "3", name: "unisex" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([
        { _id: "1", name: "women" },
        { _id: "2", name: "men" },
        { _id: "3", name: "unisex" },
      ]);
    }
  };

  const location = useLocation();

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.houseofresha.com/clothing/${id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const product = result.data;

        // Prefer price passed via navigation state (from products list) to avoid unit ambiguity.
        // If not present, attempt to infer whether API returned cents (divide by 100) or rupees as-is.
        let loadedPrice;
        if (location?.state?.price !== undefined) {
          loadedPrice = Number(location.state.price);
        } else {
          const raw = Number(product.price);
          // Heuristic: if raw looks large (>= 100000) treat as cents; otherwise treat as rupees
          if (!Number.isFinite(raw) || isNaN(raw)) {
            loadedPrice = 0;
          } else if (raw >= 100000) {
            loadedPrice = raw / 100;
          } else {
            // safe fallback: assume backend returns rupees
            loadedPrice = raw;
          }
        }

        setFormData({
          name: product.name || "",
          categoryId: product.categoryId?._id || "",
          price: parseFloat(Number(loadedPrice).toFixed(2)),
          description: product.description || "",
          sizes: product.sizes || [],
          details: product.details || [],
          commitment: product.commitment || [],
        });

        if (product.images) {
          const imageUrl = product.images.startsWith("http")
            ? product.images
            : `https://api.houseofresha.com${product.images}`;
          setPreviewImage(imageUrl);
          setExistingImage(product.images);
          setRemovedImage(false);
        }
      } else {
        throw new Error("Invalid product data");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(`Failed to load product data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size too large. Maximum size is 5MB.");
      return;
    }

    setSelectedFile(file);
    setError(null);
    // Selecting a new file cancels any previous 'remove' choice
    setRemovedImage(false);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    // If a newly selected file exists, cancel selection and revert to existing image
    if (selectedFile) {
      if (previewImage && previewImage.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch (e) {}
      }
      setSelectedFile(null);
      setPreviewImage(
        existingImage
          ? existingImage.startsWith("http")
            ? existingImage
            : `https://api.houseofresha.com${existingImage}`
          : null
      );
      setRemovedImage(false);
    } else if (existingImage) {
      // Mark existing image for removal
      if (previewImage && previewImage.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch (e) {}
      }
      setSelectedFile(null);
      setPreviewImage(null);
      setRemovedImage(true);
      setExistingImage(null);
    } else {
      // Nothing present; ensure cleared
      if (previewImage && previewImage.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch (e) {}
      }
      setSelectedFile(null);
      setPreviewImage(null);
      setRemovedImage(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const toggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleAddDetail = () => {
    if (detailInput && detailInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        details: [...prev.details, detailInput.trim()],
      }));
      setDetailInput("");
    }
  };

  const handleRemoveDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const handleAddCommitment = () => {
    if (commitmentInput && commitmentInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        commitment: [...prev.commitment, commitmentInput.trim()],
      }));
      setCommitmentInput("");
    }
  };

  const handleRemoveCommitment = (index) => {
    setFormData((prev) => ({
      ...prev,
      commitment: prev.commitment.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!formData.price || isNaN(Number(formData.price))) {
      setError("Valid price is required");
      return;
    }
    if (!formData.categoryId) {
      setError("Category is required");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("categoryId", formData.categoryId);
      fd.append("description", formData.description || "");
      fd.append("price", String(Math.round(Number(formData.price))));

      // Append sizes, details, and commitments
      formData.sizes.forEach((s) => fd.append("sizes[]", s));
      formData.details.forEach((d) => fd.append("details[]", d));
      formData.commitment.forEach((c) => fd.append("commitment[]", c));

      // Append new image if selected
      if (selectedFile instanceof File) {
        fd.append("image", selectedFile);
      }

      // If the user marked the existing image for removal, include a flag so backend can delete it
      if (removedImage) {
        fd.append("removeImage", "1");
      }

      console.log("Updating product with data:", {
        name: formData.name,
        price: Math.round(Number(formData.price)),
        categoryId: formData.categoryId,
        sizes: formData.sizes,
        details: formData.details,
        commitment: formData.commitment,
        hasNewImage: !!selectedFile,
        removedImage,
      });

      const response = await fetch(
        `https://api.houseofresha.com/clothing/${id}`,
        {
          method: "PATCH",
          body: fd,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Product update failed");
      }

      // Show success notification
      showProductUpdated();

      // Redirect after a brief delay
      setTimeout(() => {
        navigate("/products");
      });
    } catch (error) {
      console.error("Update error:", error);
      setError(error.message || "Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Products</span>
              </button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Edit Product
                </h1>
                <p className="text-sm text-gray-600">
                  Update your existing product
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const hasRequiredFields =
                    formData.name && formData.price && formData.categoryId;
                  if (hasRequiredFields) {
                    alert("Preview would show here");
                  } else {
                    setError("Complete required fields to preview");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  saving ||
                  !formData.name ||
                  !formData.categoryId ||
                  !formData.price
                }
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Product
                  </>
                )}
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
            label="Sizes"
            value={formData.sizes.length}
            color="bg-blue-500"
          />
          <StatsCard
            icon={Layers}
            label="Features"
            value={formData.details.length}
            color="bg-green-500"
          />
          <StatsCard
            icon={Shield}
            label="Guarantees"
            value={formData.commitment.length}
            color="bg-purple-500"
          />
          <StatsCard
            icon={BarChart3}
            label="Status"
            value="Editing"
            color="bg-yellow-500"
          />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Name */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Type className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Product Name</h3>
                  <p className="text-sm text-gray-600">
                    Update your product name
                  </p>
                </div>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., Classic Cotton T-Shirt"
                maxLength={100}
                required
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                  Max 100 characters
                </span>
                <span className="text-xs text-gray-500">
                  {formData.name.length}/100
                </span>
              </div>
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Category</h3>
                    <p className="text-sm text-gray-600">
                      Update product category
                    </p>
                  </div>
                </div>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                      className="capitalize"
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Price</h3>
                    <p className="text-sm text-gray-600">
                      Update product price in USD
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Product Image</h3>
                  <p className="text-sm text-gray-600">
                    Update product image (Optional)
                  </p>
                  {removedImage ? (
                    <p className="text-xs text-red-500 mt-1">
                      Image marked for removal — it will be deleted when you
                      save
                    </p>
                  ) : existingImage && !selectedFile ? (
                    <p className="text-xs text-gray-500 mt-1">
                      Current image will be kept if not replaced
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Product preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      {existingImage
                        ? "Replace product image"
                        : "Upload product image"}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      JPG, PNG up to 5MB
                    </p>
                    <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                      {existingImage ? "Replace File" : "Choose File"}
                    </div>
                  </div>
                )}
              </div>

              {selectedFile && (
                <p className="text-sm text-green-600 mt-3 font-medium">
                  ✓ New image selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Sizes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Available Sizes</h3>
                  <p className="text-sm text-gray-600">
                    Update available sizes for this product
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.sizes.includes(size)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Selected:{" "}
                {formData.sizes.length > 0 ? formData.sizes.join(", ") : "None"}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Description</h3>
                  <p className="text-sm text-gray-600">
                    Update your product description
                  </p>
                </div>
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                placeholder="Write a detailed description of your product..."
                maxLength={500}
              />

              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                  Max 500 characters
                </span>
                <span className="text-xs text-gray-500">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Product Features</h3>
                  <p className="text-sm text-gray-600">
                    Update key features of your product
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={detailInput}
                  onChange={(e) => setDetailInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddDetail())
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g., 100% Cotton, Machine Washable"
                />
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {formData.details.map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{detail}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDetail(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Our Guarantees</h3>
                  <p className="text-sm text-gray-600">
                    Update product guarantees and commitments
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={commitmentInput}
                  onChange={(e) => setCommitmentInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddCommitment())
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g., 30-day money back guarantee"
                />
                <button
                  type="button"
                  onClick={handleAddCommitment}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {formData.commitment.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCommitment(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Update Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Completion
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {
                        [
                          formData.name,
                          formData.categoryId,
                          formData.price,
                          formData.sizes.length > 0,
                        ].filter(Boolean).length
                      }
                      /4
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ([
                            formData.name,
                            formData.categoryId,
                            formData.price,
                            formData.sizes.length > 0,
                          ].filter(Boolean).length /
                            4) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.name
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.name ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {formData.name ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Product name updated</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.categoryId
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.categoryId ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {formData.categoryId ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Category selected</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.price
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.price ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {formData.price ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Price updated</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.sizes.length > 0
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.sizes.length > 0
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {formData.sizes.length > 0 ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Sizes selected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Editing Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Type className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Keep product names clear and descriptive
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    High-quality images improve conversions
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Tag className="w-3 h-3 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Accurate sizes reduce return rates
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-3 h-3 text-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Detailed descriptions build trust
                  </p>
                </div>
              </div>
            </div>

            {/* Update Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Save Changes</h3>
              <p className="text-sm text-gray-600 mb-6">
                Your updates will be saved immediately. The product will be
                updated in your store.
              </p>
              <button
                onClick={handleSubmit}
                disabled={
                  saving ||
                  !formData.name ||
                  !formData.categoryId ||
                  !formData.price
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Product
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Changes will be visible immediately
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProducts;
