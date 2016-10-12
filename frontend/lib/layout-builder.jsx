const React = require('react')
const _ = require('lodash')

const Layout = {}
Layout._widgets = {}
Layout._layouts = {}

class Builder extends React.Component {
	constructor(props) {
		super(props)

		if(this.props.layout){
			this.layout = this.getLayoutByType(this.props.layout.type)
		}

		if(!this.layout){
			throw new Error('No layout defined')
		}
	}

	getLayoutByType(type) {
		return Layout._layouts[type]
	}

	render() {
		const Layout = this.layout

		return (
			<div>
				<Layout
					{...this.props}
				/>
			</div>
		)
	}
}

class Component extends React.Component {
	constructor(props) {
		super(props)
	}

	getWidget(type) {
		return Layout._widgets[type]
	}

	buildSection(sectionName) {
		var self = this
		var section = this.props.layout[sectionName]

		if(!section){
			return console.warn('Section '+ sectionName +' not defined')
		}

		return section.map(function (item) {
			const Element = self.getWidget(item.type)
			if(!Element){
				console.warn('Widget type '+ item.type +' not defined')
				return <div key={item.name}></div>
			}

			var data = _.mapValues(self.props.currentStage.data, (o) => {return o.value || o.default})

			// if(!data){data = {}}

			if(item.data){
				if(typeof item.data === "string" && item.data[0] === ':'){
					var dataKey = item.data.replace(':','')

					if(self.props.currentStage.data[dataKey]){
						var defaultData = _.mapValues(self.props.currentStage.data[dataKey].properties, (o) => {return o.default})
						data = _.merge({}, defaultData, data[dataKey])
					}else{
						if(data[dataKey]){
							data = data[dataKey]
						}
					}
				}else{
					_.forIn(item.data, function(value, key){
						if(typeof value === "string" && value[0] === ':'){
							var dataKey = value.replace(':','')
							data[key] = data[dataKey]
							delete data[dataKey]
						}else{
							data[key] = value
						}
					})
				}
			}

			data.currentStage = self.props.currentStage
			data.generalData = self.props.generalData
			data.currentProject = self.props.currentProject
			data.currentUser = self.props.currentUser

			const content = React.createElement(Element, data)

			return <div key={item.name}>
				{content}
			</div>
		})
	}
}

Layout.registerLayout = function (name, layout) {
	this._layouts[name] = layout
}

Layout.registerWidget = function (name, widget) {
	this._widgets[name] = widget
}

Layout.Builder = Builder
Layout.Component = Component

module.exports = Layout
