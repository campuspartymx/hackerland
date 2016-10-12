const React = require('react')
const ReactDOM = require('react-dom')
const Form = require('react-jsonschema-form').default
const _ = require('underscore')
const request = require('../lib/request')
const parseDataToForm = require('../lib/parseDataToForm')

const HTForm = require('../components/HTForm.jsx')
const ReviewData = require('../components/staff/review-data.jsx')

class Evaluation extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true,
			project: {},
			form: {}
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	componentWillMount() {
		const projectUuid = window.location.pathname.split('/')[3]

		Promise.all([
			request.get('/api/current-data'),
			request.get(`/api/projects/${projectUuid}`)
		])
		.then((responses) => {
			const currenData = responses[0].body
			const project = responses[1].body

			const properties = {}

			currenData.currentStage.evaluation.forEach((data) => {
				properties[data.name] = data
			})

			const form = parseDataToForm({
				type: 'Object',
				properties: properties
			})

			this.setState({
				project,
				form,
				loading: false,
				hackathon: currenData.hackathon
			})
		})
	}

	onSubmit({ formData }) {
		const { project } = this.state

		request
			.post(`/api/projects/${project.uuid}/evaluation`, formData)
			.then((response) => {
				window.location = `${window.location.origin}/staff`
			})
			.catch((err) => {
				window.location = `${window.location.origin}/staff`
			})
	}

	renderWithReviewData() {
		const { project, form } = this.state

		return (
			<div className='row panel'>
				<div className='col-xs-12 col-md-6'>
					<h2>Projecto {project.number}: {project.name}</h2>

					<ReviewData project={project} />
				</div>

				<div className='col-xs-12 col-md-6'>
					<h2>Evaluar projecto</h2>
					<br/><br/>

					<HTForm {...form} onSubmit={this.onSubmit}>
						<div>
							<button type='submit' className='btn btn-info'>Evaluar</button>
							<br/><br/>
						</div>
					</HTForm>
				</div>
			</div>
		)
	}

	render() {
		if (this.state.loading) {
			return <div/>
		}

		if (this.state.hackathon.review) {
			return this.renderWithReviewData()
		}

		const { project, form, hackathon } = this.state

		return (
			<div className='row'>
				<div className='col-xs-8 col-xs-offset-2'>
					<div key='form' className='panel widget-5'>
						<h2>Evaluar projecto {project.number}: {project.name}</h2>
						<br/><br/>
						<p>{ project.description }</p>
						<br/><br/>

						<HTForm {...form} onSubmit={this.onSubmit}>
							<div>
								<button type='submit' className='btn btn-info'>Evaluar</button>
								<br/><br/>
							</div>
						</HTForm>
					</div>
				</div>
			</div>
		)
	}
}

ReactDOM.render((<Evaluation/>), document.getElementById('main'))
