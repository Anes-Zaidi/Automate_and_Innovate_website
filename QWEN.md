# SOAI Automate Hackathon - Project Documentation

**Project:** SOAI Automate Hackathon Web Application  
**Event:** Automate & Innovate Hackathon at ESTIN Amizour Hub  
**Dates:** April 16-18, 2026  
**Framework:** Next.js 16.2.1 (App Router) | React 19.2.4  
**Styling:** Tailwind CSS v4 + shadcn/ui  
**Package Manager:** pnpm  

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Agent Roles](#agent-roles)
3. [Technical Stack](#technical-stack)
4. [Project Structure](#project-structure)
5. [Development Guidelines](#development-guidelines)
6. [Security & Compliance](#security--compliance)
7. [Testing Strategy](#testing-strategy)
8. [Commands & Scripts](#commands--scripts)

---

## Project Overview

**Current State:** Frontend-only Next.js landing page with hero section, countdown timer, and navigation  
**Next Phase:** Implement backend registration system with database integration  

### Key Features
- Landing page with event information
- Registration form for hackathon participants
- Countdown timer to event start
- Responsive design (mobile-first)
- Admin dashboard (planned)

---

## Agent Roles

### 🎨 Design Agent
**Responsibilities:**
- Define and maintain visual design language
- Create wireframes, mockups, design specifications
- Ensure design consistency across all pages
- Establish responsive breakpoints and behaviors

**Key Standards:**
- **Colors:** Primary `#0C0F14`, Accent `#F9621D`, Gold `#F9C673`
- **Typography:** Roboto font family (weights: 100-900)
- **Layout:** Mobile-first, breakpoints at 640px, 768px, 1024px, 1280px
- **Accessibility:** WCAG 2.1 AA compliance, contrast ratios ≥ 4.5:1

📄 [`agents/design.md`](agents/design.md)

---

### 💻 Frontend Agent
**Responsibilities:**
- Implement UI components using React/Next.js
- Follow coding patterns and conventions
- Ensure responsive, accessible, performant code
- Build interactive features and user flows

**Key Standards:**
- **Client Components:** Use `'use client'` for state/hooks
- **Styling:** Tailwind classes + inline styles for custom colors
- **Imports:** Use `@/` alias for internal modules
- **Accessibility:** ARIA labels, keyboard navigation, semantic HTML

📄 [`agents/frontend.md`](agents/frontend.md)

---

### 🔧 Backend Agent
**Responsibilities:**
- Design and implement API endpoints
- Define database schemas and data models
- Handle data validation and sanitization
- Implement authentication/authorization

**Recommended Stack:**
- **Database:** Vercel Postgres / Supabase / PlanetScale
- **Validation:** Zod schema validation
- **Rate Limiting:** Upstash Redis
- **Email:** SendGrid / Resend

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Submit registration |
| GET | `/api/participants` | List participants (admin) |
| GET | `/api/participants/:id` | Get participant details |
| PUT | `/api/participants/:id` | Update registration |
| DELETE | `/api/participants/:id` | Cancel registration |

📄 [`agents/backend.md`](agents/backend.md)

---

### 🔒 Security Agent
**Responsibilities:**
- Conduct security audits and code reviews
- Implement security best practices
- Ensure GDPR compliance and data privacy
- Monitor for vulnerabilities

**Key Requirements:**
- **OWASP Top 10:** Address all vulnerabilities
- **GDPR:** Minimal data collection, explicit consent, data retention policy
- **Input Validation:** Server-side validation with Zod
- **Security Headers:** HSTS, CSP, X-Frame-Options, etc.
- **Rate Limiting:** 5 requests per hour per IP for registration

**Compliance Checklists:**
- [GDPR Checklist](docs/compliance/gdpr-checklist.md)
- [WCAG Checklist](docs/compliance/wcag-checklist.md)

📄 [`agents/security.md`](agents/security.md)

---

### 🧪 Tester Agent
**Responsibilities:**
- Create comprehensive test plans and test cases
- Implement automated tests (unit, integration, E2E)
- Perform manual testing and QA
- Ensure accessibility compliance

**Testing Pyramid:**
- **Unit Tests:** 70% (components, utilities)
- **Integration Tests:** 20% (component integration)
- **E2E Tests:** 10% (critical user flows)

**Recommended Tools:**
- **Unit/Component:** Vitest + React Testing Library
- **E2E:** Playwright
- **Accessibility:** axe-core
- **Visual:** Chromatic / Playwright Screenshots

**Coverage Requirements:**
- Components: 80%
- Utilities: 90%
- API Routes: 85%
- E2E Critical Flows: 100%

📄 [`agents/tester.md`](agents/tester.md)

---

## Technical Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js | 16.2.1 |
| **React** | React | 19.2.4 |
| **Styling** | Tailwind CSS | v4 |
| **UI Components** | shadcn/ui | Latest |
| **Icons** | Lucide React | Latest |
| **TypeScript** | TypeScript | Latest |
| **Linting** | ESLint | Latest |

---

## Project Structure

```
soai-automate/
├── src/
│   ├── app/
│   │   ├── api/              # API routes (backend)
│   │   │   ├── register/
│   │   │   └── participants/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── header.tsx        # Navigation header
│   │   ├── hero.tsx          # Hero section
│   │   ├── countdown.tsx     # Countdown timer
│   │   └── cta.tsx           # CTA buttons
│   └── lib/
│       ├── db.ts             # Database connection
│       ├── validation.ts     # Validation schemas
│       ├── email.ts          # Email service
│       ├── rate-limit.ts     # Rate limiting
│       └── utils.ts          # Utility functions
├── agents/                   # Agent documentation
│   ├── backend.md
│   ├── design.md
│   ├── frontend.md
│   ├── security.md
│   └── tester.md
├── docs/                     # Documentation
│   ├── security/
│   └── compliance/
├── __tests__/                # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/                   # Static assets
├── package.json
├── tsconfig.json
└── QWEN.md                   # This file
```

---

## Development Guidelines

### Coding Standards

**TypeScript:**
- Strict mode enabled
- No `any` types
- Proper type definitions for all functions/components

**Component Structure:**
```tsx
'use client'  // Only for interactive components

import { useState, useEffect } from 'react'
import { IconName } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ComponentName() {
  // Hooks and state
  // Event handlers
  // Render
  return (...)
}
```

**File Naming:**
- Components: lowercase with hyphens (`header.tsx`)
- Exports: Default exports
- Types: Inline or same file

### Styling Approach

**Tailwind Classes** for:
- Layout, spacing, typography, responsive behavior, transitions

**Inline Styles** for:
- Custom colors not in Tailwind config, transforms, custom opacity

```tsx
// ✅ CORRECT
<div style={{ backgroundColor: '#0C0F14' }} className="flex gap-4">
```

### Responsive Design

```tsx
// Mobile-first approach
<div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
```

### Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Semantic HTML elements
- Alt text for all images
- Focus indicators

---

## Security & Compliance

### Data Privacy (GDPR)

**Data Collection Principles:**
- Minimal data collection (only what's necessary)
- Explicit consent required
- Clear privacy policy
- Data retention policy (2 years max)
- User rights (access, deletion, correction)

### Input Validation

```typescript
import { z } from 'zod'

const registrationSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  agreeToTerms: z.boolean().refine(val => val === true)
})
```

### Security Headers

Configure in `next.config.ts`:
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Content-Security-Policy
- Referrer-Policy

### Rate Limiting

```typescript
// 5 requests per hour per IP
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h')
})
```

---

## Testing Strategy

### Test Types

| Type | Tools | Coverage Target |
|------|-------|-----------------|
| **Unit** | Vitest, React Testing Library | 80%+ |
| **Integration** | React Testing Library | 70%+ |
| **E2E** | Playwright | 100% critical flows |
| **Accessibility** | axe-core | 0 violations |

### Test File Structure

```
__tests__/
├── unit/
│   ├── components/
│   └── utils/
├── integration/
│   └── components/
├── e2e/
│   ├── registration.spec.ts
│   ├── navigation.spec.ts
│   └── accessibility.spec.ts
└── fixtures/
    └── test-data.ts
```

### Running Tests

```bash
# Unit tests
pnpm test:unit

# E2E tests
pnpm test:e2e

# Accessibility audit
pnpm test:a11y

# All tests
pnpm test
```

---

## Commands & Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm format       # Format code (if configured)

# Testing
pnpm test         # Run all tests
pnpm test:unit    # Run unit tests
pnpm test:e2e     # Run E2E tests
pnpm test:a11y    # Run accessibility tests

# Dependencies
pnpm add <pkg>    # Add dependency
pnpm remove <pkg> # Remove dependency
pnpm update       # Update dependencies
pnpm audit        # Security audit
```

---

## Quick Reference

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Primary Background | `#0C0F14` | Main background |
| Secondary Background | `#0A0A0A` | Header background |
| Primary Accent | `#F9621D` | Buttons, borders, highlights |
| Accent Gold | `#F9C673` | Hover states |
| Text White | `#FFFFFF` | Primary text |
| Text Gray | `rgba(255,255,255,0.7)` | Secondary text |

### Responsive Breakpoints
| Breakpoint | Width |
|------------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

### Key Files
- [`tsconfig.json`](tsconfig.json) - TypeScript configuration
- [`components.json`](components.json) - shadcn/ui configuration
- [`src/lib/utils.ts`](src/lib/utils.ts) - Utility functions
- [`src/app/globals.css`](src/app/globals.css) - Global styles

---

## Contributing

1. **Choose your agent role** based on the task
2. **Follow the guidelines** in your agent documentation
3. **Write tests** for new features
4. **Run linting** before committing
5. **Update documentation** as needed

---

**Last Updated:** March 29, 2026  
**Version:** 1.0.0
