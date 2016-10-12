const React = require('react')
const ReactMarkdown = require('react-markdown')

/*
This widget requires:
- title
- content
*/

class QualifyList extends React.Component {
	constructor(props) {
		super(props)
		this.displayName = 'QualifyList'
	}
	render() {
		var listUri = `/listados/stage/${this.props.currentStage.uuid}`

		return <div className="widget widget-5">
			<div className="widget-head">
				<h3 className="panel-title">{this.props.title}</h3>
			</div>
			<div className="widget-body">
				{ this.props.description ?
					<ReactMarkdown source={this.props.description} /> :
					<p />
				}
				<a href={listUri} className="btn btn-primary">Ver todos los resultados</a>
			</div>
		</div>
	}
}

module.exports = QualifyList