var expect = require('expect.js');
var fs = require('fs');
var Finalizer = require('../finalizer');
var utils = require('./utils');
var Project = require('../lib/project');
var Build = require('../lib/build');

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
        Build.destroyAll(function() {
            Project.destroyAll(function() {
                done();
            });
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
            Project.findOne({ where: { name: 'My Project', slug: 'My-Project' }}, function(err, project) {
                expect(project).to.be.an('object');
                expect(project).to.have.property('name');
                Build.findOne({ where: { project_id: project.id }}, function(err, build) {
                    expect(build).to.be.an('object');
                    expect(build).to.have.property('hash');
                    expect(build.project_id).to.be(project.id);
                    done();
                });
            });
        });
    });

    it('should show a warning and do nothing if the project exists already', function(done) {
        this.timeout(30000);
        Project.create({ name: 'Awesome project', slug: 'Awesome-project'}, function(err, createdProject) {
            Finalizer.create('Awesome project', dependencies, function(project) {
                expect(project).to.be('Awesome project');
                done();
            });
        });
    });
});
