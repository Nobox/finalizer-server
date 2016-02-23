var fs = require('fs');
var rmdir = require('rmdir');
var mkdirp = require('mkdirp');
var slug = require('slug');
var Installer = require('./installer');
var Tarball = require('./tarball');
var token = require('./token');
var Project = require('./project');
var Build = require('./build');
var storagePath = __dirname + '/../storage';
var Queue = require('./queue');

function Finalizer() {}

/**
 * Create project for the first time.
 * It also creates the first build on this new project.
 *
 * @param  {string} projectName
 * @param  {string} dependencies
 * @param  {Function} finish
 *
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
            Project.create({ name: projectName, slug: projectSlug }, function(err, project) {
                enqueueBuildProcess(project, dependencies);
                finish(null, 'Created project "' + projectName + '"');
            });
        } else {
            finish('Project "' + projectName + '" already exists');
        }
    });
};

/**
 * Create a new build on an existing project
 * @param  {String} projectName
 * @param  {String} dependencies
 * @param  {Function} finish
 * @return {null}
 */
Finalizer.prototype.build = function(projectName, dependencies, finish) {
    var projectSlug = slug(projectName);

    // Check if the project already exists, if it does, show a warning and do nothing else
    Project.findOne({ where: { name: projectName, slug: projectSlug }}, function(err, project) {
        if (project) {
            Build.findOne({ where: { project_id: project.id }}, function(err, build) {
                var archived = JSON.parse(fs.readFileSync('./storage/' + project.slug + '/' + build.hash + '/package.json'));
                var newDependencies = dependencies;
                var newFile = diff(archived, newDependencies);
                if (newFile) {
                    enqueueBuildProcess(project, dependencies);
                } else {
                    console.log('build is updated');
                }
                finish();
            });

        } else {
            console.log('Project "' + projectName + '" does not exists. First create one.');
        }
    });
};

/**
 * Return path of latest build of the project.
 * If the project/build does not exists, show warning.
 *
 * @param  {string}   project
 * @param  {Function} callback
 * @return {string}
 */
Finalizer.prototype.download = function(project, callback) {
    var projectSlug = slug(project);
    Project.findOne({ where: { slug: projectSlug }}, function(err, project) {
        if (!project) {
            console.log('Project "' + project + '" was not found.');
        }
        Build.findOne({ where: { project_id: project.id }}, function(err, build) {
            callback('./storage/' + project.slug + '/' + build.hash + '/compressed.tar.gz');
        });
    });
};

/**
 * Install and compress node dependencies.
 * @param  {string}   path
 * @param  {Function} callback
 * @return {null}
 */
function installDependencies(job, callback) {
    Installer.install('npm', job.data.buildPath, function() {
        console.log('Installation completed!');

        job.progress(2, 5);
        console.log('Creating compressed .tar of dependencies...');

        Tarball.compress(job.data.buildPath + '/node_modules', job.data.buildPath + '/compressed.tar.gz', function() {
            console.log('Created .tar archive. Removing node_modules directory...');
            job.progress(3, 5);
            rmdir(job.data.buildPath + '/node_modules', function() {
                callback();
            });
        });
    });
}

/**
 * Create project directories.
 *
 * @param  {Object}   project
 * @param  {Function} callback
 * @return {null}
 */
function createProjectFolder(project, callback) {
    // check if project is first or new
    var path = storagePath + '/' + project.slug;

    if (!fs.existsSync(path)) {
        mkdirp(path, function() {
            createBuildFolder(project, path, callback);
        });
    } else {
        createBuildFolder(project, path, callback);
    }
}

/**
 * Create first project build directories.
 *
 * @todo  Count builds, if more than 5 delete oldest.
 *
 * @param  {Object}   project
 * @param  {string}   path
 * @param  {Function} callback
 * @return {null}
 */
function createBuildFolder(project, path, callback) {
    var buildId = token.make();
    var buildPath = path + '/' + buildId;

    project.builds.create({ project_id: project.id, hash: buildId }, function() {});

    mkdirp(buildPath, function() {
        callback(buildPath, buildId);
    });
};


/**
 * Create queue process using kue js
 *
 * @param  {Object} project
 * @param  {Object } dependencies
 * @return {null}
 */
function enqueueBuildProcess(project, dependencies) {
    createProjectFolder(project, function(buildPath, buildId) {
        var parameters = {
            title: buildId,
            buildPath: buildPath,
            buildId: buildId,
            dependencies: dependencies,
        }

        Queue.create('create build - Project: ' + project.name, parameters);
        Queue.jobs.process('create build - Project: ' + project.name, 1, function(job, done) {
            job.progress(0, 4);
            fs.writeFile(job.data.buildPath + '/package.json', JSON.stringify(job.data.dependencies), function(err) {
                if (err) {
                    done('Error writing package.json' + err);
                }

                job.progress(1, 4);
                console.log('Created package.json. Installing npm dependencies...');
                installDependencies(job, function() {
                    job.progress(4, 4);
                    console.log('Project "' + job.data.projectName + '" created.');
                    done();
                });
            });
        });
    });
};

module.exports = new Finalizer();
