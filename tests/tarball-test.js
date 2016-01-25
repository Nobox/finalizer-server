var Tarball = require('../lib/tarball');
var expect = require('expect.js');
var fs = require('fs');
var rmdir = require( 'rmdir' );

describe('Tarball', function() {

    describe('Compression Test', function(){
        describe('compress() if source directory exists', function(){
            // does the source dir exists ?
            it('should compress without error', function (done){
                var source = __dirname + '/files/compression-test/node_modules';
                var destination = __dirname + '/files/compression-test/compressed-test.tar.gz';
                Tarball.compress(source, destination, function(){

                    var exists = fs.existsSync(source);

                    expect(exists).to.be(true);

                    fs.unlinkSync(destination);

                    done();
                });

            });
        });

        describe('extract() if compressed file is valid', function(){
            it('should extract the file without errors', function(done){

                var compressFile = __dirname + '/files/uncompression-test/temp.tar.gz';

                var destination = __dirname + '/files/uncompression-test/';

                Tarball.extract(compressFile, destination, function() {
                    var exists = fs.existsSync(destination + 'node_modules');

                    expect(exists).to.be(true);

                    rmdir(destination + 'node_modules', function(err, dirs, files) {
                        done();
                    });

                });
            });
        });
    });
});
