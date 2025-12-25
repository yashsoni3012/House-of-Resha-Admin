import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Video,
  Upload,
  X,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Save,
  ExternalLink,
  MousePointerClick,
  Tag,
} from "lucide-react";

const EditBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    buttonText: "",
    buttonLink: "",
    category: "",
    videoFile: null,
  });
  const [existingVideoUrl, setExistingVideoUrl] = useState("");
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const API_URL = "https://api.houseofresha.com/banner/";

  // Fetch banner details and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch banner details
        console.log("Fetching banner with ID:", id);
        
        // Try to get the specific banner
        let bannerData = null;
        
        // First, try to get all banners and find the one with matching ID
        try {
          const allBannersResponse = await axios.get(API_URL);
          console.log("All banners response:", allBannersResponse.data);

          if (allBannersResponse.data.success && allBannersResponse.data.data) {
            const allBanners = allBannersResponse.data.data;
            const banner = allBanners.find((b) => b._id === id);

            if (banner) {
              bannerData = banner;
            } else {
              // Try direct endpoint if not found in all banners
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

        // Set form data from banner
        setFormData({
          title: bannerData.title || "",
          buttonText: bannerData.buttonText || "",
          buttonLink: bannerData.buttonLink || "",
          category: bannerData.category || "",
          videoFile: null,
        });

        // Set video preview if exists
        if (bannerData.videoUrl) {
          const videoUrl = bannerData.videoUrl.startsWith('http') 
            ? bannerData.videoUrl 
            : `https://api.houseofresha.com${bannerData.videoUrl}`;
          
          setExistingVideoUrl(videoUrl);
          setVideoPreview(videoUrl);
        }

        // Fetch categories from API
        await fetchCategories();

      } catch (error) {
        console.error("Error fetching banner details:", error);
        console.error("Error details:", error.response?.data || error.message);
        setError(
          error.response?.data?.message ||
          error.message ||
          "Failed to load banner details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await axios.get(API_URL);

      if (response.data.success && response.data.data) {
        // Extract unique categories from banner data
        const allCategories = response.data.data
          .map((item) => item.category)
          .filter(category => category && category.trim() !== ""); // Filter out empty/null categories
        
        const uniqueCategories = [...new Set(allCategories)];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Don't set error for categories fetch as it's not critical
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError("Video file size should be less than 50MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        videoFile: file,
      }));

      // Create preview URL for new video
      const previewUrl = URL.createObjectURL(file);
      
      // Clean up previous preview if it was a blob URL
      if (videoPreview && videoPreview !== existingVideoUrl && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
      
      setVideoPreview(previewUrl);
      setError(null);
    }
  };

  const handleRemoveVideo = () => {
    setFormData((prev) => ({
      ...prev,
      videoFile: null,
    }));
    
    // Clean up blob URL if it exists
    if (videoPreview && videoPreview !== existingVideoUrl && videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }
    
    // Reset to existing video if available
    setVideoPreview(existingVideoUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Please enter a banner title");
      return;
    }

    if (!formData.category.trim()) {
      setError("Please select a category");
      return;
    }

    try {
      setUpdateLoading(true);

      // Create FormData for PATCH request
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("buttonText", formData.buttonText);
      submitData.append("buttonLink", formData.buttonLink);
      submitData.append("category", formData.category);

      // Only append video if a new one was selected
      if (formData.videoFile) {
        submitData.append("video", formData.videoFile);
      }

      console.log("Updating banner with ID:", id);
      console.log("Form data:", {
        title: formData.title,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
        category: formData.category,
        hasNewVideo: !!formData.videoFile,
      });

      // Use PATCH method for updating
      const response = await axios.patch(`${API_URL}${id}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Update response:", response.data);

      if (response.data.success) {
        navigate("/banners");
      } else {
        throw new Error("Failed to update banner");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      console.error("Error details:", error.response?.data || error.message);
      
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
      setUpdateLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 absolute top-0"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading banner details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/banners")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={updateLoading}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Edit Banner
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Update your video banner details
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 border border-white/20">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
                disabled={updateLoading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Video Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Video Upload {!videoPreview && "(Optional)"}
                </label>
                {videoPreview ? (
                  <div className="relative rounded-xl overflow-hidden bg-gray-900 mb-4">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-64 sm:h-80 object-cover"
                    />
                    {(formData.videoFile || existingVideoUrl) && (
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                        disabled={updateLoading}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formData.videoFile ? "New Video" : "Existing Video"}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-3">
                    No video uploaded yet. You can add one below.
                  </p>
                )}
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="video-upload"
                    disabled={updateLoading}
                  />
                  <label
                    htmlFor="video-upload"
                    className={`cursor-pointer flex flex-col items-center ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1 text-sm">
                      {videoPreview ? "Click to change video" : "Click to upload video"}
                    </p>
                    <p className="text-xs text-gray-500">
                      MP4, WebM, or OGG (Max 50MB)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to keep existing video
                    </p>
                  </label>
                </div>
              </div>

              {/* Title Field */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Banner Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter banner title"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  disabled={updateLoading}
                  required
                />
              </div>

              {/* Category Field */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  Category *
                </label>
                {loadingCategories ? (
                  <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl flex items-center">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mr-2" />
                    <span className="text-gray-500">Loading categories...</span>
                  </div>
                ) : (
                  <>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                      disabled={updateLoading}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Category helps organize banners
                    </p>
                  </>
                )}
              </div>

              {/* Button Text Field */}
              <div>
                <label
                  htmlFor="buttonText"
                  className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <MousePointerClick className="w-4 h-4" />
                  Button Text
                </label>
                <input
                  type="text"
                  id="buttonText"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  placeholder="e.g., Shop Now, Learn More"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  disabled={updateLoading}
                />
              </div>

              {/* Button Link Field */}
              <div>
                <label
                  htmlFor="buttonLink"
                  className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Button Link URL
                </label>
                <input
                  type="url"
                  id="buttonLink"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  disabled={updateLoading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/banners")}
                  disabled={updateLoading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating Banner...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Banner
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBanner;