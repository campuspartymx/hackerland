const React = require('react')
const _ = require('lodash')

class ReviewData extends React.Component {

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
		const { props } = this

		return (
			<div key={props.review._id} className='panel widget-5'>
				{this.renderContent(props.stage.review, props.review, 'answers')}
				{props.children}
			</div>
		)
	}
}

module.exports = ReviewData
