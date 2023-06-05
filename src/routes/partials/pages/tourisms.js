const { Router } = require('express')
const { getTourisms, createTourism } = require('./../../../controllers/web/tourism.controller')
const uploader = require('./../../../utils/uploader')

const router = Router()

router.get('/', getTourisms)
router.post('/', uploader.single('file'), createTourism)

module.exports = router