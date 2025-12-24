import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const AddBanners = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    buttonText: "",
    buttonLink: "",
    category: "",
    videoFile: null,
  });
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const API_URL = "https://api.houseofresha.com/banner/";

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get(API_URL);

        if (response.data.success && response.data.data) {
          // Extract unique categories from banner data
          const allCategories = response.data.data.map((item) => item.category);
          const uniqueCategories = [...new Set(allCategories)];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please refresh the page.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Please enter a banner title");
      return;
    }

    if (!formData.category.trim()) {
      setError("Please select a category");
      return;
    }

    if (!formData.videoFile) {
      setError("Please select a video file");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("buttonText", formData.buttonText);
      submitData.append("buttonLink", formData.buttonLink);
      submitData.append("category", formData.category);
      submitData.append("video", formData.videoFile);

      console.log("Submitting data:", {
        title: formData.title,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
        category: formData.category,
        videoFile: formData.videoFile.name,
      });

      const response = await axios.post(API_URL, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      if (response.data.success) {
        navigate("/banners");
      } else {
        throw new Error("Failed to add banner");
      }
    } catch (error) {
      console.error("Error adding banner:", error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to add banner. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
                  Add New Banner
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Create a new video banner for your site
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

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Video Upload *
                </label>
                {!videoPreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                      id="video-upload"
                      required
                    />
                    <label
                      htmlFor="video-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-indigo-600" />
                      </div>
                      <p className="text-gray-700 font-medium mb-1">
                        Click to upload video
                      </p>
                      <p className="text-sm text-gray-500">
                        MP4, WebM, or OGG (Max 50MB)
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden bg-gray-900">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-64 sm:h-80 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
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
                  required
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
                {loadingCategories ? (
                  <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl flex items-center">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mr-2" />
                    <span className="text-gray-500">Loading categories...</span>
                  </div>
                ) : (
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Category helps organize banners
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
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding Banner...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Add Banner
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

export default AddBanners;
