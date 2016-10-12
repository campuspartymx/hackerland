const React = require('react')
const request = require('../../lib/request.js')

class Mentors extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true,
			processing: false
		}

		this.onAssingMentor = this.onAssingMentor.bind(this)
		this.onEvaluateMentor = this.onEvaluateMentor.bind(this)
	}

	componentDidMount() {
		this.getMentorship()
		this.setState({ loading: false })
	}

	getMentorship () {
		request.get('/api/projects/mentorship').then((res) => {
			this.setState({
				skills: res.body.skills,
				mentorSlot: res.body.mentorSlot
			})
		})
	}

	onAssingMentor() {
		if (this.state.processing) return

		this.setState({ processing: true })
		const skill = this.refs.skill.value

		request.post('/api/projects/mentorship', { skill }).then((res) => {
			this.setState({ processing: true })
			this.getMentorship()
		})
	}

	onEvaluateMentor(e) {
		e.preventDefault()

		const { mentorSlot } = this.state
		const url = `/api/projects/mentorship/${mentorSlot.uuid}/evaluate`
		const mentorRate = this.refs.mentorRate.value

		request.post(url, { mentorRate }).then((res) => {
			this.getMentorship()
		})
	}


	render() {
		const { loading, skills, mentorSlot } = this.state
		const content = []

		if (loading || !skills || skills.length || !mentorSlot) {
			return <div/>
		}

		if (skills && skills.length) {
			content.push((
				<div className='request' key='skills'>
					<p className="label-over-input">
						<label>Seleccionar el perfil del mentor</label>
					</p>

					<select ref='skill' className='form-control select select-default mrs mbm'>
						{skills.map((skill, i) => (
							<option value={skill} key={skill}>{skill}</option>
						))}
					</select>

					<button className='btn btn-lg btn-block btn-primary' onClick={this.onAssingMentor}>
						Asignar
					</button>
				</div>
			))
		}

		if (mentorSlot && mentorSlot.current) {
			const text = `Mentoria asingnada de ${mentorSlot.startTime} a ${mentorSlot.endTime} en la mesa ${mentorSlot.table}`
			content.push((<div className='info' key='info'>{text}</div>))
		}

		if (mentorSlot && !mentorSlot.current) {
			content.push((
				<div className='evaluate' key='evaluate'>
					<form action="">
						<div className="form-group">
							<p className="label-over-input">
								<label>Califica al mentor:</label>
							</p>

							<select ref='mentorRate' className='form-control select select-default mrs mbm'>
								{[1, 2, 3, 4, 5].map((rate) => (
									<option value={rate} key={rate}>{rate}</option>
								))}
							</select>

							<button className='btn btn-lg btn-block btn-primary' onClick={this.onEvaluateMentor}>Evaluar</button>
						</div>
					</form>
				</div>
			))
		}

		return (
			<div className='alert alert-info'>
				<h4>Sesiones con mentoria</h4>
				{content}
			</div>
		)
	}
}

module.exports = Mentors

