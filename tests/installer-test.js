var Installer = require('../lib/installer');

describe('Installer', function() {
    this.timeout(30000);
    it('should install node modules inside a directory', function(done) {
        var directory = __dirname + '/fixtures';
        Installer.install(directory, function() {
            done();
        });
    });
});
