const mongoose = require('mongoose')
const config = require('../config/database')
const autoIncrement = require('mongoose-auto-increment')

mongoose.Promise = global.Promise

const auth = config.mongo.user
  ? `${config.mongo.user}:${config.mongo.password}@`
  : ''
const url = config.mongo.url
  ? config.mongo.url
  : `mongodb://${auth}${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`

const connection = mongoose.connect(url)

autoIncrement.initialize(connection)

module.exports = mongoose

