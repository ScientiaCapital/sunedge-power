# AI Features Setup Guide for SunEdge Power Website

## Overview
This guide will help you implement AI-powered features with a focus on free tier options and cost-effective solutions.

## 1. API Keys and Services Setup

### OpenAI API (Chatbot & Content Generation)
- **Free Tier**: $5 free credits for new users
- **Cost**: ~$0.002 per 1K tokens (GPT-3.5-turbo)
- **Sign Up**: https://platform.openai.com/signup
- **Get API Key**: Dashboard → API Keys → Create new secret key

### Cohere (Free Alternative for NLP)
- **Free Tier**: 100 API calls/minute, unlimited monthly
- **Cost**: Free for production use under limits
- **Sign Up**: https://cohere.com/
- **Use Cases**: Search, classification, embeddings

### Google Gemini (Free Alternative)
- **Free Tier**: 60 requests/minute
- **Cost**: Free tier generous for most use cases
- **Sign Up**: https://makersuite.google.com/app/apikey
- **Use Cases**: Chat, content generation, search

### Hugging Face (Free AI Models)
- **Free Tier**: Rate-limited API access
- **Cost**: Free for most models
- **Sign Up**: https://huggingface.co/join
- **Use Cases**: Text generation, image optimization, NLP

### Cloudinary (Image Optimization)
- **Free Tier**: 25 credits/month (25,000 transformations)
- **Cost**: Pay-as-you-go after free tier
- **Sign Up**: https://cloudinary.com/users/register/free

### Vercel Analytics (User Behavior)
- **Free Tier**: Included with Vercel hosting
- **Cost**: Free for personal projects
- **Setup**: Enable in Vercel dashboard

### EmailJS (Automated Email Responses)
- **Free Tier**: 200 emails/month
- **Cost**: $9/month for 1,000 emails
- **Sign Up**: https://www.emailjs.com/

## 2. Environment Variables Setup

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Add your API keys to `.env.local` (this file is gitignored)

3. **IMPORTANT**: Never commit `.env.local` to version control!

## 3. Cost Breakdown

### Free Tier Limits:
- **Chatbot**: ~1,000 conversations/month (Cohere) or 1,800/day (Gemini)
- **Search**: Unlimited with Cohere
- **Image Optimization**: 25,000 images/month (Cloudinary)
- **Email Responses**: 200 emails/month (EmailJS)
- **Analytics**: Unlimited (Vercel Analytics)

### Estimated Monthly Costs (After Free Tiers):
- **Low Traffic (1K users)**: ~$0-10
- **Medium Traffic (10K users)**: ~$20-50
- **High Traffic (100K users)**: ~$100-300

## 4. Implementation Priority

1. **High Priority (Free)**:
   - Smart search (Cohere/Gemini)
   - Basic chatbot (Gemini/Cohere)
   - Analytics (Vercel)
   - Accessibility improvements (Client-side)

2. **Medium Priority (Mostly Free)**:
   - Image optimization (Cloudinary)
   - Smart form validation (Client-side)
   - Basic personalization (LocalStorage)

3. **Low Priority (May Require Paid Tiers)**:
   - Advanced chatbot (OpenAI)
   - AI content generation
   - Advanced personalization

## 5. Security Best Practices

1. **Never expose API keys in client-side code**
2. **Use environment variables**
3. **Implement rate limiting**
4. **Create API routes for sensitive operations**
5. **Monitor usage to avoid unexpected costs**
6. **Use `.gitignore` to exclude sensitive files**
7. **Rotate API keys regularly**

## 6. Getting Started

1. Sign up for the free services listed above
2. Copy `.env.local.example` to `.env.local`
3. Add your API keys to `.env.local`
4. Install required packages:
   ```bash
   npm install openai cohere-ai @google/generative-ai @huggingface/inference cloudinary emailjs-com @vercel/analytics
   ```

## 7. Alternative Free Options

- **Anthropic Claude**: Limited free API access
- **Local AI**: Run models locally with Ollama
- **TensorFlow.js**: Client-side ML (no API needed)
- **Replicate**: Pay-per-use with free credits
- **Together AI**: $25 free credits

## 8. Rate Limiting Strategy

To stay within free tiers:
- Implement client-side rate limiting
- Cache AI responses
- Use progressive enhancement
- Fallback to simpler alternatives when limits reached