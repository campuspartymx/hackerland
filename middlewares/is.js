
module.exports = function (is) {
	return function (ctx, next) {
		const user = ctx.state.user
		ctx.assert(user && user[is], 403)
		return next()
	}
}
