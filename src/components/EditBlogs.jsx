// import React, { useState, lazy, Suspense, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Upload,
//   Plus,
//   X,
//   ImageIcon,
//   FileText,
//   Send,
//   ArrowLeft,
//   Edit,
//   Save,
//   Trash2,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";
// import { showProductUpdated } from "../utils/sweetAlertConfig";

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
//       [{ color: [] }, { background: [] }],
//       [{ align: [] }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["blockquote"],
//       ["link"],
//       ["clean"],
//     ],
//   };

//   const formats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "strike",
//     "color",
//     "background",
//     "align",
//     "list",
//     "blockquote",
//     "link",
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

// export default function EditBlog() {
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

//   // Edit-related state
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loadingBlog, setLoadingBlog] = useState(true);
//   const [existingImages, setExistingImages] = useState({
//     cover: null,
//     content: [],
//   });
//   // Keep a copy of original images from server to detect removals
//   const [initialExistingImages, setInitialExistingImages] = useState({
//     cover: null,
//     content: [],
//   });
//   // Track which original content image indices have been removed (by original index)
//   const [removedContentIndicesState, setRemovedContentIndicesState] = useState(
//     []
//   );
//   // Track removed cover explicitly (true if original cover should be deleted)
//   const [removedCover, setRemovedCover] = useState(false);
//   // Show a small confirmation modal before removing the cover image
//   const [showCoverDeleteConfirm, setShowCoverDeleteConfirm] = useState(false);
//   // Show a small confirmation modal before removing a content image
//   const [showContentDeleteConfirm, setShowContentDeleteConfirm] =
//     useState(false);
//   // Index of the content image to delete
//   const [contentImageDeleteIndex, setContentImageDeleteIndex] = useState(null);

//   const API_BASE_URL = "https://api.houseofresha.com";

//   useEffect(() => {
//     fetchBlogData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const fetchBlogData = async () => {
//     try {
//       setLoadingBlog(true);
//       const res = await fetch(`${API_BASE_URL}/blogs/${id}`);
//       if (!res.ok) throw new Error("Failed to fetch blog");
//       const result = await res.json();
//       const blog = result.data || result;

//       setFormData({
//         title: blog.title || "",
//         description: blog.description || "",
//         coverImage: null,
//         // Keep original image path & original index so we can map removals/replacements later
//         content:
//           blog.content && blog.content.length > 0
//             ? blog.content.map((item, idx) => ({
//                 text: item.text || "",
//                 img: null,
//                 originalImagePath: item.img || null,
//                 originalIndex: idx,
//               }))
//             : [
//                 {
//                   text: "",
//                   img: null,
//                   originalImagePath: null,
//                   originalIndex: null,
//                 },
//               ],
//       });

//       if (blog.coverImage) {
//         const coverUrl = blog.coverImage.startsWith("http")
//           ? blog.coverImage
//           : `${API_BASE_URL}/${blog.coverImage}`;
//         setCoverPreview(coverUrl);
//         setExistingImages((prev) => ({ ...prev, cover: blog.coverImage }));
//       }

//       if (blog.content) {
//         const previews = blog.content.map((item) =>
//           item.img
//             ? item.img.startsWith("http")
//               ? item.img
//               : `${API_BASE_URL}/${item.img}`
//             : null
//         );
//         setContentPreviews(previews.length ? previews : [null]);
//         const contentImagePaths = blog.content.map((item) => item.img || null);
//         setExistingImages((prev) => ({
//           ...prev,
//           content: contentImagePaths,
//         }));
//         // Keep initial snapshot so we can detect removals when submitting
//         setInitialExistingImages({
//           cover: blog.coverImage || null,
//           content: contentImagePaths,
//         });
//       } else {
//         setContentPreviews([null]);
//         setInitialExistingImages({
//           cover: blog.coverImage || null,
//           content: [],
//         });
//       }
//     } catch (e) {
//       console.error(e);
//       setMessage({
//         type: "error",
//         text: e.message || "Failed to load blog data",
//       });
//     } finally {
//       setLoadingBlog(false);
//     }
//   };

//   const handleCoverImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, coverImage: file });
//       setCoverPreview(URL.createObjectURL(file));
//       // Clear existing cover path so backend knows it's replaced
//       setExistingImages((prev) => ({ ...prev, cover: null }));
//       // If originally had a cover, mark it for removal
//       if (initialExistingImages && initialExistingImages.cover) {
//         setRemovedCover(true);
//       }
//     }
//   };

