var fs = require('fs');
var tar = require('tar');
var fstream = require('fstream');

/**
 * Tarball constructor function
 */
function Tarball() {}

/**
 * Compress folder
 * @param  {string} sourceFile      The path of the source file
 * @param  {string} destinationFile The destination path and file name
 * @return {void}
 */
Tarball.prototype.compress = function(sourceFile, destinationFile, callback) {
    var _self = this;
    if (fs.existsSync(sourceFile)) {
        var packer = tar.Pack({ noPropietary:true })
            .on('error', _self.error)
            .on('end', function() {
                _self.completed('Compression');
                callback();
            });

        fstream.Reader({path: sourceFile, type: 'Directory' })
            .on('error', _self.error)
            .pipe(packer)
            .pipe(fs.createWriteStream(destinationFile));
    } else {
        _self.error('Source File: ' +  sourceFile + ' not found');
    }
};

/**
 * Extract tar.gz file
 * @param  {string} sourceFile      The path of the source file
 * @param  {string} destinationFile The destination path and file name
 * @return {void}
 */
Tarball.prototype.extract = function(sourceFile, destinationFile, callback) {
    var _self = this;
    var extractor = tar.Extract({path: destinationFile})
        .on('error', _self.error)
        .on('end', function (){
            _self.completed('Extraction');
            callback();
        });

    fs.createReadStream(sourceFile)
        .on('error', _self.error)
        .pipe(extractor);
};

Tarball.prototype.completed = function(msg) {
    console.log('The ' + msg + ' was completed');
};

Tarball.prototype.error = function(err) {
    console.log('An error ocurred:', err);
}

module.exports = new Tarball();
