// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import {
//   Edit,
//   Upload,
//   X,
//   AlertCircle,
//   ArrowLeft,
//   Loader2,
//   Save,
//   Image,
//   Type,
//   Plus,
//   Trash2,
//   FileText,
// } from "lucide-react";

// const EditBlog = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     coverImage: null,
//     content: [{ text: "", img: null, imgUrl: "" }], // Added imgUrl field
//   });
//   const [existingData, setExistingData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updateLoading, setUpdateLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [coverPreview, setCoverPreview] = useState(null);
//   const [contentPreviews, setContentPreviews] = useState([]);
//   const [existingContentImages, setExistingContentImages] = useState([]);

//   const API_BASE_URL = "https://api.houseofresha.com";

//   // Fetch blog details on component mount
//   useEffect(() => {
//     fetchBlogDetails();
//   }, [id]);

//   const fetchBlogDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       console.log("Fetching blog with ID:", id);

//       // Try to fetch the specific blog
//       const response = await axios.get(`${API_BASE_URL}/blogs`);

//       if (response.data.success && Array.isArray(response.data.data)) {
//         const allBlogs = response.data.data;
//         const blog = allBlogs.find((b) => b._id === id);

//         if (blog) {
//           console.log("Found blog:", blog);
//           setExistingData(blog);

//           // Set form data from blog
//           const contentSections =
//             blog.content && blog.content.length > 0
//               ? blog.content.map((item) => ({
//                   text: item.text || "",
//                   img: null, // We'll handle new uploads separately
//                   imgUrl: item.img || "", // Store existing image URL
//                 }))
//               : [{ text: "", img: null, imgUrl: "" }];

//           setFormData({
//             title: blog.title || "",
//             description: blog.description || "",
//             coverImage: null,
//             content: contentSections,
//           });

//           // Set cover image preview if exists
//           if (blog.coverImage) {
//             const coverUrl = blog.coverImage.startsWith("http")
//               ? blog.coverImage
//               : `${API_BASE_URL}/${blog.coverImage}`;
//             setCoverPreview(coverUrl);
//           }

//           // Store existing content images for reference
//           if (blog.content) {
//             const existingImages = blog.content.map((item) =>
//               item.img ? item.img : null
//             );
//             setExistingContentImages(existingImages);

//             // Initialize content previews with existing images
//             const previews = blog.content.map((item, index) => {
//               if (item.img) {
//                 // Check if it's already a full URL
//                 if (item.img.startsWith("http")) {
//                   return item.img;
//                 } else {
//                   return `${API_BASE_URL}/${item.img}`;
//                 }
//               }
//               return null;
//             });
//             setContentPreviews(previews);
//           }
//         } else {
//           throw new Error("Blog not found");
//         }
//       } else {
//         throw new Error("Invalid API response format");
//       }
//     } catch (error) {
//       console.error("Error fetching blog details:", error);
//       setError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to load blog details. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle text input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle content text changes
//   const handleContentTextChange = (index, value) => {
//     const updatedContent = [...formData.content];
//     updatedContent[index].text = value;
//     setFormData((prev) => ({
//       ...prev,
//       content: updatedContent,
//     }));
//   };

//   // Handle cover image change
//   const handleCoverImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         setError("Please select a valid image file");
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         setError("Cover image size should be less than 5MB");
//         return;
//       }

//       setFormData((prev) => ({
//         ...prev,
//         coverImage: file,
//       }));

//       // Clean up previous preview if it was a blob URL
//       if (coverPreview && coverPreview.startsWith("blob:")) {
//         URL.revokeObjectURL(coverPreview);
//       }

//       const previewUrl = URL.createObjectURL(file);
//       setCoverPreview(previewUrl);
//       setError(null);
//     }
//   };

//   // Handle content image change
//   const handleContentImageChange = (index, e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith("image/")) {
//         setError("Please select a valid image file");
//         return;
//       }

