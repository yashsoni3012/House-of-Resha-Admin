// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';

// const GlowRituals = () => {
//   const navigate = useNavigate();
//   const [perfumes, setPerfumes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchPerfumes();
//   }, []);

//   const fetchPerfumes = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await axios.get('https://api.houseofresha.com/perfume');
//       console.log('API Response:', response.data);
      
//       if (Array.isArray(response.data)) {
//         setPerfumes(response.data);
//       } else if (response.data.data && Array.isArray(response.data.data)) {
//         setPerfumes(response.data.data);
//       } else {
//         setPerfumes([]);
//         console.warn('Unexpected data format:', response.data);
//       }
//     } catch (err) {
//       console.error('Error fetching perfumes:', err);
//       setError(err.message || 'Failed to load perfumes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id, name) => {
//     if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
//       return;
//     }
    
//     try {
//       await axios.delete(`https://api.houseofresha.com/perfume/${id}`);
//       setPerfumes(perfumes.filter(p => p._id !== id));
//       alert('Perfume deleted successfully!');
//     } catch (err) {
//       console.error('Delete error:', err);
//       alert(err.response?.data?.message || 'Failed to delete perfume');
//     }
//   };

//   const handleEdit = (id) => {
//     navigate(`/edit-perfume/${id}`);
//   };

//   const stripHtmlTags = (html) => {
//     if (!html) return '';
//     const tmp = document.createElement('div');
//     tmp.innerHTML = html;
//     return tmp.textContent || tmp.innerText || '';
//   };

//   if (loading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '400px',
//         fontSize: '18px',
//         color: '#666'
//       }}>
//         <div>Loading perfumes...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '400px',
//         padding: '20px'
//       }}>
//         <p style={{ color: '#dc3545', fontSize: '18px', marginBottom: '20px' }}>
//           Error: {error}
//         </p>
//         <button
//           onClick={fetchPerfumes}
//           style={{
//             padding: '10px 30px',
//             backgroundColor: '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             fontSize: '16px'
//           }}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ 
//       padding: '20px', 
//       maxWidth: '1400px', 
//       margin: '0 auto',
//       backgroundColor: '#f8f9fa',
//       minHeight: '100vh'
//     }}>
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '30px',
//         padding: '20px',
//         backgroundColor: 'white',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//       }}>
//         <h1 style={{ margin: 0, color: '#333' }}>Glow Rituals - Perfume Collection</h1>
//         <Link
//           to="/add-perfume"
//           style={{
//             padding: '12px 24px',
//             backgroundColor: '#28a745',
//             color: 'white',
//             textDecoration: 'none',
//             borderRadius: '6px',
//             fontWeight: '500',
//             transition: 'background-color 0.3s'
//           }}
//         >
//           + Add New Perfume
//         </Link>
//       </div>

//       {perfumes.length === 0 ? (
//         <div style={{
//           textAlign: 'center',
//           padding: '60px 20px',
//           backgroundColor: 'white',
//           borderRadius: '8px',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//         }}>
//           <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
//             No perfumes available yet.
//           </p>
//           <Link
//             to="/add-perfume"
//             style={{
//               display: 'inline-block',
//               padding: '12px 24px',
//               backgroundColor: '#007bff',
//               color: 'white',
//               textDecoration: 'none',
//               borderRadius: '6px'
//             }}
//           >
//             Add Your First Perfume
//           </Link>
//         </div>
//       ) : (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
//           gap: '24px'
//         }}>
//           {perfumes.map((perfume) => (
//             <div
//               key={perfume._id}
//               style={{
//                 backgroundColor: 'white',
//                 borderRadius: '8px',
//                 overflow: 'hidden',
//                 boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                 transition: 'transform 0.2s, box-shadow 0.2s',
//                 cursor: 'pointer'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'translateY(-4px)';
//                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'translateY(0)';
//                 e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
//               }}
//             >
//               <div style={{
//                 width: '100%',
//                 height: '280px',
//                 overflow: 'hidden',
//                 backgroundColor: '#f0f0f0'
//               }}>
//                 {perfume.images ? (
//                   <img
//                     src={`https://api.houseofresha.com/${perfume.images}`}
//                     alt={perfume.name}
//                     style={{
//                       width: '100%',
//                       height: '100%',
//                       objectFit: 'cover'
//                     }}
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                       e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">No Image Available</div>';
//                     }}
//                   />
//                 ) : (
//                   <div style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     height: '100%',
//                     color: '#999',
//                     fontSize: '16px'
//                   }}>
//                     No Image Available
//                   </div>
//                 )}
//               </div>

