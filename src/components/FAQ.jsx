// import React, { useState, useEffect, useRef } from "react";

// const FAQAdmin = () => {
//   const [faqs, setFaqs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [formData, setFormData] = useState({ question: "", answer: "" });
//   const [actionLoading, setActionLoading] = useState(false);
//   const [expandedId, setExpandedId] = useState(null);
//   const [notification, setNotification] = useState({
//     show: false,
//     type: "",
//     message: "",
//   });
//   const [deleteModal, setDeleteModal] = useState({
//     show: false,
//     faqId: null,
//     faqQuestion: "",
//   });

//   const addFormRef = useRef(null);
//   const API_URL = "https://api.houseofresha.com/faq";

//   // Show notification
//   const showNotification = (type, message) => {
//     setNotification({ show: true, type, message });
//     setTimeout(
//       () => setNotification({ show: false, type: "", message: "" }),
//       3000,
//     );
//   };

//   // Open delete confirmation modal
//   const openDeleteModal = (id, question) => {
//     setDeleteModal({
//       show: true,
//       faqId: id,
//       faqQuestion: question,
//     });
//   };

//   // Close delete modal
//   const closeDeleteModal = () => {
//     setDeleteModal({
//       show: false,
//       faqId: null,
//       faqQuestion: "",
//     });
//   };

//   // Fetch FAQs from API
//   const fetchFAQs = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(API_URL);

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();

//       // Handle your specific API response format
//       if (data && Array.isArray(data.data)) {
//         const sortedFaqs = [...data.data].sort(
//           (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
//         );
//         setFaqs(sortedFaqs);
//       }
//     } catch (err) {
//       setError(err.message);
//       setFaqs([]);
//       console.error("Error fetching FAQs:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFAQs();
//   }, []);

//   // Listen for toggle event from header
//   useEffect(() => {
//     const handleToggleAddForm = () => {
//       setShowAddForm(!showAddForm);
//       setEditingId(null);
//       setExpandedId(null);

//       // Scroll to form when shown
//       if (!showAddForm && addFormRef.current) {
//         setTimeout(() => {
//           addFormRef.current.scrollIntoView({
//             behavior: "smooth",
//             block: "start",
//           });
//         }, 100);
//       }
//     };

//     window.addEventListener("toggle-add-faq-form", handleToggleAddForm);

//     return () => {
//       window.removeEventListener("toggle-add-faq-form", handleToggleAddForm);
//     };
//   }, [showAddForm]);

//   // Add new FAQ
//   const handleAddFAQ = async () => {
//     if (!formData.question.trim() || !formData.answer.trim()) {
//       showNotification("error", "Please fill in both question and answer");
//       return;
//     }

//     try {
//       setActionLoading(true);

//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to add FAQ. Status: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.success) {
//         await fetchFAQs(); // Refresh the list
//         setFormData({ question: "", answer: "" });
//         setShowAddForm(false);
//         showNotification("success", "FAQ added successfully!");
//       } else {
//         throw new Error(result.message || "Failed to add FAQ");
//       }
//     } catch (err) {
//       showNotification("error", `Error: ${err.message}`);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Update FAQ
//   const handleUpdateFAQ = async (id) => {
//     const faqToUpdate = faqs.find((faq) => faq._id === id);

//     if (!faqToUpdate) {
//       showNotification("error", "FAQ not found");
//       return;
//     }

//     if (!faqToUpdate.question.trim() || !faqToUpdate.answer.trim()) {
//       showNotification("error", "Question and answer cannot be empty");
//       return;
//     }

//     try {
//       setActionLoading(true);

//       const response = await fetch(`${API_URL}/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           question: faqToUpdate.question,
//           answer: faqToUpdate.answer,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to update FAQ. Status: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.success) {
//         await fetchFAQs(); // Refresh the list
//         setEditingId(null);
//         showNotification("success", "FAQ updated successfully!");
//       } else {
//         throw new Error(result.message || "Failed to update FAQ");
//       }
//     } catch (err) {
//       showNotification("error", `Error: ${err.message}`);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Delete FAQ
//   const handleDeleteFAQ = async () => {
//     const { faqId } = deleteModal;

