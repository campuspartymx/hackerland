const Router = require('koa-router')
const co = require('co')

const Project = require('../../models/project')

const projectRouter = Router({
	prefix: '/projects'
})

projectRouter.get('/', co.wrap(function *(ctx, next){
	yield ctx.render('admin/projects',{
		pageName: 'Projectos',
		tab: 'projects'
	})
}))

projectRouter.get('/:uuid', co.wrap(function *(ctx, next){
	const project = yield Project.findOne({ uuid: ctx.params.uuid })

	ctx.assert(project, 404)

	yield ctx.render('admin/webpack',{
		scriptSrc: 'admin-project.js'
	})
}))

module.exports = projectRouter
