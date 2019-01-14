const mongoose = require('mongoose');

const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/ClueLogs';

mongoose.Promise = global.Promise;

const promise = mongoose.connect(mongoURL, {
    useMongoClient: true,
});

module.exports = {
    mongoose,
};
