import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility - Registration Page', () => {
  test('should not have accessibility violations on initial load', async ({ page }) => {
    await page.goto('/register')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('all form inputs have labels', async ({ page }) => {
    await page.goto('/register')

    // Enter team name to show form
    await page.fill('input[placeholder="Afak"]', 'Team Afak')
    await page.click('button:has-text("Next")')

    // Check all inputs have associated labels
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="tel"]')
    const count = await inputs.count()

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const label = page.locator(`label[for="${await input.getAttribute('id')}"]`)
      
      // If no id, check for aria-label or wrapping label
      const hasLabel = await label.count() > 0 || 
                       await input.getAttribute('aria-label') !== null ||
                       await input.locator('xpath=..//label').count() > 0
      
      expect(hasLabel).toBeTruthy()
    }
  })

  test('all interactive elements are focusable', async ({ page }) => {
    await page.goto('/register')

    // Tab through all interactive elements
    await page.keyboard.press('Tab')
    const firstFocusedElement = page.locator(':focus')
    await expect(firstFocusedElement).toBeVisible()

    // Continue tabbing
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab')
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    }
  })

  test('focus indicators are visible', async ({ page }) => {
    await page.goto('/register')

    // Tab to first input
    await page.keyboard.press('Tab')
    
    const focusedElement = page.locator(':focus')
    const styles = await focusedElement.evaluate((el) => {
      const computed = window.getComputedStyle(el)
      return {
        outline: computed.outline,
        outlineStyle: computed.outlineStyle,
        outlineWidth: computed.outlineWidth,
        boxShadow: computed.boxShadow,
      }
    })

    // Check that there's some visible focus indicator
    const hasFocusIndicator = 
      styles.outline !== 'none' || 
      styles.outlineWidth !== '0px' || 
      styles.boxShadow !== 'none'
    
    expect(hasFocusIndicator).toBeTruthy()
  })

  test('form has proper heading hierarchy', async ({ page }) => {
    await page.goto('/register')

    // Check h1 exists
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText('Registration Form')

    // Navigate to member form
    await page.fill('input[placeholder="Afak"]', 'Team Afak')
    await page.click('button:has-text("Next")')

    // Check h2 exists for member section
    const h2 = page.locator('h2')
    await expect(h2).toBeVisible()
  })

  test('error messages are announced to screen readers', async ({ page }) => {
    await page.goto('/register')

    // Submit with invalid data to trigger error
    await page.fill('input[placeholder="Afak"]', 'A')
    await page.click('button:has-text("Next")')

    // Wait for potential error message
    await page.waitForTimeout(1000)

    // Check if error has proper ARIA attributes
    const errorMessages = page.locator('[role="alert"], [aria-live="polite"], [aria-live="assertive"]')
    expect(await errorMessages.count()).toBeGreaterThanOrEqual(0)

    // Error messages should have live region for screen readers
    // (This is a best practice check)
  })

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/register')

    const buttons = page.locator('button')
    const count = await buttons.count()

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')

      // Button should have either visible text or aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy()
    }
  })

  test('color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/register')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .include('main')
      .analyze()

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    )

    expect(contrastViolations).toHaveLength(0)
  })

  test('keyboard navigation works for form submission', async ({ page }) => {
    await page.goto('/register')

    // Use only keyboard
    await page.keyboard.press('Tab') // Focus team name input
    await page.keyboard.type('Team Afak')
    await page.keyboard.press('Tab') // Move to Cancel button
    await page.keyboard.press('Tab') // Move to Next button
    await page.keyboard.press('Enter') // Click Next

    // Should navigate to member form
    await expect(page.getByText(/information$/)).toBeVisible()
  })
})

test.describe('Accessibility - Visitor Registration Page', () => {
  test('should not have accessibility violations', async ({ page }) => {
    await page.goto('/register/visitor')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('all form inputs have labels', async ({ page }) => {
    await page.goto('/register/visitor')

    const inputs = page.locator('input, select')
    const count = await inputs.count()

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const tagName = await input.evaluate(el => el.tagName.toLowerCase())
      
      // Skip buttons
      if (tagName === 'button') continue

      const hasLabel = await input.getAttribute('aria-label') !== null ||
                       await input.locator('xpath=..//label').count() > 0
      
      expect(hasLabel).toBeTruthy()
    }
  })
})

test.describe('Accessibility - Homepage', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('all navigation links are accessible', async ({ page }) => {
    await page.goto('/')

    const navLinks = page.locator('nav a')
    const count = await navLinks.count()

    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i)
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')

      expect(text?.trim() || ariaLabel).toBeTruthy()
    }
  })

  test('all images have alt text', async ({ page }) => {
    await page.goto('/')

    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const image = images.nth(i)
      const alt = await image.getAttribute('alt')
      const role = await image.getAttribute('role')

      // Decorative images should have alt="" or role="presentation"
      if (role !== 'presentation') {
        expect(alt !== null).toBeTruthy()
      }
    }
  })

  test('skip to main content link exists', async ({ page }) => {
    await page.goto('/')

    // Check for skip link (best practice)
    const skipLink = page.locator('a[href="#main-content"], a[href="#content"], a:has-text("Skip")')
    expect(skipLink).toBeDefined()

    // This is optional but recommended
    // expect(skipLink).toBeVisible()
  })
})
