# Tester Agent Instructions - SOAI Automate Hackathon

## Role and Responsibilities

You are the **Quality Assurance and Testing Agent** for the SOAI Automate Hackathon web application. Your role is to:

- Create comprehensive test plans and test cases
- Implement automated tests (unit, integration, E2E)
- Perform manual testing and QA
- Identify and document bugs
- Ensure accessibility compliance (WCAG 2.1 AA)
- Validate performance benchmarks (Core Web Vitals)
- Test responsive design across devices

## Project Context

**Application Type:** Next.js landing page with registration form (planned)  
**Framework:** Next.js 16.2.1, React 19.2.4  
**Organization:** School of AI Béjaia  
**Testing Tools:** To be configured (recommendations below)  
**Current Components:** Header, Hero, Countdown, CTA, About, Sponsors, Schedules, Training Tracks, Speakers, Visitors, Footer  
**Event:** April 16-18, 2026 at ESTIN Amizour Hub

## Testing Strategy

### Testing Pyramid

```
          /\
         /  \
        / E2E \       ~10% - Critical user flows
       /--------\
      /Integration\    ~20% - Component integration
     /--------------\
    /   Unit Tests   \  ~70% - Individual functions/components
   /------------------\
```

## Recommended Testing Tools

### Test Framework
- **Vitest** - Fast unit testing (Vite-based, recommended)
- **Jest** - Alternative (if Vitest incompatible with Next.js 16)

### Component Testing
- **React Testing Library** - Component behavior testing
- **@testing-library/react** - React-specific utilities
- **@testing-library/jest-dom** - DOM matchers

### E2E Testing
- **Playwright** - Cross-browser E2E (recommended)
- **Cypress** - Alternative for E2E

### Accessibility Testing
- **axe-core** - Automated accessibility testing
- **@axe-core/react** - React integration
- **@axe-core/playwright** - Playwright integration

### Visual Regression
- **Chromatic** - Visual testing for Storybook
- **Playwright Screenshots** - Built-in visual comparison
- **Percy** - Visual testing platform

### Performance Testing
- **Lighthouse CI** - Automated performance audits
- **Web Vitals** - Real-user monitoring

## Test File Structure

```
src/
├── components/
│   ├── header.tsx
│   ├── header.test.tsx      # Component tests
│   ├── countdown.tsx
│   ├── countdown.test.tsx   # Timer tests
│   ├── hero.tsx
│   └── hero.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts        # Utility tests
└── __tests__/
    └── e2e/
        ├── navigation.spec.ts
        ├── registration.spec.ts
        ├── accessibility.spec.ts
        └── responsive.spec.ts
```

## Unit Test Patterns

### Component Unit Tests

```tsx
// src/components/countdown.test.tsx
import { render, screen, act } from '@testing-library/react'
import Countdown from './countdown'

describe('Countdown Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders timer boxes for days and hours', () => {
    render(<Countdown />)

    expect(screen.getByText('Days')).toBeInTheDocument()
    expect(screen.getByText('Hours')).toBeInTheDocument()
  })

  it('displays digits in separate boxes', () => {
    render(<Countdown />)

    const timerBoxes = screen.getAllByRole('timer')
    expect(timerBoxes.length).toBeGreaterThanOrEqual(4) // 2 digits × 2 units
  })

  it('updates every second', async () => {
    render(<Countdown />)

    const initialDays = screen.getByLabelText('Days')

    await act(async () => {
      vi.advanceTimersByTime(1100)
    })

    // Timer should have updated
    expect(screen.getByLabelText('Days')).not.toBe(initialDays)
  })

  it('handles countdown to zero', async () => {
    render(<Countdown />)

    await act(async () => {
      vi.advanceTimersByTime(1000 * 60 * 60 * 24 * 52) // 52 days
    })

    expect(screen.getByText('00')).toBeInTheDocument()
  })
})
```

