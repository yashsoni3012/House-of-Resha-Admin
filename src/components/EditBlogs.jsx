import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Edit,
  Upload,
  X,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Save,
  Image,
  Type,
  Plus,
  Trash2,
  FileText,
} from "lucide-react";

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: null,
    content: [{ text: "", img: null }],
  });
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [contentPreviews, setContentPreviews] = useState([]);
  const [existingContentImages, setExistingContentImages] = useState([]);

  const API_BASE_URL = "https://api.houseofresha.com";

  // Fetch blog details on component mount
  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching blog with ID:", id);

      // Try to fetch the specific blog
      const response = await axios.get(`${API_BASE_URL}/blogs`);

      if (response.data.success && Array.isArray(response.data.data)) {
        const allBlogs = response.data.data;
        const blog = allBlogs.find((b) => b._id === id);

        if (blog) {
          console.log("Found blog:", blog);
          setExistingData(blog);

          // Set form data from blog
          const contentSections =
            blog.content && blog.content.length > 0
              ? blog.content.map((item) => ({
                  text: item.text || "",
                  img: null, // We'll handle existing images separately
                }))
              : [{ text: "", img: null }];

          setFormData({
            title: blog.title || "",
            description: blog.description || "",
            coverImage: null,
            content: contentSections,
          });

          // Set cover image preview if exists
          if (blog.coverImage) {
            const coverUrl = blog.coverImage.startsWith("http")
              ? blog.coverImage
              : `${API_BASE_URL}/${blog.coverImage}`;
            setCoverPreview(coverUrl);
          }

          // Store existing content images for reference
          if (blog.content) {
            const existingImages = blog.content.map((item) =>
              item.img && !item.img.includes("contentImages")
                ? `${API_BASE_URL}/${item.img}`
                : null
            );
            setExistingContentImages(existingImages);

            // Initialize content previews with existing images
            const previews = blog.content.map((item, index) => {
              if (item.img && !item.img.includes("contentImages")) {
                return `${API_BASE_URL}/${item.img}`;
              }
              return null;
            });
            setContentPreviews(previews);
          }
        } else {
          throw new Error("Blog not found");
        }
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load blog details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle content text changes
  const handleContentTextChange = (index, value) => {
    const updatedContent = [...formData.content];
    updatedContent[index].text = value;
    setFormData((prev) => ({
      ...prev,
      content: updatedContent,
    }));
  };

  // Handle cover image change
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Cover image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        coverImage: file,
      }));

      // Clean up previous preview if it was a blob URL
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }

      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
      setError(null);
    }
  };

  // Handle content image change
  const handleContentImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      if (file.size > 3 * 1024 * 1024) {
        setError("Content image size should be less than 3MB");
        return;
      }

      const updatedContent = [...formData.content];
      updatedContent[index].img = file;
      setFormData((prev) => ({
        ...prev,
        content: updatedContent,
      }));

      // Update preview
      const updatedPreviews = [...contentPreviews];
      // Clean up previous preview if it was a blob URL
      if (
        updatedPreviews[index] &&
        updatedPreviews[index].startsWith("blob:")
      ) {
        URL.revokeObjectURL(updatedPreviews[index]);
      }
      updatedPreviews[index] = URL.createObjectURL(file);
      setContentPreviews(updatedPreviews);
      setError(null);
    }
  };

  // Add new content section
  const addContentSection = () => {
    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, { text: "", img: null }],
    }));
    setContentPreviews([...contentPreviews, null]);
  };

  // Remove content section
  const removeContentSection = (index) => {
    const updatedContent = [...formData.content];
    updatedContent.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      content: updatedContent,
    }));

    const updatedPreviews = [...contentPreviews];
    // Clean up blob URL if it exists
    if (updatedPreviews[index] && updatedPreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }
    updatedPreviews.splice(index, 1);
    setContentPreviews(updatedPreviews);

    // Also update existing content images array
    const updatedExisting = [...existingContentImages];
    updatedExisting.splice(index, 1);
    setExistingContentImages(updatedExisting);
  };

  // Remove cover image
  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: null,
    }));
    // Clean up blob URL if it exists
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }
    // Reset to existing cover image if available
    if (existingData?.coverImage) {
      const coverUrl = existingData.coverImage.startsWith("http")
        ? existingData.coverImage
        : `${API_BASE_URL}/${existingData.coverImage}`;
      setCoverPreview(coverUrl);
    } else {
      setCoverPreview(null);
    }
  };

  // Remove content image
  const handleRemoveContentImage = (index) => {
    const updatedContent = [...formData.content];
    updatedContent[index].img = null;
    setFormData((prev) => ({
      ...prev,
      content: updatedContent,
    }));

    const updatedPreviews = [...contentPreviews];
    // Clean up blob URL if it exists
    if (updatedPreviews[index] && updatedPreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }
    // Reset to existing image if available
    if (existingContentImages[index]) {
      updatedPreviews[index] = existingContentImages[index];
    } else {
      updatedPreviews[index] = null;
    }
    setContentPreviews(updatedPreviews);
  };

  // Handle form submission using PATCH method
