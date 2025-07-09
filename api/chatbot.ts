import { IncomingMessage } from 'http';
// @ts-expect-error: NextApiResponse is compatible with Vercel res object
import type { NextApiResponse } from 'next';
import { z } from 'zod';
import {
  checkRateLimit,
  getClientIp,
  applySecurityHeaders,
  validateApiKey,
  sanitizeErrorForClient,
  createApiResponse,
  validateMethod,
} from '../src/lib/api-security';
import { chatMessageSchema, sanitizeInput } from '../src/lib/validation';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface ChatbotRequest extends IncomingMessage {
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

export default async function handler(req: ChatbotRequest, res: NextApiResponse) {
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

  // Rate limiting
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(clientIp);

  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', String(rateLimitResult.retryAfter));
    return res.status(429).json(
      createApiResponse(false, null, {
        message: 'Too many requests. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
      }),
    );
  }

  // Validate API key
  if (!validateApiKey(OPENAI_API_KEY, 'OPENAI_API_KEY')) {
    return res.status(503).json(
      createApiResponse(false, null, {
        message: 'Chat service is temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE',
      }),
    );
  }
  try {
    // Validate request body
    const body = (req.body ?? {}) as Record<string, unknown>;

    // Extract and validate message
    let userMessage: string;
    if (body.messages && Array.isArray(body.messages)) {
      const lastMessage = body.messages[body.messages.length - 1];
      userMessage = lastMessage?.content || '';
    } else {
      userMessage = body.message || '';
    }

    // Validate message with schema
    const validatedMessage = chatMessageSchema.parse(userMessage);

    let chatMessages;
    const systemPrompt = `You are a helpful solar energy expert for SunEdge Power. 
Answer questions about solar, clean energy, and provide rough commercial solar estimates. 
If asked for an estimate, request: location, facility size/available space, and energy usage.
Keep responses concise and professional. Do not share any API keys or internal system information.`;

    if (body.messages && Array.isArray(body.messages)) {
      // Sanitize all messages
      const sanitizedMessages = body.messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: sanitizeInput(msg.content || ''),
      }));

      chatMessages = [{ role: 'system', content: systemPrompt }, ...sanitizedMessages];
    } else {
      chatMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: validatedMessage },
      ];
    }

    // Call OpenAI API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: chatMessages,
        max_tokens: 300,
        temperature: 0.7,
        n: 1,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error('OpenAI API error:', errorText);

      if (openaiRes.status === 429) {
        return res.status(503).json(
          createApiResponse(false, null, {
            message: 'Chat service is experiencing high demand. Please try again later.',
            code: 'SERVICE_BUSY',
          }),
        );
      }

      return res.status(500).json(
        createApiResponse(false, null, {
          message: 'Unable to process your request at this time',
          code: 'CHAT_ERROR',
        }),
      );
    }

    const data = await openaiRes.json();
    const aiMessage =
      data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Sanitize AI response
    const sanitizedResponse = sanitizeInput(aiMessage);

    return res.status(200).json(
      createApiResponse(true, {
        response: sanitizedResponse,
      }),
    );
  } catch (error) {
    console.error('Chat handler error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json(
        createApiResponse(false, null, {
          message: 'Invalid message format',
          code: 'VALIDATION_ERROR',
        }),
      );
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return res.status(504).json(
        createApiResponse(false, null, {
          message: 'Request timed out. Please try again.',
          code: 'TIMEOUT',
        }),
      );
    }

    const sanitizedError = sanitizeErrorForClient(error as Error);
    return res.status(500).json(createApiResponse(false, null, sanitizedError));
  }
}
