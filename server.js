const express = require('express');
const scraper = require('./scraper');

const test = require('./tester');

const productRepo = require('./repositories/productRepo');

const app = express();

app.get('/scrape', async (req, res) => {
    const fileName = req.query.file == undefined ? 'all' : req.query.file;

    const products = await scraper(fileName.toString());
    const response = productRepo(products);
    res.send(response);    
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Listening on port ${PORT}`);
});