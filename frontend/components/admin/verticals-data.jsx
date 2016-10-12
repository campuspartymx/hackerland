const React = require('react')
const HTForm = require('../HTForm')
const request = require('../../lib/request')
const parseDataToForm = require('../../lib/parseDataToForm')

const url = `/api/verticals/`

class VerticalCreate extends React.Component {
	constructor({ hackathon }) {
		super()

		this.form = parseDataToForm({
			type: 'Object',
			properties: {
				name: {
					type: 'String',
					title: 'Nombre',
					required: true
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			}
		})
		this.state = {
			formData: {},
			success: ''
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit({ formData }) {
		request.post(url, formData).then((res) => {
			this.setState({
				formData: {},
				vertical: res.body
			})

			this.props.addVertical(res.body)
		})
	}

	render() {
		const { state, formData } = this
		const { vertical } = state
		const alerts = []



		if (vertical) {
			alerts.push((
				<div key='success' className='alert alert-success'>
					Se ha creado la vertical {vertical.name} de manera exitosa.
					<br/>
					<a href={`/admin/vertical/${vertical.uuid}`}>Ver vertical</a>
				</div>
			))
		}


		return (
			<div className='panel panel-default'>
				<div className='panel-heading'>
					<h3 className='panel-title'>Crea una nueva vertical</h3>
				</div>
				<div className='panel-body'>
					{alerts}
					<HTForm
						ref='form'
						{...this.form}
						formData={formData}
						onSubmit={this.onSubmit}>
						<button type="submit" className="btn btn-info">Guardar</button>
					</HTForm>
				</div>
			</div>
		)
	}
}

module.exports = VerticalCreate
