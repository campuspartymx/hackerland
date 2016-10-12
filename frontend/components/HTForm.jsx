const React = require('react')
const Form = require('react-jsonschema-form').default
const request = require('../lib/request')
const parseDataToForm = require('../lib/parseDataToForm')
const HTSelectWidget = require('./widgets/HTSelectWidget.jsx')
const HTFileWidget = require('./widgets/HTFileWidget.jsx')
const HTRangeWidget = require('./widgets/HTRangeWidget')
const HTMarkDownCheckbox = require('./widgets/HTMarkDownCheckbox')
const HTMarkDownTextArea = require('./widgets/HTMarkDownTextArea').default
const HTCheckboxesWidget = require('./widgets/HTCheckboxesWidget')

const widgets= {
	HTSelectWidget,
	HTFileWidget,
	HTRangeWidget,
	HTMarkDownCheckbox,
	HTMarkDownTextArea,
	HTCheckboxesWidget
}

class HTForm extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		const fields = this.props.fields || {}
		fields.HTMarkDownCheckbox = HTMarkDownCheckbox

		return (
			<Form
				{...this.props}
				fields={fields}
				widgets={widgets}
				showErrorList={false}
			/>
		)
	}
}

module.exports = HTForm
