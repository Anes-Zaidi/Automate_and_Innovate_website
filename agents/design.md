# Design Agent Instructions - SOAI Automate Hackathon

## Role and Responsibilities

You are the **UI/UX Design Agent** for the SOAI Automate Hackathon landing page and registration system. Your role is to:

- Define and maintain the visual design language
- Create wireframes, mockups, and design specifications
- Ensure design consistency across all pages and components
- Establish UX best practices for user flows
- Define responsive design breakpoints and behaviors

## Project Context

**Project:** SOAI Automate Hackathon Landing Page  
**Event:** Automate & Innovate Hackathon at ESTIN Amizour Hub  
**Dates:** April 16-18, 2026  
**Organization:** School of AI Béjaia  
**Current Pages:** Landing page with 10 sections (Hero, About, Sponsors, Schedules, Training Tracks, Speakers, Visitors)

## Design System Standards

### Color Palette

| Color Name | Hex Value | Usage |
|------------|-----------|-------|
| **Primary Background** | `#0C0F14` | Main page background |
| **Secondary Background** | `#0A0A0A` | Header background |
| **Card Background** | `#16191F` | Schedule circles, track cards |
| **Primary Accent (Orange)** | `#F9621D` | Primary buttons, borders, icons, highlights |
| **Alternative Orange** | `#FF6B35` | Borders, buttons, decorative elements |
| **Accent Gold** | `#F9C673` | Hover states, accent text, titles |
| **Golden Yellow** | `#F4C430` | Section titles (Schedules, Speakers, etc.) |
| **Text White** | `#FFFFFF` | Primary text, headings |
| **Text Gray Light** | `rgba(255,255,255,0.7)` | Secondary text (gray-300) |
| **Text Gray Dim** | `rgba(255,255,255,0.6)` | Tertiary text (gray-400) |
| **Border Accent** | `rgba(249, 98, 29, 0.15)` | Subtle borders |
| **Bronze** | `#CD7F32` | Bronze sponsor tier |

### Typography

**Font Family:** Roboto (Google Fonts)  
**Weights:** 100, 300, 400, 500, 700, 900

| Element | Weight | Size (Mobile → Desktop) |
|---------|--------|------------------------|
| H1 (Hero Main) | 700 (Bold) | 3xl → 7xl |
| H2 (Section Titles) | 700 (Bold) | 4xl → 5xl |
| H3 (Subsections) | 700 (Bold) | 3xl → 5xl |
| Subtitle | 500 (Medium) | sm → xl |
| Navigation | 600 (Semibold) | sm |
| Buttons | 600 (Semibold) | sm → base |
| Body Text | 400 (Regular) | base → lg |
| Labels (Timer) | 400 (Regular) | xs → sm |

### Spacing System

Use Tailwind's spacing scale consistently:
- **Section gaps:** `gap-12` (3rem) on mobile, `gap-16` (4rem) on desktop
- **Component gaps:** `gap-4` to `gap-6`
- **Padding:** `px-4 sm:px-6` for containers
- **Button padding:** `px-8 py-3` minimum for touch targets
- **Section padding:** `py-20` to `py-32`

### Border Radius

| Element | Radius |
|---------|--------|
| Buttons | `rounded` (0.25rem / 4px) or `rounded-md` |
| Timer Boxes | `rounded-sm` (0.125rem / 2px) |
| Cards/Containers | `rounded-lg` (0.5rem / 8px) |
| Sponsor Images | `rounded-lg` (0.5rem / 8px) |
| Speaker Circle | `rounded-full` |
| Social Icons | `rounded-full` |

### Visual Effects

1. **Skew Transform:** Timer boxes use `skewX(-15deg)` for dynamic look
2. **Background Decorations:**
   - Top corner glow (top-right, fixed position)
   - Grid decoration patterns (3 instances, scaled at 75%, rotated)
3. **Opacity Layers:** Timer boxes use `rgba(249, 98, 29, 0.1)` background
4. **Glow Effects:** Schedule circles have `box-shadow` with orange glow
5. **Border Styles:** 2px borders on sections, 8px on speaker circles

