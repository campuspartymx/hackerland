const db = require('../lib/db')
const Schema = require('mongoose').Schema
const v4 = require('node-uuid').v4
const _ = require('lodash')

const mailer = require('../lib/mailer')
const hackathonStructure = require('../config/hackathonStructure')
const userData = hackathonStructure.userData
const hackathon = hackathonStructure.hackathon

const schema = {
	uuid: { type: String, default: v4},
	role: { type: String, default: 'participant' },// participant|staff

	isAdmin: {type: Boolean, default: false},// allow access to the admin router
	isMentor: { type: Boolean },
	isJudge: { type: Boolean },
	isReviewer: { type: Boolean },
	table: { type: String },
	skills: [{ type: String }],

	type: { type: String },

	name: { type: String },
	email: { type: String, unique: true, lowercase: true, trim: true },
	password: { type: String, default: '' },

	project: { type: Schema.Types.ObjectId, ref: 'Project' },
	// A user can have invites to multiple projects
	invitedTo:[{ type: Schema.Types.ObjectId, ref: 'Project' }],

	// Acive and valid email checks
	active: { type: Boolean },
	validEmail: {type: Boolean, default: false},

	emailKeys:{
		token: { type: String, default: v4},
		expiration: {type:Date, default: Date.now}
	}
}

if (userData) {
	_.each(userData, (data, key) => {
		if (schema[key]) return

		schema[key] = {}

		switch(data.type) {
			case 'Date':
				schema[key].type = Date
				break
			default:
				schema[key].type = String
		}

		if (schema[key].type === String) {
			schema[key].default = ''
		}
	})
}

const UserSchema = new Schema(schema)

UserSchema.methods.sendForgottenPasswordEmail = function *(){
	this.emailKeys = {
		token: v4(),
		expiration: Date.now()
	}

	yield this.save()

	const url = process.env.APP_HOST + '/email/reset-password?token='+this.emailKeys.token+'&email='+encodeURIComponent(this.email)

	yield mailer.sendEmail({
		body:  'Para recuperar tu password visita la siguiente url: <a href="'+url+'">'+url+'</a>',
		title: 'Recuperar password',
		email: this.email
	})
}

UserSchema.methods.sendValidateEmail = function *(){
	this.emailKeys = {
		token: v4(),
		expiration: Date.now()
	}

	yield this.save()

	const url = process.env.APP_HOST + '/email/validate-email?token='+this.emailKeys.token+'&email='+encodeURIComponent(this.email)

	const body = `
		¡Felicidades!. Has creado tu proyecto de manera exitosa.<br>
		<br>
		Por favor da click a este vínculo <a href="${url}">${url}</a> para validar tu correo.<br>
		<br>
		Recuerda que tienes hasta las 11:59 AM del jueves 30 de junio para enviar tu formato de registro de alcance. <br>
		Si requieres modificar los integrantes de tu equipo, recuerda que tienes hasta el viernes 01 de julio a las 10:00 AM, después de eso, no podrás cambiarlos. <br>
		<br>
		¡Éxito!.<br>
		<br>
		Atte. Equipo de ${hackathon.name}.<br>
	`

	yield mailer.sendEmail({
		body,
		title: 'Registro exitoso',
		email: this.email
	})
}

UserSchema.methods.sendInviteStaffEmail = function *() {
	this.emailKeys = {
		token: v4(),
		expiration: Date.now()
	}

	const url = process.env.APP_HOST + '/email/activar-cuenta/' + this.uuid

	const body = `
		¡Hola ${this.name}!:</br>
		</br>
		El equipo organizador de ${hackathon.name} te ha invitado a participar como mentor.</br>
		</br>
		Por favor da clic en este vínculo para terminar tu registro en la plataforma: <a href="${url}">${url}</a>.</br>
		</br>
		Esta plataforma te permitirá:</br>
		<ul>
			<li>Evaluar equipos</li>
			<li>Dar y administrar mentorías</li>
			<li>Fungir como juez (en caso que aplique)</li>
		</ul>
		¡Muchas gracias por tu apoyo!.<br>
		<br>
		Atte. Equipo de ${hackathon.name}.<br>
	`

	yield mailer.sendEmail({
		body,
		title: 'Invitación de mentor',
		email: this.email
	})
}

UserSchema.methods.sendInviteToProject = function *(project){
	this.emailKeys = {
		token: v4(),
		expiration: Date.now()
	}

	yield this.save()

	const url = process.env.APP_HOST + '/email/invitacion/'+project.uuid+'?token='+this.emailKeys.token+'&email='+encodeURIComponent(this.email)

	const body = `
		¡Hola ${this.name}!.<br>
		<br>
		Bienvenido al ${hackathon.name}.<br>
		<br>
		Haz sido invitado a participar en el equipo ${project.name}. Por favor da click a este vínculo, para terminar tu registro: <a href="${url}">${url}</a>.<br>
		<br>
		Atte. Equipo de ${hackathon.name}.<br>
	`

	yield mailer.sendEmail({
		body,
		title: `Invitación a proyecto de ${hackathon.name}`,
		email: this.email
	})
}

UserSchema.methods.sendEmail = function *(options) {
	yield mailer.sendEmail(_.assign({ email: this.email }, options))
}

const User = db.model('User', UserSchema)

module.exports = User
