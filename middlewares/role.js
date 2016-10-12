
module.exports = function (role) {
	return function (ctx, next) {
		const user = ctx.state.user
		ctx.assert(user && user.role === role, 403)
		return next()
	}
}
