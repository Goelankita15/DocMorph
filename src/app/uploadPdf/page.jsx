'use client';
import React, { useState, useRef } from 'react';
import PdfUpload from '@/components/PdfUpload';
import axios from 'axios';

export default function UploadPdfPage() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const pdfUploadRef = useRef(null);

  const handleUpload = async (file, compressionOptions = {}) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);
      
      // Add compression options to the form data
      if (compressionOptions.mode) {
        formData.append('compressionMode', compressionOptions.mode);
      }
      if (compressionOptions.level) {
        formData.append('compressionLevel', compressionOptions.level);
      }
      if (compressionOptions.targetSize) {
        formData.append('targetSize', compressionOptions.targetSize.toString());
      }

      const response = await axios.post('/uploadPdf/api/compress/pdf', formData, {
        responseType: 'blob', // ❗ Important to handle binary data
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const contentType = response.headers['content-type'];

      if (contentType !== 'application/pdf') {
        console.error('❌ Upload failed:', response.data);
        alert('Compression failed. Check console.');
        setLoading(false);
        return;
      }

      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed-${file.name}`;
      a.click();
      
      // Clean up the URL object to free memory
      URL.revokeObjectURL(url);
      
      // Reset the PdfUpload component to initial state
      if (pdfUploadRef.current) {
        pdfUploadRef.current.resetToInitialState();
      }
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error('❌ Compression error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto mt-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-red-700 mb-2">PDF Compressor</h1>
        <p className="text-gray-600">Reduce PDF file size while maintaining quality</p>
      </div>
      
      <PdfUpload ref={pdfUploadRef} onUpload={handleUpload} loading={loading} />
      
      {/* Success Message */}
      {showSuccess && (
        <div className="mt-6 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="text-green-500 text-2xl">✓</div>
              <p className="text-green-600 font-medium">PDF compressed and downloaded successfully!</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">You can upload another PDF</p>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="mt-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <p className="text-red-600 font-medium">Compressing your PDF...</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        </div>
      )}
    </main>
  );
}