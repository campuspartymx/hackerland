const React = require('react')
const request = require('../../lib/request.js')
const { PropTypes } = React

const emails = process.env.EMAILS
const appHost = process.env.APP_HOST

class Team extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true,
			team: [],
			error: '',
			success: ''
		}

		this.onInvite = this.onInvite.bind(this)
		this.onLeave = this.onLeave.bind(this)
		this.createUrl = this.createUrl.bind(this)
	}

	componentDidMount() {
		this.getData()
	}

	getData() {
		request.get('/api/projects/team').then((res) => {
			this.setState({
				loading: false,
				team: res.body
			})
		})
	}

	onInvite(e) {
		e.preventDefault()

		const name = this.refs.name.value
		const email = this.refs.email.value

		request.post('/api/projects/team/invite', { name, email }).then((res) => {
			this.setState({ success: res.body.success, error: '' })

			this.refs.name.value = ''
			this.refs.email.value = ''

			this.getData()
		})
		.catch((err) => {
			const body = err.response.body
			this.setState({
				error: body ? body.error : err,
				success: ''
			})
		})
	}

	onRemove(uuid) {
		request.post(`/api/projects/team/remove/${uuid}`).then((res) => {
			this.setState({
				success: res.body.success,
				error: '',
				team: this.state.team.filter((participant) => participant.uuid !== uuid)
			})
		})
		.catch((err) => {
			const body = err.response.body
			this.setState({
				error: body ? body.error : err,
				success: ''
			})
		})
	}

	onLeave() {
		request.get('/api/projects/team/leave').then((res) => {
			window.location.reload()
		})
		.catch((err) => {
			const body = err.response.body
			this.setState({
				error: body ? body.error : err,
				success: ''
			})
		})
	}

	createUrl(user) {
		const { currentProject } = this.props
		return `${appHost}/email/invitacion/${currentProject.uuid}?email=${encodeURIComponent(user.email)}`
	}

	render() {
		if (this.state.loading) {
			return <div/>
		}

		const { team, success, error } = this.state
		const { currentUser, currentProject } = this.props
		const isOwner = currentUser._id === currentProject.owner
		const content = []

		if (error) {
			content.push((
				<div key='error' className='panel-widget panel panel-default error notification notification-small'>
					<div className="panel-body">
						<p>{error}</p>
					</div>
				</div>
			))
		}

		if (success) {
			content.push((
				<div key='error' className='panel-widget panel panel-default success notification notification-small'>
					<div className="panel-body">
						<p>{success}</p>
					</div>
				</div>
			))
		}

		if (team.length === 1 && !success && !error) {
			content.push((
				<div key='1' className='panel-widget panel panel-default error notification notification-small'>
					<div className="panel-body">
						<p>El equipos debe ser de al menos dos integrantes.</p>
					</div>
				</div>
			))
		}

		if (team.length < 5 && isOwner) {
			content.push((
				<form key='2' className='form-inline' action='/proyecto/invitar'>
					<div className='row'>
						<div className='col-md-4'>
							<label className='sr-only'>Nombre</label>
							<input type='text' className='form-control' ref='name' placeholder='Nombre' required/>
						</div>
						<div className='col-md-4'>
							<label className='sr-only'>Email</label>
							<input type='email' className='form-control' ref='email' placeholder='Email' required/>
							<span className='input-icon fui-question'></span>
						</div>
						<div className='col-md-4'>
							<button className='btn btn-default' type='submit' onClick={this.onInvite}>Invitar</button>
						</div>
					</div>
				</form>
			))
		}

		return (
			<div className='panel-widget panel panel-default team-widget'>
				<div className='panel-heading'>
					<div className='panel-title'>Participantes</div>
				</div>

				<div className='panel-body'>
					{content}

					{team.map((participant, i) => (
						<div className='row user-selected widget-3' key={i}>
							<div className='col-xs-8'>
								{participant.name}
								{participant.project || participant.active ? null : (
									<span className='light-text'>
										(Pendiente)
										{!emails && isOwner ? (
											<p>Link de activación => <strong>{this.createUrl(participant)}</strong></p>
										) : null}
									</span>
								)}
							</div>
							<div className='col-xs-4'>
								{isOwner && currentUser._id !== participant._id ? (
									<div className='text-right'>
										<button className='remove-participant btn btn-default inverse btn-inline' onClick={this.onRemove.bind(this, participant.uuid)}>
											<span className='fui-cross glyphicon glyphicon-remove'>

											</span>
										</button>
									</div>
								) : null}
							</div>
						</div>
					))}

					{isOwner ? null : (
						<button className='btn btn-default' onClick={this.onLeave}>Abandonar equipo</button>
					)}
				</div>
			</div>
		)
	}
}

Team.propTypes = {
	currentUser: PropTypes.object.isRequired,
	currentProject: PropTypes.object.isRequired
}

module.exports = Team
