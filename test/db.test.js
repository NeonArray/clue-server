const chai = require('chai');
const { mongoose } = require('../db/mongoose');

/* eslint-disable no-unused-vars */
const should = chai.should();
/* eslint-enable no-unused-vars */

describe('DB', () => {

    it('should set the mongo URI to localhost in NODE_ENV === "test"', () => {
        mongoose.connections[0].host.should.equal('localhost');
    });
});