//               <div style={{ padding: '20px' }}>
//                 <h3 style={{
//                   margin: '0 0 12px 0',
//                   fontSize: '22px',
//                   color: '#333',
//                   fontWeight: '600'
//                 }}>
//                   {perfume.name}
//                 </h3>

//                 <div style={{ marginBottom: '16px' }}>
//                   <p style={{
//                     margin: '8px 0',
//                     fontSize: '24px',
//                     fontWeight: 'bold',
//                     color: '#28a745'
//                   }}>
//                     ₹{perfume.price?.toLocaleString() || perfume.price}
//                   </p>
//                   <p style={{
//                     margin: '6px 0',
//                     color: '#666',
//                     fontSize: '15px'
//                   }}>
//                     Volume: {perfume.volume}ml
//                   </p>
//                   <span style={{
//                     display: 'inline-block',
//                     padding: '4px 12px',
//                     borderRadius: '12px',
//                     fontSize: '13px',
//                     fontWeight: '500',
//                     backgroundColor: perfume.inStock ? '#d4edda' : '#f8d7da',
//                     color: perfume.inStock ? '#155724' : '#721c24',
//                     marginTop: '6px'
//                   }}>
//                     {perfume.inStock ? '✓ In Stock' : '✗ Out of Stock'}
//                   </span>
//                 </div>

//                 {perfume.text && (
//                   <p style={{
//                     margin: '12px 0',
//                     fontSize: '14px',
//                     color: '#666',
//                     lineHeight: '1.5',
//                     display: '-webkit-box',
//                     WebkitLineClamp: 3,
//                     WebkitBoxOrient: 'vertical',
//                     overflow: 'hidden'
//                   }}>
//                     {stripHtmlTags(perfume.text)}
//                   </p>
//                 )}

//                 <div style={{
//                   display: 'flex',
//                   gap: '12px',
//                   marginTop: '20px'
//                 }}>
//                   <button
//                     onClick={() => handleEdit(perfume._id)}
//                     style={{
//                       flex: 1,
//                       padding: '10px',
//                       backgroundColor: '#007bff',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '6px',
//                       cursor: 'pointer',
//                       fontSize: '15px',
//                       fontWeight: '500',
//                       transition: 'background-color 0.2s'
//                     }}
//                     onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
//                     onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(perfume._id, perfume.name)}
//                     style={{
//                       flex: 1,
//                       padding: '10px',
//                       backgroundColor: '#dc3545',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '6px',
//                       cursor: 'pointer',
//                       fontSize: '15px',
//                       fontWeight: '500',
//                       transition: 'background-color 0.2s'
//                     }}
//                     onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
//                     onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default GlowRituals;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  ShoppingBag,
  AlertCircle,
  ChevronDown,
  X,
  Check,
  Shield,
  Calendar,
  Package,
  Tag,
  BarChart3,
  Users,
  LayoutGrid,
  LayoutList,
  Loader2,
  RefreshCw,
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

