const chai = require('chai');
const server = require('../bin/www');

/* eslint-disable no-unused-vars */
const should = chai.should();
/* eslint-enable no-unused-vars */

describe('Authenticate', () => {

    before(require('mongodb-runner/mocha/before'));
    after(require('mongodb-runner/mocha/after'));

    it('should reject the promise if no user is found', (done) => {
        process.env.NODE_ENV = 'production';

        chai.request(server)
            .get('/api/v1/event')
            .set('x-auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTJlZjkyM2Y2YTBiNDA4ZGE2ZDgwZTgiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTEzMDI3ODc1fQ.up0pNSLMaTSjXVfkne-YXEoTmAGd4RzgM4zOmOORRhg')
            .end((err) => {
                err.status.should.equal(401);
                done();
            });
    });
});
