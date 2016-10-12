'use strict'
// node tasks/reload-stages.js
require('../loadenv')
const co = require('co')
const fs = require('fs')
const parseArgs = require('minimist')
const path = require('path')
const _ = require('lodash')

const hackathonStructure = require('../config/hackathonStructure')
const db = require('../lib/db')
const User = require('../models/user')
const Project = require('../models/project')
const Stage = require('../models/stage')
const Evaluation = require('../models/evaluation')
const MentorSlot = require('../models/mentorSlot')
const Review = require('../models/review')
const Data = require('../models/data')

const argv = parseArgs(process.argv.slice(2))

co(function*(){
  var activeStage = yield Stage.findOne({isActive: true})
  const previousStages = yield Stage.find({})

  if(!activeStage){
    activeStage = previousStages[0]
  }

  yield Stage.remove({})

  const stages = hackathonStructure.stages.map(function(stage, i) {
    if (activeStage && stage.description.name === activeStage.description.name) {
      stage.isActive = true
    }

    const previousStage = _.find(previousStages, function(o) { return stage.description.name === o.description.name })
    if(previousStage){
      stage.uuid = previousStage.uuid
      stage.evaluated = previousStage.evaluated
      _.forIn(stage.data, function (item, key) {
        if(previousStage && previousStage.data && previousStage.data[key]){
          item.value = previousStage.data[key].value
        }
      })
    }

    stage.step = i
    return stage
  })

  return yield Stage.create(stages)
}).then(function (stages) {
  console.log('=> Stages created', stages.length)
  process.exit()
}).catch(function (err) {
  console.error(err)
  console.warn(err.stack)
  process.exit(1)
})