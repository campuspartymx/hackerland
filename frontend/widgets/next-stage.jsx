const React = require('react')
const ReactMarkdown = require('react-markdown')

class NextStage extends React.Component {
    constructor(props) {
        super(props)
        this.displayName = 'NextStage'
    }
    render() {
        return <div className="widget widget-3">
			<div className="widget-head">
				<h3 className="title">{this.props.title}</h3>
			</div>
			<div className="widget-body">
				<h4 className="subtitle">{this.props.subtitle}</h4>
				<small>{this.props.endLabel}</small>
				{ this.props.description && 
					<ReactMarkdown source={this.props.description} />
				}
			</div>
		</div>
    }
}

module.exports = NextStage