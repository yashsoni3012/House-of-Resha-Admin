import React, { useState, lazy, Suspense, useEffect } from "react";
import {
  Upload,
  Plus,
  X,
  ImageIcon,
  FileText,
  Send,
  ArrowLeft,
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
      [{ indent: "-1" }, { indent: "+1" }],
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
    "blockquote",
    "list", // ✅ ONLY list
    "indent",
    "link",
    "image",
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

export default function AddBlogs() {
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
    if (!formData.title || !formData.description || !formData.coverImage) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("cover", formData.coverImage);

      const contentArray = formData.content.map((block) => ({
        text: block.text,
        img: null,
      }));

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
        setMessage({ type: "success", text: "Blog posted successfully!" });
        setFormData({
          title: "",
          description: "",
          coverImage: null,
          content: [{ text: "", img: null }],
        });
        setCoverPreview(null);
        setContentPreviews([null]);

        setTimeout(() => {
          window.location.href = "/blogs";
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: `Failed to post blog: ${
            result.message || JSON.stringify(result)
          }`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text: `An error occurred: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToBlogs = () => {
    window.location.href = "/blogs";
  };

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
              <FileText className="w-8 h-8" />
              Create New Blog Post
            </h1>
            <p className="text-indigo-100 mt-2">
              Share your thoughts with the world
            </p>
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
