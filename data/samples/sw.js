module.exports = {
	hackathon: {
		name: "Startup weekend",
		description: {
			welcomeData: {
				title: {
					type: 'String',
					required: true,
					title: 'Nombre del evento'
				},
				description: {
					type: 'LongString',
					required: true,
					title: 'Descripción'
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
				}
			}
		},
		participants: false
	},

	projectData: {
		name: {
			type: 'String',
			title: 'Nombre',
			required: true,
			placeholder: 'Nombre del Proyecto'
		},
		description: {
			type: 'LongString',
			title: 'Descripción',
			placeholder: 'En una frase describe que quieres lograr'
		}
	},

	stages: [
		{
			description:{
				name: "main-evaluation",
				label: "Evaluacion de proyectos",
				description: "Esta es la etapa de un SW donde evaluamos los proyectos"
			},
			evaluation: [
				{
					name: "execution",
					title: "Ejecución y Diseño",
					weight: 1,
					placeholder: "",
					helpText: "",
					type: "Slider",
					maxNum: 10,
					minNum: 0,
					step: 0.1,
					required: true
				},
				{
					name: "validation",
					title: "Validación con Clientes",
					weight: 1,
					placeholder: "",
					helpText: "",
					type: "Slider",
					maxNum: 10,
					minNum: 0,
					step: 0.1,
					required: true
				},
				{
					name: "businessModel",
					title: "Modelo de Negocios",
					weight: 1,
					placeholder: "",
					helpText: "",
					type: "Slider",
					maxNum: 10,
					minNum: 0,
					step: 0.1,
					required: true
				},
			],
			data: {
				title: {
					type: 'String',
					title: 'Titulo',
					default: "Evaluación final"
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			},
			staffLayout: {
				type: 'twoColumns',
				content: [
					{name:'projectSearch', type:'ProjectSearch'},
					{name:'projects', type:'ProjectList'}
				],
				sidebar: [
					{
						name:'instructions',
						type:'Alert'
					}
				]
			}
		},
		{
			description:{
				name: "results",
				label: "Presentación de ganadores",
				description: "Esta es la etapa final de un SW donde presentamos los ganadores"
			},
			data: {
				title: {
					type: 'String',
					title: 'Titulo',
					default: "Presentación de resultados"
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}	
			},
			staffLayout: {
				type: 'singleColumn',
				content: [
					{
						name:'instructions',
						type:'Alert'
					}
				]
			}
		}
	]
}
