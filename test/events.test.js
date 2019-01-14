const Event = require('../components/event/eventModel');
const User = require('../components/user/userModel');
const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');
const server = require('../bin/www');

/* eslint-disable no-unused-vars */
const should = chai.should();
/* eslint-enable no-unused-vars */
let API_KEY = '';

chai.use(chaiHttp);


describe('Event', () => {

    before(require('mongodb-runner/mocha/before'));
    after(require('mongodb-runner/mocha/after'));

    function fillArray(value, len) {
        const arr = [];

        for (let i = 0; i < len; i += 1) {
            // Without making a copy, the reference to the date on the `copy.date = date` expression
            // would keep a reference to the `value` object resulting in all of the items having the
            // same exact data.
            const copy = Object.assign({}, value);
            copy.date = new Date(2017, 11, 17, 5, i, 0);
            arr.push(copy);
        }

        return arr;
    }

    // Before the tests run, create a new user so we can have an API Key to work with.
    before((done) => {
        const newUser = {
            username: 'Mocha',
            client: 'Mocha Test Runner',
            secret: 'MochaSecret',
        };

        chai.request(server)
            .post('/api/v1/register')
            .send(newUser)
            .end((error, response) => {
                API_KEY = response.header['x-auth'];
                done();
            });
    });

    // Clear the Events collection out before each test.
    beforeEach((done) => {
        Event.remove({}, () => {
            done();
        });
    });

    // Clear the Users collection after tests have completed.
    after((done) => {
        User.remove({}, () => {
            done();
        });
    });


    describe('/POST event', () => {
        const eventItem = {
            'date': '2017-11-16 18:40:52',
            'trigger': 'User',
            'action': 'Logged out',
            'severity': 'INFO',
            'details': [1, 2, 3],
            'meta': [
                {
                    '_message_key': 'user_logged_out',
                    '_server_remote_addr': '109.173.37.54',
                    '_server_http_referer': 'http://leapfrogjump.com/wp-login.php',
                },
            ],
        };


        it('should POST a new event', (done) => {
            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(eventItem)
                .end((err, res) => {
                    res.body.should.exist;
                    res.should.have.status(200);
                    res.body.should.have.property('success');
                    done();
                });
        });


        it('should return a single object ID', (done) => {
            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(eventItem)
                .end((err, res) => {
                    res.body.should.exist;
                    res.should.have.status(200);
                    res.body.should.have.property('id');
                    res.body.id.should.be.a('string');
                    done();
                });
        });


        it('should handle POST of multiple events', (done) => {
            const eventsArray = fillArray(eventItem, 50);

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(eventsArray)
                .end((err, res) => {
                    res.body.should.exist;
                    res.should.have.status(200);
                    res.body.should.have.property('success');
                    done();
                });
        });


        it('should return an array of object IDs for a multi-doc POST', (done) => {
            const eventsArray = fillArray(eventItem, 50);

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(eventsArray)
                .end((err, res) => {
                    res.body.should.exist;
                    res.should.have.status(200);
                    res.body.should.have.property('id');
                    res.body.id.should.be.a('array');
                    res.body.id.length.should.equal(50);
                    done();
                });
        });


        it('should reject a POST if incomplete data is passed', (done) => {
            const data = {
                'occasionsID': 'df26d5624f78966994b38897554e855b',
                'initiator': 'other',
                'client': 'leapfrogjump.com',
                'meta': [
                    {
                        '_message_key': 'user_logged_out',
                        '_server_remote_addr': '109.173.37.54',
                        '_server_http_referer': 'http://leapfrogjump.com/wp-login.php',
                    },
                ],
            };

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(data)
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

    describe('/GET event', () => {
        // Clear the collection out before each test
        beforeEach((done) => {
            Event.remove({}, () => {
                done();
            });
        });

        const eventItem = {
            'date': '2017-11-16 18:40:52',
            'trigger': 'User',
            'action': 'Logged out',
            'severity': 'INFO',
            'details': [1, 2, 3],
            'meta': [
                {
                    '_message_key': 'user_logged_out',
                    '_server_remote_addr': '109.173.37.54',
                    '_server_http_referer': 'http://leapfrogjump.com/wp-login.php',
                },
            ],
        };


        it('should GET all the events', (done) => {
            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(eventItem)
                .end(() => {
                    chai.request(server)
                        .get('/api/v1/event')
                        .set('x-auth', API_KEY)
                        .end((err, response) => {
                            response.body.should.exist;
                            response.should.have.status(200);
                            response.body.should.be.a('array');
                            response.body.length.should.equal(1);
                            done();
                        });
                });
        });


        it('should GET 50 events if no OFFSET or LIMIT is set', (done) => {
            const events = fillArray(eventItem, 50);

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(events)
                .end(() => {
                    chai.request(server)
                        .get('/api/v1/event')
                        .set('x-auth', API_KEY)
                        .end((err, response) => {
                            response.body.should.exist;
                            response.should.have.status(200);
                            response.body.should.be.a('array');
                            response.body.length.should.equal(50);
                            done();
                        });
                });
        });


        it('should GET number of events specified by LIMIT', (done) => {
            const events = fillArray(eventItem, 50);

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(events)
                .end(() => {
                    chai.request(server)
                        .get('/api/v1/event')
                        .set('x-auth', API_KEY)
                        .query({ LIMIT: 25 })
                        .end((err, response) => {
                            response.body.should.exist;
                            response.should.have.status(200);
                            response.body.should.be.a('array');
                            response.body.length.should.equal(25);
                            done();
                        });
                });
        });


        it('should GET events based on the OFFSET', (done) => {
            const events = fillArray(eventItem, 8);

            events[5].logger = 'OffsetStart';
            events[7].logger = 'OffsetEnd';

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(events)
                .end(() => {
                    chai.request(server)
                        .get('/api/v1/event')
                        .set('x-auth', API_KEY)
                        .query({ OFFSET: 5, SORT: 'date' })
                        .end((err, response) => {
                            response.body.should.exist;
                            response.should.have.status(200);
                            response.body.should.be.a('array');
                            response.body.length.should.equal(3);
                            response.body[0].logger.should.equal('offsetstart');
                            response.body[2].logger.should.equal('offsetend');
                            done();
                        });
                });
        });


        it('should GET based on the OFFSET and LIMIT', (done) => {
            const events = fillArray(eventItem, 10);

            events[5].logger = 'OffsetStart';
            events[8].logger = 'OffsetEnd';

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(events)
                .end(() => {
                    chai.request(server)
                        .get('/api/v1/event')
                        .set('x-auth', API_KEY)
                        .query({ LIMIT: 4, OFFSET: 5 })
                        .end((err, response) => {
                            response.body.should.exist;
                            response.should.have.status(200);
                            response.body.should.be.a('array');
                            response.body.length.should.equal(4);
                            response.body[0].logger.should.equal('offsetstart');
                            response.body[3].logger.should.equal('offsetend');
                            done();
                        });
                });
        });


        it('should GET an event by its ID', (done) => {
            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(eventItem)
                .end((err, res) => {
                    chai.request(server)
                        .get(`/api/v1/event/${res.body.id}`)
                        .set('x-auth', API_KEY)
                        .end((error, response) => {
                            response.should.have.status(200);
                            response.should.be.json;
                            response.body.should.be.a('object');
                            response.body.should.have.property('_id');
                            response.body.should.have.property('logger');
                            response.body.should.have.property('level');
                            response.body.should.have.property('date');
                            response.body.should.have.property('message');
                            response.body.should.have.property('occasionsID');
                            response.body.should.have.property('initiator');
                            response.body.should.have.property('client');
                            response.body.should.have.property('meta');
                            response.body._id.should.equal(res.body.id);
                            done();
                        });
                });
        });


        it('should GET a header containing the last item in the results as an paginated index value', (done) => {
            const events = fillArray(eventItem, 50);

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(events)
                .end(() => {
                    chai.request(server)
                        .get('/api/v1/event')
                        .set('x-auth', API_KEY)
                        .end((err, response) => {
                            response.body.should.exist;
                            response.should.have.status(200);
                            response.header.should.have.property('x-paginated-index');
                            response.header['x-paginated-index'].should.equal(response.body[49].date);
                            done();
                        });
                });
        });


        it('should GET a header containing the last item in the results as an paginated index value when OFFSET and LIMIT are present', (done) => {
            const events = fillArray(eventItem, 10);

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(events)
                .end(() => {
                    chai.request(server)
                        .get('/api/v1/event')
                        .set('x-auth', API_KEY)
                        .query({ LIMIT: 4, OFFSET: 5 })
                        .end((err, response) => {
                            response.body.should.exist;
                            response.should.have.status(200);
                            response.header.should.have.property('x-paginated-index');

                            const actual = response.body[response.body.length - 1].date;
                            response.header['x-paginated-index'].should.equal(actual);

                            done();
                        });
                });
        });


        it('should GET events starting at specified index', (done) => {
            const events = fillArray(eventItem, 50);

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(events)
                .end(() => {
                    const startFromHere = events[5].date;

                    chai.request(server)
                        .get('/api/v1/event')
                        .set('x-auth', API_KEY)
                        .query({ LIMIT: 10, WHERE: startFromHere, SORT: '-date' })
                        .end((err, response) => {
                            response.body.should.exist;
                            response.should.have.status(200);

                            const expected = moment(response.body[0].date).toISOString();
                            expected.should.equal(moment(startFromHere).toISOString());
                            done();
                        });
                });
        });


        it('should GET events sorted descending from date', (done) => {
            const events = fillArray(eventItem, 50);

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(events)
                .end(() => {
                    chai.request(server)
                        .get('/api/v1/event')
                        .set('x-auth', API_KEY)
                        .query({ SORT: '-date' })
                        .end((err, response) => {
                            response.body.should.exist;
                            response.should.have.status(200);
                            const afterDate = response.body[response.body.length - 1].date;
                            const isDateAfter = moment(response.body[0].date).isAfter(afterDate);
                            isDateAfter.should.equal(true);
                            done();
                        });
                });
        });


        it('should GET events sorted ascending from date', (done) => {
            const events = fillArray(eventItem, 50);

            chai.request(server)
                .post('/api/v1/event')
                .set('x-auth', API_KEY)
                .send(events)
                .end(() => {
                    chai.request(server)
                        .get('/api/v1/event')
                        .set('x-auth', API_KEY)
                        .query({ SORT: 'date' })
                        .end((err, response) => {
                            response.body.should.exist;
                            response.should.have.status(200);
                            const beforeDate = response.body[response.body.length - 1].date;
                            const isDateBefore = moment(response.body[0].date).isBefore(beforeDate);
                            isDateBefore.should.equal(true);
                            done();
                        });
                });
        });

        describe('Error Handlers', () => {
            it('should return an error if no events are found', (done) => {
                chai.request(server)
                    .get('/api/v1/event')
                    .set('x-auth', API_KEY)
                    .end((err, res) => {
                        res.body.should.exist;
                        res.should.have.status(404);
                        res.body.should.have.property('status');
                        res.body.status.should.equal(404);
                        res.body.should.have.property('message');
                        done();
                    });
            });


            it('should return an error if no event is found by an ID', (done) => {
                chai.request(server)
                    .get('/api/v1/event/6a0ddbb4e3091c00140d0fcc')
                    .set('x-auth', API_KEY)
                    .end((err, res) => {
                        res.body.should.exist;
                        res.should.be.json;
                        res.should.have.status(404);
                        res.body.should.have.property('status');
                        res.body.status.should.equal(404);
                        res.body.should.have.property('message');
                        done();
                    });
            });


            it('should return an error if event ID parameter is malformed', (done) => {
                chai.request(server)
                    .get('/api/v1/event/6a0ddbb4e30')
                    .set('x-auth', API_KEY)
                    .end((err, res) => {
                        res.body.should.exist;
                        res.should.have.status(422);
                        res.body.should.have.property('status');
                        res.body.status.should.equal(422);
                        res.body.should.have.property('message');
                        done();
                    });
            });


            it('should return a 401 status when no API key is supplied', (done) => {
                chai.request(server)
                    .get('/api/v1/event')
                    .set('x-auth', '')
                    .end((err, res) => {
                        res.body.should.exist;
                        res.should.have.status(401);
                        res.body.should.have.property('status');
                        res.body.status.should.equal(401);
                        res.body.should.have.property('message');
                        done();
                    });
            });


            it('should return an error object when no API key is supplied', (done) => {
                chai.request(server)
                    .get('/api/v1/event')
                    .set('x-auth', '')
                    .end((err, res) => {
                        res.body.should.exist;
                        res.should.have.status(401);
                        res.body.should.have.property('status');
                        res.body.status.should.equal(401);
                        res.body.should.have.property('message');
                        done();
                    });
            });


            it('should return an error status when invalid API token is supplied', (done) => {
                chai.request(server)
                    .get('/api/v1/event')
                    .set('x-auth', 'abc123')
                    .end((err, res) => {
                        res.body.should.exist;
                        res.should.have.status(401);
                        res.body.should.have.property('status');
                        res.body.status.should.equal(401);
                        res.body.should.have.property('message');
                        done();
                    });
            });
        });
    });
});
