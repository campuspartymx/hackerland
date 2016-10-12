const Router = require('koa-router')
const co = require('co')

const Vertical = require('../../models/vertical')

const verticalsRouter = Router({
	prefix: '/verticals'
})

verticalsRouter.get('/', co.wrap(function *(ctx, next){
	ctx.body = yield Vertical.find()
}))

verticalsRouter.post('/', co.wrap(function *(ctx, next){
	const body = ctx.request.body
	console.log('Body =>', body)

	var vertical = yield Vertical.create(body)

	ctx.body = vertical
}))

verticalsRouter.get('/:uuid', co.wrap(function *(ctx, next){
	const vertical = yield Vertical.findOne({ uuid: ctx.params.uuid })

	ctx.assert(vertical, 404)

	ctx.body = vertical
}))

verticalsRouter.post('/:uuid', co.wrap(function *(ctx, next){
	const body = ctx.request.body
	const vertical = yield Vertical.findOne({ uuid: ctx.params.uuid })

	ctx.assert(vertical, 404)

	vertical.name = body.name
	vertical.description = body.description

	yield vertical.save()

	ctx.body = vertical
}))

module.exports = verticalsRouter
