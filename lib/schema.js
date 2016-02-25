var caminte = require('caminte');
var Schema = caminte.Schema;
var config = require('../config');
var nodeEnv = process.env.NODE_ENV;

var config = {
    driver: 'redis',
    host: config[nodeEnv].redisHost,
    port: config[nodeEnv].redisPort,
    password: config[nodeEnv].redisPassword
};

module.exports = new Schema(config.driver, config);
