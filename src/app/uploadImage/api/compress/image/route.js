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
      else resolve(files);
    });
  });
}

export async function POST(request) {
  try {
    const files = await parseForm(request);
    const file = files.file[0];

    const buffer = await readFile(file.filepath);
    const inputFormat = file.mimetype;

    const image = sharp(buffer);
    let compressed, outputMime;

    if (inputFormat === 'image/jpeg' || inputFormat === 'image/jpg') {
      compressed = await image.jpeg({ quality: 60 }).toBuffer();
      outputMime = 'image/jpeg';
    } else if (inputFormat === 'image/png') {
      compressed = await image.png({ quality: 60, compressionLevel: 9 }).toBuffer();
      outputMime = 'image/png';
    } else if (inputFormat === 'image/webp') {
      compressed = await image.webp({ quality: 60 }).toBuffer();
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
