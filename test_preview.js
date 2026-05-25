const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('response', response => {
    console.log(`RESP: ${response.status()} ${response.headers()['content-type']} ${response.url()}`);
  });
  
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.type(), msg.text());
  });
  
  console.log('--- Admin Preview ---');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  
  await browser.close();
})();
