// import React from 'react';

// const Orders = () => {
//   const orders = [
//     { id: '#1234', customer: 'Priya Sharma', date: '2024-11-28', amount: '₹15,999', status: 'Delivered' },
//     { id: '#1235', customer: 'Amit Patel', date: '2024-11-28', amount: '₹8,499', status: 'Processing' },
//     { id: '#1236', customer: 'Sneha Reddy', date: '2024-11-27', amount: '₹25,999', status: 'Shipped' },
//     { id: '#1237', customer: 'Mahipal Singh', date: '2024-11-27', amount: '₹3,999', status: 'Pending' },
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       <div className="p-4 lg:p-6 border-b">
//         <h3 className="text-lg font-semibold">Recent Orders</h3>
//       </div>
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
//               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
//               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
//               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//               <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {orders.map((order) => (
//               <tr key={order.id} className="hover:bg-gray-50">
//                 <td className="px-4 lg:px-6 py-4 text-sm font-medium text-purple-600">{order.id}</td>
//                 <td className="px-4 lg:px-6 py-4 text-sm text-gray-800">{order.customer}</td>
//                 <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{order.date}</td>
//                 <td className="px-4 lg:px-6 py-4 text-sm font-semibold text-gray-800">{order.amount}</td>
//                 <td className="px-4 lg:px-6 py-4">
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
//                     order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
//                     order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-gray-100 text-gray-800'
//                   }`}>
//                     {order.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Orders;

import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  ChevronRight,
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  CreditCard,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://api.houseofresha.com/orders");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Check if data is an array
      if (Array.isArray(data)) {
        setOrders(data);
      }
      // Check if data has a data property that is an array
      else if (data.data && Array.isArray(data.data)) {
        setOrders(data.data);
      }
      // Check if data has an orders property that is an array
      else if (data.orders && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
      // Check for common API response patterns
      else if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
      // If no array found, set empty array
      else {
        console.warn("Unexpected API response structure:", data);
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
      setOrders([]); // Ensure orders is always an array
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatPrice = (price) => {
    try {
      const numericPrice = Number(price) || 0;

      const hasDecimals = numericPrice % 1 !== 0;

      return `₹${numericPrice.toLocaleString("en-IN", {
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: 2,
      })}`;
    } catch (error) {
      return "₹0";
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "cancelled":
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    if (!status) return "UNKNOWN";
    return status.toUpperCase();
  };

  const OrderModal = ({ order, onClose }) => {
    if (!order) return null;

    // Safe access to order properties
    const orderId = order._id || order.id || "N/A";
    const paymentStatus = order.paymentStatus || order.status || "pending";
    const amount = order.amount || order.totalAmount || 0;
    const createdAt = order.createdAt || order.date || new Date().toISOString();
    const items = order.items || [];
    const address = order.address || {};
    const user = order.userId || {};
    const razorpay = order.razorpay || {};

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Order Details
              </h2>
              <p className="text-sm text-gray-500 font-mono mt-1 truncate max-w-md">
                {orderId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Order Status & Amount */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      paymentStatus
                    )}`}
                  >
                    {getStatusText(paymentStatus)}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(amount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                <Clock className="w-4 h-4" />
                Placed on {formatDate(createdAt)}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Items ({items.length})
              </h3>
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item, idx) => {
                    const product = item.productId || {};
                    const productName = product.name || "Unnamed Product";
                    const productImage = product.images
                      ? `https://api.houseofresha.com${product.images}`
                      : null;
                    const itemPrice = item.price || 0;
                    const itemQuantity = item.quantity || 1;
                    const itemSize = item.size || "One Size";

                    return (
                      <div
                        key={idx}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-shrink-0 w-24 h-24 bg-white rounded-lg overflow-hidden border">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={productName}
                              className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {productName}
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-sm bg-white px-3 py-1 rounded-full border">
                              Size: {itemSize}
                            </span>
                            <span className="text-sm bg-white px-3 py-1 rounded-full border">
                              Quantity: {itemQuantity}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(itemPrice * itemQuantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No items in this order</p>
                </div>
              )}
            </div>

            {/* Shipping Address */}
            {address && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h3>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-900 text-lg">
                    {address.firstName || ""} {address.lastName || ""}
                  </p>
                  <p className="text-gray-700 mt-3 leading-relaxed">
                    {address.addressLine1}
                    <br />
                    {address.addressLine2 && (
                      <>
                        {address.addressLine2}
                        <br />
                      </>
                    )}
                    {address.city || ""}, {address.state || ""} -{" "}
                    {address.postCode || ""}
                    <br />
                    {address.country || ""}
                  </p>
                  {address.phone && (
                    <div className="flex items-center gap-2 mt-4 text-gray-700">
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">{address.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customer Info */}
            {user.email && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-900">
                    {user.firstName || ""} {user.lastName || ""}
                  </p>
                  <p className="text-gray-700 mt-2">{user.email}</p>
                  {user.mobile && (
                    <p className="text-gray-700 mt-1">{user.mobile}</p>
                  )}
                </div>
              </div>
            )}

            {/* Payment Details */}
            {razorpay.paymentId && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </h3>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 font-mono text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="text-gray-900 font-semibold truncate">
                      {razorpay.paymentId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="text-gray-900 font-semibold truncate">
                      {razorpay.orderId || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Error loading orders</h3>
              <p className="text-gray-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">No orders found</h2>
          <p className="text-gray-600 mt-2">
            Your order history will appear here
          </p>
          <button
            onClick={fetchOrders}
            className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Orders
              </h1>
              <p className="text-gray-600 mt-1">
                {orders.length} order{orders.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <button
              onClick={fetchOrders}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {orders.map((order) => {
              // Safe access to order properties
              const orderId = order._id || order.id || "N/A";
              const paymentStatus =
                order.paymentStatus || order.status || "pending";
              const amount = order.amount || order.totalAmount || 0;
              const createdAt =
                order.createdAt || order.date || new Date().toISOString();
              const items = order.items || [];

              return (
                <div
                  key={orderId}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-sm font-mono text-gray-600 truncate">
                          {orderId}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            paymentStatus
                          )}`}
                        >
                          {getStatusText(paymentStatus)}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">
                          {items.length} item{items.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDate(createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(amount)}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
