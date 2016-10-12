const React = require('react')
const request = require('../../lib/request.js')

class ProjectInformation extends React.Component {
	constructor() {
		super()

		this.state = {
			team: []
		}
	}

	componentDidMount() {
		const { project } = this.props

		request.get(`/api/projects/${project.uuid}/team`).then((res) => {
			this.setState({
				team: res.body.team
			})
		})
	}

	render() {
		const { project } = this.props
		const { team } = this.state

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Informacion general</h3>
				</div>
				<div className="panel-body">
					<p>Nombre: {project.name}</p>
					<p>Número: {project.number}</p>
					<p>Descripcion: {project.description}</p>

					<div className="list-group">
						{team.map((user) => (
							<a key={user._id} href={`/admin/users/${user.uuid}`} className="list-group-item">
								{!user.project && (
									<span className="badge">Pendiente</span>
								)}
								{user.name}
							</a>
						))}
					</div>
				</div>
			</div>
		)
	}
}

module.exports = ProjectInformation
