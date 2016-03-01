var express = require('express');
var bodyParser = require('body-parser');
var baseRoutes = require('./routes/base');
var config = require('./config');
var server = express();
var PORT = config.serverPort;
var HOST = config.privateIP;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.set('environment', config.nodeEnv);

server.get('/', function(req, res) {
    res.send('Finalizer server.');
});

server.use('/api', baseRoutes);

server.listen(PORT, HOST, function() {
    console.log('Finalizer server running ');
});
