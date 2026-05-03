# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking-and-payment.spec.ts >> Booking and Payment Processing Flows >> SaaS Subscription Payment Redirection
- Location: e2e\booking-and-payment.spec.ts:5:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#pricing')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#pricing')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - heading "Bridgeway" [level=1] [ref=e6]
      - paragraph [ref=e7]: Practice Management
    - navigation [ref=e9]:
      - button "Front Desk What your staff sees" [ref=e10] [cursor=pointer]:
        - img [ref=e12]
        - generic [ref=e14]:
          - paragraph [ref=e15]: Front Desk
          - paragraph [ref=e16]: What your staff sees
      - button "Client Portal How your clients see you" [ref=e17] [cursor=pointer]:
        - img [ref=e19]
        - generic [ref=e21]:
          - paragraph [ref=e22]: Client Portal
          - paragraph [ref=e23]: How your clients see you
      - button "Admin Panel Org setup" [ref=e24] [cursor=pointer]:
        - img [ref=e26]
        - generic [ref=e29]:
          - paragraph [ref=e30]: Admin Panel
          - paragraph [ref=e31]: Org setup
      - button "Pricing" [ref=e32] [cursor=pointer]:
        - img [ref=e34]
        - paragraph [ref=e37]: Pricing
      - button "FAQ" [ref=e38] [cursor=pointer]:
        - img [ref=e40]
        - paragraph [ref=e43]: FAQ
    - generic [ref=e44]:
      - generic [ref=e45]:
        - button "Try Live Admin App" [ref=e46] [cursor=pointer]
        - button "Try Live Dashboard" [ref=e47] [cursor=pointer]
      - button "Get Started" [ref=e48] [cursor=pointer]
      - paragraph [ref=e49]: © 2026 Bridgeway Apps
  - main [ref=e50]:
    - generic [ref=e51]:
      - generic [ref=e53]:
        - paragraph [ref=e54]: The Front Desk
        - heading "A full work day at your fingertips." [level=2] [ref=e55]:
          - text: A full work day
          - text: at your fingertips.
        - paragraph [ref=e56]: Today's schedule, the waiting room, and unconfirmed appointments — all visible at a glance. No toggling between systems. No staff training.
      - generic [ref=e58]:
        - generic [ref=e60]:
          - generic [ref=e66]: dashboard.bridgewayapps.com
          - generic [ref=e67]:
            - generic [ref=e68]:
              - generic [ref=e69]:
                - img [ref=e71]
                - generic [ref=e73]: Wellness Co
              - generic [ref=e74]:
                - generic [ref=e75]: The Floor
                - generic [ref=e76]: Schedule
                - generic [ref=e77]: Clients
                - generic [ref=e78]: Services
                - generic [ref=e79]: Memberships
                - generic [ref=e80]: Reports
                - generic [ref=e81]: Settings
            - generic [ref=e82]:
              - generic [ref=e83]:
                - generic [ref=e84]:
                  - heading "The Floor" [level=3] [ref=e85]
                  - paragraph [ref=e86]: Tuesday, live right now
                - generic [ref=e89]: Live
              - generic [ref=e90]:
                - generic [ref=e91]:
                  - paragraph [ref=e92]: In Session
                  - paragraph [ref=e93]: "1"
                - generic [ref=e94]:
                  - paragraph [ref=e95]: Waiting
                  - paragraph [ref=e96]: "2"
                - generic [ref=e97]:
                  - paragraph [ref=e98]: Confirmed
                  - paragraph [ref=e99]: "4"
                - generic [ref=e100]:
                  - paragraph [ref=e101]: Revenue
                  - paragraph [ref=e102]: $1,240
              - generic [ref=e103]:
                - generic [ref=e104]:
                  - generic [ref=e105]:
                    - heading "Today's Schedule" [level=4] [ref=e106]
                    - generic [ref=e107]: 4 appts
                  - generic [ref=e108]:
                    - generic [ref=e109]:
                      - generic [ref=e110]:
                        - generic [ref=e111]: 9:00
                        - generic [ref=e112]:
                          - paragraph [ref=e113]: James Wilson
                          - paragraph [ref=e114]: Adjustment
                      - generic [ref=e115]: with provider
                    - generic [ref=e116]:
                      - generic [ref=e117]:
                        - generic [ref=e118]: 9:30
                        - generic [ref=e119]:
                          - paragraph [ref=e120]: Lisa Park
                          - paragraph [ref=e121]: Massage — 60 min
                      - generic [ref=e122]: confirmed
                    - generic [ref=e123]:
                      - generic [ref=e124]:
                        - generic [ref=e125]: 10:00
                        - generic [ref=e126]:
                          - paragraph [ref=e127]: David Martinez
                          - paragraph [ref=e128]: Initial Consult
                      - generic [ref=e129]: confirmed
                    - generic [ref=e130]:
                      - generic [ref=e131]:
                        - generic [ref=e132]: 10:30
                        - generic [ref=e133]:
                          - paragraph [ref=e134]: Angela Thompson
                          - paragraph [ref=e135]: Group Class
                      - generic [ref=e136]: completed
                - generic [ref=e137]:
                  - generic [ref=e138]:
                    - heading "Waiting Room" [level=4] [ref=e139]
                    - generic [ref=e140]: 2 in queue
                  - generic [ref=e141]:
                    - generic [ref=e142]:
                      - generic [ref=e143]:
                        - generic [ref=e145]: L
                        - paragraph [ref=e146]: Lisa Park
                      - generic [ref=e147]:
                        - generic [ref=e148]: 8 min
                        - generic [ref=e149]: Waiting
                    - generic [ref=e150]:
                      - generic [ref=e151]:
                        - generic [ref=e153]: M
                        - paragraph [ref=e154]: Marcus Brown
                      - generic [ref=e155]:
                        - generic [ref=e156]: 3 min
                        - generic [ref=e157]: Waiting
              - generic [ref=e158]:
                - generic [ref=e159]:
                  - heading "Unconfirmed Appointments" [level=4] [ref=e161]
                  - generic [ref=e162]:
                    - generic [ref=e163]:
                      - generic [ref=e164]:
                        - paragraph [ref=e165]: Kevin Nguyen
                        - paragraph [ref=e166]: Today · 11:00 AM
                      - button "Confirm" [ref=e167] [cursor=pointer]
                    - generic [ref=e168]:
                      - generic [ref=e169]:
                        - paragraph [ref=e170]: Sandra Turner
                        - paragraph [ref=e171]: Today · 2:00 PM
                      - button "Confirm" [ref=e172] [cursor=pointer]
                - generic [ref=e173]:
                  - heading "Today's Revenue" [level=4] [ref=e174]
                  - paragraph [ref=e175]: $1,240
                  - paragraph [ref=e176]: +18% vs last Tuesday
        - generic [ref=e185]:
          - paragraph [ref=e186]: This is a live preview. Check in as a client on the Portal tab — you'll appear here instantly.
          - button "Switch to Client Portal →" [ref=e187] [cursor=pointer]
      - generic [ref=e189]:
        - generic [ref=e190]:
          - heading "Everything at a glance" [level=3] [ref=e192]
          - paragraph [ref=e193]: Schedule, waiting room, unconfirmed appointments, and live revenue — all on one screen.
        - generic [ref=e194]:
          - heading "Real-time waiting room" [level=3] [ref=e196]
          - paragraph [ref=e197]: When a client checks in from their phone, they appear in the queue instantly — no staff intervention.
        - generic [ref=e198]:
          - heading "Built for the front desk" [level=3] [ref=e200]
          - paragraph [ref=e201]: Configurable widget grid means each location shows exactly what their staff needs, nothing more.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Booking and Payment Processing Flows', () => {
  4  |   // Test the SaaS subscription payment flow (from the website)
  5  |   test('SaaS Subscription Payment Redirection', async ({ page }) => {
  6  |     // Navigate to the main website
  7  |     await page.goto('https://bridgeway-db29e-website.web.app/');
  8  | 
  9  |     // Click "Get Started" or scroll to pricing
  10 |     const pricingSection = page.locator('#pricing');
> 11 |     await expect(pricingSection).toBeVisible();
     |                                  ^ Error: expect(locator).toBeVisible() failed
  12 | 
  13 |     // Fill in the sign-up form in the Demo component (if it exists) or standard sign up
  14 |     const emailInput = page.locator('input[placeholder*="email" i], input[type="email"]').first();
  15 |     const orgInput = page.locator('input[placeholder*="organization" i], input[placeholder*="company" i], input[name="orgName"]').first();
  16 |     
  17 |     if (await emailInput.isVisible() && await orgInput.isVisible()) {
  18 |       await emailInput.fill('test@playwright.com');
  19 |       await orgInput.fill('Playwright Test Org');
  20 |       
  21 |       // Select the $300 tier
  22 |       const fullStackButton = page.locator('button', { hasText: '$300' }).first();
  23 |       if (await fullStackButton.isVisible()) {
  24 |         await fullStackButton.click();
  25 |       }
  26 | 
  27 |       // Check if Stripe Checkout session is triggered by monitoring network or navigation
  28 |       const [request] = await Promise.all([
  29 |         page.waitForRequest(req => req.url().includes('createCheckoutSession')),
  30 |         page.locator('button', { hasText: /subscribe|checkout|get started/i }).click()
  31 |       ]);
  32 |       expect(request.url()).toContain('createCheckoutSession');
  33 |     }
  34 |   });
  35 | 
  36 |   // Test the end customer booking flow
  37 |   test('Customer Booking Flow and Hold Payment', async ({ page }) => {
  38 |     // Navigate to the booking portal
  39 |     await page.goto('https://bridgeway-db29e-booking.web.app/');
  40 | 
  41 |     // Select a service (Assuming "Massage (60 Min)" exists from seed data)
  42 |     const serviceName = 'Massage (60 Min)';
  43 |     const serviceCard = page.locator(`text=${serviceName}`).first();
  44 |     
  45 |     // If the booking UI shows services first:
  46 |     if (await serviceCard.isVisible()) {
  47 |       await serviceCard.click();
  48 |       
  49 |       // Select a date
  50 |       // Click a date button in the calendar/date picker (e.g., tomorrow's date)
  51 |       const dateButton = page.locator('button.date-picker-day').nth(1); // just grab a date button
  52 |       if (await dateButton.isVisible()) {
  53 |         await dateButton.click();
  54 |       }
  55 | 
  56 |       // Select a time slot
  57 |       const timeSlot = page.locator('button.time-slot').first();
  58 |       if (await timeSlot.isVisible()) {
  59 |         await timeSlot.click();
  60 |       }
  61 | 
  62 |       // Fill in client details
  63 |       await page.fill('input[name="firstName"]', 'John');
  64 |       await page.fill('input[name="lastName"]', 'Doe');
  65 |       await page.fill('input[name="email"]', 'john.doe@example.com');
  66 |       
  67 |       // Confirm Booking
  68 |       const confirmButton = page.locator('button', { hasText: /confirm|book/i });
  69 |       await expect(confirmButton).toBeVisible();
  70 | 
  71 |       // If Stripe Connect hold is enabled, it should either navigate to Stripe or call createBookingHoldSession
  72 |       const [response] = await Promise.all([
  73 |         page.waitForResponse(res => res.url().includes('createBookingHoldSession') || res.status() === 200),
  74 |         confirmButton.click()
  75 |       ]);
  76 |       
  77 |       expect(response.ok()).toBeTruthy();
  78 |     }
  79 |   });
  80 | });
  81 | 
```