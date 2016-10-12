const registrationStage = {
	description:{
		name: "registration",
		label: "Registro de proyectos",
		description: "Esta es la etapa de registro de projectos",
	},
	registrationActive: true,
	data: {
		content: {
			type: 'Object',
			title: 'Bienvenida a participantes',
			properties: {
				// Current stage widget
				title: {
					type: 'String',
					title: 'Titulo',
					default: "Etapa actual"
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			}
		},

		verticalListDescription:{
			type: 'MarkDown',
			title: 'instructions para elegir vertical',
		},

		currentStage: {
			type: 'Object',
			title: 'Etapa actual',
			properties: {
				title: {
					type: 'String',
					title: 'Titulo',
					default: "Etapa actual"
				},
				subtitle: {
					type: 'String',
					title: 'Subtitilo',
					default: ""
				},
				endLabel: {
					type: 'String',
					title: 'Terminacion',
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			}
		},

		nextStage: {
			type: 'Object',
			title: 'Siguiente',
			properties: {
				title: {
					type: 'String',
					title: 'Titulo etapa siguiente',
					default: "Etapa siguiente"
				},
				subtitle: {
					type: 'String',
					title: 'Subtitilo etapa siguiente',
					default: ""
				},
				endlabel: {
					type: 'String',
					title: 'Terminacion de la etapa siguiente',
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			}
		},

		staffInfo: {
			type: 'Object',
			title: 'Informacion para jueces',
			properties: {
				title: {
					type: 'String',
					title: 'Titulo',
					default: "Registro de projectos"
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			}
		}
	},
	projectLayout: {
		type: 'twoColumns',
		sidebar: [
			{
				name:'currentstage',
				type:'CurrentStage',
				data:':currentStage'
			},
			{
				name:'nextstage',
				type:'NextStage',
				data:':nextStage'
			},
			{
				name:'tips',
				type:'Tips',
			}
		],
		content: [
			{
				name:'welcomeBox',
				type:'ContentBox',
				data:':content'
			},
			{
				name: 'projectTeam',
				type: 'ProjectTeam'
			},			
			{
				name:'verticalList',
				type:'VerticalList',
				data: {
					description: ':verticalListDescription'
				}
			}
		]
	},
	staffLayout: {
		type: 'singleColumn',
		content: [
			{
				name:'instructions',
				type:'Alert',
				data:':staffInfo'
			}
		]
	}
}

const submitDataStage = {
	description:{
		name: "submit-data",
		label: "Entrega de proyectos",
		description: "En esta etapa los equipos entregan la informacion de su proyecto"
	},
	data: {
		content: {
			type: 'Object',
			title: 'Bienvenida a participantes',
			properties: {
				title: {
					type: 'String',
					title: 'Titulo',
					default: "Etapa actual"
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			}
		},

		evaluation: {
			type: 'Object',
			title: 'Recordatorio de evaluacion',
			properties: {
				text: {
					type: 'String',
					title: 'Titulo',
					default: "Inicia tu sesión de Evaluación"
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				},
				textSuccess: {
					type: 'String',
					title: 'Titulo de evaluación enviada',
					default: "Evaluación enviada"
				},
				descriptionSuccess: {
					type: 'MarkDown',
					title: 'Intrucciónes de la evaluación enviada',
				}
			}
		},		

		verticalListDescription:{
			type: 'MarkDown',
			title: 'instructions para elegir vertical',
		},

		currentStage: {
			type: 'Object',
			title: 'Etapa actual',
			properties: {
				// Current stage widget
				title: {
					type: 'String',
					title: 'Titulo',
					default: "Etapa actual"
				},
				subtitle: {
					type: 'String',
					title: 'Subtitilo',
					default: ""
				},
				endLabel: {
					type: 'String',
					title: 'Terminacion',
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			}
		},

		// Next stage widget
		nextStage: {
			type: 'Object',
			title: 'Siguiente',
			properties: {
				title: {
					type: 'String',
					title: 'Titulo etapa siguiente',
					default: "Etapa siguiente"
				},
				subtitle: {
					type: 'String',
					title: 'Subtitilo etapa siguiente',
					default: ""
				},
				endlabel: {
					type: 'String',
					title: 'Terminacion de la etapa siguiente',
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			}
		},

		staffInfo: {
			type: 'Object',
			title: 'Informacion para jueces',
			properties: {
				title: {
					type: 'String',
					title: 'Titulo',
					default: "Entrega de proyectos"
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			}
		}
	},
	projectLayout: {
		type: 'twoColumns',
		sidebar: [
			{
				name:'currentstage',
				type:'CurrentStage',
				data:':currentStage'
			},
			{
				name:'nextstage',
				type:'NextStage',
				data:':nextStage'
			},
			{
				name:'tips',
				type:'Tips',
			}
		],
		content: [
			{
				name:'welcomeBox',
				type:'ContentBox',
				data:':content'
			},
			{
				name: 'review',
				type: 'ReviewAlert',
				data:':evaluation'
			},
			{
				name: 'projectTeam',
				type: 'ProjectTeam'
			},			
			{
				name:'verticalList',
				type:'VerticalList',
				data: {
					description: ':verticalListDescription'
				}
			}			
		]
	},
	staffLayout: {
		type: 'singleColumn',
		content: [
			{
				name:'instructions',
				type:'Alert',
				data:':staffInfo'
			}
		]
	},
	review: {
		name: 'first-information',
		title: 'Información de proyecto',
		type: 'Object',
		properties: {
			description: {
				type: 'Object',
				title: 'Proyecto',
				properties: {
					'1': {
						type: 'LongString',
						title: 'Descripción corta del proyecto',
						description: 'En una frase, describe en qué consiste el proyecto a desarrollar durante el hackatón.'
					},
					'2': {
						type: 'LongString',
						title: 'Problemática que soluciona',
						description: 'Describe qué problemática relacionada con la pobreza soliciona'
					},
					'3': {
						type: 'LongString',
						title: '¿Cómo resuelve la problemática?',
						description: 'Describe en un párrafo como piensas resolver está problemática.'
					}
				}
			},
			impact: {
				type: 'Object',
				title: 'Impacto',
				description: 'Trascendencia (¿busca resolver problemas importantes?), alcance (número de personas que pueden ser beneficiadas) y escalabilidad de la propuesta (¿es replicable?, ¿se puede crecer?).',
				properties: {
					'1': {
						type: 'Select',
						title: '¿Cómo resuelve la problemática?',
						enum: ['', '1k a 100k', '100k a 1m'],
						enumNames: ['', '1k a 100k', '100k a 1m']
					},
					'2': {
						type: 'LongString',
						title: 'Justificación de impacto',
						description: 'Justifica el impacto que busca lograr tu proyecto.'
					},
					'3': {
						type: 'LongString',
						title: 'Fuentes de impacto',
						description: '¿Que fuentes validan el número de personas a las que impacta?'
					}
				}
			},
			execution: {
				type: 'Object',
				title: 'Ejecución',
				description: 'Calidad y relevancia de los resultados. ¿Funciona tu solución al demostrarla a los jueces? ¿Cumple con lo que prometió de manera fluida y sin errores?',
				properties: {
					'1': {
						type: 'String',
						title: 'Elige el tipo de entregable para el hackatón.',
						widget: 'HTCheckboxesWidget',
						options: {
							items: ['Móvil', 'IoT/Hardware', 'Data Science', 'WebApp/APIs', 'Social business', 'Video Juegos VR/AR', 'Ciudades Inteligentes', 'Salud y Biotecnología', 'Otros']
						}
					},
					'2': {
						type: 'LongString',
						title: 'Describe claramente cómo funcionara el entregable de la solución propuesta.'
					},
					'3': {
						type: 'LongString',
						title: '¿Qué tecnologías vas a utilizar?, Incluye lenguajes, frameworks, herramientas, SDKs, APIS, etc.'
					},
					'4': {
						type: 'LongString',
						title: 'Describe qué tenías ya hecho previo al hackatón. Drones, frameworks, codekits, hardware especializado, algoritmos.'
					},
					'5': {
						type: 'LongString',
						title: '¿Qué vas a crear durante hackatón?',
						description: 'Específicamente que estás desarrollando durante el hackatón. (En caso de ser una ampliación de un proyecto, se espécifico sobre lo que estás desarrollando durante el hackatón, recuerda que habrá una revisión técnica.)'
					},
					'6': {
						type: 'LongString',
						title: 'Propón el flujo de la solución',
						description: 'Te recomendamos hacer un diagrama en papel, tomale una foto, subirla a Internet y agregar el link.'
					}
				}
			},
			design: {
				type: 'Object',
				title: 'Diseño',
				description: 'Creatividad, originalidad, funcionalidad y experiencia de usuario propuesta. ¿La solución es fácil de utilizar por el segmento de la población a la que busca servir?',
				properties: {
					'1': {
						type: 'String',
						title: 'Describe a los usuarios',
						description: 'Haz una descripción detallada de los usuarios que se verán beneficiados por la solución propuesta.'
					},
					'2': {
						type: 'String',
						title: 'Edad de tus usuarios',
						widget: 'HTCheckboxesWidget',
						options: {
							items: ['Niños', 'Adolescentes', 'Adultos', 'Adultos Mayores']
						}
					},
					'3': {
						type: 'String',
						title: 'Sexo de tus usuarios',
						widget: 'HTCheckboxesWidget',
						options: {
							items: ['Hombre', 'Mujer', 'LGBT', 'Otro']
						}
					},
					'4': {
						type: 'String',
						title: 'Tipo de situación geográfica',
						widget: 'HTCheckboxesWidget',
						options: {
							items: ['Nacional', 'Estatal', 'Local']
						}
					},
					'5': {
						type: 'LongString',
						title: '¿Dónde resuelve está problematica?',
						description: 'En que localidad o ubición geográfica has probado tu idea'
					},
					'6': {
						type: 'LongString',
						title: '¿Cómo van a acceder a tu solución tus usuarios?'
					},
					'7': {
						type: 'LongString',
						title: '¿Como validaste que tus usuarios potenciales tendrán acceso a la solución?'
					}
				}
			},
			viability: {
				type: 'Object',
				title: 'Viabilidad',
				description: 'Es factible la ejecución de tu solución.',
				properties: {
					'1': {
						type: 'LongString',
						title: '¿Cuál es la mayor limitante para resolver este problema?'
					},
					'2': {
						type: 'LongString',
						title: '¿Cómo vas a resolver esta(s) limitante(s)?'
					},
					'3': {
						type: 'LongString',
						title: '¿Qué experiencia tiene el equipo para realizar este proyecto?'
					},
					'4': {
						type: 'LongString',
						title: '¿Que actores/aliados necesitas para que este proyecto se lleve a cabo?'
					}
				}
			}
		}
	}
}

const evaluationDataStage = {
	description:{
		name: "main-evaluation",
		label: "Evaluacion de proyectos",
		description: "Esta es la etapa final de un SW donde evaluamos los proyectos y damos los ganadores"
	},
	evaluation: [
		{
			name: "execution",
			label: "Ejecución y Diseño",
			weight: 1,
			placeholder: "",
			helpText: "",
			type: "Slider",
			maxNum: 10,
			minNum: 0,
			step: 0.1
		},
		{
			name: "validation",
			label: "Validación con Clientes",
			weight: 1,
			placeholder: "",
			helpText: "",
			type: "Slider",
			maxNum: 10,
			minNum: 0,
			step: 0.1
		},
		{
			name: "businessModel",
			label: "Modelo de Negocios",
			weight: 1,
			placeholder: "",
			helpText: "",
			type: "Slider",
			maxNum: 10,
			minNum: 0,
			step: 0.1
		}
	],
	data: {
		projectInfo: {
			type: 'Object',
			title: 'Informacion para particiapntes',
			properties: {
				title: {
					type: 'String',
					title: 'Titulo',
					default: "Evaluacion de proyectos"
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			}
		},
		staffInfo: {
			type: 'Object',
			title: 'Informacion para jueces',
			properties: {
				title: {
					type: 'String',
					title: 'Titulo',
					default: "Evaluacion de proyectos"
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción',
				}
			}
		}
	},
	projectLayout: {
		type: 'singleColumn',
		content: [
			{
				name:'instructions',
				type:'Alert',
				data:':projectInfo'
			}
		]
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
				type:'Alert',
				data:':staffInfo'
			}
		]
	}
}

const resultsStage = {
	description:{
		name: "results",
		label: "Premiacion de proyectos",
		description: "En esta etapa los equipos premiaran a los equipos ganadores"
	},
	data: {
		qualifyAlert: {
			type: 'Object',
			title: 'Equipos que pasaron la ronda de evaluacion',
			properties: {
				title: {
					type: 'String',
					title: 'Titulo',
					default: 'Equipos que pasaron a esta ronda'
				},
				description: {
					type: 'MarkDown',
					title: 'Descripción'
				}
			}
		},
	},
	projectLayout: {
		type: 'singleColumn',
		content: [
			{
				name:'qualifyAlert',
				type:'QualifyAlert',
				data: ':qualifyAlert'
			}
		]
	},
	staffLayout: {
		type: 'singleColumn',
		content: [
			{
				name:'projectList',
				type:'QualifyList',
				data: ':qualifyAlert'
			}
		]
	}
}

module.exports = {
	hackathon: {
		name: "",
		description: {
			welcomeData : {
				reviewTitle: {
					type: 'String',
					required: true,
					title: 'Titulo en evaluación de proyectos'
				},
				reviewInstructions: {
					type: 'MarkDown',
					required: true,
					title: 'Instrucciones en evaluación de proyectos'
				},				
			}
		},
		participants: true,
		hasVerticals: true
	},
	userData: {
		name: {
			type: "String",
			title: "Nombre",
			required: true,
			placeholder: "Nombre"
		},
		email: {
			type: "String",
			format: "email",
			title: "Correo Electronico",
			required: true,
			placeholder: "Correo Electronico"
		},
		password: {
			type: "String",
			widget: "password",
			title: "Contraseña",
			placeholder: "Contraseña",
			required: true
		}
	},
	projectData: {
		name: {
			type: "String",
			title: "Nombre",
			required: true,
			placeholder: "Nombre del Proyecto"
		},
		description: {
			type: "LongString",
			title: "Descripción",
			required: true,
			placeholder: "En una frase describe que quieres lograr"
		}
	},
	stages: [
		registrationStage,
		submitDataStage,
		evaluationDataStage,
		resultsStage
	]
}
