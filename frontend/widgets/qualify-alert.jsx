const React = require('react')
const ReactMarkdown = require('react-markdown')
const { PropTypes } = React

class QualifyAlert extends React.Component {
	render() {
		const { props } = this
		const title = props.text || 'Felicidades'

		return (
			<div className="panel-widget panel panel-default success notification">
				<div className='panel-heading'>
					<span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
					<h3 className='panel-title'>{title}</h3>
				</div>

				{props.description ? (
					<div className='panel-body'>
						<ReactMarkdown source={props.description} />
					</div>
				) : null}
			</div>
		)
	}
}

QualifyAlert.propTypes = {
	text: PropTypes.string,
	description: PropTypes.string
}

module.exports = QualifyAlert
