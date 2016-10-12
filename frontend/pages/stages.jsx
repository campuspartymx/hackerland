const React = require('react')
const ReactDOM = require('react-dom')
const _ = require('underscore')
const request = require('../lib/request')

class Stages extends React.Component {
	constructor() {
		super()

		this.state = {
			loading: true
		}

		this.onUpdateStage = this.onUpdateStage.bind(this)
	}

	componentDidMount() {
		request.get('/api/stages').then((res) => {
			const stageActive = _.find(res.body.stages, (stage) => stage.isActive)

			this.setState({
				stageActive,
				loading: false,
				stages: res.body.stages
			})
		})
	}

	onUpdateStage() {
		const stageId = this.refs.stageId.value
		const { stages } = this.state

		request.post('/api/stages', { stageId }).then(() => {
			stages.forEach((stage)=>stage.isActive = false)

			const stageActive = _.find(stages, (stage) => stageId === stage._id)
			stageActive.isActive = true
			this.setState({ stageActive })
		})
	}

	render() {
		const { loading, stages } = this.state
		var { stageActive, stageActiveHeader } = this.state

		if (loading) {
			return <div/>
		}

		if(!stageActive){
			stageActive = {}
			stageActiveHeader = (<h3>No hay etapa activa</h3>)
		}else{
			stageActiveHeader = (<h3>Etapa activa: <strong>{stageActive.description.label}</strong></h3>)
		}

		return (
			<div className='row'>
				<div className='col-lg-6'>
					<div className="panel panel-default">
						<div className="panel-heading">
							{ stageActiveHeader }
						</div>
						<div className="panel-body">
							{stages.map((stage, i) => {
								var buttonClass = "btn btn-default"
								if(stage.isActive){
									buttonClass = "btn btn-primary"
								}

								return <div className="stage-row" key={i}>
									<a href={`/admin/stages/${stage.uuid}`} className={buttonClass}>
										{stage.description.label}
										<p>{stage.description.description}</p>
									</a>
								</div>
							})}
						</div>
					</div>
				</div>

				<div className='col-lg-6'>
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">Actualizar etapa</h3>
						</div>
						<div className="panel-body">
							<div className='form-group'>
								<label>Etapa</label>
								<select ref='stageId' className='form-control' defaultValue={stageActive._id}>
									{stages.map((stage) => (
										<option key={stage._id} value={stage._id}>
									  	{stage.description.label}
									  </option>
									))}
								</select>
								<br/>
								<button className='btn btn-primary' onClick={this.onUpdateStage}>Actualizar</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

ReactDOM.render((<Stages/>), document.getElementById('main'))
