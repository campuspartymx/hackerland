
const url = 'http://' + process.env.WEBPACK_HOST + ':' + process.env.WEBPACK_PORT

module.exports = {
	dir: process.env.WEBPACK_DIR,
	url: url,
	publicPath: url + '/' + process.env.WEBPACK_DIR + '/'
}
