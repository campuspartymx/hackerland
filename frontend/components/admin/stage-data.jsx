const React = require('react')
const HTForm = require('../HTForm')
const request = require('../../lib/request')
const parseDataToForm = require('../../lib/parseDataToForm')
const _ = require('lodash')

class StageData extends React.Component {
	constructor({ stage }) {
		super()

		const welcomeData = stage.data

		this.form = parseDataToForm({
			type: 'object',
			properties: stage.data
		})

		this.state = {
			formData: {},
			success: ''
		}

		this.url = `/api/stages/${stage.uuid}`

		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidMount() {
		request.get(this.url).then((res) => {
			const values = _.mapValues(res.body.data, (o) => {return o.value})

			this.setState({
				formData: values
			})
		})
	}

	onSubmit({ formData }) {
		request.post(this.url, formData).then((res) => {
			this.setState({
				formData,
				success: res.body.success
			})
		})
	}

	render() {
		const { formData, success } = this.state

		return (
			<div className='panel panel-default'>
				<div className='panel-heading'>
					<h3 className='panel-title'>Información de esta etapa</h3>
				</div>
				<div className='panel-body'>
					{success && (
						<div className="alert alert-success">{success}</div>
					)}

					<HTForm
						ref='form'
						{...this.form}
						formData={formData}
						onSubmit={this.onSubmit}>
						<button type='submit' className='btn btn-info'>Guardar</button>
					</HTForm>
				</div>
			</div>
		)
	}
}

module.exports = StageData
