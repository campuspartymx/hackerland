const React = require('react')

const emails = process.env.EMAILS
const appHost = process.env.APP_HOST

class UserInformation extends React.Component {
	render() {
		const { user } = this.props

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Información general</h3>
				</div>

				<div className="panel-body">
					<p>Email: {user.email}</p>
					<p>Telefono: {user.phone}</p>
					<p>Role: {user.role}</p>

					{!user.active && (
						<div>
							<p>Invitado a:</p>
							<ul>
								{user.invitedTo.map((invite) => {
									const link = `${window.location.origin}/email/invitacion/${invite.uuid}?token=${user.emailKeys.token}&email=${encodeURIComponent(user.email)}`
									return (
										<li key={invite.number}>
											{invite.number}:{invite.name}
											<a href={link}>{link}</a>
										</li>
									)
								})}
							</ul>
						</div>
					)}

					<br/>
					<div key='success' className='alert alert-success'>
						<span>Para recuperar el password de este usuario mandale este link: <b>{`${appHost}/email/reset-password/?email=${user.email}&token=${user.emailKeys.token}`}</b></span>
					</div>
				</div>


			</div>
		)
	}
}

module.exports = UserInformation
