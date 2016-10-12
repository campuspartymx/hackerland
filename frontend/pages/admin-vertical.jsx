const React = require('react')
const ReactDOM = require('react-dom')
const request = require('../lib/request.js')
const parseDataToForm = require('../lib/parseDataToForm')

const VerticalsEdit = require('../components/admin/verticals-edit.jsx')

class AdminVerticals extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			vertical: {}
		}
	}

	componentDidMount() {
		const verticalUuid = window.location.pathname.split('/')[3]

		Promise.all([
			request.get('/api/verticals/'+verticalUuid)
		]).then((responses) => {
			const vertical = responses[0].body

			this.setState({
				vertical,
				loading: false
			})
		})
	}

	render() {
		if (this.state.loading) {
			return <div/>
		}

		return (
			<div className="row">
				<VerticalsEdit vertical={this.state.vertical}/>
			</div>
		)
	}
}

ReactDOM.render((<AdminVerticals/>), document.getElementById('main'))
