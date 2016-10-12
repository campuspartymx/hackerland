const React = require('react')

function HTSelectWidget(props){
	return (
		<select
			className='input-block'
			defaultValue={props.value}
			onChange={(event) => {
				props.onChange(event.target.value)
			}}
		>
			{props.schema.enum.map((val, i) => (
				<option key={i} value={val}>
					{props.schema.enumNames[i]}
				</option>
			))}
		</select>
	);
}

module.exports = HTSelectWidget
