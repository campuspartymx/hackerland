module.exports = {
	hackathon: {
		name: "Hackathon campus party",
		description: {
			welcomeData : {
				title: {
					type: 'String',
					required: true,
					title: 'Nombre del evento'
				},
				description: {
					type: 'MarkDown',
					required: true,
					title: 'Descripción'
				},
				sidebar: {
					type: 'MarkDown',
					required: true,
					title: 'Contenido del sidebar'
				},
				logo: {
					type: 'File',
					required: false,
					title: 'Logo',
					widget: 'HTFileWidget'
				},
				banner: {
					type: 'File',
					required: false,
					title: 'Banner',
					widget: 'HTFileWidget'
				},
				sorry: {
					type: 'MarkDown',
					title: 'Texto para los equipos eliminados'
				},
				terms: {
					type: 'MarkDown',
					title: 'Terminos y condiciones'
				}
			}
		}
	}
}
