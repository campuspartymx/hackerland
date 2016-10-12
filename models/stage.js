const db = require('../lib/db')
const Schema = require('mongoose').Schema
const v4 = require('node-uuid').v4

const stageSchema = new Schema({
	uuid: { type: String, default: v4},

	step: { type: Number, require: true },
	isActive: { type: Boolean, default: false },
	evaluated: { type: Boolean, default: false },

	// Stage configs
	description: Schema.Types.Mixed,
	data: Schema.Types.Mixed,
	evaluation: [Schema.Types.Mixed],
	review: Schema.Types.Mixed,
	staffLayout: Schema.Types.Mixed,
	projectLayout: Schema.Types.Mixed,
	registrationActive: { type: Boolean, default: false }
})

const Stage = db.model('Stage', stageSchema)

module.exports = Stage
