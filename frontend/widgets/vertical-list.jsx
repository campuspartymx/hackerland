const React = require('react')
const ReactMarkdown = require('react-markdown')

const request = require('../lib/request')
const { PropTypes } = React

class Vertical extends React.Component {
	render() {
		const { vertical, selected, onSelected } = this.props
		const classSelected = selected ? 'animate' : ''

		return (
			<div className='widget widget-vertical'>
				<div className='row equalize'>
					<div className='col-md-8'>

						<div className='widget-head'>
							<h3 className='panel-title'>{vertical.name}</h3>
							<hr/>
						</div>
						<div className='widget-body'>
						{ vertical.description && 
							<ReactMarkdown source={vertical.description} />
						}							
						</div>
					</div>
					<div className='col-md-4'>
						<a href='#' onClick={onSelected} className={'btn btn-default inverse btn-effect ' + classSelected }>
							<span className='glyphicon glyphicon-ok' aria-hidden='true'></span>
							Seleccionar
						</a>
					</div>
				</div>
			</div>
		)
	}
}

class VerticalList extends React.Component {
	constructor(props) {
		super()

		this.state = {
			currentVertical: props.currentProject.vertical,
			verticals: [],
			loading: true
		}
	}

	componentDidMount() {
		request
			.get(`/api/verticals/`)
			.then((res) => {
				this.setState({
					loading: false,
					verticals: res.body
				})
			})
	}

	onClick(vertical, e) {
		e.preventDefault()

		const { currentVertical } = this.state

		this.setState({
			currentVertical: vertical.name
		})

		request
			.post(`/api/projects/${this.props.currentProject.uuid}/vertical`, { vertical: vertical.name })
			.then((res) => {
			})
			.catch((err) => {
				this.setState({
					currentVertical
				})
			})
	}

	render() {
		const { currentProject, description } = this.props
		const { currentVertical, loading, verticals } = this.state

		if (loading) {
			return <div/>
		}

		const content = verticals.map((vertical) => (
			<Vertical
				key={vertical.name}
				vertical={vertical}
				selected={vertical.name === currentVertical}
				onSelected={this.onClick.bind(this, vertical)}
			/>
		))

		return (
			<div>
				<h2 className="article-title">
					Elige la vertical de tu proyecto
				</h2>
				{ description &&
					<ReactMarkdown source={ description } />
				}
				{content}
			</div>
		)
	}
}

VerticalList.propTypes = {
	currentProject: PropTypes.object.isRequired
}

module.exports = VerticalList
