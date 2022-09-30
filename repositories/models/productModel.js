const mongoose = require('mongoose');

const stringParams = {type: String, required: true};

const products = mongoose.Schema({
    Name: stringParams,
    Price: stringParams,
    Image: stringParams,
    Site: stringParams,
    Category: stringParams,
    AddedAt: stringParams
});

module.exports = mongoose.model('Products', products);