//     if (!faqId) {
//       closeDeleteModal();
//       return;
//     }

//     try {
//       setActionLoading(true);

//       const response = await fetch(`${API_URL}/${faqId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to delete FAQ. Status: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.success) {
//         await fetchFAQs(); // Refresh the list
//         showNotification("success", "FAQ deleted successfully!");
//         closeDeleteModal();
//       } else {
//         throw new Error(result.message || "Failed to delete FAQ");
//       }
//     } catch (err) {
//       showNotification("error", `Error: ${err.message}`);
//       closeDeleteModal();
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Start editing a FAQ
//   const startEdit = (id) => {
//     setEditingId(id);
//     setShowAddForm(false);
//     setExpandedId(null);
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     setEditingId(null);
//     fetchFAQs(); // Reset to original data
//   };

//   // Update FAQ field while editing
//   const updateFAQField = (id, field, value) => {
//     setFaqs((prevFaqs) =>
//       prevFaqs.map((faq) =>
//         faq._id === id ? { ...faq, [field]: value } : faq,
//       ),
//     );
//   };

//   // Toggle answer expansion
//   const toggleExpand = (id) => {
//     setExpandedId((prev) => (prev === id ? null : id));
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch (error) {
//       return "Invalid date";
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           <p className="mt-4 text-gray-600 font-medium">Loading FAQs...</p>
//           {/* <p className="text-sm text-gray-500">Fetching data from {API_URL}</p> */}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Delete Confirmation Modal */}
//       {deleteModal.show && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all">
//             <div className="p-4 sm:p-6">
//               {/* Modal Header */}
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
//                   <svg
//                     className="w-5 h-5 sm:w-6 sm:h-6 text-red-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
//                     />
//                   </svg>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-800">
//                     Delete FAQ
//                   </h3>
//                   <p className="text-xs sm:text-sm text-gray-600">
//                     This action cannot be undone
//                   </p>
//                 </div>
//               </div>

//               {/* Modal Content */}
//               <div className="mb-5 sm:mb-6">
//                 <p className="text-sm sm:text-base text-gray-700 mb-2">
//                   Are you sure you want to delete this FAQ?
//                 </p>
//                 <div className="bg-red-50 border border-red-100 rounded-lg p-3">
//                   <p className="text-xs sm:text-sm font-medium text-red-800 mb-1">
//                     Question:
//                   </p>
//                   <p className="text-sm sm:text-base text-red-700 break-words line-clamp-2">
//                     {deleteModal.faqQuestion}
//                   </p>
//                 </div>
//                 <p className="text-xs sm:text-sm text-gray-500 mt-3">
//                   This FAQ will be permanently removed from the system.
//                 </p>
//               </div>

//               {/* Modal Actions */}
//               <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
//                 <button
//                   onClick={closeDeleteModal}
//                   disabled={actionLoading}
//                   className="w-full sm:flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-colors text-sm sm:text-base"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteFAQ}
//                   disabled={actionLoading}
//                   className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
//                 >
//                   {actionLoading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                       Delete
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Notification */}
//       {notification.show && (
//         <div
//           className={`fixed top-4 right-4 z-40 px-6 py-3 rounded-lg shadow-lg max-w-md ${
//             notification.type === "success"
//               ? "bg-green-50 border border-green-200 text-green-800"
//               : "bg-red-50 border border-red-200 text-red-800"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <div
//               className={`w-3 h-3 rounded-full ${
//                 notification.type === "success" ? "bg-green-500" : "bg-red-500"
//               }`}
//             ></div>
//             <p>{notification.message}</p>
//           </div>
//         </div>
//       )}

