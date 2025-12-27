import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Grid,
  List,
  Eye,
  Trash2,
  Calendar,
  Loader,
  AlertCircle,
  X,
  Image as ImageIcon,
  Plus,
  ArrowRight,
  ExternalLink,
  Edit,
} from "lucide-react";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStyle, setViewStyle] = useState("grid");
  const [sortOrder, setSortOrder] = useState("newest");
  const [deletingId, setDeletingId] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedBlogLoading, setSelectedBlogLoading] = useState(false);
  const [selectedBlogError, setSelectedBlogError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = "https://api.houseofresha.com";

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterAndSortBlogs();
  }, [blogs, searchTerm, sortOrder, statusFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/blogs`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setBlogs(result.data);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBlogs = () => {
    let result = [...blogs];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchLower) ||
          blog.description?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter (if implemented)
    if (statusFilter !== "all") {
      result = result.filter((blog) => blog.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredBlogs(result);
  };

  // Opens the confirmation modal for deleting a blog
  const openDeleteModal = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteConfirm(true);
  };

  // Performs the actual delete request
  const performDelete = async (id) => {
    try {
      setDeletingId(id);

      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete blog: ${response.status}`);
      }

      setBlogs((prevBlogs) => prevBlogs.filter((b) => b._id !== id));
      if (selectedBlog?._id === id) {
        setSelectedBlog(null);
      }
      showToast("Blog deleted successfully!", "success");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Error deleting blog: " + err.message, "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Called when user confirms deletion in modal
  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    const id = blogToDelete._id || blogToDelete;
    await performDelete(id);
    setShowDeleteConfirm(false);
    setBlogToDelete(null);
  };

  const handleAddBlog = () => {
    navigate("/add-blog");
    console.log("Navigate to add blog page");
  };

  const handleEditBlog = (id) => {
    navigate(`/edit-blog/${id}`);
    console.log("Navigate to edit blog:", id);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}/${imagePath}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewBlog = async (blog) => {
    try {
      // open modal with minimal info so UI responds quickly
      setSelectedBlog({ _id: blog._id });
      setSelectedBlogError(null);
      setSelectedBlogLoading(true);
      document.body.style.overflow = "hidden";

      const res = await fetch(`${API_BASE_URL}/blogs/${blog._id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch blog: ${res.status}`);
      }
      const json = await res.json();
      if (json.success && json.data) {
        setSelectedBlog(json.data);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      console.error("Error fetching blog details:", err);
      setSelectedBlogError(err.message || "Error fetching blog details");
      showToast("Error fetching blog details: " + (err.message || ""), "error");
    } finally {
      setSelectedBlogLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedBlog(null);
    document.body.style.overflow = "auto";
  };

  const showToast = (message, type = "info") => {
    // You can implement a toast notification system here
    console.log(`${type}: ${message}`);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Basic sanitizer to prevent script injection when rendering editor HTML.
  // For stronger sanitization, install and use DOMPurify (`npm i dompurify`) and
  // replace this function with `DOMPurify.sanitize(html)`.
  const sanitizeHtml = (html) => {
    if (!html) return "";
    try {
      if (typeof window !== "undefined" && window.DOMPurify) {
        return window.DOMPurify.sanitize(html);
      }
      // Basic sanitization: remove <script> tags and inline event handlers (naive but better than nothing)
      return html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
        .replace(/on\w+\s*=\s*'[^']*'/gi, "")
        .replace(/javascript:/gi, "");
    } catch (e) {
      return html;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Loader className="w-10 h-10 animate-spin text-white" />
            </div>
          </div>
          <p className="text-gray-700 text-xl font-semibold animate-pulse">
            Loading amazing blogs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 p-4">
        <div className="bg-white/90 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-8 max-w-md shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-red-900 font-bold text-2xl mb-3 text-center">
            Oops! Something went wrong
          </h3>
          <p className="text-red-700 mb-6 text-center">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchBlogs}
              className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg transform hover:scale-105"
            >
              Try Again
            </button>
            <button
              onClick={() => setError(null)}
              className="w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold shadow-lg transform hover:scale-105"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Content */}
      <div className="">
        {/* Filters Card */}

        <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Blogs
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {blogs.length} {blogs.length === 1 ? "blog" : "blogs"} •
                    Manage your content
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddBlog}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Blog</span>
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 pb-4 space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors" />
              <input
                type="text"
                placeholder="Search blogs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm bg-gray-50 hover:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer font-medium transition-all text-sm bg-gray-50 hover:bg-white"
                >
                  <option value="newest">📅 Newest First</option>
                  <option value="oldest">⏰ Oldest First</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewStyle("grid")}
                  className={`px-4 py-2 rounded-md transition-all font-medium ${
                    viewStyle === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewStyle("list")}
                  className={`px-4 py-2 rounded-md transition-all font-medium ${
                    viewStyle === "list"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 bg-gradient-to-r from-white/60 to-blue-50/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">
                  {filteredBlogs.length}
                </span>
              </div>
              <div>
                <p className="text-gray-700 font-semibold">
                  Showing{" "}
                  <span className="text-blue-600 font-bold">
                    {filteredBlogs.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-purple-600 font-bold">
                    {blogs.length}
                  </span>{" "}
                  blogs
                </p>
                {searchTerm && (
                  <p className="text-sm text-gray-500 mt-1">
                    Results for:{" "}
                    <span className="font-medium">{searchTerm}</span>
                  </p>
                )}
              </div>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Blogs Display */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="inline-block p-8 sm:p-12 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 max-w-md">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h3 className="text-gray-800 text-xl sm:text-2xl font-bold mb-3">
                No blogs found
              </h3>
              {searchTerm ? (
                <p className="text-gray-600 mb-6">
                  No results for "{searchTerm}"
                </p>
              ) : (
                <p className="text-gray-600 mb-6">
                  Start by creating your first blog!
                </p>
              )}
              <button
                onClick={handleAddBlog}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg"
              >
                Create Your First Blog
              </button>
            </div>
          </div>
        ) : viewStyle === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-2 hover:border-blue-200"
              >
                {/* Cover Image */}
                <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                  {blog.coverImage ? (
                    <img
                      src={getImageUrl(blog.coverImage)}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white font-semibold text-sm">
                      {blog.title}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title || "Untitled Blog"}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {truncateText(blog.description || "No description", 120)}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-500 text-xs gap-2 bg-gray-50 rounded-lg p-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>
                    {blog.content && (
                      <div className="text-xs text-indigo-600 bg-indigo-50 rounded-lg px-3 py-1 font-semibold">
                        {blog.content.length} sections
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewBlog(blog)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditBlog(blog._id)}
                      className="px-3 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(blog)}
                      disabled={deletingId === blog._id}
                      className="px-3 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                      title="Delete"
                    >
                      {deletingId === blog._id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 group"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Cover Image */}
                  <div className="w-full sm:w-48 md:w-56 h-48 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden group-hover:shadow-xl transition-shadow">
                    {blog.coverImage ? (
                      <img
                        src={getImageUrl(blog.coverImage)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {blog.title || "Untitled Blog"}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditBlog(blog._id)}
                          className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm text-sm font-semibold"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(blog)}
                          disabled={deletingId === blog._id}
                          className="px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 shadow-sm text-sm font-semibold"
                        >
                          {deletingId === blog._id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm mb-3 gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">
                        {formatDate(blog.createdAt)}
                      </span>
                      {blog.content && (
                        <span className="ml-2 text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs font-semibold">
                          {blog.content.length} sections
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base leading-relaxed">
                      {blog.description || "No description available"}
                    </p>

                    <button
                      onClick={() => handleViewBlog(blog)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Details
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-5xl w-full my-8 relative max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 sm:p-6 flex items-start justify-between z-10 shadow-lg">
              <div className="flex-1 pr-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                  {selectedBlog.title || "Untitled Blog"}
                </h2>
                <div className="flex items-center gap-3 text-sm opacity-90">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedBlog.createdAt)}
                  </span>
                  {selectedBlog.content && (
                    <span className="bg-white/20 px-2 py-1 rounded text-xs">
                      {selectedBlog.content.length} content blocks
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all transform hover:scale-110 hover:rotate-90 duration-300"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
              {selectedBlogLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader className="w-12 h-12 animate-spin text-gray-600" />
                </div>
              ) : selectedBlogError ? (
                <div className="p-6 bg-red-50 rounded-lg">
                  <p className="text-red-700 mb-4">
                    Error: {selectedBlogError}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewBlog({ _id: selectedBlog._id })}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Retry
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cover Image */}
                  {selectedBlog.coverImage && (
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={getImageUrl(selectedBlog.coverImage)}
                        alt={selectedBlog.title}
                        className="w-full h-56 sm:h-72 lg:h-96 object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
                        }}
                      />
                    </div>
                  )}

                  {/* Description */}
                  {selectedBlog.description && (
                    <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedBlog.description}
                      </p>
                    </div>
                  )}

                  {/* Content Blocks */}
                  {selectedBlog.content && selectedBlog.content.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Content ({selectedBlog.content.length} blocks)
                      </h3>
                      <div className="space-y-4">
                        {selectedBlog.content.map((block, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <h4 className="text-gray-900 font-medium">
                                Section {index + 1}
                              </h4>
                            </div>
                            {block.text && (
                              <div
                                className="text-gray-700 mb-4"
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtml(block.text),
                                }}
                              />
                            )}
                            {block.img && (
                              <div className="mt-3">
                                <img
                                  src={getImageUrl(block.img)}
                                  alt={`Content image ${index + 1}`}
                                  className="rounded-lg max-h-64 object-cover mx-auto"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleEditBlog(selectedBlog._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg"
                    >
                      <Edit className="w-5 h-5" />
                      Edit Blog
                    </button>
                    <button
                      onClick={() => openDeleteModal(selectedBlog)}
                      disabled={deletingId === selectedBlog._id}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
                    >
                      {deletingId === selectedBlog._id ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          Delete Blog
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-2">Delete Blog</h3>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete{" "}
              <strong>{blogToDelete?.title || "this blog"}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setBlogToDelete(null);
                }}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId === blogToDelete?._id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === blogToDelete?._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }
`}</style>
    </div>
  );
}
