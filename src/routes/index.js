const dashboardRouter = require('./partials/pages/dashboard')
const authRouter = require('./partials/pages/auth')
const authApiRouter = require('./partials/api/auth')
const tourismApiRouter = require('./partials/api/tourism')
const categoryApiRouter = require('./partials/api/category')
const profileApiRouter = require('./partials/api/profile')
const tourismRouter = require('./partials/pages/tourisms')
const userRouter = require('./partials/pages/user')

exports.initRouter = app => {
  app.use('/auth', authRouter)
  app.use('/', dashboardRouter)

  app.use('/tourisms', tourismRouter)
  app.use('/users', userRouter)

  // API Routes
  app.use('/api/v1/auth', authApiRouter)
  app.use('/api/v1/categories', categoryApiRouter)
  app.use('/api/v1/tourisms', tourismApiRouter)
  app.use('/api/v1/profile', profileApiRouter)
}