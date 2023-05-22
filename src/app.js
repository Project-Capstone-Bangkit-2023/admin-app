const path = require('path')
const express = require('express')
const { engine } = require('express-handlebars')

const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req, res) => {
  res.render('pages/dashboard')
})

module.exports = app