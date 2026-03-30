import { test, expect, devices } from '@playwright/test'

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  largeDesktop: { width: 1920, height: 1080 },
}

test.describe('Responsive Design - Homepage', () => {
  test('renders correctly on mobile', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize(viewports.mobile)

    // Check mobile menu is visible
    await expect(page.locator('button[aria-label="Toggle menu"]')).toBeVisible()

    // Check hero content
    await expect(page.getByText('Automate & Innovate')).toBeVisible()

    await page.screenshot({ path: 'screenshots/home-mobile.png' })
  })

  test('renders correctly on tablet', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize(viewports.tablet)

    // Check navigation is visible
    await expect(page.locator('nav')).toBeVisible()

    await page.screenshot({ path: 'screenshots/home-tablet.png' })
  })

  test('renders correctly on desktop', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize(viewports.desktop)

    // Check navigation and Register button
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.getByText('Register')).toBeVisible()

    await page.screenshot({ path: 'screenshots/home-desktop.png' })
  })

  test('countdown timer displays correctly on all screen sizes', async ({ page }) => {
    await page.goto('/')

    for (const [name, size] of Object.entries(viewports)) {
      await page.setViewportSize(size)
      
      const timerBoxes = page.locator('[role="timer"]')
      await expect(timerBoxes.first()).toBeVisible()
    }
  })
})

test.describe('Responsive Design - Registration Page', () => {
  test('team name input displays correctly on mobile', async ({ page }) => {
    await page.goto('/register')
    await page.setViewportSize(viewports.mobile)

    await expect(page.locator('input[placeholder="Afak"]')).toBeVisible()
    await expect(page.locator('input[placeholder="Afak"]')).toHaveCSS('width', expect.stringMatching(/\d+px/))
  })

  test('member form grid layout on desktop', async ({ page }) => {
    await page.goto('/register')
    await page.setViewportSize(viewports.desktop)

    // Enter team name
    await page.fill('input[placeholder="Afak"]', 'Team Afak')
    await page.click('button:has-text("Next")')

    // Check grid layout - inputs should be side by side
    const firstName = page.locator('input[placeholder="Bilel"]')
    const lastName = page.locator('input[placeholder="Abbes"]')

    const firstNameBox = await firstName.boundingBox()
    const lastNameBox = await lastName.boundingBox()

    expect(firstNameBox).toBeTruthy()
    expect(lastNameBox).toBeTruthy()

    // Should be on same row (within 10px tolerance)
    expect(Math.abs(firstNameBox!.y - lastNameBox!.y)).toBeLessThan(10)
  })

  test('member form single column on mobile', async ({ page }) => {
    await page.goto('/register')
    await page.setViewportSize(viewports.mobile)

    // Enter team name
    await page.fill('input[placeholder="Afak"]', 'Team Afak')
    await page.click('button:has-text("Next")')

    // Check single column - inputs should be stacked
    const firstName = page.locator('input[placeholder="Bilel"]')
    const lastName = page.locator('input[placeholder="Abbes"]')

    const firstNameBox = await firstName.boundingBox()
    const lastNameBox = await lastName.boundingBox()

    expect(firstNameBox).toBeTruthy()
    expect(lastNameBox).toBeTruthy()

    // Should be on different rows
    expect(firstNameBox!.y).toBeLessThan(lastNameBox!.y - 50)
  })

  test('buttons are accessible on all screen sizes', async ({ page }) => {
    await page.goto('/register')

    for (const [name, size] of Object.entries(viewports)) {
      await page.setViewportSize(size)

      const buttons = page.locator('button')
      await expect(buttons.first()).toBeVisible()

      // Check buttons are large enough for touch (minimum 44x44px)
      const buttonBox = await buttons.first().boundingBox()
      expect(buttonBox).toBeTruthy()
      expect(buttonBox!.height).toBeGreaterThanOrEqual(44)
    }
  })
})

test.describe('Responsive Design - Visitor Registration', () => {
  test('renders correctly on mobile', async ({ page }) => {
    await page.goto('/register/visitor')
    await page.setViewportSize(viewports.mobile)

    await expect(page.getByText('Visitor Registration')).toBeVisible()
    await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible()

    await page.screenshot({ path: 'screenshots/visitor-mobile.png' })
  })

  test('renders correctly on desktop', async ({ page }) => {
    await page.goto('/register/visitor')
    await page.setViewportSize(viewports.desktop)

    await expect(page.getByText('Visitor Registration')).toBeVisible()

    await page.screenshot({ path: 'screenshots/visitor-desktop.png' })
  })
})

test.describe('Navigation Flow', () => {
  test('can navigate from homepage to registration', async ({ page }) => {
    await page.goto('/')

    // Click Register button in header
    await page.click('a:has-text("Register")')

    await expect(page).toHaveURL('/register')
    await expect(page.getByText('Registration Form')).toBeVisible()
  })

  test('can navigate from homepage to visitor registration', async ({ page }) => {
    await page.goto('/')

    // Scroll to visitors section
    await page.locator('text=Visitors').first().scrollIntoViewIfNeeded()
    
    // Click visitor registration link
    await page.click('a:has-text("Register for Demo Day")')

    await expect(page).toHaveURL('/register/visitor')
    await expect(page.getByText('Visitor Registration')).toBeVisible()
  })

  test('header navigation works on all pages', async ({ page }) => {
    const pages = ['/', '/register', '/register/visitor']

    for (const path of pages) {
      await page.goto(path)

      // Click Home link
      await page.click('a:has-text("Home")')
      await expect(page).toHaveURL('/')

      // Go back to current page
      await page.goto(path)
    }
  })
})

test.describe('Mobile Menu', () => {
  test('toggles correctly on mobile', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize(viewports.mobile)

    // Menu should be closed initially
    const mobileNav = page.locator('nav.md\\:hidden')
    await expect(mobileNav).not.toBeVisible()

    // Click hamburger menu
    const menuButton = page.locator('button[aria-label="Toggle menu"]')
    await menuButton.click()

    // Menu should be visible
    await expect(mobileNav).toBeVisible()

    // Click again to close
    await menuButton.click()
    await expect(mobileNav).not.toBeVisible()
  })

  test('navigation links work in mobile menu', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize(viewports.mobile)

    // Open menu
    await page.click('button[aria-label="Toggle menu"]')

    // Click Home link
    await page.click('nav a:has-text("Home")')
    await expect(page).toHaveURL('/')
  })
})
