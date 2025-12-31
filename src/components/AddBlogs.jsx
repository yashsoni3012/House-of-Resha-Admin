// // import React, { useState } from "react";
// // import {
// //   Upload,
// //   Plus,
// //   X,
// //   ImageIcon,
// //   FileText,
// //   Send,
// //   ArrowLeft,
// // } from "lucide-react";

// // export default function AddBlogs() {
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     coverImage: null,
// //     content: [{ text: "", img: null }],
// //   });
// //   const [coverPreview, setCoverPreview] = useState(null);
// //   const [contentPreviews, setContentPreviews] = useState([null]);
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState({ type: "", text: "" });

// //   const handleCoverImageChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       setFormData({ ...formData, coverImage: file });
// //       setCoverPreview(URL.createObjectURL(file));
// //     }
// //   };

// //   const handleContentChange = (index, field, value) => {
// //     const newContent = [...formData.content];
// //     newContent[index][field] = value;
// //     setFormData({ ...formData, content: newContent });
// //   };

// //   const handleContentImageChange = (index, file) => {
// //     const newContent = [...formData.content];
// //     newContent[index].img = file;
// //     setFormData({ ...formData, content: newContent });

// //     const newPreviews = [...contentPreviews];
// //     newPreviews[index] = file ? URL.createObjectURL(file) : null;
// //     setContentPreviews(newPreviews);
// //   };

// //   const addContentBlock = () => {
// //     setFormData({
// //       ...formData,
// //       content: [...formData.content, { text: "", img: null }],
// //     });
// //     setContentPreviews([...contentPreviews, null]);
// //   };

// //   const removeContentBlock = (index) => {
// //     const newContent = formData.content.filter((_, i) => i !== index);
// //     const newPreviews = contentPreviews.filter((_, i) => i !== index);
// //     setFormData({ ...formData, content: newContent });
// //     setContentPreviews(newPreviews);
// //   };

// //   const handleSubmit = async () => {
// //     if (!formData.title || !formData.description || !formData.coverImage) {
// //       setMessage({ type: "error", text: "Please fill in all required fields" });
// //       return;
// //     }

// //     setLoading(true);
// //     setMessage({ type: "", text: "" });

// //     try {
// //       const fd = new FormData();

// //       fd.append("title", formData.title);
// //       fd.append("description", formData.description);
// //       fd.append("cover", formData.coverImage); // matches your API

// //       // Prepare content text array
// //       const contentPayload = formData.content.map((block) => ({
// //         text: block.text,
// //       }));
// //       fd.append("content", JSON.stringify(contentPayload));

// //       // Append content images using indexed keys
// //       formData.content.forEach((block, index) => {
// //         if (block.img) {
// //           fd.append(`contentImages[${index}]`, block.img);
// //         }
// //       });

// //       const response = await fetch("https://api.houseofresha.com/blogs", {
// //         method: "POST",
// //         body: fd, // DO NOT set headers, browser sets multipart automatically
// //       });

// //       const result = await response.json();

// //       if (!response.ok) {
// //         throw new Error(result.message || "Failed to post blog");
// //       }

// //       setMessage({ type: "success", text: "Blog posted successfully!" });

// //       // Reset form
// //       setFormData({
// //         title: "",
// //         description: "",
// //         coverImage: null,
// //         content: [{ text: "", img: null }],
// //       });
// //       setCoverPreview(null);
// //       setContentPreviews([null]);

// //       setTimeout(() => {
// //         window.location.href = "/blogs";
// //       }, 1500);
// //     } catch (err) {
// //       console.error(err);
// //       setMessage({ type: "error", text: err.message || "Server error" });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const navigateToBlogs = () => {
// //     window.location.href = "/blogs";
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-4xl mx-auto">
// //         {/* Back Button */}
// //         <button
// //           onClick={navigateToBlogs}
// //           className="mb-6 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition group"
// //         >
// //           <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
// //           Back to Blogs
// //         </button>

// //         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
// //           {/* Header */}
// //           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
// //             <h1 className="text-3xl font-bold text-white flex items-center gap-3">
// //               <FileText className="w-8 h-8" />
// //               Create New Blog Post
// //             </h1>
// //             <p className="text-indigo-100 mt-2">
// //               Share your thoughts with the world
// //             </p>
// //           </div>

