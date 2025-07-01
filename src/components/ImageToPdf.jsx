'use client';
import React, { useEffect } from 'react';

const ImageToPdf = ({ files, setFiles, previews, setPreviews, onConvert, loading }) => {
  const processFiles = (fileList) => {
    const selectedFiles = Array.from(fileList).filter((f) =>
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

  const handleChange = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
      // Reset the input value to allow selecting the same files again
      e.target.value = '';
    }
  };

  const removeFile = (indexToRemove) => {
    // Revoke the URL for the removed file
    URL.revokeObjectURL(previews[indexToRemove]);
    
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    const newPreviews = previews.filter((_, index) => index !== indexToRemove);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []); // only run on unmount

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-lg mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Convert Images to PDF
          </h1>
          <p className="text-base sm:text-lg text-gray-600">Transform your images into a professional PDF document</p>
        </div>

        <div 
          className={`border-2 border-dashed rounded-lg px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-center cursor-pointer transition-all duration-300 ${
            loading 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
              : 'border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-indigo-50'
          }`}
          onClick={!loading ? () => document.getElementById('fileInput').click() : undefined}
        >
          <input
            id="fileInput"
            type="file"
            hidden
            multiple
            accept=".jpg,.jpeg,.png"
            onChange={handleChange}
          />
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="professional-spinner mb-4"></div>
                <p className="text-lg font-medium text-indigo-600">Converting...</p>
              </div>
            ) : (
              <>
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Upload images to convert
                  </p>
                  <p className="text-sm text-gray-500">
                    Click to browse and select multiple image files
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports JPG, JPEG, PNG • Maximum 10MB per file
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  {files.length}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    {files.length} image{files.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-gray-500">Ready to convert</p>
                </div>
              </div>
              <button
                onClick={() => {
                  previews.forEach((url) => URL.revokeObjectURL(url));
                  setFiles([]);
                  setPreviews([]);
                }}
                className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Image Preview
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Review your images before conversion. Images will appear in this order in the PDF.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 scrollable max-h-64 overflow-y-auto">
                {previews.map((url, i) => (
                  <div key={i} className="relative group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                    <img
                      src={url}
                      alt={`preview-${i}`}
                      className="w-full h-32 object-contain p-2"
                    />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Remove image"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 truncate">
                      {files[i]?.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onConvert}
              disabled={loading || files.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="professional-spinner"></div>
                  <span>Converting {files.length} image{files.length > 1 ? 's' : ''}...</span>
                </div>
              ) : (
                `Convert ${files.length} Image${files.length > 1 ? 's' : ''} to PDF`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToPdf;
