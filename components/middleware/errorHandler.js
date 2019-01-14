
/**
 *
 * @param status int Status code (400, 401, 403, 404, 500).
 * @param message string Error message.
 * @param isOperational bool Is the error operational or programmer.
 * @constructor
 */
function ApplicationError(status = 500, message = '', isOperational = true) {
    Error.call(this);
    Error.captureStackTrace(this);

    this.status = status;
    this.message = message;
    this.isOperational = isOperational;
}

ApplicationError.prototype = Object.getPrototypeOf(Error);

module.exports = {
    ApplicationError,
};