//       if (file.size > 3 * 1024 * 1024) {
//         setError("Content image size should be less than 3MB");
//         return;
//       }

//       const updatedContent = [...formData.content];
//       updatedContent[index] = {
//         ...updatedContent[index],
//         img: file, // Store the file object for upload
//         imgUrl: "", // Clear existing URL when uploading new file
//       };
//       setFormData((prev) => ({
//         ...prev,
//         content: updatedContent,
//       }));

//       // Update preview
//       const updatedPreviews = [...contentPreviews];
//       // Clean up previous preview if it was a blob URL
//       if (
//         updatedPreviews[index] &&
//         updatedPreviews[index].startsWith("blob:")
//       ) {
//         URL.revokeObjectURL(updatedPreviews[index]);
//       }
//       updatedPreviews[index] = URL.createObjectURL(file);
//       setContentPreviews(updatedPreviews);
//       setError(null);
//     }
//   };

//   // Add new content section
//   const addContentSection = () => {
//     setFormData((prev) => ({
//       ...prev,
//       content: [...prev.content, { text: "", img: null, imgUrl: "" }],
//     }));
//     setContentPreviews([...contentPreviews, null]);
//     setExistingContentImages([...existingContentImages, null]);
//   };

//   // Remove content section
//   const removeContentSection = (index) => {
//     const updatedContent = [...formData.content];
//     updatedContent.splice(index, 1);
//     setFormData((prev) => ({
//       ...prev,
//       content: updatedContent,
//     }));

//     const updatedPreviews = [...contentPreviews];
//     // Clean up blob URL if it exists
//     if (updatedPreviews[index] && updatedPreviews[index].startsWith("blob:")) {
//       URL.revokeObjectURL(updatedPreviews[index]);
//     }
//     updatedPreviews.splice(index, 1);
//     setContentPreviews(updatedPreviews);

//     // Also update existing content images array
//     const updatedExisting = [...existingContentImages];
//     updatedExisting.splice(index, 1);
//     setExistingContentImages(updatedExisting);
//   };

//   // Remove cover image
//   const handleRemoveCoverImage = () => {
//     setFormData((prev) => ({
//       ...prev,
//       coverImage: null,
//     }));
//     // Clean up blob URL if it exists
//     if (coverPreview && coverPreview.startsWith("blob:")) {
//       URL.revokeObjectURL(coverPreview);
//     }
//     // Reset to existing cover image if available
//     if (existingData?.coverImage) {
//       const coverUrl = existingData.coverImage.startsWith("http")
//         ? existingData.coverImage
//         : `${API_BASE_URL}/${existingData.coverImage}`;
//       setCoverPreview(coverUrl);
//     } else {
//       setCoverPreview(null);
//     }
//   };

//   // Remove content image
//   const handleRemoveContentImage = (index) => {
//     const updatedContent = [...formData.content];
//     updatedContent[index] = {
//       ...updatedContent[index],
//       img: null,
//       imgUrl: "", // Clear the image URL
//     };
//     setFormData((prev) => ({
//       ...prev,
//       content: updatedContent,
//     }));

//     const updatedPreviews = [...contentPreviews];
//     // Clean up blob URL if it exists
//     if (updatedPreviews[index] && updatedPreviews[index].startsWith("blob:")) {
//       URL.revokeObjectURL(updatedPreviews[index]);
//     }
//     // Clear the preview
//     updatedPreviews[index] = null;
//     setContentPreviews(updatedPreviews);

//     // Also clear from existing content images
//     const updatedExisting = [...existingContentImages];
//     updatedExisting[index] = null;
//     setExistingContentImages(updatedExisting);
//   };

//   // Handle form submission using PATCH method
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       setUpdateLoading(true);

//       const submitData = new FormData();

//       submitData.append("title", formData.title);
//       submitData.append("description", formData.description);

//       // Cover image (KEY MUST BE `cover`)
//       if (formData.coverImage) {
//         submitData.append("cover", formData.coverImage);
//       }

