const React = require('react')
const ReactDOM = require('react-dom')
const request = require('../lib/request')

const Layout = require('../lib/layout-builder.jsx')
require('../layouts')
require('../widgets')

const MentorSlots = require('../components/staff/mentor-slots.jsx')

class StaffPage extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true
		}
	}

	componentDidMount() {
		Promise.all([
			request.get('/api/current-data'),
			request.get('/api/data/welcomeData')
		])
		.then((responses) => {
			const currentData = responses[0].body
			const data = responses[1].body

			const newState = {
				loading: false,
				hackathon: currentData.hackathon,
				currentUser: currentData.currentUser,
				currentProject: currentData.currentProject,
				currentStage: currentData.currentStage,
				welcomeData: data.welcomeData
			}

			if (!currentData.currentUser.isMentor) {
				this.setState(newState)
				return
			}

			request.get('/api/users/mentor-slots').then((res) => {
				newState.mentorSlots = res.body.mentorSlots
				this.setState(newState)
			})
		})
	}

	render() {
		const { loading, currentStage, currentUser } = this.state

		if (loading) {
			return <div/>
		}

		console.log('=>', currentStage.description.name)
		const LayoutBuilder = Layout.Builder

		return (
			<div className='row'>
				<LayoutBuilder layout={currentStage.staffLayout} currentStage={currentStage}/>
			</div>
		)
	}
}

ReactDOM.render((<StaffPage/>), document.getElementById('main'))
