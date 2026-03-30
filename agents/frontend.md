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
**UI Library:** shadcn/ui (Radix Nova), Radix UI primitives  
**Icons:** Lucide React  
**Package Manager:** pnpm  
**Organization:** School of AI Béjaia

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Roboto font)
│   ├── page.tsx            # Home page (all sections)
│   └── globals.css         # Global styles, shadcn tokens
├── components/
│   ├── ui/
│   │   └── button.tsx      # shadcn/ui Button
│   ├── about.tsx           # About section (Server)
│   ├── countdown.tsx       # Countdown timer (Client)
│   ├── cta.tsx             # Call-to-action buttons (Server)
│   ├── footer.tsx          # Footer with social links (Client)
│   ├── header.tsx          # Navigation header (Client)
│   ├── hero.tsx            # Hero section (Server)
│   ├── schedules.tsx       # Animated schedule timeline (Client)
│   ├── speakers.tsx        # Speakers & mentors (Client)
│   ├── sponsors.tsx        # Sponsors showcase (Server)
│   ├── training-tracks.tsx # Training tracks (Client)
│   └── visitors.tsx        # Visitor information (Client)
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
import Image from 'next/image'

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

- **Components:** lowercase with hyphens (e.g., `header.tsx`, `countdown.tsx`, `training-tracks.tsx`)
- **Exports:** Default exports for components
- **Types:** TypeScript interfaces/types inline or in same file

### Import Patterns

```tsx
// Next.js
import Image from 'next/image'
import Link from 'next/link'

// React
import { useState, useEffect, useRef, useCallback } from 'react'

// Icons (Lucide)
import { Menu, X, MapPin, Clock, Server, Layout, Briefcase } from 'lucide-react'

// Internal (use @ alias)
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
   - Utility classes (flex, items-center, justify-center)

2. **Inline Styles** for:
   - Custom colors not in Tailwind config (`#0C0F14`, `#F9621D`, `#FF6B35`, `#F9C673`, `#F4C430`)
   - Transform effects (skew, rotate)
   - Custom opacity values
   - Box shadows with custom colors
   - Animation delays

### Color Usage

```tsx
// ✅ CORRECT - Inline styles for custom colors
<div style={{ backgroundColor: '#0C0F14' }}>
<button style={{ backgroundColor: '#F9621D', color: '#0C0F14' }}>
<span style={{ color: '#F9621D' }}>
<div style={{ borderColor: 'rgba(249, 98, 29, 0.15)' }}>

// ✅ CORRECT - Tailwind for standard colors
<p className="text-gray-300">
<div className="bg-background">
<span className="text-white">
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

// Layout
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6">
```

## Component Patterns

### Client vs Server Components

| Component | Type | Reason |
|-----------|------|--------|
| `header.tsx` | Client | Mobile menu state (`useState`) |
| `countdown.tsx` | Client | Timer interval state (`useEffect`, `useState`) |
| `footer.tsx` | Client | Social media interactions |
| `schedules.tsx` | Client | Scroll animations, SVG path drawing |
| `speakers.tsx` | Client | Future interactions |
| `training-tracks.tsx` | Client | Icon rendering |
| `visitors.tsx` | Client | Future form interactions |
| `hero.tsx` | Server | Static content |
| `cta.tsx` | Server | Static buttons |
| `about.tsx` | Server | Static content |
| `sponsors.tsx` | Server | Static content |

### State Management Pattern

