import { supabase } from './supabase-client';
import { getGeminiEmbedding } from './gemini-client';

export async function embedAndInsertQA(question: string, answer: string, tags: string[] = []) {
  // Get embedding from Gemini
  const embedding = await getGeminiEmbedding(question);
  // Insert into Supabase
  const { error } = await supabase.from('knowledge_base').insert([
    { question, answer, embedding, tags }
  ]);
  if (error) throw error;
}

export async function searchKnowledgeBase(query: string, matchThreshold = 0.8, matchCount = 3) {
  // Get embedding for the query
  const embedding = await getGeminiEmbedding(query);
  // Call Supabase RPC for vector search
  const { data, error } = await supabase.rpc('match_knowledge', {
    query_embedding: embedding,
    match_threshold: matchThreshold,
    match_count: matchCount
  });
  if (error) throw error;
  return data;
} 