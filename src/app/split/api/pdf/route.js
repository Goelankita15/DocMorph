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
    const startPage = parseInt(fields.startPage[0]);
    const endPage = parseInt(fields.endPage[0]);
    const pdfFile = files.file[0];

    if (!startPage || !endPage || startPage > endPage) {
      return NextResponse.json({ error: 'Invalid page range' }, { status: 400 });
    }

    const originalPdfBytes = await fs.readFile(pdfFile.filepath);
    const originalPdf = await PDFDocument.load(originalPdfBytes);
    const totalPages = originalPdf.getPageCount();

    if (startPage < 1 || endPage > totalPages) {
      return NextResponse.json({ error: 'Page range out of bounds' }, { status: 400 });
    }

    const newPdf = await PDFDocument.create();

    for (let i = startPage - 1; i < endPage; i++) {
      const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
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
