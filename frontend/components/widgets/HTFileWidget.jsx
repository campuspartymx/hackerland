const React = require('react')

class HTFileWidget extends React.Component {
	constructor() {
		super()

		this.onChange = this.onChange.bind(this)
	}

	onChange(e) {
		const file = e.target.files[0]
		if(!file) return

		const reader = new window.FileReader();
    reader.onload = (event) => {
			this.props.onChange(event.target.result)
    };
    reader.readAsDataURL(file);
	}

	render() {
		const { props } = this
		return (
			<div>
				<img
					src={props.value}
					onClick={() => props.onChange('')}
					className='inputfile-image'
				/>
				<span>
					<input
						type='file'
						name='file'
						id={props.id}
						className='inputfile'
						onChange={this.onChange}
					/>
					<label htmlFor={props.id}>Choose a file</label>
				</span>
			</div>
		)
	}
}

module.exports = HTFileWidget
