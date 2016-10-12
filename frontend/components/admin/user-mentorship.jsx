const React = require('react')
const moment = require('moment')
const request = require('../../lib/request.js')

const minutes = 15
const roundMinutes = minutes => {
	return (parseInt((minutes + 7.5)/15) * 15) % 60
}

class UserMentorship extends React.Component {
	constructor() {
		super()

		const currentTime = moment()
		const startTime = moment().set('hour', currentTime.hour() ).set('minute', roundMinutes(currentTime.minutes()) ).set('second', 0)
		const endTime = moment(startTime).add(4, 'hours')
		const initialHour = []
		const finalHour = []
		const totalMinutes = endTime.diff(startTime, 'minutes')
		const numberOfSlots = totalMinutes / minutes

		for(let i = 0; i < numberOfSlots; i++) {
			initialHour.push({ value:startTime.format(), label:startTime.format('HH:mm') })
			startTime.add(minutes, 'minute')
			finalHour.push({ value:startTime.format(), label:startTime.format('HH:mm') })
		}

		this.state = {
			initialHour,
			finalHour
		}

		this.onSubmit = this.onSubmit.bind(this)
	}


	onSubmit() {
		const { user } = this.props
		const data = {
			initialHour: this.refs.initialHour.value,
			finalHour: this.refs.finalHour.value
		}
		const url = `/api/users/${user.uuid}/mentor-slots`

		request.post(url, data).then((res) => {
			this.setState({
				success: res.body.success
			})
		})
	}

	render() {
		const { user } = this.props
		const { initialHour, finalHour, success } = this.state

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Asignar sesiones de mentoría</h3>
				</div>

				<div className="panel-body">
					{success && (
						<div className="alert alert-success">{success}</div>
					)}

					<div className="col-xs-12">
						<div className="col-xs-12">
							<div className="form-group">
								<p className="label-over-input">
									<label>Nombre</label>
								</p>
								<input type="text" ref="table" className="form-control" placeholder="Mesa" defaultValue={user.table}/>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-xs-12 col-md-6">
							<div className="form-group">
								<p className="label-over-input">
									<label>Hora de inicio</label>
								</p>
								<select ref="initialHour" data-toggle="select" className="form-control select select-default mrs mbm">
									{initialHour.map((slot) => (
										<option key={slot.value} value={slot.value}>{slot.label}</option>
									))}
								</select>
							</div>
						</div>
						<div className="col-xs-12 col-md-6">
							<div className="form-group">
								<p className="label-over-input">
									<label>Hora de termino</label>
								</p>
								<select ref="finalHour" data-toggle="select" className="form-control select select-default mrs mbm">
									{finalHour.map((slot) => (
										<option key={slot.value} value={slot.value}>{slot.label}</option>
									))}
								</select>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="col-xs-12">
							<button className="btn btn-lg btn-block btn-primary" onClick={this.onSubmit}>Agregar</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = UserMentorship
