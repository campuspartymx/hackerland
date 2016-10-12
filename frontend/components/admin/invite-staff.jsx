const React = require('react')
const HTForm = require('../HTForm')
const parseDataToForm = require('../../lib/parseDataToForm')
const request = require('../../lib/request')

const emails = process.env.EMAILS
const appHost = process.env.APP_HOST

const attrs = {
	properties: {
		name: { type: 'String', title: 'Nombre', required: true },
		email: { type: 'String', format: 'email', title: 'Correo electrónico', required: true },
	}
}

class InviteStaff extends React.Component {
	constructor(props) {
		super()

		this.state = {
			formData: {}
		}

		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)

		if (props.hackathon.mentors) {
			attrs.properties.isMentor = { type: 'Boolean', title: 'Mentor' }
			attrs.properties.isJudge = { type: 'Boolean', title: 'Juez' }
		}

		this.form = parseDataToForm(attrs)
	}

	onSubmit({ formData }) {
		const { hackathon } = this.props
		const data = Object.assign({ role: 'staff' }, formData)

		if (!hackathon.mentors) {
			data.isJudge = true
		}

		request
			.post('/api/users', data)
			.then(({ ok, body }) => {
				this.setState({
					success: true,
					error: false,
					formData: {},
					user: body
				})
			})
			.catch((err) => {
				const errorText = err.response.body ?  err.response.body.error : err.response.text
				this.setState({
					success: false,
					error: true,
					errorText: errorText
				})
			})
	}

	onChange({ formData }) {
		this.setState({ formData })
	}

	render() {
		const { state } = this
		const { formData } = state
		const alerts = []

		if (state.success) {
			const { user } = state
			alerts.push((
				<div key='success' className='alert alert-success'>
					El usuario {user.name} se ha creado de manera exitosa.
					<br/>
					<a href={`/admin/users/${user.uuid}`}>Ver usuario</a>
					{emails ? null :(
						<div>
							<br/>
							<span>Por favor mandale este link {`${appHost}/email/activar-cuenta/${user.uuid}`} al usuario para que active su cuenta</span>
						</div>
					)}
				</div>
			))
		}

		if (state.error) {
			alerts.push((
				<div key='error' className='alert alert-danger'>
					Ocurrió un error.
					<br/>
					{state.errorText}
				</div>
			))
		}

		return (
			<div className='panel panel-default'>
				<div className='panel-heading'>
					<h3 className='panel-title'>Invitar a staff</h3>
				</div>
				<div className='panel-body'>
					{alerts}
					<HTForm
						{...this.form}
						formData={formData}
						onSubmit={this.onSubmit}
						onChange={this.onChange}>
						<button type="submit" className="btn btn-info">Crear</button>
					</HTForm>
				</div>
			</div>
		)
	}
}

module.exports = InviteStaff
