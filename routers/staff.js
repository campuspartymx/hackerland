const Router = require('koa-router')
const co = require('co')
const is = require('../middlewares/is')
const role = require('../middlewares/role')

const Project = require('../models/project')

const staffRouter = Router()

staffRouter.use(role('staff'))

staffRouter.use(co.wrap(function*(ctx, next){
	ctx.state.sectionName = 'Staff'
	if(ctx.path !== '/staff' && ctx.path !== '/staff/'){
		ctx.state.sectionLink = '/staff'
	}

	ctx.state.breadcrumbs = [{
		label: 'Zona de staff',
		link: '/staff'
	}]

	yield next()
}))

staffRouter.get('/', co.wrap(function *(ctx, next){
	yield ctx.render('staff/webpack',{
 		scriptSrc: 'staff.js'
 	})
}))

staffRouter.get('/evaluacion/:projectUuid', role('staff'), co.wrap(function *(ctx, next){
	const project = yield Project.findOne({ uuid: ctx.params.projectUuid })
	if (!project) {
		ctx.throw(404)
	}	

	ctx.state.breadcrumbs.push({
		label: 'Proyecto '+ project.number,
	})

	yield ctx.render('staff/webpack',{
 		scriptSrc: 'evaluation.js'
 	})
}))

module.exports = staffRouter
