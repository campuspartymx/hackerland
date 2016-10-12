const React = require('react')
const request = require('../../lib/request.js')

class UserRole extends React.Component {
	constructor() {
		super()

		this.state = {
			success: ''
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit(e) {
		e.preventDefault()

		const { user } = this.props
		const update = {
			isMentor: this.refs.isMentor.checked,
			isJudge: this.refs.isJudge.checked
		}
		const url = `/api/users/${user.uuid}/roles`

		request.post(url, update).then((res) => {
			this.setState({
				success: res.body.success
			})
		})
	}

	render() {
		const { user, hackathon } = this.props
		const { success } = this.state

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Perfiles</h3>
				</div>

				<div className="panel-body">
					<div className="form-group">
						<form action="">
							{success && (
								<div className="alert alert-success">{success}</div>
							)}

							{hackathon.mentors && (
								<div className="checkbox">
									<label><input type="checkbox" ref="isMentor" value="true" defaultChecked={user.isMentor}/>Mentor</label>
								</div>
							)}

							<div className="checkbox">
								<label><input type="checkbox" ref="isJudge" value="true" defaultChecked={user.isJudge}/>Juez</label>
						</div>

						<button className="btn btn-primary" type="submit" onClick={this.onSubmit}>Guardar</button>
					</form>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = UserRole
