// import React, { useState } from "react";
// import { Save, Upload, X, Plus, Edit, ImageIcon } from "lucide-react";

// export default function BlogPostManager() {
//   const [mode, setMode] = useState("post");
//   const [blogId, setBlogId] = useState("");
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     content: [""],
//     coverImage: null,
//     sliderImages: [],
//   });
//   const [replaceIndices, setReplaceIndices] = useState({
//     coverImage: false,
//     sliderImages: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleContentChange = (index, value) => {
//     const newContent = [...formData.content];
//     newContent[index] = value;
//     setFormData((prev) => ({ ...prev, content: newContent }));
//   };

//   const addContentParagraph = () => {
//     setFormData((prev) => ({ ...prev, content: [...prev.content, ""] }));
//   };

//   const removeContentParagraph = (index) => {
//     const newContent = formData.content.filter((_, i) => i !== index);
//     setFormData((prev) => ({ ...prev, content: newContent }));
//   };

//   const handleCoverImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, coverImage: file }));
//       if (mode === "patch") {
//         setReplaceIndices((prev) => ({ ...prev, coverImage: true }));
//       }
//     }
//   };

//   const handleSliderImageChange = (e, index = null) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (mode === "patch" && index !== null) {
//         // Replace specific index
//         const newSliderImages = [...formData.sliderImages];
//         newSliderImages[index] = { file, replaceIndex: index };
//         setFormData((prev) => ({ ...prev, sliderImages: newSliderImages }));

//         const newReplaceIndices = [...replaceIndices.sliderImages];
//         newReplaceIndices[index] = true;
//         setReplaceIndices((prev) => ({
//           ...prev,
//           sliderImages: newReplaceIndices,
//         }));
//       } else {
//         // Add new image
//         setFormData((prev) => ({
//           ...prev,
//           sliderImages: [...prev.sliderImages, { file, replaceIndex: null }],
//         }));
//       }
//     }
//   };

//   const addSliderImageSlot = () => {
//     setFormData((prev) => ({
//       ...prev,
//       sliderImages: [...prev.sliderImages, null],
//     }));
//   };

//   const removeSliderImage = (index) => {
//     const newSliderImages = formData.sliderImages.filter((_, i) => i !== index);
//     setFormData((prev) => ({ ...prev, sliderImages: newSliderImages }));

//     const newReplaceIndices = replaceIndices.sliderImages.filter(
//       (_, i) => i !== index
//     );
//     setReplaceIndices((prev) => ({ ...prev, sliderImages: newReplaceIndices }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.title.trim()) {
//       setError("Title is required");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setResponse(null);

//     try {
//       const formDataToSend = new FormData();

//       formDataToSend.append("title", formData.title);
//       formDataToSend.append("description", formData.description);

//       const validContent = formData.content.filter((c) => c.trim());
//       formDataToSend.append("content", JSON.stringify(validContent));

//       if (formData.coverImage) {
//         if (mode === "patch" && replaceIndices.coverImage) {
//           formDataToSend.append("coverImageIndex", "0");
//         }
//         formDataToSend.append("coverImage", formData.coverImage);
//       }

//       formData.sliderImages.forEach((item, index) => {
//         if (item && item.file) {
//           formDataToSend.append("sliderImages", item.file);
//           if (mode === "patch" && item.replaceIndex !== null) {
//             formDataToSend.append(
//               `sliderImageIndex_${index}`,
//               item.replaceIndex.toString()
//             );
//           }
//         }
//       });

//       const url =
//         mode === "post"
//           ? "https://api.houseofresha.com/blogs"
//           : `https://api.houseofresha.com/blogs/${blogId}`;

//       const options = {
//         method: mode === "post" ? "POST" : "PATCH",
//         body: formDataToSend,
//         // Do NOT set Content-Type manually for FormData
//         // headers: { "Content-Type": "multipart/form-data" },  // ❌
//       };

//       const res = await fetch(url, options);

//       // Read as text first so we can handle non‑JSON responses safely
//       const text = await res.text();

//       let data;
//       try {
//         data = text ? JSON.parse(text) : null;
//       } catch (e) {
//         // Backend did not return JSON (probably HTML error page)
//         console.error("Non-JSON response from server:", text);
//         throw new Error(
//           `Server did not return JSON. Status ${res.status}. Body: ${text.slice(
//             0,
//             200
//           )}`
//         );
//       }

//       if (!res.ok) {
//         throw new Error(
//           (data && data.message) || `Request failed with status ${res.status}`
//         );
//       }

//       setResponse(data);

