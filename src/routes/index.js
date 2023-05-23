const initDashboardRouter = require('./partials/dashboard')
const initAuthRouter = require('./partials/auth')

exports.initRouter = app => {

  // Dashboard router
  initAuthRouter(app)
  initDashboardRouter(app)

}