const Logger = require('./models/loggingModel');

const logger = (data) => {
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