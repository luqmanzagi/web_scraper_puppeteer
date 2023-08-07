const puppeteer = require('puppeteer');
const tld = require('tldts');

(async () => {
    function asyncProcess() {
  return new Promise((resolve, reject) => {
    asycronouseProcess(()=>{
      resolve();
    })
  })
}

    async function getNewBrowserTab(browser) {
        let resultPromise
    
        async function onTargetcreatedHandler(target) {
            if (target.type() === 'page') {
                const newPage = await target.page()
                const newPagePromise = new Promise(y =>
                    newPage.once('domcontentloaded', () => y(newPage))
                )
    
                const isPageLoaded = await newPage.evaluate(
                    () => document.readyState
                )
    
                browser.off('targetcreated', onTargetcreatedHandler) // unsubscribing
    
                return isPageLoaded.match('complete|interactive')
                    ? resultPromise(newPage)
                    : resultPromise(newPagePromise)
            }
        }
    
        return new Promise(resolve => {
            resultPromise = resolve
            browser.on('targetcreated', onTargetcreatedHandler)
        })
    }
    
    // Using
    const browser = await puppeteer.launch({ devtools: true })
    const page = await browser.newPage();
    urlPath = 'https://amazon.com';
    
    await page.goto(urlPath);

    const listLink = await page.$$eval("a", as => as.map(a => a.href));
    const listLinkUnique = [...new Set(listLink)];
    // let promList = [];
    // console.log(listLinkUnique);
    for (let link of listLinkUnique) {
        console.log(link)
        if (tld.getDomain(link) !== tld.getDomain(urlPath)){
            continue
        }
        let selec = 'a[href="' + link + '"]';
        console.log (selec)
        console.log("--------")
        // Click on link with middle button to open in new browser tab
        try{
            debugger;
            // await page.waitForSelector(selec);
            await page.click(selec, { button : 'middle' })
            // Wait for new tab and return a page instance
            const newPage = await getNewBrowserTab(browser)
            
            // Switch to new tab
            await newPage.bringToFront()
            
            // Wait a bit to see the page
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log(await newPage.url())
            console.log('***********************')
            await newPage.close()
            }catch(err){console.error(err)};    
    }
    await page.close()
    await browser.close()
  
})();