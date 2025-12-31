// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import {
//   Video,
//   Upload,
//   X,
//   AlertCircle,
//   ArrowLeft,
//   Loader2,
//   Save,
//   ExternalLink,
//   MousePointerClick,
//   Tag,
// } from "lucide-react";

// const EditBanner = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [formData, setFormData] = useState({
//     title: "",
//     buttonText: "",
//     buttonLink: "",
//     category: "",
//     videoFile: null,
//   });
//   const [existingVideoUrl, setExistingVideoUrl] = useState("");
//   const [videoPreview, setVideoPreview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updateLoading, setUpdateLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);

//   const API_URL = "https://api.houseofresha.com/banner/";

//   // Fetch banner details and categories on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch banner details
//         console.log("Fetching banner with ID:", id);

//         // Try to get the specific banner
//         let bannerData = null;

//         // First, try to get all banners and find the one with matching ID
//         try {
//           const allBannersResponse = await axios.get(API_URL);
//           console.log("All banners response:", allBannersResponse.data);

//           if (allBannersResponse.data.success && allBannersResponse.data.data) {
//             const allBanners = allBannersResponse.data.data;
//             const banner = allBanners.find((b) => b._id === id);

//             if (banner) {
//               bannerData = banner;
//             } else {
//               // Try direct endpoint if not found in all banners
//               try {
//                 const directResponse = await axios.get(`${API_URL}${id}`);
//                 console.log("Direct endpoint response:", directResponse.data);

//                 if (directResponse.data.success && directResponse.data.data) {
//                   bannerData = directResponse.data.data;
//                 }
//               } catch (directError) {
//                 console.log("Direct endpoint failed");
//               }
//             }
//           }
//         } catch (fetchError) {
//           console.error("Error fetching banners:", fetchError);
//         }

//         if (!bannerData) {
//           throw new Error("Banner not found. It may have been deleted.");
//         }

//         // Set form data from banner
//         setFormData({
//           title: bannerData.title || "",
//           buttonText: bannerData.buttonText || "",
//           buttonLink: bannerData.buttonLink || "",
//           category: bannerData.category || "",
//           videoFile: null,
//         });

//         // Set video preview if exists
//         if (bannerData.videoUrl) {
//           const videoUrl = bannerData.videoUrl.startsWith('http')
//             ? bannerData.videoUrl
//             : `https://api.houseofresha.com${bannerData.videoUrl}`;

//           setExistingVideoUrl(videoUrl);
//           setVideoPreview(videoUrl);
//         }

//         // Fetch categories from API
//         await fetchCategories();

//       } catch (error) {
//         console.error("Error fetching banner details:", error);
//         console.error("Error details:", error.response?.data || error.message);
//         setError(
//           error.response?.data?.message ||
//           error.message ||
//           "Failed to load banner details. Please try again."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   // Function to fetch categories
//   const fetchCategories = async () => {
//     try {
//       setLoadingCategories(true);
//       const response = await axios.get(API_URL);

//       if (response.data.success && response.data.data) {
//         // Extract unique categories from banner data
//         const allCategories = response.data.data
//           .map((item) => item.category)
//           .filter(category => category && category.trim() !== ""); // Filter out empty/null categories

