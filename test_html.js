const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://bridgeway-db29e-admin.web.app', { waitUntil: 'networkidle' });
  const html = await page.content();
  console.log('--- Admin HTML ---');
  console.log(html);
  
  await browser.close();
})();
