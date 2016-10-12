const Schema = require('mongoose').Schema
const db = require('../lib/db')

const dataSchema = new Schema({
	key: { type: String, require: true },
	value: { type: Schema.Types.Mixed, require: true }
})

const Data = db.model('Data', dataSchema)

module.exports = Data
