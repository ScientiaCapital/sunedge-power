import { IncomingMessage } from 'http';
// @ts-expect-error: NextApiResponse is compatible with Vercel res object
import type { NextApiResponse } from 'next';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: NextApiResponse,
) {
  // Vercel/Next.js API routes: req.body is parsed JSON or undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = (req.body ?? {}) as any;
  const { messages, message } = body;
  let chatMessages;
  if (Array.isArray(messages) && messages.length > 0) {
    chatMessages = [
      {
        role: 'system',
        content:
          'You are a helpful solar energy expert. Answer questions about solar, clean energy, and provide rough commercial solar estimates based on user input. If the user asks for an estimate, ask for their location, facility size or available space, and energy usage.',
      },
      ...messages,
    ];
  } else if (typeof message === 'string') {
    chatMessages = [
      {
        role: 'system',
        content:
          'You are a helpful solar energy expert. Answer questions about solar, clean energy, and provide rough commercial solar estimates based on user input. If the user asks for an estimate, ask for their location, facility size or available space, and energy usage.',
      },
      { role: 'user', content: message },
    ];
  } else {
    return res.status(400).json({ error: 'Missing or invalid message(s)' });
  }

  try {
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
      }),
    });

    if (!openaiRes.ok) {
      const error = await openaiRes.text();
      return res.status(500).json({ error: 'OpenAI API error', details: error });
    }

    const data = await openaiRes.json();
    const aiMessage =
      data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    return res.status(200).json({ response: aiMessage });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
}

// To use this function, set your OpenAI API key in your Vercel project settings as OPENAI_API_KEY.
