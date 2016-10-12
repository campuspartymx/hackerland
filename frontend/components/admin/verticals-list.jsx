const _ = require('lodash')

const React = require('react')
const ReactMarkdown = require('react-markdown')


class VerticalList extends React.Component {
	render() {
		return (
			<div className='panel panel-default'>
				<div className='panel-heading'>
					<h3 className='panel-title'>Verticales</h3>
				</div>
				<div className='panel-body'>
					<table className="table table-bordered table-hover table-striped table-container">
						<thead>
							<tr>
								<th key="nombre">Nombre</th>
								<th key="description">Descripción</th>
							</tr>
						</thead>
						<tbody>
							{this.props.verticals.map( (vertical) => {
								const verticalUri = '/admin/verticals/'+ vertical.uuid

								return <tr key={vertical.uuid}>
									<th key="project"><a href={verticalUri}>{vertical.name}</a></th>
									<th key="total">
										{ vertical.description &&
											<ReactMarkdown source={vertical.description} />
										}
									</th>
								</tr>
							})}
						</tbody>
					</table>					
				</div>
			</div>
		)
	}
}

module.exports = VerticalList
