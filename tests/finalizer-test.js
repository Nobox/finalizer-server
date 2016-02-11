var expect = require('expect.js');
var fs = require('fs');
var Finalizer = require('../finalizer');
var utils = require('./utils');

describe('Finalizer', function() {
    var dependencies = fs.readFileSync(__dirname + '/fixtures/package.json');

    afterEach(function(done) {
        var path = __dirname + '/../storage/my-project';
        if (fs.existsSync(path)) {
            utils.deleteDirectory(path, function() {
                done();
            });
        } else {
            done();
        }
    });

    it('should create a new project', function(done) {
        this.timeout(30000);
        Finalizer.create('my-project', dependencies, function (project) {
            expect(project).to.be('my-project');
            done();
        });
    });

    it('should show a warning and do nothing if the project exists already', function() {

    });
});
