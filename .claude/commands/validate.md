# Validation Workflow

Run comprehensive validation checks for SunEdge Power website.

## Critical Rules (MUST FOLLOW)
- **NO OpenAI** - This is a static website, no AI features needed
- **NO hardcoded secrets** - Not applicable for static site, but always check
- **Vercel hosting only** - Production deployment on Vercel

## Multi-Phase Validation

### Phase 1: TypeScript Type Checking
```bash
cd /Users/tmkipper/Desktop/tk_projects/sunedge-power
npx tsc --noEmit
```
**Expected**: Zero type errors. All React components and TypeScript files must pass type checking.

### Phase 2: Linting
```bash
npm run lint
```
**Expected**: Zero linting errors. ESLint configured for TypeScript + React.

### Phase 3: Build Validation
```bash
npm run build
```
**Expected**:
- Clean build output to `dist/` directory
- No build errors or warnings
- Optimized bundles for production

### Phase 4: Dev Server Test
```bash
npm run dev
```
**Expected**:
- Dev server starts on http://localhost:5173
- All sections render correctly:
  - Hero (Full-Service C&I Solar EPC positioning)
  - Stats Dashboard (2+ MW, 19 years, EPC, Nationwide)
  - EPC Services (Engineering, Procurement, Construction, O&M)
  - Leadership (Ron McCabe & Kyle Amundsen)
  - Capabilities (Equipment, Nationwide, Construction Heritage)
  - Markets (Commercial, Industrial, Agricultural, Municipal, Utility-Scale)
  - Contact (Request Consultation CTA)
- Brand colors display correctly (orange-500, orange-600, amber-400, slate-900)
- No console errors

### Phase 5: Production Deployment Check
```bash
# Check current deployment status
vercel ls

# Deploy to production (if changes made)
vercel --prod
```
**Expected**:
- Deployment succeeds to https://sunedge-power.vercel.app
- Custom domain sunedgepower.com works (once DNS configured)
- SSL certificate auto-provisions
- All sections load properly in production

## Validation Checklist

- [ ] TypeScript compilation passes (Phase 1)
- [ ] Linting passes with 0 warnings (Phase 2)
- [ ] Production build succeeds (Phase 3)
- [ ] Dev server runs without errors (Phase 4)
- [ ] All 7 sections render correctly
- [ ] Brand colors match design (orange/amber/slate)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Vercel deployment succeeds (Phase 5)
- [ ] No OpenAI dependencies found
- [ ] No hardcoded API keys or secrets

## Common Issues

**TypeScript errors**: Check component prop types, event handlers, state management
**Build failures**: Check for missing dependencies, incorrect imports
**Styling issues**: Verify Tailwind classes, check PostCSS configuration
**Deployment issues**: Check vercel.json configuration, environment variables

## Success Criteria

All 5 phases pass without errors. Website is production-ready on Vercel.
