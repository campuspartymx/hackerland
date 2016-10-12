'use strict'
const redis = require('redis')
const config = require('../config/database')

const options = config.redis.url
  ? `${config.redis.url}/${config.redis.db}`
  : {
    db: config.redis.db,
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    ttl: 60 * 60 * 24 * 14 * 7
  }

const client = redis.createClient(options)
module.exports = client

