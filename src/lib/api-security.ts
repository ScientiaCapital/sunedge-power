import { z } from 'zod';

// API Security configuration
export const API_SECURITY = {
  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    maxRequestsPerMinute: 20,
  },

  // CORS configuration
  cors: {
    allowedOrigins:
      process.env.NODE_ENV === 'production'
        ? ['https://sunedgepower.com', 'https://www.sunedgepower.com']
        : ['http://localhost:5173', 'http://localhost:3000'],
    allowedMethods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  // Security headers
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  },
};

// Rate limiting store (in-memory for serverless)
const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number; minuteCount: number; minuteReset: number }
>();

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

// Rate limiter function
export const checkRateLimit = (identifier: string): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const limit = rateLimitStore.get(identifier);

  if (!limit) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + API_SECURITY.rateLimit.windowMs,
      minuteCount: 1,
      minuteReset: now + 60000, // 1 minute
    });
    return { allowed: true };
  }

  // Check minute limit
  if (now > limit.minuteReset) {
    limit.minuteCount = 1;
    limit.minuteReset = now + 60000;
  } else if (limit.minuteCount >= API_SECURITY.rateLimit.maxRequestsPerMinute) {
    return {
      allowed: false,
      retryAfter: Math.ceil((limit.minuteReset - now) / 1000),
    };
  } else {
    limit.minuteCount++;
  }

  // Check window limit
  if (now > limit.resetTime) {
    limit.count = 1;
    limit.resetTime = now + API_SECURITY.rateLimit.windowMs;
    return { allowed: true };
  }

  if (limit.count >= API_SECURITY.rateLimit.maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((limit.resetTime - now) / 1000),
    };
  }

  limit.count++;
  return { allowed: true };
};

// API key validation
export const validateApiKey = (key: string | undefined, keyName: string): boolean => {
  if (!key) {
    console.error(`${keyName} is not configured`);
    return false;
  }

  // Basic validation - ensure it's a string with reasonable length
  if (typeof key !== 'string' || key.length < 10) {
    console.error(`Invalid ${keyName} format`);
    return false;
  }

  return true;
};

// Request validation schemas
export const chatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  context: z.string().max(1000).optional(),
});

export const uploadRequestSchema = z.object({
  fileSize: z.number().max(10 * 1024 * 1024), // 10MB
  fileType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
});

// Get client IP for rate limiting
export const getClientIp = (req: {
  headers: Record<string, string | string[] | undefined>;
  connection?: { remoteAddress?: string };
}): string => {
  // Check various headers that might contain the real IP
  const forwarded = req.headers['x-forwarded-for'];
  const real = req.headers['x-real-ip'];
  const cloudflare = req.headers['cf-connecting-ip'];

  if (cloudflare) return cloudflare;
  if (forwarded) return forwarded.split(',')[0].trim();
  if (real) return real;

  // Fallback to connection remote address
  return req.connection?.remoteAddress || 'unknown';
};

// CORS validation
export const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return false;
  return API_SECURITY.cors.allowedOrigins.includes(origin);
};

// Apply security headers
export const applySecurityHeaders = (res: {
  setHeader: (key: string, value: string) => void;
}): void => {
  Object.entries(API_SECURITY.securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
};

// Sanitize error messages for client
export const sanitizeErrorForClient = (error: Error): { message: string; code?: string } => {
  // Don't expose internal error details in production
  if (process.env.NODE_ENV === 'production') {
    // Map common errors to user-friendly messages
    if (error.message.includes('API key')) {
      return { message: 'Service temporarily unavailable', code: 'SERVICE_ERROR' };
    }
    if (error.message.includes('rate limit')) {
      return { message: 'Too many requests. Please try again later.', code: 'RATE_LIMIT' };
    }
    if (error.message.includes('validation')) {
      return { message: 'Invalid request data', code: 'VALIDATION_ERROR' };
    }

    // Generic error for everything else
    return { message: 'An error occurred. Please try again.', code: 'UNKNOWN_ERROR' };
  }

  // In development, return more details
  return {
    message: error.message,
    code: error.name,
  };
};

// Validate request method
export const validateMethod = (req: { method?: string }, allowedMethods: string[]): boolean => {
  return allowedMethods.includes(req.method || '');
};

// Create API response with consistent format
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: { message: string; code?: string },
) => {
  return {
    success,
    data: data || null,
    error: error || null,
    timestamp: new Date().toISOString(),
  };
};
