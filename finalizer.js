var Installer = require('./lib/installer');
    Tarball = require('./lib/tarball'),
    fs = require('fs'),
    rmdir = require( 'rmdir' ),
    mkdirp = require('mkdirp'),
    storagePath = __dirname + '/storage';

function Finalizer () {
}


/**
 * Initialize the creation of a bundle
 * based on request
 * @return {[type]} [description]
 */
Finalizer.prototype.create = function(finish) {
    console.log('Create');
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

            if (err) throw err;

            console.log('Package json generated');

            console.log('Proceeding with npm installation...');

            Installer.install(buildPath, function() {

                console.log('Installation completed...')
                console.log('Lets proceed with compression...');

                Tarball.compress(buildPath + '/node_modules', buildPath + '/compressed.tar.gz', function(){

                    console.log('Cleaning the house...');

                    rmdir(buildPath + '/node_modules', function(err, dirs, files) {
                        console.log('New Module ready!');
                        finish();
                    });
                });
            });
        });

    });

};


Finalizer.prototype.prepareDownload = function(project, callback) {
    // using project id find on the DB the last build id
    // TODO: get build id based on project stored
    // - check if exist build
    // - return error if build not exist
    //
    var buildId = 'x5th68hw5j6ecdi';

    // and return the compressed bundle.
    var file = './storage/' + project + '/' + buildId + '/compressed.tar.gz';

    return file;
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
    var _self = this;

    if (!fs.existsSync(path)) {
        // - create project folder
        mkdirp(path, function(){
            _self.prepareBuildFolder(path, callback);
        });
    } else {
        this.prepareBuildFolder(path, callback);
    }




};

Finalizer.prototype.prepareBuildFolder = function(path, callback) {

    var buildId = Math.random().toString(36).substr(2);
    var buildPath = path + '/' + buildId;

    // - count builds
    // - if more than 5 delete oldest
    // - create build folder
    mkdirp(buildPath, function(){
        // - save build id
        callback(buildPath, buildId);
    });

};



module.exports = new Finalizer();
