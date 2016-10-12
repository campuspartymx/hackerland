const Router = require('koa-router')
const co = require('co')
const _ = require('lodash')

const hackathonStructure = require('../config/hackathonStructure')
const Stage = require('../models/stage')
const Project = require('../models/project')

const apiRouter = Router()

apiRouter.get('/status', co.wrap(function *(ctx, next){
	ctx.body = {status:'ok'}
}))

apiRouter.get('/current-data', co.wrap(function *(ctx, next){
	const stage = yield Stage.findOne({isActive:true})
	const structure = _.cloneDeep(hackathonStructure)
	delete structure.stages
	structure.currentStage = stage

	if(ctx.session.userUuid){
		structure.currentUser = ctx.state.user

		if (structure.currentUser && structure.currentUser.project) {
			structure.currentProject = yield Project.findById(structure.currentUser.project)
		}
	}

	ctx.body = structure
}))

const stagesRouter = require('./api/stages')
apiRouter.use(stagesRouter.routes(), stagesRouter.allowedMethods())

const teamRouter = require('./api/team')
apiRouter.use(teamRouter.routes(), teamRouter.allowedMethods())

const projectsRouter = require('./api/projects')
apiRouter.use(projectsRouter.routes(), projectsRouter.allowedMethods())

const usersRouter = require('./api/users')
apiRouter.use(usersRouter.routes(), usersRouter.allowedMethods())

const dataRouter = require('./api/data')
apiRouter.use(dataRouter.routes(), dataRouter.allowedMethods())

const verticalsRouter = require('./api/verticals')
apiRouter.use(verticalsRouter.routes(), verticalsRouter.allowedMethods())

module.exports = apiRouter
