// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Upload,
//   Edit,
//   X,
//   ImageIcon,
//   FileText,
//   Save,
//   ArrowLeft,
//   Plus,
//   Trash2,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";

// const EditBlog = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     coverImage: null,
//     content: [{ text: "", img: null }],
//   });

//   const [coverPreview, setCoverPreview] = useState(null);
//   const [contentPreviews, setContentPreviews] = useState([null]);
//   const [loading, setLoading] = useState(false);
//   const [loadingBlog, setLoadingBlog] = useState(true);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [existingImages, setExistingImages] = useState({
//     cover: null,
//     content: [],
//   });

//   // Fetch blog data on component mount
//   useEffect(() => {
//     fetchBlogData();
//   }, [id]);

//   const fetchBlogData = async () => {
//     try {
//       setLoadingBlog(true);
//       const response = await fetch(`https://api.houseofresha.com/blogs/${id}`);

//       if (!response.ok) {
//         throw new Error("Failed to fetch blog data");
//       }

//       const result = await response.json();
//       const blog = result.data || result;

//       // Set form data
//       setFormData({
//         title: blog.title || "",
//         description: blog.description || "",
//         coverImage: null, // Keep as null, we'll handle existing image separately
//         content:
//           blog.content && blog.content.length > 0
//             ? blog.content.map((item) => ({
//                 text: item.text || "",
//                 img: null, // Keep as null for new uploads
//               }))
//             : [{ text: "", img: null }],
//       });

//       // Set existing images
//       if (blog.coverImage) {
//         const coverUrl = blog.coverImage.startsWith("http")
//           ? blog.coverImage
//           : `https://api.houseofresha.com/${blog.coverImage}`;
//         setCoverPreview(coverUrl);
//         setExistingImages((prev) => ({ ...prev, cover: blog.coverImage }));
//       }

//       // Set content image previews
//       if (blog.content) {
//         const previews = blog.content.map((item) => {
//           if (item.img) {
//             return item.img.startsWith("http")
//               ? item.img
//               : `https://api.houseofresha.com/${item.img}`;
//           }
//           return null;
//         });
//         setContentPreviews(previews);

//         // Store existing content image paths
//         const existingContentImages = blog.content.map(
//           (item) => item.img || null
//         );
//         setExistingImages((prev) => ({
//           ...prev,
//           content: existingContentImages,
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching blog:", error);
//       setMessage({
//         type: "error",
//         text: error.message || "Failed to load blog data",
//       });
//     } finally {
//       setLoadingBlog(false);
//     }
//   };

//   const handleCoverImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, coverImage: file }));

//       // Clean up previous preview if it was a blob URL
//       if (coverPreview && coverPreview.startsWith("blob:")) {
//         URL.revokeObjectURL(coverPreview);
//       }

//       const previewUrl = URL.createObjectURL(file);
//       setCoverPreview(previewUrl);
//     }
//   };

//   const handleContentChange = (index, field, value) => {
//     const newContent = [...formData.content];
//     newContent[index][field] = value;
//     setFormData((prev) => ({ ...prev, content: newContent }));
//   };

//   const handleContentImageChange = (index, file) => {
//     const newContent = [...formData.content];
//     newContent[index].img = file;
//     setFormData((prev) => ({ ...prev, content: newContent }));

//     const newPreviews = [...contentPreviews];

//     // Clean up previous preview if it was a blob URL
//     if (newPreviews[index] && newPreviews[index].startsWith("blob:")) {
//       URL.revokeObjectURL(newPreviews[index]);
//     }

//     newPreviews[index] = file ? URL.createObjectURL(file) : null;
//     setContentPreviews(newPreviews);
//   };

//   const addContentBlock = () => {
//     setFormData((prev) => ({
//       ...prev,
//       content: [...prev.content, { text: "", img: null }],
//     }));
//     setContentPreviews((prev) => [...prev, null]);
//     setExistingImages((prev) => ({
//       ...prev,
//       content: [...prev.content, null],
//     }));
//   };

//   const removeContentBlock = (index) => {
//     const newContent = formData.content.filter((_, i) => i !== index);
//     const newPreviews = contentPreviews.filter((_, i) => i !== index);
//     const newExisting = existingImages.content.filter((_, i) => i !== index);

