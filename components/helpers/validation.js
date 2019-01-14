const moment = require('moment');


/**
 *
 * @type {{
 *      string: exports.clean.string,
 *      stringWithUnderscores: exports.clean.stringWithUnderscores,
 *      URIstring: exports.clean.URIstring,
 *      int: exports.clean.int}}
 */
module.exports.clean = {

    /**
     * Sanitize and format a string.
     *
     * @param str string The string to format.
     * @returns {*}
     */
    string: function string(str) {
        if (!str) {
            return undefined;
        }

        const strCopy = String(str);
        return strCopy.replace(/\W/g, '').toLowerCase();
    },

    /**
     * Sanitize and format a string with dashes.
     *
     * @param str string The string to format.
     * @returns {*}
     */
    stringWithDash: function stringWithDash(str) {
        if (!str) {
            return undefined;
        }

        const strCopy = String(str);
        return strCopy.replace(/[^\-\w]+/g, '').toLowerCase();
    },

    /**
     * Sanitize and format a string into ISO format.
     *
     * @param str string The datetime string.
     * @returns {*}
     */
    dateString: function dateString(str) {
        if (!str) {
            return undefined;
        }

        const strCopy = String(str);
        const ISORegexPattern = new RegExp(/^(\d{4})(-(\d{2}))??(-(\d{2}))??(T(\d{2}):(\d{2})(:(\d{2}))??(\.(\d+))??(([\+\-]{1}\d{2}:\d{2})|Z)??)??$/, 'i');

        return (ISORegexPattern.test(strCopy) ? moment(strCopy).toISOString() : undefined);
    },

    /**
     * Sanitize and format a string with underscores.
     *
     * @param str string The string to format.
     * @returns {*}
     */
    stringWithUnderscores: function stringWithUnderscores(str) {
        if (!str) {
            return undefined;
        }

        const strCopy = String(str);
        return strCopy.replace(/\s+/g, '_').replace(/[^\w]/g, '').toLowerCase();
    },

    /**
     * Sanitize and format a string that has URI components.
     *
     * @param str string The string to format.
     * @returns {*}
     * @constructor
     */
    URIstring: function stringWithSpaces(str) {
        if (!str) {
            return undefined;
        }

        const isEncodedString = (uri) => {
            const URI = uri || '';
            return URI !== decodeURIComponent(URI);
        };
        let strCopy = String(str);

        if (isEncodedString(strCopy)) {
            strCopy = decodeURIComponent(strCopy);
        }

        return strCopy.replace(/[^\w\s]/g, '').toLowerCase();
    },

    /**
     * Format and sanitize an integer.
     *
     * @param num The integer to sanitize.
     * @returns {*}
     */
    int: function int(num) {
        if (!num) {
            return undefined;
        }

        const numCopy = String(num);
        return parseInt(numCopy.replace(/^[_\W]+/g, ''), 10);
    },
};
