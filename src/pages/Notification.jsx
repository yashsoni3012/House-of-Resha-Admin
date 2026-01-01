// import React, { useState, useEffect, useRef } from "react";
// import {
//   Bell,
//   Package,
//   X,
//   Check,
//   Clock,
//   AlertCircle,
//   ExternalLink,
//   ShoppingBag,
//   Trash2,
// } from "lucide-react";

// const Notification = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [newOrderCount, setNewOrderCount] = useState(0);
//   const [lastOrderId, setLastOrderId] = useState(null);
//   const dropdownRef = useRef(null);
//   const notificationSound = useRef(null);

//   // Load notifications from localStorage on mount
//   useEffect(() => {
//     const savedNotifications = localStorage.getItem("orderNotifications");
//     if (savedNotifications) {
//       const parsed = JSON.parse(savedNotifications);
//       setNotifications(parsed);
      
//       // Calculate new order count (unread notifications)
//       const newCount = parsed.filter(n => !n.read).length;
//       setNewOrderCount(newCount);
//     }
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Poll for new orders every 30 seconds
//   useEffect(() => {
//     const pollOrders = async () => {
//       try {
//         const response = await fetch("https://api.houseofresha.com/orders");
//         if (!response.ok) return;
        
//         const data = await response.json();
//         const orders = data.data || data.orders || data;
        
//         if (Array.isArray(orders) && orders.length > 0) {
//           const latestOrder = orders[0];
          
//           // Check if this is a new order
//           if (latestOrder._id !== lastOrderId) {
//             setLastOrderId(latestOrder._id);
            
//             // Check if notification already exists
//             const exists = notifications.some(n => n.id === latestOrder._id);
//             if (!exists) {
//               addNewNotification(latestOrder);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error polling orders:", error);
//       }
//     };

//     // Initial poll
//     pollOrders();
    
//     // Set up interval for polling
//     const intervalId = setInterval(pollOrders, 30000); // 30 seconds
    
//     return () => clearInterval(intervalId);
//   }, [lastOrderId, notifications]);

//   const addNewNotification = (order) => {
//     const newNotification = {
//       id: order._id || Date.now(),
//       type: "new_order",
//       title: "New Order Received!",
//       message: `Order #${order._id?.substring(0, 8) || 'NEW'}`,
//       orderData: order,
//       timestamp: new Date().toISOString(),
//       read: false,
//       amount: order.amount || 0,
//       customerName: order.address?.firstName || "Customer",
//       itemsCount: order.items?.length || 0,
//     };

//     const updatedNotifications = [newNotification, ...notifications];
    
//     // Keep only last 50 notifications
//     const limitedNotifications = updatedNotifications.slice(0, 50);
    
//     setNotifications(limitedNotifications);
//     setNewOrderCount(prev => prev + 1);
    
//     // Save to localStorage
//     localStorage.setItem("orderNotifications", JSON.stringify(limitedNotifications));
    
//     // Play notification sound
//     if (notificationSound.current) {
//       notificationSound.current.currentTime = 0;
//       notificationSound.current.play().catch(() => {
//         // Sound play failed, ignore
//       });
//     }
    
//     // Show browser notification
//     if (Notification.permission === "granted") {
//       new window.Notification("New Order Received!", {
//         body: `Order #${order._id?.substring(0, 8) || 'NEW'} from ${order.address?.firstName || 'Customer'}`,
//         icon: "/favicon.ico",
//         tag: "new-order",
//       });
//     }
//   };

//   const markAsRead = (id) => {
//     const updated = notifications.map(notification =>
//       notification.id === id ? { ...notification, read: true } : notification
//     );
    
//     setNotifications(updated);
    
//     // Update new count
//     const newCount = updated.filter(n => !n.read).length;
//     setNewOrderCount(newCount);
    
//     // Save to localStorage
//     localStorage.setItem("orderNotifications", JSON.stringify(updated));
//   };

//   const markAllAsRead = () => {
//     const updated = notifications.map(notification => ({
//       ...notification,
//       read: true
//     }));
    
//     setNotifications(updated);
//     setNewOrderCount(0);
    
//     // Save to localStorage
//     localStorage.setItem("orderNotifications", JSON.stringify(updated));
//   };

//   const deleteNotification = (id) => {
//     const updated = notifications.filter(notification => notification.id !== id);
//     setNotifications(updated);
    
//     // Update new count
//     const newCount = updated.filter(n => !n.read).length;
//     setNewOrderCount(newCount);
    
//     // Save to localStorage
//     localStorage.setItem("orderNotifications", JSON.stringify(updated));
//   };

//   const clearAllNotifications = () => {
//     setNotifications([]);
//     setNewOrderCount(0);
//     localStorage.removeItem("orderNotifications");
//   };

//   const formatTimeAgo = (timestamp) => {
//     const now = new Date();
//     const past = new Date(timestamp);
//     const diffInSeconds = Math.floor((now - past) / 1000);

//     if (diffInSeconds < 60) {
//       return "Just now";
//     } else if (diffInSeconds < 3600) {
//       const minutes = Math.floor(diffInSeconds / 60);
//       return `${minutes}m ago`;
//     } else if (diffInSeconds < 86400) {
//       const hours = Math.floor(diffInSeconds / 3600);
//       return `${hours}h ago`;
//     } else {
//       const days = Math.floor(diffInSeconds / 86400);
//       return `${days}d ago`;
//     }
//   };

//   const formatPrice = (price) => {
//     const numericPrice = Number(price) || 0;
//     const hasDecimals = numericPrice % 1 !== 0;

//     return `₹${numericPrice.toLocaleString("en-IN", {
//       minimumFractionDigits: hasDecimals ? 2 : 0,
//       maximumFractionDigits: 2,
//     })}`;
//   };