//     // Clean up blob URL if it exists
//     if (contentPreviews[index] && contentPreviews[index].startsWith("blob:")) {
//       URL.revokeObjectURL(contentPreviews[index]);
//     }

//     setFormData((prev) => ({ ...prev, content: newContent }));
//     setContentPreviews(newPreviews);
//     setExistingImages((prev) => ({ ...prev, content: newExisting }));
//   };

//   const handleRemoveCoverImage = () => {
//     setFormData((prev) => ({ ...prev, coverImage: null }));

//     // Clean up blob URL if it exists
//     if (coverPreview && coverPreview.startsWith("blob:")) {
//       URL.revokeObjectURL(coverPreview);
//     }

//     setCoverPreview(null);
//     setExistingImages((prev) => ({ ...prev, cover: null }));
//   };

//   const handleRemoveContentImage = (index) => {
//     const newContent = [...formData.content];
//     newContent[index].img = null;
//     setFormData((prev) => ({ ...prev, content: newContent }));

//     const newPreviews = [...contentPreviews];

//     // Clean up blob URL if it exists
//     if (newPreviews[index] && newPreviews[index].startsWith("blob:")) {
//       URL.revokeObjectURL(newPreviews[index]);
//     }

//     newPreviews[index] = null;
//     setContentPreviews(newPreviews);

//     const newExisting = [...existingImages.content];
//     newExisting[index] = null;
//     setExistingImages((prev) => ({ ...prev, content: newExisting }));
//   };

//   const handleSubmit = async () => {
//     // Basic validation
//     if (!formData.title || !formData.description) {
//       setMessage({ type: "error", text: "Please fill in all required fields" });
//       return;
//     }

//     // Check if at least one content section has text
//     const hasContent = formData.content.some(
//       (block) => block.text.trim() !== ""
//     );
//     if (!hasContent) {
//       setMessage({
//         type: "error",
//         text: "Please add content to at least one section",
//       });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const fd = new FormData();

//       // Append basic fields
//       fd.append("title", formData.title);
//       fd.append("description", formData.description);

//       // Append cover image if exists (new upload)
//       if (formData.coverImage) {
//         fd.append("cover", formData.coverImage);
//       } else if (existingImages.cover) {
//         // If no new cover image but existing one exists, keep the existing
//         // We'll send the existing path in the content JSON
//       }

//       // Prepare content payload
//       const contentPayload = formData.content.map((block, index) => {
//         const payload = { text: block.text };

//         // If there's a new image file
//         if (block.img) {
//           // We'll upload the new file
//           fd.append(`contentImages[${index}]`, block.img);
//           // Set img as empty, backend will assign new path
//           payload.img = "";
//         }
//         // If there's an existing image path and no new upload
//         else if (existingImages.content[index]) {
//           payload.img = existingImages.content[index];
//         }
//         // If no image at all
//         else {
//           payload.img = "";
//         }

//         return payload;
//       });

//       // Append content as JSON
//       fd.append("content", JSON.stringify(contentPayload));

//       console.log("=== DEBUG: FormData being sent ===");
//       for (let [key, value] of fd.entries()) {
//         console.log(
//           `${key}:`,
//           value instanceof File ? `File: ${value.name}` : value
//         );
//       }

//       const response = await fetch(`https://api.houseofresha.com/blogs/${id}`, {
//         method: "PATCH", // Using PATCH method for update
//         body: fd, // Let browser set multipart headers
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to update blog");
//       }

//       setMessage({ type: "success", text: "Blog updated successfully!" });

//       // Redirect after success
//       setTimeout(() => {
//         navigate("/blogs");
//       }, 1500);
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

//   // Loading state
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
//         {/* Back Button */}
//         <button
//           onClick={navigateToBlogs}
//           className="mb-6 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition group"
//         >
//           <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//           Back to Blogs
//         </button>

//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
//             <h1 className="text-3xl font-bold text-white flex items-center gap-3">
//               <Edit className="w-8 h-8" />
//               Edit Blog Post
//             </h1>
//             <p className="text-indigo-100 mt-2">Update your blog post</p>
//           </div>

