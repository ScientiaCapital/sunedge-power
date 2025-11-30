# SunEdge Power - Architecture & Planning

**Last Updated**: 2025-11-30
**Project Type**: Static Website
**Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS
**Hosting**: Vercel

---

## 1. Project Overview

### Business Context
SunEdge Power LLC is a Commercial & Industrial (C&I) solar EPC (Engineering, Procurement, Construction) contractor with 19 years of experience. The company provides full-service solar solutions for commercial, industrial, agricultural, municipal, and utility-scale projects.

### Website Goals
1. **Positioning**: Establish SunEdge Power as a full-service C&I Solar EPC contractor
2. **Credibility**: Showcase 19 years of experience, 2+ MW installed, nationwide capability
3. **Lead Generation**: Drive consultation requests from qualified C&I prospects
4. **Team Visibility**: Highlight leadership (Ron McCabe, Kyle Amundsen)
5. **Differentiation**: Emphasize EPC expertise, equipment access, construction heritage

### Target Audience
- Commercial property owners/managers
- Industrial facility operators
- Agricultural operations
- Municipal governments
- Solar developers (partnerships)

---

## 2. Technical Architecture

### Single-Page Application (SPA)

**Framework**: React 18 with TypeScript
- Component-based architecture
- Type-safe development
- Modern hooks-based patterns
- Functional components (no class components)

**Build Tool**: Vite 4.5
- Fast HMR (Hot Module Replacement) for development
- Optimized production builds
- ES modules native support
- TypeScript integration out-of-the-box

**Styling**: Tailwind CSS
- Utility-first CSS framework
- Mobile-first responsive design
- Custom brand color configuration
- PostCSS processing

**Hosting**: Vercel
- Edge network deployment
- Automatic SSL certificates
- GitHub integration for CI/CD
- Zero-config deployment

---

## 3. Brand Identity System

### Color Palette

**Primary Colors** (from mascot design):
```css
Orange: #f97316 (orange-500)  /* Primary CTAs, brand accent */
Orange Dark: #ea580c (orange-600)  /* Hover states */
Amber: #fbbf24 (amber-400)  /* Highlights, accents */
```

**Background Colors** (professional dark theme):
```css
Slate 900: #0f172a  /* Primary background */
Slate 800: #1e293b  /* Section alternates */
Slate 700: #334155  /* Cards, borders */
```

**Text Colors**:
```css
White: #ffffff  /* Headings */
Slate 300: #cbd5e1  /* Body text */
Slate 400: #94a3b8  /* Secondary text */
```

### Typography
- **Headings**: Large, bold, white
  - H1: `text-5xl md:text-6xl font-bold text-white`
  - H2: `text-4xl md:text-5xl font-bold text-white`
  - H3: `text-2xl md:text-3xl font-semibold text-white`

- **Body**: Readable, slate-300
  - Large: `text-lg md:text-xl text-slate-300`
  - Regular: `text-base text-slate-300`

### Component Patterns
**Container**: `max-w-7xl mx-auto px-6`
**Section**: `py-20` (vertical padding)
**Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
**CTA Button**: `bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors`

---

## 4. Site Structure & Sections

### Section 1: Hero
**Purpose**: Immediate value proposition and positioning

**Content**:
- H1: "Full-Service C&I Solar EPC Contractor"
- Tagline: "Engineering, Procurement, Construction & Operations"
- CTA: "Request Consultation"

**Design**:
- Full viewport height (`min-h-screen`)
- Gradient background (slate-900 to slate-800)
- Centered text with large typography
- Prominent orange CTA button

**File**: `/Users/tmkipper/Desktop/tk_projects/sunedge-power/src/components/Hero.tsx`

---

### Section 2: Stats Dashboard
**Purpose**: Quick credibility markers

**Content**:
- 2+ MW Installed
- 19 Years Experience
- EPC Expertise
- Nationwide Capability

**Design**:
- 4-column grid (responsive to 1-column on mobile)
- Large numbers with amber-400 accent
- Description text below each stat
- Dark slate-800 background

