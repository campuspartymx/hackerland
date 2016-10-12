'use strict'

const Router = require('koa-router')
const co = require('co')

const User = require('../../models/user')

const userRouter = Router({
	prefix: '/users'
})

userRouter.get('/', co.wrap(function *(ctx, next) {
	const type = ctx.request.query.type
	let pageName

	if (type === 'participants') {
		pageName = 'Participantes'
	} else if (type === 'mentors') {
		pageName = 'Mentores'
	} else if (type === 'judges') {
		pageName = 'Jueces'
	} else if (type === 'staff') {
		pageName = 'Staff'
	} else {
		pageName = 'Usuarios'
	}

	yield ctx.render('admin/users',{
		pageName,
		tab: 'users'
	})
}))

userRouter.get('/:uuid', co.wrap(function *(ctx, next) {
	const user = yield User.findOne({ uuid: ctx.params.uuid })

	ctx.assert(user, 404)

	yield ctx.render('admin/webpack',{
		scriptSrc: 'user.js',
		tab: 'users'
	})
}))

module.exports = userRouter
