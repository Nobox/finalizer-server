var Tarball = require('../lib/tarball');
var expect = require('expect.js');
var fs = require('fs');
var rmdir = require('rmdir');
var utils = require('./utils');

describe('Tarball', function() {
    beforeEach(function() {
        utils.createDirectory(__dirname + '/fixtures/compress-me');
    });

    afterEach(function(done) {
        var path = __dirname + '/fixtures/compress-me';
        if (fs.existsSync(path)) {
            utils.deleteDirectory(path, function() {
                done();
            });
        }
    });

    it('should compress the specified directory', function(done) {
        var source = __dirname + '/fixtures/compress-me';
        var destination = __dirname + '/fixtures/compress-me/compress-me.tar.gz';

        Tarball.compress(source, destination, function() {
            var exists = fs.existsSync(destination);
            expect(exists).to.be(true);
            done();
        });
    });

    it('should extract the specified directory', function(done) {
        var compressFile = __dirname + '/fixtures/temp.tar.gz';
        var destination = __dirname + '/fixtures';

        Tarball.extract(compressFile, destination, function() {
            var exists = fs.existsSync(destination + '/node_modules');
            expect(exists).to.be(true);
            rmdir(destination + '/node_modules', function() {
                done();
            });
        });
    });
});
