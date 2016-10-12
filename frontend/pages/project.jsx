const React = require('react')
const ReactDOM = require('react-dom')
const ReactMarkdown = require('react-markdown')
const request = require('../lib/request')

const Layout = require('../lib/layout-builder.jsx')
require('../layouts')
require('../widgets')

class ProyectPage extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true,
			currentStage: {},
			hackathon: {}
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

			this.setState({
				loading: false,
				hackathon: currentData.hackathon,
				currentUser: currentData.currentUser,
				currentProject: currentData.currentProject,
				currentStage: currentData.currentStage,
				welcomeData: data.welcomeData
			})
		})
	}

	render() {
		const { loading, hackathon, currentUser, currentProject, currentStage, welcomeData } = this.state

		if (loading) {
			return <div/>
		}

		if (!currentProject.participating) {
			return (
				<div className='col-md-4 col-md-offset-4'>
					<div className='panel-widget panel panel-default'>
						<div className='panel-heading'>
							<h3 className='panel-title'>No haz avanzado a la siguiente etapa</h3>
						</div>
						{welcomeData.sorry ? (
							<div className='panel-body'>
								<ReactMarkdown source={welcomeData.sorry} />
							</div>
						) : null}
					</div>
				</div>
			)
		}

		return (
			<div className='row'>
				<Layout.Builder
					layout={currentStage.projectLayout}
					currentStage={currentStage}
					currentProject={currentProject}
					currentUser={currentUser}
					generalData={welcomeData}/>
			</div>
		)
	}
}

ReactDOM.render((<ProyectPage/>), document.getElementById('main'))
