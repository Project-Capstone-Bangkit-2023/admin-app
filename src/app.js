const path = require('path')
const express = require('express')
const { engine } = require('express-handlebars')
const morgan = require('morgan')
const { initRouter } = require('./routes')

const app = express()

app.use(morgan('dev'))

app.engine('handlebars', engine({
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views/pages'))
app.use(express.static(path.join(__dirname, '..', 'public')))

initRouter(app)

module.exports = app