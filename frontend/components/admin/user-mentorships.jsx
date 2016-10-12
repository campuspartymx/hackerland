const React = require('react')
const request = require('../../lib/request.js')

class UserMentorSlots extends React.Component {
	constructor() {
		super()

		this.state = {
			mentorSlots: []
		}
	}

	componentDidMount() {
		const userUuid = window.location.pathname.split('/')[3]

		request.get(`/api/users/${userUuid}/mentor-slots`)
			.then((res) => {
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
									<th>Proyecto</th>
									<th>Habilidad</th>
									<th>Mesa</th>
									<th>Horario</th>
									<th>Calificación</th>
								</tr>
							</thead>
							<tbody>
								{mentorSlots.map((slot) => (
									<tr key={slot._id}>
										<td>{slot.project && (
											<a href={`/admin/proyecto/${slot.project.number}`}>{slot.project.name}</a>
										)}</td>
										<td>{slot.skill}</td>
										<td>{slot.table}</td>
										<td>{slot.timeLabel}</td>
										<td>{slot.mentorRate}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<h4 className="empty-label">El usuario no ha tenido mentorias</h4>
					)}
				</div>
			</div>
		)
	}
}

module.exports = UserMentorSlots
