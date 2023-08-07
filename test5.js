const puppeteer = require('puppeteer');

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
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    
    await page.goto('https://amazon.com')

    const listLink = await page.$$eval("a", as => as.map(a => a.href));
    const listLinkUnique = [...new Set(listLink)];
    let promList = [];
    console.log(listLinkUnique.length);
    for (let link of listLinkUnique) {
        console.log(link)
        // if (link !== ""){
        //     continue
        // }
        let selec = 'a[href="' + link + '"]';
        console.log (selec)
        console.log("--------")
        // Click on link with middle button to open in new browser tab
        // try{
        //     await page.click(selec, { button : 'middle' })

        // }catch(err){console.error(err)};
        
        // // Wait for new tab and return a page instance
        // const newPage = await getNewBrowserTab(browser)
        
        // // Switch to new tab
        // await newPage.bringToFront()
        
        // // Wait a bit to see the page
        // await new Promise(resolve => setTimeout(resolve, 1000))
        // console.log(await newPage.url())
        // await newPage.close()
    }


    await page.close()
    await browser.close()
  
})();