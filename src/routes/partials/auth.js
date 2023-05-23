const { index, login } = require('./../../controllers/auth.controller')

module.exports = app => {
  app.get('/auth/login', index)
  app.post('/auth/login', login)
}