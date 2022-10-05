const { response } = require('express');
const express = require('express');
const router = express.Router();

const Product = require('../models/productModel');

router.get('', (req, res) => {    
    Product.find()
    .limit(2000)
    .then(async (response) => {
        await deleteProducts(response);

        res.status(200).json({
            message: "Products retreived",
            products: response
        })
    })    
    .catch((error) => {
        console.log(error);
        res.status(400).json({
            error: error
        });
    });
});

const deleteProducts = (data) => {
    data.forEach(item => {
        Product.deleteOne({_id: item._id})
        .then((result) => {
            console.log(`deleted ${result}`);
        })
    });
}

module.exports = router;