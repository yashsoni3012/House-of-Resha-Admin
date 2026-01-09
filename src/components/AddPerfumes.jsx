import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Swal from "sweetalert2";
import {
  Upload,
  Plus,
  X,
  ArrowLeft,
  CheckCircle,
  Eye,
  Tag,
  BarChart3,
  Type,
  Image as ImageIcon,
  Package,
  DollarSign,
  Shield,
  AlertCircle,
  Save,
  FileText,
  Droplets,
  CheckSquare,
  AlertTriangle,
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

const AddPerfumes = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    volume: "",
    text: "",
    inStock: true,
  });

  useEffect(() => {
    // Cleanup preview URL on unmount
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // SweetAlert function for perfume creation success
  const showPerfumeCreated = async () => {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Perfume added successfully!",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: "#10B981",
      color: "white",
      customClass: {
        popup: "swal2-toast",
        title: "text-white",
      },
    });
  };

  // SweetAlert function for errors
  const showErrorPopup = async (message) => {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: "#EF4444",
      color: "white",
      customClass: {
        popup: "swal2-toast",
        title: "text-white",
      },
    });
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

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTextChange = (value) => {
    setFormData((prev) => ({ ...prev, text: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name) {
      const errorMsg = "Perfume name is required";
      setError(errorMsg);
      await showErrorPopup(errorMsg);
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      const errorMsg = "Please enter a valid price";
      setError(errorMsg);
      await showErrorPopup(errorMsg);
      return;
    }

    if (!formData.volume || Number(formData.volume) <= 0) {
      const errorMsg = "Please enter a valid volume";
      setError(errorMsg);
      await showErrorPopup(errorMsg);
      return;
    }

    if (!selectedFile) {
      const errorMsg = "Perfume image is required";
      setError(errorMsg);
      await showErrorPopup(errorMsg);
      return;
    }

    try {
      setSaveLoading(true);

      const postData = new FormData();
      postData.append("name", formData.name.trim());
      postData.append("price", Number(formData.price));
      postData.append("volume", Number(formData.volume));
      postData.append("text", formData.text || "");
      postData.append("inStock", formData.inStock);
      postData.append("image", selectedFile);

      const response = await axios.post(
        "https://api.houseofresha.com/perfume",
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Success:", response.data);

      // Show success popup (don't wait for it)
      showPerfumeCreated();

      // INSTANT redirect to glow-rituals page
      navigate("/glow-rituals");
    } catch (error) {
      console.error("Error posting perfume:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to add perfume. Please try again.";
      setError(errorMsg);
      await showErrorPopup(errorMsg);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/glow-rituals");
  };

  const handlePreview = () => {
    if (!formData.name || !selectedFile) {
      const errorMsg = "Complete name and image to preview";
      setError(errorMsg);
      showErrorPopup(errorMsg);
      return;
    }
    setShowPreviewModal(true);
  };

  const completionSteps = [
    { label: "Perfume name", completed: !!formData.name },
    {
      label: "Price set",
      completed: !!formData.price && Number(formData.price) > 0,
    },
    {
      label: "Volume set",
      completed: !!formData.volume && Number(formData.volume) > 0,
    },
    { label: "Image uploaded", completed: !!selectedFile },
    { label: "Stock status", completed: true },
  ];

  const completedStepsCount = completionSteps.filter(
    (step) => step.completed
  ).length;

  // Quill modules configuration
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

  // Quill formats
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

  return (
    <div className="min-h-screen bg-gray-50">
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
                  Back to Perfumes
                </span>
              </button>

              {/* Divider - Hidden on mobile, visible on tablet+ */}
              <div className="h-6 w-px bg-gray-300 hidden sm:block flex-shrink-0"></div>

              {/* Title and Description */}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Add New Perfume
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                  Add a new perfume to your Glow Rituals collection
                </p>
              </div>
            </div>

            {/* Right Section: Action Buttons */}
            <div className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
              {/* Preview Button */}
              <button
                onClick={handlePreview}
                disabled={!formData.name || !selectedFile}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span>Preview</span>
              </button>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={
                  saveLoading ||
                  !formData.name ||
                  !formData.price ||
                  !formData.volume ||
                  !selectedFile
                }
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 font-medium shadow-sm hover:shadow-md text-sm sm:text-base whitespace-nowrap"
              >
                {saveLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Create Perfume</span>
                    <span className="sm:hidden">Create</span>
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
            icon={Tag}
            label="Price"
            value={formData.price ? `₹${formData.price}` : "₹0"}
            color="bg-blue-500"
          />
          <StatsCard
            icon={Droplets}
            label="Volume"
            value={formData.volume ? `${formData.volume}ml` : "0ml"}
            color="bg-purple-500"
          />
          <StatsCard
            icon={CheckSquare}
            label="Stock Status"
            value={formData.inStock ? "In Stock" : "Out of Stock"}
            color={formData.inStock ? "bg-green-500" : "bg-red-500"}
          />
          <StatsCard
            icon={BarChart3}
            label="Progress"
            value={`${completedStepsCount}/5`}
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
            {/* Perfume Name */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Type className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Perfume Name</h3>
                  <p className="text-sm text-gray-600">
                    Enter your perfume name
                  </p>
                </div>
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., Midnight Rose Perfume"
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

            {/* Price & Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Price</h3>
                    <p className="text-sm text-gray-600">
                      Perfume price in INR
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
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {/* Volume */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Volume</h3>
                    <p className="text-sm text-gray-600">
                      Volume in milliliters (ml)
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="volume"
                    step="1"
                    min="0"
                    value={formData.volume}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="0"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ml
                  </span>
                </div>
              </div>
            </div>

            {/* Perfume Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 lg:p-6">
              {/* Header Section */}
              <div className="flex items-start sm:items-center gap-3 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                    Perfume Image
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                    Upload perfume image{" "}
                    <span className="text-red-600 font-medium">(Required)</span>
                  </p>
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
                      alt="Perfume preview"
                      className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover object-center rounded-lg"
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
                      Click to upload perfume image
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 text-center">
                      JPG, PNG up to 5MB
                    </p>
                    <div className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-medium text-sm sm:text-base shadow-sm hover:shadow-md">
                      Choose File
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
                      <p className="text-xs sm:text-sm text-green-700 font-medium break-words">
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

            {/* Description Field with React Quill Editor */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 lg:p-6">
              {/* Header Section */}
              <div className="flex items-start sm:items-center gap-3 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                    Description
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                    Add perfume description and details
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
                  placeholder="Enter detailed description about the perfume including fragrance notes, usage, etc..."
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

            {/* Stock Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Stock Status</h3>
                  <p className="text-sm text-gray-600">
                    Set availability status
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${
                      formData.inStock ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        formData.inStock
                          ? "transform translate-x-5"
                          : "transform translate-x-1"
                      }`}
                    ></div>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    {formData.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  <p className="text-sm text-gray-500">
                    {formData.inStock
                      ? "Available for purchase"
                      : "Currently unavailable"}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Creation Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Completion
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {completedStepsCount}/5
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(completedStepsCount / 5) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  {completionSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        step.completed
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-3 h-3 text-white" />
                        ) : null}
                      </div>
                      <span className="text-sm">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Perfume Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Type className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Use descriptive and appealing perfume names
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    High-quality images showcase your perfume better
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-3 h-3 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Specify accurate volume for customer clarity
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3 h-3 text-teal-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Rich descriptions help customers understand the fragrance
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Update stock status regularly to avoid order issues
                  </p>
                </div>
              </div>
            </div>

            {/* Create Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Ready to create?</h3>
              <p className="text-sm text-gray-600 mb-6">
                All required fields must be filled. Your perfume will be added
                to your Glow Rituals collection immediately.
              </p>
              <button
                onClick={handleSubmit}
                disabled={
                  saveLoading ||
                  !formData.name ||
                  !formData.price ||
                  !formData.volume ||
                  !selectedFile
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saveLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Perfume
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Perfume will be visible in your Glow Rituals collection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Perfume Preview
                </h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Perfume Image */}
              <div className="relative rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={previewImage}
                  alt={formData.name}
                  className="w-full h-64 sm:h-96 object-cover object-top"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                      formData.inStock
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {formData.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Perfume Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {formData.name || "Perfume Name"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price
                      </h4>
                      <p className="text-3xl font-bold text-indigo-600">
                        ₹{formData.price || "0"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        Volume
                      </h4>
                      <p className="text-3xl font-bold text-gray-800">
                        {formData.volume || "0"}ml
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {formData.text && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Description
                      </h4>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div
                          className="prose max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html:
                              formData.text || "<p>No description provided</p>",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleSubmit({ preventDefault: () => {} });
                  }}
                  disabled={saveLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                >
                  {saveLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Perfume Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPerfumes;
