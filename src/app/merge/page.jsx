'use client';
import React, { useState } from 'react';
import MergePdf from '@/components/MergePdf';
import axios from 'axios';

export default function MergePdfPage() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      console.error('❌ Merge Error:', err);
      alert('Merging failed.');
    } finally {
      setLoading(false);
        // Clean up previews and files after merging
        setFiles([]);
        setPreviews([]);
        
    }
  };

  return (
    <MergePdf
      files={files}
      setFiles={setFiles}
      previews={previews}
      setPreviews={setPreviews}
      loading={loading}
      onMerge={handleMerge}
    />
  );
}
