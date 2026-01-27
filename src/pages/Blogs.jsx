import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Grid,
  List,
  Eye,
  Trash2,
  Calendar,
  Loader2,
  AlertCircle,
  X,
  Image as ImageIcon,
  Plus,
  Edit,
  BarChart3,
  Package,
  Tag,
  RefreshCw,
  ExternalLink,
  FileText,
} from "lucide-react";

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
  const [QuillViewer, setQuillViewer] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = "https://api.houseofresha.com";

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterAndSortBlogs();
  }, [blogs, searchTerm, sortOrder]);

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

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchLower) ||
          blog.description?.toLowerCase().includes(searchLower),
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredBlogs(result);
  };

  const openDeleteModal = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteConfirm(true);
  };

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
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting blog: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    const id = blogToDelete._id || blogToDelete;
    await performDelete(id);
    setShowDeleteConfirm(false);
    setBlogToDelete(null);
  };

  const handleAddBlog = () => {
    navigate("/add-blog");
  };

  const handleEditBlog = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  const handleViewBlog = async (blog) => {
    try {
      setSelectedBlogLoading(true);
      setSelectedBlogError(null);

      // Show basic info immediately and prevent body scroll
      setSelectedBlog(blog);
      document.body.style.overflow = "hidden";

      // Dynamically load the Quill viewer component (lightweight; only when needed)
      if (!QuillViewer) {
        try {
          const mod = await import("react-quill-new");
          if (mod && mod.default) {
            setQuillViewer(() => mod.default);

            // Ensure Quill CSS is present (use CDN for reliability)
            const linkId = "quill-cdn-css";
            if (!document.getElementById(linkId)) {
              const link = document.createElement("link");
              link.id = linkId;
              link.rel = "stylesheet";
              link.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
              document.head.appendChild(link);
            }
          }
        } catch (e) {
          console.error("Failed to load react-quill-new:", e);
        }
      }

      // Fetch full blog details by id in case the list item does not contain full content or images
      try {
        const res = await fetch(`${API_BASE_URL}/blogs/${blog._id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setSelectedBlog(json.data);
          }
        }
      } catch (fetchErr) {
        console.error("Failed to fetch blog details:", fetchErr);
        // Keep the basic blog object shown, but surface an error message so user can retry
        setSelectedBlogError(fetchErr.message || "Failed to load blog details");
      }
    } catch (err) {
      console.error("Error viewing blog:", err);
      setSelectedBlogError(err.message || "Error viewing blog");
    } finally {
      setSelectedBlogLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedBlog(null);
    document.body.style.overflow = "auto";
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
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleRefresh = () => {
    fetchBlogs();
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Sanitize HTML to safely render content inside the admin UI.
  // Prefer DOMPurify if available in the page (e.g., loaded globally), otherwise fall back
  // to a conservative regex-based sanitizer (not as robust as DOMPurify).
  const sanitizeHtml = (html) => {
    if (!html) return "";
    try {
      if (typeof window !== "undefined" && window.DOMPurify) {
        return window.DOMPurify.sanitize(html);
      }
      // Basic sanitization: remove <script> tags and event handler attributes and javascript: URIs
      return html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
        .replace(/on\w+\s*=\s*'[^']*'/gi, "")
        .replace(/javascript:/gi, "");
    } catch (e) {
      return html;
    }
  };

  // Stats
  const totalBlogs = blogs.length;
  const withImages = blogs.filter((blog) => blog.coverImage).length;
  const recentBlogs = blogs.filter((blog) => {
    const blogDate = new Date(blog.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return blogDate > thirtyDaysAgo;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Blog Management
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate">
                  Manage your blog posts and content
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full sm:w-auto mt-3 sm:mt-0">
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
                {/* Refresh Button (commented out) */}
                {/* <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`w-4 h-4 flex-shrink-0 ${loading ? "animate-spin" : ""}`}
          />
          <span className="hidden xs:inline">Refresh</span>
        </button> */}

                {/* Add Blog Button */}
                <button
                  onClick={handleAddBlog}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-medium shadow-sm hover:shadow-md text-sm sm:text-base whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden xs:inline">Add Blog</span>
                  <span className="xs:hidden sm:inline">Add Blog</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Package}
            label="Total Blogs"
            value={totalBlogs}
            color="bg-blue-500"
          />
          <StatsCard
            icon={ImageIcon}
            label="With Images"
            value={withImages}
            color="bg-green-500"
          />
          <StatsCard
            icon={Calendar}
            label="Recent (30 days)"
            value={recentBlogs}
            color="bg-purple-500"
          />
          <StatsCard
            icon={BarChart3}
            label="Search Results"
            value={filteredBlogs.length}
            color="bg-yellow-500"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Bar - Takes remaining space on larger screens */}
            <div className="w-full lg:flex-1">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search blogs by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 lg:pl-14 pr-10 sm:pr-12 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base bg-white shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sort Dropdown and View Toggle - Side by side */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Sort Dropdown */}
              <div className="flex-1 sm:flex-initial">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer font-medium transition-colors text-xs sm:text-sm bg-white shadow-sm min-w-[140px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              {/* View Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewStyle("grid")}
                  title="Grid view"
                  className={`p-2 rounded-md transition-colors ${
                    viewStyle === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewStyle("list")}
                  title="List view"
                  className={`p-2 rounded-md transition-colors ${
                    viewStyle === "list"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-indigo-600">
              {filteredBlogs.length}
            </span>{" "}
            of <span className="font-semibold">{blogs.length}</span> blogs
            {searchTerm && (
              <span className="block sm:inline mt-1 sm:mt-0">
                {" "}
                matching "
                <span className="font-semibold text-gray-900">
                  {searchTerm}
                </span>
                "
              </span>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Blogs Display */}
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? "No blogs found" : "No blogs yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start by creating your first blog"}
            </p>
            <button
              onClick={handleAddBlog}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Create First Blog
            </button>
          </div>
        ) : viewStyle === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden bg-gray-100">
                  {blog.coverImage ? (
                    <img
                      src={getImageUrl(blog.coverImage)}
                      alt={blog.title}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Blog Info */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <div className="mb-3 sm:mb-4 flex-1">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 line-clamp-2 min-h-[48px] sm:min-h-[56px]">
                      {blog.title || "Untitled Blog"}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 sm:line-clamp-3">
                      {truncateText(blog.description || "No description", 120)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewBlog(blog)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs sm:text-sm"
                      aria-label="View blog"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">View</span>
                    </button>
                    <button
                      onClick={() => handleEditBlog(blog._id)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-xs sm:text-sm"
                      aria-label="Edit blog"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(blog)}
                      disabled={deletingId === blog._id}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-xs sm:text-sm disabled:opacity-50"
                      aria-label="Delete blog"
                    >
                      {deletingId === blog._id ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      <span className="hidden xs:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Cover Image */}
                  <div className="w-full sm:w-40 md:w-48 h-40 sm:h-32 md:h-auto flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {blog.coverImage ? (
                      <img
                        src={getImageUrl(blog.coverImage)}
                        alt={blog.title}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Blog Info */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 line-clamp-2">
                        {blog.title || "Untitled Blog"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        {blog.content && (
                          <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 sm:py-1 rounded text-xs font-semibold whitespace-nowrap">
                            {blog.content.length} sections
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                        {blog.description || "No description available"}
                      </p>
                    </div>

                    {/* Action Buttons - Full Width 33% Each */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleViewBlog(blog)}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-medium"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleEditBlog(blog._id)}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs sm:text-sm font-medium"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(blog)}
                        disabled={deletingId === blog._id}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs sm:text-sm font-medium disabled:opacity-50"
                      >
                        {deletingId === blog._id ? (
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 p-4 sm:p-6 z-10 shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold">Blog Details</h2>
                <button
                  onClick={closeModal}
                  className="text-black/30 hover:text-black/80 hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)] p-4 sm:p-6 space-y-4 sm:space-y-6">
              {selectedBlogLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-3" />
                  <p className="text-gray-600 text-sm">Loading...</p>
                </div>
              ) : selectedBlogError ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                  <p className="text-red-700 mb-4 text-sm sm:text-base">
                    Error: {selectedBlogError}
                  </p>
                  <button
                    onClick={() => handleViewBlog({ _id: selectedBlog._id })}
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base font-medium"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {/* Cover Image */}
                  {selectedBlog.coverImage && (
                    <div className="rounded-xl overflow-hidden bg-gray-900 shadow-lg">
                      <img
                        src={getImageUrl(selectedBlog.coverImage)}
                        alt={selectedBlog.title}
                        className="w-full h-48 sm:h-64 md:h-80 object-cover object-top"
                      />
                    </div>
                  )}

                  {/* Blog Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                      {selectedBlog.title || "Untitled Blog"}
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full w-fit">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs sm:text-sm font-medium text-indigo-900">
                        {formatDate(selectedBlog.createdAt)}
                      </span>
                    </div>

                    {selectedBlog.description && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-indigo-100">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                          Description
                        </h4>
                        <p className="text-gray-700 text-sm sm:text-base">
                          {selectedBlog.description}
                        </p>
                      </div>
                    )}

                    {/* Content Blocks */}
                    {selectedBlog.content &&
                      selectedBlog.content.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">
                            Content ({selectedBlog.content.length} sections)
                          </h4>
                          <div className="space-y-3 sm:space-y-4">
                            {selectedBlog.content.map((block, index) => (
                              <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md hover:border-indigo-200 transition-all"
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                                    Section {index + 1}
                                  </span>
                                </div>

                                {block.text && (
                                  <div className="mb-3">
                                    {QuillViewer ? (
                                      <QuillViewer
                                        value={sanitizeHtml(block.text)}
                                        readOnly
                                        theme="bubble"
                                      />
                                    ) : (
                                      <div
                                        className="text-gray-700 text-sm sm:text-base"
                                        dangerouslySetInnerHTML={{
                                          __html: sanitizeHtml(block.text),
                                        }}
                                      />
                                    )}
                                  </div>
                                )}

                                {/* Render images */}
                                {block.img && (
                                  <div className="mt-3 space-y-3">
                                    {Array.isArray(block.img) ? (
                                      block.img.map((imgSrc, imgIdx) => (
                                        <img
                                          key={imgIdx}
                                          src={getImageUrl(imgSrc)}
                                          alt={`Section ${index + 1} image ${
                                            imgIdx + 1
                                          }`}
                                          className="rounded-lg w-full h-48 sm:h-56 md:h-64 object-cover object-top shadow-md"
                                          onError={(e) => {
                                            e.target.style.display = "none";
                                          }}
                                        />
                                      ))
                                    ) : (
                                      <img
                                        src={getImageUrl(block.img)}
                                        alt={`Section ${index + 1} image`}
                                        className="rounded-lg w-full h-48 sm:h-56 md:h-64 object-cover object-top shadow-md"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                        }}
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        closeModal();
                        handleEditBlog(selectedBlog._id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium text-sm sm:text-base shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Blog
                    </button>
                    <button
                      onClick={() => {
                        closeModal();
                        openDeleteModal(selectedBlog);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-sm sm:text-base shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Blog
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delete Blog</h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                "{blogToDelete?.title || "this blog"}"
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingId === blogToDelete?._id}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId === blogToDelete?._id}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium"
              >
                {deletingId === blogToDelete?._id ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