const GlowRituals = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [perfumeToDelete, setPerfumeToDelete] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [quillLoaded, setQuillLoaded] = useState(false);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const clearSearch = () => setSearchQuery("");

  useEffect(() => {
    fetchPerfumes();
    setQuillLoaded(true);
  }, []);

  useEffect(() => {
    filterPerfumes();
  }, [perfumes, searchQuery, selectedStock]);

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://api.houseofresha.com/perfume");

      if (!response.ok) {
        throw new Error(`Failed to fetch perfumes`);
      }

      const result = await response.json();
      
      // Handle different response structures
      let perfumeData = [];
      
      if (Array.isArray(result)) {
        perfumeData = result;
      } else if (result.data && Array.isArray(result.data)) {
        perfumeData = result.data;
      } else if (result.success && result.data && Array.isArray(result.data)) {
        perfumeData = result.data;
      }

      const transformedData = perfumeData.map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price || 0,
        volume: item.volume || 0,
        text: item.text || "",
        description: item.text ? stripHtmlTags(item.text).substring(0, 100) + "..." : "",
        inStock: item.inStock !== undefined ? item.inStock : true,
        image: item.images
          ? item.images.startsWith('http') 
            ? item.images 
            : `https://api.houseofresha.com/${item.images}`
          : "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop",
        createdAt: item.createdAt,
      }));

      // Sort by newest first
      transformedData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPerfumes(transformedData);
    } catch (error) {
      console.error("Error fetching perfumes:", error);
      setError("Unable to load perfumes. Showing demo data.");

      // Demo data for fallback
      const demoData = [
        {
          id: "1",
          name: "Midnight Rose",
          price: 2999,
          volume: 100,
          text: "<h3>Midnight Rose Perfume</h3><p>A captivating blend of <strong>rose</strong>, <strong>oud</strong>, and <strong>musk</strong>. Perfect for evening wear.</p><ul><li>Long lasting fragrance</li><li>Unisex scent</li><li>Premium packaging</li></ul>",
          description: "A captivating blend of rose, oud, and musk. Perfect for evening wear.",
          inStock: true,
          image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Ocean Breeze",
          price: 2499,
          volume: 50,
          text: "<h3>Ocean Breeze</h3><p>Fresh and aquatic scent inspired by the sea. <strong>Notes:</strong> marine accord, citrus, white musk.</p>",
          description: "Fresh and aquatic scent inspired by the sea.",
          inStock: true,
          image: "https://images.unsplash.com/photo-1590736969954-285ed1f98817?w=400",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Sandalwood Dreams",
          price: 3499,
          volume: 100,
          text: "<h2>Sandalwood Dreams</h2><p>Warm and woody fragrance with <em>premium sandalwood</em> and spice notes.</p>",
          description: "Warm and woody fragrance with premium sandalwood and spice notes.",
          inStock: false,
          image: "https://images.unsplash.com/photo-1590736969954-285ed1f98817?w=400",
          createdAt: new Date().toISOString(),
        },
      ];
      setPerfumes(demoData);
    } finally {
      setLoading(false);
    }
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const filterPerfumes = () => {
    let filtered = perfumes;

    if (selectedStock !== "All") {
      const stockStatus = selectedStock === "In Stock";
      filtered = filtered.filter((p) => p.inStock === stockStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stripHtmlTags(p.text)?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPerfumes(filtered);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleView = (perfume) => {
    setSelectedPerfume(perfume);
    setShowViewModal(true);
  };

  const handleEdit = (perfume) => {
    navigate(`/edit-perfume/${perfume.id}`);
  };

  const handleAddNewPerfume = () => {
    navigate("/add-perfume");
  };

  const handleDeleteClick = (perfume) => {
    setPerfumeToDelete(perfume);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!perfumeToDelete) return;

    try {
      setDeleteLoading(perfumeToDelete.id);
      const response = await fetch(
        `https://api.houseofresha.com/perfume/${perfumeToDelete.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        const updatedPerfumes = perfumes.filter(
          (p) => p.id !== perfumeToDelete.id
        );
        setPerfumes(updatedPerfumes);
        setShowDeleteConfirm(false);
        setPerfumeToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting perfume:", error);
      setError("Failed to delete perfume");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRefresh = () => {
    fetchPerfumes();
  };

  const stockOptions = ["All", "In Stock", "Out of Stock"];

  const perfumesToDisplay = filteredPerfumes.slice(0, visibleCount);
  const hasMorePerfumes = visibleCount < filteredPerfumes.length;

  const totalPerfumes = perfumes.length;
  const inStockPerfumes = perfumes.filter((p) => p.inStock).length;
  const outOfStockPerfumes = perfumes.filter((p) => !p.inStock).length;
  const averagePrice = perfumes.length > 0 
    ? Math.round(perfumes.reduce((sum, p) => sum + p.price, 0) / perfumes.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Glow Rituals - Perfume Collection
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your premium perfume collection
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleAddNewPerfume}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Perfume
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={ShoppingBag}
            label="Total Perfumes"
            value={totalPerfumes}
            color="bg-blue-500"
          />
          <StatsCard
            icon={Users}
            label="In Stock"
            value={inStockPerfumes}
            color="bg-green-500"
          />
          <StatsCard
            icon={BarChart3}
            label="Out of Stock"
            value={outOfStockPerfumes}
            color="bg-red-500"
          />
          <StatsCard
            icon={Tag}
            label="Avg. Price"
            value={`₹${averagePrice}`}
            color="bg-purple-500"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <Search
                  onClick={() => searchInputRef.current?.focus()}
                  className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 lg:pl-14 pr-10 sm:pr-12 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm sm:text-base bg-white shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters and View Toggle Row */}
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              {/* Desktop Stock Filters */}
              <div className="hidden lg:flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium whitespace-nowrap">
                  <Filter className="w-4 h-4" />
                  <span>Stock Status:</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {stockOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedStock(option)}
                      className={`px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
                        selectedStock === option
                          ? option === "In Stock" 
                            ? "bg-green-600 text-white"
                            : option === "Out of Stock"
                            ? "bg-red-600 text-white"
                            : "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile/Tablet Filter Button + View Toggle */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Mobile/Tablet filter button */}
                <button
                  className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  aria-expanded={showMobileFilters}
                  aria-label="Toggle filters"
                >
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* View Toggle Buttons */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    title="Grid view"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    title="List view"
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <LayoutList className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Filters Panel */}
          {showMobileFilters && (
            <div className="lg:hidden mt-3 sm:mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setSelectedStock("All")}
                    className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-xs sm:text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {stockOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedStock(option);
                      setShowMobileFilters(false);
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap text-xs sm:text-sm transition-colors ${
                      selectedStock === option
                        ? option === "In Stock" 
                          ? "bg-green-600 text-white shadow-md"
                          : option === "Out of Stock"
                          ? "bg-red-600 text-white shadow-md"
                          : "bg-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-indigo-600">
              {perfumesToDisplay.length}
            </span>{" "}
            of <span className="font-semibold">{filteredPerfumes.length}</span>{" "}
            perfumes
            {hasMorePerfumes && (
              <span className="ml-1 sm:ml-2 text-gray-500">
                • {filteredPerfumes.length - visibleCount} more available
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

        {/* Perfumes Grid */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading perfumes...</p>
          </div>
        ) : filteredPerfumes.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No perfumes found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedStock !== "All"
                ? "Try adjusting your search or filters"
                : "Add your first perfume to get started"}
            </p>
            <button
              onClick={handleAddNewPerfume}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add First Perfume
            </button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {perfumesToDisplay.map((perfume) => (
                  <div
                    key={perfume.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    {/* Perfume Image */}
                    <div className="relative aspect-[4/3] sm:aspect-[4/3] md:aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={perfume.image}
                        alt={perfume.name}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop";
                        }}
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <span className={`px-2 py-1 rounded-full text-xs sm:text-xs font-semibold whitespace-nowrap ${
                          perfume.inStock 
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}>
                          {perfume.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    {/* Perfume Info */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col">
                      <div className="mb-3 sm:mb-4 flex-1">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 line-clamp-1">
                          {perfume.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                          {perfume.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            <p className="text-lg sm:text-xl font-bold text-indigo-600">
                              ₹{perfume.price}
                            </p>
                            <p className="text-xs text-gray-500">
                              {perfume.volume}ml
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(perfume)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs sm:text-sm"
                          title="View perfume details"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">View</span>
                        </button>
                        <button
                          onClick={() => handleEdit(perfume)}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-xs sm:text-sm"
                          title="Edit perfume"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(perfume)}
                          disabled={deleteLoading === perfume.id}
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-xs sm:text-sm disabled:opacity-50"
                          title="Delete perfume"
                        >
                          {deleteLoading === perfume.id ? (
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
              <div className="space-y-4">
                {perfumesToDisplay.map((perfume) => (
                  <div
                    key={perfume.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                  >
                    <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={perfume.image}
                        alt={perfume.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                            {perfume.name}
                          </h3>
                          <p className="text-gray-600 text-sm truncate">
                            {perfume.description}
                          </p>
                          {perfume.text &&
                            stripHtmlTags(perfume.text).trim() && (
                              <div className="mt-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Rich text description available
                              </div>
                            )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-indigo-600">
                            ₹{perfume.price}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              perfume.inStock 
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {perfume.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {perfume.volume}ml
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {perfume.createdAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(perfume.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(perfume)}
                            className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4 inline mr-1" /> View
                          </button>
                          <button
                            onClick={() => handleEdit(perfume)}
                            className="px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm font-medium"
                          >
                            <Edit2 className="w-4 h-4 inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(perfume)}
                            disabled={deleteLoading === perfume.id}
                            className="px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {deleteLoading === perfume.id ? (
                              <Loader2 className="w-4 h-4 animate-spin inline mr-1" />
                            ) : (
                              <Trash2 className="w-4 h-4 inline mr-1" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMorePerfumes && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <ChevronDown className="w-4 h-4" />
                  Load More ({filteredPerfumes.length - visibleCount} remaining)
                </button>
              </div>
            )}

            {/* Completion Message */}
            {filteredPerfumes.length > 0 && !hasMorePerfumes && (
              <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg inline-flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <span className="font-medium">
                    All {filteredPerfumes.length} perfumes are displayed!
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delete Perfume</h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                "{perfumeToDelete?.name}"
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium"
              >
                {deleteLoading ? (
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

      {/* View Perfume Modal */}
      {showViewModal && selectedPerfume && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  Perfume Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Perfume Image */}
              <div className="relative rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={selectedPerfume.image}
                  alt={selectedPerfume.name}
                  className="w-full h-64 sm:h-96 object-cover object-center"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                    selectedPerfume.inStock 
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}>
                    {selectedPerfume.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Perfume Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedPerfume.name}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Price
                      </h4>
                      <p className="text-3xl font-bold text-indigo-600">
                        ₹{selectedPerfume.price}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Volume
                      </h4>
                      <p className="text-3xl font-bold text-gray-800">
                        {selectedPerfume.volume}ml
                      </p>
                    </div>
                  </div>

                  {/* Additional Text with React Quill Viewer */}
                  {selectedPerfume.text &&
                    stripHtmlTags(selectedPerfume.text).trim() && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Description
                        </h4>
                        <div className="bg-blue-50 rounded-lg p-4">
                          {quillLoaded ? (
                            <ReactQuill
                              value={selectedPerfume.text}
                              readOnly={true}
                              theme="bubble"
                              modules={{ toolbar: false }}
                              className="border-0 bg-transparent"
                            />
                          ) : (
                            <div
                              className="prose max-w-none text-gray-700"
                              dangerouslySetInnerHTML={{
                                __html: selectedPerfume.text,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Created Date */}
                  {selectedPerfume.createdAt && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Added On
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {new Date(selectedPerfume.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  )}

                  {/* Stock Status */}
                  <div className={`rounded-lg p-4 ${
                    selectedPerfume.inStock 
                      ? "bg-green-50" 
                      : "bg-red-50"
                  }`}>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Stock Status
                    </h4>
                    <p className={`text-lg font-bold ${
                      selectedPerfume.inStock 
                        ? "text-green-700" 
                        : "text-red-700"
                    }`}>
                      {selectedPerfume.inStock 
                        ? "✓ Available for purchase" 
                        : "✗ Currently unavailable"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEdit(selectedPerfume);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Perfume
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleDeleteClick(selectedPerfume);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Perfume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlowRituals;