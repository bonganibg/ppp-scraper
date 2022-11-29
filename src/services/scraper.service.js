const fs = require('fs');
const puppeteer = require('puppeteer');
const ProductRepo = require('../repositories/product.repo');

class Scraper {
    
    constructor(fileName){
        this.websiteComponents = this.readDataFromFile(fileName);
    }

    async scrapeWebsites(){

        
        for(const website of this.websiteComponents)
        {            
            this.browser = await this.launchPuppeteer();    
            this.page = await this.browser.newPage();
            await this.workWithCategory(website).finally(async () => {
                await this.browser.close();
            })
        }        
        
    }

    async launchPuppeteer(){
        return await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox']
        });
    }

    async workWithCategory(website){
        for (const category of website.links){            
            await this.workWithPages(category, website);
        } 
    }

    async workWithPages(category, website){
        for(let i = 1; i <= category.pages; i++)
        {
            let url = i > 1 ? category.url + website.format.replace('{}',i) : category.url;
            url = url + category.filter.toString();

            await this.page.goto(url, {
                waitUntil: 'domcontentloaded'
            });

            await this.page.waitForSelector(website.container);

            await this.workWithListItems(website, category);
        }
    }

    async workWithListItems(website, category){
        const listItem = await this.page.$$(website.item);        
        for(const item of listItem)
        {            
            let name = item.$eval(website.name, prod => prod.textContent) || "";
            let price = item.$eval(website.price, prod => prod.textContent) || 0;
            let image = item.$eval(website.image, prod => prod.getAttribute('src')) || "";              

            await this.writeProductToDatabase(name, price, image, website, category);
        }
    }

    async writeProductToDatabase(name, price, image, website, category){        
        const product = await {
            Name: (await name).toString().trim(),
            Price: (await price).toString().trim(),
            Image: (await image).toString().trim(),
            Site: website.site,
            Category: category.category,
            Link: "none".toString(),
            Added: Date.now()
        };       

        let productRepo = new ProductRepo();
        await productRepo.writeProduct(product).then(() => {
            console.log(`${product.Name} Added`);
        })
        .catch((error) => {
            console.log(`Error writing ${product.Name}`);
        })        
    }

    readDataFromFile(fileName){
        let filePath = `./resources/${fileName}.json`;
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return data;
    }

}


module.exports = Scraper;