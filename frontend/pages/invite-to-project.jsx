const React = require('react')
const HTForm = require('../components/HTForm')
const render = require('../render')
const request = require('../lib/request')
const parseDataToForm = require('../lib/parseDataToForm')

class InviteToProject extends React.Component {
	constructor(props) {
		super()

		this.state = {
			loading: true
		}

		this.form = parseDataToForm({
			title: 'Activar cuenta',
			type: 'Object',
			properties: props.userData
		})

		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidMount() {
		const { origin, pathname, search } = window.location
		const url = origin + pathname + '/validation' + search

		request
			.get(url)
			.then(({ body }) => {
				this.setState({
					loading: false,
					user: body.user,
					error: body.error
				})
			})
	}

	onSubmit({ formData }) {
		formData._csrf = window._csrf

		request
			.post(window.location, formData)
			.then(({ body }) => {
				if (body.error) {
					this.setState({
						error: body.error
				 	})
				} else {
					window.location.reload()
				}
			})
	}

	render() {
		if (this.state.loading) return <div/>

		const { user, error } = this.state

		if (error) {
			return (
				<div className="col-md-6 col-md-offset-3 col-xs-12">
					<div className="panel-widget panel panel-default error notification">
						<div className="panel-heading">
							<span className="glyphicon glyphicon-remove"/>
							<h3 className="panel-title active">Invitación invalida</h3>
						</div>
						<div className="panel-body">{error}</div>
					</div>
				</div>
			)
		}

		return (
			<div className="col-md-6 col-md-offset-3 col-xs-12">
				<div className='panel-widget panel panel-default'>
					<div className='panel-body'>
						<HTForm
							ref="form"
							{...this.form}
							onSubmit={this.onSubmit}
							formData={user}>
							<button type="submit"  className="btn btn-info">Crear</button>
						</HTForm>
					</div>
				</div>
			</div>
		)
	}
}

render(InviteToProject)
