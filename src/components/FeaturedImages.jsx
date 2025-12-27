import React, { useState, useEffect } from "react";
import { Image, Plus, Edit2, Trash2, Loader, Search, X } from "lucide-react";
import {
  showConfirm,
  showProductUpdated,
  showSuccess,
  showError,
} from "../utils/sweetAlertConfig";

const FeaturedImages = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Edit modal state (kept for manual edits if needed)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [removedEditImage, setRemovedEditImage] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Direct image patch state
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(
        (category) =>
          category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.houseofresha.com/category");
      const result = await response.json();
      const data = result.data || result || [];
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setEditName(category.name || "");
    setEditDescription(category.description || "");
    setEditType(category.type || "");
    setRemovedEditImage(false);
    setEditImageFile(null);
    // initialize preview to current image URL if present
    setEditImagePreview(
      category.imageUrl
        ? `https://api.houseofresha.com${category.imageUrl}`
        : null
    );
    setShowEditModal(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // revoke previous blob if any
    if (editImagePreview && editImagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(editImagePreview);
      } catch (e) {}
    }
    const preview = URL.createObjectURL(file);
    setEditImageFile(file);
    setEditImagePreview(preview);
    setRemovedEditImage(false);
  };

  const handleRemoveEditImage = () => {
    // mark removed so backend can handle deletion
    if (editImagePreview && editImagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(editImagePreview);
      } catch (e) {}
    }
    setEditImageFile(null);
    setEditImagePreview(null);
    setRemovedEditImage(true);
  };

  const openEditConfirm = async (category) => {
    try {
      const res = await showConfirm(
        "Update Image",
        `Do you want to update the image for \"${
          category.name || "this category"
        }\"?`,
        "Yes, update"
      );
      if (res && res.isConfirmed) {
        // Trigger the hidden file input for this card
        const input = document.getElementById(`edit-image-${category._id}`);
        if (input) input.click();
      }
    } catch (e) {
      console.error("Confirm dialog failed:", e);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;
    setUpdating(true);
    try {
      const fd = new FormData();
      fd.append("name", (editName || "").trim());
      fd.append("description", editDescription || "");
      fd.append("type", editType || "");
      // If user selected a new file, send it. If user removed image, send remove flag
      if (editImageFile) {
        fd.append("image", editImageFile);
      } else if (removedEditImage) {
        fd.append("removeImage", "1");
      }

      const res = await fetch(
        `https://api.houseofresha.com/category/${editingCategory._id}`,
        {
          method: "PATCH",
          body: fd,
        }
      );

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to update category");
      }

      // Success - refresh categories and close modal
      await fetchCategories();
      setShowEditModal(false);
      setEditingCategory(null);
    } catch (err) {
      console.error("Update category error:", err);
      try {
        await showError(
          "Update Failed",
          err.message || "Failed to update category"
        );
      } catch (e) {
        /* ignore */
      }
    } finally {
      setUpdating(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  // Confirm and perform delete
  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(
        `https://api.houseofresha.com/category/${categoryToDelete._id}`,
        { method: "DELETE" }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Failed to delete category");

      await fetchCategories();
      setShowDeleteModal(false);
      setCategoryToDelete(null);

      try {
        await showSuccess("Deleted", "Category deleted successfully");
      } catch (e) {
        /* ignore */
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      try {
        await showError(
          "Delete Failed",
          err.message || "Failed to delete category"
        );
      } catch (e) {}
    } finally {
      setDeleteLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Image className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Featured Images
                </h1>
              </div>
              <p className="text-sm text-gray-600">
                Manage your category images
              </p>
            </div>
            {/* <button className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <Plus className="w-5 h-5" />
              Add Category
            </button> */}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Categories
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {categories.length}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <Image className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Search Results
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {filteredCategories.length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">With Images</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {categories.filter((cat) => cat.imageUrl).length}
                </p>
              </div>
              <div className="bg-pink-100 p-3 rounded-full">
                <Image className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? "No categories found" : "No categories yet"}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start by adding your first category"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100">
                  {category.imageUrl ? (
                    <img
                      src={`https://api.houseofresha.com${category.imageUrl}`}
                      alt={category.name || "Category"}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Image className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  {/* Hidden file input used for direct image patch on Edit click */}
                  <input
                    id={`edit-image-${category._id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files && e.target.files[0];
                      if (!file) return;

                      // Start upload for this category
                      setUpdatingCategoryId(category._id);
                      const fd = new FormData();
                      fd.append("image", file);

                      try {
                        const res = await fetch(
                          `https://api.houseofresha.com/category/${category._id}`,
                          {
                            method: "PATCH",
                            body: fd,
                          }
                        );

                        const json = await res.json();
                        if (!res.ok)
                          throw new Error(
                            json.message || "Failed to update image"
                          );

                        // Refresh list
                        await fetchCategories();
                        // Show top-right toast from sweetalert config
                        try {
                          await showProductUpdated();
                        } catch (e) {
                          /* ignore */
                        }
                      } catch (err) {
                        console.error("Error updating category image:", err);
                        try {
                          await showError(
                            "Update Failed",
                            err.message || "Failed to update image"
                          );
                        } catch (e) {
                          /* ignore */
                        }
                      } finally {
                        setUpdatingCategoryId(null);
                        // Clear the input so selecting same file again works
                        e.target.value = "";
                      }
                    }}
                  />

                  {category.type && (
                    <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full shadow-md">
                      <span className="text-xs font-semibold text-indigo-600">
                        {category.type}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {category.name || "Unnamed Category"}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditConfirm(category)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-medium"
                      disabled={updatingCategoryId === category._id}
                    >
                      {updatingCategoryId === category._id ? (
                        <span className="flex items-center gap-2">
                          <Loader className="w-4 h-4 animate-spin text-indigo-600" />
                          Updating...
                        </span>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openDeleteModal(category)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
                      disabled={deleteLoading}
                    >
                      {deleteLoading &&
                      categoryToDelete &&
                      categoryToDelete._id === category._id ? (
                        <span className="flex items-center gap-2">
                          <Loader className="w-4 h-4 animate-spin text-red-600" />{" "}
                          Deleting...
                        </span>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Footer Info */}
                {/* <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ID: {category._id?.slice(-6)}</span>
                    {category.createdAt && (
                      <span>
                        {new Date(category.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">Delete Category</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <strong>{categoryToDelete?.name || "this category"}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Edit Category</h3>
                    <p className="text-sm text-gray-500">
                      Update image and details
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                    Type
                  </label>
                  <input
                    type="text"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />

                  <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                    Description
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={4}
                  />
                </div>

                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
                  {editImagePreview ? (
                    <div className="relative w-full">
                      <img
                        src={editImagePreview}
                        alt="preview"
                        className="w-full h-48 object-cover rounded-lg object-top"
                      />
                      <button
                        onClick={handleRemoveEditImage}
                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer w-full">
                      <Image className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="hidden"
                      />
                    </label>
                  )}

                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Recommended: 1200x800px • JPG/PNG • Max 2MB
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg disabled:opacity-50"
                  disabled={updating}
                >
                  {updating ? (
                    <span className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" /> Updating...
                    </span>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedImages;
