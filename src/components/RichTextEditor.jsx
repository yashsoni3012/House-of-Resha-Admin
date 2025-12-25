import React, { lazy, Suspense, useEffect } from 'react';

const ReactQuill = lazy(() => import('react-quill'));

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  height = 400 
}) => {
  // Dynamically load Quill CSS
  useEffect(() => {
    // Load Quill CSS dynamically
    const link = document.createElement('link');
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      // Cleanup
      document.head.removeChild(link);
    };
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote'],
      ['link', 'image'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'blockquote',
    'link', 'image'
  ];

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      }>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || "Start writing..."}
          style={{
            height: `${height}px`,
            border: 'none',
          }}
          className="rounded-lg"
        />
      </Suspense>
    </div>
  );
};

export default RichTextEditor;