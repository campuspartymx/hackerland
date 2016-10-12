const db = require('../lib/db')
const Schema = require('mongoose').Schema
const autoIncrement = require('mongoose-auto-increment')
const v4 = require('node-uuid').v4

const ProjectSchema = new Schema({
	uuid: { type: String, default: v4},
	name: {type:String, require: true},
	idea: {type:String},
	description: {type:String},

	vertical: {type:String, default:''}, // 'salud', 'alimentacion', 'educacion', 'vivienda', 'inclusion laboral', 'inclusion financiera'
	hackathons: [{ type: String }],
	evaluation: { type: Schema.Types.Mixed },
	scores: Schema.Types.Mixed,

	reviews: { type: Number, default: 0 },
	reviewedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],

	participating: { type: Boolean, default: true },
	stageResults: { type: Schema.Types.Mixed },

	owner: { type: Schema.Types.ObjectId, ref: 'User' },

	history: { type: Boolean }
})

ProjectSchema.plugin(autoIncrement.plugin, {
    model: 'Project',
    field: 'number',
    startAt: 1000
})

const Project = db.model('Project', ProjectSchema)

module.exports = Project
