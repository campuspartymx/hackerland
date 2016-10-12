'use strict'

const Router = require('koa-router')
const co = require('co')
const moment = require('moment')
const _ = require('lodash')

const User = require('../../models/user')
const MentorSlot = require('../../models/mentorSlot')
const Evaluation = require('../../models/evaluation')

const MENTORSHIP_MINUTES = 15

function roundMinutes(minutes){
	return (parseInt((minutes + 7.5)/15) * 15) % 60
}

const userRouter = Router({
	prefix: '/users'
})

userRouter.post('/', co.wrap(function *(ctx, next) {
	const body = ctx.request.body

	const user = new User(body)
	yield user.save()

	ctx.body = user.toJSON()
}))

userRouter.post('/table', co.wrap(function *(ctx, next) {
	const body = ctx.request.body
	const type = ctx.request.query.type
	const limit = parseInt(body.length, 10)
	const skip = parseInt(body.start, 10)
	const query = {}

	if (type === 'participants') {
		query.role = 'participant'
	} else if (type === 'mentors') {
		query.role = 'staff'
		query.isMentor = true
	} else if (type === 'judges') {
		query.role = 'staff'
		query.isJudge = true
	} else {
		query.role = { $in: ['participant', 'staff']}
	}

	if (body.search.value) {
		const value = body.search.value
		query.$or = [
			{ name: { '$regex': value, '$options': 'i' } },
			{ email: { '$regex': value, '$options': 'i' } }
		]
	}

	const users = yield User
		.find(query)
		.limit(limit)
		.skip(skip)
	const total = yield User.count(query)

	yield ctx.body = { data: users, recordsTotal: total, recordsFiltered: total }
}))

userRouter.get('/mentor-slots', co.wrap(function *(ctx, next) {
	const user = ctx.state.user
	ctx.assert(user.isMentor, 401)

	const currentTime = moment()
	const startTime = moment().set('hour', currentTime.hour() ).set('minute', roundMinutes(currentTime.minutes()) ).set('second', 0)
	const endTime = moment(startTime).add(4, 'hours')
	const queryTime = moment(startTime).subtract(1, 'hour')

	const mentorSlots = yield MentorSlot.find({
		startTime: { $gte: queryTime.toDate() },
		mentor: ctx.state.user._id
	}).sort({ startTime: 1 }).populate('project')

	const slots = mentorSlots.map((slot)=>{
		const data = slot.toJSON()
		data.timeLabel = moment(slot.startTime).format('HH:mm') + ' -> ' + moment(slot.endTime).format('HH:mm')
		return data
	})

	ctx.body = { mentorSlots: slots }
}))

userRouter.get('/:uuid', co.wrap(function *(ctx, next) {
	const user = yield User.findOne({uuid: ctx.params.uuid})
		.populate('project')
		.populate('invitedTo', 'uuid name number')

	ctx.assert(user, 404)

	ctx.body = user
}))

userRouter.post('/:uuid/roles', co.wrap(function *(ctx, next){
	const body = ctx.request.body
	const user = yield User.findOne({uuid: ctx.params.uuid})

	ctx.assert(user && user.role === 'staff', 403)

	user.isMentor = body.isMentor ? true : false
	user.isJudge = body.isJudge ? true : false
	yield user.save()

	ctx.body = {
		success: 'Perfiles actualizados.'
	}
}))

userRouter.post('/:uuid/skills', co.wrap(function *(ctx, next){
	const body = ctx.request.body
	const user = yield User.findOne({ uuid: ctx.params.uuid })

	ctx.assert(user, 404)
	ctx.assert(user.role === 'staff', 403)
	ctx.assert(body.skills.length <= 3, 401, 'Solo puedes elegir 3 skills.')

	user.skills = body.skills
	yield user.save()
	yield MentorSlot.updateSkills(user)

	ctx.body = {
		success: 'Habilidades actualizadas.'
	}
}))

userRouter.post('/:uuid/table', co.wrap(function *(ctx, next){
	const body = ctx.request.body
	const user = yield User.findOne({ uuid: ctx.params.uuid })

	ctx.assert(user, 404)

	user.table = body.table
	yield user.save()

	ctx.body = {
		success: 'Mesa actualizada.'
	}
}))

userRouter.get('/:uuid/mentor-slots', co.wrap(function *(ctx, next) {
	const user = yield User.findOne({ uuid: ctx.params.uuid })
	const mentorSlots = yield MentorSlot.find({
		mentor: user._id
	}).populate('project', 'name number')

	const data = mentorSlots.map((slot)=>{
		const data = slot.toJSON()
		data.timeLabel = moment(slot.startTime).format('HH:mm') + ' -> ' + moment(slot.endTime).format('HH:mm')
		return data
	})

	ctx.body = {
		mentorSlots: data
	}
}))

userRouter.post('/:uuid/mentor-slots', co.wrap(function *(ctx, next) {
	const body = ctx.request.body
	const user = yield User.findOne({ uuid: ctx.params.uuid })

	ctx.assert(user, 404)
	ctx.assert(user.skills.length, 401, 'Necesitas tener habilidades para generar horarios de mentorias')

	const startTime = moment(new Date(body.initialHour))
	const endTime = moment(new Date(body.finalHour))
	const totalMinutes = endTime.diff(startTime, 'minutes')

	ctx.assert(totalMinutes >= 0, 401, 'Necesitas elegir por lo menos 15 minutos de mentorias')

	const numberOfSlots = totalMinutes / MENTORSHIP_MINUTES
	const slots = []

	const mentorSlots = yield MentorSlot.find({
		mentor: ctx.state.user._id
	}).sort({ startTime: 1 })

	for(let i = 0; i < numberOfSlots; i++) {
		const slot = _.find(mentorSlots, {
			startTime: startTime.toDate()
		})

		if(!slot){
			slots.push({
				startTime: startTime.toString(),
				endTime: startTime.add(MENTORSHIP_MINUTES, 'minute').toString(),
				table: ctx.request.body.table,
				mentor: user._id,
				mentorSkills: user.skills,
			})
		}else{
			startTime.add(MENTORSHIP_MINUTES, 'minute').toString()
		}
	}

	yield MentorSlot.create(slots)

	ctx.body = {
		success:'Sesiones de mentoria asignadas'
	}
}))

userRouter.get('/:uuid/evaluations', co.wrap(function *(ctx, next) {
	const user = yield User.findOne({ uuid: ctx.params.uuid })
	const evaluations = yield Evaluation.find({ user:user._id }).populate('project')

	ctx.body = {
		evaluations
	}
}))

module.exports = userRouter
