const React = require('react')
const _ = require('underscore')
const request = require('../../lib/request.js')

class UserSkills extends React.Component {
	constructor(props) {
		super()

		this.state = {
			userSkills: props.user.skills
		}

		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)
	}

	onChange(e) {
		const { userSkills } = this.state

		if (e.target.checked && userSkills.length < 3) {
			this.setState({
				userSkills: [...userSkills, e.target.value]
			})
		} else {
			this.setState({
				userSkills: userSkills.filter((skill) => skill !== e.target.value)
			})
		}
	}

	onSubmit() {
		const { user } = this.props
		const url = `/api/users/${user.uuid}/skills`

		request.post(url, { skills: this.state.userSkills }).then((res) => {
			this.setState({
				success: res.body.success
			})
		})
	}

	render() {
		const { hackathon, user } = this.props
		const { userSkills, success } = this.state

		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Habilidades</h3>
				</div>

				<div className="panel-body">
					<div className="form-group">
						{success && (
							<div className="alert alert-success">{success}</div>
						)}

						<p id="skills-instructions">Elige las 3 habilidades mas importantes del mentor</p>

						{_.map(hackathon.mentorSkills, (skill, i) => (
							<div className="checkbox" key={i}>
								<label>
									<input
										type="checkbox"
										ref="skills"
										value={skill}
										checked={~userSkills.indexOf(skill)}
										onChange={this.onChange}
									/>
									{skill}
								</label>
							</div>
						))}

						<button className="btn btn-primary" onClick={this.onSubmit}>Salvar</button>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = UserSkills
