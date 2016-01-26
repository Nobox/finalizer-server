var Installer = require('./lib/installer');
    Tarball = require('./lib/tarball'),
    fs = require('fs'),
    rmdir = require( 'rmdir' ),
    mkdirp = require('mkdirp'),
    storagePath = __dirname + '/storage';

function Finalizer () {

    this.create();
}


/**
 * Initialize the creation of a bundle
 * based on request
 * @return {[type]} [description]
 */
Finalizer.prototype.create = function() {

    //TODO: make this dynamic
    // project-1 should be unique for each project ( must check if exist )
    // build id should be unique for each build ( must check if there are more than 5 builds )
    //
    var dependencies = fs.readFileSync(__dirname + '/tests/files/installer-test/build/package.json');


    // TODO: refactor this maybe use a module that handles method
    // chaining in a more elegant way
    var projectName = Math.random().toString(32).substr(2);

    this.prepare(projectName, function(buildPath, buildId){

        fs.writeFile(buildPath + '/package.json', dependencies, function(err){

            console.log('Package json generated');

            console.log('Proceeding with npm installation...');

            Installer.install(buildPath, function() {

                console.log('Installation completed...')
                console.log('Lets proceed with compression...');

                Tarball.compress(buildPath + '/node_modules', buildPath + '/compressed.tar.gz', function(){

                    console.log('Cleaning the house...');

                    rmdir(buildPath + '/node_modules', function(err, dirs, files) {
                        console.log('New Module ready!');
                    });
                });
            });
        });

    });

};

/**
 * Prepare file system based on project
 * @param  {string}   project  Project name or id
 * @param  {Function} callback
 * @return {void}
 */
Finalizer.prototype.prepare = function(project, callback) {
    // check if project is first or new
    var path = storagePath + '/' + project;
    var buildId = Math.random().toString(36).substr(2);

    if (!fs.existsSync(path)) {
        // - create project folder
        mkdirp(path);
    }

    var buildPath = path + '/' + buildId;

    // - count builds
    // - if more than 5 delete oldest
    // - create build folder
    mkdirp(buildPath);
    // - save build id

    callback(buildPath, buildId);
};



module.exports = new Finalizer();
