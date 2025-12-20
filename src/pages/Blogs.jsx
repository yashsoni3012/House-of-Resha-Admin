import React, { useState, useEffect } from "react";
import {
  Save,
  Upload,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Grid,
  List,
  FileImage,
} from "lucide-react";

const API_BASE_URL = "https://api.houseofresha.com";

export default function BlogPostManager() {
  const [view, setView] = useState("list");
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: [""],
    cover: null,
    slider: [],
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterAndSortBlogs();
  }, [blogs, searchQuery, sortBy]);

  const fetchBlogs = async () => {
    setFetchLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/blogs`);
      const data = await res.json();
      const blogsData = data.success
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      setBlogs(blogsData);
    } catch (err) {
      setError("Failed to fetch blogs: " + err.message);
      setBlogs([]);
    } finally {
      setFetchLoading(false);
    }
  };

  const filterAndSortBlogs = () => {
    let filtered = [...blogs];

    if (searchQuery) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredBlogs(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (index, value) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const addContentParagraph = () => {
    setFormData((prev) => ({ ...prev, content: [...prev.content, ""] }));
  };

  const removeContentParagraph = (index) => {
    if (formData.content.length > 1) {
      const newContent = formData.content.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, content: newContent }));
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
    }
  };

  const handleSliderImageChange = (e, index = null) => {
    const file = e.target.files[0];
    if (file) {
      if (index !== null) {
        const newSliderImages = [...formData.sliderImages];
        newSliderImages[index] = { file, replaceIndex: index };
        setFormData((prev) => ({ ...prev, sliderImages: newSliderImages }));
      } else {
        setFormData((prev) => ({
          ...prev,
          sliderImages: [...prev.sliderImages, { file, replaceIndex: null }],
        }));
      }
    }
  };

  const addSliderImageSlot = () => {
    setFormData((prev) => ({
      ...prev,
      sliderImages: [...prev.sliderImages, null],
    }));
  };

  const removeSliderImage = (index) => {
    const newSliderImages = formData.sliderImages.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, sliderImages: newSliderImages }));
  };

  // const handleSubmit = async () => {
  //   if (!formData.title.trim()) {
  //     setError("Title is required");
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);
  //   setResponse(null);

  //   try {
  //     const formDataToSend = new FormData();

  //     formDataToSend.append("title", formData.title);
  //     formDataToSend.append("description", formData.description);

  //     const validContent = formData.content.filter((c) => c.trim());
  //     formDataToSend.append("content", JSON.stringify(validContent));

  //     if (formData.coverImage) {
  //       formDataToSend.append("coverImage", formData.coverImage);
  //     }

  //     formData.sliderImages.forEach((item) => {
  //       if (item && item.file) {
  //         formDataToSend.append("sliderImages", item.file);
  //       }
  //     });

  //     const url =
  //       view === "create"
  //         ? `${API_BASE_URL}/blogs`
  //         : `${API_BASE_URL}/blogs/${selectedBlog._id}`;

  //     const options = {
  //       method: view === "create" ? "POST" : "PATCH",
  //       body: formDataToSend,
  //     };

  //     const res = await fetch(url, options);
  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(
  //         data.message || `Request failed with status ${res.status}`
  //       );
  //     }

  //     setResponse(data);
  //     await fetchBlogs();

  //     setTimeout(() => {
  //       setView("list");
  //       resetForm();
  //     }, 1500);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);

      const validContent = formData.content.filter((c) => c.trim());
      formDataToSend.append("content", JSON.stringify(validContent));

      if (formData.coverImage) {
        formDataToSend.append("cover", formData.coverImage);
      }

      formData.sliderImages.forEach((item) => {
        if (item?.file) {
          formDataToSend.append("slider", item.file);
        }
      });

      // 🔥 PRINT FORM DATA BEFORE POSTING
      console.log("----- FORM DATA -----");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(key, {
            name: value.name,
            size: value.size,
            type: value.type,
          });
        } else {
          console.log(key, value);
        }
      }
      console.log("----------------------");

      const url =
        view === "create"
          ? `${API_BASE_URL}/blogs`
          : `${API_BASE_URL}/blogs/${selectedBlog._id}`;

      const res = await fetch(url, {
        method: view === "create" ? "POST" : "PATCH",
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Request failed (${res.status})`);
      }

      setResponse(data);
      await fetchBlogs();

      setTimeout(() => {
        setView("list");
        resetForm();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/blogs/${blogToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      await fetchBlogs();
      setShowDeleteModal(false);
      setBlogToDelete(null);
      if (view === "view") {
        setView("list");
      }
      setResponse({ message: "Blog deleted successfully" });
      setTimeout(() => setResponse(null), 3000);
    } catch (err) {
      setError("Failed to delete: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      content: blog.content || [""],
      coverImage: null,
      sliderImages: [],
    });
    setView("edit");
  };

  const handleView = (blog) => {
    setSelectedBlog(blog);
    setCurrentImageIndex(0);
    setView("view");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: [""],
      coverImage: null,
      sliderImages: [],
    });
    setSelectedBlog(null);
    setResponse(null);
    setError(null);
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_BASE_URL}/${path}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const nextImage = () => {
    if (selectedBlog && selectedBlog.sliderImages) {
      setCurrentImageIndex((prev) =>
        prev === selectedBlog.sliderImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedBlog && selectedBlog.sliderImages) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedBlog.sliderImages.length - 1 : prev - 1
      );
    }
  };

  if (view === "list") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
                  Blog Management
                </h1>
                <p className="text-slate-300 text-sm md:text-base">
                  Total posts:{" "}
                  <span className="font-bold text-cyan-400">
                    {blogs.length}
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setView("create");
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105"
              >
                <Plus size={20} />
                Create New Post
              </button>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4 border border-slate-700">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search blogs..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">By Title</option>
                  </select>
                  <div className="flex bg-slate-700/50 rounded-xl border border-slate-600 p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-cyan-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Grid size={20} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-cyan-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <List size={20} />
                    </button>
                  </div>
                  <button
                    onClick={fetchBlogs}
                    disabled={fetchLoading}
                    className="px-4 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-xl hover:bg-slate-600 transition-all"
                  >
                    <RefreshCw
                      size={20}
                      className={fetchLoading ? "animate-spin" : ""}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl backdrop-blur-sm animate-pulse">
              <p className="text-red-200 font-semibold">{error}</p>
            </div>
          )}

          {response && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-xl backdrop-blur-sm">
              <p className="text-green-200 font-semibold">
                ✓ {response.message || "Operation successful"}
              </p>
            </div>
          )}

          {fetchLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="inline-block w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-300 font-medium">
                  Loading blogs...
                </p>
              </div>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700">
              <div className="inline-block p-4 bg-slate-700/50 rounded-full mb-4">
                <FileImage size={48} className="text-slate-400" />
              </div>
              <p className="text-slate-300 text-lg">
                {searchQuery
                  ? "No blogs found matching your search"
                  : "No blogs found. Create your first blog post!"}
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                  : "space-y-4"
              }
            >
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className={`bg-slate-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 ${
                    viewMode === "list" ? "flex flex-col md:flex-row" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-gradient-to-br from-purple-900 to-slate-900 ${
                      viewMode === "list" ? "md:w-64 h-48 md:h-auto" : "h-48"
                    }`}
                  >
                    {blog.coverImage ? (
                      <img
                        src={getImageUrl(blog.coverImage)}
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">📝</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                      Blog Post
                    </div>
                  </div>

                  <div className="p-5 flex-1">
                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 hover:text-cyan-400 transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                      {blog.description}
                    </p>

                    {viewMode === "list" && blog.content && blog.content[0] && (
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                        {blog.content[0]}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
                      <span className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30 font-medium">
                        <FileImage size={14} className="inline mr-1" />
                        {blog.sliderImages?.length || 0} images
                      </span>
                      <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 font-medium">
                        {blog.content?.length || 0} paragraphs
                      </span>
                      <span className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600 font-medium">
                        <Calendar size={14} className="inline mr-1" />
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(blog)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-500 hover:text-white transition-all border border-cyan-500/30"
                      >
                        <Eye size={16} />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleEdit(blog)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition-all border border-purple-500/30"
                      >
                        <Edit size={16} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => confirmDelete(blog)}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all border border-red-500/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showDeleteModal && blogToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                Confirm Deletion
              </h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete "
                <span className="font-bold text-cyan-400">
                  {blogToDelete.title}
                </span>
                "? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setBlogToDelete(null);
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === "view" && selectedBlog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-2 mb-6 px-4 py-2 bg-slate-800/50 backdrop-blur-lg border border-slate-700 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
          >
            <ArrowLeft size={18} />
            Back to List
          </button>

          <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-purple-900 to-slate-900">
              {selectedBlog.coverImage && (
                <img
                  src={getImageUrl(selectedBlog.coverImage)}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {selectedBlog.title}
                </h1>
                <p className="text-cyan-400 font-medium">
                  <Calendar size={16} className="inline mr-2" />
                  {formatDate(selectedBlog.createdAt)}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="prose prose-invert max-w-none">
                <p className="text-xl text-slate-300 mb-8 italic border-l-4 border-cyan-500 pl-4">
                  {selectedBlog.description}
                </p>

                <div className="space-y-4 mb-8">
                  {selectedBlog.content?.map((paragraph, index) => (
                    <p key={index} className="text-slate-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {selectedBlog.sliderImages &&
                selectedBlog.sliderImages.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Gallery ({selectedBlog.sliderImages.length} images)
                    </h3>
                    <div className="relative rounded-2xl overflow-hidden bg-slate-900">
                      <img
                        src={getImageUrl(
                          selectedBlog.sliderImages[currentImageIndex]
                        )}
                        alt={`Slide ${currentImageIndex + 1}`}
                        className="w-full h-96 object-cover"
                      />

                      {selectedBlog.sliderImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm p-3 rounded-full hover:bg-black/70 transition-all text-white border border-white/20"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm p-3 rounded-full hover:bg-black/70 transition-all text-white border border-white/20"
                          >
                            <ChevronRight size={24} />
                          </button>

                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {selectedBlog.sliderImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${
                                  index === currentImageIndex
                                    ? "bg-cyan-400 w-8"
                                    : "bg-white/50 hover:bg-white/75"
                                }`}
                              />
                            ))}
                          </div>

                          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-sm font-medium border border-white/20">
                            {currentImageIndex + 1} /{" "}
                            {selectedBlog.sliderImages.length}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-700">
                <button
                  onClick={() => handleEdit(selectedBlog)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                >
                  <Edit size={18} />
                  Edit Blog
                </button>
                <button
                  onClick={() => confirmDelete(selectedBlog)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                >
                  <Trash2 size={18} />
                  Delete Blog
                </button>
              </div>
            </div>
          </div>
        </div>

        {showDeleteModal && blogToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">
                Confirm Deletion
              </h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete "
                <span className="font-bold text-cyan-400">
                  {blogToDelete.title}
                </span>
                "? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setBlogToDelete(null);
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-600 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => setView("list")}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-slate-800/50 backdrop-blur-lg border border-slate-700 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
        >
          <ArrowLeft size={18} />
          Back to List
        </button>

        <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
          <div className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              {view === "create" ? "✨ Create New Blog" : "✏️ Edit Blog"}
            </h1>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter an engaging blog title..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all"
                  placeholder="Write a compelling description..."
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-white">
                  Content Paragraphs
                </label>
                <button
                  onClick={addContentParagraph}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                >
                  <Plus size={18} />
                  Add Paragraph
                </button>
              </div>
              <div className="space-y-3">
                {formData.content.map((paragraph, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-10 h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center font-bold text-cyan-400">
                      {index}
                    </div>
                    <textarea
                      value={paragraph}
                      onChange={(e) =>
                        handleContentChange(index, e.target.value)
                      }
                      rows={3}
                      className="flex-1 px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none transition-all"
                      placeholder={`Paragraph ${index}...`}
                    />
                    {formData.content.length > 1 && (
                      <button
                        onClick={() => removeContentParagraph(index)}
                        className="flex-shrink-0 px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Cover Image {view === "edit" && "(Replace)"}
                </label>
                <label className="flex flex-col items-center justify-center h-40 px-4 py-6 bg-slate-700/30 border-2 border-dashed border-cyan-500/30 rounded-xl cursor-pointer hover:border-cyan-500 hover:bg-slate-700/50 transition-all">
                  <Upload size={40} className="text-cyan-400 mb-2" />
                  <span className="text-sm font-bold text-cyan-400">
                    {formData.coverImage ? "Change Cover" : "Upload Cover"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                </label>
                {formData.coverImage && (
                  <div className="mt-2 p-3 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                    <p className="text-sm font-medium text-cyan-400 truncate">
                      {formData.coverImage.name}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-white">
                    Slider Images
                  </label>
                  <button
                    onClick={addSliderImageSlot}
                    className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-sm font-bold hover:bg-purple-500 hover:text-white transition-all"
                  >
                    + Add Slot
                  </button>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {formData.sliderImages.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-700 rounded-xl">
                      No slider images
                    </div>
                  ) : (
                    formData.sliderImages.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center font-bold shadow-lg">
                          {index}
                        </div>
                        <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg cursor-pointer hover:bg-slate-700 transition-all">
                          <Upload size={18} className="text-purple-400" />
                          <span className="text-sm font-medium text-purple-400 truncate">
                            {item && item.file
                              ? item.file.name
                              : "Choose Image"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSliderImageChange(e, index)}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() => removeSliderImage(index)}
                          className="flex-shrink-0 p-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-slate-700">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-cyan-700 hover:via-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={22} />
                    {view === "create" ? "Create Blog" : "Update Blog"}
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-900/50 border-2 border-red-700 rounded-xl backdrop-blur-sm">
                <p className="text-red-200 font-bold mb-1">Error:</p>
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {response && (
              <div className="p-4 bg-green-900/50 border-2 border-green-700 rounded-xl backdrop-blur-sm">
                <p className="text-green-200 font-bold">✓ Success!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
