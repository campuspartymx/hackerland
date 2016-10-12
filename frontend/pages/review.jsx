const React = require('react')
const ReactDOM = require('react-dom')
const ReactMarkdown = require('react-markdown')
const _ = require('lodash')

const request = require('../lib/request')
const render = require('../render')
const parseDataToForm = require('../lib/parseDataToForm')
const HTForm = require('../components/HTForm.jsx')

const CustomTitleField = (props) => {
	const id = props.id.split('_')
	const formContext = props.formContext || {}

	if (id.length === 3) {
		return (
			<div>
				<h2 className='article-title'>{props.title}</h2>
				{formContext.success ?
					<div className='alert alert-success'>{formContext.success}</div>
				: null}
			</div>
		)
	}

	if (id.length === 4) {
		return <h3 className='article-subsection'>{props.title}</h3>
	}

	const legend = props.required ? props.title + '*' : props.title;
	return <strong>{legend}</strong>
};

class ReviewPage extends React.Component {
	constructor(props) {
		super()

		this.state = {
			loading: true,
			answers: 0
		}

		this.onSubmit = this.onSubmit.bind(this)
		this.onChange = this.onChange.bind(this)
		this.onSend = this.onSend.bind(this)
	}

	componentDidMount() {
		const { currentProject, currentStage } = this.props
		this.form = parseDataToForm(currentStage.review || {})

		this.keys = []

		_.forEach(currentStage.review.properties, (e, eName) => {
			if (e.type === 'Object') {
				_.forEach(e.properties, (el, elName) => {
					this.keys.push(`${eName}.${elName}`)
				})
			} else {
				this.keys.push(eName)
			}
		})

		Promise.all([
			request.get(`/api/projects/${currentProject.uuid}/reviews/${currentStage.uuid}`),
			request.get('/api/data/welcomeData')
		])
		.then((responses) => {
			const { review } = responses[0].body
			const data = responses[1].body
			const formData = review ? review.answers : {}

			this.setState({
				formData,
				loading: false,
				completed: review ? review.completed : false,
	 			answers: _.compact(_.at(formData, this.keys)).length,
	 			generalData: data.welcomeData
			})
		})
	}

	onSubmit({ formData }) {
		const { currentProject } = this.props

		request
			.post(`/api/projects/${currentProject.uuid}/reviews`, formData)
			.then((res) => {
				this.setState({
					formData,
					success: 'Información actualizada.'
				})
				window.scrollTo(0, 0)
			})
	}

	onSend(e) {
		e.preventDefault()

		window.location.href = '/proyecto/revision/confirmar'
	}

	onChange({ formData }) {
		this.setState({
			formData,
			answers: _.compact(_.at(formData, this.keys)).length
		})
	}

	render() {
		if (this.state.loading || !this.props.currentStage.review) {
			return <div/>
		}

		const { loading, formData, success, completed, answers, generalData } = this.state

		return (
			<div className='row'>
				<div className='col-xs-12 col-sm-4'>
					<div className='widget widget-2'>
						<div className='widget-head'>
							<h3 className='title'>{generalData.reviewTitle}</h3>
						</div>
						<div className='widget-body'>
							{ generalData.reviewInstructions &&
								<ReactMarkdown source={generalData.reviewInstructions} />
							}
							<div className='widget-stats'>{answers}/{this.keys.length}</div>
						</div>
					</div>

					<div className="aside">
						{ generalData.sidebar && 
							<ReactMarkdown source={generalData.sidebar} />
						}
					</div>					
				</div>

				<div className='col-xs-12 col-sm-8'>
					<div className='panel widget-5'>
						<HTForm
							ref='form'
							{...this.form}
							fields={{ TitleField: CustomTitleField }}
							formData={formData}
							onChange={this.onChange}
							formContext={{ success }}
							onSubmit={this.onSubmit}>
							<button type='submit' className='btn btn-default'>Guadar</button>
							{!completed ? (
								<div style={{ marginTop: 10 }}>
									<button className='btn btn-primary' onClick={this.onSend}>Enviar</button>
								</div>
							) : null}
						</HTForm>
					</div>
				</div>
			</div>
		)
	}
}

render(ReviewPage)
