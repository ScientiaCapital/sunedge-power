# Generate PRP (Prompt-Ready Plan)

Generate a detailed implementation plan for new website features.

## Critical Rules
- **NO OpenAI** - Static website, no AI features needed
- **Brand colors**: orange-500, orange-600, amber-400, slate-900, slate-800
- **Framework**: React 18 + TypeScript + Vite + Tailwind CSS
- **Hosting**: Vercel only

## PRP Generation Process

### Step 1: Load Context
Read existing project files to understand current architecture:

```bash
# Read project instructions
cat /Users/tmkipper/Desktop/tk_projects/sunedge-power/CLAUDE.md

# Check existing components
ls -la /Users/tmkipper/Desktop/tk_projects/sunedge-power/src/components/

# Review package.json for dependencies
cat /Users/tmkipper/Desktop/tk_projects/sunedge-power/package.json
```

### Step 2: Understand Feature Requirements
Ask clarifying questions:
- What section/feature needs to be added?
- What's the user goal?
- Any specific design requirements?
- Integration needs (forms, APIs, etc.)?

### Step 3: Design Component Structure
Follow existing patterns:

**Component Pattern**:
```typescript
// src/components/SectionName.tsx
import React from 'react';

interface SectionNameProps {
  // Props here
}

const SectionName: React.FC<SectionNameProps> = () => {
  return (
    <section className="bg-slate-900 py-20">
      {/* Content */}
    </section>
  );
};

export default SectionName;
```

**Tailwind Styling Pattern**:
- Backgrounds: `bg-slate-900`, `bg-slate-800`
- Primary CTA: `bg-orange-500 hover:bg-orange-600`
- Accents: `text-amber-400`
- Headings: `text-white`
- Body text: `text-slate-300`

### Step 4: Plan File Changes
List all files to create/modify:
- New components in `src/components/`
- Updates to `src/App.tsx` (if adding sections)
- New types in `src/types/` (if needed)
- Styling utilities (if needed)

### Step 5: Define Validation Steps
For each change:
- TypeScript type checking
- ESLint validation
- Build test
- Visual inspection in dev server
- Responsive design check

### Step 6: Write PRP Document
Save to `/Users/tmkipper/Desktop/tk_projects/sunedge-power/PRPs/[feature-name]-[date].md`

Use template: `/Users/tmkipper/Desktop/tk_projects/sunedge-power/PRPs/templates/prp_base.md`

## PRP Document Structure

```markdown
# [Feature Name] - Implementation Plan

## Context
[Background, user request, business goal]

## Design Decisions
[Component architecture, styling approach, data flow]

## Implementation Steps

### Phase 1: Component Creation
- [ ] Create [ComponentName].tsx
- [ ] Define TypeScript interfaces
- [ ] Implement component logic

### Phase 2: Styling
- [ ] Apply Tailwind classes
- [ ] Test responsive breakpoints
- [ ] Verify brand colors

### Phase 3: Integration
- [ ] Import component in App.tsx
- [ ] Wire up props/state
- [ ] Test interactions

### Phase 4: Validation
- [ ] TypeScript check
- [ ] Lint check
- [ ] Build check
- [ ] Visual QA

## Success Criteria
[How to verify feature is complete]

## Rollback Plan
[How to revert if issues arise]
```

## Brand Design System

**Color Palette**:
```typescript
// Primary brand colors
const colors = {
  orange: {
    500: '#f97316',  // Primary CTA
    600: '#ea580c',  // Hover state
  },
  amber: {
    400: '#fbbf24',  // Accents
  },
  slate: {
    900: '#0f172a',  // Dark background
    800: '#1e293b',  // Slightly lighter sections
    700: '#334155',  // Cards/borders
    300: '#cbd5e1',  // Body text
  },
};
```

**Section Patterns**:
1. **Hero**: Full viewport height, gradient background, centered CTA
2. **Stats**: Grid layout, large numbers, descriptions
3. **Services**: Card-based layout, icons, descriptions
4. **Leadership**: Two-column bio cards with photos
5. **Capabilities**: Icon + text grid
6. **Markets**: Horizontal card layout
7. **Contact**: Form or CTA button

## Output Location
Save generated PRP to: `/Users/tmkipper/Desktop/tk_projects/sunedge-power/PRPs/[feature-name]-YYYYMMDD.md`

## Next Step
After generating PRP, run `/execute-prp` to implement the plan.
