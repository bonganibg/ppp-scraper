const Products = require('./models/productModel');

const writeToDatabase = (data) => 
{
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