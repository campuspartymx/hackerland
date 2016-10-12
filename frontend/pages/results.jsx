const React = require('react')
const ReactDOM = require('react-dom')
const request = require('../lib/request')

const RegisterProjectForm = require('../components/admin/register-project-form.jsx')
const InviteStaff = require('../components/admin/invite-staff')

class Results extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true,
			projects: []
		}
	}

	componentDidMount() {
		const stageUuid = window.location.pathname.split('/')[3]

		Promise.all([
			request .get(`/api/stages/${stageUuid}`),
			request .get(`/api/stages/${stageUuid}/results`)
		]).then((responses) => {
			const stage = responses[0].body
			const projects = responses[1].body

			this.setState({
				loading: false,
				stage,
				projects
			})
		})

	}

	render() {
		if (this.state.loading) return <div/>

		const { projects, stage } = this.state
		const stageName = stage.description.name

		return (
			<div className='row'>
				<div className='col-md-6 col-md-offset-3'>
					<div className="panel-widget panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">Equipos calificados</h3>
						</div>
						<div className="panel-body">
							<table className='table table-striped'>
								<thead>
									<tr>
										<th>Proyecto</th>
										<th>Número</th>
									</tr>
								</thead>
								<tbody>
									{projects.map((project) => (
										<tr key={project._id}>
											<td>{project.name}</td>
											<td>{project.number}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<Results/>, document.getElementById('main'))
