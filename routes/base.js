var express = require('express');
var router = express.Router();
var Finalizer = require('../finalizer');


router.use(function(req, res, next) {
    next();
});

router.get('/create', function(req, res){
    Finalizer.create();
    res.send('Done');
});

module.exports = router;
