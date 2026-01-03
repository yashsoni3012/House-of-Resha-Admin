import React, { useState, useEffect } from "react";
import {
  Loader2,
  Search,
  Package,
  ShoppingCart,
  Eye,
  X,
  AlertCircle,
  Droplet,
} from "lucide-react";

const PerfumeCollection = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerfume, setSelectedPerfume] = useState(null);

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://api.houseofresha.com/perfume");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      // Handle different response formats
      const perfumeData = Array.isArray(data)
        ? data
        : data.data || data.perfumes || [];
      setPerfumes(perfumeData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `https://api.houseofresha.com/${imagePath}`;
  };

  const filteredPerfumes = perfumes.filter((perfume) =>
    perfume?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-700 text-base sm:text-lg font-medium">
            Loading perfumes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={fetchPerfumes}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all font-medium shadow-lg text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-4 sm:py-6 md:py-8 lg:py-12 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg mb-3 sm:mb-4">
            <Droplet className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              House of Resha Perfumes
            </h1>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-4">
            Discover our exquisite collection of premium fragrances
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search perfumes by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 md:py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6 text-center">
          <p className="text-gray-600 text-xs sm:text-sm md:text-base">
            Showing{" "}
            <span className="font-bold text-purple-600">
              {filteredPerfumes.length}
            </span>{" "}
            perfume{filteredPerfumes.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Perfumes Grid */}
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base md:text-lg">
              No perfumes found
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {filteredPerfumes.map((perfume) => (
              <div
                key={perfume._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-[1.02]"
              >
                {/* Image */}
                <div className="relative h-44 sm:h-52 md:h-60 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                  {perfume.images ? (
                    <img
                      src={getImageUrl(perfume.images)}
                      alt={perfume.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.classList.add(
                          "flex",
                          "items-center",
                          "justify-center"
                        );
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Droplet className="w-12 h-12 sm:w-16 sm:h-16 text-purple-300" />
                    </div>
                  )}

                  {/* Stock Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg ${
                        perfume.inStock
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {perfume.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {/* Quick View Button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => setSelectedPerfume(perfume)}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-lg"
                    >
                      <Eye className="w-4 h-4 text-purple-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                    {perfume.name}
                  </h3>

                  {perfume.volume && (
                    <div className="flex items-center gap-2 mb-3">
                      <Droplet className="w-4 h-4 text-purple-500" />
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">
                        {perfume.volume}ml
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                      ₹{perfume.price?.toLocaleString()}
                    </p>
                  </div>

                  <button
                    disabled={!perfume.inStock}
                    className={`w-full mt-3 sm:mt-4 px-4 py-2.5 rounded-xl transition-all font-medium shadow-lg text-sm sm:text-base flex items-center justify-center gap-2 ${
                      perfume.inStock
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {perfume.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPerfume && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50"
          onClick={() => setSelectedPerfume(null)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 sm:p-6 z-10 shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold">
                  Perfume Details
                </h2>
                <button
                  onClick={() => setSelectedPerfume(null)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)] p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {selectedPerfume.images && (
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 shadow-xl">
                  <img
                    src={getImageUrl(selectedPerfume.images)}
                    alt={selectedPerfume.name}
                    className="w-full h-56 sm:h-72 md:h-96 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex-1">
                    {selectedPerfume.name}
                  </h3>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${
                      selectedPerfume.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedPerfume.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {selectedPerfume.volume && (
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-50 rounded-full">
                      <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      <span className="text-sm sm:text-base font-semibold text-purple-900">
                        {selectedPerfume.volume}ml
                      </span>
                    </div>
                  )}
                  <div className="px-3 sm:px-4 py-2 bg-indigo-50 rounded-full">
                    <span className="text-xl sm:text-2xl font-bold text-purple-600">
                      ₹{selectedPerfume.price?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedPerfume.text && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-purple-100">
                    <h4 className="font-bold text-gray-900 mb-3 text-base sm:text-lg">
                      Description
                    </h4>
                    <div
                      className="text-gray-700 text-sm sm:text-base prose prose-sm sm:prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedPerfume.text }}
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Added:{" "}
                    {new Date(selectedPerfume.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <button
                disabled={!selectedPerfume.inStock}
                className={`w-full px-6 py-3 sm:py-4 rounded-xl transition-all font-semibold shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base ${
                  selectedPerfume.inStock
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {selectedPerfume.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfumeCollection;
