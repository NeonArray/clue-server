const User = require('./userModel');
const _ = require('lodash');
const { ApplicationError } = require('../middleware/errorHandler');
const Mr = require('../helpers/validation');


module.exports.filterPostBody = function filterPostBody(req, res, next) {
    const body = _.pick(req.body, ['client', 'username', 'secret']);

    if (!body.client || !body.username || !body.secret) {
        next(new ApplicationError(400, 'Missing required params (client, username, secret)', true));
        return;
    }

    req.body = {
        client: Mr.clean.URIstring(body.client),
        username: Mr.clean.stringWithUnderscores(body.username),
        secret: Mr.clean.string(body.secret),
    };

    next();
};


/**
 * Register a new API key/user.
 *
 * @param req object The express request object.
 * @param res object The express response object.
 * @param next function The express next function.
 */
module.exports.addUser = function addUser(req, res, next) {
    const user = new User(req.body);

    user
        .save()
        .then(() => user.generateAuthToken())
        .then((token) => {
            res.header('x-auth', token).send(user);
            next();
        });
};


/**
 * Retrieve all registered API keys
 *
 * @param req object The express request object.
 * @param res object The express response object.
 * @param next function The express next function.
 */
module.exports.findAllUsers = function findAllUsers(req, res, next) {
    const queries = _.pick(req.query, ['client', 'username']) || {};

    User
        .find(queries)
        .then((events) => {
            const body = _.uniq(events.map(i => ({
                'client': i._doc.client,
                'username': i._doc.username,
                'token': i._doc.tokens[0].token,
            })));

            res.send(body);
            next();
        });
};