//           <div className="p-8 space-y-8">
//             {/* Message Alert */}
//             {message.text && (
//               <div
//                 className={`p-4 rounded-lg flex items-start gap-2 ${
//                   message.type === "success"
//                     ? "bg-green-50 text-green-800 border border-green-200"
//                     : "bg-red-50 text-red-800 border border-red-200"
//                 }`}
//               >
//                 {message.type === "error" && (
//                   <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//                 )}
//                 <span>{message.text}</span>
//                 <button
//                   onClick={() => setMessage({ type: "", text: "" })}
//                   className="ml-auto text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             )}

//             {/* Title */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Blog Title *
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData((prev) => ({ ...prev, title: e.target.value }))
//                 }
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//                 placeholder="Enter an engaging title..."
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 required
//                 value={formData.description}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     description: e.target.value,
//                   }))
//                 }
//                 rows={3}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
//                 placeholder="Brief description of your blog post..."
//               />
//             </div>

//             {/* Cover Image */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Cover Image
//                 <span className="text-gray-500 text-sm font-normal ml-2">
//                   (Leave empty to keep existing)
//                 </span>
//               </label>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 transition">
//                 {coverPreview ? (
//                   <div className="relative">
//                     <img
//                       src={coverPreview}
//                       alt="Cover preview"
//                       className="w-full h-64 object-cover rounded-lg"
//                     />
//                     <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       {formData.coverImage ? "New Image" : "Existing Image"}
//                     </div>
//                     <button
//                       type="button"
//                       onClick={handleRemoveCoverImage}
//                       className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ) : (
//                   <label className="flex flex-col items-center cursor-pointer">
//                     <Upload className="w-12 h-12 text-gray-400 mb-2" />
//                     <span className="text-sm text-gray-600">
//                       Click to change cover image
//                     </span>
//                     <span className="text-xs text-gray-500 mt-1">
//                       PNG, JPG up to 10MB
//                     </span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleCoverImageChange}
//                       className="hidden"
//                     />
//                   </label>
//                 )}
//               </div>
//             </div>

//             {/* Content Blocks */}
//             <div>
//               <div className="flex justify-between items-center mb-4">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Content Sections *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={addContentBlock}
//                   className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium"
//                   disabled={loading}
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
//                       <h3 className="font-semibold text-gray-700 flex items-center gap-2">
//                         <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">
//                           {index + 1}
//                         </span>
//                         Section {index + 1}
//                       </h3>
//                       <div className="flex gap-2">
//                         {formData.content.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeContentBlock(index)}
//                             className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 rounded"
//                             disabled={loading}
//                           >
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     <textarea
//                       value={block.text}
//                       onChange={(e) =>
//                         handleContentChange(index, "text", e.target.value)
//                       }
//                       rows={4}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none mb-4"
//                       placeholder="Write your content here..."
//                       disabled={loading}
//                     />

//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition">
//                       {contentPreviews[index] ? (
//                         <div className="relative">
//                           <img
//                             src={contentPreviews[index]}
//                             alt={`Content ${index}`}
//                             className="w-full h-48 object-cover rounded-lg"
//                           />
//                           <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                             {formData.content[index]?.img
//                               ? "New Image"
//                               : "Existing Image"}
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveContentImage(index)}
//                             className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
//                             disabled={loading}
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       ) : (
//                         <label
//                           className={`flex flex-col items-center ${
//                             loading
//                               ? "opacity-50 cursor-not-allowed"
//                               : "cursor-pointer"
//                           }`}
//                         >
//                           <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
//                           <span className="text-sm text-gray-600">
//                             {existingImages.content[index]
//                               ? "Change image"
//                               : "Add image (optional)"}
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
//                             disabled={loading}
//                           />
//                         </label>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex gap-4">
//               <button
//                 type="button"
//                 onClick={navigateToBlogs}
//                 disabled={loading}
//                 className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-5 h-5" />
//                     Update Blog Post
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditBlog;

import React, { useState, lazy, Suspense, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Upload,
  Plus,
  X,
  ImageIcon,
  FileText,
  Send,
  ArrowLeft,
  Edit,
  Save,
  Trash2,
  Loader2,
  AlertCircle,
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
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote"],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "blockquote",
    "link",
  ];

  return (
    <div
      className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
            <div className="text-gray-500">Loading editor...</div>
          </div>
        }
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || "Start writing..."}
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

