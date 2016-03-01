require('dotenv').config();

module.exports = {
    nodeEnv: process.env.NODE_ENV,
    redisPort: process.env.REDIS_PORT,
    redisHost: process.env.REDIS_URL,
    redisPassword: process.env.REDIS_PASSWORD,
    privateIP: process.env.PRIVATE_IP,
    serverPort: process.env.SERVER_PORT
};
