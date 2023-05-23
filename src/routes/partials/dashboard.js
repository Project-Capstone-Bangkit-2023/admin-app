const authGuardMiddleware = require('./../../middlewares/auth-guard')

module.exports = app => {

  app.use(authGuardMiddleware)

  app.get('/', (req, res) => {
    res.render('dashboard')
  })
}