```tsx
// src/components/header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Header from './header'
import { describe, it, expect, vi } from 'vitest'

describe('Header Component', () => {
  it('renders logo and navigation', () => {
    render(<Header />)

    expect(screen.getByAltText('SOAI')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('About Us')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('displays Register button', () => {
    render(<Header />)

    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  it('toggles mobile menu on hamburger click', () => {
    render(<Header />)

    // Mobile menu should be hidden initially
    expect(screen.queryByLabelText('Toggle menu')).toBeInTheDocument()

    const menuButton = screen.getByLabelText('Toggle menu')
    fireEvent.click(menuButton)

    // Mobile navigation should be visible
    expect(screen.getByText('Home').closest('nav')).toBeInTheDocument()
  })

  it('closes mobile menu when hamburger clicked again', () => {
    render(<Header />)

    const menuButton = screen.getByLabelText('Toggle menu')
    fireEvent.click(menuButton)
    fireEvent.click(menuButton)

    // Menu should be closed
    expect(screen.queryByText('Home')?.closest('nav.md\\:hidden')).not.toBeVisible()
  })
})
```

```tsx
// src/components/hero.test.tsx
import { render, screen } from '@testing-library/react'
import Hero from './hero'

describe('Hero Component', () => {
  it('renders main title with accent word', () => {
    render(<Hero />)

    expect(screen.getByText('Automate & Innovate')).toBeInTheDocument()
    expect(screen.getByText('Hackathon')).toBeInTheDocument()
  })

  it('displays subtitle', () => {
    render(<Hero />)

    expect(screen.getByText('Automate the process, Innovate the impact')).toBeInTheDocument()
  })

  it('shows event location', () => {
    render(<Hero />)

    expect(screen.getByText('ESTIN Amizour Hub')).toBeInTheDocument()
  })

  it('shows event date', () => {
    render(<Hero />)

    expect(screen.getByText('April 16-18')).toBeInTheDocument()
  })

  it('renders location and date icons', () => {
    render(<Hero />)

    // Lucide icons render as SVG
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(2) // MapPin and Clock
  })
})
```

### Utility Function Tests

```tsx
// src/lib/utils.test.ts
import { cn } from './utils'
import { describe, it, expect } from 'vitest'

describe('cn() utility', () => {
  it('merges class names correctly', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary')
  })

  it('handles conditional classes', () => {
    const isActive = true
    expect(cn('btn', isActive && 'active')).toBe('btn active')
  })

  it('removes duplicate classes', () => {
    expect(cn('btn btn-primary', 'btn-primary')).toBe('btn btn-primary')
  })

  it('handles falsy values', () => {
    expect(cn('btn', false, null, undefined, 0)).toBe('btn')
  })

  it('handles tailwind classes merging', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })
})
```

## Integration Test Patterns

### Component Integration

```tsx
// src/components/__tests__/hero-integration.test.tsx
import { render, screen } from '@testing-library/react'
import Hero from '../hero'

describe('Hero Component Integration', () => {
  it('displays all event information with correct hierarchy', () => {
    const { container } = render(<Hero />)

    // Check heading hierarchy
    const h1 = container.querySelector('h1')
    const h2 = container.querySelector('h2')

    expect(h1).toHaveTextContent('Automate & Innovate')
    expect(h2).toHaveTextContent('Hackathon')
  })

  it('renders with proper layout structure', () => {
    const { container } = render(<Hero />)

    // Main container
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass('flex')
    expect(mainDiv).toHaveClass('flex-col')
    expect(mainDiv).toHaveClass('items-center')
  })
})
```

```tsx
// src/components/__tests__/header-integration.test.tsx
import { render, screen } from '@testing-library/react'
import Header from '../header'

describe('Header Integration', () => {
  it('renders all navigation links', () => {
    render(<Header />)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(3)
  })

  it('has proper accessibility attributes', () => {
    render(<Header />)

    const menuButton = screen.getByLabelText('Toggle menu')
    expect(menuButton).toHaveAttribute('aria-label')
    expect(menuButton).toHaveAttribute('onClick')
  })
})
```

## E2E Test Patterns

### Playwright E2E Tests

