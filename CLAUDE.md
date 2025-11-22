# SunEdge Power - Project Instructions

## Project Overview
Commercial & Industrial (C&I) solar EPC contractor website for SunEdge Power LLC.

## Current Status (2025-11-22)

### DEPLOYED TO PRODUCTION
- **Vercel URL**: https://sunedge-power.vercel.app
- **Custom Domain**: sunedgepower.com (pending DNS configuration)
- **GitHub**: https://github.com/ScientiaCapital/sunedge-power

### Domain Setup (Ready for Ron)
Domain `sunedgepower.com` is configured in Vercel. Ron needs to add these DNS records in GoDaddy:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| A | www | 76.76.21.21 |

SSL certificates will auto-provision once DNS propagates.

### Design Decisions
- **Positioning**: Full-Service C&I Solar EPC Contractor
- **Color Palette**: Orange/amber brand colors (from mascot design)
  - Primary: orange-500, orange-600
  - Accents: amber-400
  - Background: slate-900, slate-800 (professional dark theme)
- **Structure**: Enterprise-level single-page application
- **Framework**: React + TypeScript + Vite + Tailwind CSS

### Key Sections
1. Hero - Full-Service C&I Solar EPC positioning
2. Stats Dashboard - 2+ MW, 19 years, EPC, Nationwide
3. EPC Services - Engineering, Procurement, Construction, O&M Support
4. Leadership - Ron McCabe & Kyle Amundsen bios
5. Capabilities - Equipment, Nationwide, Construction Heritage
6. Markets - Commercial, Industrial, Agricultural, Municipal, Utility-Scale
7. Contact - Request Consultation CTA

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite 4.5
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Domain**: GoDaddy (sunedgepower.com)

## Development Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Git Remotes
- **origin**: https://github.com/ScientiaCapital/sunedge-power.git (primary)
- **timmy**: https://github.com/thkipper/sunedge-power.git (Timmy's fork)

Note: ScientiaCapital doesn't have push access to timmy remote. Timmy needs to pull from origin.

## Next Steps
1. Ron configures GoDaddy DNS records
2. Wait for DNS propagation (5-30 min)
3. Verify site at sunedgepower.com
4. Add contact form backend (if needed)
5. Add project portfolio/case studies (future)

## Team
- **Ron McCabe** - Managing Member & Partner, Founder (2006)
- **Kyle Amundsen** - Partner & Solar Operations Director (2017)
