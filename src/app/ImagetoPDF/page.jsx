'use client';
import React, { useState } from 'react';
import ImageToPdf from '@/components/ImageToPdf';
import { PDFDocument } from 'pdf-lib';

export default function ImagetoPDF() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) {
      alert('Please select at least one image.');
      return;
    }

    try {
      setLoading(true);
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const imgBytes = await file.arrayBuffer();
        let image, dims;

        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(imgBytes);
        } else if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(imgBytes);
        } else {
          throw new Error('Unsupported file type: ' + file.type);
        }

        dims = image.scale(1);
        const page = pdfDoc.addPage([dims.width, dims.height]);

        page.drawImage(image, {
          x: 0,
          y: 0,
          width: dims.width,
          height: dims.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'images.pdf';
      a.click();
    } catch (err) {
      console.error('Image to PDF conversion failed:', err);
      alert('Failed to convert images. Check console for details.');
    } finally {
      setLoading(false);
      // Clean up preview URLs
      previews.forEach((url) => URL.revokeObjectURL(url));
      setFiles([]);
      setPreviews([]);
      // Clean up the PDF blob URL
      if (url) {
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <ImageToPdf
      files={files}
      setFiles={setFiles}
      previews={previews}
      setPreviews={setPreviews}
      loading={loading}
      onConvert={handleConvert}
    />
  );
}
