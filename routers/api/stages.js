'use strict'

const Router = require('koa-router')
const co = require('co')
const mongoose = require('mongoose')
const _ = require('lodash')

const Stage = require('../../models/stage')
const Project = require('../../models/project')

const stageRouter = Router({
	prefix: '/stages'
})

stageRouter.get('/', co.wrap(function *(ctx, next){
	const stages = yield Stage.find({}, {name: 1, uuid: 1, description: 1, isActive: 1, _id: 1, review: 1}).sort({ step: 1 })
	ctx.body = { stages }
}))

stageRouter.post('/', co.wrap(function *(ctx, next){
	const stageId = ctx.request.body.stageId

	ctx.assert(stageId, 401, 'Ya tienes un proyecto asignado')

	yield Stage.update({}, { isActive: false }, { multi: true })
	yield Stage.update({ _id: stageId }, { isActive: true })

	ctx.body = {
		success: 'Etapa actualizada'
	}
}))

stageRouter.get('/:uuid', co.wrap(function *(ctx, next){
	const query = mongoose.Types.ObjectId.isValid(ctx.params.uuid)
		? { _id: ctx.params.uuid }
		: { uuid: ctx.params.uuid }
	const stage = yield Stage.findOne(query)

	ctx.assert(stage, 404)

	ctx.body = stage
}))

stageRouter.post('/:uuid', co.wrap(function *(ctx, next){
	const stage = yield Stage.findOne({ uuid: ctx.params.uuid })
	const body = ctx.request.body

	ctx.assert(stage, 404)

	_.forIn(body, (value, key) => {
		if(stage.data[key]){
			stage.data[key].value = value
		}
	})

	stage.markModified('data')
	yield stage.save()

	ctx.body = {
		success: 'Información actualizada.'
	}
}))

stageRouter.post('/:uuid/calculate-evaluation', co.wrap(function *(ctx, next) {
	const stage = yield Stage.findOne({ uuid: ctx.params.uuid })
	const projects = yield calculateEvaluation(stage, ctx.request.body)

	ctx.body = projects
}))

stageRouter.post('/:uuid/save-evaluation', co.wrap(function *(ctx, next) {
	const stage = yield Stage.findOne({ uuid: ctx.params.uuid })
	const projects = yield calculateEvaluation(stage, ctx.request.body)
	const projectIds = projects.map(p => p._id)
	const set = { participating: false }

	set[`stageResults.${stage.description.name}`] = false
	yield Project.update({}, { $set: set }, { multi: true })

	set.participating = true
	set[`stageResults.${stage.description.name}`] = true
	yield Project.update({ _id: { $in: projectIds } }, { $set: set  }, { multi: true })

	stage.evaluated = true
	yield stage.save()

	ctx.body = { message: 'Ok' }
}))

function *calculateEvaluation(stage, body) {
	const include = body.include || []
	let exclude = body.exclude || []
	let limit = body.limit || 0

	const select = { name: 1, number: 1 }
	select[`scores.${stage.description.name}`] = 1
	const sort = {}
	sort[`scores.${stage.description.name}`] = -1

	let includeProjects = yield Project
		.find({ number: { $in: include } })
		.select(select)

	includeProjects = includeProjects.filter((p) => exclude.indexOf(p.number) === -1)

	exclude = exclude.concat(includeProjects.map((p) =>p.number))
	limit -= includeProjects.length

	const find = {
		number: { $nin: exclude },
	}
	find[`scores.${stage.description.name}`] = { $exists: true }

	if (body.vertical) {
		find.vertical =  body.vertical
	}

	if(limit < 0){limit = 0}

	let projects = yield Project
		.find(find)
		.limit(limit)
		.select(select)
		.sort(sort)

	projects = projects
		.concat(includeProjects)

	projects.sort((a, b) => {
		const score = (b.scores ? b.scores[stage.description.name] : 0) - (a.scores ? a.scores[stage.description.name] : 0)
		return score || 0
	})

	return projects
}

stageRouter.get('/:uuid/results', co.wrap(function *(ctx, next){
	const stage = yield Stage.findOne({ uuid: ctx.params.uuid })
	ctx.assert(stage, 404)

	const query = {}
	query[`stageResults.${stage.description.name}`] = true
	const sort = {}
	sort[`scores.${stage.description.name}`] = -1

	const projects = yield Project.find(query).sort(sort)

	ctx.body = projects
}))

module.exports = stageRouter
