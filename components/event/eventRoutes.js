const authenticate = require('../middleware/authenticate');
const event = require('./eventController');


module.exports = function eventRoutes(app) {

    /**
     * @api {get} /event Get a list of all events.
     * @apiName GetEvents
     * @apiGroup Event
     *
     * @apiParam {int} LIMIT The limit of results to retrieve. Defaults to 50.
     * @apiParam {string} WHERE A date string to start results from. This is used
     *                    for pagination in conjunction with the 'x-pagination-index'
 *                        header value.
     * @apiParam {string} SORT Sorting option, this can either be '-date' for
     *                    ascending date or 'date' for descending by date.
     *
     * @apiSuccess {Array} events Array of objects containing events.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [{
     *        "_id": "5a0ddbb4e3091c00140d0fcc",
     *        "logger": "ClueUserLogger",
     *        "level": "info",
     *        "date": "2017-11-16 18:40:52",
     *        "message": "Logged out",
     *        "occasionsID": "df26d5624f78966994b38897554e855b",
     *        "initiator": "other",
     *        "client": "leapfrogjump.com",
     *        "__v": 0,
     *        "meta": [
     *            {
     *                "_message_key": "user_logged_out",
     *                "_server_remote_addr": "109.173.37.54",
     *                "_server_http_referer": "http://leapfrogjump.com/wp-login.php"
     *            }
     *        ]
     *    }
     *    ...
     *    ]
     *
     * @apiError NotFound No events found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "NotFound",
     *       "message": "An event with that ID could not be found."
     *       "errorCode": 404
     *     }
     *
     * @apiVersion 1.0.0
    */
    app.get('/api/v1/event', authenticate, event.findAllEvents);


    /**
     * @api {get} /event/:id Get an event item based on an ID.
     * @apiName GetEvent
     * @apiGroup Event
     *
     * @apiSuccess {Array} event Array of objects containing events.
     * @apiParam {String} id Event unique ID.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "_id": "5a0ddbb4e3091c00140d0fcc",
     *          "logger": "ClueUserLogger",
     *          "level": "info",
     *          "date": "2017-11-16 18:40:52",
     *          "message": "Logged out",
     *          "occasionsID": "df26d5624f78966994b38897554e855b",
     *          "initiator": "other",
     *          "client": "leapfrogjump.com",
     *          "__v": 0,
     *          "meta": [
     *              {
     *                  "_message_key": "user_logged_out",
     *                  "_server_remote_addr": "109.173.37.54",
     *                  "_server_http_referer": "http://leapfrogjump.com/wp-login.php"
     *              }
     *          ]
     *      }
     *
     * @apiError NotFound No events found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "NotFound",
     *       "message": "An event with that ID could not be found."
     *       "errorCode": 404
     *     }
     *
     * @apiVersion 1.0.0
     */
    app.get('/api/v1/event/:id', authenticate, event.findEventById);


    /**
     * @api {post} /event Post an event.
     * @apiName PostEvent
     * @apiGroup Event
     *
     * @apiSuccess {Array} success The event object.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "logger": "ClueUserLogger",
     *        "level": "info",
     *        "date": "2017-11-16 18:40:52",
     *        "message": "Logged out",
     *        "occasionsID": "df26d5624f78966994b38897554e855b",
     *        "initiator": "other",
     *        "client": "leapfrogjump.com",
     *        "meta": [
     *            {
     *                "_message_key": "user_logged_out",
     *                "_server_remote_addr": "109.173.37.54",
     *                "_server_http_referer": "http://leapfrogjump.com/wp-login.php"
     *            }
     *        ]
     *    }
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
    app.post('/api/v1/event', authenticate, event.addEvent);

};
