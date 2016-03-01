var envs = require('envs')

module.exports = {
    nodeEnv: envs('NODE_ENV', 'development'),
    redisPort: envs('REDIS_PORT', 6379),
    redisHost: envs('REDIS_URL', 'localhost'),
    redisPassword: envs('REDIS_PASSWORD', ''),
    privateIP: envs('PRIVATE_IP', 'localhost'),
    serverPort: envs('SERVER_PORT', 8080)
};
