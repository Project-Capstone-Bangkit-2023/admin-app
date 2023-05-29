const dashboardRouter = require('./partials/pages/dashboard')
const authRouter = require('./partials/pages/auth')
const tourismRouter = require('./partials/api/tourism')

exports.initRouter = app => {
  app.use('/auth', authRouter)
  app.use('/', dashboardRouter)
  
  // API Routes
  app.use('/api/v1/tourisms', tourismRouter)
}