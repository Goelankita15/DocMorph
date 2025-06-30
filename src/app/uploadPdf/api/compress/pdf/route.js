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

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(stream, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = files.file[0];
    const buffer = await readFile(file.filepath);

    // Extract compression options from form fields
    const compressionMode = fields.compressionMode?.[0] || 'quality';
    const compressionLevel = fields.compressionLevel?.[0] || 'medium';
    const targetSize = fields.targetSize?.[0] ? parseFloat(fields.targetSize[0]) : null;

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(buffer);
    
    // Configure compression options based on level
    let compressionOptions = { useObjectStreams: true };
    
    switch (compressionLevel) {
      case 'low':
        compressionOptions = { 
          useObjectStreams: true,
          addDefaultPage: false
        };
        break;
      case 'medium':
        compressionOptions = { 
          useObjectStreams: true,
          addDefaultPage: false
        };
        break;
      case 'high':
        compressionOptions = { 
          useObjectStreams: true,
          addDefaultPage: false,
          updateFieldAppearances: false
        };
        break;
    }

    // If target size mode, we'll use the high compression as baseline
    if (compressionMode === 'size' && targetSize) {
      compressionOptions = { 
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false
      };
    }

    // Compress the PDF
    const compressedPdfBytes = await pdfDoc.save(compressionOptions);

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