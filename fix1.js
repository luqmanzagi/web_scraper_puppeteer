const puppeteer = require("puppeteer");
const tld = require("tldts");
const fs = require("fs");

async function main() {
    const browser = await puppeteer.launch({headless: 'false'});
    const page = await browser.newPage();
    const urlPath = "https://amazon.com";
    await page.goto(urlPath);
    console.log(`Opened ${urlPath}`);
    console.log("##################################");

    //extract href from all anchor tags
    const listLink = await page.$$eval("a", as => as.map(a => a.href));
    const listLinkUnique = [...new Set(listLink)];
    // console.log(listLink);
    // console.log('--------------------------------)
    console.log(listLinkUnique.length)

    //loop through links and print them
    let pagePromise = (link) => new Promise(async(resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        await newPage.goto(link);

        // const element = await page.waitForSelector('href');
        // await element.click();
        //take title and href of current page
        dataObj.title = await newPage.title();
        dataObj.href = await newPage.url();
        resolve(dataObj);
        await newPage.close();
    });


    for(let links of listLinkUnique){
  
        // console.log(`check ${links}`);
        if (tld.getDomain(links) && tld.getDomain(links) === tld.getDomain(urlPath)) {
            // const targetLink = await page.$(`a[href="${links}"]`);
            // console.log(links)
            // console.log(typeof links)
            let pageData = await pagePromise(links);
            console.log(pageData);

            // fs.appendFileSync("data2.json", JSON.stringify(clickData) + "\n");
        }
    }

    await browser.close();
}

main();