```typescript
// src/__tests__/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('desktop navigation displays correctly', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 1280, height: 720 })

    // Check navigation is visible
    await expect(page.locator('nav')).toBeVisible()

    // Check all links
    await expect(page.locator('a:has-text("Home")')).toBeVisible()
    await expect(page.locator('a:has-text("About Us")')).toBeVisible()
    await expect(page.locator('a:has-text("Contact")')).toBeVisible()

    // Check Register button
    await expect(page.locator('button:has-text("Register")')).toBeVisible()
  })

  test('mobile menu toggles correctly', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 375, height: 667 })

    // Menu button should be visible
    const menuButton = page.locator('button[aria-label="Toggle menu"]')
    await expect(menuButton).toBeVisible()

    // Menu should be hidden initially
    await expect(page.locator('nav.md\\:hidden')).not.toBeVisible()

    // Click hamburger menu
    await menuButton.click()

    // Menu should be visible
    await expect(page.locator('nav.md\\:hidden')).toBeVisible()

    // Click again to close
    await menuButton.click()
    await expect(page.locator('nav.md\\:hidden')).not.toBeVisible()
  })

  test('scrolls to sections on navigation click', async ({ page }) => {
    await page.goto('/')

    // Click on navigation links and check scroll position
    await page.click('a:has-text("Home")')
    await expect(page.locator('main')).toBeInViewport()
  })
})
```

```typescript
// src/__tests__/e2e/registration.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('completes registration successfully', async ({ page }) => {
    // Click Register button
    await page.click('button:has-text("Register")')

    // Fill registration form
    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.fill('input[name="phone"]', '+1234567890')
    await page.fill('input[name="teamName"]', 'Team Awesome')

    // Select experience level
    await page.selectOption('select[name="experience"]', 'intermediate')

    // Accept terms
    await page.check('input[name="agreeToTerms"]')

    // Submit
    await page.click('button:has-text("Submit Registration")')

    // Verify success
    await expect(page.locator('text=Registration successful')).toBeVisible()
  })

  test('shows validation errors for invalid input', async ({ page }) => {
    await page.goto('/register')

    // Submit empty form
    await page.click('button:has-text("Submit")')

    // Verify error messages
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Valid email is required')).toBeVisible()
  })

  test('prevents duplicate email registration', async ({ page }) => {
    // First registration
    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.check('input[name="agreeToTerms"]')
    await page.click('button:has-text("Submit")')

    // Second registration with same email
    await page.fill('input[name="fullName"]', 'Jane Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    await page.check('input[name="agreeToTerms"]')
    await page.click('button:has-text("Submit")')

    // Verify error
    await expect(page.locator('text=already registered')).toBeVisible()
  })
})
```

### Accessibility E2E Tests

```typescript
// src/__tests__/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('all images have alt text', async ({ page }) => {
    await page.goto('/')

    const images = await page.locator('img').all()

    for (const img of images) {
      const alt = await img.getAttribute('alt')
      const role = await img.getAttribute('role')

      // Decorative images should have alt="" or role="presentation"
      if (role !== 'presentation') {
        expect(alt).toBeDefined()
      }
    }
  })

  test('all interactive elements are focusable', async ({ page }) => {
    await page.goto('/')

    const interactiveElements = page.locator(
      'button, a, input, select, textarea, [tabindex]'
    )

    await expect(interactiveElements.first()).toBeFocused()
  })

  test('color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    )

    expect(contrastViolations).toHaveLength(0)
  })

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/')

    // Tab through all interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Check that focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })
})
```

### Responsive Design Tests

