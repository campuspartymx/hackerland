'use strict'
// node tasks/import-data.js

require('../loadenv')
const co = require('co')
const fs = require('fs')
const parseArgs = require('minimist')
const path = require('path')

const seedData = require('./seed-data')
const hackathonStructure = require('../config/hackathonStructure')
const db = require('../lib/db')
const User = require('../models/user')
const Project = require('../models/project')
const Stage = require('../models/stage')
const Evaluation = require('../models/evaluation')
const MentorSlot = require('../models/mentorSlot')
const Review = require('../models/review')
const Data = require('../models/data')
const Vertical = require('../models/vertical')

const argv = parseArgs(process.argv.slice(2))

console.log(hackathonStructure)

co(function*(){
  const stages = hackathonStructure.stages.map(function(stage, i) {
    if (i === 0) {
      stage.isActive = true
    }

    stage.step = i
    return stage
  })

  yield User.remove({})
  yield Project.remove({})
  yield Stage.remove({})
  yield Evaluation.remove({})
  yield MentorSlot.remove({})
  yield Review.remove({})
  yield Data.remove({})
  yield Vertical.remove({})

  yield Stage.create(stages)
  yield Data.create({
    key:'welcomeData',
    value:seedData.welcomeData
  })

  process.exit()
}).then(function (stages) {
  console.log('=> Stages created', stages.length)
  process.exit()
}).catch(function (err) {
  console.log(err)
  process.exit(1)
})