//         const uniqueCategories = [...new Set(allCategories)];
//         setCategories(uniqueCategories);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       // Don't set error for categories fetch as it's not critical
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleVideoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith("video/")) {
//         setError("Please select a valid video file");
//         return;
//       }

//       if (file.size > 50 * 1024 * 1024) {
//         setError("Video file size should be less than 50MB");
//         return;
//       }

//       setFormData((prev) => ({
//         ...prev,
//         videoFile: file,
//       }));

//       // Create preview URL for new video
//       const previewUrl = URL.createObjectURL(file);

//       // Clean up previous preview if it was a blob URL
//       if (videoPreview && videoPreview !== existingVideoUrl && videoPreview.startsWith('blob:')) {
//         URL.revokeObjectURL(videoPreview);
//       }

//       setVideoPreview(previewUrl);
//       setError(null);
//     }
//   };

//   const handleRemoveVideo = () => {
//     setFormData((prev) => ({
//       ...prev,
//       videoFile: null,
//     }));

//     // Clean up blob URL if it exists
//     if (videoPreview && videoPreview !== existingVideoUrl && videoPreview.startsWith('blob:')) {
//       URL.revokeObjectURL(videoPreview);
//     }

//     // Reset to existing video if available
//     setVideoPreview(existingVideoUrl);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     // Validation
//     if (!formData.title.trim()) {
//       setError("Please enter a banner title");
//       return;
//     }

//     if (!formData.category.trim()) {
//       setError("Please select a category");
//       return;
//     }

//     try {
//       setUpdateLoading(true);

//       // Create FormData for PATCH request
//       const submitData = new FormData();
//       submitData.append("title", formData.title);
//       submitData.append("buttonText", formData.buttonText);
//       submitData.append("buttonLink", formData.buttonLink);
//       submitData.append("category", formData.category);

//       // Only append video if a new one was selected
//       if (formData.videoFile) {
//         submitData.append("video", formData.videoFile);
//       }

//       console.log("Updating banner with ID:", id);
//       console.log("Form data:", {
//         title: formData.title,
//         buttonText: formData.buttonText,
//         buttonLink: formData.buttonLink,
//         category: formData.category,
//         hasNewVideo: !!formData.videoFile,
//       });

//       // Use PATCH method for updating
//       const response = await axios.patch(`${API_URL}${id}`, submitData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log("Update response:", response.data);

//       if (response.data.success) {
//         navigate("/banners");
//       } else {
//         throw new Error("Failed to update banner");
//       }
//     } catch (error) {
//       console.error("Error updating banner:", error);
//       console.error("Error details:", error.response?.data || error.message);

//       let errorMessage = "Failed to update banner. Please try again.";

//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.data?.error) {
//         errorMessage = error.response.data.error;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }

//       setError(errorMessage);
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200"></div>
//             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 absolute top-0"></div>
//           </div>
//           <p className="text-gray-600 mt-4">Loading banner details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
//       <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 mb-6 border border-white/20">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate("/banners")}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               disabled={updateLoading}
//             >
//               <ArrowLeft className="w-5 h-5 text-gray-600" />
//             </button>
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                   <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//                 </div>
//                 <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                   Edit Banner
//                 </h1>
//               </div>
//               <p className="text-sm sm:text-base text-gray-600">
//                 Update your video banner details
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 border border-white/20">
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//               <div className="flex-1">
//                 <p className="text-sm">{error}</p>
//               </div>
//               <button
//                 onClick={() => setError(null)}
//                 className="text-red-500 hover:text-red-700"
//                 disabled={updateLoading}
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//

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
    const videoChanged = Boolean(selectedFile);
    setIsDirty(fieldsChanged || videoChanged);
  }, [formData, selectedFile]);

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

    // New video file selected - mark as dirty
    setSelectedFile(file);

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

    // Mark the form as changed
    setIsDirty(true);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearVideo = () => {
    setSelectedFile(null);

    if (
      previewVideo &&
      previewVideo !== existingVideoUrl &&
      previewVideo.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewVideo);
    }

    setPreviewVideo(existingVideoUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Recompute dirty state now that selected file was cleared
    const init = initialDataRef.current;
    if (init) {
      const fieldsChanged =
        formData.title !== init.title ||
        formData.buttonText !== init.buttonText ||
        formData.buttonLink !== init.buttonLink ||
        formData.category !== init.category;
      setIsDirty(fieldsChanged || false);
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
        submitData.append("video", selectedFile);
      }

      console.log("Updating banner with ID:", id);
      console.log("Form data:", {
        title: formData.title,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
        category: formData.category,
        hasNewVideo: !!selectedFile,
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
    previewVideo,
  ].filter(Boolean).length;

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
                disabled={saveLoading}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Banners</span>
              </button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Edit Banner</h1>
                <p className="text-sm text-gray-600">
                  Update your existing banner
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (hasRequiredFields() && previewVideo) {
                    alert("Preview would show here");
                  } else {
                    setError("Complete required fields to preview");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Video}
            label="Video Status"
            value={previewVideo ? "Available" : "Missing"}
            color={previewVideo ? "bg-green-500" : "bg-red-500"}
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
            {/* Banner Title */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Type className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Banner Title</h3>
                  <p className="text-sm text-gray-600">
                    Enter your banner title
                  </p>
                </div>
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., Summer Collection Launch"
                maxLength={100}
                disabled={saveLoading}
                required
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                  Max 100 characters
                </span>
                <span className="text-xs text-gray-500">
                  {formData.title.length}/100
                </span>
              </div>
            </div>

            {/* Category & Button Text */}
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
                      Select banner category
                    </p>
                  </div>
                </div>
                {loadingCategories ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mr-2" />
                    <span className="text-gray-500">Loading categories...</span>
                  </div>
                ) : (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <MousePointerClick className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Button Text</h3>
                    <p className="text-sm text-gray-600">
                      Call-to-action button text
                    </p>
                  </div>
                </div>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g., Shop Now, Learn More"
                  disabled={saveLoading}
                />
              </div>
            </div>

            {/* Video Upload */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Banner Video</h3>
                  <p className="text-sm text-gray-600">
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

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors">
                {previewVideo ? (
                  <div className="relative">
                    <video
                      src={previewVideo}
                      controls
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={clearVideo}
                      disabled={saveLoading}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
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
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      Click to upload banner video
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      MP4, WebM, OGG up to 50MB
                    </p>
                    <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50">
                      Choose File
                    </div>
                  </div>
                )}
              </div>

              {selectedFile ? (
                <p className="text-sm text-green-600 mt-3 font-medium">
                  ✓ {selectedFile.name} selected (
                  {Math.round((selectedFile.size / 1024 / 1024) * 100) / 100}MB)
                </p>
              ) : (
                previewVideo && (
                  <p className="text-sm text-blue-600 mt-3 font-medium">
                    ⓘ Using existing video file
                  </p>
                )
              )}
            </div>

            {/* Button Link */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Button Link URL</h3>
                  <p className="text-sm text-gray-600">
                    Link for the call-to-action button
                  </p>
                </div>
              </div>

              <input
                type="url"
                name="buttonLink"
                value={formData.buttonLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                      previewVideo
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        previewVideo ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {previewVideo ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Video available</span>
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
                    Replacing video will update it on all pages
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
                All required fields must be filled. Your banner will be updated
                across your site immediately.
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
                Changes will be reflected immediately
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBanner;
