var expect = require('expect.js');
var token = require('../lib/token');

describe('token helper', function() {
    it('should generate a random token', function() {
        expect(token.make()).to.be.an('string');
    });
});