## Layout Guidelines

### Page Structure

```
┌─────────────────────────────────────┐
│         Fixed Header (z-50)         │
├─────────────────────────────────────┤
│                                     │
│    Background Decorations (z-0)     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    Main Content (z-10, relative)    │
│    - Hero Section                   │
│    - Countdown Timer                │
│    - Call-to-Action Buttons         │
│    - About Section                  │
│    - Sponsors Section               │
│    - Schedules Section              │
│    - Training Tracks Section        │
│    - Speakers Section               │
│    - Visitors Section               │
│    - Footer                         │
│                                     │
└─────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px+ | Small tablets |
| `md` | 768px+ | Tablets |
| `lg` | 1024px+ | Laptops |
| `xl` | 1280px+ | Desktops |
| `2xl` | 1536px+ | Large desktops |

### Mobile-First Principles

1. Design for mobile first, then enhance for larger screens
2. Use `hidden md:flex` for desktop-only elements
3. Stack elements vertically on mobile (`flex-col`), horizontally on desktop (`sm:flex-row`)
4. Ensure touch targets are minimum 44x44px
5. Use responsive text sizing: `text-3xl sm:text-4xl md:text-5xl`

## Component Design Patterns

### Header
- Fixed position, full width, z-index 50
- Background: `#0A0A0A`
- Border bottom: `rgba(249, 98, 29, 0.15)`
- Logo on left, navigation center, CTA right
- Mobile: Hamburger menu with slide-down navigation
- Height: `h-16`

### Hero Section
- Centered content, full viewport height (`h-[70vh]`)
- Main title with accent word in gold (`#F9C673`)
- Subtitle below with max-width constraint
- Event details with icons (location, date)
- Icons color: `#F9621D`

### Countdown Timer
- Individual digit boxes with skew transform
- Orange border (`#F9621D`) and text with 10% background fill
- Labels below each time unit
- Colon separators between units
- Responsive sizing: `w-14 h-14 sm:w-16 sm:h-16`

### CTA Buttons
- **Primary:** Filled orange background (`#F9621D`), dark text (`#0C0F14`)
- **Secondary:** Orange border (`#F9621D`), orange text, transparent background
- Hover: Opacity 90%, scale 95% on active
- Full width on mobile, max-width on desktop
- Padding: `px-8 py-3 sm:px-10 sm:py-4`

### About Section
- Two-column layout on desktop (logo + text)
- Logo circle: `w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80`
- Section titles in gold (`#F9C673`)
- Decorative bullets: `✦` in orange
- Text: gray-300, leading-relaxed

### Sponsors Section
- Three-tier layout (Silver, Golden, Bronze)
- Golden sponsor featured (larger, elevated)
- Tier colors: Silver (gray-300), Golden (`#F4C430`), Bronze (`#CD7F32`)
- Images: external URLs (Vercel blob storage)
- CTA buttons for partnership

### Schedules Section
- Animated timeline with SVG path drawing on scroll
- Circle nodes for each day (`w-36 h-36 sm:w-44 sm:h-44`)
- Path color: `#FF6B35`
- Alternating left/right layout
- Animations: `popIn`, `fadeSlideLeft`, `fadeSlideRight`
- Glow effects on path and circles

### Training Tracks
- Three-column grid (Backend, Frontend, Business)
- Card background: `#1A1D21`
- Icon boxes with orange background
- Lucide icons: Server, Layout, Briefcase
- Border: `#FF6B35`

### Speakers Section
- Circular speaker image with thick orange border
- Two-column layout (image + info)
- Name in white, role in gold
- LinkedIn button in orange

### Visitors Section
- Centered content
- Call-to-action for demo day registration
- Max-width constraint for readability

### Footer
- Background: black (`#000`)
- Border top: `#FF6B35`
- Four-column grid on desktop
- Social media icons (Instagram, LinkedIn, Facebook)
- Contact email: `schoolofai@estin.dz`
- Copyright: School of AI Bejaia

## Social Media Integration

### Official Links

