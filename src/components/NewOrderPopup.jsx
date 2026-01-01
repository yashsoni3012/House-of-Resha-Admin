// import React, { useState, useEffect } from "react";
// import { Package, X, Check, ExternalLink } from "lucide-react";

// const NewOrderPopup = ({ order, onClose, onViewOrder }) => {
//   const [isVisible, setIsVisible] = useState(true);

//   useEffect(() => {
//     // Auto close after 10 seconds
//     const timer = setTimeout(() => {
//       setIsVisible(false);
//       setTimeout(onClose, 300); // Wait for animation
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, [onClose]);

//   if (!isVisible) return null;

//   const formatPrice = (price) => {
//     const numericPrice = Number(price) || 0;
//     const hasDecimals = numericPrice % 1 !== 0;

//     return `₹${numericPrice.toLocaleString("en-IN", {
//       minimumFractionDigits: hasDecimals ? 2 : 0,
//       maximumFractionDigits: 2,
//     })}`;
//   };

//   const handleClose = () => {
//     setIsVisible(false);
//     setTimeout(onClose, 300);
//   };

//   return (
//     <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top duration-300">
//       <div className="bg-white rounded-xl shadow-2xl border border-green-200 max-w-sm w-full">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-t-xl border-b border-green-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
//                 <Package className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-gray-900">New Order! 🎉</h3>
//                 <p className="text-sm text-gray-600">
//                   Order received successfully
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={handleClose}
//               className="p-1 hover:bg-green-100 rounded-lg transition-colors"
//             >
//               <X className="w-4 h-4 text-gray-500" />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <div className="mb-4">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-gray-600">
//                 Order ID:
//               </span>
//               <span className="text-sm font-mono text-gray-900">
//                 #{order._id?.substring(0, 8) || "NEW"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-gray-600">
//                 Customer:
//               </span>
//               <span className="text-sm font-semibold text-gray-900">
//                 {order.address?.firstName || "Customer"}
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium text-gray-600">
//                 Amount:
//               </span>
//               <span className="text-lg font-bold text-green-600">
//                 {formatPrice(order.amount)}
//               </span>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-2">
//             <button
//               onClick={() => {
//                 onViewOrder();
//                 handleClose();
//               }}
//               className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
//             >
//               <ExternalLink className="w-4 h-4" />
//               View Order
//             </button>
//             <button
//               onClick={handleClose}
//               className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
//             >
//               <Check className="w-4 h-4" />
//               Dismiss
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewOrderPopup;