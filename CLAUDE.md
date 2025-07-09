# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SunEdge Power is a Tesla-inspired solar energy company website built with React, TypeScript, and Vite. The site features AI integration for enhanced user experience and is deployed on Vercel.

## Essential Commands

### Development
```bash
npm install       # Install dependencies
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

### Git Workflow
When committing changes, ensure to run:
```bash
npm run lint     # Check for linting errors before committing
```

## Architecture Overview

### Core Stack
- **Frontend Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with Tesla-inspired design system
- **UI Components**: Radix UI primitives with custom shadcn/ui implementation
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: React Router v6

### AI Integration Architecture
The project integrates multiple AI providers through a unified service layer:

- **Providers**: OpenAI (primary), Google Gemini, Cohere
- **Entry Points**: 
  - `/api/chatbot.ts` - Serverless chat endpoint
  - `/api/upload.ts` - File analysis endpoint
- **Core Services**:
  - `src/lib/ai-config.ts` - Configuration and provider setup
  - `src/lib/ai-services.ts` - Unified AI service interface
- **Components**:
  - `src/components/ai/ChatBot.tsx` - Interactive chat with "Sunny" mascot
  - `src/components/ai/SmartSearch.tsx` - AI-enhanced search functionality

### Project Structure
```
src/
├── components/
│   ├── ai/          # AI-powered components (ChatBot, SmartSearch)
│   └── ui/          # 50+ reusable UI components following shadcn pattern
├── lib/             # Core utilities, AI services, email service
├── pages/           # Route components (Index, Team, NotFound)
├── hooks/           # Custom React hooks
└── App.tsx          # Main application component with routing
```

### Key Design Patterns

1. **Component Architecture**: Atomic design with compound components using Radix UI slots
2. **Path Aliases**: Use `@/` for `src/` imports (e.g., `@/components/ui/button`)
3. **Styling**: CSS variables for theming, Framer Motion for animations
4. **Type Safety**: TypeScript throughout with some relaxed rules for rapid development
5. **API Routes**: Serverless functions in `/api` directory for Vercel deployment

### Environment Configuration
Key environment variables for AI features:
- `OPENAI_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `COHERE_API_KEY`

### Development Guidelines

1. **Component Creation**: Follow existing patterns in `src/components/ui/` - look at similar components for style and structure
2. **AI Features**: Use the service layer in `src/lib/ai-services.ts` rather than direct API calls
3. **Styling**: Leverage existing Tailwind utilities and design tokens from `tailwind.config.ts`
4. **Tesla Design System**: Maintain consistency with existing Tesla-inspired aesthetics (clean, minimal, solar-themed colors)

### Testing & Quality
- Linting configured but tests not yet implemented
- Use `npm run lint` before committing
- Bundle size monitoring with Bundlemon
- Security scanning with Snyk

### Deployment
- Deployed on Vercel with automatic deployments from main branch
- API routes automatically become serverless functions
- Environment variables must be configured in Vercel dashboard