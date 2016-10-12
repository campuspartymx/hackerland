const _ = require('lodash')
const path = require('path')

const config = process.env.HACKATHON_STRUCTURE
  ? _.merge({}, require('../data/base'), require(path.resolve(process.env.HACKATHON_STRUCTURE)))
  : require('../data/base')

module.exports = config