// //           <div className="p-8 space-y-8">
// //             {/* Message Alert */}
// //             {message.text && (
// //               <div
// //                 className={`p-4 rounded-lg ${
// //                   message.type === "success"
// //                     ? "bg-green-50 text-green-800 border border-green-200"
// //                     : "bg-red-50 text-red-800 border border-red-200"
// //                 }`}
// //               >
// //                 {message.text}
// //               </div>
// //             )}

// //             {/* Title */}
// //             <div>
// //               <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                 Blog Title *
// //               </label>
// //               <input
// //                 type="text"
// //                 required
// //                 value={formData.title}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, title: e.target.value })
// //                 }
// //                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
// //                 placeholder="Enter an engaging title..."
// //               />
// //             </div>

// //             {/* Description */}
// //             <div>
// //               <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                 Description *
// //               </label>
// //               <textarea
// //                 required
// //                 value={formData.description}
// //                 onChange={(e) =>
// //                   setFormData({ ...formData, description: e.target.value })
// //                 }
// //                 rows={3}
// //                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
// //                 placeholder="Brief description of your blog post..."
// //               />
// //             </div>

// //             {/* Cover Image */}
// //             <div>
// //               <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                 Cover Image *
// //               </label>
// //               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 transition">
// //                 {coverPreview ? (
// //                   <div className="relative">
// //                     <img
// //                       src={coverPreview}
// //                       alt="Cover preview"
// //                       className="w-full h-64 object-cover rounded-lg"
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={() => {
// //                         setFormData({ ...formData, coverImage: null });
// //                         setCoverPreview(null);
// //                       }}
// //                       className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
// //                     >
// //                       <X className="w-4 h-4" />
// //                     </button>
// //                   </div>
// //                 ) : (
// //                   <label className="flex flex-col items-center cursor-pointer">
// //                     <Upload className="w-12 h-12 text-gray-400 mb-2" />
// //                     <span className="text-sm text-gray-600">
// //                       Click to upload cover image
// //                     </span>
// //                     <span className="text-xs text-gray-500 mt-1">
// //                       PNG, JPG up to 10MB
// //                     </span>
// //                     <input
// //                       type="file"
// //                       accept="image/*"
// //                       required
// //                       onChange={handleCoverImageChange}
// //                       className="hidden"
// //                     />
// //                   </label>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Content Blocks */}
// //             <div>
// //               <div className="flex justify-between items-center mb-4">
// //                 <label className="block text-sm font-semibold text-gray-700">
// //                   Content Sections
// //                 </label>
// //                 <button
// //                   type="button"
// //                   onClick={addContentBlock}
// //                   className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium"
// //                 >
// //                   <Plus className="w-4 h-4" />
// //                   Add Section
// //                 </button>
// //               </div>

// //               <div className="space-y-6">
// //                 {formData.content.map((block, index) => (
// //                   <div
// //                     key={index}
// //                     className="bg-gray-50 p-6 rounded-lg border border-gray-200"
// //                   >
// //                     <div className="flex justify-between items-center mb-4">
// //                       <h3 className="font-semibold text-gray-700">
// //                         Section {index + 1}
// //                       </h3>
// //                       {formData.content.length > 1 && (
// //                         <button
// //                           type="button"
// //                           onClick={() => removeContentBlock(index)}
// //                           className="text-red-500 hover:text-red-700 transition"
// //                         >
// //                           <X className="w-5 h-5" />
// //                         </button>
// //                       )}
// //                     </div>

// //                     <textarea
// //                       value={block.text}
// //                       onChange={(e) =>
// //                         handleContentChange(index, "text", e.target.value)
// //                       }
// //                       rows={4}
// //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none mb-4"
// //                       placeholder="Write your content here..."
// //                     />

// //                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition">
// //                       {contentPreviews[index] ? (
// //                         <div className="relative">
// //                           <img
// //                             src={contentPreviews[index]}
// //                             alt={`Content ${index}`}
// //                             className="w-full h-48 object-cover rounded-lg"
// //                           />
// //                           <button
// //                             type="button"
// //                             onClick={() =>
// //                               handleContentImageChange(index, null)
// //                             }
// //                             className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
// //                           >
// //                             <X className="w-4 h-4" />
// //                           </button>
// //                         </div>
// //                       ) : (
// //                         <label className="flex flex-col items-center cursor-pointer">
// //                           <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
// //                           <span className="text-sm text-gray-600">
// //                             Add image (optional)
// //                           </span>
// //                           <span className="text-xs text-gray-500 mt-1">
// //                             PNG, JPG up to 10MB
// //                           </span>
// //                           <input
// //                             type="file"
// //                             accept="image/*"
// //                             onChange={(e) =>
// //                               handleContentImageChange(index, e.target.files[0])
// //                             }
// //                             className="hidden"
// //                           />
// //                         </label>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Submit Button */}
// //             <button
// //               type="button"
// //               onClick={handleSubmit}
// //               disabled={loading}
// //               className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
// //             >
// //               {loading ? (
// //                 <>
// //                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
// //                   Publishing...
// //                 </>
// //               ) : (
// //                 <>
// //                   <Send className="w-5 h-5" />
// //                   Publish Blog Post
// //                 </>
// //               )}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, lazy, Suspense, useEffect } from "react";
// import {
//   Upload,
//   Plus,
//   X,
//   ImageIcon,
//   FileText,
//   Send,
//   ArrowLeft,
// } from "lucide-react";

// const ReactQuill = lazy(() => import("react-quill-new"));

// const RichTextEditor = ({
//   value,
//   onChange,
//   placeholder,
//   className = "",
//   height = 300,
// }) => {
//   useEffect(() => {
//     const link = document.createElement("link");
//     link.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
//     link.rel = "stylesheet";
//     document.head.appendChild(link);

//     return () => {
//       if (document.head.contains(link)) {
//         document.head.removeChild(link);
//       }
//     };
//   }, []);

//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline", "strike"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ indent: "-1" }, { indent: "+1" }],
//       ["link", "image"],
//       ["clean"],
//     ],
//   };

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "blockquote",
//     "list", // ✅ ONLY list
//     "indent",
//     "link",
//     "image",
//   ];

//   return (
//     <div
//       className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}
//     >
//       <Suspense
//         fallback={
//           <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
//             <div className="text-gray-500">Loading editor...</div>
//           </div>
//         }
//       >
//         <ReactQuill
//           theme="snow"
//           value={value}
//           onChange={onChange}
//           modules={modules}
//           formats={formats}
//           placeholder={placeholder || "Start writing..."}
//           style={{
//             height: `${height}px`,
//             border: "none",
//           }}
//           className="rounded-lg"
//         />
//       </Suspense>
//     </div>
//   );
// };

// export default function AddBlogs() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     coverImage: null,
//     content: [{ text: "", img: null }],
//   });
//   const [coverPreview, setCoverPreview] = useState(null);
//   const [contentPreviews, setContentPreviews] = useState([null]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const handleCoverImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, coverImage: file });
//       setCoverPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleContentChange = (index, field, value) => {
//     const newContent = [...formData.content];
//     newContent[index][field] = value;
//     setFormData({ ...formData, content: newContent });
//   };

//   const handleContentImageChange = (index, file) => {
//     const newContent = [...formData.content];
//     newContent[index].img = file;
//     setFormData({ ...formData, content: newContent });

//     const newPreviews = [...contentPreviews];
//     newPreviews[index] = file ? URL.createObjectURL(file) : null;
//     setContentPreviews(newPreviews);
//   };

//   const addContentBlock = () => {
//     setFormData({
//       ...formData,
//       content: [...formData.content, { text: "", img: null }],
//     });
//     setContentPreviews([...contentPreviews, null]);
//   };

//   const removeContentBlock = (index) => {
//     const newContent = formData.content.filter((_, i) => i !== index);
//     const newPreviews = contentPreviews.filter((_, i) => i !== index);
//     setFormData({ ...formData, content: newContent });
//     setContentPreviews(newPreviews);
//   };

//   const handleSubmit = async () => {
//     if (!formData.title || !formData.description || !formData.coverImage) {
//       setMessage({ type: "error", text: "Please fill in all required fields" });
//       return;
//     }

//     // const stripHtml = (html) => {
//     //   const div = document.createElement("div");
//     //   div.innerHTML = html;
//     //   return div.textContent.trim();
//     // };

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const formDataToSend = new FormData();

//       formDataToSend.append("title", formData.title);
//       formDataToSend.append("description", formData.description);
//       formDataToSend.append("cover", formData.coverImage);

//       const contentArray = formData.content
//         .map((block) => ({
//           text: block.text, // ✅ KEEP HTML
//         }))
//         .filter(
//           (block) => block.text && block.text !== "<p><br></p>" // remove empty quill blocks
//         );

//       formDataToSend.append("content", JSON.stringify(contentArray));

//       formData.content.forEach((block, index) => {
//         if (block.img) {
//           formDataToSend.append(`contentImages[${index}]`, block.img);
//         }
//       });

//       const response = await fetch("https://api.houseofresha.com/blogs", {
//         method: "POST",
//         body: formDataToSend,
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setMessage({ type: "success", text: "Blog posted successfully!" });
//         setFormData({
//           title: "",
//           description: "",
//           coverImage: null,
//           content: [{ text: "", img: null }],
//         });
//         setCoverPreview(null);
//         setContentPreviews([null]);

//         setTimeout(() => {
//           window.location.href = "/blogs";
//         }, 2000);
//       } else {
//         setMessage({
//           type: "error",
//           text: `Failed to post blog: ${
//             result.message || JSON.stringify(result)
//           }`,
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setMessage({
//         type: "error",
//         text: `An error occurred: ${error.message}`,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigateToBlogs = () => {
//     window.location.href = "/blogs";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <button
//           onClick={navigateToBlogs}
//           className="mb-6 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition group"
//         >
//           <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//           Back to Blogs
//         </button>

//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
//             <h1 className="text-3xl font-bold text-white flex items-center gap-3">
//               <FileText className="w-8 h-8" />
//               Create New Blog Post
//             </h1>
//             <p className="text-indigo-100 mt-2">
//               Share your thoughts with the world
//             </p>
//           </div>

//           <div className="p-8 space-y-8">
//             {message.text && (
//               <div
//                 className={`p-4 rounded-lg ${
//                   message.type === "success"
//                     ? "bg-green-50 text-green-800 border border-green-200"
//                     : "bg-red-50 text-red-800 border border-red-200"
//                 }`}
//               >
//                 {message.text}
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Blog Title *
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData({ ...formData, title: e.target.value })
//                 }
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                 placeholder="Enter an engaging title..."
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 required
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData({ ...formData, description: e.target.value })
//                 }
//                 rows={3}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
//                 placeholder="Brief description of your blog post..."
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Cover Image *
//               </label>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 transition">
//                 {coverPreview ? (
//                   <div className="relative">
//                     <img
//                       src={coverPreview}
//                       alt="Cover preview"
//                       className="w-full h-64 object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setFormData({ ...formData, coverImage: null });
//                         setCoverPreview(null);
//                       }}
//                       className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ) : (
//                   <label className="flex flex-col items-center cursor-pointer">
//                     <Upload className="w-12 h-12 text-gray-400 mb-2" />
//                     <span className="text-sm text-gray-600">
//                       Click to upload cover image
//                     </span>
//                     <span className="text-xs text-gray-500 mt-1">
//                       PNG, JPG up to 10MB
//                     </span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       required
//                       onChange={handleCoverImageChange}
//                       className="hidden"
//                     />
//                   </label>
//                 )}
//               </div>
//             </div>

//             <div>
//               <div className="flex justify-between items-center mb-4">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Content Sections
//                 </label>
//                 <button
//                   type="button"
//                   onClick={addContentBlock}
//                   className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Section
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {formData.content.map((block, index) => (
//                   <div
//                     key={index}
//                     className="bg-gray-50 p-6 rounded-lg border border-gray-200"
//                   >
//                     <div className="flex justify-between items-center mb-4">
//                       <h3 className="font-semibold text-gray-700">
//                         Section {index + 1}
//                       </h3>
//                       {formData.content.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeContentBlock(index)}
//                           className="text-red-500 hover:text-red-700 transition"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       )}
//                     </div>

//                     <div className="mb-4">
//                       <RichTextEditor
//                         value={block.text || ""} // ✅ always controlled
//                         onChange={(value) => {
//                           // ❌ ignore empty quill output
//                           if (value === "<p><br></p>") {
//                             handleContentChange(index, "text", "");
//                           } else {
//                             handleContentChange(index, "text", value); // ✅ keep HTML styles
//                           }
//                         }}
//                         placeholder="Write your content here with rich formatting..."
//                         height={300}
//                       />
//                     </div>

//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition">
//                       {contentPreviews[index] ? (
//                         <div className="relative">
//                           <img
//                             src={contentPreviews[index]}
//                             alt={`Content ${index}`}
//                             className="w-full h-48 object-cover rounded-lg"
//                           />
//                           <button
//                             type="button"
//                             onClick={() =>
//                               handleContentImageChange(index, null)
//                             }
//                             className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ) : (
//                         <label className="flex flex-col items-center cursor-pointer">
//                           <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
//                           <span className="text-sm text-gray-600">
//                             Add image (optional)
//                           </span>
//                           <span className="text-xs text-gray-500 mt-1">
//                             PNG, JPG up to 10MB
//                           </span>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) =>
//                               handleContentImageChange(index, e.target.files[0])
//                             }
//                             className="hidden"
//                           />
//                         </label>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Publishing...
//                 </>
//               ) : (
//                 <>
//                   <Send className="w-5 h-5" />
//                   Publish Blog Post
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Plus,
  X,
  Image as ImageIcon,
  FileText,
  Send,
  ArrowLeft,
  Type,
  MessageSquare,
  Image as ImageLucide,
  CheckCircle,
  Eye,
  Clock,
  Tag,
  Globe,
  Users,
  BarChart3,
} from "lucide-react";

const ReactQuill = lazy(() => import("react-quill-new"));

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  className = "",
  height = 300,
}) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "link",
    "image",
  ];

  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading editor...</p>
            </div>
          </div>
        }
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || "Write your content here..."}
          style={{
            height: `${height}px`,
            border: "none",
          }}
          className="rounded-lg"
        />
      </Suspense>
    </div>
  );
};

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

