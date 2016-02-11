var fs = require('fs');
var rmdir = require('rmdir');
var mkdirp = require('mkdirp');
var Installer = require('./lib/installer');
var Tarball = require('./lib/tarball');
var token = require('./lib/token');
var storagePath = __dirname + '/storage';

function Finalizer() {}

/**
 * Create project for the first time.
 * It also creates the first build on this new project.
 *
 * @param  {string} project
 * @param  {string} dependencies
 * @param  {Function} finish
 *
 * @todo It should receive a package.json on the request.
 * @todo It should receive a project name on the request.
 * @todo Check if the project already exists, if it does, show a warning and do nothing else :P
 * @todo Once the project is created, create the first build also.
 * @return {null}
 */
Finalizer.prototype.create = function(project, dependencies, finish) {
    // double checks if the storage folder exists
    if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath);
    }

    createProject(project, function(buildPath, buildId) {
        fs.writeFile(buildPath + '/package.json', dependencies, function(err) {
            if (err) {
                throw err;
            }

            console.log('Created package.json');
            console.log('Installing npm dependencies...');

            Installer.install('npm', buildPath, function() {
                console.log('Installation completed!');
                console.log('Creating compressed .tar of dependencies...');

                Tarball.compress(buildPath + '/node_modules', buildPath + '/compressed.tar.gz', function() {
                    console.log('Created .tar archive. Removing node_modules directory...');
                    rmdir(buildPath + '/node_modules', function(err, dirs, files) {
                        console.log('Dependencies are ready!');
                        finish(project);
                    });
                });
            });
        });
    });
};

/**
 * Download the latest build of the project.
 * If the project/build does not exists, throw exception.
 *
 * @param  {string}   project
 * @param  {Function} callback
 * @return {string}
 */
Finalizer.prototype.download = function(project, callback) {
    // get the latest project build id from redis!
    var buildId = 'x5th68hw5j6ecdi';

    return './storage/' + project + '/' + buildId + '/compressed.tar.gz';
};

/**
 * Create project directories.
 *
 * @param  {string}   project
 * @param  {Function} callback
 * @return {null}
 */
function createProject(project, callback) {
    // check if project is first or new
    var path = storagePath + '/' + project;

    if (!fs.existsSync(path)) {
        mkdirp(path, function() {
            createBuild(path, callback);
        });
    } else {
        createBuild(path, callback);
    }
}

/**
 * Create first project build directories.
 *
 * @todo  Count builds, if more than 5 delete oldest.
 *
 * @param  {string}   path
 * @param  {Function} callback
 * @return {null}
 */
function createBuild(path, callback) {
    var buildId = token.make();
    var buildPath = path + '/' + buildId;

    mkdirp(buildPath, function() {
        callback(buildPath, buildId);
    });
};

module.exports = new Finalizer();
