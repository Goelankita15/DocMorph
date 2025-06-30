'use client';
import React, { useState, useImperativeHandle, forwardRef } from 'react';

const FileUpload = forwardRef(({ onUpload, loading = false }, ref) => {
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
      const fileInput = document.getElementById('imageInput');
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }));

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      // Clean up previous preview
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      // Don't auto-upload anymore, wait for user to configure compression settings
    } else {
      alert('Please select a valid image file (JPG, PNG, WebP, etc.)');
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
      processFile(droppedFiles[0]); // Only take the first file for single upload
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
    const fileInput = document.getElementById('imageInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };
  React.useEffect(() => {
    // Clean up the preview URL when the component unmounts or file changes
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    }
  }
  , [preview]);

  return (
    <div className="max-w-xl mx-auto">
      <div 
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl px-8 py-16 cursor-pointer transition-all duration-500 ease-in-out relative overflow-hidden ${
          loading 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
            : isDragging 
              ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-cyan-50 scale-105 shadow-2xl glow-animation' 
              : 'border-blue-400 hover:border-blue-600 bg-gradient-to-br from-white to-blue-50 shadow-xl hover:shadow-2xl hover:scale-102'
        }`}
        onDragOver={!loading ? handleDragOver : undefined}
        onDragLeave={!loading ? handleDragLeave : undefined}
        onDrop={!loading ? handleDrop : undefined}
        onClick={!loading ? () => document.getElementById('imageInput').click() : undefined}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
        <div className="absolute top-4 right-4 w-16 h-16 bg-blue-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-cyan-200/20 rounded-full blur-lg"></div>
        
        <input
          id="imageInput"
          type="file"
          hidden
          accept="image/*"
          onChange={handleChange}
        />
        
        <div className="text-center space-y-4 relative z-10">
          {loading ? (
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <div className="text-2xl text-blue-500 mb-4">🔄</div>
            </div>
          ) : isDragging ? (
            <div className="text-8xl text-blue-500 mb-6 animate-bounce">📤</div>
          ) : (
            <div className="relative">
              <svg
                className="w-20 h-20 text-blue-400 mb-6 animate-pulse mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M7 16V4m0 0L4 7m3-3l3 3m6 0h1a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"></div>
            </div>
          )}
          
          <p className="text-xl text-blue-600 font-bold">
            {loading 
              ? 'Processing your image...' 
              : isDragging 
                ? 'Drop your image here!' 
                : 'Click or drag an image to upload'
            }
          </p>
          <p className="text-base text-gray-600 font-medium">
            {loading ? 'Please wait while we compress your image' : 'JPG, PNG, WebP, or any image format'}
          </p>
          <p className="text-sm text-gray-500">
            Maximum file size: 10MB • All processing happens locally
          </p>
        </div>
      </div>

      {file && (
        <div className="mt-8 text-center space-y-6">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">📄</span>
              </div>
              <div className="text-left">
                <p className="text-blue-700 font-bold text-lg">{file.name}</p>
                <p className="text-blue-600 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 font-semibold transition-all duration-200 hover:scale-110 px-3 py-1 rounded-lg hover:bg-red-50"
              title="Remove image"
            >
              Remove ✕
            </button>
          </div>
          
          <div className="relative group">
            <div className="relative overflow-hidden rounded-3xl border-4 border-gradient-to-r from-blue-200 to-cyan-200 shadow-2xl">
              <img
                src={preview}
                alt="Preview"
                className="max-w-xs mx-auto transition-all duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button
                onClick={removeFile}
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110 shadow-lg"
                title="Remove image"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 text-left border border-blue-200/50">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              📊 File Information
            </h3>
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
          <div className="bg-blue-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-blue-700 text-center">Compression Settings</h3>
            
            {/* Compression Mode */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Compression Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCompressionMode('quality')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    compressionMode === 'quality'
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium">Quality Based</div>
                  <div className="text-xs">Adjust compression level</div>
                </button>
                <button
                  onClick={() => setCompressionMode('size')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    compressionMode === 'size'
                      ? 'border-blue-500 bg-blue-100 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
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
                          ? 'border-blue-500 bg-blue-100 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
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
                <label className="block text-sm font-medium text-gray-700">Target Size (KB)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    placeholder="Enter target size in KB"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="10240"
                  />
                  <div className="flex space-x-1">
                    {[100, 500, 1000].map((size) => (
                      <button
                        key={size}
                        onClick={() => setTargetSize(size.toString())}
                        className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                      >
                        {size}KB
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Current size: {(file.size / 1024).toFixed(0)}KB
                </p>
              </div>
            )}

            {/* Compress Button */}
            <button
              onClick={handleCompress}
              disabled={loading || (compressionMode === 'size' && !targetSize)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Compressing...</span>
                </div>
              ) : (
                `Compress Image ${compressionMode === 'size' && targetSize ? `to ${targetSize}KB` : `(${compressionLevel} quality)`}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;
