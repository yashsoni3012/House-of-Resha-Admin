import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  Type,
  Save,
  Trash2,
  Eye,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const AddBlogs = () => {
  const API_URL = "https://api.houseofresha.com/blogs";
  const navigate = useNavigate();

  // Quill modules configuration
  const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link"],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
};


  // Quill formats configuration
  const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",        // ✔ handles ordered + bullet
  "indent",
  "script",
  "align",
  "blockquote",
  "code-block",
  "link",
  "color",
  "background",
];


  // Helper function to decode HTML entities
  const decodeHTML = (html) => {
    if (!html) return "";

    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  };

  // Helper function to encode HTML for storage
  const encodeHTML = (html) => {
    if (!html) return "";

    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Helper function to prepare content for Quill editor
  const prepareContentForEditor = (content) => {
    if (!content) return "";

    try {
      // If content is already decoded/plain HTML, return as is
      if (content.includes("<") && !content.includes("&lt;")) {
        return content;
      }

      // Decode HTML entities
      return decodeHTML(content);
    } catch (error) {
      console.error("Error preparing content for editor:", error);
      return content;
    }
  };

  // Helper function to prepare content for API
  const prepareContentForAPI = (content) => {
    if (!content) return "";

    try {
      // Clean the HTML and encode it
      let cleanedContent = content;

      // Remove empty paragraphs
      cleanedContent = cleanedContent.replace(/<p><br><\/p>/g, "");
      cleanedContent = cleanedContent.replace(/<p>\s*<\/p>/g, "");

      // Trim whitespace
      cleanedContent = cleanedContent.trim();

      // If empty after cleaning, return empty string
      if (!cleanedContent || cleanedContent === "<p></p>") {
        return "";
      }

      // Encode HTML for safe storage
      return encodeHTML(cleanedContent);
    } catch (error) {
      console.error("Error preparing content for API:", error);
      return encodeHTML(content);
    }
  };

  // Initial blog state
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    coverImage: null,
    content: [{ text: "", img: null }],
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imagePreviews, setImagePreviews] = useState({});
  const token = localStorage.getItem("token");

  // Show message function
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle cover image upload
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlog((prev) => ({
        ...prev,
        coverImage: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          cover: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle rich text content changes
  const handleContentTextChange = (index, value) => {
    const updatedContent = [...blog.content];
    updatedContent[index] = {
      ...updatedContent[index],
      text: value,
    };
    setBlog((prev) => ({
      ...prev,
      content: updatedContent,
    }));
  };

  // Handle content image upload
  const handleContentImageChange = (index, file) => {
    if (file) {
      const updatedContent = [...blog.content];
      updatedContent[index] = {
        ...updatedContent[index],
        img: file,
      };
      setBlog((prev) => ({
        ...prev,
        content: updatedContent,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [`content-${index}`]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new content paragraph
  const addContentBlock = () => {
    setBlog((prev) => ({
      ...prev,
      content: [...prev.content, { text: "", img: null }],
    }));
  };

  // Remove content paragraph
  const removeContentBlock = (index) => {
    if (blog.content.length > 1) {
      const updatedContent = blog.content.filter((_, i) => i !== index);
      setBlog((prev) => ({
        ...prev,
        content: updatedContent,
      }));

      const newPreviews = { ...imagePreviews };
      delete newPreviews[`content-${index}`];
      setImagePreviews(newPreviews);
    }
  };

  // Count characters in HTML text (excluding tags)
  const countTextCharacters = (html) => {
    if (!html) return 0;

    try {
      const decoded = decodeHTML(html);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = decoded;
      return tempDiv.textContent.length;
    } catch (error) {
      return html.replace(/<[^>]*>/g, "").length;
    }
  };

  // Prepare form data
const prepareFormData = () => {
  const formData = new FormData();

  formData.append("title", blog.title);
  formData.append("description", blog.description);

  if (blog.coverImage) {
    formData.append("cover", blog.coverImage);
  }

  const contentArray = blog.content.map((item, index) => {
    const obj = {
      text: item.text, // ✅ RAW HTML FROM QUILL
    };

    if (item.img) {
      obj.img = `contentImages(${index + 1})`;
    }

    return obj;
  });

  formData.append("content", JSON.stringify(contentArray));

  blog.content.forEach((item, index) => {
    if (item.img) {
      formData.append(`contentImages(${index + 1})`, item.img);
    }
  });

  return formData;
};


  // Submit blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate content sections
    let hasEmptyContent = false;
    blog.content.forEach((section, index) => {
      const textLength = countTextCharacters(section.text);
      if (textLength === 0) {
        hasEmptyContent = true;
        showMessage(`Section ${index + 1} text content is required`, "error");
      }
    });

    if (hasEmptyContent) {
      setLoading(false);
      return;
    }

    if (!editingId && !blog.coverImage) {
      showMessage("Cover image is required", "error");
      setLoading(false);
      return;
    }

    try {
      const formData = prepareFormData();

      // Log what we're sending for debugging
      console.log(
        "Sending content:",
        blog.content.map((item) => item.text)
      );

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        showMessage("Blog updated successfully!", "success");
        setTimeout(() => {
          navigate("/blogs");
        }, 2000);
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        showMessage("Blog created successfully!", "success");

        setTimeout(() => {
          navigate("/blogs");
        }, 1500);
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error(error.response?.data || error);
      showMessage(
        error.response?.data?.message || "Invalid data sent to server",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      showMessage("Blog deleted successfully!", "success");
      fetchBlogs();
    } catch (error) {
      console.error("Error:", error);
      showMessage("Delete failed, please try again", "error");
    }
  };

  // Get all blogs
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(API_URL);
      setBlogs(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Edit blog - Fixed to properly handle stored HTML
 const handleEdit = (blogItem) => {
  setBlog({
    title: blogItem.title,
    description: blogItem.description,
    coverImage: null,
    content: blogItem.content.map(item => ({
      text: item.text, // ✅ RAW HTML BACK TO QUILL
      img: null,
    })),
  });

  setEditingId(blogItem._id);
  window.scrollTo(0, 0);
};
  // Reset form
  const resetForm = () => {
    setBlog({
      title: "",
      description: "",
      coverImage: null,
      content: [{ text: "", img: null }],
    });
    setEditingId(null);
    setImagePreviews({});
  };

  // Clear image for specific content block
  const clearContentImage = (index) => {
    const updatedContent = [...blog.content];
    updatedContent[index] = {
      ...updatedContent[index],
      img: null,
    };
    setBlog((prev) => ({
      ...prev,
      content: updatedContent,
    }));

    const newPreviews = { ...imagePreviews };
    delete newPreviews[`content-${index}`];
    setImagePreviews(newPreviews);
  };

  // Clear cover image
  const clearCoverImage = () => {
    setBlog((prev) => ({
      ...prev,
      coverImage: null,
    }));
    const newPreviews = { ...imagePreviews };
    delete newPreviews.cover;
    setImagePreviews(newPreviews);
  };

  // Navigate to blogs page
  const navigateToBlogs = () => {
    navigate("/blogs");
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {editingId ? "✏️ Edit Blog Post" : "📝 Create New Blog"}
              </h1>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                Craft compelling stories with rich text and stunning visuals
              </p>
            </div>
            <button
              onClick={navigateToBlogs}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm sm:text-base">View Blogs</span>
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl shadow-lg border-l-4 animate-slideDown ${
              messageType === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : "bg-red-50 border-red-500 text-red-800"
            }`}
          >
            <div className="flex items-start gap-3">
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium">{message}</p>
                {messageType === "success" && (
                  <p className="text-sm mt-1 text-green-600 opacity-80">
                    Redirecting to blogs page...
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setMessage("");
                  setMessageType("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Type className="w-4 h-4 text-blue-600" />
                  </div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Blog Title <span className="text-red-500">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="title"
                  value={blog.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-gray-50"
                  placeholder="Enter an engaging blog title..."
                />
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                </div>
                <textarea
                  name="description"
                  value={blog.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-gray-50 resize-none"
                  placeholder="Write a compelling description..."
                />
              </div>

              {/* Cover Image Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Cover Image{" "}
                    {!editingId && <span className="text-red-500">*</span>}
                  </label>
                </div>

                <div className="space-y-4">
                  {!imagePreviews.cover ? (
                    <label className="block">
                      <div className="flex flex-col items-center justify-center w-full h-48 sm:h-56 border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                          <div className="w-14 h-14 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-blue-500" />
                          </div>
                          <p className="mb-2 text-sm font-semibold text-gray-700">
                            {!editingId
                              ? "Upload cover image (Required)"
                              : "Click to upload cover image"}
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                          {!editingId && (
                            <p className="text-xs text-red-500 mt-2 font-medium">
                              * Required for new blogs
                            </p>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                        />
                      </div>
                    </label>
                  ) : (
                    <div className="relative group">
                      <img
                        src={imagePreviews.cover}
                        alt="Cover preview"
                        className="w-full h-48 sm:h-56 object-cover rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <button
                        type="button"
                        onClick={clearCoverImage}
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {!blog.coverImage && !editingId && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span>Cover image is required for new blogs</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">
                        {blog.content.length}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Content Sections
                      </h3>
                      <p className="text-sm text-gray-500">
                        Add rich text content and optional images
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    Text required • Image optional
                  </span>
                </div>

                {blog.content.map((section, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800">
                          Section {index + 1}
                        </h4>
                      </div>
                      {blog.content.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContentBlock(index)}
                          className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Rich Text Editor */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Text Content <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-200 bg-white custom-quill-wrapper">
                          <ReactQuill
                            value={section.text}
                            onChange={(value) =>
                              handleContentTextChange(index, value)
                            }
                            modules={modules}
                            formats={formats}
                            placeholder="Write your content here..."
                            theme="snow"
                            className="custom-quill-editor"
                            style={{
                              height: "260px",
                              border: "none",
                              fontSize: "16px",
                            }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {countTextCharacters(section.text)} characters
                          <span className="ml-2 text-gray-400">
                            (HTML tags not included)
                          </span>
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Image{" "}
                          <span className="text-gray-500">(Optional)</span>
                        </label>
                        {!imagePreviews[`content-${index}`] ? (
                          <label className="block">
                            <div className="flex flex-col items-center justify-center w-full h-48 border-3 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 group">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="w-12 h-12 mb-3 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                  <Upload className="w-5 h-5 text-gray-500" />
                                </div>
                                <p className="text-sm font-medium text-gray-600">
                                  Upload image
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  PNG, JPG, GIF
                                </p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) =>
                                  handleContentImageChange(
                                    index,
                                    e.target.files[0]
                                  )
                                }
                              />
                            </div>
                          </label>
                        ) : (
                          <div className="relative group h-48">
                            <img
                              src={imagePreviews[`content-${index}`]}
                              alt={`Content ${index + 1} preview`}
                              className="w-full h-full object-cover rounded-xl shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                            <button
                              type="button"
                              onClick={() => clearContentImage(index)}
                              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addContentBlock}
                  className="w-full py-4 border-3 border-dashed border-gray-300 rounded-xl text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 font-medium group"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                  Add Another Section
                </button>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    } text-white`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </span>
                    ) : editingId ? (
                      <span className="flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        Update Blog
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        Create Blog
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        /* Quill Editor Custom Styles */
        .custom-quill-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background-color: #f9fafb;
          border-radius: 10px 10px 0 0;
          padding: 12px;
        }

        .custom-quill-wrapper .ql-container {
          border: none !important;
          border-radius: 0 0 10px 10px;
          min-height: 200px;
          font-family: inherit;
        }

        .custom-quill-wrapper .ql-editor {
          min-height: 200px;
          padding: 16px;
          line-height: 1.6;
          font-size: 16px;
        }

        .custom-quill-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          left: 16px;
        }

        .custom-quill-wrapper .ql-toolbar button {
          border-radius: 6px;
          padding: 4px 8px;
          margin: 2px;
        }

        .custom-quill-wrapper .ql-toolbar button:hover {
          background-color: #e5e7eb;
        }

        .custom-quill-wrapper .ql-toolbar button.ql-active {
          background-color: #3b82f6;
          color: white;
        }

        .custom-quill-wrapper .ql-picker {
          border-radius: 6px;
        }

        .custom-quill-wrapper .ql-picker-label {
          padding: 4px 8px;
        }

        .custom-quill-wrapper .ql-color-picker .ql-picker-item {
          border-radius: 4px;
          margin: 2px;
        }
      `}</style>
    </div>
  );
};

export default AddBlogs;
