const React = require('react')
const render = require('react-dom').render
const request = require('./lib/request')

module.exports = function (Component) {
	class App extends React.Component {
		constructor() {
			super()

			this.state = {
				loading: true
			}
		}

		componentDidMount() {
			request.get('/api/current-data').then((res) => {
				const currentData = res.body
				this.setState({
					loading: false,
					currentData
				})
			})
		}

		render() {
			if (this.state.loading) return <div/>

			return (
				<Component {...this.state.currentData}/>
			)
		}
	}

	render(<App/>, document.getElementById('main'))
}