```tsx
// Simple state with useState
const [isOpen, setIsOpen] = useState(false)

// Timer/interval pattern
useEffect(() => {
  const timer = setInterval(() => {
    setTime((prev) => {
      let { days, hours, minutes, seconds } = prev
      // Decrement logic
      return { days, hours, minutes, seconds }
    })
  }, 1000)
  return () => clearInterval(timer)
}, [])

// Scroll-based animation pattern (Schedules)
const containerRef = useRef<HTMLDivElement>(null)
const pathRef = useRef<SVGPathElement>(null)

useEffect(() => {
  const onScroll = () => {
    const rect = containerRef.current.getBoundingClientRect()
    const vh = window.innerHeight
    const progress = Math.min(Math.max(-rect.top / (rect.bottom - rect.top), 0), 1)
    setDrawn(progress * totalLen)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}, [totalLen])

// ResizeObserver pattern
useEffect(() => {
  const ro = new ResizeObserver(recalculate)
  if (containerRef.current) ro.observe(containerRef.current)
  return () => ro.disconnect()
}, [recalculate])
```

### Sub-component Pattern

```tsx
// Define sub-components inside main component
const TimerBox = ({ value }: { value: string }) => (
  <div
    className="flex items-center rounded-sm justify-center font-extrabold border-2"
    style={{
      borderColor: '#F9621D',
      color: '#F9621D',
      backgroundColor: 'rgba(249, 98, 29, 0.1)',
      transform: 'skewX(-15deg)',
    }}
  >
    {value}
  </div>
)

const TimerGroup = ({ value, label }: { value: number; label: string }) => {
  const digits = String(value).padStart(2, '0').split('')
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {digits.map((digit, index) => (
          <TimerBox key={index} value={digit} />
        ))}
      </div>
      <span className="text-xs sm:text-sm text-gray-400">{label}</span>
    </div>
  )
}
```

### SVG Path Animation Pattern (Schedules)

```tsx
// Build continuous path through circles
function buildPath(
  circles: { cx: number; top: number; bottom: number }[],
  cpRatio = 0.55,
): string {
  if (circles.length < 1) return ''
  const first = circles[0]
  let d = `M ${first.cx} ${first.top - 100} L ${first.cx} ${first.bottom}`

  for (let i = 0; i < circles.length - 1; i++) {
    const from = circles[i]
    const to = circles[i + 1]
    const dy = to.top - from.bottom
    const cp1x = from.cx
    const cp1y = from.bottom + dy * cpRatio
    const cp2x = to.cx
    const cp2y = to.top - dy * cpRatio
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.cx} ${to.top}`
    d += ` L ${to.cx} ${to.bottom}`
  }
  return d
}

// Stroke-dashoffset animation
const dashArray = totalLen || 9999
const dashOffset = Math.max(dashArray - drawn, 0)

<path
  d={pathD}
  stroke="#FF6B35"
  strokeWidth={1.8}
  strokeDasharray={dashArray}
  strokeDashoffset={dashOffset}
/>
```

## shadcn/ui Integration

### Button Component

```tsx
import { Button } from "@/components/ui/button"

// Variants: default, outline, secondary, ghost, destructive, link
// Sizes: default, sm, lg, icon

<Button
  className="px-8 py-3 rounded-md font-semibold"
  style={{ backgroundColor: '#FF6B35', color: '#0C0F14' }}
>
  Be A Partenaire
</Button>

<Button
  className="px-8 py-3 rounded-md font-semibold border-2"
  style={{ borderColor: '#FF6B35', color: '#FF6B35' }}
>
  Learn More
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
<a href="mailto:schoolofai@estin.dz" aria-label="Email us">
<a
  href="https://www.instagram.com/soai_bejaia/"
  className="w-10 h-10 rounded-full"
  title="Instagram"
  aria-label="Follow us on Instagram"
>
```

### Keyboard Navigation

- All interactive elements must be focusable
- Use semantic HTML (`button`, `a`, `nav`)
- Implement focus states
- Support Escape key for modals/menus
- Tab order follows visual layout

### Image Accessibility

```tsx
// Content images with descriptive alt
<Image
  src="/soai-logo.png"
  alt="School of AI Béjaia Logo"
  width={256}
  height={256}
  priority
/>

// Decorative images with empty alt
<Image
  src="/top-corner-glow.svg"
  alt=""
  fill
  aria-hidden="true"
/>

