// node tasks/create-user.js --email "siedrix@gmail.com" --name "Daniel Zavala" --role "staff" --password "monkeytest" --isAdmin true
const co = require('co')
const argv = require('minimist')(process.argv.slice(2))

const db = require('../lib/db')
const User = require('../models/user')
const bcryptUtils = require('../lib/bcrypt')

co(function*(){
	if(
		!argv.password ||
		!argv.name ||
		!argv.email ||
		!argv.role
	){
		throw new Error('Users need Name, Email, Password and Role')
	}

	argv.role = argv.role === 'staff' ? 'staff' : 'participant'

	if (argv.role === 'staff') {
		argv.isMentor = true
		argv.isJudge = true
		argv.isReviewer = true
	}

	argv.password = String(argv.password)
	argv.password = yield bcryptUtils.hash(argv.password, bcryptUtils.rounds)

	argv.active = true
	argv.validEmail = true

	var user = yield User.create(argv)

	return user
}).then(function(user){
	console.log('User created:', user.name)
	process.exit()
}).catch(function(err){
	console.log(err)
	process.exit(1)
})

