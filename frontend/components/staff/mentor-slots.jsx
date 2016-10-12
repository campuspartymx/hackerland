const React = require('react')

const request = require('../../lib/request.js')

class MentorSlots extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true
		}
	}

	componentDidMount() {
		request.get('/api/users/mentor-slots').then((res) => {
			this.setState({
				loading: false,
				mentorSlots: res.body.mentorSlots
			})
		})
	}
	render() {
		if (this.state.loading) {
			return <div/>
		}

		const { mentorSlots } = this.state

		if (!mentorSlots.length) {
			return <div/>
		}

		return (
			<div>
				<h4>Sesiones de mentoría</h4>
				<table className='table table-striped'>
					<thead>
						<tr>
							<th>Hora</th>
							<th>Lugar</th>
							<th>Proyecto</th>
						</tr>
					</thead>
					<tbody>
						{mentorSlots.map((mentorSlot) => (
							<tr key={mentorSlot._id}>
								<td>{mentorSlot.timeLabel}</td>
								<td>{mentorSlot.table}</td>
								<td>
									{mentorSlot.project ? mentorSlot.project.name : null}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		)
	}
}

module.exports = MentorSlots

