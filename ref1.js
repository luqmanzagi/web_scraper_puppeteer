//https://github.com/gregkop/atx-nodejs-serverless-puppeteer-examples/blob/944e1a30bf5da286fd0bb71313813c80579eca74/web_scraping/web_scraping_02.js

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://news.ycombinator.com/', {"waitUntil" : "networkidle0"});
  
  const articles =  await page.$$eval("a", as => as.map(a => a.href));
  
  await Promise.all(articles.map(async article => {
    const tab = await browser.newPage();
    try {
      await tab.goto(article, {"waitUntil" : "networkidle0"})
    //   await tab.screenshot({path: `./screenshots/${article.split('/').slice(-1)[0]}.png`});
    let dataObj = {};
    dataObj.title = await tab.title();
    dataObj.href = await tab.url();
    console.log(dataObj)
    } catch(err) { /* Whoops! */ }
    
    await tab.close()
  }))
  
  await browser.close();
})();