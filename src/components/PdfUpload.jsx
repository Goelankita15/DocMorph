"use client";
import React from "react";

const PdfUpload = ({ onUpload }) => {
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      onUpload(selectedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="max-w-xl mx-auto">
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 hover:border-blue-600 rounded-2xl px-6 py-12 cursor-pointer bg-white shadow-md transition-all duration-300 ease-in-out hover:shadow-xl">
        <input type="file" hidden accept="application/pdf" onChange={handleChange} />
        <svg
          className="w-16 h-16 text-blue-400 mb-4 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16V4m0 0L4 7m3-3l3 3m6 0h1a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1"
          />
        </svg>
        <p className="text-lg text-blue-500 font-medium">Click or drag a PDF to upload</p>
        <p className="text-sm text-gray-400 mt-1">PDF files only</p>
      </label>

      {file && (
        <div className="mt-6 text-center">
          <p className="text-blue-600 font-semibold">Selected: {file.name}</p>
          <div className="mt-4">
            <iframe
              src={preview}
              title="PDF Preview"
              className="rounded-xl max-w-xs mx-auto border border-gray-200 shadow-lg w-full h-64"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
