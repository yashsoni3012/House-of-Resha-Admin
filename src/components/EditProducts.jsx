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

        setFormData({
          name: product.name || "",
          categoryId: product.categoryId?._id || "",
          price: parseFloat(Number(loadedPrice).toFixed(2)),
          description: product.description || "",
          text: product.text || "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("categoryId", formData.categoryId);
      fd.append("description", formData.description || "");
      fd.append("text", formData.text || "");
      fd.append("price", String(Math.round(Number(formData.price))));

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
        price: Math.round(Number(formData.price)),
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

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }], // ✅ correct
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Quill formats
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list", // ✔ handles both bullet & ordered
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
                      Update product price in INR
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
                    step="1"
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
                      className="w-full h-64 object-cover object-top rounded-lg"
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

            {/* Text Field with React Quill Editor */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Additional Text</h3>
                  <p className="text-sm text-gray-600">
                    Update additional text information
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                <ReactQuill
                  value={formData.text}
                  onChange={handleTextChange}
                  modules={quillModules}
                  formats={quillFormats}
                  theme="snow"
                  placeholder="Update additional text information about the product..."
                  className="min-h-[200px] bg-white"
                />
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Rich text editor with formatting options</span>
                  <span>
                    Characters: {formData.text.replace(/<[^>]*>/g, "").length}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Features */}
            {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
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
            </div> */}

            {/* Guarantees */}
            {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
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
            </div> */}
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
