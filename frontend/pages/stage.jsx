const React = require('react')
const ReactDOM = require('react-dom')
const Evaluations = require('../components/admin/evaluations.jsx')
const request = require('../lib/request')
const StageData = require('../components/admin/stage-data.jsx')

class StagePage extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true,
			stage: {}
		}
	}

	componentDidMount() {
		const stageUuid = window.location.pathname.split('/')[3]

		Promise.all([
			request.get(`/api/stages/${stageUuid}`),
			request.get('/api/current-data')
		])
		.then((responses) => {
			const stage = responses[0].body
			const currentData = responses[1].body

			this.setState({
				loading: false,
				stage,
				hackathon: currentData.hackathon
			})
		})
	}


	render() {
		const { loading, stage, hackathon } = this.state

		if (loading) {
			return <div/>
		}

		var evaluations
		if( stage.evaluation && stage.evaluation.length ){
			evaluations = <Evaluations stage={stage} hackathon={hackathon} />
		}

		return (
			<div>
				<StageData stage={stage} />
				{ evaluations }
			</div>
		)
	}
}

ReactDOM.render((<StagePage/>), document.getElementById('main'))
