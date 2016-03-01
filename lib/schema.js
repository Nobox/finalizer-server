var caminte = require('caminte');
var Schema = caminte.Schema;
    require('dotenv').config();

console.log('schema',process.env.REDIS_PASSWORD);
var redisConfig = {
    driver: 'redis',
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
};

module.exports = new Schema(redisConfig.driver, redisConfig);
