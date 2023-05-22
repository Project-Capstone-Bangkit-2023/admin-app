const path = require('path')
const express = require('express')
const { engine } = require('express-handlebars')

const app = express()

app.engine('handlebars', engine({
  layoutsDir: path.join(__dirname, 'views', 'layouts')
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views/pages'))
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req, res) => {
  res.render('dashboard')
})

module.exports = app