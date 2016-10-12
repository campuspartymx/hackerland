const request = require('superagent')
const superagentPromisePlugin = require('superagent-promise-plugin')
superagentPromisePlugin.Promise = require('es6-promise')

module.exports = request
