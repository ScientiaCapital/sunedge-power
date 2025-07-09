import axios from 'axios';

export async function getGeminiEmbedding(text: string): Promise<number[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing Gemini API key');
  const res = await axios.post(
    `https://generativeai.googleapis.com/v1beta/models/embedding-001:embedContent?key=${apiKey}`,
    {
      model: 'models/embedding-001',
      content: { parts: [{ text }] }
    }
  );
  // Gemini returns { embedding: { values: [...] } }
  return res.data.embedding.values;
} 