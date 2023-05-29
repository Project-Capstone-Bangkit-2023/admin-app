const dashboardRouter = require('./partials/pages/dashboard')
const authRouter = require('./partials/pages/auth')
const tourismApiRouter = require('./partials/api/tourism')
const authApiRouter = require('./partials/api/auth')

exports.initRouter = app => {
  app.use('/auth', authRouter)
  app.use('/', dashboardRouter)

  // API Routes
  app.use('/api/v1/tourisms', tourismApiRouter)
  app.use('/api/v1/auth', authApiRouter)
}