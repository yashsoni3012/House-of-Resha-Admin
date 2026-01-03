import React, { useState, lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Plus,
  X,
  Image as ImageIcon,
  FileText,
  Send,
  ArrowLeft,
  Type,
  MessageSquare,
  Image as ImageLucide,
  CheckCircle,
  Eye,
  Clock,
  Tag,
  Globe,
  Users,
  BarChart3,
} from "lucide-react";
import { showBlogCreated } from "../utils/sweetAlertConfig"; // Import the sweetalert function

const ReactQuill = lazy(() => import("react-quill-new"));

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  className = "",
  height = 300,
}) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "link",
    "image",
  ];

  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading editor...</p>
            </div>
          </div>
        }
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || "Write your content here..."}
          style={{
            height: `${height}px`,
            border: "none",
          }}
          className="rounded-lg"
        />
      </Suspense>
    </div>
  );
};

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

export default function AddBlogs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: null,
    content: [{ text: "", img: null }],
  });
  const [coverPreview, setCoverPreview] = useState(null);
  const [contentPreviews, setContentPreviews] = useState([null]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size must be less than 10MB" });
        return;
      }
      setFormData({ ...formData, coverImage: file });
      const preview = URL.createObjectURL(file);
      setCoverPreview(preview);
    }
  };

  const handleContentChange = (index, field, value) => {
    const newContent = [...formData.content];
    newContent[index][field] = value;
    setFormData({ ...formData, content: newContent });
  };

  const handleContentImageChange = (index, file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 10MB" });
      return;
    }

    const newContent = [...formData.content];
    newContent[index].img = file;
    setFormData({ ...formData, content: newContent });

    const newPreviews = [...contentPreviews];
    if (file) {
      newPreviews[index] = URL.createObjectURL(file);
    } else {
      newPreviews[index] = null;
    }
    setContentPreviews(newPreviews);
  };

  const addContentBlock = () => {
    setFormData({
      ...formData,
      content: [...formData.content, { text: "", img: null }],
    });
    setContentPreviews([...contentPreviews, null]);
  };

  const removeContentBlock = (index) => {
    if (formData.content.length === 1) {
      setMessage({
        type: "error",
        text: "At least one content section is required",
      });
      return;
    }
    const newContent = formData.content.filter((_, i) => i !== index);
    const newPreviews = contentPreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, content: newContent });
    setContentPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      setMessage({ type: "error", text: "Please enter a title" });
      return;
    }
    if (!formData.description.trim()) {
      setMessage({ type: "error", text: "Please enter a description" });
      return;
    }
    if (!formData.coverImage) {
      setMessage({ type: "error", text: "Please upload a cover image" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("cover", formData.coverImage);

      const contentArray = formData.content
        .map((block) => ({
          text: block.text || "",
        }))
        .filter((block) => block.text.trim() !== "");

      if (contentArray.length === 0) {
        setMessage({ type: "error", text: "Please add some content" });
        setLoading(false);
        return;
      }

      formDataToSend.append("content", JSON.stringify(contentArray));

      formData.content.forEach((block, index) => {
        if (block.img) {
          formDataToSend.append(`contentImages[${index}]`, block.img);
        }
      });

      const response = await fetch("https://api.houseofresha.com/blogs", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        // Show SweetAlert notification
        await showBlogCreated();

        // Add a small delay for the notification to be seen
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Reset form
        setFormData({
          title: "",
          description: "",
          coverImage: null,
          content: [{ text: "", img: null }],
        });
        setCoverPreview(null);
        setContentPreviews([null]);

        // Navigate to blogs list
        navigate("/blogs");
      } else {
        throw new Error(result.message || "Failed to publish blog");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToBlogs = () => {
    navigate("/blogs");
  };

  const wordCount = formData.description
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={navigateToBlogs}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Create New Blog
                </h1>
                <p className="text-sm text-gray-600">
                  Share your story with the world
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  // Preview functionality
                  const hasRequiredFields =
                    formData.title &&
                    formData.description &&
                    formData.coverImage;
                  if (hasRequiredFields) {
                    alert("Preview would show here");
                  } else {
                    setMessage({
                      type: "error",
                      text: "Complete required fields to preview",
                    });
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
                  loading ||
                  !formData.title ||
                  !formData.description ||
                  !formData.coverImage
                }
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Publish
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
            icon={FileText}
            label="Sections"
            value={formData.content.length}
            color="bg-blue-500"
          />
          <StatsCard
            icon={Clock}
            label="Word Count"
            value={wordCount}
            color="bg-green-500"
          />
          <StatsCard
            icon={ImageLucide}
            label="Images"
            value={`${contentPreviews.filter((p) => p).length}/${
              formData.content.length
            }`}
            color="bg-purple-500"
          />
          <StatsCard
            icon={BarChart3}
            label="Status"
            value={formData.coverImage ? "Ready" : "Draft"}
            color={formData.coverImage ? "bg-green-500" : "bg-yellow-500"}
          />
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Type className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Title</h3>
                  <p className="text-sm text-gray-600">
                    Catchy title that grabs attention
                  </p>
                </div>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter blog title..."
                maxLength={100}
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

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Description</h3>
                  <p className="text-sm text-gray-600">
                    Brief summary of your blog
                  </p>
                </div>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                placeholder="Write a compelling description..."
                maxLength={200}
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                  Max 200 characters
                </span>
                <span className="text-xs text-gray-500">
                  {formData.description.length}/200
                </span>
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
              <div className="flex items-start sm:items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ImageLucide className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                    Cover Image
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    First impression matters • Required
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 md:p-8 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-200">
                {coverPreview ? (
                  <div className="relative group">
                    <div className="relative w-full pt-[56.25%] sm:pt-[75%] md:pt-[100%] overflow-hidden rounded-xl bg-gray-100 shadow-lg">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, coverImage: null });
                        setCoverPreview(null);
                      }}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white p-2 sm:p-2.5 rounded-full hover:bg-red-600 active:scale-95 transition-all shadow-lg hover:shadow-xl z-10"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer group">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:from-indigo-50 group-hover:to-indigo-100 transition-all duration-200 shadow-md">
                      <Upload className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    </div>

                    <p className="text-gray-800 font-semibold text-sm sm:text-base md:text-lg mb-1 text-center">
                      Upload cover image
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-5 text-center">
                      JPG, PNG or WebP • Max 10MB
                    </p>

                    <div className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 active:scale-95 transition-all duration-200 font-medium text-sm sm:text-base">
                      Choose File
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Content Sections
                </h3>
                <button
                  onClick={addContentBlock}
                  className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 active:scale-95 transition-all duration-200 font-medium text-sm sm:text-base  w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Add Section
                </button>
              </div>

              {formData.content.map((block, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-base">
                          {index + 1}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                        Section {index + 1}
                      </h4>
                    </div>
                    {formData.content.length > 1 && (
                      <button
                        onClick={() => removeContentBlock(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg active:scale-95 transition-all duration-200"
                        aria-label="Remove section"
                      >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    )}
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <RichTextEditor
                      value={block.text || ""}
                      onChange={(value) => {
                        if (value === "<p><br></p>") {
                          handleContentChange(index, "text", "");
                        } else {
                          handleContentChange(index, "text", value);
                        }
                      }}
                      placeholder="Write your content here... Share your story, insights, or ideas."
                      height={250}
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-200">
                    {contentPreviews[index] ? (
                      <div className="relative group">
                        <div className="relative w-full overflow-hidden rounded-lg shadow-md">
                          <img
                            src={contentPreviews[index]}
                            alt={`Content ${index + 1}`}
                            className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                        </div>
                        <button
                          onClick={() => handleContentImageChange(index, null)}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white p-2 sm:p-2.5 rounded-full hover:bg-red-600 active:scale-95 transition-all shadow-lg hover:shadow-xl z-10"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer group py-2">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-2 sm:mb-3 group-hover:from-indigo-50 group-hover:to-indigo-100 transition-all duration-200 shadow-md">
                          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 font-medium mb-1">
                          Add image (Optional)
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          JPG, PNG or WebP • Max 10MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleContentImageChange(index, e.target.files[0])
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Completion
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {
                        [
                          formData.title,
                          formData.description,
                          formData.coverImage,
                          formData.content.some((b) => b.text.trim()),
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
                            formData.title,
                            formData.description,
                            formData.coverImage,
                            formData.content.some((b) => b.text.trim()),
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
                    <span className="text-sm">Title added</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.description
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.description ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {formData.description ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Description added</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.coverImage
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.coverImage ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {formData.coverImage ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Cover image uploaded</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.content.some((b) => b.text.trim())
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.content.some((b) => b.text.trim())
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {formData.content.some((b) => b.text.trim()) ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Content added</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Publish Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Ready to publish?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Make sure all required fields are filled. Once published, your
                blog will be live immediately.
              </p>
              <button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.title ||
                  !formData.description ||
                  !formData.coverImage
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5" />
                    Publish Blog
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Your blog will be visible to everyone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
