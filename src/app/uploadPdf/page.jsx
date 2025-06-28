'use client';
import React, { useState } from 'react';
import PdfUpload from '@/components/PdfUpload';
import axios from 'axios';
export default function UploadPdfPage() {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);

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
    } catch (error) {
      console.error('❌ Compression error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      // Clean up the URL object to free memory
      if (file) {
        URL.revokeObjectURL(file);
      }
      
    }
  };

  return (
    <main className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">PDF Compressor</h1>
      <PdfUpload onUpload={handleUpload} />
      {loading && <p className="mt-4 text-gray-500">Compressing...</p>}
    </main>
  );
}