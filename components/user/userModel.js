const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const SALTY = process.env.SALT || 'abc123';

// Setting secret to required breaks the application
// this appears to occur because of the 'pre' hook that
// encrypts the secret into a hash.
const UserSchema = new mongoose.Schema({
    client: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    secret: String,
    tokens: {
        access: String,
        token: String,
    },
});


/**
 * Generate an authentication token.
 *
 * @returns {Promise}
 */
UserSchema.methods.generateAuthToken = function generateAuthToken() {
    const access = 'auth';
    const token = jwt.sign({
        _id: this._id.toHexString(),
        access,
    }, SALTY).toString();

    this.tokens.token = token;
    this.tokens.access = access;

    return this.save().then(() => token);
};


/**
 * Find a token.
 *
 * @param token
 * @returns {*}
 */
UserSchema.statics.findByToken = function findByToken(token) {
    let decoded;

    try {
        decoded = jwt.verify(token, SALTY);
    } catch (e) {
        return Promise.reject();
    }

    return this.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    });
};


/**
 * Return an object in JSON format.
 *
 * @returns {*}
 */
UserSchema.methods.toJSON = function toJSON() {
    return _.pick(this.toObject(), ['client', 'username']);
};


/**
 * Execute a hash on the password prior to saving the document.
 *
 * @param next function The express next callback.
 */
UserSchema.pre('save', function cb(next) {

    if (this.isModified('secret')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this.secret, salt, (error, hash) => {
                this.secret = hash;
                next();
            });
        });
    } else {
        next();
    }

});

module.exports = mongoose.model('User', UserSchema);