//   const handleContentChange = (index, field, value) => {
//     const newContent = [...formData.content];
//     newContent[index][field] = value;
//     setFormData({ ...formData, content: newContent });
//   };

//   const handleContentImageChange = (index, file) => {
//     const newContent = [...formData.content];

//     // Keep a reference to original image path if present
//     const originalPath = newContent[index]?.originalImagePath || null;

//     // Set new file (or clear)
//     newContent[index].img = file;

//     // If we're replacing/removing, clear the original markers on this block
//     if (originalPath) {
//       newContent[index].originalImagePath = null;
//       newContent[index].originalIndex = null;
//       // mark original for removal using initial snapshot
//       if (
//         initialExistingImages &&
//         Array.isArray(initialExistingImages.content)
//       ) {
//         const idxInInitial =
//           initialExistingImages.content.indexOf(originalPath);
//         if (idxInInitial >= 0) {
//           // Add to removed indices if not already there
//           setRemovedContentIndicesState((prev) => {
//             if (!prev.includes(idxInInitial)) {
//               return [...prev, idxInInitial];
//             }
//             return prev;
//           });
//         }
//       }
//     }

//     setFormData({ ...formData, content: newContent });

//     const newPreviews = [...contentPreviews];
//     if (file) {
//       newPreviews[index] = URL.createObjectURL(file);
//     } else {
//       newPreviews[index] = null;
//       // Clear blob URL if exists
//       if (
//         contentPreviews[index] &&
//         contentPreviews[index].startsWith("blob:")
//       ) {
//         URL.revokeObjectURL(contentPreviews[index]);
//       }
//     }
//     setContentPreviews(newPreviews);

//     // Update existingImages - clear the existing image for this slot
//     const newExisting = [...existingImages.content];
//     while (newExisting.length <= index) newExisting.push(null);
//     newExisting[index] = null;
//     setExistingImages((prev) => ({ ...prev, content: newExisting }));
//   };

//   const handleRemoveContentImage = (index) => {
//     const currentPreview = contentPreviews[index];

//     // Check if it's a blob URL (newly uploaded) or server URL
//     const isNewImage = currentPreview && currentPreview.startsWith("blob:");
//     const hasExistingImage = existingImages.content[index];

//     // Show confirmation only if it's a server image (not a newly uploaded one)
//     if (!isNewImage && hasExistingImage) {
//       setContentImageDeleteIndex(index);
//       setShowContentDeleteConfirm(true);
//     } else {
//       // For new images, just remove immediately
//       removeContentImage(index);
//     }
//   };

//   const removeContentImage = (index) => {
//     const newContent = [...formData.content];
//     const originalPath = newContent[index]?.originalImagePath || null;

//     // Clear the image file
//     newContent[index].img = null;

//     // Mark original image for removal if it exists
//     if (originalPath) {
//       newContent[index].originalImagePath = null;
//       newContent[index].originalIndex = null;

//       if (
//         initialExistingImages &&
//         Array.isArray(initialExistingImages.content)
//       ) {
//         const idxInInitial =
//           initialExistingImages.content.indexOf(originalPath);
//         if (idxInInitial >= 0) {
//           setRemovedContentIndicesState((prev) => {
//             if (!prev.includes(idxInInitial)) {
//               return [...prev, idxInInitial];
//             }
//             return prev;
//           });
//         }
//       }
//     }

//     setFormData({ ...formData, content: newContent });

//     // Clear preview and clean up blob URL
//     const newPreviews = [...contentPreviews];
//     if (newPreviews[index] && newPreviews[index].startsWith("blob:")) {
//       URL.revokeObjectURL(newPreviews[index]);
//     }
//     newPreviews[index] = null;
//     setContentPreviews(newPreviews);

//     // Clear existing image for this slot
//     const newExisting = [...existingImages.content];
//     while (newExisting.length <= index) newExisting.push(null);
//     newExisting[index] = null;
//     setExistingImages((prev) => ({ ...prev, content: newExisting }));
//   };

//   const confirmRemoveContentImage = () => {
//     const index = contentImageDeleteIndex;
//     if (index == null) return;
//     removeContentImage(index);
//     setShowContentDeleteConfirm(false);
//     setContentImageDeleteIndex(null);
//   };

