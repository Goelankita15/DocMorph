import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import formidable from 'formidable';
import os from 'os';
import { Readable } from 'stream';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(request) {
  const form = formidable({
    multiples: true,
    uploadDir: os.tmpdir(),
    keepExtensions: true,
  });

  const buffers = [];
  for await (const chunk of request.body) {
    buffers.push(chunk);
  }

  const stream = Readable.from(Buffer.concat(buffers));
  stream.headers = Object.fromEntries(request.headers.entries());

  return await new Promise((resolve, reject) => {
    form.parse(stream, (err, fields, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

export async function POST(req) {
  try {
    const files = await parseForm(req);
    const pdfFiles = files.files;

    if (!pdfFiles || pdfFiles.length < 2) {
      return NextResponse.json({ error: 'At least two PDF files required.' }, { status: 400 });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of pdfFiles) {
      const bytes = await fs.readFile(file.filepath);
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=merged.pdf',
      },
    });
  } catch (err) {
    console.error('❌ Merge PDF Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
