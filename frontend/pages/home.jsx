const React = require('react')
const ReactDOM = require('react-dom')
const ReactMarkdown = require('react-markdown')

const request = require('../lib/request')
const RegisterProject = require('../components/public/register-proyect.jsx')
const LogIn = require('../components/public/login')

const emails = process.env.EMAILS

class HomePage extends React.Component {
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
				currentStage: currentData.currentStage,
				hackathon: currentData.hackathon,
				userData: currentData.userData,
				projectData: currentData.projectData,
				welcomeData: data.welcomeData
			})
		})
	}

	render() {
		const { loading, hackathon, currentStage, userData, projectData, welcomeData } = this.state

		if (loading) {
			return <div/>
		}

		var content

		if(hackathon.participants && currentStage.registrationActive){
			content = (<div className='row'>
				<div className='col-xs-12 col-md-4'>
			        <img src="/assets/imgs/que-es.png" className="que-es" alt="" />
			        <a href="/login" className="btn btn-primary">Log in</a>
					<div className="aside">
						<ReactMarkdown source={welcomeData.sidebar} />
					</div>
				</div>
				<div className='col-xs-12 col-md-8'>
					<ReactMarkdown source={welcomeData.description} />
					<RegisterProject userData={userData} projectData={projectData} terms={welcomeData.terms}/>
				</div>
			</div>)
		}else{
			content = (<div className='row'>
				<div className='col-xs-12 col-md-6'>
					<ReactMarkdown source={welcomeData.description} />
				</div>
				<div className='col-xs-12 col-md-6'>
					<LogIn csrf={window._csrf} emails={emails}/>
				</div>
			</div>)
		}

		return content
	}
}

ReactDOM.render((<HomePage/>), document.getElementById('main'))
