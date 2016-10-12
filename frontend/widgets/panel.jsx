const React = require('react')

class Panel extends React.Component {
	constructor(props) {
		super(props)
		this.displayName = 'Panel'
	}
	render() {
		return <div className="panel">
			<h4>{this.props.title}</h4>
			{this.props.description.split('\n').map(function(item, i) {
				return (<p key={i}>
					{item}
				</p>)
			})}
		</div>
	}
}

module.exports = Panel