// External images (sponsors)
<img
  src="https://..."
  alt="Silver sponsor"
  className="w-full h-full object-cover"
/>
```

## Performance Best Practices

1. **Image Optimization:** Use Next.js Image component for local images
2. **Priority Loading:** Add `priority` to above-the-fold images (Hero, About logo)
3. **Code Splitting:** Leverage Next.js automatic splitting
4. **Client Components:** Minimize use, prefer server components
5. **Memoization:** Use `useCallback` for scroll handlers
6. **Lazy Loading:** Dynamic imports for heavy components
7. **Passive Event Listeners:** `{ passive: true }` for scroll handlers

### Image Loading Strategy

```tsx
// Priority images (above the fold)
<Image
  src="/soai-logo.png"
  alt="School of AI Béjaia Logo"
  fill
  priority
/>

// Lazy images (below the fold)
<Image
  src="/two-guys.png"
  alt="Professionals collaborating"
  fill
  className="object-contain"
/>

// External images (not optimized by Next.js)
<img
  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/..."
  alt="Golden sponsor"
  className="w-full h-full object-cover"
/>
```

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
- Background: `#0C0F14`, `#0A0A0A`, `#16191F`, `#1A1D21`
- Accent Orange: `#F9621D`, `#FF6B35`
- Gold/Yellow: `#F9C673`, `#F4C430`
- Bronze: `#CD7F32`
- Text: `#FFFFFF`, `rgba(255,255,255,0.7)`, `rgba(255,255,255,0.6)`

### Typography
- Font: Roboto (variable: `--font-roboto`)
- Weights: 100, 300, 400, 500, 700, 900

### Spacing
- Container: `mx-auto w-full px-4 sm:px-6`
- Max Width: `max-w-7xl mx-auto`
- Section: `py-20` to `py-32`

## Component Specifications

### Header (`header.tsx`)
- **Type:** Client Component
- **State:** `isOpen` (mobile menu)
- **Features:**
  - Fixed position, z-50
  - Desktop navigation (hidden on mobile)
  - Hamburger menu toggle
  - Register CTA button
  - Mobile slide-down navigation

### Hero (`hero.tsx`)
- **Type:** Server Component
- **Features:**
  - Main title with gold accent
  - Subtitle with max-width
  - Location and date with icons
  - Centered layout

### Countdown (`countdown.tsx`)
- **Type:** Client Component
- **State:** `time` (days, hours, minutes, seconds)
- **Features:**
  - 1-second interval timer
  - Skewed digit boxes
  - Orange borders and text
  - Responsive sizing

### CTA (`cta.tsx`)
- **Type:** Server Component
- **Features:**
  - Register button (primary)
  - Contact Us button (secondary)
  - Responsive layout (stack on mobile)

### About (`about.tsx`)
- **Type:** Server Component
- **Features:**
  - Two-column layout (logo + text)
  - Section titles in gold
  - Vision pillars with decorative bullets
  - Responsive image sizing

### Sponsors (`sponsors.tsx`)
- **Type:** Server Component
- **Features:**
  - Three-tier sponsor grid
  - External image URLs
  - Partnership CTA
  - shadcn Button components

### Schedules (`schedules.tsx`)
- **Type:** Client Component
- **State:** `pathD`, `drawn`, `dotPos`, `svgW`, `svgH`, `totalLen`
- **Refs:** `containerRef`, `pathRef`, `circleRefs`
- **Features:**
  - SVG path animation on scroll
  - Circle nodes for each day
  - Alternating left/right layout
  - Custom animations (popIn, fadeSlide)
  - Glow effects

### Training Tracks (`training-tracks.tsx`)
- **Type:** Client Component
- **Features:**
  - Three-card grid (Backend, Frontend, Business)
  - Lucide icons
  - Orange icon backgrounds
  - Responsive layout

