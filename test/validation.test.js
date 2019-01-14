const chai = require('chai');
const Mr = require('../components/helpers/validation');

const { expect } = chai;

/* eslint-disable no-unused-vars */
const should = chai.should();
/* eslint-enable no-unused-vars */

describe('Validation', () => {

    before(require('mongodb-runner/mocha/before'));
    after(require('mongodb-runner/mocha/after'));

    it('should export clean object', () => {
        expect(Mr.clean).to.be.a('object');
    });

    it('should export string method', () => {
        expect(Mr.clean.string).to.be.a('function');
    });

    it('should export stringWithUnderscores method', () => {
        expect(Mr.clean.stringWithUnderscores).to.be.a('function');
    });

    it('should export URIstring method', () => {
        expect(Mr.clean.URIstring).to.be.a('function');
    });

    it('should export int method', () => {
        expect(Mr.clean.int).to.be.a('function');
    });

    describe('#string()', () => {

        it('should return undefined if argument is empty', () => {
            const actual = Mr.clean.string();
            expect(actual).to.be.undefined;
        });

        it('should return a lowercase string', () => {
            const actual = Mr.clean.string('CAPITALIZED');
            actual.should.equal('capitalized');
        });

        it('should strip special characters from string', () => {
            const actual = Mr.clean.string('!@#$%^&*()-+=[]{};:|/?.,`~"test');
            actual.should.equal('test');
        });
    });

    describe('#stringWithDash()', () => {

        it('should return undefined if argument is empty', () => {
            const actual = Mr.clean.stringWithDash();
            expect(actual).to.be.undefined;
        });

        it('should return a lowercase string', () => {
            const actual = Mr.clean.stringWithDash('CAPITALIZED');
            actual.should.equal('capitalized');
        });

        it('should strip special characters from string', () => {
            const actual = Mr.clean.stringWithDash('!@#$%^&*()+=[]{};:|/?.,`~"test');
            actual.should.equal('test');
        });

        it('should allow dashes in the string', () => {
            const actual = Mr.clean.stringWithDash('-test');
            actual.should.equal('-test');
        });
    });

    describe('#dateString()', () => {

        it('should return undefined if argument is empty', () => {
            const actual = Mr.clean.dateString();
            expect(actual).to.be.undefined;
        });

        it('should return undefined if the string is not in a ISO format', () => {
            const actual = Mr.clean.dateString('2012-#$@-errors');
            expect(actual).to.be.undefined;
        });

        it('should return an ISO string format, given a datetime input', () => {
            const actual = Mr.clean.dateString('2013-02-04T22:44:30.652Z');
            actual.should.equal('2013-02-04T22:44:30.652Z');
        });
    });

    describe('#stringWithUnderscores()', () => {

        it('should return undefined if argument is empty', () => {
            const actual = Mr.clean.stringWithUnderscores();
            expect(actual).to.be.undefined;
        });

        it('should return a lowercase string', () => {
            const actual = Mr.clean.stringWithUnderscores('CAPITALIZED');
            actual.should.equal('capitalized');
        });

        it('should strip special characters from string', () => {
            const actual = Mr.clean.stringWithUnderscores('!@#$%^&*()-_+=[]{};:|/?.,`~"test');
            actual.should.equal('_test');
        });

        it('should replaces spaces with underscores', () => {
            const actual = Mr.clean.stringWithUnderscores('!@#$%^&*()-_+=[]{};:|/?.,`~"test');
            actual.should.equal('_test');
        });
    });

    describe('#URIstring()', () => {

        it('should return undefined if argument is empty', () => {
            const actual = Mr.clean.URIstring();
            expect(actual).to.be.undefined;
        });

        it('should return a lowercase string', () => {
            const actual = Mr.clean.URIstring('CAPITALIZED');
            actual.should.equal('capitalized');
        });

        it('should strip special characters from string', () => {
            const actual = Mr.clean.URIstring('a%20test');
            actual.should.equal('a test');
        });
    });

    describe('#int()', () => {

        it('should return undefined if argument is empty', () => {
            const actual = Mr.clean.int();
            expect(actual).to.be.undefined;
        });

        it('should return an int based on the radix of 10', () => {
            const actual = Mr.clean.int(0.3234);
            actual.should.equal(0);
        });

        it('should strip special characters from int', () => {
            const actual = Mr.clean.int('!@#$%^&*()-_+=[]{};:|/?.,`~"200');
            actual.should.equal(200);
        });
    });
});
