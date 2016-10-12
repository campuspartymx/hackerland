const Router = require('koa-router')
const co = require('co')
const convert = require('koa-convert')
const loadData = require('../middlewares/loadData')

const mainRouter = Router()

mainRouter.use(convert(loadData))

mainRouter.get('/logout', co.wrap(function *(ctx, next) {
	ctx.session = null
	ctx.redirect('/login')
}))

const adminRouter = require('./admin')
mainRouter.use('/admin', adminRouter.routes(), adminRouter.allowedMethods())

const apiRouter = require('./api')
mainRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods())

const staffRouter = require('./staff')
mainRouter.use('/staff', staffRouter.routes(), staffRouter.allowedMethods())

const projectRouter = require('./project')
mainRouter.use('/proyecto', projectRouter.routes(), projectRouter.allowedMethods())

const emailEndpointsRouter = require('./emailEndpoints')
mainRouter.use('/email', emailEndpointsRouter.routes(), emailEndpointsRouter.allowedMethods())

const profileRouter = require('./profile')
mainRouter.use('/perfil', profileRouter.routes(), profileRouter.allowedMethods())

const listsRouter = require('./lists')
mainRouter.use('/listados', listsRouter.routes(), listsRouter.allowedMethods())

const publicRouter = require('./public')
mainRouter.use('', publicRouter.routes(), publicRouter.allowedMethods())

module.exports = mainRouter