//       <div className="max-w-6xl mx-auto">
//         {/* Stats Header - Removed the old Add button */}
//         <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
//             {/* Left side - Stats */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
//               <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-md whitespace-nowrap">
//                 {faqs.length} FAQ{faqs.length !== 1 ? "s" : ""} found
//               </span>
//               {faqs.length > 0 && (
//                 <span className="text-xs sm:text-sm text-gray-600">
//                   Click the "Edit" button on any FAQ to modify it
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
//             <div className="flex items-start gap-3">
//               <svg
//                 className="w-6 h-6 text-red-500 flex-shrink-0 mt-1"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <div>
//                 <h3 className="text-lg font-semibold text-red-800 mb-1">
//                   Error Loading FAQs
//                 </h3>
//                 <p className="text-red-700 mb-3">{error}</p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={fetchFAQs}
//                     className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
//                   >
//                     Try Again
//                   </button>
//                   <a
//                     href={API_URL}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm font-medium"
//                   >
//                     Open API
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Add FAQ Form */}
//         {showAddForm && (
//           <div
//             ref={addFormRef}
//             className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6 border border-blue-200"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
//                 Add New FAQ
//               </h3>
//               <button
//                 onClick={() => setShowAddForm(false)}
//                 className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
//                 aria-label="Close form"
//               >
//                 <svg
//                   className="w-5 h-5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="space-y-3 sm:space-y-4">
//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                   Question <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.question}
//                   onChange={(e) =>
//                     setFormData({ ...formData, question: e.target.value })
//                   }
//                   className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   placeholder="Enter the question"
//                   disabled={actionLoading}
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                   Answer <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={formData.answer}
//                   onChange={(e) =>
//                     setFormData({ ...formData, answer: e.target.value })
//                   }
//                   rows={4}
//                   className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
//                   placeholder="Enter the answer"
//                   disabled={actionLoading}
//                 />
//               </div>
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
//                 <button
//                   onClick={handleAddFAQ}
//                   disabled={
//                     actionLoading ||
//                     !formData.question.trim() ||
//                     !formData.answer.trim()
//                   }
//                   className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
//                 >
//                   {actionLoading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M5 13l4 4L19 7"
//                         />
//                       </svg>
//                       Save FAQ
//                     </>
//                   )}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowAddForm(false);
//                     setFormData({ question: "", answer: "" });
//                   }}
//                   disabled={actionLoading}
//                   className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-colors text-sm sm:text-base"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* FAQ List */}
//         <div className="space-y-4">
//           {!error && faqs.length === 0 ? (
//             <div className="bg-white rounded-xl shadow p-12 text-center">
//               <svg
//                 className="w-16 h-16 text-gray-300 mx-auto mb-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">
//                 No FAQs Found
//               </h3>
//               <p className="text-gray-500 mb-6">
//                 Click "Add New FAQ" button in the header to get started
//               </p>
//               <button
//                 onClick={() => {
//                   const event = new CustomEvent("toggle-add-faq-form");
//                   window.dispatchEvent(event);
//                 }}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
//               >
//                 Add Your First FAQ
//               </button>
//             </div>
//           ) : (
//             faqs.map((faq, index) => {
//               const isEditing = editingId === faq._id;
//               const isExpanded = expandedId === faq._id;
//               const isLongAnswer = faq.answer.length > 200;

//               return (
//                 <div
//                   key={faq._id}
//                   className={`bg-white rounded-xl shadow overflow-hidden ${
//                     isEditing ? "ring-2 ring-blue-500" : ""
//                   }`}
//                 >
//                   <div className="p-4 sm:p-6">
//                     <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
//                       {/* Left side - Serial number and content */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start gap-3 sm:gap-4">
//                           {/* Serial Number */}
//                           <div className="flex-shrink-0">
//                             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
//                               {index + 1}
//                             </div>
//                           </div>

//                           {/* Content */}
//                           <div className="flex-1 min-w-0">
//                             {/* Question */}
//                             <div className="mb-3 sm:mb-4">
//                               <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
//                                 Question
//                               </div>
//                               {isEditing ? (
//                                 <input
//                                   type="text"
//                                   value={faq.question}
//                                   onChange={(e) =>
//                                     updateFAQField(
//                                       faq._id,
//                                       "question",
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold"
//                                   placeholder="Enter question"
//                                   disabled={actionLoading}
//                                 />
//                               ) : (
//                                 <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 break-words">
//                                   {faq.question}
//                                 </h3>
//                               )}
//                             </div>

