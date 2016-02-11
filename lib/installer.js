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
Installer.prototype.install = function(name, directory, callback) {
    var commands = {
        npm: {
            name: 'npm',
            args: ['install', '--prefix=' + directory]
        },
        ied: {
            name: 'ied',
            args: ['install']
        }
    }

    var command = commands[name].name;
    var args = commands[name].args;
    var options = this.options;

    this.runCommand(command, args, options, callback);
};

Installer.prototype.runCommand = function(command, args, options, callback) {
    var child = process.spawn(command, args, options);

    child.stdout.on('data', function(data) {
        console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', function(data) {
        console.log(`stderr: ${data}`);
    });
    // TODO: add error handler
    //
    child.on('close', function(code) {
        console.log('Install completed!');
        callback();
    });
 };

 Installer.prototype.setCommand = function(command) {
     this.command = command;
 };

module.exports = new Installer();
