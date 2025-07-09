import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Some features may be limited.');
}

// Create Supabase client with proper typing
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        global: {
          headers: {
            'x-application-name': 'sunedge-power',
          },
        },
      })
    : null;

// Helper functions for common operations
export const supabaseHelpers = {
  // Upload file to Supabase Storage
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: { upsert?: boolean; contentType?: string },
  ) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: options?.upsert ?? false,
      contentType: options?.contentType,
    });

    if (error) throw error;
    return data;
  },

  // Get public URL for a file
  getPublicUrl(bucket: string, path: string) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  },

  // Get signed URL for private files
  async getSignedUrl(bucket: string, path: string, expiresIn = 3600) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  },

  // Delete file from storage
  async deleteFile(bucket: string, paths: string[]) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) throw error;
  },
};

// Export types for use in components
export type SupabaseClient = typeof supabase;
