'use strict'
// node tasks/dev/create-base-data.js

require('../../loadenv')
const co = require('co')
const fs = require('fs')
const parseArgs = require('minimist')
const path = require('path')
const _ = require('lodash')

const bank = require('./bank')
const seedData = require('../seed-data')
const hackathonStructure = require('../../config/hackathonStructure')
const db = require('../../lib/db')
const bcryptUtils = require('../../lib/bcrypt')
const User = require('../../models/user')
const Project = require('../../models/project')
const Stage = require('../../models/stage')
const Evaluation = require('../../models/evaluation')
const MentorSlot = require('../../models/mentorSlot')
const Review = require('../../models/review')
const Data = require('../../models/data')
const Vertical = require('../../models/vertical')

const hackathon = hackathonStructure.hackathon

const argv = parseArgs(process.argv.slice(2), {
  default: {
    projects: 40,
    mentors: 10,
    judges: 10
  }
})

co(function*(){
  console.log('hackathonStructure', hackathonStructure)
  yield removeAll()

  yield Data.create({
    key:'welcomeData',
    value:seedData.welcomeData
  })
  yield createStages()
  yield createAdmin()
  yield createProjects()

}).then(function () {
  process.exit()
}).catch(function (err) {
  console.log(err)
  process.exit(1)
})


function *removeAll() {
  console.log('Cleaning database')

  yield User.remove({})
  yield Project.remove({})
  yield Stage.remove({})
  yield Evaluation.remove({})
  yield MentorSlot.remove({})
  yield Review.remove({})
  yield Data.remove({})
  yield Vertical.remove({})
}


function *createStages() {
  console.log('Creating stages')

  const stages = hackathonStructure.stages.map(function(stage, i) {
    if (i === 0) {
      stage.isActive = true
    }

    stage.step = i
    return stage
  })

  yield Stage.create(stages)
}


function *createAdmin() {
  console.log('Creating admin')

  const password = yield  bcryptUtils.hash('test', bcryptUtils.rounds)

  return yield User.create({
    name: 'Admin',
    email: 'admin@latteware.io',
    password: password,
    active: true,
    role: 'staff',
    isAdmin: true,
    isMentor: true,
    isJudge: true
  })
}


function *createUser(data) {
  const password = yield  bcryptUtils.hash('test', bcryptUtils.rounds)

  const user = _.assign({
    name: _.capitalize(_.sampleSize(bank, 2).join(' ')),
    email: _.sampleSize(bank, 2).join('.') + _.times(3, _.random).join('') + '@latteware.io',
    phone: _.times(10, _.random).join(''),
    active: true,
    password: password
  }, data)

  return yield User.create(user)
}


function *createProject() {
  const owner = yield createUser({ role: 'participant' })

  const project = new Project({
    name: _.capitalize(_.sampleSize(bank, 3).join(' ')),
    description: _.capitalize(_.sampleSize(bank, 20).join(' ')),
    owner: owner
  })

  if (hackathon.verticals) {
    project.vertical = _.sample(hackathon.verticals).name
  }

  yield project.save()
  owner.project = project
  yield owner.save()

  const team = _.random(1, 4)
  for (let i = 0; i < team; i++) {
    yield createUser({ project: project._id, role: 'participant' })
  }
}


function *createProjects() {
  console.log(`Creating ${argv.projects} projects`)

  for (let i = 0; i < argv.projects; i++) {
    if(i % 10 === 0 && i > 0){
      console.log(`Created ${i} projects. ${ new Date() }`)
    }

    yield createProject()
  }
}

