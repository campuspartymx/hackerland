const React = require('react')
const request = require('../lib/request.js')
const { PropTypes } = React

class ReviewAlert extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true,
			review: null
		}
	}

	componentDidMount() {
		const { currentProject, currentStage } = this.props

		request
			.get(`/api/projects/${currentProject.uuid}/reviews/${currentStage.uuid}`)
			.then(({ body }) => {
				this.setState({
					loading: false,
					review: body.review
				})
			})
	}

	render() {
		if (this.state.loading || !this.props.currentStage.review) return <div/>

		const { review } = this.state
		const { props } = this

		if (review && review.completed) {
			return (
				<div className="panel-widget panel panel-default success notification">
					<div className='panel-heading'>
						<span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
						<h3 className='panel-title'>{props.textSuccess}</h3>
					</div>
					<div className='panel-body'>
						<p>{props.descriptionSuccess}</p>
					</div>
				</div>
			)
		} else {
			return (
				<div className="widget widget-5 widget-large">
					<div className='widget-head'>
						<h3 className='panel-title'>{props.text}</h3>
					</div>
					<div className='widget-body'>
						<p>{props.description}</p>
						<a href="/proyecto/revision" className="btn btn-primary">Iniciar Evaluaciones</a>
					</div>
				</div>
			)
		}
	}
}

ReviewAlert.propTypes = {
	currentProject: PropTypes.object.isRequired,
	currentStage: PropTypes.object.isRequired
}

module.exports = ReviewAlert
