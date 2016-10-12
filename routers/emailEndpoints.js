'use strict'

const Router = require('koa-router')
const co = require('co')
const convert = require('koa-convert')
const csrf = require('koa-csrf')
const moment = require('moment')
const _ = require('lodash')

const bcryptUtils = require('../lib/bcrypt')
const User = require('../models/user')
const Project = require('../models/project')
const hackathon = require('../config/hackathonStructure').hackathon

const emailEndpointsRouter = Router()

emailEndpointsRouter.use(convert(csrf()))

emailEndpointsRouter.get('/validate-email', co.wrap(function *(ctx, next){
	var email = ctx.request.query.email
	var token = ctx.request.query.token

	var user = yield User.findOne({email})

	if(user && user.emailKeys.token === token){
		user.validEmail = true
		user.active = true
		yield user.save()

		ctx.flash = {success:'Gracias por validar tu email'}
		return ctx.redirect('/proyecto')
	}else{
		yield ctx.render('email-endpoints/main',{
			error: 'El token y email no considen.'
		})
	}
}))

emailEndpointsRouter.get('/reset-password', co.wrap(function *(ctx, next) {
	var email = ctx.request.query.email
	var token = ctx.request.query.token

	var user = yield User.findOne({email})

	if(user && user.emailKeys.token === token){
		yield ctx.render('email-endpoints/reset-password',{
			token, email, csrf: ctx.csrf
		})
	}else{
		yield ctx.render('email-endpoints/reset-password',{
			error: 'El token y email no considen.'
		})
	}
}))

emailEndpointsRouter.post('/reset-password', co.wrap(function *(ctx, next) {
	var body = ctx.request.body

	if(body.confirmPassword !== body.password){
		return yield ctx.render('email/reset-password',{
			softError: 'El password y la confirmacion del password fueron distintas.',
			token: body.token,
			email: body.email
		})
	}

	var user = yield User.findOne({email: body.email})

	if(!user){
		return yield ctx.render('email/reset-password',{
			error: 'El token y email no considen.'
		})
	}

	if(user.emailKeys.token !== body.token){
		return yield ctx.render('email/reset-password',{
			error: 'El token y email no considen.'
		})
	}

	user.password = yield  bcryptUtils.hash(body.password, bcryptUtils.rounds)
	user.active = true

	yield user.save()

	var session = ctx.session
	session.userUuid = user.uuid

	return ctx.redirect('/proyecto')
}))

emailEndpointsRouter.get('/activar-cuenta/:userUuid', co.wrap(function *(ctx, next) {
	const userUuid = ctx.params.userUuid
	const flash = ctx.flash
	const user = yield User.findOne({ uuid: userUuid })

	if (!user || user.active) {
		yield ctx.render('email-endpoints/active-account',{
			error: !user ? 'El usuario no existe' : 'Usuario activado'
		})
	}

	yield ctx.render('email-endpoints/active-account', {
		user: user,
		skills: hackathon.mentorSkills,
		softError: flash.softError,
		csrf: ctx.csrf
	})
}))

emailEndpointsRouter.post('/activar-cuenta/:userUuid', co.wrap(function *(ctx, next) {
	const userUuid = ctx.params.userUuid
	const body = ctx.request.body
	const flash = ctx.flash
	const user = yield User.findOne({ uuid: userUuid })

	if (!user || user.active) {
		yield ctx.render('email-endpoints/active-account',{
			error: 'El usuario no existe'
		})
	}

	if (!body.name || !body.password) {
		ctx.flash = { softError: !body.name ? 'El nombre es requerido.' : 'El password es requerido.' }
		return ctx.redirect('back')
	}

	if (hackathon.mentorSkills && !body.skills) {
		ctx.flash = { softError: 'Selecciona al menos una habilidad.' }
		return ctx.redirect('back')

	}

	if(hackathon.mentorSkills && body.skills.length === 0){
		ctx.flash = { softError: 'Selecciona al menos una habilidad.' }
		return ctx.redirect('back')
	}

	if(hackathon.mentorSkills && body.skills.length > 3){
		ctx.flash = { softError: 'No puedes tener mas de 3 habilidades.' }
		return ctx.redirect('back')
	}

	user.password = body.password
	user.skills = body.skills
	user.name = body.name

	user.validEmail = true
	user.active = true
	yield user.save()

	var session = ctx.session
	session.userUuid = user.uuid

	return ctx.redirect('/staff')
}))

emailEndpointsRouter.get('/invitacion/:projectUuid', co.wrap(function *(ctx, next) {
	if (ctx.session.userUuid) {
		return ctx.redirect('/')
	}

	yield ctx.render('email-endpoints/invite-to-project',{
		scriptSrc: 'invite-to-project.js',
		csrf: ctx.csrf
	})
}))

emailEndpointsRouter.get('/invitacion/:projectUuid/validation', co.wrap(function *(ctx) {
	const email = ctx.request.query.email
	const projectUuid = ctx.params.projectUuid
	const error = 'Contacta al lider de tu equipo o a los organizadores.'

	const user = yield User.findOne({ email }, '-password')
	if (!user || user.active) {
		ctx.body = { error }
		return
	}

	const project = yield Project.findOne({uuid:projectUuid})
	if (!project || user.invitedTo.indexOf(project._id) === -1) {
		ctx.body = { error }
		return
	}

	ctx.body = { user }
}))

emailEndpointsRouter.post('/invitacion/:projectUuid', co.wrap(function *(ctx, next) {
	const body = ctx.request.body
	const email = ctx.request.query.email
	const projectUuid = ctx.params.projectUuid
	const error = 'Contacta al lider de tu equipo o a los organizadores.'

	let user = yield User.findOne({ email }, '-password')
	if (!user || user.active) {
		ctx.body = { error }
		return
	}

	const project = yield Project.findOne({uuid:projectUuid})
	if (!project || user.invitedTo.indexOf(project._id) === -1) {
		ctx.body = { error }
		return
	}

	if (user) {
		_.assign(user, body)
	} else {
		user = body
	}

	user.password = yield  bcryptUtils.hash(body.password, bcryptUtils.rounds)
	user.project = project._id
	user.active = true
	yield user.save()

	const session = ctx.session
	session.userUuid = user.uuid

	ctx.body = {
		message: 'Ok'
	}
}))

emailEndpointsRouter.get('/invitacion-a-participar/:userUuid', co.wrap(function *(ctx, next) {
	const userUuid = ctx.params.userUuid

	const user = yield User.findOne({ uuid: userUuid }).populate('project')
	if (!user || user.active) {
		ctx.throw(404)
	}

	yield ctx.render('email-endpoints/invite-to-participate',{
		user,
		csrf: ctx.csrf
	})
}))

emailEndpointsRouter.post('/invitacion-a-participar/:userUuid', co.wrap(function *(ctx, next) {
	const userUuid = ctx.params.userUuid
	const body = ctx.request.body

	const user = yield User.findOne({ uuid: userUuid })
	user.active = true
	user.password = yield  bcryptUtils.hash(body.password, bcryptUtils.rounds)
	yield user.save()

	const project = yield Project.findById(user.project)
	project.name = body.projectName
	project.idea = body.proyectIdea
	yield project.save()

	const session = ctx.session
	session.userUuid = user.uuid
}))

module.exports = emailEndpointsRouter
