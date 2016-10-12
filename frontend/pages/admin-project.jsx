const React = require('react')
const ReactDOM = require('react-dom')
const request = require('../lib/request.js')
const parseDataToForm = require('../lib/parseDataToForm')

const ProjectInformation = require('../components/admin/project-information.jsx')
const ProjectMentorships = require('../components/admin/project-mentorships.jsx')
const ProjectEvaluations = require('../components/admin/project-evaluations.jsx')
const ReviewData = require('../components/staff/review-data.jsx')

class AdminProject extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true
		}
	}

	componentDidMount() {
		const projectUuid = window.location.pathname.split('/')[3]

		Promise.all([
			request.get(`/api/projects/${projectUuid}`),
			request.get('/api/current-data')
		]).then((responses) => {
			const project = responses[0].body
			const currentData = responses[1].body
			const properties = {}

			currentData.currentStage.evaluation.forEach((data) => {
				properties[data.name] = data
			})

			const form = parseDataToForm({
				type: 'Object',
				properties: properties
			})

			this.setState({
				project,
				loading: false
			})
		})
	}

	render() {
		if (this.state.loading) {
			return <div/>
		}

		const { project } = this.state

		return (
			<div className="row">
				<div className="col-xs-12">
					<h2>{project.number}: {project.name}</h2>
				</div>

				<div className="col-sm-12">
					<ProjectInformation project={project} />
				</div>

				<div className="col-sm-12">
					<ReviewData project={project} />
				</div>

				<div className="col-sm-12">
					<ProjectEvaluations project={project} />
				</div>

			</div>
		)
	}
}

ReactDOM.render((<AdminProject/>), document.getElementById('main'))
