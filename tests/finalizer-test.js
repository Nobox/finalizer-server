var expect = require('expect.js');
var fs = require('fs');
var Finalizer = require('../finalizer');
var utils = require('./utils');
var Project = require('../lib/project');

function cleanupProject(path, callback) {
    if (fs.existsSync(path)) {
        utils.deleteDirectory(path, function() {
            callback();
        });
    } else {
        callback();
    }
}

describe('Finalizer', function() {
    var dependencies = fs.readFileSync(__dirname + '/fixtures/package.json');

    // cleanup created projects on redis
    beforeEach(function(done) {
        Project.destroyAll(function() {
            done();
        });
    });

    // cleanup created project directories
    afterEach(function(done) {
        cleanupProject(__dirname + '/../storage/My-Project', function() {
            cleanupProject(__dirname + '/../storage/Awesome-project', function() {
                done();
            });
        });
    });

    it('should create a new project', function(done) {
        this.timeout(30000);
        Finalizer.create('My Project', dependencies, function(project) {
            expect(project).to.be('My Project');
            done();
        });
    });

    it('should show a warning and do nothing if the project exists already', function(done) {
        this.timeout(30000);
        Project.create({ name: 'Awesome project', slug: 'Awesome-project'}, function() {
            Finalizer.create('Awesome project', dependencies, function(project) {
                expect(project).to.be('Awesome project');
                done();
            });
        });
    });
});
