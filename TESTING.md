# SOAI Automate - Test Suite

This document provides an overview of the testing strategy and test files for the SOAI Automate Hackathon web application.

## Test Structure

```
soai-automate/
├── __tests__/
│   └── e2e/                    # Playwright E2E tests
│       ├── accessibility.spec.ts
│       ├── registration.spec.ts
│       └── responsive.spec.ts
├── src/__tests__/
│   ├── fixtures/
│   │   └── test-data.ts        # Test data fixtures
│   └── unit/
│       └── validations/
│           └── registration.test.ts  # Validation schema tests
```

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
pnpm test:unit

# Run tests in watch mode
pnpm test:watch

# Run with coverage report
pnpm test:coverage
```

**Coverage:** Validation schemas are tested with 100% coverage.

### E2E Tests (Playwright)

```bash
# Run all E2E tests
pnpm test:e2e

# Run with UI mode
pnpm test:e2e:ui

# Run accessibility tests only
pnpm test:a11y
```

**Browsers Tested:**
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Test Coverage

### Unit Tests

| File | Coverage | Tests |
|------|----------|-------|
| `src/lib/validations/registration.ts` | ✅ 100% | 9 tests |
| `src/lib/validations/visitor.ts` | ✅ 100% | 4 tests |

**Total:** 13 tests passing

### E2E Tests

| Test File | Description | Tests |
|-----------|-------------|-------|
| `registration.spec.ts` | Registration flow, validation, errors | 6 tests |
| `accessibility.spec.ts` | WCAG 2.1 AA compliance | 12 tests |
| `responsive.spec.ts` | Mobile/tablet/desktop layouts | 11 tests |

**Total:** 29 E2E tests

## Test Files Overview

### Unit Tests

#### `src/__tests__/unit/validations/registration.test.ts`

Tests for the registration form validation schema:

- **Team Name Validation**
  - Valid team names
  - Minimum length (2 characters)
  - Maximum length (100 characters)

- **Team Member Validation**
  - Valid member data
  - Email format validation
  - Phone number format validation
  - First name character restrictions (letters, hyphens, apostrophes only)

#### `src/__tests__/unit/validations/visitor.test.ts`

Tests for the visitor registration validation schema:

- Valid visitor data
- Email validation
- Phone number length validation
- Visit date requirement

### E2E Tests

#### `__tests__/e2e/registration.spec.ts`

Tests the complete registration flow:

1. **Full Registration Flow**
   - Team name entry
   - All 4 member forms
   - Success confirmation

2. **Validation Tests**
   - Invalid email format
   - Required fields

3. **User Experience**
   - Cancel and reset functionality
   - Submitting state (disabled inputs)
   - Error message display

4. **Responsive Layout**
   - Desktop grid layout (2 columns)
   - Mobile single column layout

#### `__tests__/e2e/accessibility.spec.ts`

WCAG 2.1 AA compliance tests:

1. **Automated Accessibility Scans**
   - No accessibility violations
   - Color contrast checks
   - ARIA attributes validation

2. **Form Accessibility**
   - All inputs have labels
   - Interactive elements are focusable
   - Visible focus indicators
   - Proper heading hierarchy
   - Accessible button names

3. **Keyboard Navigation**
   - Tab through all elements
   - Keyboard form submission

4. **Screen Reader Support**
   - Error message announcements
   - Proper ARIA live regions

#### `__tests__/e2e/responsive.spec.ts`

Responsive design tests across viewports:

1. **Homepage**
   - Mobile (375x667)
   - Tablet (768x1024)
   - Desktop (1280x720)
   - Large Desktop (1920x1080)

2. **Registration Page**
   - Mobile layout (single column)
   - Desktop layout (2-column grid)
   - Touch target sizes (minimum 44x44px)

3. **Navigation**
   - Mobile menu toggle
   - Header navigation on all pages
   - Skip links

## Test Data Fixtures

### `src/__tests__/fixtures/test-data.ts`

Reusable test data:

```typescript
// Valid team data for 4 members
export const validTeamData

// Valid visitor data
export const validVisitorData

// Invalid team data variations
export const invalidTeamData

// API response mocks
export const apiResponses

// Helper functions
export function createMember(overrides)
export function createTeam(overrides)
```

## Continuous Integration

Tests are configured to run in CI/CD pipelines:

```yaml
# GitHub Actions example
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm test:unit
      - run: pnpm test:e2e
```

## Accessibility Compliance

Target: **WCAG 2.1 AA**

### Automated Tests
- ✅ No accessibility violations (axe-core)
- ✅ Color contrast ≥ 4.5:1
- ✅ All images have alt text
- ✅ All form inputs have labels
- ✅ Keyboard navigation works

### Manual Testing Required
- [ ] Screen reader testing (NVDA, VoiceOver)
- [ ] Text readability at 200% zoom
- [ ] Content reflow at 320px width

## Performance Testing

Run Lighthouse audits:

```bash
npx lighthouse http://localhost:3000 \
  --output=json \
  --output-path=./lighthouse-report.json
```

**Targets:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## Troubleshooting

### E2E Tests Fail to Start

Make sure the dev server is running:

```bash
pnpm dev
```

Or use the auto-start feature:

```bash
pnpm test:e2e
```

### Unit Tests Show Deprecation Warnings

These are safe to ignore. They come from Vite's CJS API.

### Playwright Browsers Not Installed

Install browsers:

```bash
pnpm exec playwright install
```

## Adding New Tests

### Unit Test Example

```typescript
// src/__tests__/unit/validations/example.test.ts
import { describe, it, expect } from 'vitest'
import { exampleSchema } from '@/lib/validations/example'

describe('Example Schema', () => {
  it('validates valid data', () => {
    const result = exampleSchema.safeParse({ field: 'value' })
    expect(result.success).toBe(true)
  })
})
```

### E2E Test Example

```typescript
// __tests__/e2e/example.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Example Feature', () => {
  test('does something', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Welcome')).toBeVisible()
  })
})
```

## Test Coverage Reports

After running `pnpm test:coverage`, open the HTML report:

```bash
open coverage/index.html
```

## Contact

For questions about testing, refer to the [Tester Agent Documentation](../agents/tester.md).
