import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
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
  FileText,
  Info,
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
  const [removedImage, setRemovedImage] = useState(false);
  const [showNoChangesModal, setShowNoChangesModal] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    description: "",
    text: "",
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

        let loadedPrice;
        if (location?.state?.price !== undefined) {
          loadedPrice = Number(location.state.price);
        } else {
          const raw = Number(product.price);
          if (!Number.isFinite(raw) || isNaN(raw)) {
            loadedPrice = 0;
          } else if (raw >= 100000) {
            loadedPrice = raw / 100;
          } else {
            loadedPrice = raw;
          }
        }

        // FIX: Parse price as integer to avoid floating point issues
        const parsedPrice = Math.round(loadedPrice);

        const formDataObj = {
          name: product.name || "",
          categoryId: product.categoryId?._id || "",
          price: parsedPrice,
          description: product.description || "",
          text: product.text || "",
          sizes: product.sizes || [],
          details: product.details || [],
          commitment: product.commitment || [],
        };

        setFormData(formDataObj);
        setOriginalData(formDataObj);

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

  const hasChanges = () => {
    if (!originalData) return false;

    // Check form data changes
    const formFields = ['name', 'price', 'categoryId', 'description', 'text'];
    for (let field of formFields) {
      if (String(formData[field]) !== String(originalData[field])) {
        return true;
      }
    }

    // Check arrays changes
    const arrayFields = ['sizes', 'details', 'commitment'];
    for (let field of arrayFields) {
      if (JSON.stringify(formData[field]) !== JSON.stringify(originalData[field])) {
        return true;
      }
    }

    // Check image changes
    if (selectedFile || removedImage) {
      return true;
    }

    return false;
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
    setRemovedImage(false);

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
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
    const { name, value, type } = e.target;

    if (name === "price") {
      const numericValue = value.replace(/[^\d]/g, "");

      if (numericValue === "") {
        setFormData((prev) => ({ ...prev, price: "" }));
      } else {
        const intValue = parseInt(numericValue, 10);
        if (!isNaN(intValue)) {
          setFormData((prev) => ({ ...prev, price: intValue }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setError(null);
  };

  const handleTextChange = (value) => {
    setFormData((prev) => ({ ...prev, text: value }));
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

    // Check if there are any changes
    if (!hasChanges()) {
      setShowNoChangesModal(true);
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("categoryId", formData.categoryId);
      fd.append("description", formData.description || "");
      fd.append("text", formData.text || "");

      const priceInt = parseInt(formData.price, 10);
      if (isNaN(priceInt) || priceInt <= 0) {
        throw new Error("Invalid price value");
      }
      fd.append("price", priceInt.toString());

      formData.sizes.forEach((s) => fd.append("sizes[]", s));
      formData.details.forEach((d) => fd.append("details[]", d));
      formData.commitment.forEach((c) => fd.append("commitment[]", c));

      if (selectedFile instanceof File) {
        fd.append("image", selectedFile);
      }

      if (removedImage) {
        fd.append("removeImage", "1");
      }

      console.log("Updating product with data:", {
        name: formData.name,
        price: priceInt,
        categoryId: formData.categoryId,
        text: formData.text,
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

      showProductUpdated();

      setTimeout(() => {
        navigate("/fashion");
      });
    } catch (error) {
      console.error("Update error:", error);
      setError(error.message || "Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/fashion");
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "color",
    "background",
    "align",
    "link",
    "image",
  ];

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
      {/* No Changes Modal */}
      {showNoChangesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                No Changes Detected
              </h3>
              <p className="text-gray-600 text-center mb-6">
                You haven't made any changes to the product information. 
                Please make changes before updating.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNoChangesModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    setShowNoChangesModal(false);
                    navigate("/fashion");
                  }}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            {/* Left Section: Back Button and Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors self-start sm:self-auto"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base whitespace-nowrap">
                  Back to Products
                </span>
              </button>

              {/* Divider - Hidden on mobile, visible on tablet+ */}
              <div className="h-6 w-px bg-gray-300 hidden sm:block flex-shrink-0"></div>

              {/* Title and Description */}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Edit Product
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                  Update your existing product
                </p>
              </div>
            </div>

            {/* Right Section: Action Buttons */}
            <div className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
              {/* Preview Button */}
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
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span>Preview</span>
              </button>

              {/* Update Button */}
              <button
                onClick={handleSubmit}
                disabled={
                  saving ||
                  !formData.name ||
                  !formData.categoryId ||
                  !formData.price
                }
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 font-medium shadow-sm hover:shadow-md text-sm sm:text-base whitespace-nowrap"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Update Product</span>
                    <span className="sm:hidden">Update</span>
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

              {/* Price - FIXED SECTION */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Price</h3>
                    <p className="text-sm text-gray-600">
                      Update product price in INR
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₹
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="0"
                    required
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Enter whole number (e.g., 14700, 2500)</span>
                    <span>Current: ₹{formData.price || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 lg:p-6">
              {/* Header Section */}
              <div className="flex items-start sm:items-center gap-3 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                    Product Image
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                    Update product image{" "}
                    <span className="text-gray-500 font-medium">(Optional)</span>
                  </p>
                  {removedImage ? (
                    <p className="text-xs text-red-500 mt-1 sm:mt-1.5 leading-relaxed">
                      Image marked for removal — it will be deleted when you save
                    </p>
                  ) : existingImage && !selectedFile ? (
                    <p className="text-xs text-gray-500 mt-1 sm:mt-1.5 leading-relaxed">
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

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-5 lg:p-6 hover:border-indigo-400 transition-colors">
                {previewImage ? (
                  // Image Preview
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Product preview"
                      className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover object-top rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 active:bg-red-700 transition-colors shadow-lg"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ) : (
                  // Upload Prompt
                  <div
                    onClick={triggerFileInput}
                    className="flex flex-col items-center cursor-pointer py-4 sm:py-6"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1 text-sm sm:text-base text-center px-2">
                      {existingImage
                        ? "Replace product image"
                        : "Upload product image"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 text-center">
                      JPG, PNG up to 5MB
                    </p>
                    <div className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-medium text-sm sm:text-base shadow-sm hover:shadow-md">
                      {existingImage ? "Replace File" : "Choose File"}
                    </div>
                  </div>
                )}
              </div>

              {/* File Selected Info */}
              {selectedFile && (
                <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 flex-shrink-0 text-green-600 mt-0.5 font-bold">
                      ✓
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-green-700 font-medium">
                        New image selected
                      </p>
                      <p className="text-xs sm:text-sm text-green-600 break-words mt-0.5">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sizes */}
           <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 lg:p-6">
              {/* Header Section */}
              <div className="flex items-start sm:items-center gap-3 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                    Available Sizes
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                    Update available sizes for this product
                  </p>
                </div>
              </div>

              {/* Size Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base min-w-[60px] sm:min-w-[70px] ${
                      formData.sizes.includes(size)
                        ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Selected Sizes Info */}
              <div className="mt-3 sm:mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                    Selected:
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 break-words">
                    {formData.sizes.length > 0 ? (
                      <span className="font-medium text-indigo-600">
                        {formData.sizes.join(", ")}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">None</span>
                    )}
                  </span>
                  {formData.sizes.length > 0 && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      ({formData.sizes.length} size{formData.sizes.length > 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Text Field with React Quill Editor */}
           <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 lg:p-6">
              {/* Header Section */}
              <div className="flex items-start sm:items-center gap-3 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                    Additional Text
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                    Update additional text information
                  </p>
                </div>
              </div>

              {/* Editor Container */}
              <div className="rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <ReactQuill
                  value={formData.text}
                  onChange={handleTextChange}
                  modules={quillModules}
                  formats={quillFormats}
                  theme="snow"
                  placeholder="Update additional text information about the product..."
                  className="min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] bg-white"
                />
              </div>

              {/* Footer Info */}
              <div className="mt-2 sm:mt-3 text-xs text-gray-500">
                <div className="flex flex-col xs:flex-row xs:justify-between gap-1 xs:gap-2">
                  <span className="truncate">
                    Rich text editor with formatting options
                  </span>
                  <span className="text-gray-600 font-medium whitespace-nowrap">
                    Characters: {formData.text.replace(/<[^>]*>/g, "").length}
                  </span>
                </div>
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
                  <div>
                    <p className="text-sm text-gray-600">
                      Accurate sizes reduce return rates
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3 h-3 text-teal-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Rich text editor allows for better formatting and
                    presentation
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