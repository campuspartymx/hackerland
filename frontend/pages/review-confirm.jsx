const React = require('react')
const request = require('../lib/request')
const render = require('../render')
const ReviewData = require('../components/project/review-data')

class ReviewConfirm extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true
		}

		this.onConfirm = this.onConfirm.bind(this)
	}

	componentDidMount() {
		const { currentProject, currentStage } = this.props

		request
			.get(`/api/projects/${currentProject.uuid}/reviews/${currentStage.uuid}`)
			.then(({ body }) => {
				if (!body.review || body.review.completed) {
					window.location.href = '/proyecto'
				}

				this.setState({
					loading: false,
					review: body.review
			 	})
			})
	}

	onConfirm() {
		const { currentProject, currentStage } = this.props
		request
			.post(`/api/projects/${currentProject.uuid}/reviews/${currentStage.uuid}`)
			.then(({ body  }) => {
				window.location.href = '/proyecto'
			})
	}

	render() {
		if (this.state.loading) return <div/>

		const { state, props } = this

		return (
			<div className='row'>
				<div className="col-md-4">
					<div className="widget widget-1">
						<div className="widget-head">
							<h3>REVISIÓN</h3>
						</div>

						<div className="widget-action">
							<p>¿Deseas cambiar algo?</p>
							<a href="/proyecto/revision" className="btn btn-default inverse">
								Hazlo aqui
							</a>
						</div>
					</div>
				</div>

				<div className="col-md-8">
					<ReviewData
						review={state.review}
						stage={props.currentStage}
						project={props.currentProject}>
						<button className='btn btn-primary' onClick={this.onConfirm}>Enviar</button>
					</ReviewData>
				</div>
			</div>
		)
	}
}

render(ReviewConfirm)

