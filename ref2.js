//https://github.com/puppeteer/puppeteer/issues/6235
const puppeteer = require('puppeteer');

(async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const [page] = await browser.pages();

    await page.goto('https://amazon.com');

    const link = await page.$('a[href]');

    const [target] = await Promise.all([
      new Promise(resolve => browser.once('targetcreated', resolve)),
      link.click({ button: 'middle' }),
    ]);

    const newPage = await target.page();
    await newPage.bringToFront();
  } catch (err) {
    console.error(err);
  }
})();