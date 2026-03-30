import { test, expect } from '@playwright/test'

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('completes full team registration successfully', async ({ page }) => {
    // Step 0: Enter team name
    await expect(page.getByText('Registration Form')).toBeVisible()
    await page.fill('input[placeholder="Afak"]', 'Team Afak')
    await page.click('button:has-text("Next")')

    // Steps 1-4: Fill all 4 member forms
    for (let step = 1; step <= 4; step++) {
      await expect(page.getByText(/information$/)).toBeVisible()

      await page.fill('input[placeholder="Bilel"]', `FirstName${step}`)
      await page.fill('input[placeholder="Abbes"]', `LastName${step}`)
      await page.fill('input[placeholder="exemple@estin.dz"]', `member${step}@example.com`)
      await page.fill('input[placeholder="123456789"]', '0555123456')
      await page.fill('input[placeholder="Estin"]', 'ESTIN')
      await page.fill('input[placeholder="Informatique"]', 'Informatique')
      await page.fill('input[placeholder="2024"]', '2024')

      const submitButton = step === 4
        ? page.getByRole('button', { name: 'Submit' })
        : page.getByRole('button', { name: 'Next' })

      await submitButton.click()
    }

    // Verify success message
    await expect(page.getByText(/Registration successful/i)).toBeVisible()
  })

  test('shows validation errors for invalid input', async ({ page }) => {
    // Enter team name
    await page.fill('input[placeholder="Afak"]', 'Team Afak')
    await page.click('button:has-text("Next")')

    // Try to submit with invalid email
    await page.fill('input[placeholder="Bilel"]', 'John')
    await page.fill('input[placeholder="Abbes"]', 'Doe')
    await page.fill('input[placeholder="exemple@estin.dz"]', 'invalid-email')
    await page.fill('input[placeholder="123456789"]', '123456789')
    await page.fill('input[placeholder="Estin"]', 'Estin')
    await page.fill('input[placeholder="Informatique"]', 'Informatique')
    await page.fill('input[placeholder="2024"]', '2024')

    await page.click('button:has-text("Next")')

    // Should stay on same step due to HTML5 validation
    await expect(page.getByText('Team leader information')).toBeVisible()
  })

  test('allows canceling and resetting form', async ({ page }) => {
    // Enter team name
    await page.fill('input[placeholder="Afak"]', 'Team Afak')
    await page.click('button:has-text("Next")')

    // Verify we're on team leader step
    await expect(page.getByText('Team leader information')).toBeVisible()

    // Click Cancel
    await page.click('button:has-text("Cancel")')

    // Should return to team name step
    await expect(page.getByText('Registration Form')).toBeVisible()
    await expect(page.locator('input[placeholder="Afak"]')).toHaveValue('')
  })

  test('disables inputs while submitting', async ({ page }) => {
    // Mock slow API response
    await page.route('/api/register', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.fulfill({
        status: 201,
        json: { success: true, message: 'Registration successful' },
      })
    })

    // Enter team name
    await page.fill('input[placeholder="Afak"]', 'Team Afak')
    await page.click('button:has-text("Next")')

    // Fill first member
    await page.fill('input[placeholder="Bilel"]', 'John')
    await page.fill('input[placeholder="Abbes"]', 'Doe')
    await page.fill('input[placeholder="exemple@estin.dz"]', 'john@example.com')
    await page.fill('input[placeholder="123456789"]', '0555123456')
    await page.fill('input[placeholder="Estin"]', 'Estin')
    await page.fill('input[placeholder="Informatique"]', 'Informatique')
    await page.fill('input[placeholder="2024"]', '2024')

    // Click Next and quickly check for submitting state
    await page.click('button:has-text("Next")')

    // Inputs should be disabled during submission
    await expect(page.locator('input[placeholder="Bilel"]')).toBeDisabled()
  })

  test('shows error message on API failure', async ({ page }) => {
    // Mock API error
    await page.route('/api/register', async (route) => {
      await route.fulfill({
        status: 409,
        json: { error: 'A participant with this email already exists' },
      })
    })

    // Complete all steps
    await page.fill('input[placeholder="Afak"]', 'Team Afak')
    await page.click('button:has-text("Next")')

    for (let step = 1; step <= 4; step++) {
      await page.fill('input[placeholder="Bilel"]', `John${step}`)
      await page.fill('input[placeholder="Abbes"]', `Doe${step}`)
      await page.fill('input[placeholder="exemple@estin.dz"]', 'duplicate@example.com')
      await page.fill('input[placeholder="123456789"]', '0555123456')
      await page.fill('input[placeholder="Estin"]', 'Estin')
      await page.fill('input[placeholder="Informatique"]', 'Informatique')
      await page.fill('input[placeholder="2024"]', '2024')

      const submitButton = step === 4
        ? page.getByRole('button', { name: 'Submit' })
        : page.getByRole('button', { name: 'Next' })

      await submitButton.click()
    }

    // Verify error message
    await expect(page.getByText(/already exists/i)).toBeVisible()
  })
})

