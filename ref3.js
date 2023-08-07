//https://github.com/puppeteer/puppeteer/issues/3718

const puppeteer = require('puppeteer');

(async () => {
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
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    
    await page.goto('https://amazon.com')
    
    // Click on link with middle button to open in new browser tab
    await page.click('a[href]', { button : 'middle' })
    
    // Wait for new tab and return a page instance
    const newPage = await getNewBrowserTab(browser)
    
    // Switch to new tab
    await newPage.bringToFront()
    
    // Wait a bit to see the page
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(await newPage.url())
    await newPage.close()
    await page.close()
    await browser.close()
  
})();