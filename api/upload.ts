import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { IncomingMessage } from 'http';
// @ts-expect-error: NextApiResponse is compatible with Vercel res object
import type { NextApiResponse } from 'next';
import {
  checkRateLimit,
  getClientIp,
  applySecurityHeaders,
  validateApiKey,
  sanitizeErrorForClient,
  createApiResponse,
  validateMethod,
} from '../src/lib/api-security';
import { sanitizeInput } from '../src/lib/validation';

export const config = {
  api: {
    bodyParser: false,
  },
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function parseForm(req: IncomingMessage): Promise<{ file: formidable.File }> {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      maxFileSize: MAX_FILE_SIZE,
      allowEmptyFiles: false,
      filter: function ({ mimetype }) {
        // Filter files by mimetype
        return mimetype ? ALLOWED_FILE_TYPES.includes(mimetype) : false;
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return reject(new Error('File size exceeds 10MB limit'));
        }
        return reject(err);
      }

      let file = files.file as formidable.File | formidable.File[] | undefined;
      if (Array.isArray(file)) file = file[0];
      if (!file) return reject(new Error('No file uploaded'));

      // Additional validation
      if (!file.mimetype || !ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return reject(new Error('Invalid file type. Only JPG, PNG, WebP and PDF are allowed'));
      }

      resolve({ file });
    });
  });
}

interface UploadRequest extends IncomingMessage {
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

export default async function handler(req: UploadRequest, res: NextApiResponse) {
  // Apply security headers
  applySecurityHeaders(res);

  // Validate HTTP method
  if (!validateMethod(req, ['POST'])) {
    return res.status(405).json(
      createApiResponse(false, null, {
        message: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED',
      }),
    );
  }

  // Rate limiting - stricter for file uploads
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(`upload:${clientIp}`);

  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', String(rateLimitResult.retryAfter));
    return res.status(429).json(
      createApiResponse(false, null, {
        message: 'Too many uploads. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
      }),
    );
  }

  // Validate API key
  if (!validateApiKey(OPENAI_API_KEY, 'OPENAI_API_KEY')) {
    return res.status(503).json(
      createApiResponse(false, null, {
        message: 'File analysis service is temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE',
      }),
    );
  }
  try {
    const { file } = await parseForm(req);

    // Validate file extension matches mimetype
    const ext = path.extname(file.originalFilename || '').toLowerCase();
    const mimeToExt: Record<string, string[]> = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
    };

    if (file.mimetype && mimeToExt[file.mimetype]) {
      const validExts = mimeToExt[file.mimetype];
      if (!validExts.includes(ext)) {
        throw new Error('File extension does not match file type');
      }
    }

    let summary = '';

    if (file.mimetype?.startsWith('image/')) {
      // Image: encode as base64 and send to OpenAI Vision
      const imageData = fs.readFileSync(file.filepath, { encoding: 'base64' });

      // Create timeout for API call
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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
                'You are a solar energy expert. Analyze the uploaded image and provide insights for a solar project. Focus on: roof suitability, available space, shading concerns, and estimated capacity. Keep response concise.',
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this image for solar project insights.' },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${file.mimetype};base64,${imageData}`,
                    detail: 'low', // Use low detail to reduce tokens
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!openaiRes.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await openaiRes.json();
      summary = sanitizeInput(data.choices?.[0]?.message?.content || 'Image analyzed.');
    } else if (file.mimetype === 'application/pdf') {
      // For PDF files, we need to inform the user about the limitation
      summary =
        'PDF analysis is not yet implemented. Please upload an image (JPG, PNG, WebP) of your site for analysis.';
    } else {
      throw new Error('Unsupported file type');
    }

    // Clean up uploaded file
    try {
      fs.unlinkSync(file.filepath);
    } catch (cleanupError) {
      console.error('Failed to clean up file:', cleanupError);
    }

    return res.status(200).json(createApiResponse(true, { summary }));
  } catch (error) {
    console.error('Upload handler error:', error);

    // Clean up file on error
    try {
      const { file } = await parseForm(req).catch(() => ({ file: null }));
      if (file?.filepath) {
        fs.unlinkSync(file.filepath);
      }
    } catch (cleanupError) {
      // Ignore cleanup errors
    }

    if (error instanceof Error) {
      if (error.message.includes('File size')) {
        return res.status(400).json(
          createApiResponse(false, null, {
            message: error.message,
            code: 'FILE_TOO_LARGE',
          }),
        );
      }

      if (error.message.includes('file type')) {
        return res.status(400).json(
          createApiResponse(false, null, {
            message: error.message,
            code: 'INVALID_FILE_TYPE',
          }),
        );
      }

      if (error.name === 'AbortError') {
        return res.status(504).json(
          createApiResponse(false, null, {
            message: 'File analysis timed out. Please try again.',
            code: 'TIMEOUT',
          }),
        );
      }
    }

    const sanitizedError = sanitizeErrorForClient(error as Error);
    return res.status(500).json(createApiResponse(false, null, sanitizedError));
  }
}
