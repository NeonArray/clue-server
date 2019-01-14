const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../bin/www');

/* eslint-disable no-unused-vars */
const should = chai.should();
/* eslint-enable no-unused-vars */

chai.use(chaiHttp);

describe('Server', () => {
    afterEach(() => {
        server.close();
    });

    it('should return error if accessing from browser', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.statusCode.should.equal(404);
                res.error.should.exist;
                done();
            });
    });
});
