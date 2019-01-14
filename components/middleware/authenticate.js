/* eslint-disable consistent-return */

const User = require('../user/userModel');
const { ApplicationError } = require('./errorHandler');

/**
 * Authenticate a request.
 *
 * @param req object The express request object.
 * @param res object The express response object.
 * @param next function The express next callback.
 */
module.exports = function authenticate(req, res, next) {
    const token = req.header('x-auth');

    if (!token) {
        next(new ApplicationError(401, 'Unauthorized Access: API Token Required', true));
    }

    User
        .findByToken(token)
        .then((user) => {

            if (!user) {
                return Promise.reject();
            }

            req.user = user;
            req.token = token;
            next();
        })
        .catch(() => next(new ApplicationError(401, 'Unauthorized Access: API Token Invalid', true)));
};
