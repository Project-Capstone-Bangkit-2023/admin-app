const { Router } = require('express')
const { index, login, logout } = require('../../../controllers/web/auth.controller')

const router = Router()

router.get('/login', index)
router.post('/login', login)
router.post('/logout', logout)

module.exports = router