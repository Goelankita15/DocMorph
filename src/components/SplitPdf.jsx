'use client';
import React, { useState, useEffect } from 'react';

const SplitPdf = ({
  file,
  setFile,
  preview,
  setPreview,
  startPage,
  endPage,
  setStartPage,
  setEndPage,
  loading,
  onSplit
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      // Clean up previous preview
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      processFile(selected);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFile(droppedFiles[0]);
    }
  };

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setStartPage('');
    setEndPage('');
  };

  // Clean up preview on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Split PDF</h1>
        <p className="text-gray-600">Extract a range of pages from your PDF document</p>
      </div>

      <div 
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-6 py-12 cursor-pointer transition-all duration-300 ease-in-out ${
          loading 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
            : isDragging 
              ? 'border-green-600 bg-green-100 scale-105 shadow-xl' 
              : 'border-green-400 hover:border-green-600 bg-green-50 hover:bg-green-100'
        }`}
        onDragOver={!loading ? handleDragOver : undefined}
        onDragLeave={!loading ? handleDragLeave : undefined}
        onDrop={!loading ? handleDrop : undefined}
        onClick={!loading ? () => document.getElementById('splitFileInput').click() : undefined}
      >
        <input
          id="splitFileInput"
          type="file"
          hidden
          accept="application/pdf"
          onChange={handleChange}
        />
        
        <div className="text-center space-y-3">
          {isDragging ? (
            <div className="text-6xl text-green-500 mb-4 animate-bounce">📄✂️</div>
          ) : (
            <svg
              className="w-16 h-16 text-green-400 mb-4 animate-pulse mx-auto"
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
          )}
          
          <p className="text-lg text-green-600 font-medium">
            {loading 
              ? 'Processing...' 
              : isDragging 
                ? 'Drop your PDF here!' 
                : 'Click or drag a PDF to upload'
            }
          </p>
          <p className="text-sm text-gray-500">
            {loading ? 'Please wait while we split your PDF' : 'Only PDF files allowed'}
          </p>
          <p className="text-xs text-gray-400">
            Maximum file size: 50MB
          </p>
        </div>
      </div>

      {file && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-green-600 font-semibold text-lg">Selected: {file.name}</p>
            <button
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
              title="Remove PDF"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PDF Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">PDF Preview</h3>
              <div className="relative group">
                <iframe
                  src={preview}
                  className="w-full h-80 border border-gray-300 rounded-lg shadow-sm"
                  title="PDF Preview"
                />
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  title="Remove PDF"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>File size:</span>
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              </div>
            </div>

            {/* Split Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">Page Range</h3>
              
              {/* Page Range Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Specify Page Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Page</label>
                    <input
                      type="number"
                      placeholder="1"
                      value={startPage}
                      min={1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      onChange={(e) => setStartPage(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Page</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={endPage}
                      min={startPage || 1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      onChange={(e) => setEndPage(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Extract pages from {startPage || '1'} to {endPage || 'end'}
                </p>
              </div>

              {/* Split Button */}
              <button
                onClick={onSplit}
                disabled={loading || !startPage || !endPage || +startPage > +endPage}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Splitting PDF...</span>
                  </div>
                ) : (
                  `Split PDF (Pages ${startPage || '?'}-${endPage || '?'})`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitPdf;
