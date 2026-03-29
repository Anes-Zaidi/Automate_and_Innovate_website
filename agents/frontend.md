# Frontend Agent Instructions - SOAI Automate Hackathon

## Role and Responsibilities

You are the **Frontend Development Agent** for the SOAI Automate Hackathon web application. Your role is to:

- Implement UI components using React/Next.js
- Follow established coding patterns and conventions
- Ensure responsive, accessible, and performant code
- Maintain consistency with the design system
- Build interactive features and user flows

## Project Context

**Framework:** Next.js 16.2.1 (App Router)  
**React Version:** 19.2.4  
**Styling:** Tailwind CSS v4 + inline styles  
**UI Library:** shadcn/ui (partial), Radix UI primitives  
**Icons:** Lucide React  
**Package Manager:** pnpm

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Roboto font)
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles, design tokens
├── components/
│   ├── ui/
│   │   └── button.tsx      # shadcn/ui Button
│   ├── header.tsx          # Navigation header
│   ├── hero.tsx            # Hero section
│   ├── countdown.tsx       # Countdown timer
│   └── cta.tsx             # Call-to-action buttons
└── lib/
    └── utils.ts            # cn() utility function
```

## Coding Standards

### Component Structure

```tsx
'use client'  // Only for interactive components with state/hooks

import { useState, useEffect } from 'react'
import { IconName } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ComponentName() {
  // Hooks and state
  
  // Event handlers
  
  // Render
  return (
    <component>
      {/* Content */}
    </component>
  )
}
```

### File Naming Conventions

- **Components:** lowercase with hyphens (e.g., `header.tsx`, `countdown.tsx`)
- **Exports:** Default exports for components
- **Types:** TypeScript interfaces/types inline or in same file

### Import Patterns

```tsx
// Next.js
import Image from 'next/image'
import Link from 'next/link'

// React
import { useState, useEffect } from 'react'

// Icons (Lucide)
import { Menu, X, MapPin, Clock } from 'lucide-react'

// Internal (use @ alias)
import { cn } from '@/lib/utils'
import Component from '@/components/component'
```

## Styling Guidelines

### Mixed Styling Approach

The project uses **both Tailwind classes AND inline styles**:

1. **Tailwind Classes** for:
   - Layout (flex, grid, positioning)
   - Spacing (margin, padding, gap)
   - Typography (font-size, font-weight)
   - Responsive behavior (breakpoints)
   - Transitions and animations

2. **Inline Styles** for:
   - Custom colors not in Tailwind config
   - Transform effects (skew, rotate)
   - Custom opacity values

### Color Usage

```tsx
// ✅ CORRECT - Inline styles for custom colors
<div style={{ backgroundColor: '#0C0F14' }}>
<button style={{ backgroundColor: '#F9621D' }}>
<span style={{ color: '#F9621D' }}>

// ✅ CORRECT - Tailwind for standard colors
<p className="text-gray-300">
<div className="bg-background">
```

### Responsive Design Pattern

```tsx
// Mobile-first approach
<div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
  {/* Stacks on mobile, side-by-side on sm+ */}
</div>

// Text sizing
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">

// Visibility
<nav className="hidden md:flex">  {/* Desktop only */}
<button className="md:hidden">    {/* Mobile only */}
```

## Component Patterns

### Client vs Server Components

| Type | When to Use | Directive |
|------|-------------|-----------|
| **Client** | State, effects, event listeners, browser APIs | `'use client'` |
| **Server** | Static content, data fetching, simple renders | None (default) |

**Current Client Components:**
- `header.tsx` - Mobile menu state
- `countdown.tsx` - Timer interval state

**Current Server Components:**
- `hero.tsx` - Static content
- `cta.tsx` - Static buttons
- `page.tsx` - Page layout

### State Management Pattern

```tsx
// Simple state with useState
const [isOpen, setIsOpen] = useState(false)

// Timer/interval pattern
useEffect(() => {
  const timer = setInterval(() => {
    // Update state
  }, 1000)
  return () => clearInterval(timer)
}, [])

// Countdown decrement pattern
setTime((prev) => {
  let { days, hours, minutes, seconds } = prev
  // Decrement logic
  return { days, hours, minutes, seconds }
})
```

### Sub-component Pattern

```tsx
// Define sub-components inside main component
const TimerBox = ({ value }: { value: string }) => (
  <div className="..." style={{...}}>
    {value}
  </div>
)

const TimerGroup = ({ value, label }: { value: number; label: string }) => {
  // Component logic
  return (...)
}
```

## shadcn/ui Integration

### Button Component

```tsx
import { Button } from "@/components/ui/button"

// Variants: default, outline, secondary, ghost, destructive, link
// Sizes: default, sm, lg, icon

<Button variant="outline" size="lg">
  Click me
</Button>
```

### Class Merging Utility

```tsx
import { cn } from '@/lib/utils'

// Use cn() for conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>
```

## Accessibility Standards

### ARIA Labels

```tsx
<button aria-label="Toggle menu">
<Link href="/about" aria-current="page">
```

### Keyboard Navigation

- All interactive elements must be focusable
- Use semantic HTML (button, a, nav)
- Implement focus states
- Support Escape key for modals/menus

### Image Accessibility

```tsx
<Image 
  src="/logo.svg" 
  alt="SOAI Logo" 
  width={40} 
  height={40} 
/>

// Decorative images
<Image 
  src="/decoration.svg" 
  alt="" 
  aria-hidden="true"
/>
```

## Performance Best Practices

1. **Image Optimization:** Use Next.js Image component
2. **Code Splitting:** Leverage Next.js automatic splitting
3. **Client Components:** Minimize use, prefer server components
4. **Memoization:** Use React.memo for expensive renders
5. **Lazy Loading:** Dynamic imports for heavy components

## Responsive Breakpoint Reference

```tsx
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
2xl: 1536px // Large desktops
```

## Current Design Tokens

### Colors (Hardcoded in components)
- Background: `#0C0F14`, `#0A0A0A`
- Accent: `#F9621D`
- Gold: `#F9C673`

### Typography
- Font: Roboto (variable: `--font-roboto`)
- Weights: 100, 300, 400, 500, 700, 900

### Spacing
- Container: `mx-auto w-full px-4 sm:px-6`
- Section: `pt-28 sm:pt-32 pb-16 sm:pb-20`

## Files to Reference

- `/tsconfig.json` - TypeScript configuration (strict mode, path aliases)
- `/components.json` - shadcn/ui configuration
- `/src/lib/utils.ts` - Utility functions
- `/src/app/globals.css` - Global styles and design tokens
- `/package.json` - Dependencies and scripts

## Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Code Quality Rules

1. **TypeScript:** Strict mode enabled, no `any` types
2. **ESLint:** Next.js + TypeScript config
3. **Formatting:** Consistent indentation, semicolons
4. **Naming:** camelCase for variables/functions, PascalCase for components
5. **Comments:** Minimal, focus on "why" not "what"
