const Products = require('./models/productModel');
const database = require('./database');

const writeToDatabase = (data) => 
{
    // Connect to the MongoDB Database
    database();

    data.forEach(item => {
        new Products(item).save()
        .then((results) => {
            console.log("Data saved");
        })
        .catch((err) => {
            console.log(err);
        });
    });
    
    return "Done";
};

module.exports = writeToDatabase;