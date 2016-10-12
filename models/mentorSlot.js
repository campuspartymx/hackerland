'use strict'
const db = require('../lib/db')
const Schema = require('mongoose').Schema
const v4 = require('node-uuid').v4

const mentorSlotSchema = new Schema({
	uuid: { type: String, default: v4},
	startTime: { type: Date },
	endTime: { type: Date },
	table: { type: String },
	skill: { type: String },
	mentor: { type: Schema.Types.ObjectId, ref: 'User' },
	mentorSkills: [{ type: String }],
	mentorRate: { type: Number },
	mentorComments: { type: String },
	project: { type: Schema.Types.ObjectId, ref: 'Project' },
	projectRate: { type: Number },
	projectComments: { type: String }
})

mentorSlotSchema.virtual('time.start').get(function () {
	let minutes = this.startTime.getMinutes()
	minutes = minutes > 10 ? minutes : `0${minutes}`
	return `${this.startTime.getHours()}:${minutes}`
})

mentorSlotSchema.virtual('time.end').get(function () {
	let minutes = this.endTime.getMinutes()
	minutes = minutes > 10 ? minutes : `0${minutes}`
	return `${this.endTime.getHours()}:${minutes}`
})

mentorSlotSchema.statics.updateSkills = function *(user){
	yield this.update({mentor:user._id}, {mentorSkills:user.skills}, {multi:true})
}

const MentorSlot = db.model('MentorSlot', mentorSlotSchema)

module.exports = MentorSlot
