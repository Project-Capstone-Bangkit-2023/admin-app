const { Router } = require('express')
const { getUsers } = require('./../../../controllers/web/user.controller')

const router = Router()

router.get('/', getUsers)

module.exports = router