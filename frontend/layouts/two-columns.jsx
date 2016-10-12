const React = require('react')
const LayoutBuilder = require('../lib/layout-builder')

class TwoColumnsLayout extends LayoutBuilder.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const sidebar = this.buildSection('sidebar')
		const content = this.buildSection('content')

		return (
			<div className="row">
				<div className="col-xs-12 col-sm-4">
					{sidebar}
				</div>

				<div className="col-xs-12 col-sm-8">
					{content}
				</div>
			</div>
		)
	}
}

module.exports = TwoColumnsLayout