//       // Build content JSON with proper image handling
//       const contentPayload = formData.content.map((section, index) => {
//         const payload = {
//           text: section.text,
//         };

//         // If there's a new image file, we'll mark it for upload
//         if (section.img instanceof File) {
//           // For new images, we'll send the file separately
//           // The backend should handle associating it
//           payload.hasNewImage = true;
//           payload.imageIndex = index;
//         }
//         // If there's an existing image URL, keep it
//         else if (section.imgUrl) {
//           payload.img = section.imgUrl;
//         }
//         // If neither, set img to null
//         else {
//           payload.img = null;
//         }

//         return payload;
//       });

//       submitData.append("content", JSON.stringify(contentPayload));

//       // Append NEW content image files with proper naming
//       formData.content.forEach((section, index) => {
//         if (section.img instanceof File) {
//           submitData.append(`contentImage_${index}`, section.img);
//         }
//       });

//       console.log("Submitting data:");
//       for (let [key, value] of submitData.entries()) {
//         console.log(key, value);
//       }

//       const response = await axios.patch(
//         `${API_BASE_URL}/blogs/${id}`,
//         submitData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("Update response:", response.data);

//       if (response.data.success) {
//         navigate("/blogs");
//       } else {
//         throw new Error(response.data.message || "Update failed");
//       }
//     } catch (error) {
//       console.error("Update error:", error.response?.data || error);
//       setError(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to update blog. Please check your data and try again."
//       );
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
//             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0"></div>
//           </div>
//           <p className="text-gray-600 mt-4">Loading blog details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 mb-6 border border-white/20">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate("/blogs")}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               disabled={updateLoading}
//             >
//               <ArrowLeft className="w-5 h-5 text-gray-600" />
//             </button>
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//                   <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//                 </div>
//                 <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   Edit Blog Post
//                 </h1>
//               </div>
//               <p className="text-sm sm:text-base text-gray-600">
//                 Update your blog post: {existingData?.title || "Untitled Blog"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 border border-white/20">
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//               <div className="flex-1">
//                 <p className="text-sm">{error}</p>
//               </div>
//               <button
//                 onClick={() => setError(null)}
//                 className="text-red-500 hover:text-red-700"
//                 disabled={updateLoading}
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Title Field */}
//             <div>
//               <label
//                 htmlFor="title"
//                 className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
//               >
//                 <Type className="w-4 h-4" />
//                 Blog Title *
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="Enter blog title"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                 disabled={updateLoading}
//                 required
//               />
//             </div>

//             {/* Description Field */}
//             <div>
//               <label
//                 htmlFor="description"
//                 className="block text-sm font-semibold text-gray-700 mb-2"
//               >
//                 <FileText className="w-4 h-4 inline mr-2" />
//                 Description *
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Enter blog description"
//                 rows="4"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
//                 disabled={updateLoading}
//                 required
//               />
//             </div>

//             {/* Cover Image Section */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Cover Image
//               </label>
//               <div className="space-y-4">
//                 {coverPreview ? (
//                   <div className="relative rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
//                     <img
//                       src={coverPreview}
//                       alt="Cover preview"
//                       className="w-full h-64 object-cover"
//                       onError={(e) => {
//                         e.target.src =
//                           "https://via.placeholder.com/800x400?text=Cover+Image+Not+Found";
//                       }}
//                     />
//                     <button
//                       type="button"
//                       onClick={handleRemoveCoverImage}
//                       className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
//                       disabled={updateLoading}
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                     <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       {formData.coverImage ? "New Image" : "Existing Image"}
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">
//                     No cover image available
//                   </p>
//                 )}

