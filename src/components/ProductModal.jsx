import React, { useState, useEffect } from "react";
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

// ✅ Use Vercel proxy in production to avoid CORS for PATCH
// ✅ Use direct API on localhost (your local works already)
const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "https://api.houseofresha.com"
    : "/api/proxy";

// Images are served by the real API host
const ASSET_HOST = "https://api.houseofresha.com";

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

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/category`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Failed to fetch categories: ${res.status}`);
      }

      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const t = await res.text().catch(() => "");
        throw new Error(`Server returned non-JSON: ${t.substring(0, 120)}`);
      }

      const result = await res.json();

      if (Array.isArray(result)) return result;
      if (result && Array.isArray(result.data)) return result.data;
      if (result?.data?.data && Array.isArray(result.data.data))
        return result.data.data;
      if (result?.success && Array.isArray(result.data)) return result.data;
      if (result?.categories && Array.isArray(result.categories))
        return result.categories;

      return [];
    },
    enabled: isOpen,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

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
        sizes: product.sizes || [],
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
        // ✅ Always build image preview from real API host
        const fullPath = imgPath.startsWith("http")
          ? imgPath
          : `${ASSET_HOST}${imgPath}`;
        setImagePreview(fullPath);
        setOriginalImage(imgPath);
      } else {
        setImagePreview("");
        setOriginalImage("");
      }

      setServerError("");
      setNewSize("");
      refetchCategories();
    } else if (isOpen) {
      resetForm();
      refetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      sizes: [],
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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setOriginalImage("");
    setFormData((prev) => ({ ...prev, images: [""] }));
  };

  const addSize = () => {
    const s = newSize.trim().toUpperCase();
    if (!s) return setServerError("Size cannot be empty");
    if (formData.sizes.includes(s))
      return setServerError(`Size "${s}" already exists`);
    setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, s] }));
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
    const d = newDetail.trim();
    if (!d) return;
    setFormData((prev) => ({ ...prev, details: [...prev.details, d] }));
    setNewDetail("");
  };

  const removeDetail = (i) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, idx) => idx !== i),
    }));
  };

  const addCommitment = () => {
    const c = newCommitment.trim();
    if (!c) return;
    setFormData((prev) => ({ ...prev, commitment: [...prev.commitment, c] }));
    setNewCommitment("");
  };

  const removeCommitment = (i) => {
    setFormData((prev) => ({
      ...prev,
      commitment: prev.commitment.filter((_, idx) => idx !== i),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (formData.sizes.length === 0)
      newErrors.sizes = "At least one size is required";
    if (!product && !imageFile && !formData.images[0]?.trim())
      newErrors.images = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanged = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return JSON.stringify([...a].sort()) !== JSON.stringify([...b].sort());
    }
    return a !== b;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      let url = `${API_BASE_URL}/clothing`;
      let method = "POST";
      let body = null;
      const headers = {};

      if (!product) {
        const fd = new FormData();
        fd.append("name", formData.name.trim());
        fd.append("description", formData.description.trim());
        fd.append("price", String(Number(formData.price)));
        fd.append("categoryId", formData.categoryId);
        fd.append("sizes", JSON.stringify(formData.sizes));
        fd.append("details", JSON.stringify(formData.details));
        fd.append("commitment", JSON.stringify(formData.commitment));
        if (imageFile) fd.append("image", imageFile);
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
        } else {
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

      const response = await fetch(url, {
        method,
        headers: body instanceof FormData ? {} : headers,
        body,
      });

      const ct = response.headers.get("content-type") || "";
      const raw = await response.text();
      const data = ct.includes("application/json")
        ? raw
          ? JSON.parse(raw)
          : null
        : raw;

      if (!response.ok) {
        if (
          !ct.includes("application/json") &&
          typeof raw === "string" &&
          raw.trim().startsWith("<!DOCTYPE")
        ) {
          throw new Error(
            `Request failed (${response.status}). Server returned HTML instead of JSON.`
          );
        }
        throw new Error(
          (data && data.message) ||
            `Request failed with status ${response.status}`
        );
      }

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
        customClass: { popup: "swal2-toast", title: "text-white" },
      });

      if (onSubmit) await onSubmit(data);
      if (refetchProducts) await refetchProducts();

      resetForm();
      onClose();
    } catch (err) {
      const msg = err?.message || "Failed to submit product. Please try again.";
      setServerError(msg);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: msg,
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: "#EF4444",
        color: "white",
        customClass: { popup: "swal2-toast", title: "text-white" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // --- your UI render functions / JSX unchanged ---
  // Keep your existing UI from here onward; only base URL + submit logic matters.

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
      {/* keep your existing modal UI; ensure submit button uses handleSubmit */}
      {/* ... */}
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
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {serverError && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg p-4">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>
                  <strong>Error:</strong> {serverError}
                </span>
              </p>
            </div>
          )}

          {/* Keep the rest of your form UI; just ensure category uses renderCategoryDropdown() */}
          {/* Submit button: */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoadingCategories}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl"
          >
            {isSubmitting
              ? "Saving..."
              : product
              ? "Update Product"
              : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
