const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.type(), msg.text(), msg.location().url);
  });
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  console.log('--- Admin ---');
  await page.goto('https://bridgeway-db29e-admin.web.app', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'admin.png' });
  await page.waitForTimeout(2000);
  
  console.log('--- Dashboard ---');
  await page.goto('https://bridgeway-db29e-dashboard.web.app', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'dashboard.png' });
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
