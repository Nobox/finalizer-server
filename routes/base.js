var express = require('express');
var router = express.Router();
var Finalizer = require('../finalizer');


router.use(function(req, res, next) {
    // TODO: authorize requests
    next();
});


// api/create
// this route should be POST
router.get('/create', function(req, res){

    Finalizer.create(function(){
        res.send('Module created');
    });

});

// api/download
router.get('/download', function(req, res){

    // TODO: validate request client should be authorized on the server
    // client must provide project id
    var project = req.query.project;
    var file = Finalizer.prepareDownload(project);
    res.download(file);
})

module.exports = router;
