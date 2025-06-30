import { NextResponse } from "next/server";
import sharp from "sharp";
import { readFile } from "fs/promises";
import os from "os";
import formidable from "formidable";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to find optimal quality for target file size
async function findOptimalQuality(image, inputFormat, targetSizeKB) {
  const targetSizeBytes = targetSizeKB * 1024;
  let minQuality = 10;
  let maxQuality = 95;
  let bestQuality = 60;
  
  // Binary search for optimal quality
  for (let i = 0; i < 8; i++) { // Limit iterations to prevent infinite loop
    const testQuality = Math.floor((minQuality + maxQuality) / 2);
    
    let testBuffer;
    if (inputFormat === 'image/jpeg' || inputFormat === 'image/jpg') {
      testBuffer = await image.jpeg({ quality: testQuality }).toBuffer();
    } else if (inputFormat === 'image/png') {
      testBuffer = await image.png({ quality: testQuality, compressionLevel: 6 }).toBuffer();
    } else if (inputFormat === 'image/webp') {
      testBuffer = await image.webp({ quality: testQuality }).toBuffer();
    } else {
      return 60; // fallback
    }
    
    if (testBuffer.length <= targetSizeBytes) {
      bestQuality = testQuality;
      minQuality = testQuality + 1;
    } else {
      maxQuality = testQuality - 1;
    }
    
    if (minQuality > maxQuality) break;
  }
  
  return Math.max(bestQuality, 10); // Ensure minimum quality of 10
}

async function parseForm(request) {
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

  return await new Promise((resolve, reject) => {
    form.parse(stream, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(request) {
  try {
    const { fields, files } = await parseForm(request);
    const file = files.file[0];

    // Extract compression options from form fields
    const compressionMode = fields.compressionMode?.[0] || 'quality';
    const compressionLevel = fields.compressionLevel?.[0] || 'medium';
    const targetSize = fields.targetSize?.[0] ? parseInt(fields.targetSize[0]) : null;

    const buffer = await readFile(file.filepath);
    const inputFormat = file.mimetype;

    const image = sharp(buffer);
    let compressed, outputMime;

    // Determine quality based on compression level
    let quality;
    switch (compressionLevel) {
      case 'low':
        quality = 85;
        break;
      case 'medium':
        quality = 60;
        break;
      case 'high':
        quality = 30;
        break;
      default:
        quality = 60;
    }

    // Handle different compression modes
    if (compressionMode === 'size' && targetSize) {
      // Target size compression - iterate to find the right quality
      quality = await findOptimalQuality(image, inputFormat, targetSize);
    }

    if (inputFormat === 'image/jpeg' || inputFormat === 'image/jpg') {
      compressed = await image.jpeg({ quality }).toBuffer();
      outputMime = 'image/jpeg';
    } else if (inputFormat === 'image/png') {
      compressed = await image.png({ 
        quality, 
        compressionLevel: compressionLevel === 'high' ? 9 : compressionLevel === 'medium' ? 6 : 3 
      }).toBuffer();
      outputMime = 'image/png';
    } else if (inputFormat === 'image/webp') {
      compressed = await image.webp({ quality }).toBuffer();
      outputMime = 'image/webp';
    } else {
      return NextResponse.json({ error: 'Unsupported image format' }, { status: 400 });
    }

    return new NextResponse(compressed, {
      headers: {
        'Content-Type': outputMime,
      },
    });
  } catch (err) {
    console.error("❌ Compression error:", err);
    return NextResponse.json({ error: 'Server error while compressing image' }, { status: 500 });
  }
}
