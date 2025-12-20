import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  X,
  Plus,
  Trash2,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Package,
  Info,
  Target,
  Upload as UploadIcon,
  Check,
} from "lucide-react";

const API_BASE_URL = "https://api.houseofresha.com";

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  refetchProducts,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    sizes: [],
    details: [],
    commitment: [],
    images: [""],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [originalImage, setOriginalImage] = useState("");

  const [newDetail, setNewDetail] = useState("");
  const [newCommitment, setNewCommitment] = useState("");
  const [newSize, setNewSize] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // ✅ Fixed categories fetching with better error handling
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        console.log("Fetching categories from:", `${API_BASE_URL}/category`);

        const res = await fetch(`${API_BASE_URL}/category`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", res.status, res.statusText);

        if (!res.ok) {
          let errorMessage = `Failed to fetch categories: ${res.status}`;
          try {
            const errorData = await res.text();
            if (errorData) {
              try {
                const parsedError = JSON.parse(errorData);
                errorMessage =
                  parsedError.message || parsedError.error || errorMessage;
              } catch {
                errorMessage = errorData.substring(0, 100);
              }
            }
          } catch {
            // Ignore if we can't read error body
          }
          throw new Error(errorMessage);
        }

        const contentType = res.headers.get("content-type");
        console.log("Content-Type:", contentType);

        // Handle different response types
        if (contentType && contentType.includes("application/json")) {
          const result = await res.json();
          console.log("Categories API Response:", result);

          // Handle different response structures
          if (Array.isArray(result)) {
            return result;
          } else if (result && Array.isArray(result.data)) {
            return result.data;
          } else if (result && result.data && Array.isArray(result.data.data)) {
            return result.data.data;
          } else if (result && result.success && Array.isArray(result.data)) {
            return result.data;
          } else if (
            result &&
            result.categories &&
            Array.isArray(result.categories)
          ) {
            return result.categories;
          } else {
            console.warn("Unexpected response structure:", result);
            return [];
          }
        } else {
          // Handle non-JSON response
          const textResponse = await res.text();
          console.warn(
            "Non-JSON response received:",
            textResponse.substring(0, 200)
          );
          throw new Error("Server returned non-JSON response");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    },
    enabled: isOpen, // Only fetch when modal is open
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2, // Retry failed requests twice
  });

  // Debug: Log categories when they change
  useEffect(() => {
    if (categories.length > 0) {
      console.log("Categories loaded:", categories);
    }
  }, [categories]);

  useEffect(() => {
    if (product && isOpen) {
      const imgPath = Array.isArray(product.images)
        ? product.images[0]
        : product.images;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        categoryId: product.categoryId?._id || product.categoryId || "",
        sizes: product.sizes || [], // Use empty array if no sizes
        details: product.details?.length
          ? product.details.filter((d) => d && d.trim() !== "")
          : [],
        commitment: product.commitment?.length
          ? product.commitment.filter((c) => c && c.trim() !== "")
          : [],
        images: imgPath ? [imgPath] : [""],
      });

      setImageFile(null);
      if (imgPath) {
        const fullPath = imgPath.startsWith("http")
          ? imgPath
          : `${API_BASE_URL}${imgPath}`;
        setImagePreview(fullPath);
        setOriginalImage(imgPath);
      } else {
        setImagePreview("");
        setOriginalImage("");
      }
      setServerError("");
      setNewSize(""); // Reset newSize input

      // Refetch categories when opening modal with a product
      refetchCategories();
    } else if (isOpen) {
      resetForm();
      // Refetch categories when opening empty modal
      refetchCategories();
    }
  }, [product, isOpen, refetchCategories]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      sizes: [], // Start with empty array
      details: [],
      commitment: [],
      images: [""],
    });
    setImageFile(null);
    setImagePreview("");
    setOriginalImage("");
    setNewDetail("");
    setNewCommitment("");
    setNewSize("");
    setErrors({});
    setServerError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        images: "Only image files are allowed",
      }));
      return;
    }
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        images: "Image size must be less than 5MB",
      }));
      return;
    }

    setImageFile(file);
    setErrors((prev) => ({ ...prev, images: "" }));
    setServerError("");

    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setOriginalImage("");
    setFormData((prev) => ({ ...prev, images: [""] }));
  };

  const addSize = () => {
    const s = newSize.trim().toUpperCase();
    if (!s) {
      setServerError("Size cannot be empty");
      return;
    }
    if (formData.sizes.includes(s)) {
      setServerError(`Size "${s}" already exists`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, s],
    }));
    setNewSize("");
    setServerError("");
  };

  const removeSize = (s) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((x) => x !== s),
    }));
  };

  const addDetail = () => {
    const trimmedDetail = newDetail.trim();
    if (!trimmedDetail) return;

    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, trimmedDetail],
    }));
    setNewDetail("");
    setServerError("");
  };

  const removeDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const addCommitment = () => {
    const trimmedCommitment = newCommitment.trim();
    if (!trimmedCommitment) return;

    setFormData((prev) => ({
      ...prev,
      commitment: [...prev.commitment, trimmedCommitment],
    }));
    setNewCommitment("");
    setServerError("");
  };

  const removeCommitment = (index) => {
    setFormData((prev) => ({
      ...prev,
      commitment: prev.commitment.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";

    // Check if at least one size is added
    if (formData.sizes.length === 0) {
      newErrors.sizes = "At least one size is required";
    }

    // For new products, image is required
    if (!product && !imageFile && !formData.images[0]?.trim())
      newErrors.images = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to check if values are different
  const hasChanged = (newValue, originalValue) => {
    if (Array.isArray(newValue) && Array.isArray(originalValue)) {
      return (
        JSON.stringify([...newValue].sort()) !==
        JSON.stringify([...originalValue].sort())
      );
    }
    return newValue !== originalValue;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      let url = `${API_BASE_URL}/clothing`;
      let method = "POST";
      let body;

      // For new products, use FormData
      if (!product) {
        const fd = new FormData();
        fd.append("name", formData.name.trim());
        fd.append("description", formData.description.trim());
        fd.append("price", String(Number(formData.price)));
        fd.append("categoryId", formData.categoryId);
        fd.append("sizes", JSON.stringify(formData.sizes));
        fd.append("details", JSON.stringify(formData.details));
        fd.append("commitment", JSON.stringify(formData.commitment));

        // Handle image for new product
        if (imageFile) {
          fd.append("image", imageFile);
        }

        body = fd;
      } else {
  const currentCategoryId = product.categoryId?._id || product.categoryId;
  const newPrice = Number(formData.price);

  const didChange =
    hasChanged(formData.name.trim(), product.name || "") ||
    hasChanged(formData.description.trim(), product.description || "") ||
    newPrice !== Number(product.price) ||
    hasChanged(formData.categoryId, currentCategoryId || "") ||
    hasChanged(formData.sizes, product.sizes || []) ||
    hasChanged(formData.details, product.details || []) ||
    hasChanged(formData.commitment, product.commitment || []) ||
    !!imageFile;

  if (!didChange) {
    setIsSubmitting(false);
    onClose();
    return;
  }

  url = `${API_BASE_URL}/clothing/${product._id}`;
  method = "PATCH";

  // ✅ IMAGE UPDATED → FormData
  if (imageFile) {
    const fd = new FormData();
    fd.append("name", formData.name.trim());
    fd.append("description", formData.description.trim());
    fd.append("price", String(newPrice));
    fd.append("categoryId", formData.categoryId);
    fd.append("sizes", JSON.stringify(formData.sizes));
    fd.append("details", JSON.stringify(formData.details));
    fd.append("commitment", JSON.stringify(formData.commitment));
    fd.append("image", imageFile);

    body = fd;
  }
  // ✅ NO IMAGE → JSON (THIS AVOIDS CORS ISSUE)
  else {
    body = JSON.stringify({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: newPrice,
      categoryId: formData.categoryId,
      sizes: formData.sizes,
      details: formData.details,
      commitment: formData.commitment,
    });

    headers["Content-Type"] = "application/json";
  }
}


      console.log("📤 Sending data to:", url, "Method:", method);
      console.log("Body type:", body instanceof FormData ? "FormData" : "JSON");

      const headers = {};

      // Set appropriate headers based on body type
      if (body instanceof FormData) {
        // FormData automatically sets Content-Type with boundary
        // Don't set Content-Type for FormData
      } else {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(url, {
        method,
        body,
      });

      console.log("Response status:", response.status, response.statusText);

      const contentType = response.headers.get("content-type") || "";
      const rawText = await response.text();
      let responseData = null;

      if (contentType.includes("application/json")) {
        try {
          responseData = rawText ? JSON.parse(rawText) : null;
        } catch (parseError) {
          throw new Error(
            `Invalid JSON response: ${rawText.substring(0, 100)}`
          );
        }
      } else {
        responseData = rawText;
      }

      if (!response.ok) {
        const snippet =
          typeof rawText === "string" ? rawText.substring(0, 200) : "";
        if (
          !contentType.includes("application/json") &&
          snippet.trim().startsWith("<!DOCTYPE")
        ) {
          throw new Error(
            `Request failed (${response.status}). Server returned HTML instead of JSON.`
          );
        }
        throw new Error(
          (responseData &&
            typeof responseData === "object" &&
            (responseData.message || responseData.error)) ||
            `Request failed with status ${response.status}`
        );
      }

      if (
        contentType.includes("application/json") &&
        responseData &&
        responseData.errors
      ) {
        console.error("API error response:", responseData);
      }

      // Show success toast notification on the right side
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: product ? "Product Updated!" : "Product Added!",
        text: product
          ? "Your product has been updated successfully."
          : "Your product has been added successfully.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#10B981",
        color: "white",
        customClass: {
          popup: "swal2-toast",
          title: "text-white",
        },
      });

      if (onSubmit) {
        await onSubmit(responseData);
      }
      if (refetchProducts) {
        await refetchProducts();
      }

      resetForm();
      onClose();
    } catch (err) {
      console.error("Submit error:", err);

      let errorMessage =
        err.message || "Failed to submit product. Please try again.";

      if (
        err.message.includes("HTML instead of JSON") ||
        err.message.includes("Invalid JSON response")
      ) {
        errorMessage =
          "Server returned an unexpected response. Please try again.";
      } else if (
        err.message.includes("NetworkError") ||
        err.message.includes("Failed to fetch")
      ) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (err.message.includes("CORS")) {
        errorMessage = "CORS error. Please contact support.";
      }

      setServerError(errorMessage);

      // Also show error toast
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: errorMessage,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: "#EF4444",
        color: "white",
        customClass: {
          popup: "swal2-toast",
          title: "text-white",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Category dropdown component
  const renderCategoryDropdown = () => {
    if (isLoadingCategories) {
      return (
        <div className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
          <RefreshCw className="animate-spin text-purple-600" size={16} />
          <span className="text-sm text-gray-600">Loading categories...</span>
        </div>
      );
    }

    if (categoriesError) {
      return (
        <div className="p-3 border-2 border-red-200 rounded-xl bg-red-50">
          <p className="text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={14} />
            Error loading categories: {categoriesError.message}
          </p>
          <button
            onClick={() => refetchCategories()}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return (
        <div className="p-3 border-2 border-yellow-200 rounded-xl bg-yellow-50">
          <p className="text-yellow-700 text-sm">
            No categories found. Please add categories first.
          </p>
        </div>
      );
    }

    return (
      <select
        name="categoryId"
        value={formData.categoryId || ""}
        onChange={handleInputChange}
        disabled={isLoadingCategories || categories.length === 0}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed ${
          errors.categoryId
            ? "border-red-400 bg-red-50"
            : "border-gray-200 focus:border-purple-400"
        }`}
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name || "Unnamed Category"}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                {product ? (
                  <>
                    <RefreshCw size={24} className="hidden sm:block" />
                    Edit Product
                  </>
                ) : (
                  <>
                    <Plus size={24} className="hidden sm:block" />
                    Add New Product
                  </>
                )}
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm mt-1">
                Fill in the details below to {product ? "update" : "create"}{" "}
                your product
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"></div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            {serverError && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4 animate-shake">
                <p className="text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>
                    <strong>Error:</strong> {serverError}
                  </span>
                </p>
              </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-5 border border-purple-100">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Tag size={16} className="text-white" />
                    </div>
                    Basic Information
                  </h3>

                  {/* Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                        errors.name
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-purple-400"
                      }`}
                      placeholder="e.g., Premium Cotton T-Shirt"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none ${
                        errors.description
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-purple-400"
                      }`}
                      placeholder="Describe your product in detail..."
                    />
                    {errors.description && (
                      <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Price & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <DollarSign size={14} className="text-purple-600" />
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                          errors.price
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-purple-400"
                        }`}
                        placeholder="0.00"
                      />
                      {errors.price && (
                        <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.price}
                        </p>
                      )}
                    </div>

                    {/* Category - Updated */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      {renderCategoryDropdown()}
                      {errors.categoryId && (
                        <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.categoryId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sizes */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-100">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Package size={16} className="text-white" />
                    </div>
                    Available Sizes *
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSize())
                      }
                      placeholder="e.g., XS, S, M, L, XL"
                      className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  {errors.sizes && (
                    <p className="text-red-600 text-xs mb-2 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.sizes}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.sizes.length === 0 ? (
                      <p className="text-gray-500 text-sm italic">
                        No sizes added yet. Click the + button to add sizes.
                      </p>
                    ) : (
                      formData.sizes.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1.5 bg-white border-2 border-blue-200 rounded-lg text-sm font-medium flex items-center gap-2 hover:border-blue-400 transition-all shadow-sm"
                        >
                          {s}
                          <button
                            type="button"
                            onClick={() => removeSize(s)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 sm:p-5 border border-pink-100">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                      <ImageIcon size={16} className="text-white" />
                    </div>
                    Product Image {!product ? "*" : ""}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Upload a high-quality image (JPG, PNG, WebP • Max 5MB)
                    {product && (
                      <span className="block mt-1 text-purple-600 font-medium">
                        Leave empty to keep current image
                      </span>
                    )}
                  </p>

                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover object-top border-4 border-white rounded-xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <X size={18} />
                      </button>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all rounded-xl"></div>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-3 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-all group"
                    >
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <UploadIcon size={28} className="text-white" />
                        </div>
                        <p className="mb-2 text-sm font-semibold text-gray-700">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, WebP (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                  {errors.images && (
                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.images}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 border border-green-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Info size={16} className="text-white" />
                </div>
                Product Details
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addDetail())
                  }
                  placeholder="e.g., 100% Cotton, Machine Washable"
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400"
                />
                <button
                  type="button"
                  onClick={addDetail}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="space-y-2">
                {formData.details.length === 0 ? (
                  <p className="text-gray-500 text-sm italic text-center py-4">
                    No details added yet
                  </p>
                ) : (
                  formData.details.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border-2 border-green-100 hover:border-green-300 transition-all"
                    >
                      <span className="text-sm text-gray-700 flex items-center gap-2">
                        <Check size={14} className="text-green-600" />
                        {d}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDetail(i)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Commitments */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 sm:p-5 border border-orange-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Target size={16} className="text-white" />
                </div>
                Our Commitments
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newCommitment}
                  onChange={(e) => setNewCommitment(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCommitment())
                  }
                  placeholder="e.g., 30-day money-back guarantee"
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={addCommitment}
                  className="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="space-y-2">
                {formData.commitment.length === 0 ? (
                  <p className="text-gray-500 text-sm italic text-center py-4">
                    No commitments added yet
                  </p>
                ) : (
                  formData.commitment.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border-2 border-orange-100 hover:border-orange-300 transition-all"
                    >
                      <span className="text-sm text-gray-700 flex items-center gap-2">
                        <Check size={14} className="text-orange-600" />
                        {c}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCommitment(i)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 to-white border-t-2 border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isLoadingCategories}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    {product ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    {product ? "Update Product" : "Create Product"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductModal;
