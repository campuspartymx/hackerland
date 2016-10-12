'use strict'
const mandrill = require('mandrill-api/mandrill')
const Bluebird = require('bluebird')

const config = require('../config/mail')

if (!config.send) {
	console.warn('Emails will not be sent!!')
}

const client = new mandrill.Mandrill(config.mailchimpKey)

client.sendEmail = function (conf) {
	var q = new Bluebird(function (resolve, reject) {
		var message = {
			from_email: 'hackaton@campus-hackaton.mx',
			from_name: 'Campus party hackaton'
		}

		if (!config.send) {
			console.log(`Email not send, body => \n ${conf.body} \n`)
			return resolve()
		}

		message.html = conf.body
		message.subject = conf.title
		message.to = [{email: conf.email}]

		if (!config.send) {
			console.log(`Email not send, body => \n ${conf.body} \n`)
			return resolve()
		}

		client.messages.send({
			'message': message,
			'async': false,
			'ip_pool': 'Main pool'
		}, function (result) {
			resolve(result)
		}, function (err) {
			reject(err)
		})
	})

	return q
}

module.exports = client