### Speakers (`speakers.tsx`)
- **Type:** Client Component
- **Features:**
  - Circular speaker image
  - Two-column layout
  - LinkedIn CTA button
  - External image (Unsplash placeholder)

### Visitors (`visitors.tsx`)
- **Type:** Client Component
- **Features:**
  - Centered content
  - Demo day registration CTA
  - Max-width constraint

### Footer (`footer.tsx`)
- **Type:** Client Component
- **Features:**
  - Four-column grid (desktop)
  - Quick links navigation
  - Contact information
  - Social media icons (Instagram, Facebook, LinkedIn)
  - Copyright notice

## Social Media Integration

### Official Links

```tsx
// Instagram
<a href="https://www.instagram.com/soai_bejaia/">

// Facebook
<a href="https://www.facebook.com/profile.php?id=100086557760208">

// LinkedIn
<a href="https://www.linkedin.com/company/school-of-ai-bejaia">
```

### Icon Files

```tsx
<Image src="/insta.svg" alt="Instagram" width={40} height={40} />
<Image src="/facebook.svg" alt="Facebook" width={40} height={40} />
<Image src="/linkedin.svg" alt="LinkedIn" width={40} height={40} />
```

## Files to Reference

- `/tsconfig.json` - TypeScript configuration (strict mode, path aliases)
- `/components.json` - shadcn/ui configuration (Radix Nova)
- `/src/lib/utils.ts` - Utility functions (`cn`)
- `/src/app/globals.css` - Global styles and shadcn design tokens
- `/src/app/layout.tsx` - Root layout with Roboto font
- `/package.json` - Dependencies and scripts

## Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm dlx shadcn@latest add <component>  # Add new shadcn component
```

## Code Quality Rules

1. **TypeScript:** Strict mode enabled, no `any` types
2. **ESLint:** Next.js + TypeScript config
3. **Formatting:** Consistent indentation, semicolons
4. **Naming:** camelCase for variables/functions, PascalCase for components
5. **Comments:** Minimal, focus on "why" not "what"
6. **Imports:** Organized (Next.js, React, Icons, Internal)

## Animation Guidelines

### CSS Keyframes

```css
@keyframes popIn {
  0%   { opacity: 0; transform: scale(0.5); }
  65%  { transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes fadeSlideLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes fadeSlideRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

### Inline Style Animations

```tsx
// Animation delays
<div style={{ animationDelay: `${0.1 + i * 1.0}s` }}>

// Transition effects
<button className="transition-all hover:opacity-90 active:scale-95">
```

## Common Patterns

### Section Wrapper

```tsx
<section className="w-full py-20 px-4 sm:px-6">
  <div className="max-w-7xl mx-auto">
    {/* Section content */}
  </div>
</section>
```

### Section Title

```tsx
<h2 className="text-4xl sm:text-5xl font-bold text-center mb-20" style={{ color: '#F4C430' }}>
  Section Title
</h2>
```

### Two-Column Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Left column */}
  <div className="md:col-span-1">
  {/* Right column */}
  <div className="md:col-span-1">
</div>
```

### Alternating Layout (Left/Right)

```tsx
{EVENTS.map((event, i) => {
  const isRight = event.side === 'right'
  return (
    <div className={`flex items-center gap-10 ${isRight ? 'flex-row-reverse' : ''}`}>
      {/* Circle */}
      <div className="w-36 h-36 rounded-full">
      {/* Text */}
      <div className={`flex-1 ${isRight ? 'text-right' : ''}`}>
    </div>
  )
})}
```

### Button Variants

```tsx
// Primary button
<button
  className="px-8 py-3 rounded font-semibold hover:opacity-90 transition"
  style={{ backgroundColor: '#FF6B35', color: '#0C0F14' }}
>
  Register
</button>

// Secondary button
<button
  className="px-8 py-3 rounded font-semibold hover:opacity-90 transition border-2"
  style={{ borderColor: '#FF6B35', color: '#FF6B35' }}
>
  Contact Us
</button>
```
