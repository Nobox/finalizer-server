var caminte = require('caminte');
var Schema = caminte.Schema;
var config = {
    driver: 'redis',
    host: 'localhost',
    port: 6379,
    password: '',
};

module.exports = new Schema(config.driver, config);
