# Project TODOs

A prioritized checklist for SunEdge Power web project. Use this to track progress and link to GitHub issues as you go.

---

- [ ] **Integrate Sentry (or similar) for error reporting in ErrorBoundary and API endpoints**
  - _Add Sentry or another error reporting tool to catch and report production errors._
  - GitHub Issue: #

- [ ] **Add analytics integration (Plausible, Umami, or Google Analytics) to chatbot and main app**
  - _Implement analytics tracking for user interactions and site usage._
  - GitHub Issue: #

- [ ] **Implement a strict Content Security Policy (CSP) for production deployment**
  - _Add and test a CSP header to prevent XSS and other attacks._
  - GitHub Issue: #

- [ ] **Audit and update all dependencies; remove unused packages**
  - _Review package.json, update outdated dependencies, and remove unused ones._
  - GitHub Issue: #

- [ ] **Expand unit and integration test coverage for UI components, forms, and user flows**
  - _Add more tests for components and flows not currently covered._
  - GitHub Issue: #

- [ ] **Add end-to-end (E2E) tests for critical user journeys (contact form, chatbot, navigation)**
  - _Implement E2E tests using Playwright or Cypress for key flows._
  - GitHub Issue: #

- [ ] **Audit and enhance accessibility (ARIA, keyboard navigation, color contrast, screen reader support)**
  - _Ensure all interactive elements are accessible and meet WCAG standards._
  - GitHub Issue: #

- [ ] **Expand and improve documentation (README, architecture, setup, deployment, JSDoc/comments)**
  - _Add more documentation for onboarding, architecture, and code._
  - GitHub Issue: #

- [ ] **Monitor and optimize bundle size and performance (Bundlemon, image optimization, lazy loading)**
  - _Use Bundlemon and other tools to keep the app fast and efficient._
  - GitHub Issue: #

- [ ] **Harden feature fallbacks for AI/email if not configured; add fallback UI for missing/disabled features**
  - _Ensure graceful degradation if AI or email services are unavailable._
  - GitHub Issue: #

- [ ] **Review and improve security for user input, file uploads, chat, and API endpoints (rate limiting, abuse prevention)**
  - _Double-check all user input and API security._
  - GitHub Issue: #

- [ ] **Add onboarding documentation (CONTRIBUTING.md) for new developers**
  - _Make it easier for new contributors to get started._
  - GitHub Issue: #

- [ ] **Consider extracting a design system or component library for reuse**
  - _Modularize and document reusable UI components._
  - GitHub Issue: #

- [ ] **Expand and test internationalization (i18n) and RTL/locales support if targeting global users**
  - _Add and test translations, RTL support, and regional formats._
  - GitHub Issue: #

---

> As you create GitHub issues, update the checklist with the issue numbers/links for full traceability. 