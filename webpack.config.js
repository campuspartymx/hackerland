require('./loadenv')

const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const config = require('./config/webpack')
const mail = require('./config/mail.js')
const env = require('./config/env')
const isDev = env === 'development'

const hotReload = [
	`webpack-dev-server/client?${config.url}`,
	'webpack/hot/only-dev-server'
]
const entry = {}

fs.readdirSync('./frontend/pages').filter(function(file) {
	const name = file.split('.')[0]
	const filePath = `./frontend/pages/${file}`
	entry[name] = isDev ? hotReload.concat(filePath) : filePath
});

const webpackConfig = {
	entry: entry,
	output: {
		filename: '[name].js',
		path: __dirname + '/public/' + config.dir,
		publicPath: config.publicPath
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': JSON.stringify({
				EMAILS: mail.send && !!mail.mailchimpKey,
				APP_HOST: process.env.APP_HOST
			})
		})
	],
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				include: [path.resolve(__dirname, 'frontend')],
				loader: 'react-hot'
			},{
				test: /\.jsx?$/,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					presets:['es2015', 'react']
				}
			},{
				test: /\.json$/,
				loader: 'json'
			}
		]
	}
}

if (env === 'production') {
	webpackConfig.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false
			},
			compress: {
				warnings: false,
				screw_ie8: true
			}
		})
	)

	webpackConfig.resolve.alias = {
		'react': 'react-lite',
		'react-dom': 'react-lite'
	}
}else{
	webpackConfig.devtool = ['inline-source-map']
}

module.exports = webpackConfig
