# Execute PRP (Prompt-Ready Plan)

Execute a generated PRP with structured validation at each phase.

## Critical Rules
- **NO OpenAI** - Static website only
- **Component-first approach** - Build components before integrating
- **Validate after each phase** - Catch issues early
- **Brand consistency** - Always use orange/amber/slate color scheme

## 6-Phase Execution Workflow

### Phase 1: Context Loading
**Goal**: Load PRP and understand implementation scope

```bash
# List available PRPs
ls -la /Users/tmkipper/Desktop/tk_projects/sunedge-power/PRPs/

# Read the PRP to execute
cat /Users/tmkipper/Desktop/tk_projects/sunedge-power/PRPs/[prp-filename].md
```

**Checklist**:
- [ ] PRP loaded and understood
- [ ] All dependencies identified
- [ ] File paths validated
- [ ] Success criteria clear

---

### Phase 2: ULTRATHINK Planning
**Goal**: Break down implementation into atomic tasks

**Think through**:
1. Component dependency tree (what depends on what?)
2. Type definitions needed first
3. Order of file creation (types → components → integration)
4. Potential edge cases or conflicts
5. Rollback strategy if something breaks

**Output**: Ordered task list with dependencies

---

### Phase 3: Implementation
**Goal**: Execute code changes following the plan

**Component-First Approach**:

**Step 3.1: Create Types (if needed)**
```bash
# Create type definitions first
# Location: /Users/tmkipper/Desktop/tk_projects/sunedge-power/src/types/
```

**Step 3.2: Build Component**
```bash
# Create React component
# Location: /Users/tmkipper/Desktop/tk_projects/sunedge-power/src/components/
```

**Component Template**:
```typescript
import React from 'react';

interface ComponentNameProps {
  // Props
}

const ComponentName: React.FC<ComponentNameProps> = () => {
  return (
    <section className="bg-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Content */}
      </div>
    </section>
  );
};

export default ComponentName;
```

**Step 3.3: Apply Styling**
Use brand colors:
- Background: `bg-slate-900` or `bg-slate-800`
- Headings: `text-white text-4xl font-bold`
- Body text: `text-slate-300 text-lg`
- CTA buttons: `bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg`
- Accents: `text-amber-400`

**Step 3.4: Integrate Component**
```typescript
// Update src/App.tsx
import ComponentName from './components/ComponentName';

function App() {
  return (
    <>
      {/* Existing components */}
      <ComponentName />
    </>
  );
}
```

---

### Phase 4: Validation
**Goal**: Verify implementation works correctly

**4.1 TypeScript Check**:
```bash
cd /Users/tmkipper/Desktop/tk_projects/sunedge-power
npx tsc --noEmit
```
**Expected**: Zero errors

**4.2 Lint Check**:
```bash
npm run lint
```
**Expected**: Zero errors

**4.3 Build Check**:
```bash
npm run build
```
**Expected**: Clean build to `dist/`

**4.4 Dev Server Visual Test**:
```bash
npm run dev
# Open http://localhost:5173
```
**Verify**:
- Component renders correctly
- Brand colors match design (orange/amber/slate)
- Responsive on mobile/tablet/desktop
- No console errors
- Smooth scrolling (if applicable)
- Interactive elements work

**Checklist**:
- [ ] TypeScript passes
- [ ] Lint passes
- [ ] Build succeeds
- [ ] Visual appearance correct
- [ ] Responsive design works
- [ ] No console errors
- [ ] Brand colors consistent

---

### Phase 5: Review & Testing
**Goal**: Comprehensive quality check

**5.1 Cross-Browser Testing** (if applicable):
- Chrome (primary)
- Safari
- Firefox
- Mobile browsers (iOS Safari, Chrome Mobile)

**5.2 Performance Check**:
- Build size (check `dist/` folder size)
- Page load speed
- Image optimization (if images added)

**5.3 Accessibility**:
- Semantic HTML elements
- Alt text for images
- Keyboard navigation
- ARIA labels (if interactive elements)

**5.4 Content Review**:
- Spelling/grammar correct
- Company info accurate (Ron McCabe, Kyle Amundsen)
- Links work (if any)
- Contact info correct

---

### Phase 6: Documentation & Completion
**Goal**: Document changes and verify against PRP

**6.1 Update TASK.md**:
```bash
# Mark feature as complete
# Document any deviations from PRP
# Note any follow-up tasks
```

**6.2 Git Commit** (if appropriate):
```bash
cd /Users/tmkipper/Desktop/tk_projects/sunedge-power
git add .
git commit -m "feat: [feature description]"
git push origin main
```

**6.3 Deploy to Vercel** (if ready for production):
```bash
vercel --prod
```

**6.4 Verify Production**:
- Visit https://sunedge-power.vercel.app
- Test new feature in production
- Check mobile responsiveness
- Verify no broken functionality

**Final Checklist**:
- [ ] All PRP tasks completed
- [ ] Validation passed (Phase 4)
- [ ] Testing complete (Phase 5)
- [ ] TASK.md updated
- [ ] Code committed (if applicable)
- [ ] Production deployment successful
- [ ] Feature verified in production

---

## Rollback Procedure

If validation fails in Phase 4 or 5:

```bash
# Revert changes
git checkout -- [file-path]

# Or reset to last commit
git reset --hard HEAD

# Restart from Phase 2 (ULTRATHINK) with new approach
```

---

## Success Criteria

1. All 6 phases completed without errors
2. New feature matches PRP specifications
3. Brand design system maintained (orange/amber/slate)
4. TypeScript + Lint + Build all pass
5. Production deployment successful
6. No regressions in existing features

---

## Post-Execution

**Next Steps**:
1. Monitor Vercel deployment logs
2. Get stakeholder feedback (Ron McCabe)
3. Plan next feature enhancement
4. Update project roadmap in TASK.md
