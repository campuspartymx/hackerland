const React = require('react')

function Alert({ title, link }) {
	const content = []

	if (link) {
		content.push((
			<a key='title' href={link.url} className='btn btn-lg btn-primary btn-block'>
				{link.title} <span className='fui-arrow-right pull-right'/>
			</a>
		))
	}

	return (
		<div className='alert alert-info'>
			<h4>{title}</h4>
			{content}
		</div>
	)
}

module.exports = Alert
