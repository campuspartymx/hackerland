'use strict'

const Router = require('koa-router')
const co = require('co')
const _ = require('lodash')

const Data = require('../../models/data')

const dataRouter = Router({
	prefix: '/data'
})

dataRouter.get('/:key', co.wrap(function *(ctx, next) {
	const key = ctx.params.key
	const data = yield Data.findOne({ key })
	const body = {}
	body[key] = data ? data.value : null

	ctx.body = body
}))

dataRouter.post('/:key', co.wrap(function *(ctx, next) {
	let data = yield Data.findOne({ key: ctx.params.key })

	if (!data) {
		data = new Data({
			key: ctx.params.key,
			value: ctx.request.body
		})
	} else {
		data.value = _.assign({}, data.value, ctx.request.body)
	}

	yield data.save()

	ctx.body = {
		success: 'Información actualizada.'
	}
}))

module.exports = dataRouter
