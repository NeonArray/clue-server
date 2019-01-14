const express = require('express');
const winston = require('winston');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('./db/mongoose');

const app = express();
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' }),
    ]
});

app.use(bodyParser.json({
    type: "*/*",
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
app.use(compression());

app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,X-auth');
    next();
});


// Define routes
// These MUST come after all app configurations or else they get fucked up.
// Reference: https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
require('./components/event/eventRoutes.js')(app);
require('./components/user/userRoutes.js')(app);


// Error handler middleware
app.use((err, req, res, next) => {

    logger.error(err);

    if (!err.isOperational) {
        // This is a programmer error and we need to do something special with it
        // probably send an email and a slack notification.
    }

    res.status(err.status).json({
        status: err.status,
        message: err.message,
    });
});

module.exports = app;
