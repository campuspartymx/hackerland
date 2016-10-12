const Router = require('koa-router')
const co = require('co')

const Vertical = require('../../models/vertical')

const verticalsRouter = Router({
	prefix: '/verticals'
})


verticalsRouter.get('/', co.wrap(function *(ctx, next){
	yield ctx.render('admin/webpack',{
		scriptSrc: 'admin-verticals.js',
		pageName: 'Verticales',
		tab: 'admin'
	})
}))

verticalsRouter.get('/:uuid', co.wrap(function *(ctx, next){
	const vertical = yield Vertical.findOne({ uuid: ctx.params.uuid })

	ctx.assert(vertical, 404)

	yield ctx.render('admin/webpack',{
		pageName: 'Vertical '+vertical.name,
		scriptSrc: 'admin-vertical.js',

		deleteUri: '/admin/verticals/'+vertical.uuid+'/delete'
	})
}))

verticalsRouter.post('/:uuid/delete', co.wrap(function *(ctx, next){
	const vertical = yield Vertical.findOne({ uuid: ctx.params.uuid })

	ctx.assert(vertical, 404)

	yield vertical.remove()
	ctx.redirect('/admin/verticals')
}))

module.exports = verticalsRouter
