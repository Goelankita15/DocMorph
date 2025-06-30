"use client";
import React, { useState, useImperativeHandle, forwardRef } from "react";

const PdfUpload = forwardRef(({ onUpload, loading = false }, ref) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [targetSize, setTargetSize] = useState('');
  const [compressionMode, setCompressionMode] = useState('quality'); // 'quality' or 'size'

  // Expose reset function to parent component
  useImperativeHandle(ref, () => ({
    resetToInitialState: () => {
      // Clean up preview URL if it exists
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      
      // Reset all state to initial values
      setFile(null);
      setPreview(null);
      setIsDragging(false);
      setCompressionLevel('medium');
      setTargetSize('');
      setCompressionMode('quality');
      
      // Reset file input
      const fileInput = document.getElementById('pdfInput');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }));

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      // Clean up previous preview
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const handleCompress = () => {
    if (file) {
      const compressionOptions = {
        mode: compressionMode,
        level: compressionLevel,
        targetSize: targetSize ? parseInt(targetSize) : null
      };
      onUpload(file, compressionOptions);
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
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
    setTargetSize('');
    
    // Reset file input
    const fileInput = document.getElementById('pdfInput');
    if (fileInput) {
      fileInput.value = '';
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
      <div 
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl px-6 py-12 cursor-pointer transition-all duration-300 ease-in-out ${
          loading 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
            : isDragging 
              ? 'border-red-600 bg-red-100 scale-105 shadow-xl' 
              : 'border-red-400 hover:border-red-600 bg-white shadow-md hover:shadow-xl'
        }`}
        onDragOver={!loading ? handleDragOver : undefined}
        onDragLeave={!loading ? handleDragLeave : undefined}
        onDrop={!loading ? handleDrop : undefined}
        onClick={!loading ? () => document.getElementById('pdfInput').click() : undefined}
      >
        <input
          id="pdfInput"
          type="file"
          hidden
          accept="application/pdf"
          onChange={handleChange}
        />
        
        <div className="text-center space-y-3">
          {isDragging ? (
            <div className="text-6xl text-red-500 mb-4 animate-bounce">📄</div>
          ) : (
            <svg
              className="w-16 h-16 text-red-400 mb-4 animate-pulse mx-auto"
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
          
          <p className="text-lg text-red-600 font-medium">
            {loading 
              ? 'Processing...' 
              : isDragging 
                ? 'Drop your PDF here!' 
                : 'Click or drag a PDF to upload'
            }
          </p>
          <p className="text-sm text-gray-500">
            {loading ? 'Please wait while we compress your PDF' : 'PDF files only'}
          </p>
          <p className="text-xs text-gray-400">
            Maximum file size: 50MB
          </p>
        </div>
      </div>

      {file && (
        <div className="mt-6 text-center space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-red-600 font-semibold">Selected: {file.name}</p>
            <button
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
              title="Remove PDF"
            >
              Remove
            </button>
          </div>
          
          <div className="relative group">
            <iframe
              src={preview}
              title="PDF Preview"
              className="rounded-xl max-w-xs mx-auto border border-gray-200 shadow-lg w-full h-64"
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
            <div className="flex justify-between">
              <span>Type:</span>
              <span>{file.type}</span>
            </div>
          </div>

          {/* Compression Settings */}
          <div className="bg-red-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-red-700 text-center">PDF Compression Settings</h3>
            
            {/* Compression Mode */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Compression Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCompressionMode('quality')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    compressionMode === 'quality'
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                  }`}
                >
                  <div className="font-medium">Quality Based</div>
                  <div className="text-xs">Adjust compression level</div>
                </button>
                <button
                  onClick={() => setCompressionMode('size')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    compressionMode === 'size'
                      ? 'border-red-500 bg-red-100 text-red-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                  }`}
                >
                  <div className="font-medium">Target Size</div>
                  <div className="text-xs">Set specific file size</div>
                </button>
              </div>
            </div>

            {/* Quality Level Settings */}
            {compressionMode === 'quality' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Compression Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'low', label: 'Low', desc: 'Best quality' },
                    { value: 'medium', label: 'Medium', desc: 'Balanced' },
                    { value: 'high', label: 'High', desc: 'Smallest size' }
                  ].map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setCompressionLevel(level.value)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        compressionLevel === level.value
                          ? 'border-red-500 bg-red-100 text-red-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{level.label}</div>
                      <div className="text-xs">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Target Size Settings */}
            {compressionMode === 'size' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Target Size (MB)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    placeholder="Enter target size in MB"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    min="0.1"
                    max="50"
                    step="0.1"
                  />
                  <div className="flex space-x-1">
                    {[1, 5, 10].map((size) => (
                      <button
                        key={size}
                        onClick={() => setTargetSize(size.toString())}
                        className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                      >
                        {size}MB
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Current size: {(file.size / (1024 * 1024)).toFixed(1)}MB
                </p>
              </div>
            )}

            {/* Compress Button */}
            <button
              onClick={handleCompress}
              disabled={loading || (compressionMode === 'size' && !targetSize)}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Compressing...</span>
                </div>
              ) : (
                `Compress PDF ${compressionMode === 'size' && targetSize ? `to ${targetSize}MB` : `(${compressionLevel} quality)`}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

PdfUpload.displayName = 'PdfUpload';

export default PdfUpload;
