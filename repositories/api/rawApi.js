const express = require('express');
const router = express.Router();

const Product = require('../models/productModel');
const database = require('../database');

database();

router.get('', (req, res) => {    
    Product.find()
    .limit(10)
    .then((response) => {
        res.status(200).json({
            message: "Products retreived",
            products: response
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(400).json({
            error: error
        });
    });
});

module.exports = router;