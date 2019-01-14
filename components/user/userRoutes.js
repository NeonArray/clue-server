const authenticate = require('../middleware/authenticate');
const user = require('./userController');


module.exports = function userRoutes(app) {

    /**
     * @api {post} /register Register a new user/client.
     * @apiName Register
     * @apiGroup User
     *
     * @apiParam {string} username The username for the account. Lowercase alphanumeric
     *                             characters and underscores only.
     * @apiParam {string} client The name or alias of the client. Lowercase alphanumeric
     *                           characters and spaces only.
     * @apiParam {string} secret An arbitrary password. Lowercase alphanumeric characters only.
     *
     * @apiSuccess {Object} username The username that was registered.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "client": "the jump agency",
     *          "username": "the_jump_agency"
     *      }
     *
     *
     * @apiError InvalidRequest No events found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "InvalidRequest",
     *       "message": "Data is missing required properties or values."
     *       "errorCode": 404
     *     }
     *
     * @apiVersion 1.0.0
     */
    app.post('/api/v1/register', user.filterPostBody, user.addUser);


    /**
     * @api {get} /user Get a list of all clients/users.
     * @apiName User
     * @apiGroup User
     *
     * @apiSuccess {Array} users Array of all registered users.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *       [
     *          {
     *              "client": "The Jump Agency",
     *              "username": "thejumpagency",
     *              "token": "abc.abc.abc"
     *          }
     *          ...
     *       ]
     *
     * @apiError NotFound No users found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "NotFound",
     *       "message": "No users found."
     *       "errorCode": 404
     *     }
     *
     * @apiVersion 1.0.0
     */
    app.get('/api/v1/user', authenticate, user.findAllUsers);

};