const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    setUpdateLoading(true);

    const submitData = new FormData();

    submitData.append("title", formData.title);
    submitData.append("description", formData.description);

    // cover image (KEY MUST BE `cover`)
    if (formData.coverImage) {
      submitData.append("cover", formData.coverImage);
    }

    // Build content JSON
    const contentPayload = formData.content.map((section) => ({
      text: section.text,
      img: "", // backend will attach images by index
    }));

    submitData.append("content", JSON.stringify(contentPayload));

    // Append ONLY NEW content images
    formData.content.forEach((section) => {
      if (section.img instanceof File) {
        submitData.append("contentImages[]", section.img);
      }
    });

    const response = await axios.patch(
      `${API_BASE_URL}/blogs/${id}`,
      submitData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      navigate("/blogs");
    } else {
      throw new Error(response.data.message || "Update failed");
    }
  } catch (error) {
    console.error("Update error:", error.response?.data || error);
    setError(error.response?.data?.message || "Failed to update blog");
  } finally {
    setUpdateLoading(false);
  }
};


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading blog details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/blogs")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={updateLoading}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Edit Blog Post
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                Update your blog post: {existingData?.title || "Untitled Blog"}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
              >
                <Type className="w-4 h-4" />
                Blog Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                disabled={updateLoading}
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter blog description"
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                disabled={updateLoading}
                required
              />
            </div>

            {/* Cover Image Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Image
              </label>
              <div className="space-y-4">
                {coverPreview ? (
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/800x400?text=Cover+Image+Not+Found";
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveCoverImage}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                      disabled={updateLoading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formData.coverImage ? "New Image" : "Existing Image"}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No cover image available
                  </p>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                    id="cover-upload"
                    disabled={updateLoading}
                  />
                  <label
                    htmlFor="cover-upload"
                    className={`cursor-pointer flex flex-col items-center ${
                      updateLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <Image className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1 text-sm">
                      {coverPreview
                        ? "Click to change cover image"
                        : "Click to upload cover image"}
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, or WebP (Max 5MB)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to keep existing image
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Content Sections *
                </label>
                <button
                  type="button"
                  onClick={addContentSection}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  disabled={updateLoading}
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>

              {formData.content.map((section, index) => (
                <div
                  key={index}
                  className="mb-6 p-4 border-2 border-gray-200 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Section {index + 1}
                    </h3>
                    {formData.content.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentSection(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        disabled={updateLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Text Input */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Text Content *
                      </label>
                      <textarea
                        value={section.text}
                        onChange={(e) =>
                          handleContentTextChange(index, e.target.value)
                        }
                        placeholder="Enter text content for this section"
                        rows="3"
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm"
                        disabled={updateLoading}
                        required
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Section Image (Optional)
                      </label>
                      <div className="space-y-2">
                        {contentPreviews[index] ? (
                          <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
                            <img
                              src={contentPreviews[index]}
                              alt={`Section ${index + 1} preview`}
                              className="w-full h-40 object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/400x200?text=Image+Not+Found";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveContentImage(index)}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md transition-colors"
                              disabled={updateLoading}
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                              {formData.content[index]?.img instanceof File
                                ? "New"
                                : "Existing"}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">
                            No image for this section
                          </p>
                        )}

                        <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleContentImageChange(index, e)}
                            className="hidden"
                            id={`content-image-${index}`}
                            disabled={updateLoading}
                          />
                          <label
                            htmlFor={`content-image-${index}`}
                            className={`cursor-pointer flex flex-col items-center ${
                              updateLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                              <Image className="w-4 h-4 text-blue-500" />
                            </div>
                            <p className="text-xs text-gray-700">
                              {contentPreviews[index]
                                ? "Change image"
                                : "Add image"}
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/blogs")}
                disabled={updateLoading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating Blog...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Blog Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
