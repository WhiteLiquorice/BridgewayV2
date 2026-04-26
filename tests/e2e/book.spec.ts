import { test, expect } from '@playwright/test'

test.describe('Booking Flow (No Payment)', () => {
  test('can complete a full booking without payment', async ({ page }) => {
    // Navigate to booking page for a test org
    await page.goto('/?org=test-clinic')

    // Step 1: Select a service
    await expect(page.getByText('Book an Appointment')).toBeVisible()
    // Wait for services to load and click first one
    await page.locator('[data-testid="service-card"]').first().click()
    await page.getByRole('button', { name: /next|continue/i }).click()

    // Step 2: Select a date
    await expect(page.getByText(/select.*date/i)).toBeVisible()
    // Click a future date
    await page.locator('[data-testid="date-button"]:not([disabled])').first().click()
    await page.getByRole('button', { name: /next|continue/i }).click()

    // Step 3: Select a time slot
    await expect(page.getByText(/select.*time/i)).toBeVisible()
    await page.locator('[data-testid="time-slot"]').first().click()
    await page.getByRole('button', { name: /next|continue/i }).click()

    // Step 4: Fill in personal details
    await page.getByLabel(/name/i).fill('Test Patient')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/phone/i).fill('555-1234')
    await page.getByRole('button', { name: /next|continue/i }).click()

    // Step 5: Review & Confirm (skipping payment - not required for test org)
    await expect(page.getByText(/confirm|review/i)).toBeVisible()
    await page.getByRole('button', { name: /confirm|book/i }).click()

    // Success screen
    await expect(page.getByText(/confirmed|booked|success/i)).toBeVisible({ timeout: 10000 })
  })
})
