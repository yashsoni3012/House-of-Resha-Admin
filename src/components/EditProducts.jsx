// EditProducts.jsx - Enhanced Edit Product Component
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showProductUpdated } from "../utils/sweetAlertConfig";
import axios from "axios";

import {
  Save,
  X,
  Upload,
  ArrowLeft,
  AlertCircle,
  Check,
  Package,
  Tag,
  FileText,
  Shield,
} from "lucide-react";

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [detailInput, setDetailInput] = useState("");
  const [commitmentInput, setCommitmentInput] = useState("");

  const fileInputRef = useRef(null);

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
        setFormData({
          name: product.name || "",
          categoryId: product.categoryId?._id || "",
          price: Math.round(Number(product.price) / 100),
          description: product.description || "",
          sizes: product.sizes || [],
          details: product.details || [],
          commitment: product.commitment || [],
        });

        if (product.images) {
          setPreviewImage(`https://api.houseofresha.com${product.images}`);
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

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
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

    // Show success
    setSuccess(true);
    // Show sweetalert notification
    await showProductUpdated();
    // Redirect after 1.5 seconds
    setTimeout(() => {
      navigate("/products");
    }, 1500);

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
      fd.append("price", String(Math.round(Number(formData.price)) * 100));

      formData.sizes.forEach((s) => fd.append("sizes[]", s));
      formData.details.forEach((d) => fd.append("details[]", d));
      formData.commitment.forEach((c) => fd.append("commitment[]", c));

      if (selectedFile instanceof File) {
        fd.append("image", selectedFile);
      }

      // 🔥 DEBUG: Check FormData content
      for (let [key, value] of fd.entries()) {
        console.log("FormData:", key, value);
      }

      // 🔥 AXIOS PATCH
      const res = await axios.patch(`/clothing/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Update failed");
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/products");
      }, 1200);
    } catch (err) {
      console.error("PATCH error:", err);

      // Axios error handling
      if (err.response) {
        // Server responded with status code outside 2xx
        setError(err.response.data?.message || "Product update failed");
      } else if (err.request) {
        // Request made but no response (Network Error / CORS)
        setError(
          "Network error or CORS issue. Make sure the server allows PATCH requests from your origin."
        );
      } else {
        // Something else
        setError(err.message || "Product update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <button
              onClick={handleBack}
              className="self-start flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-all font-medium group"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to Products
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Edit Product
              </h1>
            </div>

            <div className="w-32 hidden md:block"></div>
          </div>

          {/* Error Message */}
          {error && !success && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm">
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Product updated successfully!</p>
                <p className="text-sm">Redirecting to products page...</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                Basic Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                    placeholder="e.g., Classic Cotton T-Shirt"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none capitalize transition-all"
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                Product Image
              </h3>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />

              {previewImage ? (
                <div className="space-y-4">
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-center text-sm text-gray-600 font-medium">
                    {selectedFile
                      ? "✓ New image selected"
                      : "Current product image"}
                  </p>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="w-full px-4 py-3 bg-white border-2 border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 transition-all font-medium"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="w-full px-6 py-8 border-3 border-dashed border-purple-300 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-700 font-semibold mb-1">
                      Click to upload product image
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, WebP • Max 5MB
                    </p>
                  </div>
                </button>
              )}
            </div>

            {/* Sizes Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-600" />
                Available Sizes
              </h3>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      formData.sizes.includes(size)
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4 font-medium">
                Selected:{" "}
                {formData.sizes.length > 0 ? formData.sizes.join(", ") : "None"}
              </p>
            </div>

            {/* Description Section */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-600" />
                Product Description
              </h3>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all resize-none"
                placeholder="Describe your product in detail..."
              />
            </div>

            {/* Details Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-indigo-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Product Features
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={detailInput}
                  onChange={(e) => setDetailInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddDetail())
                  }
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                  placeholder="e.g., 100% Cotton, Machine Washable"
                />
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border-2 border-indigo-100 shadow-sm group hover:border-indigo-300 transition-all"
                  >
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <span className="flex-1 text-sm text-gray-700 font-medium">
                      {detail}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDetail(idx)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Commitments Section */}
            <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-6 border-2 border-rose-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-600" />
                Our Guarantee
              </h3>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={commitmentInput}
                  onChange={(e) => setCommitmentInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddCommitment())
                  }
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all"
                  placeholder="e.g., 30-day money back guarantee"
                />
                <button
                  type="button"
                  onClick={handleAddCommitment}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.commitment.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border-2 border-rose-100 shadow-sm group hover:border-rose-300 transition-all"
                  >
                    <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                    <span className="flex-1 text-sm text-gray-700 font-medium">
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCommitment(idx)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all text-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 hover:from-pink-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transform hover:scale-105"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Updating Product...
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProducts;
