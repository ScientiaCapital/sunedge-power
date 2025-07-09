// AI Service Configuration
export const AI_CONFIG = {
  // Feature flags
  enableChat: import.meta.env.VITE_ENABLE_AI_CHAT === 'true',
  enableSearch: import.meta.env.VITE_ENABLE_AI_SEARCH === 'true',
  enableRecommendations: import.meta.env.VITE_ENABLE_AI_RECOMMENDATIONS === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',

  // API Keys (these should be in .env.local)
  openaiKey: import.meta.env.VITE_OPENAI_API_KEY,
  cohereKey: import.meta.env.VITE_COHERE_API_KEY,
  geminiKey: import.meta.env.VITE_GEMINI_API_KEY,
  huggingfaceKey: import.meta.env.VITE_HUGGINGFACE_API_KEY,

  // Cloudinary
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
    apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  },

  // EmailJS
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  },

  // Rate limiting
  rateLimit: {
    requests: parseInt(import.meta.env.VITE_RATE_LIMIT_REQUESTS || '100'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  },

  // Default AI provider (use free tier by default)
  defaultProvider: 'gemini' as 'openai' | 'gemini' | 'cohere',
};

// Check which services are available
export const getAvailableServices = () => {
  const services = [];
  if (AI_CONFIG.geminiKey) services.push('gemini');
  if (AI_CONFIG.cohereKey) services.push('cohere');
  if (AI_CONFIG.openaiKey) services.push('openai');
  return services;
};
