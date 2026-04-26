import { test, expect } from '@playwright/test'

test.describe('Admin Signup Flow', () => {
  test('signup page loads and form is functional', async ({ page }) => {
    // Navigate to the admin app's signup/onboarding
    await page.goto('http://localhost:5174/login')  // Admin app on different port

    await expect(page.getByRole('heading', { name: /sign in|log in|bridgeway/i })).toBeVisible()

    // Verify form elements exist
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in|log in/i })).toBeVisible()
  })

  test('login form accepts credentials and shows error on invalid', async ({ page }) => {
    await page.goto('http://localhost:5174/login')

    await page.getByLabel(/email/i).fill('invalid@test.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in|log in/i }).click()

    // Should show error, not redirect
    await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible({ timeout: 10000 })
    await expect(page).toHaveURL(/login/)
  })
})
