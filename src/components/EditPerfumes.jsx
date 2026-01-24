import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
  DollarSign,
  Shield,
  AlertCircle,
  Save,
  FileText,
  Droplets,
  CheckSquare,
  AlertTriangle,
  Package,
  Info, // Added for the modal
} from "lucide-react";

const BASE_URL = "https://api.houseofresha.com"; // Define base URL

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
  const [showNoChangesModal, setShowNoChangesModal] = useState(false); // Added for no changes modal
  const [originalData, setOriginalData] = useState(null); // Added to track original data

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    volume: "",
    text: "",
    inStock: true,
  });

  // Function to construct proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop";
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    
    // Construct full URL from base URL and path
    // Remove leading slash if present to avoid double slash
    const cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
    return `${BASE_URL}/${cleanPath}`;
  };

  // SweetAlert function for perfume update success
  const showPerfumeUpdated = async () => {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Perfume updated successfully!",
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
      console.log("Fetching perfume with ID:", id);

      const response = await axios.get(
        `${BASE_URL}/perfume/${id}`
      );
      console.log("API Response:", response.data);

      const perfume = response.data;

      // Handle different possible response structures
      const perfumeData = perfume.data || perfume;

      if (!perfumeData) {
        throw new Error("No data received from API");
      }

      // Fix: Ensure volume is properly handled as number
      const volume = perfumeData.volume || "";
      const parsedVolume = volume ? Number(volume) : "";

      const formDataObj = {
        name: perfumeData.name || "",
        price: perfumeData.price || "",
        volume: parsedVolume,
        text: perfumeData.text || perfumeData.description || "",
        inStock: perfumeData.inStock !== undefined ? perfumeData.inStock : true,
      };

      setFormData(formDataObj);
      setOriginalData(formDataObj); // Store original data

      // Handle image path - check different possible properties
      const imagePath =
        perfumeData.image || perfumeData.images || perfumeData.imageUrl || "";
      if (imagePath) {
        const fullImagePath = getImageUrl(imagePath); // Use the helper function
        setPreviewImage(fullImagePath);
        setExistingImage(imagePath);
      } else {
        setPreviewImage(getImageUrl("")); // Use default image if none exists
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching perfume:", error);
      console.error("Error details:", error.response?.data);
      setError(
        `Failed to load perfume data: ${
          error.response?.data?.message || error.message
        }`
      );
      setLoading(false);
    }
  };

  // Function to check if there are any changes
  const hasChanges = () => {
    if (!originalData) return false;

    // Check form data changes
    const fieldsToCheck = ['name', 'price', 'volume', 'text', 'inStock'];
    for (let field of fieldsToCheck) {
      if (String(formData[field]) !== String(originalData[field])) {
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
          ? getImageUrl(existingImage) // Use helper function
          : getImageUrl("") // Use default image
      );
      setRemovedImage(false);
    } else if (existingImage) {
      if (previewImage && previewImage.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch (e) {}
      }
      setSelectedFile(null);
      setPreviewImage(getImageUrl("")); // Set to default image
      setRemovedImage(true);
      setExistingImage(null);
    } else {
      if (previewImage && previewImage.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch (e) {}
      }
      setSelectedFile(null);
      setPreviewImage(getImageUrl("")); // Set to default image
      setRemovedImage(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for volume to prevent floating point issues
    if (name === "volume" && value !== "") {
      // Remove any non-numeric characters except decimal point
      let cleanedValue = value.replace(/[^\d.]/g, "");

      // Ensure only one decimal point
      const parts = cleanedValue.split(".");
      if (parts.length > 2) {
        cleanedValue = parts[0] + "." + parts.slice(1).join("");
      }

      // Parse as float and fix to 2 decimal places for display
      const numValue = parseFloat(cleanedValue);

      setFormData((prev) => ({
        ...prev,
        [name]: !isNaN(numValue) ? numValue : "",
      }));
    } else if (name === "price" && value !== "") {
      // Similar handling for price
      let cleanedValue = value.replace(/[^\d.]/g, "");
      const parts = cleanedValue.split(".");
      if (parts.length > 2) {
        cleanedValue = parts[0] + "." + parts.slice(1).join("");
      }
      const numValue = parseFloat(cleanedValue);

      setFormData((prev) => ({
        ...prev,
        [name]: !isNaN(numValue) ? numValue : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    setError(null);
  };

  // Fix: Handle volume change separately to prevent glitches
  const handleVolumeChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setFormData((prev) => ({ ...prev, volume: "" }));
      return;
    }

    // Only allow numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (!regex.test(value)) {
      return;
    }

    // Parse the value and fix to maximum 2 decimal places
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Round to 2 decimal places to avoid floating point issues
      const roundedValue = Math.round(numValue * 100) / 100;
      setFormData((prev) => ({ ...prev, volume: roundedValue }));
    } else {
      setFormData((prev) => ({ ...prev, volume: "" }));
    }
  };

  const handleTextChange = (value) => {
    setFormData((prev) => ({ ...prev, text: value }));
    setError(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  // Check if there are any changes
  if (!hasChanges()) {
    setShowNoChangesModal(true);
    return;
  }

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

    // Fix: Send volume as a fixed number to prevent floating point issues
    const volumeValue = parseFloat(formData.volume);
    updateData.append("volume", volumeValue.toFixed(2)); // Fix to 2 decimal places

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
    console.log("Volume being sent:", volumeValue.toFixed(2));

    // Update data using PATCH method
    const response = await axios.patch(
      `${BASE_URL}/perfume/${id}`,
      updateData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Update successful:", response.data);

    // REDIRECT IMMEDIATELY FIRST
    navigate("/glow-rituals");

    // Then show success popup (will appear on the new page)
    await showPerfumeUpdated();

  } catch (error) {
    console.error("Error updating perfume:", error);
    console.error("Error response:", error.response?.data);

    // Show detailed error message
    const errorMessage =
      error.response?.data?.message ||
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
    {
      label: "Price updated",
      completed: !!formData.price && Number(formData.price) > 0,
    },
    {
      label: "Volume updated",
      completed: !!formData.volume && Number(formData.volume) > 0,
    },
    { label: "Stock status", completed: true },
  ];

  const completedStepsCount = completionSteps.filter(
    (step) => step.completed
  ).length;

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
                You haven't made any changes to the perfume information. 
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
                    navigate("/glow-rituals");
                  }}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Back to Perfumes
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
                  Back to Perfumes
                </span>
              </button>

              {/* Divider - Hidden on mobile, visible on tablet+ */}
              <div className="h-6 w-px bg-gray-300 hidden sm:block flex-shrink-0"></div>

              {/* Title and Description */}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Edit Perfume
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                  Update your existing perfume
                </p>
              </div>
            </div>

            {/* Right Section: Action Buttons */}
            <div className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
              {/* Preview Button */}
              <button
                onClick={handlePreview}
                disabled={!formData.name}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
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
                  !formData.price ||
                  !formData.volume
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
                    <span className="hidden sm:inline">Update Perfume</span>
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
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              {/* Volume - FIXED SECTION */}
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
                    step="1" // ₹1 increment
                    min="0"
                    value={formData.volume}
                    onChange={handleVolumeChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="0"
                    required
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ml
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Enter volume (e.g., 100, 50.5, 30.75)</span>
                    <span>Current: {formData.volume || 0}ml</span>
                  </div>
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
                    Update perfume image{" "}
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
                      alt="Perfume preview"
                      className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover object-center rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = getImageUrl(""); // Use default image
                      }}
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
                        ? "Replace perfume image"
                        : "Upload perfume image"}
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
                    Update perfume description and details
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
                  placeholder="Update detailed description about the perfume including fragrance notes, usage, etc..."
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
                  <div>
                    <p className="text-sm text-gray-600">
                      Specify accurate volume for customer clarity
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Use decimal values like 50.5ml or 100.0ml
                    </p>
                  </div>
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
                Your updates will be saved immediately. The perfume will be
                updated in your Glow Rituals collection.
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
                  src={
                    previewImage ||
                    getImageUrl("") // Use default image
                  }
                  alt={formData.name}
                  className="w-full h-64 sm:h-96 object-cover object-top"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = getImageUrl(""); // Use default image
                  }}
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