'use strict'

const Router = require('koa-router')
const co = require('co')
const _ = require('lodash')
const moment = require('moment')

const Project = require('../../models/project')
const Stage = require('../../models/stage')
const Evaluation = require('../../models/evaluation')
const User = require('../../models/user')
const MentorSlot = require('../../models/mentorSlot')
const Review = require('../../models/review')

const bcryptUtils = require('../../lib/bcrypt')
const role = require('../../middlewares/role')

const projectRouter = Router({
	prefix: '/projects'
})

projectRouter.get('/', role('staff'), co.wrap(function *(ctx, next) {
	const stage = ctx.state.stage
	const user = ctx.state.user
	const query = ctx.request.query
	const find = {}

	if (query.participating) {
		find.participating = true
	}

	let projects = yield Project.find(find).sort('number')

	if (query.evaluated) {
		const evaluations = yield Evaluation
			.find({ user: user._id, stage: stage._id })
			.select({ project: 1 })

		projects = projects.map((project) => {
			const evaluated = _.find(evaluations, (e) => e.project.equals(project._id)  )

			return _.assign({}, project.toJSON(), { evaluated: !!evaluated })
		})
	}

	ctx.body = projects
}))

projectRouter.post('/', co.wrap(function *(ctx, next) {
	const project = new Project(ctx.request.body)
	yield project.save()

	ctx.body = project
}))

projectRouter.post('/table', co.wrap(function *(ctx, next) {
	const body = ctx.request.body
	const limit = parseInt(body.length, 10)
	const skip = parseInt(body.start, 10)
	const query = {}

	if (body.search.value) {
		if (!_.isNaN(parseInt(body.search.value))) {
			query.number = parseInt(body.search.value)
		} else {
			const value = body.search.value
			query.name = { '$regex': value, '$options': 'i' }
		}
	}

	const projects = yield Project
		.find(query)
		.limit(limit)
		.skip(skip)
		.select({ name: 1, number: 1, vertical: 1, uuid: 1 })
	const total = yield Project.count(query)

	yield ctx.body = { data: projects, recordsTotal: total, recordsFiltered: total }
}))

projectRouter.post('/create-with-owner', co.wrap(function *(ctx, next) {
	const body = ctx.request.body
	let user = yield User.findOne({ email: body.user.email })

	if(user){
		if(user.role !== 'participant'){
			ctx.throw(401, 'Solo participantes pueden crear projectos')
		}

		if(user.project){
			ctx.throw(401, 'Ya tienes un projecto asignado')
		}
	}

	body.user.password = yield bcryptUtils.hash(body.user.password, bcryptUtils.rounds)

	if(user){
		_.assign(user, body.user)
		yield user.save()
	} else {
		user = yield User.create(body.user)
	}

	const project = new Project(body.project)
	project.owner = user
	yield project.save()

	user.project = project
	yield user.save()

	if (!ctx.state.user) {
		const session = ctx.session
		session.userUuid = user.uuid
	}

	ctx.body = { message: 'Ok' }
}))

projectRouter.get('/mentorship', co.wrap(function *(ctx, next) {
	const project = yield Project.findOne({_id: ctx.state.user.project})

	const mentorSlot = yield MentorSlot
		.findOne({ project: project._id, mentorRate:{$exists:false} })
		.populate('mentor', 'name -_id')

	if(mentorSlot){
		const slot = mentorSlot.toJSON()
		slot.current = moment(mentorSlot.endTime).diff(new Date(), 'minutes') >= 0 ? true : false

		slot.startTime = moment(mentorSlot.startTime).format('HH:mm')
		slot.endTime = moment(mentorSlot.endTime).format('HH:mm')
		ctx.body = {
			mentorSlot: _.pick(slot, ['endTime', 'startTime', 'table', 'current', 'mentor', 'uuid'])
		}
		return
	}

	const availableSkills = yield MentorSlot.find({
		startTime: { $gte: new Date() },
		project: { $exists:false }
	}).distinct('mentorSkills')

	ctx.body = {
		skills: availableSkills
	}
}))

projectRouter.post('/mentorship', co.wrap(function *(ctx, next) {
	const body = ctx.request.body
	const project = yield Project.findOne({_id: ctx.state.user.project})

	const currentSlot = yield MentorSlot.findOne({
		project:project._id,
		mentorRate: { $exists:false }
	})
	ctx.assert(!currentSlot, 422, 'Por el momento tienes una mentoria asignada o una mentoria sin calificar')

	const mentorSlot = yield MentorSlot.findOne({
		project: { $exists: false },
		startTime: { $gte: new Date() },
		mentorSkills: { $in: [body.skill] }
	}).sort({ startTime: 1 })
	ctx.assert(mentorSlot, 422, `No hay mentores disponibles para ${body.skill}`)

	mentorSlot.skill = body.skill
	mentorSlot.project = project._id
	yield mentorSlot.save()

	ctx.body = {
		startTime: moment(mentorSlot.startTime).format('HH:mm'),
		endTime: moment(mentorSlot.endTime).format('HH:mm'),
		table: mentorSlot.table
	}
}))

projectRouter.post('/can-evaluate', co.wrap(function *(ctx, next) {
	const user = ctx.state.user

	const project = yield Project.findOne({ number: ctx.request.body.projectNumber })
	ctx.assert(project, 404, 'El projecto no existe')

	const stage = yield Stage.findOne({
		isActive:true,
		evaluation: { $exists: true, $gt: { $size: 0 } }
	})
	ctx.assert(stage, 401, 'No se pueden realizar evaluaciónes en esta etapa')

	const evaluation = yield Evaluation.findOne({
		project: project._id,
		user: user._id,
		stage: stage._id
	})

	ctx.assert(!evaluation, 401, 'El projecto ' + project.number + ' ya fue evaluado por ti.')

	ctx.body = project
}))

