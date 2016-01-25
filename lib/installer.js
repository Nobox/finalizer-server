var fs = require('fs');
var process = require('child_process');



function Installer() {

    this.options = {
        silent: true,
        // stdio: 'inherit'
    }
}


/**
 * Install method
 * @param  {string}   directory [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
Installer.prototype.install = function(directory, callback) {
    var command = 'npm';
    var args = ['install', '--prefix=' + directory];
    var options = this.options;

    this.runCommand(command, args, options, callback);
};


Installer.prototype.runCommand = function(command, args, options, callback) {
    var child = process.spawn(command, args, options);

    // TODO: add error handler
    //
    child.on('close', (code) => {
        console.log('npm install completed');
        callback();
    });

 };

module.exports = new Installer();
