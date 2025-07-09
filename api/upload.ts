import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { IncomingMessage } from 'http';
// @ts-expect-error: NextApiResponse is compatible with Vercel res object
import type { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function parseForm(req: IncomingMessage): Promise<{ file: formidable.File }> {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      let file = files.file as formidable.File | formidable.File[] | undefined;
      if (Array.isArray(file)) file = file[0];
      if (!file) return reject(new Error('No file uploaded'));
      resolve({ file });
    });
  });
}

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not set' });
  }
  try {
    const { file } = await parseForm(req);
    const ext = path.extname(file.originalFilename || '').toLowerCase();
    let summary = '';
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      // Image: encode as base64 and send to OpenAI Vision
      const imageData = fs.readFileSync(file.filepath, { encoding: 'base64' });
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'system',
              content:
                'You are a solar energy expert. Analyze the uploaded image and provide insights or extract relevant data for a solar project.',
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this image for solar project insights.' },
                {
                  type: 'image_url',
                  image_url: { url: `data:image/${ext.replace('.', '')};base64,${imageData}` },
                },
              ],
            },
          ],
          max_tokens: 300,
        }),
      });
      const data = await openaiRes.json();
      summary = data.choices?.[0]?.message?.content || 'Image analyzed.';
    } else if (ext === '.pdf') {
      // PDF: extract text (requires pdf-parse)
      // const pdfParse = require('pdf-parse');
      // const dataBuffer = fs.readFileSync(file.filepath);
      // const pdfData = await pdfParse(dataBuffer);
      // const text = pdfData.text.slice(0, 2000);
      const text = '[PDF text extraction requires pdf-parse. Add implementation here.]';
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a solar energy expert. Summarize the following document for a solar project.',
            },
            { role: 'user', content: text },
          ],
          max_tokens: 300,
        }),
      });
      const data = await openaiRes.json();
      summary = data.choices?.[0]?.message?.content || 'Document summarized.';
    } else if (ext === '.csv' || ext === '.txt') {
      // CSV/TXT: extract text
      const text = fs.readFileSync(file.filepath, 'utf8').slice(0, 2000);
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a solar energy expert. Summarize the following document for a solar project.',
            },
            { role: 'user', content: text },
          ],
          max_tokens: 300,
        }),
      });
      const data = await openaiRes.json();
      summary = data.choices?.[0]?.message?.content || 'Document summarized.';
    } else {
      summary = 'Unsupported file type.';
    }
    return res.status(200).json({ summary });
  } catch (err) {
    return res.status(500).json({ error: 'File analysis error', details: String(err) });
  }
}

// Note: To fully enable PDF parsing, install pdf-parse. For CSV, use csv-parse if needed. For images, GPT-4 Vision API is required.