projectRouter.post('/mentorship/:uuid/evaluate', co.wrap(function *(ctx, next) {
	const body = ctx.request.body
	const mentorSlotUuid = ctx.params.uuid

	const mentorSlot = yield MentorSlot.findOne({ uuid: mentorSlotUuid })
	ctx.assert(mentorSlot, 401, 'No hemos podido evaluar el mentor en este momento, intentalo mas tarde')

	mentorSlot.mentorRate = body.mentorRate
	yield mentorSlot.save()

	ctx.body = {
		success: 'Gracias por evaluar el mentor'
	}
}))

projectRouter.get('/:uuid', co.wrap(function *(ctx, next){
	// add participating
	const project = yield Project.findOne({ uuid: ctx.params.uuid })
	ctx.assert(project, 404)
	ctx.body = project
}))

projectRouter.post('/:uuid/evaluation', co.wrap(function *(ctx, next){
	const body = ctx.request.body
	const user = ctx.state.user

	const project = yield Project.findOne({ uuid: ctx.params.uuid, participating: true })
	if (!project) {
		ctx.throw(404)
	}

	const stage = yield Stage.findOne({ isActive:true })
	const evaluation = yield Evaluation.findOne({
		project: project._id,
		user: user._id,
		stage: stage._id
	})

	if (evaluation) {
		ctx.throw(403, 'El projecto ' + project.number +' ya fue evaluado por ti.')
	}

	yield Evaluation.create({
		project: project._id,
		user: user._id,
		stage: stage._id,
		answers: body
	})

	ctx.body = {
		success: 'Proyecto ' + project.number + ' evaluado con exito.'
	}
}))

projectRouter.post('/:uuid/reviews', co.wrap(function *(ctx, next){
	const stage = yield Stage.findOne({ isActive: true })
	const project = yield Project.findOne({ uuid: ctx.params.uuid, participating: true })
	ctx.assert(project, 401)

	let review = yield Review.findOne({
		project: project._id,
		stage: stage._id
	})

	if (review) {
		review.answers = ctx.request.body
	} else {
		review = new Review({
			answers: ctx.request.body,
			project: project._id,
			stage: stage._id
		})
	}

	yield review.save()

	ctx.body = {
		success: 'Ok'
	}
}))

projectRouter.get('/:uuid/reviews', co.wrap(function *(ctx, next) {
	const project = yield Project.findOne({ uuid: ctx.params.uuid })
	const reviews = yield Review.find({ project: project._id })

	ctx.body = { reviews }
}))


projectRouter.get('/:uuid/reviews/:stageUuid', co.wrap(function *(ctx, next) {
	const stage = yield Stage.findOne({ uuid: ctx.params.stageUuid })
	const project = yield Project.findOne({ uuid: ctx.params.uuid  })
	const review = yield Review.findOne({ project: project._id, stage: stage._id })

	ctx.body = { review }
}))

projectRouter.post('/:uuid/reviews/:stageUuid', co.wrap(function *(ctx, next) {
	const stage = yield Stage.findOne({ uuid: ctx.params.stageUuid })
	const project = yield Project.findOne({ uuid: ctx.params.uuid  })
	const review = yield Review.findOne({ project: project._id, stage: stage._id })

	review.completed = true
	yield review.save()

	ctx.body = { message: 'Ok' }
}))

projectRouter.get('/:uuid/team', co.wrap(function *(ctx, next){
	const project = yield Project.findOne({ uuid: ctx.params.uuid })

	const team = yield User.find({$or: [
		{ project: project._id },
		{ invitedTo: {$in: [project._id]} }
	]})

	ctx.body = {
		team
	}
}))

projectRouter.get('/:uuid/mentorship', co.wrap(function *(ctx, next){
	const project = yield Project.findOne({ uuid: ctx.params.uuid })

	const team = yield User.find({$or: [
		{ project: project._id },
		{ invitedTo: {$in: [project._id]} }
	]})

	ctx.body = {
		team
	}
}))

projectRouter.get('/:uuid/mentor-slots', co.wrap(function *(ctx, next){
	const project = yield Project.findOne({ uuid: ctx.params.uuid })
	const mentorSlots = yield MentorSlot.find({
			project: project._id
		})
		.populate('mentor', 'name uuid')

	const data = mentorSlots.map((slot)=>{
		const data = slot.toJSON()
		data.timeLabel = moment(slot.startTime).format('HH:mm') + ' -> ' + moment(slot.endTime).format('HH:mm')
		return data
	})

	ctx.body = {
		mentorSlots: data
	}
}))

projectRouter.get('/:uuid/evaluations', co.wrap(function *(ctx, next){
	const project = yield Project.findOne({ uuid: ctx.params.uuid })
	const evaluations = yield Evaluation.find({ project:project._id })
		.populate('user', 'name uuid')

	ctx.body = {
		evaluations: evaluations
	}
}))

projectRouter.post('/:uuid/vertical', co.wrap(function *(ctx, next){
	const vertical = ctx.request.body.vertical
	const project = yield Project.findOne({ uuid: ctx.params.uuid })

	project.vertical = vertical
	yield project.save()

	ctx.body = {
		message: 'Vertical actualizada'
	}
}))

module.exports = projectRouter
