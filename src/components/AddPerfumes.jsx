import React, { useState } from "react";
import axios from "axios";
import {
  Plus,
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Droplet,
  Tag,
} from "lucide-react";

const AddPerfumes = ({ onPerfumeAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    volume: "",
    text: "",
    inStock: true,
    images: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, images: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, images: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("volume", formData.volume);
      formDataToSend.append("text", formData.text);
      formDataToSend.append("inStock", formData.inStock);
      if (formData.images) {
        formDataToSend.append("images", formData.images);
      }

      // Make POST request
      const response = await axios.post(
        "https://api.houseofresha.com/perfume",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Perfume added successfully:", response.data);

      // Show success message
      setSuccess(true);
      
      // Reset form
      resetForm();

      // Notify parent component about new perfume
      if (onPerfumeAdded) {
        onPerfumeAdded(response.data);
      }

      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        setIsModalOpen(false);
      }, 2000);

    } catch (err) {
      console.error("Error adding perfume:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Failed to add perfume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      volume: "",
      text: "",
      inStock: true,
      images: null,
    });
    setImagePreview(null);
    setError(null);
  };

  const handleCloseModal = () => {
    resetForm();
    setIsModalOpen(false);
    setSuccess(false);
    setError(null);
  };

  return (
    <>
      {/* Add Perfume Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-3 sm:p-4 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 z-40 group"
      >
        <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Add New Perfume
        </span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 sm:p-6 z-10 shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Perfume
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                  disabled={loading}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)] p-4 sm:p-6 md:p-8">
              {success ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Success!
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Perfume added successfully
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Perfume Image
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-500 transition-colors overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                          {imagePreview ? (
                            <>
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="text-center p-4">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <span className="text-xs text-gray-500">
                                Upload image
                              </span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1">
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("image-upload").click()
                          }
                          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Choose Image
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          Recommended: Square image, max 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4" />
                      Perfume Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="Enter perfume name"
                    />
                  </div>

                  {/* Price and Volume */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="volume"
                        className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                      >
                        <Droplet className="w-4 h-4" />
                        Volume (ml) *
                      </label>
                      <input
                        type="number"
                        id="volume"
                        name="volume"
                        value={formData.volume}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="text"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="text"
                      name="text"
                      value={formData.text}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base resize-none"
                      placeholder="Enter perfume description..."
                    />
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="inStock"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label
                      htmlFor="inStock"
                      className="text-sm font-medium text-gray-700"
                    >
                      In Stock
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium text-sm sm:text-base">
                          {error}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={loading}
                      className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Add Perfume
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPerfumes;