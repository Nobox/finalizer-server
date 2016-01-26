var express = require('express');
var router = express.Router();
var Finalizer = require('../finalizer');

router.use(function(req, res, next) {
    // TODO: authorize requests
    next();
});

/**
 * api/create
 * Endpoint to link or create project on the build server.
 * It should also create the first build.
 * This should be done only once.
 */
router.get('/create', function(req, res){
    // use an authentication token?
    // validate project name (some-project-name)
    // receive a valid package.json
    Finalizer.create(function () {
        res.send('Module created');
    });
});

/**
 * api/download
 * Endpoint to request the latest build from the server.
 */
router.get('/download', function (req, res) {
    // TODO: validate request client should be authorized on the server
    // validate project name (some-project-name)
    // client must provide project id
    var project = req.query.project;
    var file = Finalizer.prepareDownload(project);
    res.download(file);
})

module.exports = router;
