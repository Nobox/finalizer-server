var express = require('express');
var router = express.Router();
var Finalizer = require('../lib/finalizer');

router.use(function(req, res, next) {
    // TODO: authorize requests
    next();
});

/**
 * api/create
 * Endpoint to link or create project on the build server.
 * It should also create the first build.
 * This should be done only once.
 *
 * @todo use an authentication token?
 */
router.post('/create', function(req, res) {
    var projectName = req.body.name;
    var dependencies = req.body.dependencies;
    Finalizer.create(projectName, dependencies, function(err, msg) {
        var response = { msg: '' };
        if (!err) {
            response.msg = msg;
            res.json(response);
            return;
        }
        response.msg = err;
        res.status(400).json(response);
    });
});

/**
 * api/build
 * Endpoint to create a new build for a existing project.
 * This can be executed as many times the user requires
 * The project must exist
 *
 * @todo use an authentication token?
 */
router.post('/build', function(req, res) {
    var projectName = req.body.name;
    var dependencies = req.body.dependencies;
    Finalizer.build(projectName, dependencies, function(err, msg) {
        var response = { msg: '' };
        if (!err) {
            response.msg = msg;
            res.json(response);
            return;
        }
        response.msg = err;
        res.status(400).json(response);
    });
});


/**
 * api/download
 * Endpoint to request the latest build from the server.
 *
 * @todo validate request client should be authorized on the server
 * @todo validate project name (some-project-name)
 * @todo client must provide project id?
 */
router.post('/download', function(req, res) {
    var projectName = req.body.name;
    var dependencies = req.body.dependencies;
    Finalizer.download(projectName, dependencies, function(err, file) {
        var response = { msg: '' };
        if (!err) {
            res.download(file);
            return;
        }
        response.msg = err;
        res.status(400).json(response);
    });
});

module.exports = router;
