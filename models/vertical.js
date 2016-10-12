const db = require('../lib/db')
const Schema = require('mongoose').Schema
const v4 = require('node-uuid').v4

const verticalSchema = new Schema({
	uuid: { type: String, default: v4},

	name: { type: String, required: true },
	description: { type: String }
})

const Vertical = db.model('Vertical', verticalSchema)

module.exports = Vertical
