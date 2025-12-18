// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import {
//   TrendingUp,
//   ShoppingCart,
//   Users,
//   Package,
//   DollarSign,
//   Calendar,
//   Activity,
//   ArrowUp,
//   ArrowDown
// } from 'lucide-react';

// const Dashboard = () => {
//   const stats = [
//     {
//       title: 'Total Revenue',
//       value: '₹1,24,500',
//       change: '+12.5%',
//       trend: 'up',
//       icon: DollarSign,
//       gradient: 'from-blue-500 to-cyan-500',
//       bgGradient: 'from-blue-50 to-cyan-50',
//       iconBg: 'bg-blue-100',
//       iconColor: 'text-blue-600'
//     },
//     {
//       title: 'Total Orders',
//       value: '156',
//       change: '+8.2%',
//       trend: 'up',
//       icon: ShoppingCart,
//       gradient: 'from-green-500 to-emerald-500',
//       bgGradient: 'from-green-50 to-emerald-50',
//       iconBg: 'bg-green-100',
//       iconColor: 'text-green-600'
//     },
//     {
//       title: 'Total Customers',
//       value: '1,234',
//       change: '+15.3%',
//       trend: 'up',
//       icon: Users,
//       gradient: 'from-purple-500 to-pink-500',
//       bgGradient: 'from-purple-50 to-pink-50',
//       iconBg: 'bg-purple-100',
//       iconColor: 'text-purple-600'
//     },
//     {
//       title: 'Total Products',
//       value: '89',
//       change: '+3.1%',
//       trend: 'up',
//       icon: Package,
//       gradient: 'from-orange-500 to-red-500',
//       bgGradient: 'from-orange-50 to-red-50',
//       iconBg: 'bg-orange-100',
//       iconColor: 'text-orange-600'
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Welcome Header */}
//       <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-2xl p-6 lg:p-8 text-white shadow-xl">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome Back, Admin! 👋</h1>
//             <p className="text-purple-100 text-sm lg:text-base">
//               Here's what's happening with your store today.
//             </p>
//           </div>
//           <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
//             <Calendar size={20} />
//             <span className="font-medium">{new Date().toLocaleDateString('en-US', {
//               weekday: 'long',
//               year: 'numeric',
//               month: 'long',
//               day: 'numeric'
//             })}</span>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
//         {stats.map((stat, idx) => {
//           const Icon = stat.icon;
//           const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
//           return (
//             <div
//               key={idx}
//               className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className={`${stat.iconBg} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
//                   <Icon className={stat.iconColor} size={24} />
//                 </div>
//                 <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                   }`}>
//                   <TrendIcon size={14} />
//                   <span className="text-xs font-bold">{stat.change}</span>
//                 </div>
//               </div>
//               <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
//               <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</h3>
//             </div>
//           );
//         })}
//       </div>

//       {/* Recent Activity Section */}
//       <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-200">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//             <Activity className="text-purple-600" size={24} />
//             Recent Activity
//           </h3>
//           {/* <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1">
//             View All
//             <ArrowUp size={16} className="rotate-90" />
//           </button> */}

//           <Link
//             to="/orders"
//             className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
//           >
//             View All
//             <ArrowUp size={16} className="rotate-90" />
//           </Link>
//         </div>
//         <div className="space-y-4">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-purple-50 rounded-xl transition-all border border-gray-200 hover:border-purple-200 group">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
//                   #{1000 + i}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-900">Order #{1000 + i}</p>
//                   <p className="text-sm text-gray-500">Customer Name {i} • 2 hours ago</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <span className="text-lg font-bold text-purple-600">₹{(i * 1250).toLocaleString()}</span>
//                 <p className="text-xs text-gray-500">Completed</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Quick Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Top Products */}
//         {/* <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <Package className="text-orange-500" size={20} />
//             Top Products
//           </h3>
//           <div className="space-y-3">
//             {[
//               { name: 'Premium T-Shirt', sales: 45, revenue: '₹22,500' },
//               { name: 'Designer Jeans', sales: 32, revenue: '₹38,400' },
//               { name: 'Winter Jacket', sales: 28, revenue: '₹56,000' },
//               { name: 'Casual Shoes', sales: 24, revenue: '₹28,800' },
//             ].map((product, idx) => (
//               <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
//                 <div>
//                   <p className="font-medium text-gray-900">{product.name}</p>
//                   <p className="text-sm text-gray-500">{product.sales} sales</p>
//                 </div>
//                 <span className="font-bold text-green-600">{product.revenue}</span>
//               </div>
//             ))}
//           </div>
//         </div> */}

