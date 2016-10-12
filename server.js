require('./loadenv')

const Koa = require('koa')
const co = require('co')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const mount = require('koa-mount')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const flash = require('koa-flash')
const convert = require('koa-convert')
const helmet = require('koa-helmet')
const csrf = require('koa-csrf')
const nunjucks = require('nunjucks')
const render = require('yet-another-nunjucks-koa-render')
const errorHandler = require('./middlewares/errorHandler')
const logger = require('./middlewares/logger')
const redisClient = require('./lib/redis')

const server = new Koa()

// Adds helmet tools
server.use(convert(helmet()))

// View templates
server.use(render(nunjucks.configure('./views', {noCache: true}), {ext:'.html'}))

// Static files
server.use(mount('/assets', serve(__dirname + '/public', {defer:false})))

// Body parser
server.use(bodyParser())

// Session and flash config
server.keys = ['keys', 'keykeys'];
server.use(convert(session({
	store: redisStore({ client: redisClient })
})))

// csrf tokens
csrf(server)

server.use(convert(flash()))

// Error handler
server.use( co.wrap(errorHandler) )

// Logs response time and status
server.use(convert(logger))

// Loads app routers
const mainRouter = require('./routers/main')
server.use(mainRouter.routes()).use(mainRouter.allowedMethods())

module.exports = server