//                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleCoverImageChange}
//                     className="hidden"
//                     id="cover-upload"
//                     disabled={updateLoading}
//                   />
//                   <label
//                     htmlFor="cover-upload"
//                     className={`cursor-pointer flex flex-col items-center ${
//                       updateLoading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
//                       <Image className="w-6 h-6 text-blue-600" />
//                     </div>
//                     <p className="text-gray-700 font-medium mb-1 text-sm">
//                       {coverPreview
//                         ? "Click to change cover image"
//                         : "Click to upload cover image"}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       JPG, PNG, or WebP (Max 5MB)
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Leave empty to keep existing image
//                     </p>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {/* Content Sections */}
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Content Sections *
//                 </label>
//                 <button
//                   type="button"
//                   onClick={addContentSection}
//                   className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
//                   disabled={updateLoading}
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Section
//                 </button>
//               </div>

//               {formData.content.map((section, index) => (
//                 <div
//                   key={index}
//                   className="mb-6 p-4 border-2 border-gray-200 rounded-xl"
//                 >
//                   <div className="flex justify-between items-start mb-4">
//                     <h3 className="text-sm font-semibold text-gray-700">
//                       Section {index + 1}
//                     </h3>
//                     {formData.content.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeContentSection(index)}
//                         className="text-red-500 hover:text-red-700 p-1"
//                         disabled={updateLoading}
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     )}
//                   </div>

//                   <div className="space-y-4">
//                     {/* Text Input */}
//                     <div>
//                       <label className="block text-xs font-medium text-gray-600 mb-1">
//                         Text Content *
//                       </label>
//                       <textarea
//                         value={section.text}
//                         onChange={(e) =>
//                           handleContentTextChange(index, e.target.value)
//                         }
//                         placeholder="Enter text content for this section"
//                         rows="3"
//                         className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-sm"
//                         disabled={updateLoading}
//                         required
//                       />
//                     </div>

//                     {/* Image Upload */}
//                     <div>
//                       <label className="block text-xs font-medium text-gray-600 mb-1">
//                         Section Image (Optional)
//                       </label>
//                       <div className="space-y-2">
//                         {contentPreviews[index] ? (
//                           <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-300">
//                             <img
//                               src={contentPreviews[index]}
//                               alt={`Section ${index + 1} preview`}
//                               className="w-full h-40 object-cover"
//                               onError={(e) => {
//                                 e.target.src =
//                                   "https://via.placeholder.com/400x200?text=Image+Not+Found";
//                               }}
//                             />
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveContentImage(index)}
//                               className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md transition-colors"
//                               disabled={updateLoading}
//                             >
//                               <X className="w-3 h-3" />
//                             </button>
//                             <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
//                               {formData.content[index]?.img instanceof File
//                                 ? "New Image"
//                                 : "Existing Image"}
//                             </div>
//                           </div>
//                         ) : (
//                           <p className="text-xs text-gray-500">
//                             No image for this section
//                           </p>
//                         )}

