'use strict'

const Router = require('koa-router')
const co = require('co')
const v4 = require('node-uuid').v4

const Project = require('../../models/project')
const User = require('../../models/user')

const bcryptUtils = require('../../lib/bcrypt')

const teamRouter = Router({
	prefix: '/projects/team'
})

teamRouter.get('/', co.wrap(function *(ctx, next) {
	const team = yield User.find({ $or: [
		{ project: ctx.state.user.project },
		{ invitedTo: {$in: [ctx.state.user.project]} }
	]})

	ctx.body = team
}))

teamRouter.post('/invite', co.wrap(function *(ctx, next){
	const body = ctx.request.body
	const project = yield Project.findById(ctx.state.user.project)

	const team = yield User.find({$or: [
		{ project: project._id },
		{ invitedTo: { $in: [project._id] } }
	]})
	ctx.assert(team.length < 5, 401, 'Los equipos tienen un maximo de 5 participantes')

	const previousUser = yield User.findOne({ email: body.email })
	if (!previousUser) {
		const password = yield bcryptUtils.hash(v4(), bcryptUtils.rounds)
		const user = yield User.create({
			name : body.name,
			email : body.email,
			password,
			invitedTo:[project._id]
		})

		yield user.sendInviteToProject(project)
		ctx.body = {
			success: 'Invitacion enviada'
		}
		return
	}

	ctx.assert(previousUser.role !== 'staff', 401, 'Los miembros del staff no pueden participar en el hackaton')
	ctx.assert(!previousUser.project, 401, 'Este usuario ya tiene proyecto')

	previousUser.invitedTo.push(project._id)
	yield previousUser.save()
	yield previousUser.sendInviteToProject(project)

	ctx.body = {
		success: 'Invitacion enviada'
	}
}))

teamRouter.get('/leave', co.wrap(function *(ctx, next){
	const user = ctx.state.user
	const project = yield Project.findById(ctx.state.user.project)

	ctx.assert(!project.owner.equals(user._id), 401, 'No se puede remover al dueño del proyecto')

	user.project = null
	user.invitedTo.remove(project._id)
	yield user.save()

	ctx.session.userUuid = null

	ctx.body = {
		success: 'Haz abandonado el proyecto, ahora puedes crear el tuyo o ser invitado a otro proyecto'
	}
}))

teamRouter.post('/remove/:uuid', co.wrap(function *(ctx, next){
	const userUuid = ctx.params.uuid
	const requestUser = ctx.state.user
	const project = yield Project.findById(ctx.state.user.project)

	ctx.assert(project.owner.equals(requestUser._id), 401, 'No tienes permisos para remover participantes de este proyecto')

	const user = yield User.findOne({ uuid: userUuid })
	user.project = null
	user.invitedTo.remove(project._id)
	yield user.save()

	ctx.body = {
		success: 'El participante ha sido removido de este equipo'
	}
}))

module.exports = teamRouter
