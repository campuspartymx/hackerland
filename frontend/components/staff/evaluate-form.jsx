const React = require('react')
const request = require('../../lib/request.js')

class EvaluateForm extends React.Component {
	constructor() {
		super()

		this.state = {
			error: ''
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit(e) {
		e.preventDefault()

		const projectNumber = this.refs.projectNumber.value

		request.post('/api/projects/can-evaluate', { projectNumber })
			.then((res) => {
				const project = res.body
				const origin = `${window.location.origin}/staff/evaluacion/${project.uuid}`

				window.location = origin
			})
			.catch((err) => {
				const body = err.response.body

				this.setState({
					error: body ? body.error : err
				})
			})
	}

	render() {
		const { error } = this.state

		return (
			<div className='panel-widget panel panel-default'>
				<div className="panel-heading">
					<h3 className="panel-title">Buscar proyecto</h3>
				</div>
				<div className='panel-body'>
					<form>
						{error && (
							<div className='panel-widget panel panel-default error notification notification-small'>
								<div className='panel-body'>
									<p className='has-error'>{error}</p>
								</div>
							</div>
						)}

						<div className='form-group'>
							<input type='text' ref='projectNumber' className='form-control' placeholder='Número de proyecto' required/>
						</div>

						<button className='btn btn-block btn-primary' type='submit' onClick={this.onSubmit}>Buscar</button>
					</form>
				</div>
			</div>
		)
	}
}

module.exports = EvaluateForm