//       if (mode === "post") {
//         setFormData({
//           title: "",
//           description: "",
//           content: [""],
//           coverImage: null,
//           sliderImages: [],
//         });
//       }
//     } catch (err) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       content: [""],
//       coverImage: null,
//       sliderImages: [],
//     });
//     setBlogId("");
//     setResponse(null);
//     setError(null);
//     setReplaceIndices({
//       coverImage: false,
//       sliderImages: [],
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-6 lg:p-8">
//       <div className="max-w-5xl mx-auto">
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
//                 Blog Post Manager
//               </h1>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => {
//                     setMode("post");
//                     resetForm();
//                   }}
//                   className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                     mode === "post"
//                       ? "bg-white text-indigo-600 shadow-lg"
//                       : "bg-indigo-500 text-white hover:bg-indigo-400"
//                   }`}
//                 >
//                   Create New
//                 </button>
//                 <button
//                   onClick={() => {
//                     setMode("patch");
//                     resetForm();
//                   }}
//                   className={`px-4 py-2 rounded-lg font-medium transition-all ${
//                     mode === "patch"
//                       ? "bg-white text-purple-600 shadow-lg"
//                       : "bg-purple-500 text-white hover:bg-purple-400"
//                   }`}
//                 >
//                   Update
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="p-6 md:p-8 space-y-6">
//             {mode === "patch" && (
//               <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
//                 <label className="block text-sm font-bold text-purple-900 mb-2">
//                   Blog ID (Required for Update)
//                 </label>
//                 <input
//                   type="text"
//                   value={blogId}
//                   onChange={(e) => setBlogId(e.target.value)}
//                   className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                   placeholder="e.g., 694129c22eacb52f275fab41"
//                 />
//               </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="lg:col-span-2">
//                 <label className="block text-sm font-bold text-slate-800 mb-2">
//                   Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                   placeholder="Enter blog title"
//                 />
//               </div>

//               <div className="lg:col-span-2">
//                 <label className="block text-sm font-bold text-slate-800 mb-2">
//                   Description *
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
//                   placeholder="Enter blog description"
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <label className="block text-sm font-bold text-slate-800">
//                   Content Paragraphs
//                 </label>
//                 <button
//                   onClick={addContentParagraph}
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
//                 >
//                   <Plus size={18} />
//                   Add Paragraph
//                 </button>
//               </div>
//               <div className="space-y-3">
//                 {formData.content.map((paragraph, index) => (
//                   <div key={index} className="flex gap-2">
//                     <div className="flex-shrink-0 w-8 h-10 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600">
//                       {index + 1}
//                     </div>
//                     <textarea
//                       value={paragraph}
//                       onChange={(e) =>
//                         handleContentChange(index, e.target.value)
//                       }
//                       rows={3}
//                       className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
//                       placeholder={`Paragraph ${index + 1}`}
//                     />
//                     {formData.content.length > 1 && (
//                       <button
//                         onClick={() => removeContentParagraph(index)}
//                         className="flex-shrink-0 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                       >
//                         <X size={20} />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-bold text-slate-800 mb-3">
//                   Cover Image {mode === "patch" && "(Replace)"}
//                 </label>
//                 <label className="flex flex-col items-center justify-center h-40 px-4 py-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
//                   <ImageIcon size={40} className="text-indigo-500 mb-2" />
//                   <span className="text-sm font-semibold text-indigo-600">
//                     {formData.coverImage
//                       ? "Change Cover Image"
//                       : "Choose Cover Image"}
//                   </span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleCoverImageChange}
//                     className="hidden"
//                   />
//                 </label>
//                 {formData.coverImage && (
//                   <div className="mt-2 p-3 bg-indigo-50 rounded-lg">
//                     <p className="text-sm font-medium text-indigo-800 truncate">
//                       {formData.coverImage.name}
//                     </p>
//                     {mode === "patch" && (
//                       <p className="text-xs text-indigo-600 mt-1">
//                         Will replace cover image
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="block text-sm font-bold text-slate-800">
//                     Slider Images {mode === "patch" && "(By Index)"}
//                   </label>
//                   <button
//                     onClick={addSliderImageSlot}
//                     className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors"
//                   >
//                     + Add Slot
//                   </button>
//                 </div>
//                 <div className="space-y-3 max-h-80 overflow-y-auto">
//                   {formData.sliderImages.length === 0 ? (
//                     <div className="text-center py-8 text-slate-400">
//                       No slider images added
//                     </div>
//                   ) : (
//                     formData.sliderImages.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200"
//                       >
//                         <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center font-bold">
//                           {index}
//                         </div>
//                         <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-purple-300 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
//                           <Upload size={18} className="text-purple-600" />
//                           <span className="text-sm font-medium text-purple-700 truncate">
//                             {item && item.file
//                               ? item.file.name
//                               : "Choose Image"}
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => handleSliderImageChange(e, index)}
//                             className="hidden"
//                           />
//                         </label>
//                         <button
//                           onClick={() => removeSliderImage(index)}
//                           className="flex-shrink-0 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                         >
//                           <X size={18} />
//                         </button>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-slate-200">
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading || (mode === "patch" && !blogId)}
//                 className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all shadow-lg"
//               >
//                 {loading ? (
//                   <span>Processing...</span>
//                 ) : (
//                   <>
//                     {mode === "post" ? <Save size={22} /> : <Edit size={22} />}
//                     {mode === "post" ? "Create Blog Post" : "Update Blog Post"}
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={resetForm}
//                 className="px-6 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-300 transition-colors"
//               >
//                 Reset
//               </button>
//             </div>

//             {error && (
//               <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
//                 <p className="text-red-900 font-bold mb-1">Error:</p>
//                 <p className="text-red-700">{error}</p>
//                 <p className="text-sm text-red-600 mt-2">
//                   Tip: Check browser console for more details (F12 → Console)
//                 </p>
//               </div>
//             )}

//             {response && (
//               <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
//                 <p className="text-green-900 font-bold mb-2">Success! ✓</p>
//                 <div className="bg-white rounded-lg p-4 max-h-96 overflow-auto">
//                   <pre className="text-sm text-green-800">
//                     {JSON.stringify(response, null, 2)}
//                   </pre>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
