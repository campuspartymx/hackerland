const React = require('react')

class HTRangeWidget extends React.Component {
	constructor(props){
		super(props)

		this.state = {
			value: props.value || ''
		}

		this.onChange = this.onChange.bind(this)
	}

	onChange(e) {
		const { props } = this
		const value = e.target.value
		const n = Number(value)
		const valid = typeof n === 'number' && !Number.isNaN(n);

		if (!valid || value > props.schema.maximum || value < props.schema.minimum) {
			return
		}

		this.setState({ value })
		this.props.onChange(value)
	}

	render() {
		const { props, state } = this

		return (
			<div className="range-question">
				<div className="range-container">
					<input
						id="range"
						type="range"
						min={props.schema.minimum}
						max={props.schema.maximum}
						onChange={this.onChange}
						step={props.schema.step}
						value={state.value}
					/>
				</div>
				<div className="range-value-container">
					<input
						id="rangeInput"
						type="text"
						required={props.required}
						onChange={this.onChange}
						value={state.value}
					/>
				</div>
			</div>
		);
	}
}

module.exports = HTRangeWidget