export default function EditBlog() {
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

  // Edit-related state
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingBlog, setLoadingBlog] = useState(true);
  const [existingImages, setExistingImages] = useState({
    cover: null,
    content: [],
  });

  const API_BASE_URL = "https://api.houseofresha.com";

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

      setFormData({
        title: blog.title || "",
        description: blog.description || "",
        coverImage: null,
        content:
          blog.content && blog.content.length > 0
            ? blog.content.map((item) => ({ text: item.text || "", img: null }))
            : [{ text: "", img: null }],
      });

      if (blog.coverImage) {
        const coverUrl = blog.coverImage.startsWith("http")
          ? blog.coverImage
          : `${API_BASE_URL}/${blog.coverImage}`;
        setCoverPreview(coverUrl);
        setExistingImages((prev) => ({ ...prev, cover: blog.coverImage }));
      }

      if (blog.content) {
        const previews = blog.content.map((item) =>
          item.img
            ? item.img.startsWith("http")
              ? item.img
              : `${API_BASE_URL}/${item.img}`
            : null
        );
        setContentPreviews(previews.length ? previews : [null]);
        setExistingImages((prev) => ({
          ...prev,
          content: blog.content.map((item) => item.img || null),
        }));
      } else {
        setContentPreviews([null]);
      }
    } catch (e) {
      console.error(e);
      setMessage({
        type: "error",
        text: e.message || "Failed to load blog data",
      });
    } finally {
      setLoadingBlog(false);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleContentChange = (index, field, value) => {
    const newContent = [...formData.content];
    newContent[index][field] = value;
    setFormData({ ...formData, content: newContent });
  };

  const handleContentImageChange = (index, file) => {
    const newContent = [...formData.content];
    newContent[index].img = file;
    setFormData({ ...formData, content: newContent });

    const newPreviews = [...contentPreviews];
    newPreviews[index] = file ? URL.createObjectURL(file) : null;
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
    const newContent = formData.content.filter((_, i) => i !== index);
    const newPreviews = contentPreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, content: newContent });
    setContentPreviews(newPreviews);
  };

  const handleSubmit = async () => {
    // For editing we only require title & description
    if (!formData.title || !formData.description) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const fd = new FormData();

      fd.append("title", formData.title);
      fd.append("description", formData.description);

      // Append new cover file only if user selected one
      if (formData.coverImage) {
        fd.append("cover", formData.coverImage);
      }

      // Prepare content payload: include existing image paths or empty string
      const contentPayload = formData.content.map((block, index) => {
        const payload = { text: block.text };

        if (block.img) {
          // New file upload
          fd.append(`contentImages[${index}]`, block.img);
          payload.img = "";
        } else if (existingImages.content[index]) {
          // Keep existing image path
          payload.img = existingImages.content[index];
        } else {
          payload.img = "";
        }

        return payload;
      });

      fd.append("content", JSON.stringify(contentPayload));

      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: "PATCH",
        body: fd,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update blog");
      }

      setMessage({ type: "success", text: "Blog updated successfully!" });
      setTimeout(() => navigate("/blogs"), 1200);
    } catch (err) {
      console.error("Update error:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to update blog. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToBlogs = () => {
    navigate("/blogs");
  };

  if (loadingBlog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={navigateToBlogs}
          className="mb-6 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Blogs
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Edit className="w-8 h-8" />
              Edit Blog Post
            </h1>
            <p className="text-indigo-100 mt-2">Update your blog post</p>
          </div>

          <div className="p-8 space-y-8">
            {message.text && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter an engaging title..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                placeholder="Brief description of your blog post..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 transition">
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, coverImage: null });
                        setCoverPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload cover image
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Content Sections
                </label>
                <button
                  type="button"
                  onClick={addContentBlock}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </button>
              </div>

              <div className="space-y-6">
                {formData.content.map((block, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-700">
                        Section {index + 1}
                      </h3>
                      {formData.content.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeContentBlock(index)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="mb-4">
                      <RichTextEditor
                        value={block.text}
                        onChange={(value) =>
                          handleContentChange(index, "text", value)
                        }
                        placeholder="Write your content here with rich formatting..."
                        height={300}
                      />
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition">
                      {contentPreviews[index] ? (
                        <div className="relative">
                          <img
                            src={contentPreviews[index]}
                            alt={`Content ${index}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleContentImageChange(index, null)
                            }
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center cursor-pointer">
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Add image (optional)
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 10MB
                          </span>
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

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publish Blog Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