//                         <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => handleContentImageChange(index, e)}
//                             className="hidden"
//                             id={`content-image-${index}`}
//                             disabled={updateLoading}
//                           />
//                           <label
//                             htmlFor={`content-image-${index}`}
//                             className={`cursor-pointer flex flex-col items-center ${
//                               updateLoading
//                                 ? "opacity-50 cursor-not-allowed"
//                                 : ""
//                             }`}
//                           >
//                             <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-2">
//                               <Image className="w-4 h-4 text-blue-500" />
//                             </div>
//                             <p className="text-xs text-gray-700">
//                               {contentPreviews[index]
//                                 ? "Change image"
//                                 : "Add image"}
//                             </p>
//                             <p className="text-xs text-gray-500 mt-1">
//                               Leave empty to keep existing image
//                             </p>
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 pt-4">
//               <button
//                 type="button"
//                 onClick={() => navigate("/blogs")}
//                 disabled={updateLoading}
//                 className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={updateLoading}
//                 className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
//               >
//                 {updateLoading ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Updating Blog...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-5 h-5" />
//                     Update Blog Post
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditBlog;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Upload,
  Edit,
  X,
  ImageIcon,
  FileText,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const EditBlog = () => {
  const { id } = useParams();
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
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [existingImages, setExistingImages] = useState({
    cover: null,
    content: [],
  });

  // Fetch blog data on component mount
  useEffect(() => {
    fetchBlogData();
  }, [id]);

  const fetchBlogData = async () => {
    try {
      setLoadingBlog(true);
      const response = await fetch(`https://api.houseofresha.com/blogs/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch blog data");
      }

      const result = await response.json();
      const blog = result.data || result;

      // Set form data
      setFormData({
        title: blog.title || "",
        description: blog.description || "",
        coverImage: null, // Keep as null, we'll handle existing image separately
        content:
          blog.content && blog.content.length > 0
            ? blog.content.map((item) => ({
                text: item.text || "",
                img: null, // Keep as null for new uploads
              }))
            : [{ text: "", img: null }],
      });

      // Set existing images
      if (blog.coverImage) {
        const coverUrl = blog.coverImage.startsWith("http")
          ? blog.coverImage
          : `https://api.houseofresha.com/${blog.coverImage}`;
        setCoverPreview(coverUrl);
        setExistingImages((prev) => ({ ...prev, cover: blog.coverImage }));
      }

      // Set content image previews
      if (blog.content) {
        const previews = blog.content.map((item) => {
          if (item.img) {
            return item.img.startsWith("http")
              ? item.img
              : `https://api.houseofresha.com/${item.img}`;
          }
          return null;
        });
        setContentPreviews(previews);

        // Store existing content image paths
        const existingContentImages = blog.content.map(
          (item) => item.img || null
        );
        setExistingImages((prev) => ({
          ...prev,
          content: existingContentImages,
        }));
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
      setFormData((prev) => ({ ...prev, coverImage: file }));

      // Clean up previous preview if it was a blob URL
      if (coverPreview && coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }

      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
    }
  };

  const handleContentChange = (index, field, value) => {
    const newContent = [...formData.content];
    newContent[index][field] = value;
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleContentImageChange = (index, file) => {
    const newContent = [...formData.content];
    newContent[index].img = file;
    setFormData((prev) => ({ ...prev, content: newContent }));

    const newPreviews = [...contentPreviews];

    // Clean up previous preview if it was a blob URL
    if (newPreviews[index] && newPreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(newPreviews[index]);
    }

    newPreviews[index] = file ? URL.createObjectURL(file) : null;
    setContentPreviews(newPreviews);
  };

  const addContentBlock = () => {
    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, { text: "", img: null }],
    }));
    setContentPreviews((prev) => [...prev, null]);
    setExistingImages((prev) => ({
      ...prev,
      content: [...prev.content, null],
    }));
  };

  const removeContentBlock = (index) => {
    const newContent = formData.content.filter((_, i) => i !== index);
    const newPreviews = contentPreviews.filter((_, i) => i !== index);
    const newExisting = existingImages.content.filter((_, i) => i !== index);

    // Clean up blob URL if it exists
    if (contentPreviews[index] && contentPreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(contentPreviews[index]);
    }

    setFormData((prev) => ({ ...prev, content: newContent }));
    setContentPreviews(newPreviews);
    setExistingImages((prev) => ({ ...prev, content: newExisting }));
  };

  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({ ...prev, coverImage: null }));

    // Clean up blob URL if it exists
    if (coverPreview && coverPreview.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview);
    }

    setCoverPreview(null);
    setExistingImages((prev) => ({ ...prev, cover: null }));
  };

  const handleRemoveContentImage = (index) => {
    const newContent = [...formData.content];
    newContent[index].img = null;
    setFormData((prev) => ({ ...prev, content: newContent }));

    const newPreviews = [...contentPreviews];

    // Clean up blob URL if it exists
    if (newPreviews[index] && newPreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(newPreviews[index]);
    }

    newPreviews[index] = null;
    setContentPreviews(newPreviews);

    const newExisting = [...existingImages.content];
    newExisting[index] = null;
    setExistingImages((prev) => ({ ...prev, content: newExisting }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title || !formData.description) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    // Check if at least one content section has text
    const hasContent = formData.content.some(
      (block) => block.text.trim() !== ""
    );
    if (!hasContent) {
      setMessage({
        type: "error",
        text: "Please add content to at least one section",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const fd = new FormData();

      // Append basic fields
      fd.append("title", formData.title);
      fd.append("description", formData.description);

      // Append cover image if exists (new upload)
      if (formData.coverImage) {
        fd.append("cover", formData.coverImage);
      } else if (existingImages.cover) {
        // If no new cover image but existing one exists, keep the existing
        // We'll send the existing path in the content JSON
      }

      // Prepare content payload
      const contentPayload = formData.content.map((block, index) => {
        const payload = { text: block.text };

        // If there's a new image file
        if (block.img) {
          // We'll upload the new file
          fd.append(`contentImages[${index}]`, block.img);
          // Set img as empty, backend will assign new path
          payload.img = "";
        }
        // If there's an existing image path and no new upload
        else if (existingImages.content[index]) {
          payload.img = existingImages.content[index];
        }
        // If no image at all
        else {
          payload.img = "";
        }

        return payload;
      });

      // Append content as JSON
      fd.append("content", JSON.stringify(contentPayload));

      console.log("=== DEBUG: FormData being sent ===");
      for (let [key, value] of fd.entries()) {
        console.log(
          `${key}:`,
          value instanceof File ? `File: ${value.name}` : value
        );
      }

      const response = await fetch(`https://api.houseofresha.com/blogs/${id}`, {
        method: "PATCH", // Using PATCH method for update
        body: fd, // Let browser set multipart headers
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update blog");
      }

      setMessage({ type: "success", text: "Blog updated successfully!" });

      // Redirect after success
      setTimeout(() => {
        navigate("/blogs");
      }, 1500);
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

  // Loading state
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
        {/* Back Button */}
        <button
          onClick={navigateToBlogs}
          className="mb-6 flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Blogs
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Edit className="w-8 h-8" />
              Edit Blog Post
            </h1>
            <p className="text-indigo-100 mt-2">Update your blog post</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Message Alert */}
            {message.text && (
              <div
                className={`p-4 rounded-lg flex items-start gap-2 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.type === "error" && (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <span>{message.text}</span>
                <button
                  onClick={() => setMessage({ type: "", text: "" })}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter an engaging title..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                placeholder="Brief description of your blog post..."
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Image
                <span className="text-gray-500 text-sm font-normal ml-2">
                  (Leave empty to keep existing)
                </span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 transition">
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {formData.coverImage ? "New Image" : "Existing Image"}
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoverImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to change cover image
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </span>
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

            {/* Content Blocks */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Content Sections *
                </label>
                <button
                  type="button"
                  onClick={addContentBlock}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium"
                  disabled={loading}
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
                      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        Section {index + 1}
                      </h3>
                      <div className="flex gap-2">
                        {formData.content.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeContentBlock(index)}
                            className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 rounded"
                            disabled={loading}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <textarea
                      value={block.text}
                      onChange={(e) =>
                        handleContentChange(index, "text", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none mb-4"
                      placeholder="Write your content here..."
                      disabled={loading}
                    />

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition">
                      {contentPreviews[index] ? (
                        <div className="relative">
                          <img
                            src={contentPreviews[index]}
                            alt={`Content ${index}`}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {formData.content[index]?.img
                              ? "New Image"
                              : "Existing Image"}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveContentImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                            disabled={loading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label
                          className={`flex flex-col items-center ${
                            loading
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {existingImages.content[index]
                              ? "Change image"
                              : "Add image (optional)"}
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
                            disabled={loading}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={navigateToBlogs}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Blog Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
