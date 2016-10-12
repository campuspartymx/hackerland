const React = require('react')
const request = require('../lib/request')
const render = require('../render')

const RegisterProjectForm = require('../components/admin/register-project-form.jsx')
const InviteStaff = require('../components/admin/invite-staff')

class Dashboard extends React.Component {
	render() {
		const { userData, projectData, hackathon, welcomeData } = this.props

		return (
			<div className='row'>
				<div className='col-xs-6'>
					<InviteStaff hackathon={hackathon}/>
				</div>
				<div className='col-xs-6'>
					<RegisterProjectForm userData={userData} projectData={projectData} hackathon={hackathon} />
				</div>
			</div>
		)
	}
}

render(Dashboard)
