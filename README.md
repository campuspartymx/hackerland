#hacktracker

## Desarollo

Requirimientos:
+ [Node](https://nodejs.org)
+ [MongoDB](https://www.mongodb.com)
+ [Redis](http://redis.io/)

Instalar dependencias
```sh
npm install
```

Iniciar app
```sh
make start
```

## Despliegue

### heroku

Tener una cuenta de heroku e instalar [heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line)

Crear una app en Heroku
```sh
  heroku create
```

Agregar addons
```sh
heroku addons:create mongolab:sandbox
heroku addons:create heroku-redis:hobby-dev
```

Configurar ambiente
```sh
heroku config:set NODE_ENV=production
```

Configuración para dev dependencies
```sh
heroku config:set NPM_CONFIG_PRODUCTION=false
```

Deploy del codigo
```sh
git push heroku master
```

Construir archivos estaticos
```sh
heroku run npm run build
```

Configurar estructura del proyecto
```sh
heroku config:set HACKATHON_STRUCTURE=./data/samples/sw
heroku run node tasks/import-data.js
```

Habilitar correos
```sh
heroku config:set EMAIL_MANDRILL_KEY=XXX
heroku config:set EMAIL_SEND=true
```

Crear usuarios
```sh
heroku run node tasks/create-user.js --email "siedrix@gmail.com" --name "Daniel Zavala" --role "staff" --password "foo123" --isAdmin true
```

### docker
Instalar docker y docker compose https://docs.docker.com/compose/install/

```sh
docker-compose up -d
```

## Configuración
La aplicación funciona mediante configuración, agregar o quitar atributos habilita vistas y funcionalidad. El lugar para agregar, eliminar ó modificar la información esta en `/data`

La configuración inicial contiene:

- `hackaton` Object - Habilita funcionalidades
- `projectData` Object - Información requerida de los equipos participantes
- `userData` Object - Información requerida que se les pedira a los usuarios
- `stages` Array - Etapas del hackathon

### hackathon

- `name` String - Nombre del evento
- `description` Object - Información del evento
  - `welcomeData` Object - Información de la pagina de inicio
- `participants` Boolean - Habilita opción para registro de equipos
- `verticals` Array - De agregarse habilita verticales
- `mentors` Boolean - Habilita mentores y mentorias
- `mentorSkills` Array - Habilidades de los mentores

### projectData
Información que se necesita de los projectos, ejemplo:
```javascript
{
  name: {
    type: 'String',
    title: 'Nombre',
    required: true,
    placeholder: 'Nombre del Proyecto'
  },
  description: {
    type: 'String',
    title: 'Descripción',
    required: true,
    placeholder: 'En una frase describe que quieres lograr'
  }
}
```


### userData
Información que se necesita de los usuarios, ejemplo:
```javascript
{
  name: {
    type: 'String',
    title: 'Nombre',
    required: true,
    placeholder: 'Nombre'
  },
  email: {
    type: 'String',
    format: 'email',
    title: 'Correo Electronico',
    required: true,
    placeholder: 'Correo Electronico'
  },
  birthday: {
    type: 'Date',
    title: 'Fecha de Nacimiento',
    required: true
  }
}
```

### stages
Las etapas definen lo que se va a habilitar durante el evento

- `description` Object - Información de la etapa
- `registrationActive` Boolean - El registro de equipos esta activo
- `review` Object - Información que se necesita de los equipos acerca de sus projectos
- `evaluation` Array - Metricas


## Tipos de datos

`String` - input
`Slider` slider
`Date` data
`LongString` textarea
`Select` - select
`Array`

