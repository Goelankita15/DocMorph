'use client';
import React, { useState } from 'react';
import MergePdf from '@/components/MergePdf';
import axios from 'axios';

export default function MergePdfPage() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least two PDF files to merge.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      setLoading(true);
      const response = await axios.post('/merge/api/pdf', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      
      // Clean up the URL
      URL.revokeObjectURL(url);
      
      // Clean up previews and reset files
      previews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      setFiles([]);
      setPreviews([]);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('❌ Merge Error:', err);
      alert('Merging failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <MergePdf
        files={files}
        setFiles={setFiles}
        previews={previews}
        setPreviews={setPreviews}
        loading={loading}
        onMerge={handleMerge}
      />
      
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center space-x-3">
            <div className="text-green-500 text-2xl">✓</div>
            <div>
              <p className="text-green-600 font-medium">PDFs merged successfully!</p>
              <p className="text-sm text-gray-500">File downloaded to your device</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
