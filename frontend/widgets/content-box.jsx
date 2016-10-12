const React = require('react')
const ReactMarkdown = require('react-markdown')

/*
This widget requires:
- title
- content
*/

class ContentBox extends React.Component {
    constructor(props) {
        super(props)
        this.displayName = 'ContentBox'
    }
    render() {
        return <div className="panel">
			<h2 className="title">{this.props.title}</h2>
			{ this.props.description && 
				<ReactMarkdown source={this.props.description} />
			}
        </div>
    }
}

module.exports = ContentBox