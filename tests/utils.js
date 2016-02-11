var fs = require('fs');
var rmdir = require('rmdir');

var utils = {
    createDirectory: function(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    },
    deleteDirectory: function(path, callback) {
        rmdir(path, function() {
            callback();
        });
    },
    deleteFile: function(path) {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }
};

module.exports = utils;
