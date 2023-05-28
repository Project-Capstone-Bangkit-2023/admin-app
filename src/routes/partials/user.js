const authGuardMiddleware = require('./../../middlewares/auth-guard')

module.exports = app => {

  app.use(authGuardMiddleware)

  app.get('/users', (req, res) => {
    res.render('user')
  })
}