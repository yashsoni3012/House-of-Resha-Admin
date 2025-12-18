import React, { useEffect, useState, useMemo } from "react";
import {
  Upload,
  Save,
  X,
  Video,
  Link as LinkIcon,
  Type,
  Tag,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../lib/api"; // adjust path

const API_BASE_URL = "https://api.houseofresha.com";

// ============ fetch categories ============
const fetchCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/banner/?category`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch categories: ${res.status} ${res.statusText}`
    );
  }
  const data = await res.json();

  if (Array.isArray(data)) {
    return data.map((item) =>
      typeof item === "string"
        ? item
        : item.value || item.name || item.category || JSON.stringify(item)
    );
  }
  if (data && typeof data === "object") {
    const arr =
      data.categories || data.data || data.values || Object.values(data);
    if (Array.isArray(arr)) {
      return arr.map((item) =>
        typeof item === "string"
          ? item
          : item.value || item.name || item.category || JSON.stringify(item)
      );
    }
  }
  return ["men", "women", "unisex", "glow-ritual", "home"];
};

// ============ create / update API ============
const createBanner = async (bannerData) => {
  const formData = new FormData();
  formData.append("title", bannerData.title.trim());
  formData.append("buttonText", bannerData.buttonText.trim());
  formData.append("buttonLink", bannerData.buttonLink.trim());
  formData.append("category", bannerData.category);
  if (bannerData.videoFile) formData.append("video", bannerData.videoFile);

  const res = await fetch(`${API_BASE_URL}/banner`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.message || data.error || `HTTP ${res.status}: Failed to create`
    );
  }
  return data;
};

const updateBanner = async (bannerData) => {
  if (!bannerData._id) throw new Error("Missing banner _id");

  const formData = new FormData();
  formData.append("title", bannerData.title.trim());
  formData.append("buttonText", bannerData.buttonText.trim());
  formData.append("buttonLink", bannerData.buttonLink.trim());
  formData.append("category", bannerData.category);
  if (bannerData.videoFile) formData.append("video", bannerData.videoFile);

  const res = await fetch(`${API_BASE_URL}/banner/${bannerData._id}`, {
    method: "PATCH",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.message || data.error || `HTTP ${res.status}: Failed to update`
    );
  }
  return data;
};