//   const addContentBlock = () => {
//     setFormData({
//       ...formData,
//       content: [
//         ...formData.content,
//         { text: "", img: null, originalImagePath: null, originalIndex: null },
//       ],
//     });
//     setContentPreviews([...contentPreviews, null]);
//     setExistingImages((prev) => ({
//       ...prev,
//       content: [...(prev.content || []), null],
//     }));
//   };

//   const removeContentBlock = (index) => {
//     // If this block had an original image, mark it for removal using the original path
//     const origPath = formData.content[index]?.originalImagePath || null;
//     if (
//       origPath &&
//       initialExistingImages &&
//       Array.isArray(initialExistingImages.content)
//     ) {
//       const idxInInitial = initialExistingImages.content.indexOf(origPath);
//       if (idxInInitial >= 0) {
//         setRemovedContentIndicesState((prev) => {
//           if (!prev.includes(idxInInitial)) {
//             return [...prev, idxInInitial];
//           }
//           return prev;
//         });
//       }
//     }

//     const newContent = formData.content.filter((_, i) => i !== index);
//     const newPreviews = contentPreviews.filter((_, i) => i !== index);

//     // Clean up blob URLs
//     if (contentPreviews[index] && contentPreviews[index].startsWith("blob:")) {
//       URL.revokeObjectURL(contentPreviews[index]);
//     }

//     setFormData({ ...formData, content: newContent });
//     setContentPreviews(newPreviews);

//     // Remove corresponding existing image slot
//     const newExisting = Array.isArray(existingImages.content)
//       ? existingImages.content.filter((_, i) => i !== index)
//       : [];
//     setExistingImages((prev) => ({ ...prev, content: newExisting }));
//   };

//   const handleSubmit = async () => {
//     // For editing we only require title & description
//     if (!formData.title || !formData.description) {
//       setMessage({ type: "error", text: "Please fill in all required fields" });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const fd = new FormData();

//       fd.append("title", formData.title);
//       fd.append("description", formData.description);

//       // Append new cover file only if user selected one
//       if (formData.coverImage) {
//         fd.append("cover", formData.coverImage);
//       }

//       // Prepare content payload
//       const contentPayload = formData.content.map((block, index) => {
//         const payload = { text: block.text };

//         // Preserve mapping to original index if any
//         payload.originalIndex = block.originalIndex ?? null;

//         // Determine image handling
//         if (block.img) {
//           // New file upload (include index so backend can map files correctly)
//           fd.append(`contentImages[${index}]`, block.img);
//           payload.img = ""; // backend will assign new path
//           payload.isNewImage = true;
//         } else if (existingImages.content[index]) {
//           // Keep existing image path
//           payload.img = existingImages.content[index];
//         } else {
//           // No image in this slot. Distinguish between "never had an image" and "original existed but was removed"
//           const origIdx = block.originalIndex;
//           const wasOriginalRemoved =
//             origIdx != null &&
//             (removedContentIndicesState || []).includes(origIdx);
//           // If original image was removed, explicitly send empty string so backend can delete it
//           payload.img = wasOriginalRemoved ? "" : null;
//         }

//         return payload;
//       });

//       // Debug: log FormData keys for inspection
//       try {
//         console.groupCollapsed("EditBlogs: FormData payload");
//         for (let [k, v] of fd.entries()) {
//           console.log(k, v instanceof File ? `File: ${v.name}` : v);
//         }
//         console.groupEnd();
//       } catch (e) {
//         /* ignore in older browsers */
//       }

//       // Also log the content payload sent in JSON (helpful for backend mapping)
//       try {
//         console.log(
//           "EditBlogs: contentPayload:",
//           JSON.stringify(contentPayload, null, 2)
//         );
//       } catch (e) {
//         /* ignore */
//       }

//       // Send removed content indices
//       const uniqueRemovedIndices = Array.from(
//         new Set(removedContentIndicesState || [])
//       );
//       if (uniqueRemovedIndices.length) {
//         fd.append(
//           "removedContentIndices",
//           JSON.stringify(uniqueRemovedIndices)
//         );

//         // Also send exact original image paths to help server reliably delete files
//         const removedContentImagePaths = uniqueRemovedIndices
//           .map((i) => initialExistingImages?.content?.[i])
//           .filter(Boolean);
//         if (removedContentImagePaths.length) {
//           console.log("Removing content images:", removedContentImagePaths);
//           fd.append(
//             "removedContentImagePaths",
//             JSON.stringify(removedContentImagePaths)
//           );
//         }
//       }

