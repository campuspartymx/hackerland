//node tasks/mongodump.js
//restore:  mongorestore --archive=backup-20160627_173576.gz --gzip --db hacktrack

require('../loadenv')
const spawn = require('child_process').spawn
const moment = require('moment')
const parseArgs = require('minimist')
const database = require('../config/database')

const argv = parseArgs(process.argv.slice(2), {
	default: {
		fileName: `backup-${moment().format('YYYYMMDD_HHssSS')}.gz`,
		dbName: database.mongo.name
	}
})

const options = [
	`--archive=${argv.fileName}`,
	'--gzip',
	'--db', argv.dbName
]

const child = spawn('mongodump', options)

child.stdout.on('error', function (err) {
	console.log(err)
})

child.stdout.on('data', function(chunk) {
	console.log(chunk)
})

child.stdout.on('end', function() {
	console.log('DONE')
})

