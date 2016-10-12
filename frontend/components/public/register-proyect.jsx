const React = require('react')
const HTForm = require('../HTForm')
const request = require('../../lib/request')
const parseDataToForm = require('../../lib/parseDataToForm')

const CustomTitleField = ({title, required}) => {
	const legend = required ? title + '*' : title;
	return <h3>{legend}</h3>;
}


class RegisterProject extends React.Component {
	constructor(props) {
		super(props)

		this.schema = {
			properties: {
				project: {
					type: 'Object',
					title: 'Registra tu projecto',
					properties: props.projectData
				},
				user: {
					type: 'Object',
					title: 'Usuario',
					properties: props.userData
				}
			}
		}

		if(this.props.terms){
			this.schema.properties.terms = {
				type: 'MarkDownCheckbox',
				title: '',
				label: this.props.terms,
				required: true,
				default: false
			}
		}

		this.form = parseDataToForm(this.schema)
		this.form.fields = {
			TitleField: CustomTitleField
		}

		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit({ formData }) {
		request.post('/api/projects/create-with-owner', formData)
			.then((res) => {
				window.location.reload()
			})
	}

	render() {
		return (
			<section className="aside">
				<HTForm ref='form' {...this.form} onSubmit={this.onSubmit} onChange={this.onChange}>
					<button type="submit" className="btn btn-info">Crear proyecto</button>
				</HTForm>
			</section>
		)
	}
}

module.exports = RegisterProject
