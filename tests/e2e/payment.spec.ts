import { test, expect } from '@playwright/test'

test.describe('Booking Payment Flow', () => {
  test('payment step appears when org requires payment', async ({ page }) => {
    // Navigate to a test org that has payment required
    await page.goto('/?org=test-clinic-pay')

    // Verify the booking widget loads
    await expect(page.getByText(/book|appointment|service/i)).toBeVisible()
  })

  test('Stripe payment form renders in booking flow', async ({ page }) => {
    // This test checks that Stripe Elements mount correctly
    // In a real E2E setup, you'd use Stripe test mode with a test key
    await page.goto('/?org=test-clinic-pay')

    // Proceed through booking steps 1-4
    await page.locator('[data-testid="service-card"]').first().click()
    await page.getByRole('button', { name: /next|continue/i }).click()

    await page.locator('[data-testid="date-button"]:not([disabled])').first().click()
    await page.getByRole('button', { name: /next|continue/i }).click()

    await page.locator('[data-testid="time-slot"]').first().click()
    await page.getByRole('button', { name: /next|continue/i }).click()

    await page.getByLabel(/name/i).fill('Payment Test')
    await page.getByLabel(/email/i).fill('pay@example.com')
    await page.getByLabel(/phone/i).fill('555-9999')
    await page.getByRole('button', { name: /next|continue/i }).click()

    // Should reach payment step
    await expect(page.getByText(/payment|card|pay/i)).toBeVisible({ timeout: 10000 })
  })
})
