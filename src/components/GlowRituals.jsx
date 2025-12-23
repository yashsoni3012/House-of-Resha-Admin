// GlowRituals.jsx - Skincare Products Component
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Eye, Edit2, Trash2, X, Save, Sparkles } from 'lucide-react';

const GlowRituals = () => {
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'Vitamin C Serum', 
      category: 'Serum', 
      price: 45.99, 
      description: 'Brightening serum with 20% Vitamin C for radiant skin', 
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', 
      rating: 4.8 
    },
    { 
      id: 2, 
      name: 'Hydrating Face Mask', 
      category: 'Mask', 
      price: 29.99, 
      description: 'Deep hydration overnight mask with hyaluronic acid', 
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 
      rating: 4.6 
    },
    { 
      id: 3, 
      name: 'Rose Water Toner', 
      category: 'Toner', 
      price: 19.99, 
      description: 'Natural rose water toner for balanced skin', 
      image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400', 
      rating: 4.7 
    },
    { 
      id: 4, 
      name: 'Retinol Night Cream', 
      category: 'Moisturizer', 
      price: 55.99, 
      description: 'Anti-aging night cream with retinol and peptides', 
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', 
      rating: 4.9 
    }
  ]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditForm({ ...product });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
    }
  };

  const handleSave = () => {
    if (editForm.id) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === editForm.id ? editForm : p
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      const newProduct = {
        ...editForm,
        id: Date.now()
      };
      setProducts([...products, newProduct]);
    }
    setShowModal(false);
    setEditForm({});
  };

  const handleAdd = () => {
    setEditForm({
      name: '',
      category: 'Serum',
      price: 0,
      description: '',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
      rating: 5
    });
    setModalMode('edit');
    setShowModal(true);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-8 h-8 text-purple-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">MIE by Resha</h1>
              </div>
              <p className="text-gray-600">Discover your perfect skincare routine</p>
            </div>
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search skincare products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-500 self-center flex-shrink-0" />
              {['All', 'Serum', 'Mask', 'Toner', 'Moisturizer'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-600 mt-4">
            Showing {filteredProducts.length} of {products.length} items
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
                    {product.category}
                  </span>
                  <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-purple-600 shadow-md flex items-center gap-1">
                    ⭐ {product.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-800 mb-2 truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-2xl font-bold text-purple-600 mb-4">
                    ${product.price}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(product)}
                      className="flex-1 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-green-100 text-green-600 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {modalMode === 'view' ? 'Product Details' : modalMode === 'edit' && editForm.id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditForm({});
                }} 
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {modalMode === 'view' ? (
                <div>
                  <img
                    src={selectedProduct?.image}
                    alt={selectedProduct?.name}
                    className="w-full h-64 object-cover object-top rounded-xl mb-4"
                  />
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Name</label>
                      <p className="text-lg text-gray-800">{selectedProduct?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Category</label>
                      <p className="text-lg text-gray-800">{selectedProduct?.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Price</label>
                      <p className="text-lg text-gray-800">${selectedProduct?.price}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Rating</label>
                      <p className="text-lg text-gray-800">⭐ {selectedProduct?.rating}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Description</label>
                      <p className="text-lg text-gray-800">{selectedProduct?.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      value={editForm.category || 'Serum'}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    >
                      <option>Serum</option>
                      <option>Mask</option>
                      <option>Toner</option>
                      <option>Moisturizer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.price || 0}
                      onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating *</label>
                    <input
                      type="number"
                      step="0.1"
                      max="5"
                      min="0"
                      value={editForm.rating || 5}
                      onChange={(e) => setEditForm({...editForm, rating: parseFloat(e.target.value) || 5})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="5.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="Enter product description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                    <input
                      type="text"
                      value={editForm.image || ''}
                      onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={!editForm.name || !editForm.price}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {editForm.id ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlowRituals;