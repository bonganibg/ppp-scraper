const Logger = require('./models/loggingModel');
const database = require('./database');

const logger = (data) => {
    database();

    data.forEach(log => {
        new Logger(log).save()
        .then(() => {
            console.log("Updated Log")
        })
        .catch((err) => {
            console.log(err);
        });
    });

    return "Logger Done"
};

module.exports = logger;