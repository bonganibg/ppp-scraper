const mongoose = require('mongoose');

var localDB = "mongodb://localhost:27017/testing-ppp";
var cloudDB = "mongodb+srv://Alphabg:rgRwyC6vNZVuftUD@maincluster.o7kgh.mongodb.net/?retryWrites=true&w=majority"

const connectDatabase = () => {
    mongoose.connect(cloudDB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Database Connected");
    })
    .catch((error) => {
        console.log(error);
    });
}

module.exports = connectDatabase;
