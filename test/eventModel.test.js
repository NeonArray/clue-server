const Event = require('../components/event/eventModel');
const chai = require('chai');

/* eslint-disable no-unused-vars */
const should = chai.should();
/* eslint-enable no-unused-vars */

describe('EventModel', () => {

    it('should have validation error if date field is empty', (done) => {
        const eventItem = new Event({
            'trigger': 'User',
            'action': 'Logged out',
            'severity': 'INFO',
            'details': [],
            'meta': [
                {
                    '_message_key': 'user_logged_out',
                    '_server_remote_addr': '109.173.37.54',
                    '_server_http_referer': 'http://leapfrogjump.com/wp-login.php',
                },
            ],
        });

        eventItem.validate((err) => {
            err.errors.should.exist;
            done();
        });
    });


    it('should have validation error if trigger field is empty', (done) => {
        const eventItem = new Event({
            'date': '2017-11-16 18:40:52',
            'action': 'Logged out',
            'severity': 'INFO',
            'details': [],
            'meta': [
                {
                    '_message_key': 'user_logged_out',
                    '_server_remote_addr': '109.173.37.54',
                    '_server_http_referer': 'http://leapfrogjump.com/wp-login.php',
                },
            ],
        });

        eventItem.validate((err) => {
            err.errors.should.exist;
            done();
        });
    });


    it('should have validation error if action field is empty', (done) => {
        const eventItem = new Event({
            'date': '2017-11-16 18:40:52',
            'trigger': 'User',
            'severity': 'INFO',
            'details': [],
            'meta': [
                {
                    '_message_key': 'user_logged_out',
                    '_server_remote_addr': '109.173.37.54',
                    '_server_http_referer': 'http://leapfrogjump.com/wp-login.php',
                },
            ],
        });

        eventItem.validate((err) => {
            err.errors.should.exist;
            done();
        });
    });


    it('should have validation error if severity field is empty', (done) => {
        const eventItem = new Event({
            'date': '2017-11-16 18:40:52',
            'trigger': 'User',
            'action': 'Logged out',
            'details': [],
            'meta': [
                {
                    '_message_key': 'user_logged_out',
                    '_server_remote_addr': '109.173.37.54',
                    '_server_http_referer': 'http://leapfrogjump.com/wp-login.php',
                },
            ],
        });

        eventItem.validate((err) => {
            err.errors.should.exist;
            done();
        });
    });


    it('should have validation error if details field is empty', (done) => {
        const eventItem = new Event({
            'date': '2017-11-16 18:40:52',
            'trigger': 'User',
            'action': 'Logged out',
            'severity': 'INFO',
            'meta': [
                {
                    '_message_key': 'user_logged_out',
                    '_server_remote_addr': '109.173.37.54',
                    '_server_http_referer': 'http://leapfrogjump.com/wp-login.php',
                },
            ],
        });

        eventItem.validate((err) => {
            err.errors.should.exist;
            done();
        });
    });


    it('should have validation error if meta field is empty', (done) => {
        const eventItem = new Event({
            'date': '2017-11-16 18:40:52',
            'trigger': 'User',
            'action': 'Logged out',
            'severity': 'INFO',
            'details': [],
        });

        eventItem.validate((err) => {
            err.errors.should.exist;
            done();
        });
    });


    it('should format the date as an ISO format', (done) => {
        const eventItem = new Event({
            'date': '2017-11-16 18:40:52',
            'trigger': 'User',
            'action': 'Logged out',
            'severity': 'INFO',
            'details': [],
            'meta': [
                {
                    '_message_key': 'user_logged_out',
                    '_server_remote_addr': '109.173.37.54',
                    '_server_http_referer': 'http://leapfrogjump.com/wp-login.php',
                },
            ],
        });

        eventItem.save().then((item) => {
            item._doc.date.should.equal('2017-11-16T23:40:52.000Z');
        }).catch(() => done());
    });
});
