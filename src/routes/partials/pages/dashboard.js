const { Router } = require('express')
const { index } = require('./../../../controllers/web/dashboard.controller')
const authGuardMiddleware = require('../../../middlewares/auth-guard')

const router = Router()

router.use(authGuardMiddleware)

router.get('/', index)

module.exports = router