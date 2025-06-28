'use client';
import React from 'react';

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
  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    } else {
      alert('Please upload a valid PDF.');
    }
  };

  
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-blue-700 text-center">Split PDF</h1>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 hover:border-blue-600 rounded-xl px-6 py-10 cursor-pointer bg-blue-50 transition">
        <input type="file" hidden accept="application/pdf" onChange={handleChange} />
        <p className="text-blue-500 font-medium">Click or drag PDF to upload</p>
        <p className="text-sm text-gray-500">Only PDF files allowed</p>
      </label>

      {file && (
        <div className="text-center space-y-4">
          <p className="text-blue-600 font-semibold">Selected: {file.name}</p>

          <iframe
            src={preview}
            className="w-full h-64 border border-gray-300 rounded-lg shadow"
          />

          <div className="flex gap-4 justify-center">
            <input
              type="number"
              placeholder="Start Page"
              value={startPage}
              min={1}
              className="border p-2 rounded w-1/3"
              onChange={(e) => setStartPage(e.target.value)}
            />
            <input
              type="number"
              placeholder="End Page"
              value={endPage}
              min={startPage || 1}
              className="border p-2 rounded w-1/3"
              onChange={(e) => setEndPage(e.target.value)}
            />
          </div>

          <button
            onClick={onSplit}
            disabled={loading}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Splitting...' : 'Split PDF'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SplitPdf;