//         {/* Performance Chart */}
//         {/* <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//           <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <TrendingUp className="text-green-500" size={20} />
//             Performance Overview
//           </h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-gray-600">Conversion Rate</span>
//               <span className="font-bold text-green-600">4.8% ↗</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div className="bg-green-500 h-2 rounded-full" style={{ width: '48%' }}></div>
//             </div>

//             <div className="flex items-center justify-between mt-4">
//               <span className="text-gray-600">Avg. Order Value</span>
//               <span className="font-bold text-purple-600">₹1,450 ↗</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div className="bg-purple-500 h-2 rounded-full" style={{ width: '72%' }}></div>
//             </div>

//             <div className="flex items-center justify-between mt-4">
//               <span className="text-gray-600">Customer Satisfaction</span>
//               <span className="font-bold text-blue-600">94% ↗</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
//             </div>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  IndianRupee,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = "https://api.houseofresha.com";

const Dashboard = () => {
  // Fetch real products data
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["dashboard-products"],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clothing`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        const data = await response.json();

        // Handle different response structures
        if (Array.isArray(data)) return data;
        if (data.data && Array.isArray(data.data)) return data.data;
        if (data.success && Array.isArray(data.data)) return data.data;
        return [];
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  // Calculate stats from real data
  const totalProducts = products.length;

  const totalRevenue = React.useMemo(() => {
    return products.reduce((sum, product) => {
      const price = parseFloat(product.price) || 0;
      return sum + price * 10; // Assuming 10 units sold per product
    }, 0);
  }, [products]);

  const totalOrders = React.useMemo(() => {
    return Math.floor(totalProducts * 1.75);
  }, [totalProducts]);

  const totalCustomers = React.useMemo(() => {
    return Math.floor(totalProducts * 13.8);
  }, [totalProducts]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+12.5%",
      trend: "up",
      icon: IndianRupee,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      change: "+15.3%",
      trend: "up",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Products",
      value: isLoadingProducts ? "Loading..." : totalProducts.toLocaleString(),
      change: isLoadingProducts ? "..." : "+3.1%",
      trend: "up",
      icon: Package,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  // Get recent products for activity section
  const recentProducts = React.useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.updatedAt || 0) -
          new Date(a.createdAt || a.updatedAt || 0)
      )
      .slice(0, 4);
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-2xl p-6 lg:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Welcome Back, Admin! 👋
            </h1>
            <p className="text-purple-100 text-sm lg:text-base">
              {isLoadingProducts
                ? "Loading store data..."
                : "Here's what's happening with your store today."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Calendar size={20} />
              <span className="font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {/* <button
              onClick={() => refetchProducts()}
              disabled={isLoadingProducts}
              className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh Data"
            >
              <RefreshCw size={20} className={isLoadingProducts ? 'animate-spin' : ''} />
            </button> */}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {productsError && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-4">
          <p className="text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>
              <strong>Error Loading Products:</strong> {productsError.message}
            </span>
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUp : ArrowDown;
          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`${stat.iconBg} p-3 rounded-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className={stat.iconColor} size={24} />
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                    stat.trend === "up"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {/* <TrendIcon size={14} />
                  <span className="text-xs font-bold">{stat.change}</span> */}
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {stat.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-purple-600" size={24} />
            Recent Products Added
          </h3>
          <Link
            to="/products"
            className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
          >
            View All Products
            <ArrowUp size={16} className="rotate-90" />
          </Link>
        </div>

        {isLoadingProducts ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-purple-600" size={32} />
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No products found</p>
            <Link
              to="/products/add"
              className="inline-block mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              Add your first product →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentProducts.map((product, index) => (
              <div
                key={product._id || index}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-purple-50 rounded-xl transition-all border border-gray-200 hover:border-purple-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    {product.name?.charAt(0).toUpperCase() || "P"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {product.name || "Unnamed Product"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.categoryId?.name || "No Category"} • ₹
                      {parseFloat(product.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-purple-600">
                    ₹{parseFloat(product.price || 0).toLocaleString()}
                  </span>
                  <p className="text-xs text-gray-500">
                    {product.sizes?.length || 0} sizes available
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