**File**: `/Users/tmkipper/Desktop/tk_projects/sunedge-power/src/components/Stats.tsx`

---

### Section 3: EPC Services
**Purpose**: Explain full-service offering

**Content**:
- Engineering: Design, permitting, interconnection
- Procurement: Equipment sourcing, logistics
- Construction: Installation, project management
- O&M Support: Ongoing operations & maintenance

**Design**:
- 4-column service cards
- Icon + title + description pattern
- White text on slate-900 background
- Hover effects on cards

**File**: `/Users/tmkipper/Desktop/tk_projects/sunedge-power/src/components/Services.tsx`

---

### Section 4: Leadership
**Purpose**: Build trust through team visibility

**Content**:
- **Ron McCabe**: Managing Member & Partner, Founder (2006)
  - Bio: 19 years of solar industry experience, EPC expertise
- **Kyle Amundsen**: Partner & Solar Operations Director (2017)
  - Bio: 8+ years, operations and project management

**Design**:
- 2-column layout (stacks on mobile)
- Photo + name + title + bio
- Professional headshots (placeholder or real photos)
- Slate-800 background

**File**: `/Users/tmkipper/Desktop/tk_projects/sunedge-power/src/components/Leadership.tsx`

---

### Section 5: Capabilities
**Purpose**: Highlight competitive advantages

**Content**:
- Equipment Access: Direct manufacturer relationships
- Nationwide Reach: Projects across the United States
- Construction Heritage: Deep construction expertise

**Design**:
- 3-column grid (responsive)
- Icon + heading + description
- Orange accent icons
- Slate-900 background

**File**: `/Users/tmkipper/Desktop/tk_projects/sunedge-power/src/components/Capabilities.tsx`

---

### Section 6: Markets Served
**Purpose**: Show breadth of experience

**Content**:
- Commercial: Retail, office buildings
- Industrial: Manufacturing, warehouses
- Agricultural: Farms, processing facilities
- Municipal: Government buildings, schools
- Utility-Scale: Large solar farms

**Design**:
- 5-column horizontal cards (scroll on mobile)
- Icon + market name + description
- Slate-800 background
- Hover highlights

**File**: `/Users/tmkipper/Desktop/tk_projects/sunedge-power/src/components/Markets.tsx`

---

### Section 7: Contact / CTA
**Purpose**: Capture leads

**Content**:
- H2: "Ready to Go Solar?"
- Description: "Get a consultation from our EPC experts"
- CTA: "Request Consultation" (email link or form)

**Design**:
- Centered content
- Large orange CTA button
- Contact information (email, phone)
- Slate-900 background

**File**: `/Users/tmkipper/Desktop/tk_projects/sunedge-power/src/components/Contact.tsx`

---

## 5. File Structure

```
sunedge-power/
├── .claude/
│   ├── commands/
│   │   ├── validate.md          # Validation workflow
│   │   ├── generate-prp.md      # PRP generation
│   │   └── execute-prp.md       # PRP execution
│   ├── PROJECT_CONTEXT.md
│   └── settings.local.json
├── PRPs/
│   ├── templates/
│   │   └── prp_base.md          # PRP template
│   └── [feature-name]-YYYYMMDD.md  # Individual PRPs
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── Services.tsx
│   │   ├── Leadership.tsx
│   │   ├── Capabilities.tsx
│   │   ├── Markets.tsx
│   │   └── Contact.tsx
│   ├── App.tsx                  # Main component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind imports
├── public/                      # Static assets
├── dist/                        # Build output
├── CLAUDE.md                    # Project instructions
├── PLANNING.md                  # This file
├── TASK.md                      # Current work tracking
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── vercel.json                  # Deployment config
```

---

## 6. Data Flow

**Static Website**: No backend, no database, no API calls

**Content Management**:
- All content hardcoded in React components
- Future: Could migrate to headless CMS if needed
- For now: Edit components directly to update content

**State Management**:
- No global state needed (static content)
- Component-level state for interactions (if any)
- No Redux, Zustand, or context providers required

