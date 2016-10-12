const React = require('react')
const HTForm = require('../HTForm')
const request = require('../../lib/request')
const parseDataToForm = require('../../lib/parseDataToForm')

const key = 'welcomeData'
const url = `/api/data/${key}`

class WelcomeData extends React.Component {
	constructor({ hackathon }) {
		super()

		const welcomeData = hackathon.description ? hackathon.description.welcomeData : {}

		this.form = parseDataToForm({
			type: 'Object',
			properties: welcomeData
		})

		this.state = {
			formData: {},
			success: ''
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidMount() {
		request.get(url).then((res) => {
			if (!res.body[key]) return
			this.setState({
				formData: res.body[key]
			})
		})
	}

	onSubmit({ formData }) {
		request.post(url, formData).then((res) => {
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
					<h3 className='panel-title'>Pagina de inicio</h3>
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
						<button type="submit" className="btn btn-info">Guardar</button>
					</HTForm>
				</div>
			</div>
		)
	}
}

module.exports = WelcomeData
