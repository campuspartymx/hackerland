const hackathonStructure = require('../config/hackathonStructure')

const env = require('../config/env')
const webpack = require('../config/webpack')
const Stage = require('../models/stage')
const User = require('../models/user')
const Data = require('../models/data')
const mail = require('../config/mail.js')

module.exports = function *(next) {
	const stage = yield Stage.findOne({isActive:true})

	if(stage){
		this.state.stage = stage.toJSON()
	}else{
		this.state.stage = {"name": "before"}
	}

	if(this.session.userUuid){
		const user = yield User.findOne({uuid: this.session.userUuid})

		this.state.user = user
	}

	this.state.hackathonStructure = hackathonStructure
	this.state.env = env

	if (env === 'development') {
		this.state.publicPath = webpack.publicPath
	}

	this.state.hackathonData = yield Data.findOne({key:'welcomeData'})
	this.state.hackathonName = hackathonStructure.hackathon.name
	this.state.emailsActive = mail.send && !!mail.mailchimpKey,

	yield next
}
