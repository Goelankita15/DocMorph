'use client';
import React, { useEffect } from 'react';

const MergePdf = ({ files, setFiles, previews, setPreviews, loading, onMerge }) => {
  const processFiles = (fileList) => {
    const selectedFiles = Array.from(fileList).filter(
      (f) => f.type === 'application/pdf'
    );

    if (selectedFiles.length === 0) {
      alert('Please select valid PDF files.');
      return;
    }

    // Clean up old previews
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((f) => URL.createObjectURL(f)));
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

  const moveFile = (fromIndex, toIndex) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    
    const [movedFile] = newFiles.splice(fromIndex, 1);
    const [movedPreview] = newPreviews.splice(fromIndex, 1);
    
    newFiles.splice(toIndex, 0, movedFile);
    newPreviews.splice(toIndex, 0, movedPreview);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);
   

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-lg mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Merge PDF Files
          </h1>
          <p className="text-lg text-gray-600">Combine multiple PDF files into a single document</p>
        </div>

        <div 
          className={`border-2 border-dashed rounded-lg px-8 py-12 text-center cursor-pointer transition-all duration-300 ${
            loading 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
              : 'border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-indigo-50'
          }`}
          onClick={!loading ? () => document.getElementById('mergeFileInput').click() : undefined}
        >
          <input
            id="mergeFileInput"
            type="file"
            hidden
            multiple
            accept="application/pdf"
            onChange={handleChange}
          />
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="professional-spinner mb-4"></div>
                <p className="text-lg font-medium text-indigo-600">Processing...</p>
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
                    d="M7 16V4m0 0L4 7m3-3l3 3m6 0h1a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1"
                  />
                </svg>
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Upload PDF files to merge
                  </p>
                  <p className="text-sm text-gray-500">
                    Click to browse and select multiple PDF files
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Minimum 2 files required • Maximum 50MB per file
                  </p>
                </div>
              </>
            )}
          </div>
        </div>        {files.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  {files.length}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    {files.length} file{files.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-gray-500">Ready to merge</p>
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
                Document Order
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop to reorder files. The first document will appear first in the merged PDF.
              </p>
              
              <div className="space-y-3 scrollable">
                {files.map((file, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors group"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      if (fromIndex !== idx) {
                        moveFile(fromIndex, idx);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-medium">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveFile(idx, Math.max(0, idx - 1))}
                        disabled={idx === 0}
                        className="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveFile(idx, Math.min(files.length - 1, idx + 1))}
                        disabled={idx === files.length - 1}
                        className="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeFile(idx)}
                        className="p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove file"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          <button
            onClick={onMerge}
            disabled={loading || files.length < 2}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="professional-spinner"></div>
                <span>Merging {files.length} files...</span>
              </div>
            ) : (
              `Merge ${files.length} PDF${files.length > 1 ? 's' : ''}`
            )}
          </button>
          
          {files.length < 2 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <div className="text-amber-600">
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Please select at least 2 PDF files to merge
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
};

export default MergePdf;
