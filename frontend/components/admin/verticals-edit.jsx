const React = require('react')
const HTForm = require('../HTForm')
const request = require('../../lib/request')
const parseDataToForm = require('../../lib/parseDataToForm')

class WelcomeData extends React.Component {
	constructor(props) {
		super(props)

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

		this.formData = this.props.vertical

		this.state = {
			success: ''
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit({ formData }) {
		request.post('/api/verticals/'+this.props.vertical.uuid, formData).then((res) => {
			this.formData = res.body
			this.setState({
				success:true
			})
		})
	}

	render() {
		const { state, formData } = this
		const { vertical } = this.props
		const alerts = []

		if (state.success) {
			alerts.push((
				<div key='success' className='alert alert-success'>
					Se ha actualizado la vertical {vertical.name} de manera exitosa.
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

module.exports = WelcomeData