//                             {/* Answer */}
//                             <div className="mb-3 sm:mb-4">
//                               <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
//                                 Answer
//                               </div>
//                               {isEditing ? (
//                                 <textarea
//                                   value={faq.answer}
//                                   onChange={(e) =>
//                                     updateFAQField(
//                                       faq._id,
//                                       "answer",
//                                       e.target.value,
//                                     )
//                                   }
//                                   rows={4}
//                                   className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
//                                   placeholder="Enter answer"
//                                   disabled={actionLoading}
//                                 />
//                               ) : (
//                                 <div className="relative">
//                                   <div
//                                     className={`text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-wrap break-words ${
//                                       isLongAnswer && !isExpanded
//                                         ? "max-h-20 sm:max-h-24 md:max-h-32 overflow-hidden"
//                                         : ""
//                                     }`}
//                                   >
//                                     {faq.answer}
//                                   </div>
//                                   {isLongAnswer && !isEditing && (
//                                     <button
//                                       onClick={() => toggleExpand(faq._id)}
//                                       className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium mt-2 flex items-center gap-1 transition-colors"
//                                     >
//                                       {isExpanded ? (
//                                         <>
//                                           <svg
//                                             className="w-3.5 h-3.5 sm:w-4 sm:h-4"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                           >
//                                             <path
//                                               strokeLinecap="round"
//                                               strokeLinejoin="round"
//                                               strokeWidth={2}
//                                               d="M5 15l7-7 7 7"
//                                             />
//                                           </svg>
//                                           Show Less
//                                         </>
//                                       ) : (
//                                         <>
//                                           <svg
//                                             className="w-3.5 h-3.5 sm:w-4 sm:h-4"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                           >
//                                             <path
//                                               strokeLinecap="round"
//                                               strokeLinejoin="round"
//                                               strokeWidth={2}
//                                               d="M19 9l-7 7-7-7"
//                                             />
//                                           </svg>
//                                           Read More
//                                         </>
//                                       )}
//                                     </button>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Right side - Edit/Delete buttons */}
//                       <div className="w-full lg:w-auto lg:min-w-[140px]">
//                         {isEditing ? (
//                           <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
//                             <button
//                               onClick={() => handleUpdateFAQ(faq._id)}
//                               disabled={
//                                 actionLoading ||
//                                 !faq.question.trim() ||
//                                 !faq.answer.trim()
//                               }
//                               className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
//                             >
//                               {actionLoading ? (
//                                 <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
//                               ) : (
//                                 <>
//                                   <svg
//                                     className="w-4 h-4"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                   >
//                                     <path
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                       strokeWidth={2}
//                                       d="M5 13l4 4L19 7"
//                                     />
//                                   </svg>
//                                   Save
//                                 </>
//                               )}
//                             </button>
//                             <button
//                               onClick={cancelEdit}
//                               disabled={actionLoading}
//                               className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
//                             >
//                               <svg
//                                 className="w-4 h-4"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M6 18L18 6M6 6l12 12"
//                                 />
//                               </svg>
//                               Cancel
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
//                             <button
//                               onClick={() => startEdit(faq._id)}
//                               className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-3 sm:py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
//                             >
//                               <svg
//                                 className="w-4 h-4"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                                 />
//                               </svg>
//                               Edit
//                             </button>
//                             <button
//                               onClick={() =>
//                                 openDeleteModal(faq._id, faq.question)
//                               }
//                               disabled={actionLoading}
//                               className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
//                             >
//                               <svg
//                                 className="w-4 h-4"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                                 />
//                               </svg>
//                               Delete
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FAQAdmin;


import React from 'react'

const FAQ = () => {
  return (
    <div>
      faq page
    </div>
  )
}

export default FAQ