//   const handleViewOrder = (orderId) => {
//     // Navigate to orders page or specific order
//     window.location.href = `/orders`;
//     setShowDropdown(false);
//   };

//   // Request notification permission on component mount
//   useEffect(() => {
//     if ("Notification" in window && Notification.permission === "default") {
//       Notification.requestPermission();
//     }
//   }, []);

//   return (
//     <>
//       {/* Notification Sound */}
//       <audio ref={notificationSound} preload="auto">
//         <source src="https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3" type="audio/mpeg" />
//       </audio>

//       {/* Bell Icon with Badge */}
//       <div className="relative" ref={dropdownRef}>
//         <button
//           onClick={() => setShowDropdown(!showDropdown)}
//           className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group"
//         >
//           <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          
//           {/* Notification Badge */}
//           {newOrderCount > 0 && (
//             <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
//               {newOrderCount > 9 ? "9+" : newOrderCount}
//             </span>
//           )}
//         </button>

//         {/* Dropdown Menu */}
//         {showDropdown && (
//           <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
//             {/* Header */}
//             <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
//                     <Bell className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-900">Notifications</h3>
//                     <p className="text-sm text-gray-600">
//                       {newOrderCount} new order{newOrderCount !== 1 ? "s" : ""}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {notifications.length > 0 && (
//                     <>
//                       <button
//                         onClick={markAllAsRead}
//                         className="text-xs text-blue-600 hover:text-blue-700 font-medium"
//                       >
//                         Mark all read
//                       </button>
//                       <button
//                         onClick={clearAllNotifications}
//                         className="text-xs text-red-600 hover:text-red-700 font-medium"
//                       >
//                         Clear all
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Notification List */}
//             <div className="max-h-96 overflow-y-auto">
//               {notifications.length > 0 ? (
//                 <div className="divide-y divide-gray-100">
//                   {notifications.map((notification) => (
//                     <div
//                       key={notification.id}
//                       className={`p-4 hover:bg-gray-50 transition-colors ${
//                         !notification.read ? "bg-blue-50/50" : ""
//                       }`}
//                     >
//                       <div className="flex gap-3">
//                         {/* Icon */}
//                         <div className="flex-shrink-0">
//                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
//                             notification.type === "new_order"
//                               ? "bg-green-100 text-green-600"
//                               : "bg-blue-100 text-blue-600"
//                           }`}>
//                             {notification.type === "new_order" ? (
//                               <ShoppingBag className="w-5 h-5" />
//                             ) : (
//                               <AlertCircle className="w-5 h-5" />
//                             )}
//                           </div>
//                         </div>

//                         {/* Content */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between gap-2 mb-1">
//                             <h4 className="font-semibold text-gray-900 text-sm">
//                               {notification.title}
//                             </h4>
//                             <div className="flex items-center gap-2">
//                               {!notification.read && (
//                                 <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
//                               )}
//                               <span className="text-xs text-gray-500">
//                                 {formatTimeAgo(notification.timestamp)}
//                               </span>
//                             </div>
//                           </div>

//                           <p className="text-sm text-gray-600 mb-2">
//                             {notification.message}
//                           </p>

//                           {/* Order Details */}
//                           {notification.type === "new_order" && (
//                             <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
//                               <div className="flex items-center justify-between mb-2">
//                                 <div className="flex items-center gap-2">
//                                   <span className="text-xs font-medium text-gray-500">
//                                     Customer:
//                                   </span>
//                                   <span className="text-sm font-semibold text-gray-900">
//                                     {notification.customerName}
//                                   </span>
//                                 </div>
//                                 <span className="text-sm font-bold text-green-600">
//                                   {formatPrice(notification.amount)}
//                                 </span>
//                               </div>
//                               <div className="flex items-center justify-between text-sm text-gray-600">
//                                 <div className="flex items-center gap-1">
//                                   <Package className="w-3 h-3" />
//                                   <span>{notification.itemsCount} item{notification.itemsCount !== 1 ? 's' : ''}</span>
//                                 </div>
//                                 <span className="text-xs font-mono">
//                                   #{notification.id.substring(0, 8)}
//                                 </span>
//                               </div>
//                             </div>
//                           )}

//                           {/* Actions */}
//                           <div className="flex items-center gap-3 pt-2">
//                             {!notification.read ? (
//                               <button
//                                 onClick={() => markAsRead(notification.id)}
//                                 className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
//                               >
//                                 <Check className="w-3 h-3" />
//                                 Mark as read
//                               </button>
//                             ) : (
//                               <span className="text-xs text-green-600 font-medium flex items-center gap-1">
//                                 <Check className="w-3 h-3" />
//                                 Read
//                               </span>
//                             )}
                            
//                             {notification.type === "new_order" && (
//                               <button
//                                 onClick={() => handleViewOrder(notification.id)}
//                                 className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
//                               >
//                                 <ExternalLink className="w-3 h-3" />
//                                 View Order
//                               </button>
//                             )}
                            
//                             <button
//                               onClick={() => deleteNotification(notification.id)}
//                               className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 ml-auto"
//                             >
//                               <Trash2 className="w-3 h-3" />
//                               Delete
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="p-8 text-center">
//                   <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                     <Bell className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <p className="text-gray-600 font-medium">No notifications</p>
//                   <p className="text-sm text-gray-500 mt-1">
//                     New orders will appear here
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             {notifications.length > 0 && (
//               <div className="p-3 border-t border-gray-100 bg-gray-50">
//                 <button
//                   onClick={() => window.location.href = "/orders"}
//                   className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
//                 >
//                   View all orders →
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Notification;