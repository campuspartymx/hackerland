const React = require('react')
const moment = require('moment')
const _ = require('underscore')
const request = require('../../lib/request.js')

class ProjectEvaluations extends React.Component {
	constructor() {
		super()

		this.state = {
			evaluations: {}
		}
	}

	componentDidMount() {
		const { project } = this.props

		request.get(`/api/projects/${project.uuid}/evaluations`).then((res) => {
			const evaluations = _.groupBy(res.body.evaluations, 'stage')
			const stageIds = _.uniq(_.map(res.body.evaluations, (e) => e.stage))
			const promises = _.map(stageIds, (s) => request.get(`/api/stages/${s}`))

			Promise.all(promises).then((responses) => {
				const stages = {}

				_.each(responses, (r) => {
					const stage = r.body
					stages[stage._id] = stage
				})

				this.setState({
					evaluations,
					stages
				})
			})
		})
	}

	renderTable(stageId, evaluations) {
		const answers = _.keys(evaluations[0].answers)
		const { project } = this.props

		if (!answers.length) {
			return null
		}
		const stage = this.state.stages[stageId]
		const stageName = stage && stage.description ? stage.description.name : ''

		return (
			<div key={stageId}>
				<h3>{stageName}</h3>
				<p>Score: {project.scores[stageName]}</p>
				<table className="table table-bordered table-hover table-striped table-container">
					<thead>
						<tr>
							<th key="judge">Juez</th>
							{_.map(answers, (answer, i) => (<th key={i}>{answer}</th>))}
							<th key="total">Total</th>
						</tr>
					</thead>
					<tbody>
						{_.map(evaluations, (evaluation) => {
							const userUri = '/admin/users/'+ evaluation.user.uuid

							return (<tr key={evaluation._id}>
								<th key="judge"><a href={ userUri }>{evaluation.user.name}</a></th>
								{_.map(answers, (answer, i) => (
									<th key={i}>{evaluation.answers[answer]}</th>
								))}
								<th>{evaluation.score}</th>
							</tr>)
						})}
					</tbody>
				</table>
			</div>
		)
	}

	render() {
		const { evaluations } = this.state

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Evaluaciones</h3>
				</div>
				<div className="panel-body">
					{_.map(evaluations, (data, stageId) => {
						return this.renderTable(stageId, data)
					})}
				</div>
			</div>
		)
	}
}

module.exports = ProjectEvaluations
