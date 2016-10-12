'use strict'
// node tasks/dev/create-evaluation-data.js

require('../../loadenv')
const co = require('co')
const _ = require('lodash')

const bank = require('./bank.js')
const bcryptUtils = require('../../lib/bcrypt')
const db = require('../../lib/db')
const User = require('../../models/user')
const Stage = require('../../models/stage')
const Project = require('../../models/project')
const Evaluation = require('../../models/evaluation')

co(function*(){
	const stage = yield Stage.findOne({ isActive: true })
	if (!stage.evaluation || !stage.evaluation.length) throw new Error('Not found review data')

	const projects = yield Project.find({ participating: true })
	const numberOfJudges = 5
	const judgesIds = []

	console.log('Project =>', projects.length)
	console.log('Judges =>', numberOfJudges)
	for (let i = 0; i < numberOfJudges; i++) {
		const judge = yield createJudge()
		judgesIds.push(judge._id)
	}

	for (const project of projects) {
		const judges = _.sampleSize(judgesIds, 5)
		const evaluations = []
		for (let l = 0; l < judges.length; l++) {
			evaluations.push({
				user: judges[l % 5],
				project: project._id,
				stage: stage._id,
				answers: createData(stage.evaluation)
			})
		}

		console.log('Adding =>', project.number, evaluations.length)
		yield Evaluation.create(evaluations)
	}
}).then(function () {
	console.log('Generating scores')
	setTimeout(function(){
		console.log('Finished without errors')
		process.exit()
	}, 2000)
}).catch(function (err) {
	console.log(err)
	console.log(err.stack)
	process.exit(1)
})

function createData(schema) {
	const data = {}

	for (const prop of schema) {
		if (prop.type === 'Slider') {
			data[prop.name] = _.random(prop.minNum, prop.maxNum)
		}
	}

	return data
}

function *createJudge() {
	const password = yield	bcryptUtils.hash('test', bcryptUtils.rounds)

	return yield User.create({
		name: _.capitalize(_.sampleSize(bank, 2).join(' ')),
		email: _.sampleSize(bank, 2).join('.') + _.times(5, _.random).join('') + '@latteware.io',
		phone: _.times(10, _.random).join(''),
		active: true,
		role: 'staff',
		isJudge: true,
		password: password
	})
}

