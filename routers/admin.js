const Router = require('koa-router')
const co = require('co')
const is = require('../middlewares/is')

const Project = require('../models/project')
const User = require('../models/user')

const adminRouter = Router()

adminRouter.use(is('isAdmin'))

adminRouter.use( co.wrap(function *(ctx, next){
	ctx.state.user.letter = ctx.state.user.name[0]
	ctx.state.hasVerticals = ctx.state.hackathonStructure.hackathon.hasVerticals
	yield next()
}) )

adminRouter.get('/', co.wrap(function *(ctx, next){
	const participants = yield User.count({role:'participant'})
	const staff = yield User.count({role:'staff'})
	const projects = yield Project.count()

	yield ctx.render('admin/main',{
		scriptSrc: 'dashboard.js',
		participants,
		staff,
		projects
	})
}))

adminRouter.get('/welcome-data', co.wrap(function *(ctx, next){
	yield ctx.render('admin/webpack',{
		scriptSrc: 'welcome-data.js',
		tab: 'admin'
	})
}))

const stagesRouter = require('./admin/stages')
adminRouter.use(stagesRouter.routes(), stagesRouter.allowedMethods())

const usersRouter = require('./admin/users')
adminRouter.use(usersRouter.routes(), usersRouter.allowedMethods())

const projectsRouter = require('./admin/projects')
adminRouter.use(projectsRouter.routes(), projectsRouter.allowedMethods())

const verticalsRouter = require('./admin/verticals')
adminRouter.use(verticalsRouter.routes(), verticalsRouter.allowedMethods())

module.exports = adminRouter
