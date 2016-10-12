const React = require('react')
const LayoutBuilder = require('../lib/layout-builder')

class SingleColumnLayout extends LayoutBuilder.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const content = this.buildSection('content')

		return (
			<div className="row single-column">
				<div className="col-xs-12 col-sm-offset-3 col-sm-6">
					{content}
				</div>
			</div>
		)
	}
}

module.exports = SingleColumnLayout