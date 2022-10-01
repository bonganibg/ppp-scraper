const fs = require('fs');
const puppeteer = require('puppeteer');

const scraper = async(fileName) => 
{        
    const products = [];
    const logger = [];

    const websiteComponents = readDataFromFile(fileName);

    for(const website of websiteComponents)
    {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
    
        const page = await browser.newPage();
    
        for(const currentCategory of website.links)
        {
            try
            {
                for(let i = 1; i <= currentCategory.pages; i++)
                {
                    let url = i > 1 ? currentCategory.url + website.format.replace("{}",i) : currentCategory.url;
                    url = url + currentCategory.filter.toString();                

                    await page.goto(url, {
                        waitUntil: 'domcontentloaded'
                    });
            
                    await page.waitForSelector(website.container);
                    const productListItem = await page.$$(website.item);
            
                    for (const item of productListItem)
                    {                    
                        try{
                            let name = item.$eval(website.name, prod => prod.textContent)
                            .catch(async (err) => {
                                logger.push(createErrorLogMessage(`Failed to load name for product in ${currentCategory.category} category from ${website.site}`,err));
                                name = "";
                            });
                            let price = item.$eval(website.price, prod => prod.textContent)
                            .catch(async (err) => {
                                logger.push(createErrorLogMessage(`Failed to load price for product in ${currentCategory.category} category from ${website.site}`,err));
                                price = 0;
                            });
                            let image = item.$eval(website.image, prod => prod.getAttribute('src'))
                            .catch((err) => {
                                logger.push(createErrorLogMessage(`Failed to load image for product in ${currentCategory.category} category from ${website.site}`,err));
                                image = "";
                            });

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
                        }                
                    }
                }
            }
            catch(error){
                logger.push(createErrorLogMessage(`Error working with page ${currentCategory.url} from the site ${website.name}`))
            }
        }
        await browser.close();
    }    

    writeLogsToFile(logger);
    return products;
}

const writeLogsToFile = (logs) => {
    //const fileName = './logs/logger.json';
    //const oldLogs = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    //logs = logs.concat(oldLogs);

    //fs.writeFileSync(fileName, logs, 'utf-8');

    console.log(logs)
}

const createErrorLogMessage = (message, error) => {
    const logError = {
        Type: "Error",
        Message: message,
        Class: "Scraper.js",
        PrintedError: error,
        OccuredOn: getDateTime()
    };

    return logError;
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
