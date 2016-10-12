const env = require('./env');

const config = {
  redis: {
    db: process.env.REDIS_DB || '0',
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
    password: process.env.REDIS_AUTH,
    url: process.env.REDIS_URL
  },
  mongo: {
    db: process.env.MONGO_DB || 'hacktrack',
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONG_PORT || '27017',
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
    url: process.env.MONGODB_URI
  }
}

module.exports = config