//       // If cover existed originally and user removed it or replaced it, mark it for removal
//       if (
//         removedCover ||
//         (initialExistingImages &&
//           initialExistingImages.cover &&
//           !existingImages.cover &&
//           !formData.coverImage)
//       ) {
//         fd.append("removeCover", "1");
//       }

//       fd.append("content", JSON.stringify(contentPayload));

//       const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
//         method: "PATCH",
//         body: fd,
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to update blog");
//       }

//       setMessage({ type: "success", text: "Blog updated successfully!" });
//       // Show top-end toast using sweetAlert config and then navigate back to listing
//       try {
//         await showBlogUpdated();
//       } catch (e) {
//         // ignore toast errors
//       }
//       navigate("/blogs");
//     } catch (err) {
//       console.error("Update error:", err);
//       setMessage({
//         type: "error",
//         text: err.message || "Failed to update blog. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigateToBlogs = () => {
//     navigate("/blogs");
//   };

//   if (loadingBlog) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
//           <p className="mt-4 text-gray-600">Loading blog data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
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
//               <Edit className="w-8 h-8" />
//               Edit Blog Post
//             </h1>
//             <p className="text-indigo-100 mt-2">Update your blog post</p>
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
//                       onClick={() => setShowCoverDeleteConfirm(true)}
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
//                         value={block.text}
//                         onChange={(value) =>
//                           handleContentChange(index, "text", value)
//                         }
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
//                             onClick={() => handleRemoveContentImage(index)}
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

//         {/* Cover Image Delete Confirmation Modal */}
//         {showCoverDeleteConfirm && (
//           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                   <AlertCircle className="w-5 h-5 text-red-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold">Remove Cover Image</h3>
//               </div>
//               <p className="text-sm text-gray-600 mb-6">
//                 Are you sure you want to remove the cover image? This will mark
//                 the original image for deletion.
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowCoverDeleteConfirm(false)}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setFormData({ ...formData, coverImage: null });
//                     if (coverPreview && coverPreview.startsWith("blob:")) {
//                       URL.revokeObjectURL(coverPreview);
//                     }
//                     setCoverPreview(null);
//                     setExistingImages((prev) => ({ ...prev, cover: null }));
//                     setRemovedCover(true);
//                     setShowCoverDeleteConfirm(false);
//                   }}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Content Image Delete Confirmation Modal */}
//         {showContentDeleteConfirm && (
//           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                   <AlertCircle className="w-5 h-5 text-red-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold">Remove Content Image</h3>
//               </div>
//               <p className="text-sm text-gray-600 mb-6">
//                 Are you sure you want to remove this content image? This will
//                 mark the original image for deletion.
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowContentDeleteConfirm(false);
//                     setContentImageDeleteIndex(null);
//                   }}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={confirmRemoveContentImage}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, lazy, Suspense, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Upload,
  Plus,
  X,
  Image as ImageIcon,
  Send,
  ArrowLeft,
  Edit,
  CheckCircle,
  Eye,
  Clock,
  Globe,
  Users,
  BarChart3,
  Type,
  MessageSquare,
  Image as ImageLucide,
  AlertCircle,
} from "lucide-react";
import { showBlogUpdated } from "../utils/sweetAlertConfig"; // blog-specific toast

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

