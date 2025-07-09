import { CohereClient } from 'cohere-ai';
import { AI_CONFIG } from './ai-config';

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiter
export const checkRateLimit = (key: string): boolean => {
  const now = Date.now();
  const limit = rateLimitStore.get(key);

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + AI_CONFIG.rateLimit.windowMs,
    });
    return true;
  }

  if (limit.count >= AI_CONFIG.rateLimit.requests) {
    return false;
  }

  limit.count++;
  return true;
};

// Initialize AI clients
const initCohere = () => {
  if (!AI_CONFIG.cohereKey) return null;
  return new CohereClient({
    token: AI_CONFIG.cohereKey,
  });
};

// Chat service
export const chatWithAI = async (message: string, context?: string): Promise<string> => {
  console.log('chatWithAI called with:', { message, hasContext: !!context });
  console.log('AI_CONFIG.geminiKey exists:', !!AI_CONFIG.geminiKey);

  if (!checkRateLimit('chat')) {
    return "I'm currently experiencing high demand. Please try again in a few minutes.";
  }

  try {
    // Try Gemini 2.0 Flash first (free tier)
    if (AI_CONFIG.geminiKey) {
      const prompt = context
        ? `Context: ${context}\n\nUser: ${message}\n\nAssistant (helpful solar energy expert):`
        : `User: ${message}\n\nAssistant (helpful solar energy expert):`;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AI_CONFIG.geminiKey}`;
      console.log('Calling Gemini API...');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.7,
            candidateCount: 1,
            topK: 10,
            topP: 0.8,
          },
        }),
      });

      console.log('Gemini API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', response.status, errorText);
        throw new Error('Gemini API request failed');
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      throw new Error('Invalid response from Gemini API');
    }

    // Fallback to Cohere
    if (AI_CONFIG.cohereKey) {
      const cohere = initCohere();
      if (cohere) {
        const response = await cohere.generate({
          model: 'command',
          prompt: `You are a helpful solar energy expert assistant for SunEdge Power. ${context || ''}\n\nUser: ${message}\n\nAssistant:`,
          maxTokens: 300,
          temperature: 0.7,
        });
        return response.generations[0].text;
      }
    }

    return 'AI services are currently unavailable. Please contact us directly at 1-888-SUN-EDGE.';
  } catch (error) {
    console.error('Chat error:', error);
    return "I'm having trouble processing your request. Please try again or contact us directly.";
  }
};

// Smart search service
export const searchContent = async (query: string, content: string[]): Promise<string[]> => {
  if (!checkRateLimit('search')) {
    // Fallback to basic search
    return content.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  }

  try {
    // Use Cohere for semantic search (free)
    if (AI_CONFIG.cohereKey) {
      const cohere = initCohere();
      if (cohere) {
        const response = await cohere.rerank({
          model: 'rerank-english-v2.0',
          query: query,
          documents: content.map((text) => ({ text })),
          topN: 5,
        });
        return response.results.map((r) => content[r.index]);
      }
    }

    // Fallback to keyword search
    return content.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  } catch (error) {
    console.error('Search error:', error);
    // Fallback to basic search
    return content.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }
};

// Content recommendations
export const getRecommendations = async (userBehavior: {
  views: string[];
  interests: string[];
}): Promise<string[]> => {
  if (!checkRateLimit('recommendations')) {
    // Simple fallback recommendations
    return ['Commercial Solar Solutions', 'Solar Farm Development', 'Energy Savings Calculator'];
  }

  try {
    if (AI_CONFIG.geminiKey) {
      const prompt = `Based on user viewing: ${userBehavior.views.join(', ')} and interests in: ${userBehavior.interests.join(', ')}, recommend 3 relevant solar energy topics. Return only the topic names, one per line.`;

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': AI_CONFIG.geminiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 100,
              temperature: 0.7,
            },
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text
            .split('\n')
            .filter((r) => r.trim())
            .slice(0, 3);
        }
      }
    }

    // Fallback recommendations based on interests
    const solarTopics = [
      'Commercial Solar ROI Calculator',
      'Solar Farm Development Guide',
      'Federal Tax Incentives',
      'Energy Storage Solutions',
      'Sustainability Reporting',
    ];
    return solarTopics.slice(0, 3);
  } catch (error) {
    console.error('Recommendations error:', error);
    return ['Commercial Solar Solutions', 'Solar Farm Development', 'Energy Savings Calculator'];
  }
};

// Generate meta descriptions
export const generateMetaDescription = async (
  pageTitle: string,
  pageContent: string,
): Promise<string> => {
  if (!checkRateLimit('meta')) {
    // Fallback to basic description
    return `${pageTitle} - SunEdge Power provides commercial solar solutions nationwide. Expert installation for businesses, solar farms, and large-scale projects.`;
  }

  try {
    if (AI_CONFIG.geminiKey) {
      const prompt = `Create a compelling 150-character meta description for a solar company webpage titled "${pageTitle}". Content summary: ${pageContent.substring(0, 200)}...`;

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': AI_CONFIG.geminiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 100,
              temperature: 0.7,
            },
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const description = data.candidates[0].content.parts[0].text.trim();
          return description.length > 160 ? description.substring(0, 157) + '...' : description;
        }
      }
    }

    return `${pageTitle} - SunEdge Power provides commercial solar solutions nationwide. Expert installation for businesses, solar farms, and large-scale projects.`;
  } catch (error) {
    console.error('Meta description error:', error);
    return `${pageTitle} - SunEdge Power provides commercial solar solutions nationwide.`;
  }
};

// Smart form validation messages
export const getSmartErrorMessage = (field: string, value: string, error: string): string => {
  const smartMessages: Record<string, Record<string, string>> = {
    email: {
      invalid: 'Please enter a valid email address (e.g., name@company.com)',
      empty: 'Email is required to send you a quote',
    },
    phone: {
      invalid: 'Please enter a valid phone number (10 digits)',
      empty: 'Phone number helps us reach you faster',
    },
    company: {
      empty: 'Company name helps us customize your solar solution',
      short: 'Please enter your full company name',
    },
    projectDetails: {
      empty: 'Tell us about your project so we can provide an accurate quote',
      short: 'Please provide more details (at least 20 characters)',
    },
  };

  return smartMessages[field]?.[error] || `Please check your ${field}`;
};

// Accessibility suggestions
export const getAccessibilityImprovements = (element: HTMLElement): string[] => {
  const suggestions: string[] = [];

  // Check images
  const images = element.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.alt) {
      suggestions.push(`Add alt text to image: ${img.src}`);
    }
  });

  // Check form labels
  const inputs = element.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    const id = input.id;
    if (!id || !element.querySelector(`label[for="${id}"]`)) {
      suggestions.push(`Add label for input: ${input.name || input.type}`);
    }
  });

  // Check heading hierarchy
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1]);
    if (level - lastLevel > 1) {
      suggestions.push(`Fix heading hierarchy: ${heading.textContent}`);
    }
    lastLevel = level;
  });

  // Check color contrast (basic check)
  const lowContrastElements = element.querySelectorAll(
    '[class*="text-gray-400"], [class*="text-gray-500"]',
  );
  if (lowContrastElements.length > 0) {
    suggestions.push('Consider increasing color contrast for better readability');
  }

  return suggestions;
};
