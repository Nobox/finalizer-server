var express = require('express');
var baseRoutes = require('./routes/base');
var server = express();
var PORT = 8080;

server.get('/', function(req, res) {
    res.send('Finalizer server.');
});

server.use('/api', baseRoutes);

server.listen(PORT, function() {
    console.log('Finalizer server running on ' + PORT);
});