test.describe('Registration Page Layout', () => {
  test('renders correctly on desktop', async ({ page }) => {
    await page.goto('/register')
    await page.setViewportSize({ width: 1280, height: 720 })

    await expect(page.getByText('Registration Form')).toBeVisible()
    await expect(page.locator('input[placeholder="Afak"]')).toBeVisible()

    await page.screenshot({ path: 'screenshots/registration-desktop.png' })
  })

  test('renders correctly on mobile', async ({ page }) => {
    await page.goto('/register')
    await page.setViewportSize({ width: 375, height: 667 })

    await expect(page.getByText('Registration Form')).toBeVisible()
    await expect(page.locator('input[placeholder="Afak"]')).toBeVisible()

    await page.screenshot({ path: 'screenshots/registration-mobile.png' })
  })

  test('displays grid layout on desktop for member forms', async ({ page }) => {
    await page.goto('/register')
    await page.setViewportSize({ width: 1280, height: 720 })

    // Enter team name and proceed
    await page.fill('input[placeholder="Afak"]', 'Team Afak')
    await page.click('button:has-text("Next")')

    // Check grid layout (2 columns)
    const firstNameInput = page.locator('input[placeholder="Bilel"]')
    const lastNameInput = page.locator('input[placeholder="Abbes"]')

    await expect(firstNameInput).toBeVisible()
    await expect(lastNameInput).toBeVisible()

    // Get bounding boxes to verify side-by-side layout
    const firstNameBox = await firstNameInput.boundingBox()
    const lastNameBox = await lastNameInput.boundingBox()

    expect(firstNameBox).toBeTruthy()
    expect(lastNameBox).toBeTruthy()
    expect(firstNameBox!.y).toBe(lastNameBox!.y) // Same row
  })

  test('displays single column layout on mobile for member forms', async ({ page }) => {
    await page.goto('/register')
    await page.setViewportSize({ width: 375, height: 667 })

    // Enter team name and proceed
    await page.fill('input[placeholder="Afak"]', 'Team Afak')
    await page.click('button:has-text("Next")')

    // Check single column layout
    const firstNameInput = page.locator('input[placeholder="Bilel"]')
    const lastNameInput = page.locator('input[placeholder="Abbes"]')

    await expect(firstNameInput).toBeVisible()
    await expect(lastNameInput).toBeVisible()

    // Get bounding boxes to verify stacked layout
    const firstNameBox = await firstNameInput.boundingBox()
    const lastNameBox = await lastNameInput.boundingBox()

    expect(firstNameBox).toBeTruthy()
    expect(lastNameBox).toBeTruthy()
    expect(firstNameBox!.y).toBeLessThan(lastNameBox!.y) // Different rows
  })
})
