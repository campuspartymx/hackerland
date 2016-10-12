const Router = require('koa-router')
const co = require('co')

const Stage = require('../../models/stage')

const stageRouter = Router({
	prefix: '/stages'
})

stageRouter.get('/', co.wrap(function *(ctx, next){
	yield ctx.render('admin/webpack',{
		scriptSrc: 'stages.js',
		tab: 'admin'
	})
}))

stageRouter.get('/:uuid', co.wrap(function *(ctx, next){
	const stage = yield Stage.findOne({uuid:ctx.params.uuid})

	ctx.assert(stage, 404)

	yield ctx.render('admin/webpack',{
		pageName: `Etapa: ${stage.description.label}`,
		scriptSrc: 'stage.js',
		dataSrc: '/api/stages/'+ ctx.params.uuid,
		dataSegment: '',
		tab: 'admin'
	})
}))

stageRouter.get('/:uuid/results', co.wrap(function *(ctx, next){
	const stage = yield Stage.findOne({uuid:ctx.params.uuid})
	ctx.assert(stage, 404)

	yield ctx.render('admin/webpack',{
		scriptSrc: 'results.js',
		tab: 'admin'
	})
}))

module.exports = stageRouter
