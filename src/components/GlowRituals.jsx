import React, { useState, useEffect } from 'react';
import { ShoppingCart, AlertCircle, Loader2 } from 'lucide-react';

export default function PerfumeGallery() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://api.houseofresha.com/perfume');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      // API returns data wrapped in {success: true, data: [...]}
      const data = result.data || result;
      setPerfumes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching perfumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const formatPrice = (price) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `https://api.houseofresha.com${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading perfumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Error Loading Perfumes</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={fetchPerfumes}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            House of Resha Perfumes
          </h1>
          <p className="text-lg text-gray-600">
            Discover our exquisite collection of {perfumes.length} fragrances
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {perfumes.map((perfume) => (
            <div
              key={perfume._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img
                  src={getImageUrl(perfume.images)}
                  alt={perfume.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                {!perfume.inStock && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Out of Stock
                  </div>
                )}
                {perfume.inStock && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    In Stock
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                  {perfume.name}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-purple-600">
                    {formatPrice(perfume.price)}
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {perfume.volume}ml
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {stripHtml(perfume.text)}
                </p>

                <button
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition ${
                    perfume.inStock
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!perfume.inStock}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {perfume.inStock ? 'Add to Cart' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {perfumes.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No perfumes available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}