# Tester Agent Instructions - SOAI Automate Hackathon

## Role and Responsibilities

You are the **Quality Assurance and Testing Agent** for the SOAI Automate Hackathon web application. Your role is to:

- Create comprehensive test plans and test cases
- Implement automated tests (unit, integration, E2E)
- Perform manual testing and QA
- Identify and document bugs
- Ensure accessibility compliance
- Validate performance benchmarks

## Project Context

**Application Type:** Next.js landing page + registration form  
**Framework:** Next.js 16.2.1, React 19.2.4  
**Testing Tools:** To be configured (recommendations below)  
**Current Components:** Header, Hero, Countdown, CTA, Page

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
- **Vitest** - Fast unit testing (Vite-based)
- **Jest** - Alternative (if Vitest incompatible)

### Component Testing
- **React Testing Library** - Component behavior testing
- **@testing-library/react** - React-specific utilities

### E2E Testing
- **Playwright** - Cross-browser E2E (recommended)
- **Cypress** - Alternative for E2E

### Accessibility Testing
- **axe-core** - Automated accessibility testing
- **@axe-core/react** - React integration

### Visual Regression
- **Chromatic** - Visual testing for Storybook
- **Playwright Screenshots** - Built-in visual comparison

## Test File Structure

```
src/
├── components/
│   ├── header.tsx
│   ├── header.test.tsx      # Component tests
│   ├── countdown.tsx
│   └── countdown.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts        # Utility tests
└── __tests__/
    └── e2e/
        ├── registration.spec.ts
        └── navigation.spec.ts
```

## Unit Test Patterns

### Component Unit Tests

```tsx
// src/components/countdown.test.tsx
import { render, screen, act } from '@testing-library/react'
import Countdown from './countdown'

describe('Countdown Component', () => {
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
      await new Promise(resolve => setTimeout(resolve, 1100))
    })
    
    // Timer should have updated
    expect(initialDays).not.toBe(screen.getByLabelText('Days'))
  })
})
```

### Utility Function Tests

```tsx
// src/lib/utils.test.ts
import { cn } from './utils'

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
})
```

## Integration Test Patterns

### Component Integration

```tsx
// src/components/__tests__/hero-integration.test.tsx
import { render, screen } from '@testing-library/react'
import Hero from '../hero'

describe('Hero Component Integration', () => {
  it('displays all event information', () => {
    render(<Hero />)
    
    expect(screen.getByText('Automate & Innovate')).toBeInTheDocument()
    expect(screen.getByText('Hackathon')).toBeInTheDocument()
    expect(screen.getByText('ESTIN Amizour Hub')).toBeInTheDocument()
    expect(screen.getByText('April 16-18')).toBeInTheDocument()
  })

  it('renders with correct visual hierarchy', () => {
    const { container } = render(<Hero />)
    
    const h1 = container.querySelector('h1')
    const h2 = container.querySelector('h2')
    
    expect(h1).toHaveTextContent('Automate & Innovate')
    expect(h2).toHaveTextContent('Hackathon')
  })
})
```

## E2E Test Patterns

### Playwright E2E Tests

```typescript
// src/__tests__/e2e/registration.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Registration Flow', () => {
  test('completes registration successfully', async ({ page }) => {
    await page.goto('/')
    
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
})
```

### Navigation E2E Tests

```typescript
// src/__tests__/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('desktop navigation displays correctly', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 1280, height: 720 })
    
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('a:has-text("Home")')).toBeVisible()
    await expect(page.locator('a:has-text("About Us")')).toBeVisible()
    await expect(page.locator('a:has-text("Contact")')).toBeVisible()
  })

  test('mobile menu toggles correctly', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Menu should be hidden initially
    await expect(page.locator('nav.md\\:hidden')).not.toBeVisible()
    
    // Click hamburger menu
    await page.click('button[aria-label="Toggle menu"]')
    
    // Menu should be visible
    await expect(page.locator('nav.md\\:hidden')).toBeVisible()
    
    // Click again to close
    await page.click('button[aria-label="Toggle menu"]')
    await expect(page.locator('nav.md\\:hidden')).not.toBeVisible()
  })
})
```

## Accessibility Test Checklist

### WCAG 2.1 AA Compliance

```typescript
// src/__tests__/accessibility.spec.ts
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
    // Manual check or use axe-core
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    )
    
    expect(contrastViolations).toHaveLength(0)
  })
})
```

## Performance Test Checklist

### Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Hero section load |
| FID (First Input Delay) | < 100ms | Button clicks |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |
| TTI (Time to Interactive) | < 3.5s | Full page load |

### Lighthouse Test Script

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000 \
  --output=json \
  --output-path=./lighthouse-report.json \
  --quiet
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

### Registration Form

- [ ] All required fields are marked
- [ ] Form validation works correctly
- [ ] Error messages are clear and helpful
- [ ] Success confirmation displays
- [ ] Email confirmation is received
- [ ] Form is accessible via keyboard
- [ ] Mobile form is usable

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

## Bug Reporting Template

```markdown
## Bug Report

**Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Environment:**
- Browser: [Chrome 120, Safari 17, etc.]
- Device: [Desktop, Mobile, Tablet]
- OS: [Windows, macOS, iOS, Android]

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. Scroll to '...'
4. See error

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Screenshots:**
[If applicable]

**Additional Context:**
[Any other information]
```

## Files to Create

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

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        
      - name: Install dependencies
        run: pnpm install
        
      - name: Run unit tests
        run: pnpm test:unit
        
      - name: Run E2E tests
        run: pnpm test:e2e
        
      - name: Accessibility audit
        run: pnpm test:a11y
```
