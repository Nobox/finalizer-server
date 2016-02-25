module.exports = {
  development: {
    redisPort: 6379,
    redisHost: 'localhost',
    redisPassword: ''
  },
  production: {
    redisPort: process.env.REDIS_PORT,
    redisHost: process.env.REDIS_HOST,
    redisPassword: process.env.REDIS_PASSWORD
  }
};