```typescript
// src/__tests__/e2e/responsive.spec.ts
import { test, expect } from '@playwright/test'

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  largeDesktop: { width: 1920, height: 1080 }
}

test.describe('Responsive Design', () => {
  test('renders correctly on mobile', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize(viewports.mobile)

    // Check mobile layout
    await expect(page.locator('button[aria-label="Toggle menu"]')).toBeVisible()
    await expect(page.locator('nav.md\\:hidden')).not.toBeVisible()

    // Check content is readable
    const heroTitle = page.locator('h1')
    await expect(heroTitle).toBeVisible()

    // Take screenshot
    await page.screenshot({ path: 'screenshots/mobile-home.png' })
  })

  test('renders correctly on tablet', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize(viewports.tablet)

    // Check tablet layout
    await expect(page.locator('nav')).toBeVisible()

    // Take screenshot
    await page.screenshot({ path: 'screenshots/tablet-home.png' })
  })

  test('renders correctly on desktop', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize(viewports.desktop)

    // Check desktop layout
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('button:has-text("Register")')).toBeVisible()

    // Take screenshot
    await page.screenshot({ path: 'screenshots/desktop-home.png' })
  })

  test('schedules section animates on scroll', async ({ page }) => {
    await page.goto('/')

    // Scroll to schedules section
    await page.locator('text=Schedules & Training').scrollIntoViewIfNeeded()

    // Check that SVG path is drawn
    const svgPath = page.locator('svg path[stroke="#FF6B35"]')
    await expect(svgPath).toBeVisible()
  })
})
```

## Accessibility Test Checklist

### WCAG 2.1 AA Compliance

```typescript
// Automated checks with axe-core
const wcagChecks = {
  // Perceivable
  'color-contrast': 'Text has sufficient contrast ratio',
  'image-alt': 'Images have alt text',
  'label': 'Form elements have labels',
  'link-name': 'Links have accessible names',

  // Operable
  'keyboard': 'All functionality available via keyboard',
  'focus-visible': 'Focus indicators are visible',
  'no-autoplay': 'No auto-playing media',

  // Understandable
  'html-lang': 'Page has lang attribute',
  'valid-lang': 'Lang attribute is valid',
  'consistent-navigation': 'Navigation is consistent',

  // Robust
  'aria-valid-attr': 'ARIA attributes are valid',
  'role-required': 'Required ARIA roles are present'
}
```

### Manual Accessibility Testing

```markdown
## Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with TalkBack (Android)
- [ ] Verify reading order is logical
- [ ] Check all content is announced

## Keyboard Testing
- [ ] Tab through all interactive elements
- [ ] Verify focus is visible
- [ ] Check focus order is logical
- [ ] Test Escape key closes menus
- [ ] Test Enter/Space activates buttons

## Visual Testing
- [ ] Text is readable at 200% zoom
- [ ] Content reflows at 320px width
- [ ] No content is cut off
- [ ] Images scale properly
```

## Performance Test Checklist

### Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Hero section load |
| FID (First Input Delay) | < 100ms | Button clicks |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |
| TTI (Time to Interactive) | < 3.5s | Full page load |
| TBT (Total Blocking Time) | < 200ms | Main thread blocking |

### Lighthouse Test Script

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000 \
  --output=json \
  --output-path=./lighthouse-report.json \
  --quiet

