const React = require('react')
const HTForm = require('../HTForm')
const request = require('../../lib/request')
const parseDataToForm = require('../../lib/parseDataToForm')

class RegisterProject extends React.Component {
	constructor(props) {
		super()

		let data = {}

		if (props.hackathon.participants) {
			data = {
				properties: {
					project: {
						type: 'Object',
						title: 'Projecto',
						properties: props.projectData
					},
					user: {
						type: 'Object',
						title: 'Usuario',
						properties: props.userData
					}
				}
			}
		} else {
			data = {
				type: 'Object',
				properties: props.projectData
			}
		}

		this.state = {}

		this.form = parseDataToForm(data)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit({ formData }) {
		const url = this.props.hackathon.participants
			? '/api/projects/create-with-owner'
			: '/api/projects'

		request.post(url, formData)
			.then(({ body }) => {
				this.setState({
					success: true,
					error: false,
					formData: {},
					project: body
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

	render() {
		const { state } = this
		const alerts = []

		if (state.success) {
			const { project } = state
			alerts.push((
				<div key='success' className='alert alert-success'>
					El projecto {project.name} se ha creado de manera exitosa.
					<br/>
					<a href={`/admin/projects/${project.uuid}`}>Ver proyecto</a>
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
					<h3 className='panel-title'>Crear proyecto</h3>
				</div>
				<div className='panel-body'>
					{alerts}
					<HTForm
						ref='form'
						{...this.form}
						onSubmit={this.onSubmit}>
						<button type="submit" className="btn btn-info">Crear</button>
					</HTForm>
				</div>
			</div>
		)
	}
}

module.exports = RegisterProject
