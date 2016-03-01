var caminte = require('caminte');
var Schema = caminte.Schema;
var config = require('../config');

var config = {
    driver: 'redis',
    host: config.redisHost,
    port: config.redisPort,
    password: config.redisPassword
};

module.exports = new Schema(config.driver, config);
