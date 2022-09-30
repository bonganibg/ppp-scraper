const fs = require('fs');
const puppeteer = require('puppeteer');

const scraper = async(fileName) => 
{        
    const products = [];
    const websiteComponents = readDataFromFile(fileName);

    for(const website of websiteComponents)
    {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox']
        });
    
        const page = await browser.newPage();
    
        for(const currentCategory of website.links)
        {
            let url = currentCategory.url;
            await page.goto(url, {
                waitUntil: 'domcontentloaded'
            });
    
            await page.waitForSelector(website.container);
            const productListItem = await page.$$(website.item);
    
            for (const item of productListItem)
            {                    
                try{
                    let name = item.$eval(website.name, prod => prod.textContent);
                    let price = item.$eval(website.price, prod => prod.textContent);
                    let image = item.$eval(website.image, prod => prod.getAttribute('src'));                    

                    const prodInfo = {
                        Name: (await name).toString().trim(),
                        Price: (await price).toString().trim(),
                        Image: (await image).toString().trim(),
                        Site: website.site,
                        Category: currentCategory.category,
                        AddedAt: getDateTime()
                    };
        
                    products.push(prodInfo);
                }catch (error) {
                    console.log("ERROR LOADING PRODUCT INFORMATION");
                    console.log(error);
                }                
            }
        }
        await browser.close();
    }    
    return products;
}


const readDataFromFile =  (fileName) => {
    const filePath = `./websites/${fileName}.json`;
    const data = JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
    return data;
}

const getDateTime = () => {
    var today = new Date();
    today.setUTCHours(6);
    var dateTime = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}  h${today.getHours()}:m${today.getMinutes()}`;
    return dateTime;
}

module.exports = scraper;
