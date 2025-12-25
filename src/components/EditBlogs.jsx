import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  Trash2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Type,
  FileText,
  ImageIcon,
  Upload,
  Plus,
  X,
} from "lucide-react";

const EditBlogs = () => {
  const API_URL = "https://api.houseofresha.com/blogs";
  const navigate = useNavigate();
  const { id } = useParams();

  // Blog state
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    coverImage: null,
    content: [{ text: "", img: null }],
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreviews, setImagePreviews] = useState({});
  const [originalBlog, setOriginalBlog] = useState(null);

  // Show message function
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  // Fetch blog data for editing
  const fetchBlogData = async () => {
    try {
      setFetching(true);
      const response = await axios.get(`${API_URL}/${id}`);
      const blogData = response.data.data || response.data;

      // Store original blog data
      setOriginalBlog(blogData);

      // Set blog data
      setBlog({
        title: blogData.title || "",
        description: blogData.description || "",
        coverImage: null, // We'll handle image separately
        content: blogData.content?.map((item) => ({
          text: item.text || "",
          img: item.img || null, // KEEP URL
        })) || [{ text: "", img: null }],
      });

      // Set image previews exactly like AddBlogs component
      const previews = {};

      // Set cover image preview
      if (blogData.coverImage) {
        previews.cover = blogData.coverImage;
      }

      // Set content image previews
      if (blogData.content && Array.isArray(blogData.content)) {
        blogData.content.forEach((item, index) => {
          if (item.img) {
            previews[`content-${index}`] = item.img;
          }
        });
      }

      setImagePreviews(previews);
    } catch (error) {
      console.error("Error fetching blog:", error);
      showMessage("Failed to load blog data", "error");
      navigate("/blogs");
    } finally {
      setFetching(false);
    }
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

      // Create preview
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

  // Handle content paragraph text changes
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

      // Create preview
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

      // Remove preview
      const newPreviews = { ...imagePreviews };
      delete newPreviews[`content-${index}`];
      setImagePreviews(newPreviews);
    }
  };

  // Prepare form data (including file uploads)
const prepareFormData = () => {
  const formData = new FormData();

  formData.append("title", blog.title);
  formData.append("description", blog.description);

  // ✅ COVER IMAGE
  if (blog.coverImage instanceof File) {
    formData.append("cover", blog.coverImage);
  }

  // ✅ CONTENT
  const contentArray = blog.content.map((item, index) => {
    const obj = {
      text: item.text,
    };

    if (item.img instanceof File) {
      obj.img = `contentImages(${index + 1})`;
    } else if (typeof item.img === "string") {
      // ✅ KEEP EXISTING IMAGE URL
      obj.img = item.img;
    } else {
      obj.img = "";
    }

    return obj;
  });

  formData.append("content", JSON.stringify(contentArray));

  // ✅ APPEND ONLY NEW FILES
  blog.content.forEach((item, index) => {
    if (item.img instanceof File) {
      formData.append(`contentImages(${index + 1})`, item.img);
    }
  });

  return formData;
};


  // Update blog using PUT (or PATCH if your API supports it)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = prepareFormData();

      // Use PUT for full update (or PATCH for partial)
      await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showMessage("Blog updated successfully!", "success");

      // Redirect after success
      setTimeout(() => {
        navigate("/blogs");
      }, 1500);
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      showMessage(
        error.response?.data?.message || "Failed to update blog",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear cover image
  const clearCoverImage = () => {
    setBlog((prev) => ({
      ...prev,
      coverImage: null,
    }));
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews.cover;
      return newPreviews;
    });
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

  // Navigate back to blogs
  const navigateToBlogs = () => {
    navigate("/blogs");
  };

  // Fetch blog data on component mount
  useEffect(() => {
    if (id) {
      fetchBlogData();
    }
  }, [id]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ✏️ Edit Blog Post
              </h1>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                Make changes to your blog post
              </p>
            </div>
            <button
              onClick={navigateToBlogs}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm sm:text-base">Back to Blogs</span>
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
                  placeholder="Enter blog title..."
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
                  placeholder="Write description..."
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
                    <span className="text-gray-500">(Optional)</span>
                  </label>
                </div>

                <div className="space-y-4">
                  {imagePreviews.cover ? (
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
                  ) : (
                    <label className="block">
                      <div className="flex flex-col items-center justify-center w-full h-48 sm:h-56 border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                          <div className="w-14 h-14 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-blue-500" />
                          </div>
                          <p className="mb-2 text-sm font-semibold text-gray-700">
                            Update cover image (Optional)
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                        />
                      </div>
                    </label>
                  )}
                  {!imagePreviews.cover && originalBlog?.coverImage && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Existing cover image will be removed if you don't upload
                        a new one after clearing
                      </span>
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
                        Edit text and images
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
                      {/* Text Content */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Text Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={section.text}
                          onChange={(e) =>
                            handleContentTextChange(index, e.target.value)
                          }
                          required
                          rows="8"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white resize-none"
                          placeholder="Edit content..."
                        />
                        <div className="text-xs text-gray-500">
                          {section.text.length} characters
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Image{" "}
                          <span className="text-gray-500">(Optional)</span>
                        </label>
                        {imagePreviews[`content-${index}`] ? (
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
                        ) : (
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
                  Add New Section
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
                        Updating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        Update Blog
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
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
      `}</style>
    </div>
  );
};

export default EditBlogs;
