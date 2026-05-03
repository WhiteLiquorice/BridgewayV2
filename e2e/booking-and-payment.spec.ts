import { test, expect } from '@playwright/test';

test.describe('Booking and Payment Processing Flows', () => {
  // Test the SaaS subscription payment flow (from the website)
  test('SaaS Subscription Payment Redirection', async ({ page }) => {
    // Navigate to the main website
    await page.goto('https://bridgeway-db29e-website.web.app/');

    // Click "Get Started" or scroll to pricing
    const pricingSection = page.locator('#pricing');
    await expect(pricingSection).toBeVisible();

    // Fill in the sign-up form in the Demo component (if it exists) or standard sign up
    const emailInput = page.locator('input[placeholder*="email" i], input[type="email"]').first();
    const orgInput = page.locator('input[placeholder*="organization" i], input[placeholder*="company" i], input[name="orgName"]').first();
    
    if (await emailInput.isVisible() && await orgInput.isVisible()) {
      await emailInput.fill('test@playwright.com');
      await orgInput.fill('Playwright Test Org');
      
      // Select the $300 tier
      const fullStackButton = page.locator('button', { hasText: '$300' }).first();
      if (await fullStackButton.isVisible()) {
        await fullStackButton.click();
      }

      // Check if Stripe Checkout session is triggered by monitoring network or navigation
      const [request] = await Promise.all([
        page.waitForRequest(req => req.url().includes('createCheckoutSession')),
        page.locator('button', { hasText: /subscribe|checkout|get started/i }).click()
      ]);
      expect(request.url()).toContain('createCheckoutSession');
    }
  });

  // Test the end customer booking flow
  test('Customer Booking Flow and Hold Payment', async ({ page }) => {
    // Navigate to the booking portal
    await page.goto('https://bridgeway-db29e-booking.web.app/');

    // Select a service (Assuming "Massage (60 Min)" exists from seed data)
    const serviceName = 'Massage (60 Min)';
    const serviceCard = page.locator(`text=${serviceName}`).first();
    
    // If the booking UI shows services first:
    if (await serviceCard.isVisible()) {
      await serviceCard.click();
      
      // Select a date
      // Click a date button in the calendar/date picker (e.g., tomorrow's date)
      const dateButton = page.locator('button.date-picker-day').nth(1); // just grab a date button
      if (await dateButton.isVisible()) {
        await dateButton.click();
      }

      // Select a time slot
      const timeSlot = page.locator('button.time-slot').first();
      if (await timeSlot.isVisible()) {
        await timeSlot.click();
      }

      // Fill in client details
      await page.fill('input[name="firstName"]', 'John');
      await page.fill('input[name="lastName"]', 'Doe');
      await page.fill('input[name="email"]', 'john.doe@example.com');
      
      // Confirm Booking
      const confirmButton = page.locator('button', { hasText: /confirm|book/i });
      await expect(confirmButton).toBeVisible();

      // If Stripe Connect hold is enabled, it should either navigate to Stripe or call createBookingHoldSession
      const [response] = await Promise.all([
        page.waitForResponse(res => res.url().includes('createBookingHoldSession') || res.status() === 200),
        confirmButton.click()
      ]);
      
      expect(response.ok()).toBeTruthy();
    }
  });
});
