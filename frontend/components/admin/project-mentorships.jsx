const React = require('react')
const request = require('../../lib/request.js')

class ProjectMentorships extends React.Component {
	constructor() {
		super()

		this.state = {
			mentorSlots: []
		}
	}

	componentDidMount() {
		const { project } = this.props

		request.get(`/api/projects/${project.uuid}/mentor-slots`).then((res) => {
			this.setState({
				mentorSlots: res.body.mentorSlots
			})
		})
	}

	render() {
		const { mentorSlots } = this.state

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Mentorias</h3>
				</div>
				<div className="panel-body">
					{mentorSlots.length ? (
						<table className="table table-bordered table-hover table-striped table-container">
							<thead>
								<tr>
									<th>Mentor</th>
									<th>Habilidad</th>
									<th>Mesa</th>
									<th>Horario</th>
								</tr>
							</thead>
							<tbody>
								{mentorSlots.map((slot) => (
									<tr key={slot._id}>
										<td><a href={`/admin/usuario/${slot.mentor.uuid}`}>{slot.mentor.name}</a></td>
										<td>{slot.skill}</td>
										<td>{slot.table}</td>
										<td>{slot.timeLabel}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<h4 className="empty-label">El equipo no ha tenido mentorias</h4>
					)}
				</div>
			</div>
		)
	}
}

module.exports = ProjectMentorships
