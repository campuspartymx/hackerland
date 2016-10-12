const React = require('react')
const _ = require('lodash')
const request = require('../../lib/request.js')

class ReviewData extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true
		}
	}

	componentDidMount() {
		const { project } = this.props

		Promise.all([
			request.get(`/api/projects/${project.uuid}/reviews`),
			request.get(`/api/stages`)
		]).then((responses) => {
			const reviews = responses[0].body.reviews
			const stages = responses[1].body.stages

			this.setState({
				reviews,
				stages,
				loading: false
			})
		})
	}

	getFieldValue(path, object = {}) {
		let value = object

		for (const key of path.split('.')) {
			value = value && value[key] ? value[key] : ''
		}

		return value
	}


	renderContent(schema, review, key) {
		if (schema.type === 'Object') {
			const title = key.split('.').length === 1
				? <h2 className="article-title">{schema.title}</h2>
				: <h3 className="article-subsection">{schema.title}</h3>

			return (
				<div key={key}>
					{title}
					{_.map(schema.properties, (data, property) => {
						return this.renderContent(data, review, `${key}.${property}`)
					})}
				</div>
			)
		}

		const value = this.getFieldValue(key, review)

		return (
			<div key={key}>
				<label>{schema.title}</label>
				<p>{value}</p>
			</div>
		)
	}

	render() {
		if (this.state.loading) {
			return <div/>
		}

		const { stages, reviews } = this.state
		const components = []

		reviews.forEach((review) => {
			const stage = _.find(stages, (s) => s._id === review.stage)

			components.push((
				<div key={review._id}>
					{this.renderContent(stage.review, review, 'answers')}
				</div>
			))
		})

		if(!components.length){
			return <div/>
		}

		return (
			<view className='panel widget-5'>
				{components}
			</view>
		)
	}
}

module.exports = ReviewData
