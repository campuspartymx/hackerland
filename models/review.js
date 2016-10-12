'use strict'

const db = require('../lib/db')
const Schema = require('mongoose').Schema
const v4 = require('node-uuid').v4

const reviewSchema = new Schema({
	answers: { type: Schema.Types.Mixed },
	project: { type: Schema.Types.ObjectId, ref: 'Project', require: true },
	stage: { type: Schema.Types.ObjectId, ref: 'Project', require: true },
	uuid: { type: String, default: v4},
	completed: { type: Boolean, default: false }
})

const Review = db.model('Review', reviewSchema)

module.exports = Review
