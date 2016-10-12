const React = require('react')
const request = require('../lib/request.js')

class ProjectList extends React.Component {
	constructor(props) {
		super(props)
		this.displayName = 'ProjectList'

		this.state = {
			projects : []
		}
	}

	componentDidMount() {
		request.get('/api/projects/?participating=true&evaluated=true').then((res) => {
			this.setState({
				projects: res.body
			})
		})
	}	

	render() {
		const projects = this.state.projects.map( (project) => {
			const projectUrl = '/staff/evaluacion/'+ project.uuid 
			var button

			if(!project.evaluated){
				button = (<a href={projectUrl} className="btn btn-lg btn-primary btn-block"><span>{ project.number }</span> - <span>{ project.name }</span> <span className="fui-arrow-right pull-right"></span></a>)
			}else{
				button = (<button href="/staff/evaluacion/{ project.number }" className="btn btn-lg btn-block" disabled="disabled"><span>{ project.number }</span> - <span>{ project.name }</span> Evaluado</button>)
			}

			return <p className="project-row" key={project.uuid}>
				{ button }
			</p>
		})

		return <div className="panel-widget panel panel-default">
			<div className="panel-heading">
				<h3 className="panel-title">Lista de proyectos</h3>
			</div>
			<div className="panel-body">
				<p>Busca el proyecto que esta por presentar y da click en su nombre para evaluarlos</p>
				{ projects }
			</div>
		</div>
	}
}

module.exports = ProjectList