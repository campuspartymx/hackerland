const React = require('react')
const ReactMarkdown = require('react-markdown')

/*
This widget requires:
- title
- subtitle
- endLabel
- description
*/

class CurrentStage extends React.Component {
    constructor(props) {
        super(props)
        this.displayName = 'CurrentStage'
    }
    render() {
        return <div className="widget widget-2">
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

module.exports = CurrentStage