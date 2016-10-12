const React = require('react')
const ReactMarkdown = require('react-markdown')

class Alert extends React.Component {
    constructor(props) {
        super(props)
        this.displayName = 'Alert'
    }
    render() {
        return <div className="widget widget-1">
			<div className="widget-head">
				<h3 className="title">
					{this.props.title}
				</h3>
				<hr/>
			</div>
			<div className="widget-body">
				{ this.props.description && 
					<ReactMarkdown source={this.props.description} />
				}
			</div>
		</div>
    }
}

module.exports = Alert