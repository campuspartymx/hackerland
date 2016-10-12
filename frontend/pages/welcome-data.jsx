const React = require('react')
const ReactDOM = require('react-dom')
const _ = require('underscore')
const request = require('../lib/request')
const WelcomeData = require('../components/admin/welcome-data.jsx')

class WelcomePage extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true
		}
	}

	componentDidMount() {
		Promise.all([
			request.get('/api/current-data')
		])
		.then((responses) => {
			const currentData = responses[0].body
			const hackathon = currentData.hackathon

			this.setState({
				hackathon,
				loading: false
			})
		})
	}

	render() {
		const { loading, hackathon } = this.state

		if (loading) {
			return <div/>
		}

		return (
			<div className='row'>
				<div className='col-xs-12'>
					<WelcomeData hackathon={hackathon} />
				</div>
			</div>
		)
	}
}

ReactDOM.render((<WelcomePage/>), document.getElementById('main'))
