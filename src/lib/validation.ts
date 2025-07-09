import { z } from 'zod';
import DOMPurify from 'dompurify';

// Sanitization helper
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
};

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .transform(sanitizeInput)
  .refine((val) => {
    // Email regex that matches the HTML5 email input pattern
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(val);
  }, 'Please enter a valid email address');

// Phone validation (US format)
export const phoneSchema = z
  .string()
  .regex(
    /^(\+1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
    'Please enter a valid phone number',
  )
  .transform(sanitizeInput)
  .optional();

// Name validation
export const nameSchema = z
  .string()
  .min(1, 'This field is required')
  .min(2, 'Must be at least 2 characters')
  .max(50, 'Must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, hyphens and apostrophes allowed')
  .transform(sanitizeInput);

// Company validation
export const companySchema = z
  .string()
  .min(1, 'Company name is required')
  .min(2, 'Company name must be at least 2 characters')
  .max(100, 'Company name must be less than 100 characters')
  .transform(sanitizeInput);

// Project details validation
export const projectDetailsSchema = z
  .string()
  .min(1, 'Project details are required')
  .min(20, 'Please provide more details (at least 20 characters)')
  .max(1000, 'Please keep details under 1000 characters')
  .transform(sanitizeInput);

// Contact form schema
export const contactFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: companySchema,
  projectDetails: projectDetailsSchema,
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
      'Only JPG, PNG, WebP and PDF files are allowed',
    ),
});

// Chat message validation
export const chatMessageSchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(500, 'Message must be less than 500 characters')
  .transform(sanitizeInput);

// Environment variable validation
export const envSchema = z.object({
  // Required for production
  VITE_OPENAI_API_KEY: z.string().optional(),
  VITE_GEMINI_API_KEY: z.string().optional(),
  VITE_COHERE_API_KEY: z.string().optional(),
  VITE_EMAILJS_SERVICE_ID: z.string().optional(),
  VITE_EMAILJS_TEMPLATE_ID: z.string().optional(),
  VITE_EMAILJS_PUBLIC_KEY: z.string().optional(),
  // Feature flags
  VITE_ENABLE_AI_CHAT: z.enum(['true', 'false']).optional(),
  VITE_ENABLE_AI_SEARCH: z.enum(['true', 'false']).optional(),
  VITE_ENABLE_AI_RECOMMENDATIONS: z.enum(['true', 'false']).optional(),
  VITE_ENABLE_ANALYTICS: z.enum(['true', 'false']).optional(),
  // Rate limiting
  VITE_RATE_LIMIT_REQUESTS: z.string().regex(/^\d+$/).optional(),
  VITE_RATE_LIMIT_WINDOW_MS: z.string().regex(/^\d+$/).optional(),
});

// Validate environment on app start
export const validateEnv = () => {
  try {
    const env = envSchema.parse(import.meta.env);

    // Ensure at least one AI provider is configured if chat is enabled
    if (env.VITE_ENABLE_AI_CHAT === 'true') {
      if (!env.VITE_OPENAI_API_KEY && !env.VITE_GEMINI_API_KEY && !env.VITE_COHERE_API_KEY) {
        console.warn('AI Chat is enabled but no AI provider API keys are configured');
      }
    }

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:', error.errors);
      throw new Error('Invalid environment configuration');
    }
    throw error;
  }
};

// XSS-safe HTML rendering helper
export const createSafeHTML = (html: string): { __html: string } => {
  return { __html: DOMPurify.sanitize(html) };
};

// URL validation for preventing open redirects
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    // Only allow http(s) protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// Safe redirect helper
export const getSafeRedirectUrl = (url: string, defaultUrl: string = '/'): string => {
  if (!url) return defaultUrl;

  // Check if it's a relative URL (starts with /)
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url;
  }

  // Check if it's a valid absolute URL
  if (isValidUrl(url)) {
    const parsed = new URL(url);
    const currentHost = window.location.host;

    // Only allow redirects to the same host
    if (parsed.host === currentHost) {
      return url;
    }
  }

  return defaultUrl;
};
