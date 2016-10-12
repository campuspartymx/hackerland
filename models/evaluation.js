'use strict'
const co = require('co')
const _ = require('lodash')

const db = require('../lib/db')
const Schema = require('mongoose').Schema

const evaluationSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
	project: { type: Schema.Types.ObjectId, ref: 'Project', require: true },
	stage: { type: Schema.Types.ObjectId, ref: 'Stage', require: true },

	answers: { type: Schema.Types.Mixed },
	score: { type: Number, default: 0 }
})

evaluationSchema.pre('save', function (next) {
	const doc = this
	const Stage = this.model('Stage')

	co(function *() {
		let score = 0
		const stage = yield Stage.findOne({ _id: doc.stage })

		stage.evaluation.forEach((ev) => {
			if (!ev.weight) return
			if (typeof doc.answers[ev.name] !== 'number') return
			score += doc.answers[ev.name] * ev.weight
		})

		doc.score = score
		next()
	}).catch(next)
})

evaluationSchema.post('save', function (doc) {
	const Evaluation = this.model('Evaluation')
	const Project = this.model('Project')
	const Stage = this.model('Stage')

	co(function *() {
		const stage = yield Stage.findOne({ _id: doc.stage })
		const evaluations = yield Evaluation.find({ project: doc.project, stage: doc.stage })

		const sum = evaluations.reduce((memo, evaluation) => {
			return memo + evaluation.score
		}, 0)

		const set = {}
		set[`scores.${stage.description.name}`] = Math.round((sum / evaluations.length) * 100) / 100
		yield Project.update({ _id: doc.project }, { $set: set })
	}).catch(function(err){
		console.log(err)
	})
})

const Evaluation = db.model('Evaluation', evaluationSchema)

module.exports = Evaluation
