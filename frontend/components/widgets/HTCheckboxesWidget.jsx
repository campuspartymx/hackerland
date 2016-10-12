const React = require('react')

class HTCheckboxesWidget extends React.Component {
	constructor(props) {
		super()

		this.state = {
			value: props.value ? props.value.split(',') : []
		}

		this.onChange = this.onChange.bind(this)
	}

	onChange(e) {
		let { value } = this.state
		if (e.target.checked) {
			value.push(e.target.value)
		} else {
			value = value.filter((v) => v !== e.target.value)
		}

		this.setState({ value })
		this.props.onChange(value.join(','))
	}

	render() {
		const { items } = this.props.schema.options
		const { id} = this.props
		const { value } = this.state

		return (
			<div>
				{(items || []).map((item, i) => (
					<label className="checkbox" key={i}>
						<input
							name={`${id}-${i}`}
							type="checkbox"
							data-toggle="checkbox"
							className="custom-checkbox"
							defaultValue={item}
							checked={value.indexOf(item) !== -1}
							onChange={this.onChange}
						/>
						<span className="icons">
							<span className="icon-unchecked"></span>
							<span className="icon-checked"></span>
						</span>
						<strong>{item}</strong>
					</label>
				))}
			</div>
		)
	}
}

module.exports  = HTCheckboxesWidget
