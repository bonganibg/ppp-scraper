const mongoose = require('mongoose');

const stringParams = {type: String, required: true};

const logger = mongoose.Schema({
    Type: stringParams,
    Message: stringParams,
    Class: stringParams,
    PrintedError: stringParams,
    OccuredOn: stringParams
});

module.exports = mongoose.model('Logger', logger);