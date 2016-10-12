const Router = require('koa-router')
const co = require('co')

const User = require('../models/user')
const Project = require('../models/project')
const Stage = require('../models/stage')
const Review = require('../models/review')

const projectRouter = Router()

projectRouter.use('', co.wrap(function *(ctx, next){
	if(ctx.path.indexOf('/proyecto') !== 0){
		return yield next()
	}

	const user = ctx.state.user

	if(!user){
		return ctx.redirect('/login')
	}

	if(user.role === 'staff'){
		return ctx.redirect('/staff')
	}

	const project = yield Project.findOne({_id:user.project})

	if(!project){
		ctx.session.userUuid = null
		ctx.flash = {error: 'No tienes un proyecto asignado. Crea uno nuevo o pide la invitacion a uno'}
		return ctx.redirect('/')
	}

	ctx.state.project = project
	ctx.state.sectionName = 'Proyecto '+project.number +' : '+ project.name

	if(ctx.path !== '/proyecto' && ctx.path !== '/proyecto/'){
		ctx.state.sectionLink = '/proyecto'
	}

	ctx.state.breadcrumbs = [{
		label: 'Proyecto',
		link: '/proyecto'
	}]

	yield next()
}))

projectRouter.get('/', co.wrap(function *(ctx, next){
	yield ctx.render('project/webpack',{
		scriptSrc: 'project.js'
	})
}))

projectRouter.get('/revision', co.wrap(function *(ctx, next) {
	const project = ctx.state.project
	const stage = yield Stage.findOne({ isActive: true })
	const review = yield Review.findOne({ project: project._id, stage: stage._id })

	if (review && review.completed) {
		ctx.redirect('/proyecto')
		return
	}

	yield ctx.render('project/webpack',{
		scriptSrc: 'review.js'
	})
}))

projectRouter.get('/revision/confirmar', co.wrap(function *(ctx, next) {
	const project = ctx.state.project
	const stage = yield Stage.findOne({ isActive: true })
	const review = yield Review.findOne({ project: project._id, stage: stage._id })

	if (review && review.completed) {
		ctx.redirect('/proyecto')
		return
	}

	yield ctx.render('project/webpack',{
		scriptSrc: 'review-confirm.js'
	})
}))

module.exports = projectRouter
