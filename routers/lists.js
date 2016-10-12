const Router = require('koa-router')
const co = require('co')
const _ = require('lodash')

const Stage = require('../models/stage')

const listRouter = Router()

listRouter.get('/stage/:uuid', co.wrap(function *(ctx, next){
	const activeStage = yield Stage.findOne({uuid:ctx.params.uuid})

	ctx.assert(activeStage, 404)

	if(activeStage.evaluated){
		yield ctx.render('public/webpack',{
			scriptSrc: 'results.js'
		})
	}else{
		const stage = yield Stage.findOne({evaluated:true}).sort('-step')

		ctx.redirect(`/listados/stage/${stage.uuid}`)
	}
}))

module.exports = listRouter