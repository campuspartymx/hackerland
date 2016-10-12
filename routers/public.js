'use strict'

const Router = require('koa-router')
const co = require('co')
const Joi = require('joi')
const thunkify = require('thunkify')
const convert = require('koa-convert')
const csrf = require('koa-csrf')

const bcryptUtils = require('../lib/bcrypt')
const logger = require('../lib/logger')

const User = require('../models/user')

const validate = thunkify(Joi.validate)

const publicRouter = Router()

publicRouter.use(convert(csrf()))

publicRouter.use(co.wrap(function*(ctx, next){
	if(ctx.state.user){
		return ctx.redirect('/proyecto')
	}

	yield next()
}))

publicRouter.get('/', co.wrap(function *(ctx, next) {
	yield ctx.render('public/webpack',{
		scriptSrc: 'home.js',
		csrf: ctx.csrf
	})
}))

publicRouter.get('/login', co.wrap(function *(ctx, next) {
	yield ctx.render('public/login',{
		csrf: ctx.csrf,
		error: ctx.flash.error
	})
}))

publicRouter.post('/login', co.wrap(function *(ctx, next) {
	const body = ctx.request.body
	const password = ctx.request.body.password
	const user = yield User.findOne({email: ctx.request.body.email, active: true})

	if(!user){
		ctx.flash = {'error': 'Usuario o password invalido'}
		return ctx.redirect('/login')
	}

	let compare
	try{
		compare = yield bcryptUtils.compare(password, user.password)
	}catch(err){
		ctx.throw(500, err)
	}

	if(compare){
		const session = ctx.session
		session.userUuid = user.uuid

		return ctx.redirect('/proyecto')
	}else{
		ctx.flash = {'error': 'Usuario o password invalido'}
		return ctx.redirect('/login')
	}
}))

publicRouter.get('/recuperar-password', co.wrap(function *(ctx, next) {
	yield ctx.render('public/forgotten-password',{
		success: ctx.flash.success,
		csrf: ctx.csrf
	})
}))

publicRouter.post('/forgotten-password', co.wrap(function *(ctx, next) {
	const user = yield User.findOne({email: ctx.request.body.email})

	if(user){
		yield user.sendForgottenPasswordEmail()
		ctx.flash = {'success': 'Email enviado'}
	}else{
		ctx.flash = {'success': 'No encontramos este email, ve a Coordinacion Hackaton para que te ayudemos'}
	}

	return ctx.redirect('/recuperar-password')
}))

module.exports = publicRouter
