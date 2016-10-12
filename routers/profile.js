const Router = require('koa-router')
const co = require('co')

const bcryptUtils = require('../lib/bcrypt')
const User = require('../models/user')
const Project = require('../models/project')
const MentorSlot = require('../models/mentorSlot')
const hackathon = require('../config/hackathonStructure').hackathon

const profileRouter = Router()

profileRouter.get('/', co.wrap(function *(ctx, next){
	if(!ctx.state.user){
		return ctx.redirect('/login')
	}

	const user = ctx.state.user
	const breadcrumbs = []
	if(user.role === 'staff'){
		breadcrumbs.push({
			label: 'Zona de staff',
			link: '/staff'
		})
	}else{
		breadcrumbs.push({
			label: 'Proyecto',
			link: '/proyecto'
		})
	}

	breadcrumbs.push({
		label: 'Perfil'
	})

	yield ctx.render('profile/main', {
		skills: hackathon.mentorSkills,
		error: ctx.flash.error,
		breadcrumbs
	})
}))

profileRouter.post('/', co.wrap(function *(ctx, next){
	const body = ctx.request.body
	const user = ctx.state.user

	if(body.skills && body.skills.length > 3){
		ctx.flash = {error:'Solo puedes tener 3 habilidades'}
		return ctx.redirect('back')
	}

	user.name = body.name
	user.phone = body.phone
	user.address = body.address

	if (body.password) {
		user.password = yield  bcryptUtils.hash(body.password, bcryptUtils.rounds)
	}

	if (body.skills) {
		user.skills = body.skills
	}

	yield user.save()
	if (body.skills) {
		yield MentorSlot.updateSkills(user)
	}

	ctx.redirect('back')
}))

module.exports = profileRouter
