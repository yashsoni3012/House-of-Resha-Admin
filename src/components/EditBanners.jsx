import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Video,
  Upload,
  X,
  ArrowLeft,
  CheckCircle,
  Eye,
  Tag,
  BarChart3,
  Type,
  MessageSquare,
  AlertCircle,
  Save,
  MousePointerClick,
  ExternalLink,
  Loader2,
  Clock,
  Users,
  Layers,
  Shield,
  Package,
  DollarSign,
  Trash2,
} from "lucide-react";
import {
  showConfirm,
  showSuccess,
  showError,
  showBannerUpdated,
} from "../utils/sweetAlertConfig";

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

const EditBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState("");
  const [isVideoRemoved, setIsVideoRemoved] = useState(false); // New state to track if video is removed

  // Track original values to determine whether any changes have been made
  const initialDataRef = useRef(null);
  const [isDirty, setIsDirty] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    buttonText: "",
    buttonLink: "",
    category: "",
  });

  const API_URL = "https://api.houseofresha.com/banner/";

  useEffect(() => {
    fetchBannerData();
    fetchCategories();
  }, [id]);

  // Recompute dirty state when fields or selected file change
  useEffect(() => {
    const init = initialDataRef.current;
    if (!init) return;
    const fieldsChanged =
      formData.title !== init.title ||
      formData.buttonText !== init.buttonText ||
      formData.buttonLink !== init.buttonLink ||
      formData.category !== init.category;
    const videoChanged = Boolean(selectedFile) || isVideoRemoved;
    setIsDirty(fieldsChanged || videoChanged);
  }, [formData, selectedFile, isVideoRemoved]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await axios.get(API_URL);

      if (response.data.success && response.data.data) {
        const allCategories = response.data.data
          .map((item) => item.category)
          .filter((category) => category && category.trim() !== "");
        const uniqueCategories = [...new Set(allCategories)];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchBannerData = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsVideoRemoved(false); // Reset video removal state

      let bannerData = null;

      try {
        const allBannersResponse = await axios.get(API_URL);
        console.log("All banners response:", allBannersResponse.data);

        if (allBannersResponse.data.success && allBannersResponse.data.data) {
          const allBanners = allBannersResponse.data.data;
          const banner = allBanners.find((b) => b._id === id);

          if (banner) {
            bannerData = banner;
          } else {
            try {
              const directResponse = await axios.get(`${API_URL}${id}`);
              console.log("Direct endpoint response:", directResponse.data);

              if (directResponse.data.success && directResponse.data.data) {
                bannerData = directResponse.data.data;
              }
            } catch (directError) {
              console.log("Direct endpoint failed");
            }
          }
        }
      } catch (fetchError) {
        console.error("Error fetching banners:", fetchError);
      }

      if (!bannerData) {
        throw new Error("Banner not found. It may have been deleted.");
      }

      setFormData({
        title: bannerData.title || "",
        buttonText: bannerData.buttonText || "",
        buttonLink: bannerData.buttonLink || "",
        category: bannerData.category || "",
      });

      if (bannerData.videoUrl) {
        const videoUrl = bannerData.videoUrl.startsWith("http")
          ? bannerData.videoUrl
          : `https://api.houseofresha.com${bannerData.videoUrl}`;

        setExistingVideoUrl(videoUrl);
        setPreviewVideo(videoUrl);
      } else {
        setExistingVideoUrl("");
        setPreviewVideo(null);
      }

      // Snapshot initial data so we can detect changes (dirty state)
      initialDataRef.current = {
        title: bannerData.title || "",
        buttonText: bannerData.buttonText || "",
        buttonLink: bannerData.buttonLink || "",
        category: bannerData.category || "",
        videoPath: bannerData.videoUrl || null,
      };
      setIsDirty(false);
    } catch (error) {
      console.error("Error fetching banner details:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load banner details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file (MP4, WebM, OGG)");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("Video file size should be less than 50MB");
      return;
    }

    // New video file selected - mark as dirty and reset removal state
    setSelectedFile(file);
    setIsVideoRemoved(false); // Reset removal if new file is selected

    // Create preview URL for new video
    const previewUrl = URL.createObjectURL(file);

    // Clean up previous preview if it was a blob URL
    if (
      previewVideo &&
      previewVideo !== existingVideoUrl &&
      previewVideo.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewVideo);
    }

    setPreviewVideo(previewUrl);
    setError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveVideo = async () => {
    try {
      const res = await showConfirm(
        "Remove Video",
        "Are you sure you want to remove this video? This will delete the video from the server.",
        "Yes, remove"
      );

      if (!res || !res.isConfirmed) return;

      // Mark video as removed
      setIsVideoRemoved(true);
      setSelectedFile(null);

      // Clear preview
      if (
        previewVideo &&
        previewVideo !== existingVideoUrl &&
        previewVideo.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previewVideo);
      }

      setPreviewVideo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Show success message
      await showSuccess("Video Removed", "Video has been marked for removal. Click Update Banner to save changes.");
    } catch (error) {
      console.error("Error removing video:", error);
      await showError("Error", "Failed to remove video");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Banner title is required");
      return;
    }

    if (!formData.category.trim()) {
      setError("Category is required");
      return;
    }

    try {
      setSaveLoading(true);

      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("buttonText", formData.buttonText || "");
      submitData.append("buttonLink", formData.buttonLink || "");
      submitData.append("category", formData.category);

      if (selectedFile) {
        // If new video is selected
        submitData.append("video", selectedFile);
      } else if (isVideoRemoved) {
        // If video was removed
        submitData.append("removeVideo", "true");
      }

      console.log("Updating banner with ID:", id);
      console.log("Form data:", {
        title: formData.title,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
        category: formData.category,
        hasNewVideo: !!selectedFile,
        isVideoRemoved: isVideoRemoved,
      });

      const response = await axios.patch(`${API_URL}${id}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Update response:", response.data);

      if (response.data.success) {
        try {
          await showBannerUpdated();
        } catch (e) {
          /* ignore */
        }
        navigate("/banners");
      } else {
        throw new Error(response.data.message || "Failed to update banner");
      }
    } catch (error) {
      console.error("Error updating banner:", error);

      let errorMessage = "Failed to update banner. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/banners");
  };

  const handleDeleteBanner = async () => {
    try {
      const res = await showConfirm(
        "Delete Banner",
        "Are you sure you want to delete this banner? This action cannot be undone.",
        "Yes, delete"
      );

      if (!res || !res.isConfirmed) return;

      setDeleteLoading(true);
      const deleteResp = await axios.delete(`${API_URL}${id}`);

      if (deleteResp.data && deleteResp.data.success) {
        try {
          await showSuccess("Deleted", "Banner deleted successfully");
        } catch (e) {}
        navigate("/banners");
      } else {
        throw new Error(deleteResp.data?.message || "Failed to delete banner");
      }
    } catch (err) {
      console.error("Error deleting banner:", err);
      try {
        await showError(
          "Delete Failed",
          err.response?.data?.message ||
            err.message ||
            "Failed to delete banner"
        );
      } catch (e) {}
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading banner data...</p>
        </div>
      </div>
    );
  }

  const hasRequiredFields = () => {
    return formData.title && formData.category;
  };

  const completionCount = [
    formData.title,
    formData.category,
    previewVideo || isVideoRemoved, // Count as complete if video is removed (intentional)
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors shrink-0 mt-0.5 sm:mt-0"
                  disabled={saveLoading}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base">
                    Back to Banners
                  </span>
                </button>
                <div className="h-6 w-px bg-gray-300 hidden sm:block shrink-0"></div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    Edit Banner
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Update your existing banner
                  </p>
                </div>
              </div>

              {/* Actions Section - Desktop (right side) */}
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => {
                    if (hasRequiredFields() && previewVideo) {
                      alert("Preview would show here");
                    } else {
                      setError("Complete required fields to preview");
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  disabled={saveLoading || deleteLoading}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>

                <button
                  onClick={handleDeleteBanner}
                  disabled={saveLoading || deleteLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {deleteLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={
                    saveLoading ||
                    !hasRequiredFields() ||
                    deleteLoading ||
                    !isDirty
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {saveLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Banner
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Actions Section - Mobile (full width) */}
            <div className="flex sm:hidden flex-col gap-2">
              <button
                onClick={() => {
                  if (hasRequiredFields() && previewVideo) {
                    alert("Preview would show here");
                  } else {
                    setError("Complete required fields to preview");
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={saveLoading || deleteLoading}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>

              <button
                onClick={handleDeleteBanner}
                disabled={saveLoading || deleteLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>

              <button
                onClick={handleSubmit}
                disabled={
                  saveLoading ||
                  !hasRequiredFields() ||
                  deleteLoading ||
                  !isDirty
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saveLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Banner
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
            icon={Video}
            label="Video Status"
            value={previewVideo ? "Available" : isVideoRemoved ? "Removed" : "Missing"}
            color={previewVideo ? "bg-green-500" : isVideoRemoved ? "bg-yellow-500" : "bg-red-500"}
          />
          <StatsCard
            icon={Tag}
            label="Category"
            value={formData.category ? "Selected" : "Pending"}
            color={formData.category ? "bg-blue-500" : "bg-gray-500"}
          />
          <StatsCard
            icon={MousePointerClick}
            label="Button"
            value={formData.buttonText ? "Set" : "Optional"}
            color={formData.buttonText ? "bg-purple-500" : "bg-gray-400"}
          />
          <StatsCard
            icon={BarChart3}
            label="Status"
            value={isDirty ? "Modified" : "Editing"}
            color={isDirty ? "bg-orange-500" : "bg-yellow-500"}
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
            {/* Banner Title */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-start sm:items-center gap-3 mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <Type className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                    Banner Title
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    Enter your banner title
                  </p>
                </div>
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
                placeholder="e.g., Summer Collection Launch"
                maxLength={100}
                disabled={saveLoading}
                required
              />
              <div className="flex justify-between mt-2 gap-2">
                <span className="text-xs text-gray-500">
                  Max 100 characters
                </span>
                <span className="text-xs text-gray-500 shrink-0">
                  {formData.title.length}/100
                </span>
              </div>
            </div>

            {/* Category & Button Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
             <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
  <div className="flex items-start sm:items-center gap-3 mb-4">
    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
      <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="font-bold text-gray-900 text-base sm:text-lg">Category</h3>
      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
        Select banner category
      </p>
    </div>
  </div>
  {loadingCategories ? (
    <div className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg flex items-center justify-center">
      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-indigo-600 mr-2" />
      <span className="text-gray-500 text-sm sm:text-base">Loading categories...</span>
    </div>
  ) : (
    <select
      name="category"
      value={formData.category}
      onChange={handleInputChange}
      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base bg-white"
      disabled={saveLoading}
      required
    >
      <option value="">Select category</option>
      {categories.map((category, index) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </select>
  )}
</div>

              {/* Button Text */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
  <div className="flex items-start sm:items-center gap-3 mb-4">
    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
      <MousePointerClick className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="font-bold text-gray-900 text-base sm:text-lg">Button Text</h3>
      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
        Call-to-action button text
      </p>
    </div>
  </div>
  <input
    type="text"
    name="buttonText"
    value={formData.buttonText}
    onChange={handleInputChange}
    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
    placeholder="e.g., Shop Now, Learn More"
    disabled={saveLoading}
  />
</div>
            </div>

            {/* Video Upload */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
  <div className="flex items-start sm:items-center gap-3 mb-4">
    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-50 rounded-lg flex items-center justify-center shrink-0">
      <Video className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="font-bold text-gray-900 text-base sm:text-lg">Banner Video</h3>
      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
        Update or replace banner video
      </p>
    </div>
  </div>

  {/* Hidden file input */}
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileSelect}
    accept="video/*"
    className="hidden"
    disabled={saveLoading}
  />

  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-indigo-400 transition-colors">
    {previewVideo ? (
      <div className="relative">
        <video
          src={previewVideo}
          controls
          className="w-full h-48 sm:h-64 object-cover rounded-lg"
        />
        <button
          type="button"
          onClick={handleRemoveVideo}
          disabled={saveLoading}
          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 shadow-lg"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {selectedFile ? "New Video" : "Existing Video"}
        </div>
      </div>
    ) : (
      <div
        onClick={saveLoading ? undefined : triggerFileInput}
        className={`flex flex-col items-center ${
          saveLoading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
        </div>
        <p className="text-gray-700 font-medium mb-1 text-sm sm:text-base text-center">
          {isVideoRemoved ? "Video marked for removal" : "Click to upload banner video"}
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mb-4 text-center px-2">
          {isVideoRemoved ? "Click to upload new video" : "MP4, WebM, OGG up to 50MB"}
        </p>
        <div className="px-4 py-2 sm:py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 text-sm sm:text-base">
          {isVideoRemoved ? "Upload New Video" : "Choose File"}
        </div>
      </div>
    )}
  </div>

  {selectedFile ? (
    <p className="text-xs sm:text-sm text-green-600 mt-3 font-medium break-words">
      ✓ {selectedFile.name} selected (
      {Math.round((selectedFile.size / 1024 / 1024) * 100) / 100}MB)
    </p>
  ) : (
    isVideoRemoved ? (
      <p className="text-xs sm:text-sm text-red-600 mt-3 font-medium">
        ⚠ Video will be removed when you click "Update Banner"
      </p>
    ) : previewVideo ? (
      <p className="text-xs sm:text-sm text-blue-600 mt-3 font-medium">
        ⓘ Using existing video file
      </p>
    ) : null
  )}
</div>

            {/* Button Link */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
  <div className="flex items-start sm:items-center gap-3 mb-4">
    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="font-bold text-gray-900 text-base sm:text-lg">Button Link URL</h3>
      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
        Link for the call-to-action button
      </p>
    </div>
  </div>

  <input
    type="url"
    name="buttonLink"
    value={formData.buttonLink}
    onChange={handleInputChange}
    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base"
    placeholder="https://example.com"
    disabled={saveLoading}
  />

  <div className="mt-2 text-xs text-gray-500">
    Enter a valid URL starting with http:// or https://
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
                      {completionCount}/3
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(completionCount / 3) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.title
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.title ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {formData.title ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Banner title</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.category
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.category ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {formData.category ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Category selected</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      previewVideo || isVideoRemoved
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        previewVideo || isVideoRemoved ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {previewVideo || isVideoRemoved ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">
                      {isVideoRemoved ? "Video removed" : "Video available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Update Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Video className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {isVideoRemoved 
                      ? "Video removal will take effect after update" 
                      : "Replacing video will update it on all pages"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Type className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Keep titles consistent for better user experience
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Tag className="w-3 h-3 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Categories help organize multiple banners
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MousePointerClick className="w-3 h-3 text-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Clear CTAs improve conversion rates
                  </p>
                </div>
              </div>
            </div>

            {/* Update Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Ready to update?</h3>
              <p className="text-sm text-gray-600 mb-6">
                {isVideoRemoved 
                  ? "Video will be removed and other changes will be applied." 
                  : "All changes will be updated across your site immediately."}
              </p>
              <button
                onClick={handleSubmit}
                disabled={saveLoading || !hasRequiredFields() || !isDirty}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saveLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Banner
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                {isDirty ? "Changes pending" : "No changes made"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBanner;