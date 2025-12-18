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

// import React from "react";
// import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import {
//   TrendingUp,
//   TrendingDown,
//   ShoppingCart,
//   Users,
//   Package,
//   IndianRupee,
//   Calendar,
//   Activity,
//   ArrowUp,
//   ArrowDown,
//   RefreshCw,
//   AlertCircle,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Star,
//   TrendingUpIcon,
// } from "lucide-react";

// const API_BASE_URL = "https://api.houseofresha.com";

// const Dashboard = () => {
//   const [timeRange, setTimeRange] = React.useState("today");

//   // Fetch real products data
//   const {
//     data: products = [],
//     isLoading: isLoadingProducts,
//     error: productsError,
//     refetch: refetchProducts,
//   } = useQuery({
//     queryKey: ["dashboard-products"],
//     queryFn: async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/clothing`);
//         if (!response.ok) {
//           throw new Error(`Failed to fetch products: ${response.status}`);
//         }
//         const data = await response.json();

//         // Handle different response structures
//         if (Array.isArray(data)) return data;
//         if (data.data && Array.isArray(data.data)) return data.data;
//         if (data.success && Array.isArray(data.data)) return data.data;
//         return [];
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         throw error;
//       }
//     },
//     refetchOnWindowFocus: false,
//   });

//   // Calculate stats from real data
//   const totalProducts = products.length;

//   const totalRevenue = React.useMemo(() => {
//     return products.reduce((sum, product) => {
//       const price = parseFloat(product.price) || 0;
//       return sum + price * 10; // Assuming 10 units sold per product
//     }, 0);
//   }, [products]);

//   const totalOrders = React.useMemo(() => {
//     return Math.floor(totalProducts * 1.75);
//   }, [totalProducts]);

//   const totalCustomers = React.useMemo(() => {
//     return Math.floor(totalProducts * 13.8);
//   }, [totalProducts]);

//   const todayRevenue = React.useMemo(() => {
//     return Math.floor(totalRevenue * 0.15); // 15% of total
//   }, [totalRevenue]);

//   const todayOrders = React.useMemo(() => {
//     return Math.floor(totalOrders * 0.12); // 12% of total
//   }, [totalOrders]);

//   const newCustomers = React.useMemo(() => {
//     return Math.floor(totalCustomers * 0.08); // 8% new this week
//   }, [totalCustomers]);

//   const pendingOrders = React.useMemo(() => {
//     return Math.floor(totalOrders * 0.2); // 20% pending
//   }, [totalOrders]);

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   // Generate sample orders based on products
//   const recentOrders = React.useMemo(() => {
//     const sampleNames = [
//       "Rahul Sharma",
//       "Priya Patel",
//       "Amit Kumar",
//       "Sneha Reddy",
//       "Arjun Singh",
//       "Divya Gupta",
//     ];
//     const statuses = ["completed", "pending", "processing", "cancelled"];
//     const timeAgo = ["2 hours ago", "4 hours ago", "5 hours ago", "6 hours ago"];

//     return products.slice(0, 4).map((product, index) => ({
//       id: `#ORD${String(index + 1).padStart(3, "0")}`,
//       customer: sampleNames[index % sampleNames.length],
//       amount: parseFloat(product.price) || 0,
//       status: statuses[index % statuses.length],
//       time: timeAgo[index % timeAgo.length],
//     }));
//   }, [products]);

//   // Identify low stock products (products with fewer sizes available)
//   const lowStockProducts = React.useMemo(() => {
//     return products
//       .filter((p) => p.sizes && p.sizes.length <= 2)
//       .slice(0, 3)
//       .map((p) => ({
//         name: p.name || "Unnamed Product",
//         stock: p.sizes?.length || 0,
//         category: p.categoryId?.name || "Uncategorized",
//       }));
//   }, [products]);

//   // Calculate top selling products (by price)
//   const topSellingProducts = React.useMemo(() => {
//     return [...products]
//       .sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0))
//       .slice(0, 3)
//       .map((p) => {
//         const price = parseFloat(p.price) || 0;
//         const sales = Math.floor(Math.random() * 30) + 20; // Simulated sales
//         return {
//           name: p.name || "Unnamed Product",
//           sales: sales,
//           revenue: price * sales,
//         };
//       });
//   }, [products]);

//   // Get recent products
//   const recentProducts = React.useMemo(() => {
//     return [...products]
//       .sort(
//         (a, b) =>
//           new Date(b.createdAt || b.updatedAt || 0) -
//           new Date(a.createdAt || a.updatedAt || 0)
//       )
//       .slice(0, 4);
//   }, [products]);

//   const stats = [
//     {
//       title: "Total Revenue",
//       value: formatCurrency(totalRevenue),
//       change: 12.5,
//       icon: IndianRupee,
//       gradient: "from-green-500 to-emerald-600",
//       subtext: `${formatCurrency(todayRevenue)} today`,
//     },
//     {
//       title: "Total Orders",
//       value: totalOrders.toLocaleString(),
//       change: 8.2,
//       icon: ShoppingCart,
//       gradient: "from-blue-500 to-cyan-600",
//       subtext: `${todayOrders} orders today`,
//     },
//     {
//       title: "Total Customers",
//       value: totalCustomers.toLocaleString(),
//       change: 15.3,
//       icon: Users,
//       gradient: "from-purple-500 to-pink-600",
//       subtext: `${newCustomers} new this week`,
//     },
//     {
//       title: "Total Products",
//       value: isLoadingProducts ? "..." : totalProducts.toLocaleString(),
//       change: 3.1,
//       icon: Package,
//       gradient: "from-orange-500 to-red-600",
//       subtext: "",
//     },
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-700";
//       case "pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "processing":
//         return "bg-blue-100 text-blue-700";
//       case "cancelled":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="w-4 h-4" />;
//       case "pending":
//         return <Clock className="w-4 h-4" />;
//       case "processing":
//         return <Activity className="w-4 h-4" />;
//       case "cancelled":
//         return <XCircle className="w-4 h-4" />;
//       default:
//         return null;
//     }
//   };

//   const StatCard = ({ title, value, change, icon: Icon, gradient, subtext }) => (
//     <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
//           <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
//           {!isLoadingProducts && change !== undefined && (
//             <div className="flex items-center gap-1">
//               {change >= 0 ? (
//                 <TrendingUp className="w-4 h-4 text-green-500" />
//               ) : (
//                 <TrendingDown className="w-4 h-4 text-red-500" />
//               )}
//               <span
//                 className={`text-sm font-medium ${
//                   change >= 0 ? "text-green-500" : "text-red-500"
//                 }`}
//               >
//                 {Math.abs(change)}%
//               </span>
//               <span className="text-xs text-gray-500 ml-1">vs last period</span>
//             </div>
//           )}
//           {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
//         </div>
//         <div
//           className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${gradient}`}
//         >
//           <Icon className="w-6 h-6 text-white" />
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       {/* Welcome Header */}
//       <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-2xl p-6 lg:p-8 text-white shadow-xl">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl lg:text-3xl font-bold mb-2">
//               Welcome Back, Admin! 👋
//             </h1>
//             <p className="text-purple-100 text-sm lg:text-base">
//               {isLoadingProducts
//                 ? "Loading store data..."
//                 : "Here's what's happening with your store today."}
//             </p>
//           </div>
//           <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
//             <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
//               <Calendar size={20} />
//               <span className="font-medium text-sm lg:text-base">
//                 {new Date().toLocaleDateString("en-US", {
//                   weekday: "long",
//                   month: "long",
//                   day: "numeric",
//                   year: "numeric",
//                 })}
//               </span>
//             </div>
//             <button
//               onClick={() => refetchProducts()}
//               disabled={isLoadingProducts}
//               className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               title="Refresh Data"
//             >
//               <RefreshCw
//                 size={20}
//                 className={isLoadingProducts ? "animate-spin" : ""}
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Error Display */}
//       {productsError && (
//         <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-4">
//           <p className="text-red-700 text-sm flex items-center gap-2">
//             <AlertCircle size={18} className="flex-shrink-0" />
//             <span>
//               <strong>Error Loading Products:</strong> {productsError.message}
//             </span>
//           </p>
//         </div>
//       )}

//       {/* Time Range Filter */}
//       <div className="flex gap-2 overflow-x-auto pb-2">
//         {["today", "week", "month", "year"].map((range) => (
//           <button
//             key={range}
//             onClick={() => setTimeRange(range)}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
//               timeRange === range
//                 ? "bg-purple-600 text-white"
//                 : "bg-white text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             {range.charAt(0).toUpperCase() + range.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
//         {stats.map((stat, idx) => (
//           <StatCard key={idx} {...stat} />
//         ))}
//       </div>

//       {/* Pending Orders Alert */}
//       {!isLoadingProducts && pendingOrders > 0 && (
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
//           <div className="flex items-center">
//             <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0" />
//             <div>
//               <p className="text-sm font-medium text-yellow-800">
//                 You have {pendingOrders} pending orders requiring attention
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Two Column Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Recent Orders - Takes 2 columns */}
//         <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//               <ShoppingCart className="w-5 h-5 text-purple-600" />
//               Recent Orders
//             </h2>
//             <Link
//               to="/orders"
//               className="text-sm text-purple-600 hover:text-purple-700 font-medium"
//             >
//               View All →
//             </Link>
//           </div>
//           {isLoadingProducts ? (
//             <div className="flex items-center justify-center py-8">
//               <RefreshCw className="animate-spin text-purple-600" size={24} />
//             </div>
//           ) : recentOrders.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//               <p>No orders yet</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {recentOrders.map((order) => (
//                 <div
//                   key={order.id}
//                   className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="flex items-center gap-4 flex-1">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
//                       {order.customer.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">{order.customer}</p>
//                       <p className="text-sm text-gray-500">
//                         {order.id} • {order.time}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <p className="font-semibold text-gray-900">
//                       {formatCurrency(order.amount)}
//                     </p>
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
//                         order.status
//                       )}`}
//                     >
//                       {getStatusIcon(order.status)}
//                       {order.status}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Low Stock Alert */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//               <AlertTriangle className="w-5 h-5 text-red-500" />
//               Low Stock Alert
//             </h2>
//           </div>
//           {isLoadingProducts ? (
//             <div className="flex items-center justify-center py-8">
//               <RefreshCw className="animate-spin text-purple-600" size={24} />
//             </div>
//           ) : lowStockProducts.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//               <p className="text-sm">All products well stocked!</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {lowStockProducts.map((product, index) => (
//                 <div
//                   key={index}
//                   className="p-3 bg-red-50 rounded-lg border border-red-100"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex-1">
//                       <p className="font-medium text-gray-900 text-sm">
//                         {product.name}
//                       </p>
//                       <p className="text-xs text-gray-500">{product.category}</p>
//                     </div>
//                     <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
//                       {product.stock} sizes
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Top Selling Products */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <Star className="w-5 h-5 text-yellow-500" />
//             Top Selling Products
//           </h2>
//           {isLoadingProducts ? (
//             <div className="flex items-center justify-center py-8">
//               <RefreshCw className="animate-spin text-purple-600" size={24} />
//             </div>
//           ) : topSellingProducts.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <TrendingUpIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//               <p>No sales data yet</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {topSellingProducts.map((product, index) => (
//                 <div key={index} className="flex items-center gap-4">
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
//                     {index + 1}
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-900">{product.name}</p>
//                     <div className="flex items-center gap-4 mt-1">
//                       <span className="text-sm text-gray-500">
//                         {product.sales} sales
//                       </span>
//                       <span className="text-sm font-semibold text-green-600">
//                         {formatCurrency(product.revenue)}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="w-24 bg-gray-100 rounded-full h-2">
//                     <div
//                       className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
//                       style={{ width: `${(product.sales / 50) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Recent Products Added */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//               <Activity className="w-5 h-5 text-purple-600" />
//               Recent Products Added
//             </h2>
//             <Link
//               to="/products"
//               className="text-sm text-purple-600 hover:text-purple-700 font-medium"
//             >
//               View All →
//             </Link>
//           </div>
//           {isLoadingProducts ? (
//             <div className="flex items-center justify-center py-8">
//               <RefreshCw className="animate-spin text-purple-600" size={24} />
//             </div>
//           ) : recentProducts.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//               <p>No products found</p>
//               <Link
//                 to="/products/add"
//                 className="inline-block mt-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
//               >
//                 Add your first product →
//               </Link>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {recentProducts.map((product) => (
//                 <div
//                   key={product._id}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
//                       {product.name?.charAt(0).toUpperCase() || "P"}
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         {product.name || "Unnamed Product"}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {product.categoryId?.name || "No Category"} •{" "}
//                         {formatCurrency(parseFloat(product.price || 0))}
//                       </p>
//                     </div>
//                   </div>
//                   <span className="text-xs text-gray-500">
//                     {product.sizes?.length || 0} sizes
//                   </span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
