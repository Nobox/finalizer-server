var Installer = require('./lib/installer');
var Tarball = require('./lib/tarball');
var fs = require('fs');
var rmdir = require( 'rmdir' );
var mkdirp = require('mkdirp');


function Finalizer () {
    this.create();
}


Finalizer.prototype.create = function() {

    //TODO: make this dynamic
    // project-1 should be unique for each project ( must check if exist )
    // build id should be unique for each build ( must check if there are more than 5 builds )

    var directory = __dirname + '/storage/project-1/build1';
    var dependencies = fs.readFileSync(__dirname + '/tests/files/installer-test/build/package.json');


    // TODO: refactor this maybe use a module that handles method
    // chaining in a more elegant way

    mkdirp(directory, function(err){

        fs.writeFile(directory + '/package.json', dependencies, function(err){

            console.log('Package json generated');

            console.log('Proceeding with npm installation...');

            Installer.install(directory, function() {

                console.log('Installation completed...')
                console.log('Lets proceed with compression...');

                Tarball.compress(directory + '/node_modules', directory + '/compressed.tar.gz', function(){

                    console.log('Cleaning the house...');

                    rmdir(directory + '/node_modules', function(err, dirs, files) {
                        console.log('New Module ready!');
                    });
                });
            });
        });

    });

};



module.exports = new Finalizer();
