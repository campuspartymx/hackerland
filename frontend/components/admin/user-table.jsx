const React = require('react')
const request = require('../../lib/request.js')

class UserTable extends React.Component {
	constructor() {
		super()

		this.state = {
			success: ''
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit() {
		const table = this.refs.table.value
		if (!table) return

		const { user } = this.props
		const url = `/api/users/${user.uuid}/table`

		request.post(url, { table }).then((res) => {
			this.setState({
				success: res.body.success
			})
		})
	}

	render() {
		const { success } = this.state
		const { user } = this.props

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Asignar mesa</h3>
				</div>

				<div className="panel-body">
					<div className="form-group">
						{success && (
							<div className="alert alert-success">{success}</div>
						)}

						<label>Mesa</label>
						<input
							type="text"
							ref="table"
							placeholder="#"
							className="form-control"
							required
							defaultValue={user.table}
						/>

						<button className="btn btn-primary" type="submit" onClick={this.onSubmit}>Guardar</button>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = UserTable