export default function EditBlog() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  // Edit state
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [existingImages, setExistingImages] = useState({
    cover: null,
    content: [],
  });

  const [showCoverDeleteConfirm, setShowCoverDeleteConfirm] = useState(false);
  const [showContentDeleteConfirm, setShowContentDeleteConfirm] =
    useState(false);
  const [contentImageDeleteIndex, setContentImageDeleteIndex] = useState(null);

  const API_BASE_URL = "https://api.houseofresha.com";

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/uploads")) {
      return `${API_BASE_URL}${imagePath}`;
    }
    return `${API_BASE_URL}/${imagePath}`;
  };

  useEffect(() => {
    fetchBlogData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBlogData = async () => {
    try {
      setLoadingBlog(true);
      const res = await fetch(`${API_BASE_URL}/blogs/${id}`);
      if (!res.ok) throw new Error("Failed to fetch blog");
      const result = await res.json();
      const blog = result.data || result;

      console.log("Fetched blog:", blog);

      setFormData({
        title: blog.title || "",
        description: blog.description || "",
        coverImage: null,
        content:
          blog.content && blog.content.length > 0
            ? blog.content.map((item, idx) => ({
                text: item.text || "",
                img: null,
                originalImagePath: item.img || null,
              }))
            : [{ text: "", img: null, originalImagePath: null }],
      });

      // Set cover preview
      if (blog.coverImage) {
        setCoverPreview(getImageUrl(blog.coverImage));
        setExistingImages((prev) => ({ ...prev, cover: blog.coverImage }));
      }

      // Set content previews
      if (blog.content) {
        const previews = blog.content.map((item) =>
          item.img ? getImageUrl(item.img) : null
        );
        setContentPreviews(previews.length ? previews : [null]);

        const contentImagePaths = blog.content.map((item) => item.img || null);
        setExistingImages((prev) => ({
          ...prev,
          content: contentImagePaths,
        }));
      } else {
        setContentPreviews([null]);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to load blog data",
      });
    } finally {
      setLoadingBlog(false);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage({ type: "error", text: "File size must be less than 10MB" });
        return;
      }

      // Set new file and preview
      setFormData((prev) => ({ ...prev, coverImage: file }));
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);

      // Clear existing cover from state (new upload replaces it)
      setExistingImages((prev) => ({ ...prev, cover: null }));
    }
  };

  const handleContentChange = (index, field, value) => {
    setFormData((prev) => {
      const newContent = [...prev.content];
      newContent[index] = { ...newContent[index], [field]: value };
      return { ...prev, content: newContent };
    });
  };

  const handleContentImageChange = (index, file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 10MB" });
      return;
    }

    setFormData((prev) => {
      const newContent = [...prev.content];
      newContent[index] = {
        ...newContent[index],
        img: file,
        // Keep originalImagePath for tracking
      };
      return { ...prev, content: newContent };
    });

    setContentPreviews((prev) => {
      const newPreviews = [...prev];
      if (file) {
        newPreviews[index] = URL.createObjectURL(file);
      } else {
        newPreviews[index] = null;
        // Clean up blob URL if exists
        if (prev[index] && prev[index].startsWith("blob:")) {
          URL.revokeObjectURL(prev[index]);
        }
      }
      return newPreviews;
    });

    // If uploading a new file, clear the existing image reference
    if (file) {
      setExistingImages((prev) => {
        const newContent = [...prev.content];
        newContent[index] = null;
        return { ...prev, content: newContent };
      });
    }
  };

  const handleRemoveContentImage = (index) => {
    setContentImageDeleteIndex(index);
    setShowContentDeleteConfirm(true);
  };

  const confirmRemoveContentImage = () => {
    const index = contentImageDeleteIndex;
    if (index === null) return;

    // Clear the uploaded file
    setFormData((prev) => {
      const newContent = [...prev.content];
      newContent[index] = { ...newContent[index], img: null };
      return { ...prev, content: newContent };
    });

    // Clear preview and clean up blob URL
    setContentPreviews((prev) => {
      const newPreviews = [...prev];
      if (newPreviews[index] && newPreviews[index].startsWith("blob:")) {
        URL.revokeObjectURL(newPreviews[index]);
      }
      newPreviews[index] = null;
      return newPreviews;
    });

    // Clear existing image reference
    setExistingImages((prev) => {
      const newContent = [...prev.content];
      newContent[index] = null;
      return { ...prev, content: newContent };
    });

    setShowContentDeleteConfirm(false);
    setContentImageDeleteIndex(null);
  };

  const addContentBlock = () => {
    setFormData((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        { text: "", img: null, originalImagePath: null },
      ],
    }));
    setContentPreviews((prev) => [...prev, null]);
    setExistingImages((prev) => ({
      ...prev,
      content: [...prev.content, null],
    }));
  };

  const removeContentBlock = (index) => {
    if (formData.content.length === 1) {
      setMessage({
        type: "error",
        text: "At least one content section is required",
      });
      return;
    }

    // Clean up blob URL if exists
    if (contentPreviews[index] && contentPreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(contentPreviews[index]);
    }

    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));

    setContentPreviews((prev) => prev.filter((_, i) => i !== index));

    setExistingImages((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
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

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());

      // Handle cover image
      if (formData.coverImage) {
        // New cover image uploaded
        formDataToSend.append("cover", formData.coverImage);
      } else if (!existingImages.cover) {
        // Cover was removed (original existed but now null)
        formDataToSend.append("removeCover", "1");
      }
      // If existingImages.cover exists but no new coverImage, keep the existing one

      // Prepare content payload
      const contentPayload = formData.content.map((block, index) => {
        const payload = { text: block.text || "" };

        // Handle content images
        if (block.img) {
          // New image uploaded for this section
          formDataToSend.append(`contentImages[${index}]`, block.img);
          payload.img = ""; // Placeholder, server will assign new path
        } else if (existingImages.content[index]) {
          // Keep existing image
          payload.img = existingImages.content[index];
        } else {
          // No image in this section
          payload.img = null;
        }

        return payload;
      });

      // Add removed content image indices
      const removedIndices = existingImages.content
        .map((img, index) =>
          img && !formData.content[index]?.img ? index : null
        )
        .filter((index) => index !== null);

      if (removedIndices.length > 0) {
        formDataToSend.append(
          "removedContentIndices",
          JSON.stringify(removedIndices)
        );
      }

      formDataToSend.append("content", JSON.stringify(contentPayload));

      // Debug: log what we're sending
      console.log("Sending FormData:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(key, `File: ${value.name} (${value.type})`);
        } else {
          console.log(key, value);
        }
      }

      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: "PATCH",
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update blog");
      }

      setMessage({
        type: "success",
        text: "Blog updated successfully! Redirecting...",
      });

      try {
        await showBlogUpdated();
      } catch (e) {
        // ignore toast errors
      }

      // Navigate after short delay
      setTimeout(() => {
        navigate("/blogs");
      }, 1500);
    } catch (error) {
      console.error("Update error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update blog. Please try again.",
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

  if (loadingBlog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

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
                <span className="font-medium">Back to Blogs</span>
              </button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Edit Blog Post
                </h1>
                <p className="text-sm text-gray-600">
                  Update your existing blog content
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const hasRequiredFields =
                    formData.title && formData.description;
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
                disabled={loading || !formData.title || !formData.description}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Update Blog
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
            icon={Edit}
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
            value="Editing"
            color="bg-yellow-500"
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
                    Update your blog title
                  </p>
                </div>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
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
                    Update your blog description
                  </p>
                </div>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
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
                    Update cover image (Optional)
                  </p>
                  {existingImages.cover &&
                    !coverPreview?.startsWith("blob:") && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current image will be kept if not replaced
                      </p>
                    )}
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
                      onClick={() => setShowCoverDeleteConfirm(true)}
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
                      {existingImages.cover
                        ? "Replace cover image"
                        : "Upload cover image"}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      JPG, PNG up to 10MB
                    </p>
                    <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                      {existingImages.cover ? "Replace File" : "Choose File"}
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
                      {(existingImages.content[index] ||
                        contentPreviews[index]) && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Has Image
                        </span>
                      )}
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
                          onClick={() => handleRemoveContentImage(index)}
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
                          {existingImages.content[index]
                            ? "Replace image"
                            : "Add image (Optional)"}
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG up to 10MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleContentImageChange(index, file);
                            }
                          }}
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
              <h3 className="font-bold text-gray-900 mb-4">Update Progress</h3>
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
                          formData.content.some((b) => b.text.trim()),
                        ].filter(Boolean).length
                      }
                      /3
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
                            formData.content.some((b) => b.text.trim()),
                          ].filter(Boolean).length /
                            3) *
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
                    <span className="text-sm">Title updated</span>
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
                    <span className="text-sm">Description updated</span>
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
                    <span className="text-sm">Content updated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Editing Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Type className="w-3 h-3 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Keep titles engaging and under 60 characters
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-3 h-3 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Descriptions should be 150-200 characters for SEO
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ImageLucide className="w-3 h-3 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    High-quality images improve engagement
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-3 h-3 text-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Breaking content into sections improves readability
                  </p>
                </div>
              </div>
            </div>

            {/* Update Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Save Changes</h3>
              <p className="text-sm text-gray-600 mb-6">
                Your updates will be saved immediately. The blog will be updated
                with your changes.
              </p>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.title || !formData.description}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Update Blog
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Changes will be visible immediately
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image Delete Confirmation Modal */}
      {showCoverDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Remove Cover Image</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to remove the cover image? This will delete
              the current cover image.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCoverDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, coverImage: null }));
                  if (coverPreview && coverPreview.startsWith("blob:")) {
                    URL.revokeObjectURL(coverPreview);
                  }
                  setCoverPreview(null);
                  setExistingImages((prev) => ({ ...prev, cover: null }));
                  setShowCoverDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Image Delete Confirmation Modal */}
      {showContentDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Remove Content Image</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to remove this content image? This will
              delete the current image.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowContentDeleteConfirm(false);
                  setContentImageDeleteIndex(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemoveContentImage}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
