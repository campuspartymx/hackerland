const React = require('react')
const _ = require('underscore')
const request = require('../../lib/request')

class Evaluations extends React.Component {
	constructor(props) {
		super()

		this.state = {
			loading: true,
			projects: [],
			stage: props.stage
		}

		this.onCalculate = this.onCalculate.bind(this)
		this.onSave = this.onSave.bind(this)
	}

	componentDidMount() {
		if (!this.props.stage.evaluated) {
			if( _.isEmpty(this.refs) ){
				return;
			}

			this.onCalculate()
		} else {
			this.setState({ loading: false })
		}
	}

	getBody() {
		const body = {
			include: this.refs.include.value.replace(/\s/g, '').split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n)),
			exclude: this.refs.exclude.value.replace(/\s/g, '').split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n)),
			limit: parseInt(this.refs.limit.value, 10)
		}
		const { hackathon } = this.props

		if (hackathon.verticals) {
			body.vertical = this.refs.vertical.value
		}

		return body
	}

	onCalculate() {
		const { stage } = this.state
		const body = this.getBody()

		request
			.post(`/api/stages/${stage.uuid}/calculate-evaluation`, body || {})
			.then((res) => {
				this.setState({
					projects: res.body,
					loading: false
				})
			})
	}

	onSave() {
		const c = confirm('¿Estas seguro de agregar estos proyectos a la siguiente fase?')
		if (!c) return

		const { stage } = this.state
		if (stage.evaluated) return

		const body = this.getBody()

		request
			.post(`/api/stages/${stage.uuid}/save-evaluation`, body)
			.then((res) => {
				this.setState({
					stage: Object.assign({}, stage, { evaluated: true })
				})
			})
	}

	renderForm() {
		const { hackathon } = this.props
		const { stage } = this.props

		return (
			<div className='col-md-4'>
				<div className='form-group'>
					<p className='label-over-input'>
						<label>Incluir equipos</label>
					</p>
					<textarea className='form-control' ref='include'/>
				</div>

				<div className='form-group'>
					<p className='label-over-input'>
						<label>Excluir equipos</label>
					</p>
					<textarea className='form-control' ref='exclude'/>
				</div>

				<div className='form-group'>
					<p className='label-over-input'>
						<label>Número de equipos</label>
					</p>
					<input type='number' className='form-control' ref='limit'/>
				</div>

				{hackathon.verticals && (
					<div className='form-group'>
						<p className='label-over-input'>
							<label>Vertical</label>
						</p>
						<select ref='vertical' required>
							{_.map(hackathon.verticals, (vertical, i) => (
								<option value={vertical.name} key={i}>{vertical.title}</option>
							))}
						</select>
					</div>
				)}

				<button className='btn btn-info' onClick={this.onCalculate} >Calcular</button>
			</div>
		)
	}

	renderTable() {
		const { projects, stage } = this.state

		return (
			<div className='col-md-8'>
				<div>
					<table className='table table-bordered table-hover table-container'>
						<thead>
							<tr>
								<td>Número</td>
								<td>Nombre</td>
								<td>Promedio</td>
							</tr>
						</thead>
						<tbody>
							{projects.map((project) => (
								<tr key={`project-${project._id}`}>
									<td>{project.number}</td>
									<td>{project.name}</td>
									<td>{project.scores ? project.scores[stage.description.name] : 0 }</td>
								</tr>
							))}
						</tbody>
					</table>
					{projects.length ? (
						<button id='save' className='btn btn-danger' onClick={this.onSave}>Guardar equipos</button>
					) : null}
				</div>
			</div>
		)
	}

	render() {
		const { stage, projects } = this.state

		const title = stage.evaluated
			? `Calcular evalucaciones`
			: `Calcular evaluaciones (${projects.length} equipos)`

		return (
			<div className='panel panel-default'>
				<div className='panel-heading'>
					<h3 className='panel-title'>{title}</h3>
				</div>

				<div className='panel-body'>
					{stage.evaluated ? (
						<div>
							Etapa etapa ya fue evaluada.
							<br/><br/>
							<a href={`/admin/stages/${stage.uuid}/results`}>Ver resultados</a>
						</div>
					): (
						<div>
							{this.renderTable()}
							{this.renderForm()}
						</div>
					)}
				</div>
			</div>
		)
	}
}

module.exports = Evaluations
