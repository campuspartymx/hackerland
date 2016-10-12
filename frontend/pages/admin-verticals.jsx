const React = require('react')
const ReactDOM = require('react-dom')
const request = require('../lib/request.js')
const parseDataToForm = require('../lib/parseDataToForm')

const VerticalsData = require('../components/admin/verticals-data.jsx')
const VerticalsList = require('../components/admin/verticals-list.jsx')

class AdminVerticals extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			verticals: []
		}

		this.addVertical = this.addVertical.bind(this)
	}

	componentDidMount() {
		Promise.all([
			request.get('/api/verticals')
		]).then((responses) => {
			const verticals = responses[0].body

			this.setState({
				verticals,
				loading: false
			})
		})
	}

	addVertical(vertical){
		this.state.verticals.push(vertical)
		this.setState({
			verticals: this.state.verticals
		})
	}

	render() {
		if (this.state.loading) {
			return <div/>
		}

		return (
			<div className="row">
				<VerticalsData addVertical={this.addVertical}/>
				<VerticalsList verticals={this.state.verticals}/>
			</div>
		)
	}
}

ReactDOM.render((<AdminVerticals/>), document.getElementById('main'))
