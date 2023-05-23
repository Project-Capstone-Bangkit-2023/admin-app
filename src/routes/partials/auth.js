const loginGuardMiddleware = require('./../../middlewares/login-guard')
const { index, login, logout } = require('./../../controllers/auth.controller')

module.exports = app => {
  app.get('/auth/login', index)
  app.post('/auth/login', login)
  app.get('/auth/logout', logout)
}