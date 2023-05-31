const { Router } = require('express')
const { getTourisms, createTourism } = require('./../../../controllers/web/tourism.controller')

const router = Router()

router.get('/', getTourisms)
router.post('/', createTourism)

module.exports = router