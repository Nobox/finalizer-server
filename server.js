var express = require('express');
var bodyParser = require('body-parser');
var baseRoutes = require('./routes/base');
var server = express();
var habitat = require('habitat');
var env = habitat.load('./.env');
var PORT = process.env.SERVER_PORT;
var HOST = process.env.PRIVATE_IP;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.get('/', function(req, res) {
    res.send('Finalizer server.');
});

server.use('/api', baseRoutes);

server.listen(PORT, HOST, function() {
    console.log('Finalizer server running ');
});
