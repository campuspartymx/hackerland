'use strict'
// node tasks/dev/create-review-data.js

require('../../loadenv')
const co = require('co')
const _ = require('lodash')

const bank = require('./bank.js')
const bcryptUtils = require('../../lib/bcrypt')
const db = require('../../lib/db')
const User = require('../../models/user')
const Stage = require('../../models/stage')
const Project = require('../../models/project')
const Review = require('../../models/review')

co(function*(){
	const stage = yield Stage.findOne({ isActive: true })
	if (!stage.review) throw new Error('Not found review data')

	const projects = yield Project.find({ participating: true })

	for (const project of projects) {
		const review = new Review({
			answers: {},
			project: project._id,
			stage: stage._id
		})
		createData(stage.review, review.answers)
		yield review.save()
	}

}).then(function () {
	process.exit()
}).catch(function (err) {
	console.log(err)
	console.log(err.stack)
	process.exit(1)
})

function createData(elem, obj) {
	if (elem.type === 'Object') {
		return _.map(Object.keys(elem.properties), (prop) => {
			const isObject = elem.properties[prop].type === 'Object'
			if (!obj[prop] && isObject) {
				obj[prop] = {}
			}

			const el = _.assign(elem.properties[prop], { name: prop })
			return createData(el, isObject ? obj[prop] : obj)
		})
	}

	switch (elem.type) {
		case 'LongString':
			obj[elem.name] = _.sampleSize(bank, 20).join(' ')
			break
		case 'String':
			obj[elem.name] = _.sampleSize(bank, 5).join(' ')
			break
		case 'Select':
			obj[elem.name] = _.sample(elem.enum)
			break
		case 'Array':
			obj[elem.name] = _.sample(elem.items.enum)
			break
		default:
			obj[elem.name] = _.sampleSize(bank, 5).join(' ')
	}
}
