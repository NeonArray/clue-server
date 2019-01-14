const mongoose = require('mongoose');
const Event = require('./eventModel');
const { ObjectID } = require('mongodb');
const { ApplicationError } = require('../middleware/errorHandler');
const Mr = require('../helpers/validation');
const _ = require('lodash');

/**
 * Create an array of event ID's
 *
 * @param events array The array of events.
 */
function createEventIDs(events) {

    if (Array.isArray(events)) {
        return events.map(i => i.id);
    }

    return events.id;
}


/**
 * Create an error report.
 *
 * @param err object The error object.
 * @returns {Array}
 */
function createErrorReport(err) {
    const errors = [];

    _.forOwn(err.errors, (value) => {
        errors.push(value.message);
    });

    return errors;
}

/**
 * Return all events found in database.
 *
 * @param req object The express request object.
 * @param res object The express response object.
 * @param next function The express next function.
 */
module.exports.findAllEvents = function findAllEvents(req, res, next) {
    const LIMIT = Mr.clean.int(req.query.LIMIT) || 50;
    const OFFSET = Mr.clean.int(req.query.OFFSET) || 0;
    const WHERE = Mr.clean.dateString(req.query.WHERE) || undefined;
    const SORT = Mr.clean.stringWithDash(req.query.SORT) || '';
    let query = {};

    // This is for pagination purposes.
    if (WHERE) {
        query = { date: { $lte: WHERE } };
    }

    Event
        .find(query)
        .skip(OFFSET)
        .limit(LIMIT)
        .sort(SORT)
        .exec((err, events) => {

            if (err || !events || !events.length) {
                next(new ApplicationError(404, 'No events found.', true));
                return;
            }

            // Create an index for pagination by accessing the last item in the returned events
            // array. Then pass this as a header that can be used to set the starting point for
            // the next request.
            const index = events[events.length - 1].date;
            res.header('x-paginated-index', index).status(200).send(events);
            next();
        });
};


/**
 * Find an event by its ID.
 *
 * @param req object The express request object.
 * @param res object The express response object.
 * @param next function The express next function.
 */
module.exports.findEventById = function findEventById(req, res, next) {
    const ID = Mr.clean.string(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(ID)) {
        next(new ApplicationError(422, 'The resource ID is of an incorrect length, should be 12 or 24 characters.', true));
        return;
    }

    Event.findOne({
        '_id': new ObjectID(ID),
    }).then((logItem) => {

        if (!logItem) {
            next(new ApplicationError(404, 'An event with that ID could not be found.', true));
            return;
        }

        res.status(200).send(logItem);
        next();
    });
};


/**
 * Add a new event.
 *
 * @param req object The express request object.
 * @param res object The express response object.
 * @param next function The express next function.
 */
module.exports.addEvent = function addEvent(req, res, next) {
    //
    // The create method is a shortcut for saving an array of documents
    // Event.create is the same as `new Event(req.body).save()
    //
    // source: http://mongoosejs.com/docs/api.html#model_Model-create
    //
    Event.create(req.body, (err, events) => {

        //
        // When the `return` statement is missing, the app crashes throwing a "Can't set headers
        // after they are sent" error. The solution is to return after calling next(), which is
        // interesting because next should be terminating the execution.
        //
        // source: https://stackoverflow.com/questions/26307920/res-json-cant-set-headers-after-they-are-sent
        //
        if (err) {
            next(new ApplicationError(400, createErrorReport(err), true));
            return;
        }

        res.status(200).send({
            success: 'Success',
            id: createEventIDs(events),
        });
        next();
    });
};