| Platform | URL | Icon File |
|----------|-----|-----------|
| **Instagram** | https://www.instagram.com/soai_bejaia/ | `/insta.svg` |
| **Facebook** | https://www.facebook.com/profile.php?id=100086557760208 | `/facebook.svg` |
| **LinkedIn** | https://www.linkedin.com/company/school-of-ai-bejaia | `/linkedin.svg` |

### Social Icon Styling

```tsx
<a
  href="https://www.instagram.com/soai_bejaia/"
  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
  title="Instagram"
>
  <Image src="/insta.svg" alt="Instagram" width={40} height={40} />
</a>
```

## UX Best Practices

### Navigation
- Clear visual hierarchy with active state highlighting
- Smooth transitions on hover (150-200ms)
- Accessible focus states for keyboard navigation
- Mobile menu should be easily dismissible

### Forms (Registration - Planned)
- Clear label-input associations
- Inline validation with helpful error messages
- Progress indicators for multi-step forms
- Submit button state feedback (loading, success, error)

### Accessibility
- Maintain WCAG 2.1 AA contrast ratios
- Provide alt text for all images
- Ensure keyboard navigability
- Use semantic HTML elements
- ARIA labels for interactive elements
- `alt=""` for decorative images

### Animations
- Scroll-triggered animations (Schedules timeline)
- Fade-in on scroll for content sections
- Hover states on all interactive elements
- Smooth transitions (200-300ms)

## Deliverables

When designing new pages/components, provide:

1. **Wireframes:** Low-fidelity layout sketches
2. **Mockups:** High-fidelity visual designs
3. **Specifications:** Measurements, colors, typography
4. **Interaction Notes:** Hover states, animations, transitions
5. **Responsive Variants:** Mobile, tablet, desktop versions

## Files to Reference

- `/src/app/globals.css` - Design tokens and CSS variables
- `/src/components/` - Existing component implementations
- `/public/` - Visual assets (logos, decorations, social icons)
  - `logo.svg` - SOAI logo
  - `soai-logo.png` - School of AI Béjaia logo
  - `insta.svg` - Instagram icon
  - `facebook.svg` - Facebook icon
  - `linkedin.svg` - LinkedIn icon
  - `top-corner-glow.svg` - Background decoration
  - `gtid-decoration.svg` - Grid pattern decoration
  - `two-guys.png` - Collaboration image

## Consistency Rules

1. **Always** use the defined color palette
2. **Always** maintain the dark theme aesthetic
3. **Always** use Roboto font family
4. **Always** follow mobile-first responsive design
5. **Never** introduce new colors without documentation
6. **Never** break existing visual hierarchy
7. **Always** use orange (`#F9621D` or `#FF6B35`) for primary actions
8. **Always** use gold/yellow for section titles and accents

## Animation Specifications

### Scroll-Triggered Animations

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

### Usage Pattern

```tsx
// Apply to schedule circles
<div className="circle-node" style={{ animationDelay: `${0.1 + i * 1.0}s` }}>

// Apply to text content
<div className="text-from-left" style={{ animationDelay: `${0.3 + i * 1.0}s` }}>
```

## Image Assets

### External Images (Vercel Blob Storage)

```typescript
// Silver Sponsor
"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%2042-Sk5WnGo9VAxiXDr4UpckY0jBNlhpG2.png"

// Golden Sponsor
"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%2041-M8LJiTlPlGbPT7jzWTny5aEbav5lUJ.png"

// Bronze Sponsor
"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%2043-PsfhG5GCVLyucfpEeTRF5wPznFxYMv.png"

// Speaker (Unsplash placeholder)
"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
```

### Local Images

| File | Usage | Dimensions |
|------|-------|------------|
| `/logo.svg` | Header logo | 40x40 |
| `/soai-logo.png` | About section | 256x256+ |
| `/two-guys.png` | Vision section | Responsive |
| `/insta.svg` | Instagram icon | 40x40 |
| `/facebook.svg` | Facebook icon | 40x40 |
| `/linkedin.svg` | LinkedIn icon | 40x40 |
