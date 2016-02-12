var fs = require('fs');
var rmdir = require('rmdir');
var mkdirp = require('mkdirp');
var slug = require('slug');
var Installer = require('./lib/installer');
var Tarball = require('./lib/tarball');
var token = require('./lib/token');
var storagePath = __dirname + '/storage';
var Project = require('./lib/project');

function Finalizer() {}

/**
 * Create project for the first time.
 * It also creates the first build on this new project.
 *
 * @param  {string} projectName
 * @param  {string} dependencies
 * @param  {Function} finish
 *
 * @todo It should receive a package.json on the request.
 * @todo It should receive a project name on the request.
 * @todo Check if the project already exists, if it does, show a warning and do nothing else :P
 * @todo Once the project is created, create the first build also.
 * @return {null}
 */
Finalizer.prototype.create = function(projectName, dependencies, finish) {
    // double checks if the storage folder exists
    if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath);
    }

    var projectSlug = slug(projectName);

    // Check if the project already exists, if it does, show a warning and do nothing else
    Project.findOne({ where: { name: projectName, slug: projectSlug }}, function(err, project) {
        if (!project) {
            Project.create({ name: projectName, slug: projectSlug }, function() {});
            createProjectFolder(projectSlug, function(buildPath, buildId) {
                fs.writeFile(buildPath + '/package.json', dependencies, function(err) {
                    if (err) {
                        throw err;
                    }
                    console.log('Created package.json');
                    console.log('Installing npm dependencies...');

                    installDependencies(buildPath, function() {
                        console.log('Dependencies are ready!');
                        finish(projectName);
                    });
                });
            });
        } else {
            console.log('The project exists. I wont build anything.');
            finish(projectName);
        }
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
 * Install and compress node dependencies.
 * @param  {string}   path
 * @param  {Function} callback
 * @return {null}
 */
function installDependencies(path, callback) {
    Installer.install('npm', path, function() {
        console.log('Installation completed!');
        console.log('Creating compressed .tar of dependencies...');

        Tarball.compress(path + '/node_modules', path + '/compressed.tar.gz', function() {
            console.log('Created .tar archive. Removing node_modules directory...');
            rmdir(path + '/node_modules', function() {
                callback();
            });
        });
    });
}

/**
 * Create project directories.
 *
 * @param  {string}   projectName
 * @param  {Function} callback
 * @return {null}
 */
function createProjectFolder(projectName, callback) {
    // check if project is first or new
    var path = storagePath + '/' + projectName;

    if (!fs.existsSync(path)) {
        mkdirp(path, function() {
            createBuildFolder(path, callback);
        });
    } else {
        createBuildFolder(path, callback);
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
function createBuildFolder(path, callback) {
    var buildId = token.make();
    var buildPath = path + '/' + buildId;

    mkdirp(buildPath, function() {
        callback(buildPath, buildId);
    });
};

module.exports = new Finalizer();
