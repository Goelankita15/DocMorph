'use client';
import React, { useEffect } from 'react';

const ImageToPdf = ({ files, setFiles, previews, setPreviews, onConvert, loading }) => {
  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((f) =>
      ['image/jpeg', 'image/jpg', 'image/png'].includes(f.type)
    );

    if (selectedFiles.length === 0) {
      alert('Please select valid JPG or PNG image files.');
      return;
    }

    // Clean up old previews
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []); // only run on unmount

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-blue-700 text-center">Convert Images to PDF</h2>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 hover:border-blue-600 rounded-xl px-6 py-10 cursor-pointer bg-blue-50 transition">
        <input
          type="file"
          hidden
          multiple
          accept=".jpg,.jpeg,.png"
          onChange={handleChange}
        />
        <p className="text-blue-500 font-medium">Click or drag images to upload</p>
        <p className="text-sm text-gray-500">Only JPG and PNG files are supported</p>
      </label>

      {files.length > 0 && (
        <div className="text-center space-y-4">
          <p className="text-blue-600 font-semibold">Images Selected: {files.length}</p>

          <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
            {previews.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`preview-${i}`}
                className="w-full h-40 object-contain border rounded"
              />
            ))}
          </div>

          <button
            onClick={onConvert}
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Converting...' : 'Convert to PDF'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageToPdf;
