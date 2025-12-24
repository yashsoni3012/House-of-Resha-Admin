import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this import

const AddBlogs = () => {
  const API_URL = "https://api.houseofresha.com/blogs";
  const navigate = useNavigate(); // Initialize navigate hook

  // Initial blog state
  const [blog, setBlog] = useState({
    title: "",
    description: "",
    coverImage: null,
    content: [{ text: "", img: null }],
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
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

    if (blog.coverImage) {
      formData.append("cover", blog.coverImage); // Changed to match API
    }

    // Prepare content array with text and image references
    const contentArray = blog.content.map((item, index) => {
      const obj = {
        text: item.text,
      };

      if (item.img) {
        obj.img = `contentImages(${index + 1})`;
      }

      return obj;
    });

    // Append content as JSON string
    formData.append("content", JSON.stringify(contentArray));

    // Append content images separately with correct field names
    blog.content.forEach((item, index) => {
      if (item.img) {
        formData.append(`contentImages(${index + 1})`, item.img);
      }
    });

    return formData;
  };

  // Submit blog (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!editingId && !blog.coverImage) {
      showMessage("Cover image is required", "error");
      setLoading(false);
      return;
    }

    try {
      const formData = prepareFormData();

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        showMessage("Blog updated successfully!", "success");
        // Redirect after 2 seconds for edit
        setTimeout(() => {
          navigate("/blogs"); // Change this to your blogs page route
        }, 2000);
      } else {
        await axios.post(API_URL, formData);
        showMessage("Blog created successfully!", "success");
        // Redirect immediately after success for create
        setTimeout(() => {
          navigate("/blogs"); // Change this to your blogs page route
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
      fetchBlogs(); // Refresh list
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

  // Edit blog
  const handleEdit = (blogItem) => {
    setBlog({
      title: blogItem.title,
      description: blogItem.description,
      coverImage: null,
      content: blogItem.content.map((item) => ({
        text: item.text,
        img: null,
      })),
    });
    setEditingId(blogItem._id);

    // Set image previews
    const previews = {};
    if (blogItem.coverImage) {
      previews.cover = blogItem.coverImage;
    }
    blogItem.content.forEach((item, index) => {
      if (item.img) {
        previews[`content-${index}`] = item.img;
      }
    });
    setImagePreviews(previews);

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
    navigate("/blogs"); // Change this to your blogs page route
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {editingId ? "Edit Blog" : "Create New Blog"}
            </h1>
            <p className="mt-2 text-gray-600">
              Add text and optional images for each content section
            </p>
          </div>
          <button
            onClick={navigateToBlogs}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            <span>View Blogs</span>
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              messageType === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>{message}</div>
              {messageType === "success" && (
                <div className="text-sm text-green-600">
                  Redirecting to blogs page...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Blog Form */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Title */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Blog Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={blog.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter blog title"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={blog.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter blog description"
              />
            </div>

            {/* Cover Image */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image {!editingId && "*"}
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-500">
                      {!editingId
                        ? "Upload cover image (Required)"
                        : "Upload cover image"}
                    </p>
                    {!editingId && (
                      <p className="text-xs text-red-500 mt-1">
                        Required for new blogs
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                  />
                </label>
                {imagePreviews.cover && (
                  <div className="relative">
                    <img
                      src={imagePreviews.cover}
                      alt="Cover preview"
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={clearCoverImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              {!blog.coverImage && !editingId && (
                <p className="mt-2 text-sm text-red-600">
                  Cover image is required for new blogs
                </p>
              )}
            </div>

            {/* Content Sections */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Content Sections *
                </h3>
                <span className="text-sm text-gray-500">
                  Text required, image optional
                </span>
              </div>

              {blog.content.map((section, index) => (
                <div
                  key={index}
                  className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-700">
                      Section {index + 1}
                    </h4>
                    {blog.content.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentBlock(index)}
                        className="text-sm text-red-600 hover:text-red-800 transition"
                      >
                        Remove Section
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Text Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Content *
                      </label>
                      <textarea
                        value={section.text}
                        onChange={(e) =>
                          handleContentTextChange(index, e.target.value)
                        }
                        required
                        rows="6"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter paragraph text..."
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image (Optional)
                      </label>
                      <div className="space-y-4">
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                              className="w-10 h-10 mb-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <p className="text-sm text-gray-500">
                              Click to upload image
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                              handleContentImageChange(index, e.target.files[0])
                            }
                          />
                        </label>

                        {imagePreviews[`content-${index}`] && (
                          <div className="relative">
                            <img
                              src={imagePreviews[`content-${index}`]}
                              alt={`Content ${index + 1} preview`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => clearContentImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addContentBlock}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 transition flex items-center justify-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                <span>Add Another Section</span>
              </button>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-md font-medium transition ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : editingId ? (
                  "Update Blog"
                ) : (
                  "Create Blog"
                )}
              </button>

              <button
                type="button"
                onClick={navigateToBlogs}
                className="py-3 px-6 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                View All Blogs
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="py-3 px-6 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlogs;
