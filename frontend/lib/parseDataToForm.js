const _ = require('underscore')

function parseDataToSchemaForm(data){
	const props = {}
	const required = []

	_.each(data.properties, function(data, key){
		if(data.required){
			required.push(key)
		}

		if (data.type === 'Object') {
			props[key] = parseDataToSchemaForm(data)
			return
		}

		props[key] = {
			type: 'string',
			title: data.title || key,
			description: data.description,
			format: data.format,
			options: data.options
		}

		if (data.type === 'Date') {
			props[key].format = 'date'
		}

		if (data.type === 'DateTime') {
			props[key].format = 'date-time'
		}

		if (data.type === 'Select') {
			props[key].enum = data.enum
			props[key].enumNames = data.enumNames
		}

		if (data.type === 'Array') {
			props[key].type = 'array'
			props[key].items = data.items
			props[key].uniqueItems = true
		}

		if (data.type === 'Slider') {
			props[key] = {
				title: data.title,
				type: 'number',
				minimum: data.minNum,
				maximum: data.maxNum,
				step: data.step
			}
		}

		if (data.type === 'Boolean') {
			props[key].type = 'boolean'
		}

		if (data.type === 'File') {
			props[key].type = 'string'
			props[key].format = 'data-url'
		}

		if (data.type === 'MarkDownCheckbox') {
			props[key] = {
				type: 'boolean',
				title: data.title,
				label: data.label,
				required: data.required,
				default: data.default
			}
		}		
	})

	return {
		"title": data.title,
		"description": data.description,
		"type": "object",
		"required": required,
		"properties": props
	}
}

function parseDataToUISchemaForm(data){
	const schema = {}

	_.each(data.properties, function(data, key){
		if (data.type === 'Object') {
			schema[key] = parseDataToUISchemaForm(data)
			return
		}

		schema[key] = {}

		if(data.type === 'LongString'){
			schema[key]['ui:widget'] = 'textarea'
		}

		if(data.type === 'Select'){
			schema[key]['ui:widget'] = 'HTSelectWidget'
		}

		if (data.type === 'Slider') {
			schema[key]['ui:widget'] = 'HTRangeWidget'
		}

		if (data.type === 'MarkDownCheckbox') {
			schema[key]['ui:field'] = 'HTMarkDownCheckbox'
		}

		if (data.type === 'MarkDown') {
			schema[key]['ui:widget'] = 'HTMarkDownTextArea'
		}		

		if (data.placeholder) {
			schema[key]['ui:placeholder'] = data.placeholder
		}

		if (data.widget) {
			schema[key]['ui:widget'] = data.widget
		}
	})

	return schema
}

function parseDataToForm(data) {
	return {
		schema: parseDataToSchemaForm(data),
		uiSchema: parseDataToUISchemaForm(data)
	}
}

module.exports = parseDataToForm
