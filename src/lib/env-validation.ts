import { validateEnv } from './validation';

// Validate environment variables on app initialization
export const initializeEnv = () => {
  try {
    const env = validateEnv();

    // Log validation success in development
    if (import.meta.env.DEV) {
      console.log('✅ Environment variables validated successfully');

      // Check AI provider configuration
      const hasAIProvider =
        env.VITE_OPENAI_API_KEY || env.VITE_GEMINI_API_KEY || env.VITE_COHERE_API_KEY;

      if (!hasAIProvider && env.VITE_ENABLE_AI_CHAT === 'true') {
        console.warn('⚠️  AI Chat is enabled but no AI provider API keys are configured');
      }

      // Check email configuration
      const hasEmailConfig =
        env.VITE_EMAILJS_SERVICE_ID && env.VITE_EMAILJS_TEMPLATE_ID && env.VITE_EMAILJS_PUBLIC_KEY;

      if (!hasEmailConfig) {
        console.warn('⚠️  Email service is not fully configured');
      }
    }

    return env;
  } catch (error) {
    // In production, log error but don't crash the app
    if (import.meta.env.PROD) {
      console.error('Environment validation failed:', error);

      // Return default configuration
      return {
        VITE_ENABLE_AI_CHAT: 'false',
        VITE_ENABLE_AI_SEARCH: 'false',
        VITE_ENABLE_AI_RECOMMENDATIONS: 'false',
        VITE_ENABLE_ANALYTICS: 'false',
        VITE_RATE_LIMIT_REQUESTS: '100',
        VITE_RATE_LIMIT_WINDOW_MS: '900000',
      };
    }

    // In development, throw to alert developers
    throw error;
  }
};

// Helper to check if a feature is enabled
export const isFeatureEnabled = (
  feature: 'chat' | 'search' | 'recommendations' | 'analytics',
): boolean => {
  const featureMap = {
    chat: import.meta.env.VITE_ENABLE_AI_CHAT,
    search: import.meta.env.VITE_ENABLE_AI_SEARCH,
    recommendations: import.meta.env.VITE_ENABLE_AI_RECOMMENDATIONS,
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS,
  };

  return featureMap[feature] === 'true';
};

// Get safe environment variable with fallback
export const getEnvVar = (key: string, fallback: string = ''): string => {
  const value = import.meta.env[key];
  return value || fallback;
};

// Check if running in production
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

// Check if running in development
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};
