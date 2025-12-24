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

  const API_BASE_URL = "https://api.houseofresha.com/banner";

  useEffect(() => {
    fetchBannerDetails();
  }, [id]);

  const fetchBannerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching banner with ID:", id); // Debug log

      // Option 1: Try the direct endpoint first
      try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        console.log("Direct endpoint response:", response.data); // Debug log

        if (response.data.success && response.data.data) {
          const banner = response.data.data;
          setFormData({
            title: banner.title || "",
            buttonText: banner.buttonText || "",
            buttonLink: banner.buttonLink || "",
            category: banner.category || "",
            videoFile: null,
          });

          if (banner.videoUrl) {
            const videoUrl = `https://api.houseofresha.com${banner.videoUrl}`;
            setExistingVideoUrl(videoUrl);
            setVideoPreview(videoUrl);
          }
        } else {
          throw new Error("Banner not found in direct endpoint");
        }
      } catch (directError) {
        console.log("Direct endpoint failed, trying alternative approach..."); // Debug log

        // Option 2: Fetch all banners and find the one we need
        const allBannersResponse = await axios.get(API_BASE_URL);
        console.log("All banners response:", allBannersResponse.data); // Debug log

        if (allBannersResponse.data.success && allBannersResponse.data.data) {
          const allBanners = allBannersResponse.data.data;
          const banner = allBanners.find((b) => b._id === id);

          if (banner) {
            setFormData({
              title: banner.title || "",
              buttonText: banner.buttonText || "",
              buttonLink: banner.buttonLink || "",
              category: banner.category || "",
              videoFile: null,
            });

            if (banner.videoUrl) {
              const videoUrl = `https://api.houseofresha.com${banner.videoUrl}`;
              setExistingVideoUrl(videoUrl);
              setVideoPreview(videoUrl);
            }
          } else {
            throw new Error("Banner not found in all banners");
          }
        } else {
          throw new Error("Failed to fetch banners");
        }
      }
    } catch (error) {
      console.error("Error fetching banner details:", error);
      console.error("Error details:", error.response?.data || error.message); // Debug log
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load banner details. Please try again."
      );
    } finally {
      setLoading(false);
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

      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      setError(null);
    }
  };

  const handleRemoveVideo = () => {
    setFormData((prev) => ({
      ...prev,
      videoFile: null,
    }));
    if (videoPreview && videoPreview !== existingVideoUrl) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(existingVideoUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Please enter a banner title");
      return;
    }

    if (!formData.category.trim()) {
      setError("Please enter a category");
      return;
    }

    try {
      setUpdateLoading(true);

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("buttonText", formData.buttonText);
      submitData.append("buttonLink", formData.buttonLink);
      submitData.append("category", formData.category);

      if (formData.videoFile) {
        submitData.append("video", formData.videoFile);
      }

      console.log("Updating banner at:", `${API_BASE_URL}/${id}`); // Debug log

      const response = await axios.patch(`${API_BASE_URL}/${id}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        navigate("/banners");
      } else {
        throw new Error("Failed to update banner");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      console.error(
        "Update error details:",
        error.response?.data || error.message
      ); // Debug log
      setError(
        error.response?.data?.message ||
          "Failed to update banner. Please try again."
      );
    } finally {
      setUpdateLoading(false);
    }
  };

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
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/banners")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video Upload
              </label>
              {videoPreview ? (
                <div className="relative rounded-xl overflow-hidden bg-gray-900 mb-4">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  {formData.videoFile && (
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ) : null}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-gray-700 font-medium mb-1 text-sm">
                    {videoPreview
                      ? "Click to change video"
                      : "Click to upload new video"}
                  </p>
                  <p className="text-xs text-gray-500">
                    MP4, WebM, or OGG (Max 50MB)
                  </p>
                </label>
              </div>
            </div>

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
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Category *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., home, products, sale"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                Category helps organize banners (lowercase recommended)
              </p>
            </div>

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
              />
            </div>

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
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/banners")}
                disabled={updateLoading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={updateLoading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 font-medium flex items-center justify-center gap-2"
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
        </div>
      </div>
    </div>
  );
};

export default EditBanner;
