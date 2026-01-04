import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Swal from 'sweetalert2';
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
  DollarSign,
  Shield,
  AlertCircle,
  Save,
  FileText,
  Droplets,
  CheckSquare,
  AlertTriangle,
  Package,
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

const EditPerfumes = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [removedImage, setRemovedImage] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    volume: "",
    text: "",
    inStock: true,
  });

  // SweetAlert function for perfume update success
  const showPerfumeUpdated = async () => {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Perfume updated successfully!',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: '#10B981',
      color: 'white',
      customClass: {
        popup: 'swal2-toast',
        title: 'text-white'
      }
    });
  };

  // SweetAlert function for errors
  const showErrorPopup = async (message) => {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: '#EF4444',
      color: 'white',
      customClass: {
        popup: 'swal2-toast',
        title: 'text-white'
      }
    });
  };

  useEffect(() => {
    fetchPerfumeData();
    
    // Cleanup preview URL on unmount
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPerfumeData = async () => {
    try {
      setLoading(true);
      console.log('Fetching perfume with ID:', id);
      
      const response = await axios.get(`https://api.houseofresha.com/perfume/${id}`);
      console.log('API Response:', response.data);
      
      const perfume = response.data;
      
      // Handle different possible response structures
      const perfumeData = perfume.data || perfume;
      
      if (!perfumeData) {
        throw new Error('No data received from API');
      }
      
      setFormData({
        name: perfumeData.name || "",
        price: perfumeData.price || "",
        volume: perfumeData.volume || "",
        text: perfumeData.text || perfumeData.description || "",
        inStock: perfumeData.inStock !== undefined ? perfumeData.inStock : true
      });
      
      // Handle image path - check different possible properties
      const imagePath = perfumeData.image || perfumeData.images || perfumeData.imageUrl || "";
      if (imagePath) {
        const fullImagePath = imagePath.startsWith('http') 
          ? imagePath 
          : `https://api.houseofresha.com/${imagePath}`;
        setPreviewImage(fullImagePath);
        setExistingImage(imagePath);
      }
      
      setLoading(false);
      
    } catch (error) {
      console.error("Error fetching perfume:", error);
      console.error("Error details:", error.response?.data);
      setError(`Failed to load perfume data: ${error.response?.data?.message || error.message}`);
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      showErrorPopup("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size too large. Maximum size is 5MB.");
      showErrorPopup("File size too large. Maximum size is 5MB.");
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
            : `https://api.houseofresha.com/${existingImage}`
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleTextChange = (value) => {
    setFormData((prev) => ({ ...prev, text: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.name.trim()) {
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

    try {
      setSaving(true);

      // Create FormData for file upload
      const updateData = new FormData();
      updateData.append("name", formData.name.trim());
      updateData.append("price", Number(formData.price));
      updateData.append("volume", Number(formData.volume));
      updateData.append("text", formData.text || "");
      updateData.append("inStock", formData.inStock);
      
      // Only append image if a new one is selected
      if (selectedFile) {
        updateData.append("image", selectedFile);
      }

      if (removedImage) {
        updateData.append("removeImage", "1");
      }

      console.log("Sending update data for ID:", id);
      
      // Update data using PATCH method
      const response = await axios.patch(
        `https://api.houseofresha.com/perfume/${id}`,
        updateData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update successful:", response.data);
      
      // Show success popup
      await showPerfumeUpdated();
      
      // Redirect to /glow-rituals on success
      navigate("/glow-rituals");
      
    } catch (error) {
      console.error("Error updating perfume:", error);
      console.error("Error response:", error.response?.data);
      
      // Show detailed error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to update perfume. Please try again.";
      setError(`Update failed: ${errorMessage}`);
      await showErrorPopup(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/glow-rituals");
  };

  const handlePreview = () => {
    if (!formData.name) {
      const errorMsg = "Complete perfume name to preview";
      setError(errorMsg);
      showErrorPopup(errorMsg);
      return;
    }
    setShowPreviewModal(true);
  };

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

  const completionSteps = [
    { label: "Perfume name", completed: !!formData.name },
    { label: "Price updated", completed: !!formData.price && Number(formData.price) > 0 },
    { label: "Volume updated", completed: !!formData.volume && Number(formData.volume) > 0 },
    { label: "Stock status", completed: true },
  ];

  const completedStepsCount = completionSteps.filter(step => step.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading perfume data...</p>
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
                <span className="font-medium">Back to Perfumes</span>
              </button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Edit Perfume
                </h1>
                <p className="text-sm text-gray-600">
                  Update your existing perfume
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePreview}
                disabled={!formData.name}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  saving ||
                  !formData.name ||
                  !formData.price ||
                  !formData.volume
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
                    Update Perfume
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
            value={`${completedStepsCount}/4`}
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
                    Update your perfume name
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
                      Update perfume price in INR
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
                      Update volume in milliliters (ml)
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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Perfume Image</h3>
                  <p className="text-sm text-gray-600">
                    Update perfume image (Optional)
                  </p>
                  {removedImage ? (
                    <p className="text-xs text-red-500 mt-1">
                      Image marked for removal — it will be deleted when you save
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
                      alt="Perfume preview"
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
                        ? "Replace perfume image"
                        : "Upload perfume image"}
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

            {/* Description Field with React Quill Editor */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Description</h3>
                  <p className="text-sm text-gray-600">
                    Update perfume description and details
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
                  placeholder="Update detailed description about the perfume including fragrance notes, usage, etc..."
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

            {/* Stock Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Stock Status</h3>
                  <p className="text-sm text-gray-600">
                    Update availability status
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
              <h3 className="font-bold text-gray-900 mb-4">Update Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Completion
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {completedStepsCount}/4
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(completedStepsCount / 4) * 100}%`,
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
              <h3 className="font-bold text-gray-900 mb-4">Editing Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Type className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Keep perfume names clear and appealing
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

            {/* Update Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Save Changes</h3>
              <p className="text-sm text-gray-600 mb-6">
                Your updates will be saved immediately. The perfume will be updated in your Glow Rituals collection.
              </p>
              <button
                onClick={handleSubmit}
                disabled={
                  saving ||
                  !formData.name ||
                  !formData.price ||
                  !formData.volume
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
                    Update Perfume
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
                  src={previewImage || "https://via.placeholder.com/800x400?text=No+Image"}
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
                            __html: formData.text || "<p>No description provided</p>",
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
                  onClick={async () => {
                    setShowPreviewModal(false);
                    await handleSubmit({ preventDefault: () => {} });
                  }}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Perfume Now
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

export default EditPerfumes;