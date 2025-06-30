import { PDFDocument } from 'pdf-lib';
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs/promises';
import os from 'os';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(request) {
  const form = formidable({
    multiples: false,
    uploadDir: os.tmpdir(),
    keepExtensions: true,
  });

  const buffers = [];
  for await (const chunk of request.body) {
    buffers.push(chunk);
  }
  const body = Buffer.concat(buffers);

  const stream = Readable.from(body);
  stream.headers = Object.fromEntries(request.headers.entries());

  return await new Promise((resolve, reject) => {
    form.parse(stream, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(req) {
  try {
    const { fields, files } = await parseForm(req);
    const pdfFile = files.file[0];
    
    // Check if we have splitMode and pageNumbers (specific pages mode)
    const splitMode = fields.splitMode ? fields.splitMode[0] : 'range';
    const pageNumbers = fields.pageNumbers ? fields.pageNumbers[0] : null;
    const startPage = fields.startPage ? parseInt(fields.startPage[0]) : null;
    const endPage = fields.endPage ? parseInt(fields.endPage[0]) : null;

    const originalPdfBytes = await fs.readFile(pdfFile.filepath);
    const originalPdf = await PDFDocument.load(originalPdfBytes);
    const totalPages = originalPdf.getPageCount();

    let pagesToExtract = [];

    if (splitMode === 'specific' && pageNumbers) {
      // Parse specific page numbers (e.g., "1,3,5" or "1, 3, 5")
      try {
        pagesToExtract = pageNumbers
          .split(',')
          .map(p => parseInt(p.trim()))
          .filter(p => p >= 1 && p <= totalPages)
          .sort((a, b) => a - b);
        
        if (pagesToExtract.length === 0) {
          return NextResponse.json({ error: 'No valid page numbers provided' }, { status: 400 });
        }
      } catch (error) {
        return NextResponse.json({ error: 'Invalid page numbers format' }, { status: 400 });
      }
    } else {
      // Range mode
      if (!startPage || !endPage || startPage > endPage) {
        return NextResponse.json({ error: 'Invalid page range' }, { status: 400 });
      }

      if (startPage < 1 || endPage > totalPages) {
        return NextResponse.json({ error: 'Page range out of bounds' }, { status: 400 });
      }

      // Create array of pages in range
      for (let i = startPage; i <= endPage; i++) {
        pagesToExtract.push(i);
      }
    }

    const newPdf = await PDFDocument.create();

    // Extract the specified pages (convert to 0-based index)
    for (const pageNum of pagesToExtract) {
      const [copiedPage] = await newPdf.copyPages(originalPdf, [pageNum - 1]);
      newPdf.addPage(copiedPage);
    }

    const splitPdfBytes = await newPdf.save();

    return new NextResponse(Buffer.from(splitPdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=split.pdf',
      },
    });
  } catch (err) {
    console.error('❌ Split PDF Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
