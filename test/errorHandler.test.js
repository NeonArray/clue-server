const chai = require('chai');
const { ApplicationError } = require('../components/middleware/errorHandler');

const { expect } = chai;

/* eslint-disable no-unused-vars */
const should = chai.should();
/* eslint-enable no-unused-vars */

describe('errorHandler', () => {

    it('should export ApplicationError function', () => {
        expect(ApplicationError).to.be.a('function');
    });

    it('should throw an error', () => {
        const error = () => { throw new ApplicationError(400, '', true); };
        expect(error).to.throw();
    });

    it('should throw an 404 error', () => {
        const error = new ApplicationError(400, '', true);
        error.should.be.a('object');
    });

    it('should set isOperational to true', () => {
        const error = new ApplicationError(400, '', true);
        error.isOperational.should.equal(true);
    });

    it('should set a message', () => {
        const error = new ApplicationError(400, 'Test message.', true);
        error.message.should.equal('Test message.');
    });

    it('should set a status code of 400', () => {
        const error = new ApplicationError(400, '', true);
        error.status.should.equal(400);
    });

    it('should default in the absence of arguments', () => {
        const error = new ApplicationError();
        error.status.should.equal(500);
        error.message.should.equal('');
        error.isOperational.should.equal(true);
    });
});
