# sunedge-power

**Branch**: main | **Updated**: 2025-11-30

## Status
C&I Solar EPC contractor website DEPLOYED to production.
Waiting on Ron to configure GoDaddy DNS records for custom domain.

## Today's Focus
1. [ ] Verify Vercel deployment at https://sunedge-power.vercel.app
2. [ ] Follow up with Ron on DNS configuration

## Done (This Session)
- (none yet)

## Critical Rules
- **NO OpenAI models** - Use DeepSeek, Qwen, Moonshot via OpenRouter
- API keys in `.env` only, never hardcoded

## Blockers
- DNS records need to be configured by Ron in GoDaddy

## Quick Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
vercel --prod        # Deploy to Vercel
```

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite 4.5
- **Styling**: Tailwind CSS (orange/amber brand colors)
- **Hosting**: Vercel
- **Domain**: GoDaddy (sunedgepower.com - pending DNS)
