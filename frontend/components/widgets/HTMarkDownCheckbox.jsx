const React = require('react')
const ReactMarkdown = require('react-markdown')

function HTMarkDownCheckbox({
	schema,
	id,
	formData,
	required,
	disabled,
	onChange
}) {
	return (
		<div className="fancy-checkbox">
			<label className="checkbox">
				<input type="checkbox"
					id={id}
					data-toggle="checkbox"
					className="custom-checkbox"
					checked={typeof formData === "undefined" ? false : formData}
					required={required}
					disabled={disabled}
					onChange={(event) => onChange(event.target.checked)} />
				<span className="icons">
					<span className="icon-unchecked"></span>
					<span className="icon-checked"></span>
				</span>
				<ReactMarkdown source={schema.label} />
			</label>
		</div>
	);
}

module.exports = HTMarkDownCheckbox