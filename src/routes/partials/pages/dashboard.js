const { Router } = require('express')
const authGuardMiddleware = require('../../../middlewares/auth-guard')

const router = Router()

router.use(authGuardMiddleware)

router.get('/', (req, res) => {
  res.render('dashboard')
})

module.exports = router