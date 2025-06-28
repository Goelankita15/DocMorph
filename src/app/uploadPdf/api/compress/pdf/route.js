import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import os from "os";
import formidable from "formidable";
import { Readable } from "stream";
import { PDFDocument } from "pdf-lib";

export const config = {
  api: {
    bodyParser: false,
  },    
}

export async function POST(request) {
  try {
    const form = formidable({
      multiples: false,
      uploadDir: os.tmpdir(),
      keepExtensions: true,
    });

    // Collect body as a buffer
    const buffers = [];
    for await (const chunk of request.body) {
      buffers.push(chunk);
    }
    const bodyBuffer = Buffer.concat(buffers);

    // Create a mock Node.js IncomingMessage with headers and body
    const stream = Readable.from(bodyBuffer);
    stream.headers = Object.fromEntries(request.headers.entries());

    const files = await new Promise((resolve, reject) => {
      form.parse(stream, (err, fields, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });

    const file = files.file[0];
    const buffer = await readFile(file.filepath);

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(buffer);
    
    // Compress the PDF by removing unused objects and optimizing it
    const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });

    return new NextResponse(compressedPdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="compressed-${file.originalFilename}"`,
      },
    });
  } catch (error) {
    console.error('❌ Compression error:', error);
    return NextResponse.json({ error: 'Compression failed' }, { status: 500 });
  }
}