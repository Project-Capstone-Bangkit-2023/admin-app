const path = require('path')
const express = require('express')
const { engine } = require('express-handlebars')
const morgan = require('morgan')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const { initRouter } = require('./routes')
const { onRouteNotFound, onGlobalErrorHandler } = require('./utils/handlers')

const app = express()

if (process.env.NODE_ENV == 'production') {
  app.set('trust proxy', 1)
}

const dbString = process.env.DATABASE_URL
const dbHost = dbString.split('@')[1].split(':')[0]
const dbUsername = dbString.split('//')[1].split(':')[0]
const dbPassword = dbString.split('//')[1].split(':')[1].split('@')[0]
const dbPort = dbString.split('//')[1].split(':')[2]
const dbName = dbString.split('//')[1].split(':')[2].split('/')[1]

console.log(dbHost, dbUsername, dbPassword, dbPort, dbName)

const sessionStore = new MySQLStore({
  host: dbHost,
  port: dbPort,
  user: dbUsername,
  password: dbPassword,
  database: dbName
})

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use(morgan('dev'))
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV == 'production'
  }
}))

app.engine('handlebars', engine({
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views/pages'))
app.use(express.static(path.join(__dirname, '..', 'public')))

initRouter(app)

// Handle error page
app.use('*', onRouteNotFound())

// Global error handler
app.use(onGlobalErrorHandler())

module.exports = app