// ============ toast helper ============
const showToast = (message, type = "success") => {
  const toastContainer =
    document.getElementById("toast-container") ||
    (() => {
      const container = document.createElement("div");
      container.id = "toast-container";
      container.className = "fixed top-4 right-4 z-50 flex flex-col gap-3";
      document.body.appendChild(container);
      return container;
    })();

  const toastId = `toast-${Date.now()}`;
  const toast = document.createElement("div");
  toast.id = toastId;
  toast.className = `px-6 py-4 rounded-xl shadow-2xl font-bold text-white animate-slide-in ${
    type === "success"
      ? "bg-gradient-to-r from-green-500 to-emerald-600"
      : "bg-gradient-to-r from-red-500 to-pink-600"
  }`;

  toast.innerHTML = `
    <div class="flex items-center gap-3">
      ${
        type === "success"
          ? '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
          : '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'
      }
      <span>${message}</span>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
};

// ============ BannerModel (Form only) ============
const BannerFormModel = ({ open, onClose, initialBanner }) => {
  const [videoPreview, setVideoPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    buttonText: "Shop Now",
    buttonLink: "",
    videoFile: null,
  });

  // categories query
  const {
    data: apiCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });

  const categories = useMemo(() => {
    if (!apiCategories || apiCategories.length === 0) {
      return [
        { value: "men", label: "Men" },
        { value: "women", label: "Women" },
        { value: "unisex", label: "Unisex" },
      ];
    }
    const map = new Map();
    apiCategories.forEach((cat, i) => {
      let value, label;
      if (typeof cat === "string") {
        value = cat.toLowerCase().replace(/\s+/g, "-");
        label = cat
          .charAt(0)
          .toUpperCase()
          .concat(cat.slice(1).replace(/-/g, " "));
      } else if (cat && typeof cat === "object" && cat.value) {
        value = cat.value;
        label =
          cat.label ||
          cat.name ||
          cat.value.charAt(0).toUpperCase() + cat.value.slice(1);
      } else if (cat && typeof cat === "object" && cat.name) {
        value = cat.name.toLowerCase().replace(/\s+/g, "-");
        label = cat.name.charAt(0).toUpperCase() + cat.name.slice(1);
      } else if (cat && typeof cat === "object") {
        value = cat._id || `category-${i}`;
        label = cat.label || cat.name || cat.title || `Category ${i + 1}`;
      } else {
        value = String(cat);
        label = String(cat).charAt(0).toUpperCase() + String(cat).slice(1);
      }
      if (value && !map.has(value)) map.set(value, { value, label });
    });
    return Array.from(map.values());
  }, [apiCategories]);

  // create / update mutations
  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      showToast("Banner created successfully!", "success");
      onClose();
    },
    onError: (error) => {
      showToast(`Failed to create banner: ${error.message}`, "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      showToast("Banner updated successfully!", "success");
      onClose();
    },
    onError: (error) => {
      showToast(`Failed to update banner: ${error.message}`, "error");
    },
  });

  // load initialBanner into form
  useEffect(() => {
    if (initialBanner) {
      setFormData({
        title: initialBanner.title || "",
        category:
          initialBanner.category ||
          (categories.length > 0 ? categories[0].value : ""),
        buttonText: initialBanner.buttonText || "Shop Now",
        buttonLink: initialBanner.buttonLink || "",
        videoFile: null,
      });
      const videoUrl = initialBanner.videoUrl || initialBanner.video;
      if (videoUrl) {
        const full = videoUrl.startsWith("http")
          ? videoUrl
          : `${API_BASE_URL}${videoUrl}`;
        setVideoPreview(full);
      } else {
        setVideoPreview("");
      }
    } else {
      setFormData((p) => ({
        title: "",
        category: categories.length > 0 ? categories[0].value : "",
        buttonText: "Shop Now",
        buttonLink: "",
        videoFile: null,
      }));
      setVideoPreview("");
    }
  }, [initialBanner, categories, open]);

  // default category if empty
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData((p) => ({ ...p, category: categories[0].value }));
    }
  }, [categories, formData.category]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo",
    ];
    if (!validTypes.includes(file.type)) {
      setErrors((p) => ({
        ...p,
        video: "Please select a valid video file (MP4, WebM, OGG, MOV, AVI)",
      }));
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrors((p) => ({
        ...p,
        video: "Video size should be less than 50MB",
      }));
      return;
    }

    const preview = URL.createObjectURL(file);
    setVideoPreview(preview);
    setFormData((p) => ({ ...p, videoFile: file }));
    if (errors.video) setErrors((prev) => ({ ...prev, video: "" }));
    showToast("Video uploaded successfully!", "success");
  };

  const validateForm = () => {
    const e = {};
    if (!formData.title.trim()) e.title = "Title is required";
    if (formData.title.length > 100)
      e.title = "Title should be less than 100 characters";
    if (!formData.buttonText.trim()) e.buttonText = "Button text is required";
    if (formData.buttonText.length > 30)
      e.buttonText = "Button text should be less than 30 characters";
    if (!formData.buttonLink.trim()) e.buttonLink = "Button link is required";
    if (!formData.buttonLink.startsWith("http")) {
      e.buttonLink =
        "Please enter a valid URL starting with http:// or https://";
    }
    if (!formData.category.trim()) e.category = "Category is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please fix the form errors", "error");
      return;
    }

    const bannerData = {
      ...formData,
      _id: initialBanner?._id,
    };

    if (initialBanner) {
      updateMutation.mutate(bannerData);
    } else {
      createMutation.mutate(bannerData);
    }
  };

  useEffect(
    () => () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    },
    [videoPreview]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl my-4 sm:my-8 shadow-2xl transform transition-all animate-in">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-t-3xl p-4 sm:p-6 md:p-8">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-t-3xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 sm:p-3 rounded-xl backdrop-blur-md">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {initialBanner ? "Edit Banner" : "Create New Banner"}
                </h2>
                <p className="text-purple-100 text-xs sm:text-sm mt-1">
                  {initialBanner
                    ? "Update your banner details"
                    : "Add a stunning banner to your collection"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 hover:bg-white/20 rounded-xl transition-all duration-300 group"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 max-h-[calc(100vh-120px)] sm:max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Video Preview */}
          {videoPreview && (
            <div className="mb-6 sm:mb-8 animate-in">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded-lg">
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Video Preview
                </h3>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-4 ring-purple-100">
                <video
                  src={videoPreview}
                  className="w-full rounded-2xl"
                  controls
                  muted
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Title */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                    <Type className="w-4 h-4 text-purple-600" />
                    Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 ${
                        errors.title
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-purple-500 bg-gray-50"
                      }`}
                      placeholder="Enter banner title..."
                      maxLength={100}
                    />
                    <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      {formData.title.length}/100
                    </div>
                  </div>
                  {errors.title && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                    <Tag className="w-4 h-4 text-purple-600" />
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 appearance-none ${
                        errors.category
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-purple-500 bg-gray-50"
                      }`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Button Text */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                    <Type className="w-4 h-4 text-purple-600" />
                    Button Text <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 ${
                        errors.buttonText
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-purple-500 bg-gray-50"
                      }`}
                      placeholder="Shop Now"
                      maxLength={30}
                    />
                    <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      {formData.buttonText.length}/30
                    </div>
                  </div>
                  {errors.buttonText && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.buttonText}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Button Link */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                    <LinkIcon className="w-4 h-4 text-purple-600" />
                    Button Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 ${
                      errors.buttonLink
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-purple-500 bg-gray-50"
                    }`}
                    placeholder="https://example.com"
                  />
                  {errors.buttonLink && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.buttonLink}
                    </p>
                  )}
                </div>

                {/* Upload Video */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                    <Video className="w-4 h-4 text-purple-600" />
                    Upload Video
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-gray-50 to-purple-50/30">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="videoUpload"
                    />
                    <label htmlFor="videoUpload" className="cursor-pointer">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 sm:p-4 rounded-xl sm:rounded-2xl inline-block mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 font-bold mb-1">
                        Click to upload video
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        MP4, WebM, OGG, MOV, AVI
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Maximum file size: 50MB
                      </p>
                    </label>
                  </div>
                  {errors.video && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.video}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    createMutation.isLoading || updateMutation.isLoading
                  }
                  className="w-full py-3 sm:py-4 md:py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] bg-size-200 bg-pos-0 hover:bg-pos-100"
                  style={{
                    backgroundSize: "200% 100%",
                  }}
                >
                  {createMutation.isLoading || updateMutation.isLoading ? (
                    <>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>
                        {initialBanner ? "Updating..." : "Creating..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>
                        {initialBanner ? "Update Banner" : "Create Banner"}
                      </span>
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

export default BannerFormModel;
