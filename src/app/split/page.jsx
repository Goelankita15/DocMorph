'use client';
import React, { useState } from 'react';
import SplitPdf from '@/components/SplitPdf';
import axios from 'axios';

export default function SplitPdfPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSplit = async () => {
    if (!file || !startPage || !endPage || +startPage > +endPage) {
      alert('Please select a file and enter a valid page range.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('startPage', startPage);
    formData.append('endPage', endPage);

    try {
      setLoading(true);

      const response = await axios.post('/split/api/pdf', formData, {
        responseType: 'blob', // very important to handle binary PDF file
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
    } catch (error) {
      console.error('❌ Split PDF Error:', error);
      alert('Failed to split PDF.');
    } finally {
      setLoading(false);
        // Clean up preview URL
        setFile(null);
        setPreview(null);
    }
  };

  return (
    <SplitPdf
      file={file}
      setFile={setFile}
      preview={preview}
      setPreview={setPreview}
      startPage={startPage}
      endPage={endPage}
      setStartPage={setStartPage}
      setEndPage={setEndPage}
      loading={loading}
      onSplit={handleSplit}
    />
  );
}
