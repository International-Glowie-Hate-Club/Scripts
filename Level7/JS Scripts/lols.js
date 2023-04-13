const playwright = require('playwright-extra')
const iPhone = playwright.devices['iPhone 12'];


playwright.webkit.launch({headless: true}).then(async browser => {
  const context = await browser.newContext({
    ...iPhone
  });
  const page = await context.newPage();
  const getUA = await page.evaluate(() => navigator.userAgent);
  console.log(getUA);
  await page.goto('https://bxv.gg/headless')
  await page.waitForTimeout(5000)
  await page.screenshot({ path: 'wk12.png', fullPage: true })
  console.log(`All done, check the screenshot. ✨`)
})
playwright.firefox.launch({headless: true}).then(async browser => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const getUA = await page.evaluate(() => navigator.userAgent);
  console.log(getUA);
  await page.goto('https://dev.dststx.xyz')
  await page.waitForTimeout(5000)
  await page.screenshot({ path: 'ff.png', fullPage: true })
  console.log(`All done, check the screenshot. ✨`)
})
