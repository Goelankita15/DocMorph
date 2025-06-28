'use client';
import React from 'react';

const MergePdf = ({ files, setFiles, previews, setPreviews, loading, onMerge }) => {
  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      (f) => f.type === 'application/pdf'
    );

    if (selectedFiles.length < 2) {
      alert('Please select at least two PDF files to merge.');
      return;
    }

    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((f) => URL.createObjectURL(f)));
  };

  //clean the preview and url as the merged file is downloaded
   

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-blue-700 text-center">Merge PDFs</h1>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 hover:border-blue-600 rounded-xl px-6 py-10 cursor-pointer bg-blue-50 transition">
        <input type="file" hidden multiple accept="application/pdf" onChange={handleChange} />
        <p className="text-blue-500 font-medium">Click or drag PDFs to upload</p>
        <p className="text-sm text-gray-500">Select at least 2 PDF files</p>
      </label>

      {files.length > 0 && (
        <div className="space-y-4 text-center">
          <p className="text-blue-600 font-semibold">Files selected: {files.length}</p>

          <div className="grid grid-cols-1 gap-4 max-h-64 overflow-auto">
            {files.map((file, idx) => (
              <div key={idx} className="text-sm text-gray-700">{file.name}</div>
            ))}
          </div>

          <button
            onClick={onMerge}
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Merging...' : 'Merge PDFs'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MergePdf;
