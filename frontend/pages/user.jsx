const React = require('react')
const ReactDOM = require('react-dom')
const request = require('../lib/request.js')

const UserInformation = require('../components/admin/user-information.jsx')
const UserRole = require('../components/admin/user-role.jsx')
const UserSkills = require('../components/admin/user-skills.jsx')
const UserTable = require('../components/admin/user-table.jsx')
const UserMentorship = require('../components/admin/user-mentorship.jsx')
const UserMentorships = require('../components/admin/user-mentorships.jsx')
const UserEvaluations = require('../components/admin/user-evaluations.jsx')

class User extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true
		}
	}

	componentDidMount() {
		const userUuid = window.location.pathname.split('/')[3]

		Promise.all([
			request.get(`/api/users/${userUuid}`),
			request.get('/api/current-data')
		]).then((responses) => {
			const user = responses[0].body
			const currentData = responses[1].body

			this.setState({
				loading: false,
				user: user,
				hackathon: currentData.hackathon
			})
		})
	}
	render() {
		if (this.state.loading) {
			return <div/>
		}

		const { user, hackathon } = this.state

		return (
			<div className='row'>
				<div className='col-lg-6'>
					<UserInformation user={user}/>

					{hackathon.mentors && (
							<UserTable user={user}/>
					)}


					{hackathon.mentors && (
							<UserMentorship user={user}/>
					)}
				</div>

				{user.role === 'staff' && hackathon.mentors && (
					<div className="col-lg-6">
						<UserRole user={user} hackathon={hackathon}/>
					</div>
				)}

				{hackathon.mentors && hackathon.mentorSkills && (
					<div className="col-lg-6">
						<UserSkills user={user} hackathon={hackathon} />
					</div>
				)}

				{/*
				{hackathon.mentors && (
					<div className="col-lg-6">
						<UserTable user={user}/>
					</div>
				)}

				{hackathon.mentors && (
					<div className="col-lg-6">
						<UserMentorship user={user}/>
					</div>
				)}
				*/}

				{hackathon.mentors && (
					<div className="col-xs-12">
						<UserMentorships user={user}/>
					</div>
				)}

				{user.isJudge && (
					<div className="col-xs-12">
						<UserEvaluations user={user}/>
					</div>
				)}
			</div>
		)
	}
}

ReactDOM.render((<User/>), document.getElementById('main'))