**Forms** (future):
- Contact form could POST to:
  - Email service (SendGrid, Resend)
  - Form handler (Formspree, Basin)
  - Vercel Serverless Function
  - Currently: mailto link or phone number

---

## 7. Deployment Pipeline

### Development Workflow
```bash
# 1. Local development
npm run dev          # http://localhost:5173

# 2. Type checking
npx tsc --noEmit

# 3. Linting
npm run lint

# 4. Build
npm run build

# 5. Preview production build
npm run preview
```

### Production Deployment
```bash
# Deploy to Vercel
vercel --prod

# Automatic deployment on git push to main branch
# GitHub integration auto-deploys
```

### URLs
- **Vercel**: https://sunedge-power.vercel.app
- **Custom Domain**: https://sunedgepower.com (pending DNS configuration)

### Environment Variables
None required for static website.

---

## 8. Critical Rules & Constraints

### NO OpenAI
This is a static website. No AI features, no LLM integrations, no OpenAI API calls.

### NO Hardcoded Secrets
Not applicable for static site, but general rule: no API keys, no credentials.

### Vercel Hosting Only
Production deployment exclusively on Vercel. No AWS, Netlify, or other platforms.

### Brand Consistency
Always use orange/amber/slate color scheme. No deviations from brand palette.

### TypeScript Strict Mode
All components must be type-safe. No `any` types, no type assertions without justification.

---

## 9. Performance Considerations

### Build Optimization
- Vite tree-shaking for minimal bundle size
- Code splitting by route (if multi-page in future)
- Image optimization (use WebP, lazy loading)

### Bundle Size Targets
- Main bundle: < 200 KB
- Total page weight: < 500 KB
- First Contentful Paint: < 1.5s

### Lighthouse Scores (Goals)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## 10. Accessibility Standards

### WCAG 2.1 AA Compliance
- Semantic HTML elements
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- Sufficient color contrast (tested)
- Keyboard navigation support
- ARIA labels where needed

### Tools
- Lighthouse accessibility audit
- axe DevTools for testing
- Manual keyboard navigation testing

---

## 11. Browser Support

### Supported Browsers
- Chrome 90+ (primary)
- Safari 14+ (macOS, iOS)
- Firefox 88+
- Edge 90+

### Mobile Support
- iOS Safari 14+
- Chrome Mobile 90+
- Responsive design: 375px to 1920px

---

## 12. Future Enhancements

### Phase 2 (Post-Launch)
- [ ] Contact form backend integration
- [ ] Project portfolio/case studies
- [ ] Blog for SEO content marketing
- [ ] Customer testimonials
- [ ] Interactive solar calculator

### Phase 3 (Growth)
- [ ] Multi-page architecture (if needed)
- [ ] CMS integration (Sanity, Contentful)
- [ ] Analytics (Google Analytics, Plausible)
- [ ] A/B testing for CTAs
- [ ] Live chat widget

### Phase 4 (Advanced)
- [ ] Customer portal (project tracking)
- [ ] Quote request system
- [ ] Equipment inventory showcase
- [ ] Team expansion (more employees)

---

## 13. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-22 | Initial launch, all 7 sections live |
| 1.1 | 2025-11-30 | Context engineering files added |

---

## 14. Team & Stakeholders

**Technical**:
- Developer: Claude Code (AI assistant)
- Repository: https://github.com/ScientiaCapital/sunedge-power

**Business**:
- **Ron McCabe**: Managing Member & Partner, decision maker
- **Kyle Amundsen**: Partner & Solar Operations Director
- **Timmy (thkipper)**: GitHub account owner, technical contact

**Hosting**:
- Vercel (deployment platform)
- GoDaddy (domain registrar)

---

## 15. Contact & Support

**Project Location**: `/Users/tmkipper/Desktop/tk_projects/sunedge-power`

**Documentation**:
- `CLAUDE.md`: Project instructions (high-level)
- `PLANNING.md`: This architecture document
- `TASK.md`: Current work tracking
- `.claude/commands/`: Workflow commands

**Questions**: Refer to CLAUDE.md for project-specific guidance.
