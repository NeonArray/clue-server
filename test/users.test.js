const User = require('../components/user/userModel');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../bin/www');

/* eslint-disable no-unused-vars */
const should = chai.should();
/* eslint-enable no-unused-vars */

let API_KEY = '';
chai.use(chaiHttp);


describe('User', () => {

    before(require('mongodb-runner/mocha/before'));
    after(require('mongodb-runner/mocha/after'));

    // Clear the Users collection after tests have completed.
    after((done) => {
        User.remove({}, () => {
            done();
        });
    });


    describe('/POST user', () => {

        // Clear the Users collection after tests have completed.
        after((done) => {
            User.remove({}, () => {
                done();
            });
        });

        const newUser = {
            username: 'Mocha',
            secret: 'MochaSecret',
            client: 'Mocha Test Runner',
        };


        it('should POST a new user', (done) => {
            chai.request(server)
                .post('/api/v1/register')
                .send(newUser)
                .end((err, res) => {
                    res.body.should.exist;
                    res.should.have.status(200);
                    res.body.should.have.property('client');
                    res.body.should.have.property('username');
                    res.header.should.be.a('object');
                    res.header.should.have.property('x-auth');
                    res.header['x-auth'].should.be.a('string');
                    done();
                });
        });


        it('should reject a new user if username is missing', (done) => {
            const userMissingUsername = {
                secret: 'MochaSecret',
                client: 'Mocha Test Runner',
            };

            chai.request(server)
                .post('/api/v1/register')
                .send(userMissingUsername)
                .end((err, res) => {
                    res.body.should.exist;
                    res.should.have.status(400);
                    res.body.should.have.property('status');
                    res.body.status.should.equal(400);
                    res.body.should.have.property('message');
                    done();
                });
        });


        it('should replaces spaces with underscores in the username field', (done) => {
            const dashedUsername = {
                secret: 'MochaSecret',
                client: 'Mocha Test Runner',
                username: 'the jump agency',
            };

            chai.request(server)
                .post('/api/v1/register')
                .send(dashedUsername)
                .end((err, res) => {
                    res.body.should.exist;
                    res.should.have.status(200);
                    res.body.should.have.property('username');
                    res.body.username.should.equal('the_jump_agency');
                    done();
                });
        });


        it('should filter html out in the username field', (done) => {
            const dashedUsername = {
                secret: 'MochaSecret',
                client: 'Mocha Test Runner',
                username: '<script>alert("test");</script>the jump agency',
            };

            chai.request(server)
                .post('/api/v1/register')
                .send(dashedUsername)
                .end((err, res) => {
                    res.body.should.exist;
                    res.should.have.status(200);
                    res.body.should.have.property('username');
                    res.body.username.should.equal('scriptalerttestscriptthe_jump_agency');
                    done();
                });
        });


        it('should allow spaces in the client field', (done) => {
            const dashedUsername = {
                secret: 'MochaSecret',
                client: 'Mocha Test Runner',
                username: 'the jump agency',
            };

            chai.request(server)
                .post('/api/v1/register')
                .send(dashedUsername)
                .end((err, res) => {
                    res.body.should.exist;
                    res.should.have.status(200);
                    res.body.should.have.property('username');
                    res.body.client.should.equal('mocha test runner');
                    done();
                });
        });


        it('should reject a new user if client is missing', (done) => {
            const userMissingUsername = {
                username: 'Mocha',
            };

            chai.request(server)
                .post('/api/v1/register')
                .send(userMissingUsername)
                .end((err, res) => {
                    res.body.should.exist;
                    res.should.have.status(400);
                    res.body.should.have.property('status');
                    res.body.status.should.equal(400);
                    res.body.should.have.property('message');
                    done();
                });
        });
    });


    describe('/GET user', () => {
        // Before the tests run, create a new user so we can have an API Key to work with.
        before((done) => {
            const newUser = {
                username: 'Mocha',
                client: 'Mocha Test Runner',
                secret: 'MochaSecret',
            };

            const secondUser = {
                username: 'Second User',
                client: 'Mocha Test Runner Dos',
                secret: 'MochaSecret',
            };

            chai.request(server)
                .post('/api/v1/register')
                .send(newUser)
                .end((error, response) => {
                    API_KEY = response.header['x-auth'];
                });

            chai.request(server)
                .post('/api/v1/register')
                .send(secondUser)
                .end(() => {
                    done();
                });
        });


        it('should GET all users', (done) => {
            chai.request(server)
                .get('/api/v1/user')
                .set('x-auth', API_KEY)
                .end((err, res) => {
                    res.body.should.exist;
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.equal(2);
                    done();
                });
        });


        it('should GET a user by the username param', (done) => {
            chai.request(server)
                .get('/api/v1/user?username=second_user')
                .set('x-auth', API_KEY)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].username.should.equal('second_user');
                    done();
                });
        });


        it('should GET a user by the client param', (done) => {
            chai.request(server)
                .get('/api/v1/user?client=mocha test runner dos')
                .set('x-auth', API_KEY)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].client.should.equal('mocha test runner dos');
                    done();
                });
        });


        it('should GET a user by decoding the client param', (done) => {
            chai.request(server)
                .get('/api/v1/user?client=mocha%20test%20runner%20dos')
                .set('x-auth', API_KEY)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body[0].client.should.equal('mocha test runner dos');
                    done();
                });
        });


        it('should GET an error if no users are found', (done) => {
            chai.request(server)
                .get('/api/v1/user/Bobbert')
                .set('x-auth', API_KEY)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
