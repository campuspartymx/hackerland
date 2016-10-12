const React = require('react')
const ReactMarkdown = require('react-markdown')

class TipsPanel extends React.Component {
    constructor(props) {
        super(props)
        this.displayName = 'TipsPanel'
        this.content = this.props.generalData.sidebar
    }
    render() {
        return <div className="aside">
			<ReactMarkdown source={ this.content } />
		</div>
    }
}

module.exports = TipsPanel