export default function AddBlogs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: null,
    content: [{ text: "", img: null }],
  });
  const [coverPreview, setCoverPreview] = useState(null);
  const [contentPreviews, setContentPreviews] = useState([null]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size must be less than 10MB" });
        return;
      }
      setFormData({ ...formData, coverImage: file });
      const preview = URL.createObjectURL(file);
      setCoverPreview(preview);
    }
  };

  const handleContentChange = (index, field, value) => {
    const newContent = [...formData.content];
    newContent[index][field] = value;
    setFormData({ ...formData, content: newContent });
  };

  const handleContentImageChange = (index, file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 10MB" });
      return;
    }

    const newContent = [...formData.content];
    newContent[index].img = file;
    setFormData({ ...formData, content: newContent });

    const newPreviews = [...contentPreviews];
    if (file) {
      newPreviews[index] = URL.createObjectURL(file);
    } else {
      newPreviews[index] = null;
    }
    setContentPreviews(newPreviews);
  };

  const addContentBlock = () => {
    setFormData({
      ...formData,
      content: [...formData.content, { text: "", img: null }],
    });
    setContentPreviews([...contentPreviews, null]);
  };

  const removeContentBlock = (index) => {
    if (formData.content.length === 1) {
      setMessage({
        type: "error",
        text: "At least one content section is required",
      });
      return;
    }
    const newContent = formData.content.filter((_, i) => i !== index);
    const newPreviews = contentPreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, content: newContent });
    setContentPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      setMessage({ type: "error", text: "Please enter a title" });
      return;
    }
    if (!formData.description.trim()) {
      setMessage({ type: "error", text: "Please enter a description" });
      return;
    }
    if (!formData.coverImage) {
      setMessage({ type: "error", text: "Please upload a cover image" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("cover", formData.coverImage);

      const contentArray = formData.content
        .map((block) => ({
          text: block.text || "",
        }))
        .filter((block) => block.text.trim() !== "");

      if (contentArray.length === 0) {
        setMessage({ type: "error", text: "Please add some content" });
        setLoading(false);
        return;
      }

      formDataToSend.append("content", JSON.stringify(contentArray));

      formData.content.forEach((block, index) => {
        if (block.img) {
          formDataToSend.append(`contentImages[${index}]`, block.img);
        }
      });

      const response = await fetch("https://api.houseofresha.com/blogs", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Blog published successfully! Redirecting...",
        });

        // Reset form
        setFormData({
          title: "",
          description: "",
          coverImage: null,
          content: [{ text: "", img: null }],
        });
        setCoverPreview(null);
        setContentPreviews([null]);

        setTimeout(() => {
          navigate("/blogs");
        });
      } else {
        throw new Error(result.message || "Failed to publish blog");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToBlogs = () => {
    navigate("/blogs");
  };

  const wordCount = formData.description
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={navigateToBlogs}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Create New Blog
                </h1>
                <p className="text-sm text-gray-600">
                  Share your story with the world
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  // Preview functionality
                  const hasRequiredFields =
                    formData.title &&
                    formData.description &&
                    formData.coverImage;
                  if (hasRequiredFields) {
                    alert("Preview would show here");
                  } else {
                    setMessage({
                      type: "error",
                      text: "Complete required fields to preview",
                    });
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.title ||
                  !formData.description ||
                  !formData.coverImage
                }
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={FileText}
            label="Sections"
            value={formData.content.length}
            color="bg-blue-500"
          />
          <StatsCard
            icon={Clock}
            label="Word Count"
            value={wordCount}
            color="bg-green-500"
          />
          <StatsCard
            icon={ImageLucide}
            label="Images"
            value={`${contentPreviews.filter((p) => p).length}/${
              formData.content.length
            }`}
            color="bg-purple-500"
          />
          <StatsCard
            icon={BarChart3}
            label="Status"
            value={formData.coverImage ? "Ready" : "Draft"}
            color={formData.coverImage ? "bg-green-500" : "bg-yellow-500"}
          />
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Type className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Title</h3>
                  <p className="text-sm text-gray-600">
                    Catchy title that grabs attention
                  </p>
                </div>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter blog title..."
                maxLength={100}
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                  Max 100 characters
                </span>
                <span className="text-xs text-gray-500">
                  {formData.title.length}/100
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Description</h3>
                  <p className="text-sm text-gray-600">
                    Brief summary of your blog
                  </p>
                </div>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                placeholder="Write a compelling description..."
                maxLength={200}
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                  Max 200 characters
                </span>
                <span className="text-xs text-gray-500">
                  {formData.description.length}/200
                </span>
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <ImageLucide className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Cover Image</h3>
                  <p className="text-sm text-gray-600">
                    First impression matters (Required)
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors">
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setFormData({ ...formData, coverImage: null });
                        setCoverPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">
                      Upload cover image
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      JPG, PNG up to 10MB
                    </p>
                    <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                      Choose File
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Content Sections
                </h3>
                <button
                  onClick={addContentBlock}
                  className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>

              {formData.content.map((block, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <span className="text-indigo-600 font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900">
                        Section {index + 1}
                      </h4>
                    </div>
                    {formData.content.length > 1 && (
                      <button
                        onClick={() => removeContentBlock(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <RichTextEditor
                      value={block.text || ""}
                      onChange={(value) => {
                        if (value === "<p><br></p>") {
                          handleContentChange(index, "text", "");
                        } else {
                          handleContentChange(index, "text", value);
                        }
                      }}
                      placeholder="Write your content here..."
                      height={250}
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                    {contentPreviews[index] ? (
                      <div className="relative">
                        <img
                          src={contentPreviews[index]}
                          alt={`Content ${index}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleContentImageChange(index, null)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Add image (Optional)
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG up to 10MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleContentImageChange(index, e.target.files[0])
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Completion
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {
                        [
                          formData.title,
                          formData.description,
                          formData.coverImage,
                          formData.content.some((b) => b.text.trim()),
                        ].filter(Boolean).length
                      }
                      /4
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ([
                            formData.title,
                            formData.description,
                            formData.coverImage,
                            formData.content.some((b) => b.text.trim()),
                          ].filter(Boolean).length /
                            4) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.title
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.title ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {formData.title ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Title added</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.description
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.description ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {formData.description ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Description added</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.coverImage
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.coverImage ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {formData.coverImage ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Cover image uploaded</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formData.content.some((b) => b.text.trim())
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        formData.content.some((b) => b.text.trim())
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      {formData.content.some((b) => b.text.trim()) ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : null}
                    </div>
                    <span className="text-sm">Content added</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Publish Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Ready to publish?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Make sure all required fields are filled. Once published, your
                blog will be live immediately.
              </p>
              <button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.title ||
                  !formData.description ||
                  !formData.coverImage
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5" />
                    Publish Blog
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Your blog will be visible to everyone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
