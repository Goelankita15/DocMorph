'use client';
import React, { useState } from 'react';
import SplitPdf from '@/components/SplitPdf';
import axios from 'axios';

export default function SplitPdfPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [splitMode, setSplitMode] = useState('range');
  const [pageNumbers, setPageNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSplit = async () => {
    if (!file) {
      alert('Please select a PDF file.');
      return;
    }

    // Validate inputs based on split mode
    if (splitMode === 'range') {
      if (!startPage || !endPage || +startPage > +endPage) {
        alert('Please enter a valid page range.');
        return;
      }
    } else if (splitMode === 'pages') {
      if (!pageNumbers.trim()) {
        alert('Please enter specific page numbers.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('splitMode', splitMode);
    
    if (splitMode === 'range') {
      formData.append('startPage', startPage);
      formData.append('endPage', endPage);
    } else {
      formData.append('pageNumbers', pageNumbers);
    }

    try {
      setLoading(true);

      const response = await axios.post('/split/api/pdf', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `split-${file.name}`;
      a.click();
      
      // Clean up the download URL
      URL.revokeObjectURL(downloadUrl);
      
      // Clean up preview URL and reset state
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setFile(null);
      setPreview(null);
      setStartPage('');
      setEndPage('');
      setPageNumbers('');
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('❌ Split PDF Error:', error);
      alert('Failed to split PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <SplitPdf
        file={file}
        setFile={setFile}
        preview={preview}
        setPreview={setPreview}
        startPage={startPage}
        endPage={endPage}
        setStartPage={setStartPage}
        setEndPage={setEndPage}
        splitMode={splitMode}
        setSplitMode={setSplitMode}
        pageNumbers={pageNumbers}
        setPageNumbers={setPageNumbers}
        loading={loading}
        onSplit={handleSplit}
      />
      
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center space-x-3">
            <div className="text-green-500 text-2xl">✓</div>
            <div>
              <p className="text-green-600 font-medium">PDF split successfully!</p>
              <p className="text-sm text-gray-500">File downloaded to your device</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