# Run Lighthouse CI
npx @lhci/cli autorun
```

### Performance Budget

```json
// .lighthouserc.json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["warn", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.9 }],
        "metrics:first-contentful-paint": ["warn", { "maxNumericValue": 1500 }],
        "metrics:largest-contentful-paint": ["warn", { "maxNumericValue": 2500 }],
        "metrics:total-blocking-time": ["warn", { "maxNumericValue": 200 }]
      }
    }
  }
}
```

## Manual Testing Checklist

### Landing Page

- [ ] Header displays correctly on all screen sizes
- [ ] Logo is visible and links to home
- [ ] Navigation links work
- [ ] Mobile hamburger menu functions
- [ ] Hero title and subtitle are readable
- [ ] Event details (location, date) are correct
- [ ] Countdown timer updates every second
- [ ] CTA buttons are clickable
- [ ] Background decorations render correctly
- [ ] Page loads within 3 seconds

### About Section

- [ ] SOAI logo displays correctly
- [ ] Section title in gold color
- [ ] Vision pillars are readable
- [ ] Image (two-guys.png) loads properly
- [ ] Text is readable on mobile

### Sponsors Section

- [ ] Three sponsor tiers display correctly
- [ ] Golden sponsor is featured (larger)
- [ ] Sponsor images load from external URLs
- [ ] CTA buttons are clickable
- [ ] Responsive layout works

### Schedules Section

- [ ] Timeline animation works on scroll
- [ ] Circle nodes display for each day
- [ ] SVG path draws correctly
- [ ] Text content is readable
- [ ] Alternating layout works (left/right)

### Training Tracks Section

- [ ] Three cards display in grid
- [ ] Icons are visible
- [ ] Card backgrounds render correctly
- [ ] Borders are visible

### Speakers Section

- [ ] Speaker image displays in circle
- [ ] Name and role are visible
- [ ] LinkedIn button is clickable

### Visitors Section

- [ ] Content is centered
- [ ] CTA button is visible
- [ ] Text is readable

### Footer

- [ ] Logo displays correctly
- [ ] Quick links are clickable
- [ ] Contact email is visible
- [ ] Social media icons display
- [ ] Social links open in new tabs
- [ ] Copyright notice is present

### Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Test Coverage Requirements

| Component | Minimum Coverage |
|-----------|-----------------|
| Components | 80% |
| Utilities | 90% |
| API Routes | 85% |
| E2E Critical Flows | 100% |

### Coverage Configuration

```json
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      },
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/index.ts']
    }
  }
})
```

## Bug Reporting Template

```markdown
## Bug Report

**Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Environment:**
- Browser: [Chrome 120, Safari 17, etc.]
- Device: [Desktop, Mobile, Tablet]
- OS: [Windows, macOS, iOS, Android]
- URL: [Page where bug occurred]

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. Scroll to '...'
4. See error

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Screenshots/Video:**
[If applicable]

**Console Errors:**
```
[Paste any console errors]
```

**Additional Context:**
[Any other information]
```

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:unit

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Accessibility audit
        run: pnpm test:a11y

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: |
            coverage/
            screenshots/
```

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse

on:
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install -g @lhci/cli

      - name: Run Lighthouse CI
        run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

## Files to Create

```
__tests__/
├── unit/
│   ├── components/
│   │   ├── header.test.tsx
│   │   ├── countdown.test.tsx
│   │   ├── hero.test.tsx
│   │   └── cta.test.tsx
│   └── utils/
│       └── utils.test.ts
├── integration/
│   └── components/
│       ├── hero-integration.test.tsx
│       └── header-integration.test.tsx
├── e2e/
│   ├── navigation.spec.ts
│   ├── registration.spec.ts
│   ├── accessibility.spec.ts
│   └── responsive.spec.ts
└── fixtures/
    └── test-data.ts

# Configuration files
vitest.config.ts
playwright.config.ts
.lighthouserc.json
```

## Test Commands

```bash
# Unit tests
pnpm test:unit

# E2E tests
pnpm test:e2e

# Accessibility audit
pnpm test:a11y

# Performance audit
pnpm test:perf

# All tests
pnpm test

# Coverage report
pnpm test:coverage

# Run specific test file
pnpm test countdown.test.tsx

# Run tests in watch mode
pnpm test:watch
```

## Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:a11y": "playwright test accessibility",
    "test:perf": "lhci autorun"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@axe-core/playwright": "^4.8.0",
    "@playwright/test": "^1.40.0",
    "@vitest/coverage-v8": "^1.0.0",
    "vitest": "^1.0.0",
    "jsdom": "^23.0.0",
    "@lhci/cli": "^0.12.0"
  }
}
```

## Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
```

## Contact Information

**Organization:** School of AI Béjaia  
**Email:** schoolofai@estin.dz  
**Event:** April 16-18, 2026 at ESTIN Amizour Hub

**Social Media:**
- Instagram: https://www.instagram.com/soai_bejaia/
- Facebook: https://www.facebook.com/profile.php?id=100086557760208
- LinkedIn: https://www.linkedin.com/company/school-of-ai-bejaia
